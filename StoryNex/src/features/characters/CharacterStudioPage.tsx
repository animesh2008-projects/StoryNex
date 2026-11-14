import React, { useState } from 'react';
import { useStory } from '../../context/StoryContext';
import { Character, CharacterRelationship } from '../../types';
import { storageAdapter } from '../../services/storage-adapter';
import { aiService, getAISettings } from '../../services/ai-service';
import { 
  Users, 
  PlusCircle, 
  Sparkles, 
  Edit3, 
  Trash2, 
  Heart, 
  ShieldAlert, 
  MessageSquare, 
  Target, 
  BookOpen,
  X,
  Check,
  Wand2,
  AlertCircle
} from 'lucide-react';

export const CharacterStudioPage: React.FC = () => {
  const { currentStory, characters, refreshCurrentStoryData } = useStory();
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPromptConcept, setAiPromptConcept] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [personalityInput, setPersonalityInput] = useState('');
  const [background, setBackground] = useState('');
  const [motivation, setMotivation] = useState('');
  const [goalsInput, setGoalsInput] = useState('');
  const [fearsInput, setFearsInput] = useState('');
  const [dialogueStyle, setDialogueStyle] = useState('');
  const [developmentNotes, setDevelopmentNotes] = useState('');

  const openCreateModal = () => {
    setSelectedCharacter(null);
    setName('');
    setRole('');
    setPersonalityInput('');
    setBackground('');
    setMotivation('');
    setGoalsInput('');
    setFearsInput('');
    setDialogueStyle('');
    setDevelopmentNotes('');
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (char: Character) => {
    setSelectedCharacter(char);
    setName(char.name);
    setRole(char.role);
    setPersonalityInput(char.personality.join(', '));
    setBackground(char.background);
    setMotivation(char.motivation);
    setGoalsInput(char.goals.join(', '));
    setFearsInput(char.fears.join(', '));
    setDialogueStyle(char.dialogueStyle);
    setDevelopmentNotes(char.developmentNotes || '');
    setError(null);
    setIsModalOpen(true);
  };

  const handleGenerateProfile = async () => {
    if (!currentStory) return;
    if (!aiPromptConcept.trim()) {
      setError("Please describe a short concept for the character first.");
      return;
    }
    setIsGenerating(true);
    setError(null);

    try {
      const generated = await aiService.generateCharacterProfile(aiPromptConcept, currentStory.genre);
      if (generated.name) setName(generated.name);
      if (generated.role) setRole(generated.role);
      if (generated.personality) setPersonalityInput(generated.personality.join(', '));
      if (generated.background) setBackground(generated.background);
      if (generated.motivation) setMotivation(generated.motivation);
      if (generated.goals) setGoalsInput(generated.goals.join(', '));
      if (generated.fears) setFearsInput(generated.fears.join(', '));
      if (generated.dialogueStyle) setDialogueStyle(generated.dialogueStyle);
      if (generated.developmentNotes) setDevelopmentNotes(generated.developmentNotes);
    } catch (err: any) {
      setError(err.message || "Failed to generate character with Gemini.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStory) return;
    if (!name.trim()) {
      setError("Character name is required.");
      return;
    }

    const char: Character = {
      id: selectedCharacter?.id || `char_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      storyId: currentStory.id,
      name,
      role: role || 'Cast Member',
      personality: personalityInput.split(',').map(s => s.trim()).filter(Boolean),
      background,
      motivation,
      goals: goalsInput.split(',').map(s => s.trim()).filter(Boolean),
      fears: fearsInput.split(',').map(s => s.trim()).filter(Boolean),
      dialogueStyle: dialogueStyle || 'Standard conversational',
      developmentNotes,
      relationships: selectedCharacter?.relationships || [],
      createdAt: selectedCharacter?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    await storageAdapter.saveCharacter(char, currentStory.ownerId);
    await refreshCurrentStoryData();
    setIsModalOpen(false);
  };

  const handleDelete = async (charId: string) => {
    if (!currentStory) return;
    if (confirm("Are you sure you want to remove this character from the cast?")) {
      await storageAdapter.deleteCharacter(currentStory.ownerId, currentStory.id, charId);
      await refreshCurrentStoryData();
    }
  };

  if (!currentStory) {
    return (
      <div className="p-8 text-center text-text-muted">
        <p>No story universe active. Select or create a story first.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-xs font-mono text-accent uppercase tracking-wider">
            Character Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary mt-1">
            Character Studio
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Build characters with psychological depth. Personality, fears, and cadence are enforced by the AI during generation.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary-strong text-black font-semibold text-xs rounded-lg transition-all shadow-md self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Character</span>
        </button>
      </div>

      {/* Cast Grid */}
      {characters.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-dashed border-border bg-surface text-xs text-text-muted space-y-3">
          <Users className="w-8 h-8 mx-auto text-text-muted" />
          <h3 className="font-heading font-semibold text-sm text-text-primary">No characters created yet</h3>
          <p className="max-w-sm mx-auto">
            Add characters to anchor narrative generation. Characters maintain distinct dialogue cadences and psychological stakes.
          </p>
          <div className="pt-2">
            <button
              onClick={openCreateModal}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded bg-primary text-black font-semibold text-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create First Character</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((char) => (
            <div
              key={char.id}
              className="p-5 rounded-xl border border-border bg-surface hover:border-primary/40 transition-colors flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center font-bold text-primary text-sm">
                      {char.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-base text-text-primary">
                        {char.name}
                      </h3>
                      <p className="text-xs font-mono text-accent">{char.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openEditModal(char)}
                      className="p-1.5 text-text-muted hover:text-text-primary rounded hover:bg-surface-secondary"
                      title="Edit Character"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(char.id)}
                      className="p-1.5 text-text-muted hover:text-status-error rounded hover:bg-surface-secondary"
                      title="Delete Character"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Personality Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {char.personality.map((p, i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-secondary border border-border text-text-secondary">
                      {p}
                    </span>
                  ))}
                </div>

                {/* Core Motivations & Fears */}
                <div className="space-y-2 text-xs text-text-secondary pt-2 border-t border-border/60">
                  <div>
                    <span className="font-semibold text-text-primary flex items-center gap-1">
                      <Target className="w-3 h-3 text-status-success" />
                      Core Motivation:
                    </span>
                    <p className="text-text-muted mt-0.5 leading-relaxed">{char.motivation || 'Undefined'}</p>
                  </div>

                  <div>
                    <span className="font-semibold text-text-primary flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-status-warning" />
                      Deepest Fear:
                    </span>
                    <p className="text-text-muted mt-0.5 leading-relaxed">{char.fears.join(', ') || 'Undefined'}</p>
                  </div>

                  <div>
                    <span className="font-semibold text-text-primary flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-purple-400" />
                      Voice & Cadence:
                    </span>
                    <p className="text-text-muted mt-0.5 font-mono text-[11px] leading-relaxed">{char.dialogueStyle}</p>
                  </div>
                </div>
              </div>

              {/* Relationships Footer */}
              <div className="pt-3 border-t border-border text-[11px] font-mono text-text-muted">
                {char.relationships.length > 0 ? (
                  <span>Rel: {char.relationships.map(r => r.characterName).join(', ')}</span>
                ) : (
                  <span>No relationships bound yet</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal with Gemini AI Generator */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="max-w-2xl w-full bg-surface border border-border p-6 rounded-xl space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-bold text-lg text-text-primary">
                  {selectedCharacter ? `Edit ${selectedCharacter.name}` : 'Create Character Profile'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Generator Helper Bar */}
            <div className="p-3.5 rounded-lg bg-surface-secondary border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-accent uppercase font-semibold flex items-center gap-1">
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Generate Complete 3D Profile with Gemini</span>
                </span>
                <span className="text-[10px] font-mono text-text-muted">Always Editable</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPromptConcept}
                  onChange={(e) => setAiPromptConcept(e.target.value)}
                  placeholder="e.g., A cynical space-station medic who secretly took bribes from the corporate syndicate..."
                  className="flex-1 px-3 py-1.5 bg-background border border-border rounded text-xs text-text-primary focus:outline-none focus:border-accent"
                />
                <button
                  type="button"
                  onClick={handleGenerateProfile}
                  disabled={isGenerating}
                  className="px-3 py-1.5 rounded bg-accent text-black font-semibold text-xs hover:bg-cyan-300 transition-colors shrink-0 disabled:opacity-50"
                >
                  {isGenerating ? 'Generating...' : 'Synthesize Profile'}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded bg-status-error/10 border border-status-error/30 text-status-error text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-text-muted mb-1">Character Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Donald Vance"
                    className="w-full px-3 py-2 bg-background border border-border rounded text-sm text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-text-muted mb-1">Role / Archetype</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g., Lead Relic Archivist"
                    className="w-full px-3 py-2 bg-background border border-border rounded text-sm text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-text-muted mb-1">
                  Personality Traits (Comma separated)
                </label>
                <input
                  type="text"
                  value={personalityInput}
                  onChange={(e) => setPersonalityInput(e.target.value)}
                  placeholder="Meticulous, Skeptical, Haunted, Quietly rebellious"
                  className="w-full px-3 py-2 bg-background border border-border rounded text-sm text-text-primary focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-text-muted mb-1">Core Motivation</label>
                <input
                  type="text"
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  placeholder="To uncover the true cause of frequency shifts before decommissioning..."
                  className="w-full px-3 py-2 bg-background border border-border rounded text-sm text-text-primary focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-text-muted mb-1">Fears & Vulnerabilities</label>
                  <input
                    type="text"
                    value={fearsInput}
                    onChange={(e) => setFearsInput(e.target.value)}
                    placeholder="Losing cognitive continuity, Synthetic AI"
                    className="w-full px-3 py-2 bg-background border border-border rounded text-sm text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-text-muted mb-1">Immediate Goals</label>
                  <input
                    type="text"
                    value={goalsInput}
                    onChange={(e) => setGoalsInput(e.target.value)}
                    placeholder="Decrypt data vault, Protect beacons"
                    className="w-full px-3 py-2 bg-background border border-border rounded text-sm text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-text-muted mb-1">
                  Dialogue Style & Verbal Cadence
                </label>
                <input
                  type="text"
                  value={dialogueStyle}
                  onChange={(e) => setDialogueStyle(e.target.value)}
                  placeholder="Measured, cadence-conscious, questions underlying motives before answering"
                  className="w-full px-3 py-2 bg-background border border-border rounded text-sm text-text-primary focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-text-muted mb-1">Origin Background</label>
                <textarea
                  rows={2}
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  placeholder="Former surveyor for the Stellar Cartography Bureau who requested station isolation..."
                  className="w-full px-3 py-2 bg-background border border-border rounded text-sm text-text-primary focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-surface-secondary text-text-secondary hover:text-text-primary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-primary hover:bg-primary-strong text-black font-semibold text-xs shadow-md"
                >
                  Save Character Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
