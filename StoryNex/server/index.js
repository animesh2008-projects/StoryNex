import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50kb' }));

// In-memory rate limiting map
// 5 req/min for chapter generation, 10 req/min for dialogue
const rateLimitStore = new Map();

function rateLimit(limitCount, windowMs = 60000) {
  return (req, res, next) => {
    const clientKey = req.headers['authorization'] || req.ip || 'anonymous';
    const now = Date.now();
    const clientData = rateLimitStore.get(clientKey) || [];
    
    // Filter out old timestamps
    const recent = clientData.filter(time => now - time < windowMs);
    if (recent.length >= limitCount) {
      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMITED',
          message: `Rate limit exceeded. Maximum ${limitCount} requests per minute allowed.`
        }
      });
    }
    recent.push(now);
    rateLimitStore.set(clientKey, recent);
    next();
  };
}

// Validation schemas with Zod
const GenerateChapterSchema = z.object({
  story: z.object({
    id: z.string(),
    ownerId: z.string().optional(),
    title: z.string(),
    premise: z.string(),
    genre: z.string(),
    writingStyle: z.string(),
  }),
  objective: z.string().optional(),
  characters: z.array(z.any()).default([]),
  previousChapter: z.any().optional(),
  memories: z.array(z.any()).default([]),
  branch: z.any().optional(),
  userInstructions: z.string().optional(),
  length: z.enum(['short', 'medium', 'long']).optional(),
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'STORYNEX Narrative Intelligence API', version: '1.0.0' });
});

// POST /api/v1/generate-chapter
app.post('/api/v1/generate-chapter', rateLimit(5), async (req, res) => {
  try {
    const parsed = GenerateChapterSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ARGUMENT',
          message: 'Invalid request payload.',
          details: parsed.error.issues,
        }
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        success: false,
        error: {
          code: 'AI_PROVIDER_ERROR',
          message: 'Server Gemini API key is not configured in backend environment.'
        }
      });
    }

    const { story, objective, characters, previousChapter, memories, branch, userInstructions, length } = parsed.data;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        responseMimeType: 'application/json'
      }
    });

    const charactersContext = (characters || []).map(c => 
      `• ${c.name} (${c.role}): Motivation: ${c.motivation}. Fears: ${(c.fears || []).join(', ')}. Dialogue: ${c.dialogueStyle}`
    ).join('\n');

    const prompt = `
SYSTEM: You are STORYNEX, an intelligent narrative co-writer.
Write a chapter draft that advances the story while strictly observing established character psychology and story facts.

Premise: "${story.premise}"
Genre: ${story.genre}
Writing Style: ${story.writingStyle}
Chapter Objective: "${objective || 'Advance the core plot'}"
Target Length: ${length || 'medium'}

Characters:
${charactersContext || 'None specified'}

Previous Chapter Summary:
${previousChapter?.summary || 'None'}

Branch Context:
${branch ? branch.choiceText : 'Main Canon Storyline'}

User Instructions:
${userInstructions || 'Preserve atmospheric tension.'}

Return JSON with keys: title, content, summary, continuityNotes, unresolvedThreads.
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(cleanJson);

    return res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Backend generate-chapter error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || 'An unexpected error occurred during generation.'
      }
    });
  }
});

// POST /api/v1/generate-dialogue
app.post('/api/v1/generate-dialogue', rateLimit(10), async (req, res) => {
  try {
    const { speaker, text, listener } = req.body;
    if (!speaker || !text) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_ARGUMENT', message: 'Speaker and dialogue text are required.' }
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        success: false,
        error: { code: 'AI_PROVIDER_ERROR', message: 'Gemini API key is not configured.' }
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Rewrite this dialogue line for ${speaker.name} (${speaker.dialogueStyle}): "${text}". Provide 2 distinct variations.`;
    const result = await model.generateContent(prompt);

    return res.json({
      success: true,
      data: { rewritten: result.response.text() }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

app.listen(PORT, () => {
  console.log(`STORYNEX Backend API running on port ${PORT}`);
});
