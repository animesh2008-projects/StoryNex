import { Story, Chapter, Character, StoryMemory, StoryBranch, GeneratedChapterDraft } from '../types';
import { GoogleGenerativeAI } from '@google/generative-ai';

const AI_SETTINGS_KEY = 'storynex_ai_settings';

export interface AISettingsConfig {
  apiKey: string;
  model: string;
  temperature: number;
}

export function getAISettings(): AISettingsConfig {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY || "";
  const stored = localStorage.getItem(AI_SETTINGS_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return {
        apiKey: parsed.apiKey || envKey,
        model: parsed.model || 'gemini-1.5-flash',
        temperature: parsed.temperature ?? 0.7,
      };
    } catch {
      // fallback
    }
  }
  return {
    apiKey: envKey,
    model: 'gemini-1.5-flash',
    temperature: 0.7,
  };
}

export function saveAISettings(settings: Partial<AISettingsConfig>) {
  const current = getAISettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(updated));
}

// 8-Factor Context Assembly
export interface GenerationContextParams {
  story: Story;
  objective: string;
  characters: Character[];
  previousChapter?: Chapter | null;
  memories: StoryMemory[];
  branch?: StoryBranch | null;
  userInstructions?: string;
  length?: 'short' | 'medium' | 'long';
}

export function build8FactorPrompt(params: GenerationContextParams): string {
  const {
    story,
    objective,
    characters,
    previousChapter,
    memories,
    branch,
    userInstructions,
    length = 'medium'
  } = params;

  const charactersContext = characters.map(c => 
    `• ${c.name} (${c.role}):
   - Motivation: ${c.motivation}
   - Personality: ${c.personality.join(', ')}
   - Fears: ${c.fears.join(', ')}
   - Dialogue Style: ${c.dialogueStyle}
   - Relationships: ${c.relationships.map(r => `${r.characterName} (${r.description})`).join('; ')}`
  ).join('\n\n');

  const importantFacts = memories
    .filter(m => m.importance >= 3)
    .slice(0, 10)
    .map(m => `• [${m.type.toUpperCase()}] ${m.title ? m.title + ': ' : ''}${m.content}`)
    .join('\n');

  return `
SYSTEM ROLE:
You are STORYNEX, an intelligent narrative co-writer and universe architect.
You preserve established story continuity, character psychology, and world rules.
The author retains complete creative control.

--- NARRATIVE CONTEXT (8-FACTOR SYSTEM) ---

UNIVERSE / STORY: "${story.title}"

1. STORY PREMISE:
"${story.premise}"

2. GENRE & WRITING STYLE:
Genre: ${story.genre}
Writing Style: ${story.writingStyle}

3. CHAPTER OBJECTIVE:
"${objective || 'Advance the core plot while intensifying character tension'}"
Target Word Length: ${length === 'short' ? '300-500 words' : length === 'long' ? '900-1400 words' : '600-800 words'}

4. ACTIVE CHARACTERS & PSYCHOLOGY:
${charactersContext || 'No specific characters specified. Adhere to story premise.'}

5. PREVIOUS CHAPTER CONTINUITY:
${previousChapter ? `Previous Title: "${previousChapter.title}"\nPrevious Summary: ${previousChapter.summary || 'Summary unavailable.'}` : 'This is Chapter 1 / Opening Scene.'}

6. ESTABLISHED STORY FACTS & LORE:
${importantFacts || 'No established facts recorded yet.'}

7. NARRATIVE BRANCH CONTEXT:
${branch ? `Branch Decision: "${branch.choiceText}" (${branch.label})` : 'Main Canon Storyline.'}

8. AUTHOR'S SPECIFIC INSTRUCTIONS:
"${userInstructions || 'Preserve atmospheric tension and show, don\'t tell.'}"

--- STRICT OUTPUT FORMAT ---
You MUST return a valid JSON object strictly matching this schema with NO markdown fences, or wrapped in a single \`\`\`json block:
{
  "title": "Evocative Chapter Title",
  "content": "Rich prose with dialogue and narrative beats...",
  "summary": "Concise 2-3 sentence summary of what occurred in this chapter.",
  "continuityNotes": ["Key continuity anchor observed", "Character choice aligned with fear"],
  "unresolvedThreads": ["Open question 1", "Subtle anomaly discovered"],
  "extractedFacts": [
    {
      "type": "world_fact",
      "content": "A concrete fact revealed in this scene",
      "importance": 4
    }
  ]
}
`.trim();
}

