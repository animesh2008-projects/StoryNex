import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStory } from '../../context/StoryContext';
import { Sparkles, ArrowRight, ArrowLeft, BookOpen, AlertCircle, Wand2 } from 'lucide-react';
import { getAISettings } from '../../services/ai-service';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GENRE_PRESETS = [
  'Sci-Fi / Space Mystery',
  'Dark Fantasy / Eldritch',
  'Cyberpunk / Noir',
  'Psychological Thriller',
  'Post-Apocalyptic',
  'Historical Fiction',
  'Urban Fantasy',
  'Literary Fiction'
];

const STYLE_PRESETS = [
  'Atmospheric, introspective, with sharp cinematic pacing',
  'Gritty, visceral, dialogue-driven with dry irony',
  'Poetic, lyrical, detailed sensory worldbuilding',
  'Fast-paced, clipped sentences, high-stakes urgency',
  'Classical literary prose with measured psychological cadence'
];

export const StoryNewPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState(GENRE_PRESETS[0]);
  const [writingStyle, setWritingStyle] = useState(STYLE_PRESETS[0]);
  const [premise, setPremise] = useState('');
  const [expanding, setExpanding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { createStory } = useStory();
  const navigate = useNavigate();

  const handleExpandPremise = async () => {
    if (!premise.trim()) {
      setError("Please write a sentence or brief premise idea first.");
      return;
    }
    const settings = getAISettings();
    if (!settings.apiKey) {
      setError("Gemini API key is required to expand premises. Please configure it in Settings.");
      return;
    }

    setExpanding(true);
    setError(null);
    try {
      const genAI = new GoogleGenerativeAI(settings.apiKey);
      const model = genAI.getGenerativeModel({ model: settings.model });
      const prompt = `
Act as STORYNEX creative co-writer.
Given this brief seed premise in the genre "${genre}":
"${premise}"

Refine and expand this premise into a compelling, 2-3 sentence narrative hook emphasizing character motivation, the core anomaly or conflict, and the high stakes. Output the expanded premise only.
`;
      const res = await model.generateContent(prompt);
      setPremise(res.response.text().trim());
    } catch (err: any) {
      setError(err.message || "Failed to expand premise with Gemini.");
    } finally {
      setExpanding(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !premise.trim()) {
      setError("Title and premise are required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const story = await createStory({
        title,
        genre,
        writingStyle,
        premise,
        status: 'active',
      });
      navigate(`/app/stories/${story.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to create universe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-8">
      {/* Back button & Heading */}
      <div className="space-y-2">
        <button
          onClick={() => navigate('/app/stories')}
          className="inline-flex items-center space-x-1 text-xs text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Stories</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
          Seed a New Fictional Universe
        </h1>
        <p className="text-xs text-text-secondary">
          Define the foundational lore rules, stylistic cadence, and narrative hook for your universe.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-status-error/10 border border-status-error/30 text-status-error text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-surface border border-border p-6 rounded-xl shadow-lg">
        {/* Title */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-1.5">
            Universe / Story Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., The Obsidian Archive, Echoes of Aldera, Neon Requiem"
            className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Genre Selector */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-1.5">
            Genre & Sub-genre
          </label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary transition-colors cursor-pointer"
          >
            {GENRE_PRESETS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Writing Style */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-1.5">
            Writing Style & Stylistic Voice
          </label>
          <select
            value={writingStyle}
            onChange={(e) => setWritingStyle(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary transition-colors cursor-pointer mb-2"
          >
            {STYLE_PRESETS.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
          <input
            type="text"
            value={writingStyle}
            onChange={(e) => setWritingStyle(e.target.value)}
            placeholder="Or type a custom tone instruction..."
            className="w-full px-3 py-1.5 bg-surface-secondary border border-border rounded text-xs text-text-secondary focus:outline-none focus:border-primary font-mono"
          />
        </div>

        {/* Premise */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-text-muted">
              Core Story Premise & Central Anomaly
            </label>
            <button
              type="button"
              onClick={handleExpandPremise}
              disabled={expanding}
              className="text-xs font-mono text-primary hover:text-primary-strong flex items-center space-x-1 disabled:opacity-50"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>{expanding ? 'Expanding...' : 'AI Expand with Gemini'}</span>
            </button>
          </div>
          <textarea
            required
            rows={4}
            value={premise}
            onChange={(e) => setPremise(e.target.value)}
            placeholder="In a submerged orbital relay drifting over Kepler-186f, an archivist uncovers a temporal distress signal recorded by his own future self..."
            className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary transition-colors leading-relaxed"
          />
        </div>

        {/* Submit */}
        <div className="pt-2 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/app/stories')}
            className="px-4 py-2 rounded-lg bg-surface-secondary text-text-secondary hover:text-text-primary text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-strong disabled:opacity-50 text-black font-semibold text-xs transition-all shadow-md flex items-center space-x-2"
          >
            <span>{loading ? 'Initializing Universe...' : 'Launch Universe Workspace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
