import React, { useState } from 'react';
import { useStory } from '../../context/StoryContext';
import { aiService, getAISettings } from '../../services/ai-service';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  Sparkles, 
  Wand2, 
  MessageSquare, 
  PenTool, 
  Lightbulb, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Cpu,
  Layers,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';

export const AIAssistantPage: React.FC = () => {
  const { currentStory, characters, memories, chapters } = useStory();
  const [activeTool, setActiveTool] = useState<'twists' | 'dialogue' | 'pacing' | 'development'>('twists');
  const [inputPrompt, setInputPrompt] = useState('');
  const [selectedSpeakerId, setSelectedSpeakerId] = useState('');
  const [resultText, setResultText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!currentStory) {
    return (
      <div className="p-8 text-center text-text-muted">
        <p>No story universe active. Select or create a story first.</p>
      </div>
    );
  }

  const handleRunTool = async () => {
    const settings = getAISettings();
    if (!settings.apiKey) {
      setError("Gemini API key is required. Please add it in Settings.");
      return;
    }

    setLoading(true);
    setError(null);
    setResultText(null);

    try {
      const genAI = new GoogleGenerativeAI(settings.apiKey);
      const model = genAI.getGenerativeModel({ model: settings.model });

      let systemPrompt = '';
      if (activeTool === 'twists') {
        systemPrompt = `
You are STORYNEX co-writer for the universe "${currentStory.title}" (${currentStory.genre}).
Premise: "${currentStory.premise}".
Writing Style: "${currentStory.writingStyle}".
Approved Facts: ${memories.map(m => m.content).join('; ')}

Task: Suggest 3 unexpected yet narratively logical plot twists or dramatic revelations for upcoming scenes.
Each twist must respect established character motivations (${characters.map(c => `${c.name}: fear of ${c.fears.join(', ')}`).join('; ')}) and lore facts. Format with clear bullet points.
User focus: "${inputPrompt || 'Advance the core anomaly without resolving it prematurely.'}"
`;
      } else if (activeTool === 'dialogue') {
        const speaker = characters.find(c => c.id === selectedSpeakerId) || characters[0];
        systemPrompt = `
Doctor this dialogue line for ${speaker?.name || 'the protagonist'}.
Character Voice: "${speaker?.dialogueStyle || 'Natural'}".
Character Motivation: "${speaker?.motivation || 'Survive'}".
Line to Doctor: "${inputPrompt}".
Task: Provide 3 polished alternatives with distinct subtext and emotional temperature.
`;
      } else if (activeTool === 'pacing') {
        systemPrompt = `
Analyze and improve pacing for this scene snippet in the style "${currentStory.writingStyle}":
"""
${inputPrompt}
"""
Task: Provide actionable structural notes on sentence rhythm, tension escalation, and sensory grounding, followed by a tightened revision.
`;
      } else if (activeTool === 'development') {
        systemPrompt = `
Suggest character development arcs and moral dilemmas for the cast:
${characters.map(c => `• ${c.name} (${c.role}): Wants "${c.motivation}", Fears "${c.fears.join(', ')}"`).join('\n')}

Task: Propose 2 psychological inflection points where their core desires collide.
`;
      }

      const res = await model.generateContent(systemPrompt);
      setResultText(res.response.text().trim());
    } catch (err: any) {
      setError(err.message || 'AI request failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (resultText) {
      navigator.clipboard.writeText(resultText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-xs font-mono text-primary uppercase tracking-wider">
            Creative Co-Writer
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary mt-1">
            Narrative Intelligence Lab
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Context-grounded creative suite for dialogue doctoring, plot twists, and pacing tuning.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-primary bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Active Universe: {currentStory.title}</span>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-status-error/10 border border-status-error/30 text-status-error text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Tool Switcher & Prompt Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Tool Navigation */}
        <div className="lg:col-span-4 space-y-2">
          <button
            onClick={() => { setActiveTool('twists'); setResultText(null); }}
            className={`w-full p-4 rounded-xl border text-left transition-colors flex items-start space-x-3 ${
              activeTool === 'twists' 
                ? 'bg-primary/10 border-primary text-primary' 
                : 'bg-surface border-border text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
            }`}
          >
            <Lightbulb className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-heading font-bold text-sm text-text-primary">Logical Plot Twists</h3>
              <p className="text-xs text-text-muted mt-0.5">Brainstorm twists that respect established lore rules.</p>
            </div>
          </button>

          <button
            onClick={() => { setActiveTool('dialogue'); setResultText(null); }}
            className={`w-full p-4 rounded-xl border text-left transition-colors flex items-start space-x-3 ${
              activeTool === 'dialogue' 
                ? 'bg-accent/10 border-accent text-accent' 
                : 'bg-surface border-border text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
            }`}
          >
            <MessageSquare className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-heading font-bold text-sm text-text-primary">Dialogue Doctor</h3>
              <p className="text-xs text-text-muted mt-0.5">Tune lines to match character psychology & cadence.</p>
            </div>
          </button>

          <button
            onClick={() => { setActiveTool('pacing'); setResultText(null); }}
            className={`w-full p-4 rounded-xl border text-left transition-colors flex items-start space-x-3 ${
              activeTool === 'pacing' 
                ? 'bg-purple-500/10 border-purple-500 text-purple-300' 
                : 'bg-surface border-border text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
            }`}
          >
            <PenTool className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-heading font-bold text-sm text-text-primary">Pacing & Cadence Doctor</h3>
              <p className="text-xs text-text-muted mt-0.5">Tighten tension and sensory grounding.</p>
            </div>
          </button>

          <button
            onClick={() => { setActiveTool('development'); setResultText(null); }}
            className={`w-full p-4 rounded-xl border text-left transition-colors flex items-start space-x-3 ${
              activeTool === 'development' 
                ? 'bg-status-success/10 border-status-success text-status-success' 
                : 'bg-surface border-border text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
            }`}
          >
            <Layers className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-heading font-bold text-sm text-text-primary">Character Arc Collisions</h3>
              <p className="text-xs text-text-muted mt-0.5">Explore moral dilemmas between conflicting goals.</p>
            </div>
          </button>
        </div>

        {/* Right Input & Output Screen */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-xl border border-border bg-surface space-y-4 shadow-xl">
            {activeTool === 'dialogue' && (
              <div>
                <label className="block text-xs font-mono uppercase text-text-muted mb-1.5">
                  Speaking Cast Character
                </label>
                <select
                  value={selectedSpeakerId}
                  onChange={(e) => setSelectedSpeakerId(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded text-xs text-text-primary"
                >
                  <option value="">Select speaker...</option>
                  {characters.map(c => (
                    <option key={c.id} value={c.id}>{c.name} — {c.dialogueStyle}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono uppercase text-text-muted mb-1.5">
                {activeTool === 'twists' && 'Specific Focus or Chapter Objective (Optional)'}
                {activeTool === 'dialogue' && 'Original Dialogue Line'}
                {activeTool === 'pacing' && 'Scene Paragraph to Analyze'}
                {activeTool === 'development' && 'Specific Character or Theme to Focus On'}
              </label>
              <textarea
                rows={4}
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder={
                  activeTool === 'twists' ? 'e.g., What if the distress signal was sent from an alternate future that already failed?' :
                  activeTool === 'dialogue' ? 'e.g., "I know what you are hiding from me."' :
                  activeTool === 'pacing' ? 'Paste 1-3 paragraphs to tighten rhythm...' :
                  'e.g., Focus on Donald Vance and Lyra Thorne colliding over station secrets.'
                }
                className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary leading-relaxed"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] font-mono text-text-muted">
                Anchored to {memories.length} lore facts & {characters.length} characters
              </span>
              <button
                onClick={handleRunTool}
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-primary hover:bg-primary-strong disabled:opacity-50 text-black font-semibold text-xs transition-colors flex items-center space-x-2 shadow-md"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>{loading ? 'Consulting Gemini...' : 'Execute Narrative Action'}</span>
              </button>
            </div>
          </div>

          {/* Results Output */}
          {resultText && (
            <div className="p-6 rounded-xl border border-primary/30 bg-surface space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-mono text-primary font-bold uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                  <span>Co-Writer Suggestions</span>
                </span>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center space-x-1 text-xs text-text-muted hover:text-text-primary"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-status-success" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Output'}</span>
                </button>
              </div>

              <div className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans whitespace-pre-wrap">
                {resultText}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