export const aiService = {
  async generateChapter(params: GenerationContextParams): Promise<GeneratedChapterDraft> {
    const settings = getAISettings();
    
    // First try backend proxy if available
    try {
      const res = await fetch('/api/v1/generate-chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch {
      // Backend not running on same port, fallback to direct client call if key configured
    }

    if (!settings.apiKey) {
      throw new Error(
        "Gemini API key is not configured. Please open Settings (or the API Key banner) and paste your Google Gemini API key to activate AI generation."
      );
    }

    const genAI = new GoogleGenerativeAI(settings.apiKey);
    const model = genAI.getGenerativeModel({ 
      model: settings.model || 'gemini-1.5-flash',
      generationConfig: {
        temperature: settings.temperature,
        responseMimeType: "application/json",
      }
    });

    const prompt = build8FactorPrompt(params);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    try {
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return {
        title: parsed.title || "Untitled Chapter",
        content: parsed.content || "",
        summary: parsed.summary || "",
        continuityNotes: parsed.continuityNotes || [],
        unresolvedThreads: parsed.unresolvedThreads || [],
        extractedFacts: parsed.extractedFacts || []
      };
    } catch {
      return {
        title: "Generated Chapter",
        content: responseText,
        summary: "Scene drafted by STORYNEX co-writer.",
        continuityNotes: ["Direct prose format returned"],
        unresolvedThreads: []
      };
    }
  },

  async continueScene(existingContent: string, story: Story, characters: Character[]): Promise<string> {
    const settings = getAISettings();
    if (!settings.apiKey) {
      throw new Error("Gemini API key is required to continue scene. Please configure it in Settings.");
    }
    const genAI = new GoogleGenerativeAI(settings.apiKey);
    const model = genAI.getGenerativeModel({ model: settings.model });

    const prompt = `
You are STORYNEX co-writer. Continue the following scene seamlessly in the established style (${story.writingStyle}):
Existing Scene:
"""
${existingContent.slice(-1500)}
"""

Active Characters:
${characters.map(c => `${c.name}: ${c.dialogueStyle}`).join('\n')}

Task: Write the next 2-3 paragraphs continuing the immediate dramatic beat. Do not summarize or repeat what was written. Output raw prose only.
`;
    const res = await model.generateContent(prompt);
    return res.response.text().trim();
  },

  async improveDialogue(selectedText: string, speaker: Character, listener?: Character): Promise<string> {
    const settings = getAISettings();
    if (!settings.apiKey) {
      throw new Error("Gemini API key required for dialogue enhancement.");
    }
    const genAI = new GoogleGenerativeAI(settings.apiKey);
    const model = genAI.getGenerativeModel({ model: settings.model });

    const prompt = `
Refine this dialogue line for ${speaker.name}.
Speaker voice: "${speaker.dialogueStyle}".
Speaker motivation: "${speaker.motivation}".
Speaker fears: "${speaker.fears.join(', ')}".
${listener ? `Speaking to: ${listener.name} (${listener.role})` : ''}

Original line:
"${selectedText}"

Task: Rewrite this line into 2 alternative polished deliveries matching ${speaker.name}'s voice and subtext. Output each option clearly numbered.
`;
    const res = await model.generateContent(prompt);
    return res.response.text().trim();
  },

  async generateCharacterProfile(promptConcept: string, storyGenre: string): Promise<Partial<Character>> {
    const settings = getAISettings();
    if (!settings.apiKey) {
      throw new Error("Gemini API key is required to generate character profiles.");
    }
    const genAI = new GoogleGenerativeAI(settings.apiKey);
    const model = genAI.getGenerativeModel({ 
      model: settings.model,
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
Generate a rich, three-dimensional character profile for a story in the "${storyGenre}" genre.
Concept: "${promptConcept}"

Return a JSON object with:
{
  "name": "Full Name",
  "role": "Archetype / Job in story",
  "personality": ["trait 1", "trait 2", "trait 3", "flaw"],
  "background": "2 sentence origin story",
  "motivation": "Core driving desire",
  "goals": ["Immediate goal", "Long-term ambition"],
  "fears": ["Deep vulnerability / psychological fear"],
  "dialogueStyle": "Description of their unique cadence, vocabulary, and verbal habits",
  "developmentNotes": "Narrative arc notes for future chapters"
}
`;
    const res = await model.generateContent(prompt);
    const text = res.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  },

  async summarizeChapter(content: string): Promise<string> {
    const settings = getAISettings();
    if (!settings.apiKey) {
      throw new Error("Gemini API key is required for chapter summarization.");
    }
    const genAI = new GoogleGenerativeAI(settings.apiKey);
    const model = genAI.getGenerativeModel({ model: settings.model });

    const prompt = `
Summarize the following chapter content into a concise, 2-3 sentence narrative memory log for future context retrieval. Focus on concrete character decisions, key revelations, and consequences:

"""
${content.slice(0, 5000)}
"""
`;
    const res = await model.generateContent(prompt);
    return res.response.text().trim();
  }
};
