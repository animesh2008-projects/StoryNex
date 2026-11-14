import React, { useState } from 'react';
import { useStory } from '../../context/StoryContext';
import { StoryMemory, MemoryType } from '../../types';
import { storageAdapter } from '../../services/storage-adapter';
import { 
  BrainCircuit, 
  Layers, 
  PlusCircle, 
  Check, 
  Trash2, 
  Edit3, 
  Sparkles, 
  FileText, 
  Globe, 
  Users, 
  Compass, 
  CheckCircle2, 
  Search,
  Filter,
  X
} from 'lucide-react';

export const MemoryHubPage: React.FC = () => {
  const { currentStory, chapters, memories, refreshCurrentStoryData } = useStory();
  const [activeLayer, setActiveLayer] = useState<'all' | 'layer1' | 'layer2' | 'layer3'>('all');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New fact modal states
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState<MemoryType>('world_fact');
  const [newImportance, setNewImportance] = useState(4);
  const [sourceChapterId, setSourceChapterId] = useState('');

  if (!currentStory) {
    return (
      <div className="p-8 text-center text-text-muted">
        <p>No story universe active. Select or create a story first.</p>
      </div>
    );
  }

  // Layer 3 Facts filtered
  const filteredFacts = memories.filter(m => {
    const matchesSearch = (m.title?.toLowerCase() || '').includes(search.toLowerCase()) ||
                          m.content.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || m.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleCreateFact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const sourceChap = chapters.find(c => c.id === sourceChapterId);

    const memory: StoryMemory = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      storyId: currentStory.id,
      type: newType,
      title: newTitle || undefined,
      content: newContent,
      sourceChapterId: sourceChap?.id,
      sourceChapterTitle: sourceChap?.title,
      importance: newImportance,
      status: 'approved',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await storageAdapter.saveMemory(memory, currentStory.ownerId);
    await refreshCurrentStoryData();
    setIsModalOpen(false);
    setNewTitle('');
    setNewContent('');
  };

  const handleToggleStatus = async (mem: StoryMemory) => {
    const updated: StoryMemory = {
      ...mem,
      status: mem.status === 'approved' ? 'suggested' : 'approved',
      updatedAt: Date.now(),
    };
    await storageAdapter.saveMemory(updated, currentStory.ownerId);
    await refreshCurrentStoryData();
  };

  const handleDelete = async (memId: string) => {
    if (confirm("Delete this memory fact from universe canon?")) {
      await storageAdapter.deleteMemory(currentStory.ownerId, currentStory.id, memId);
      await refreshCurrentStoryData();
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-xs font-mono text-primary uppercase tracking-wider">
            Narrative Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary mt-1">
            3-Layer Story Memory
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Hierarchical narrative state. The AI retrieves these verified facts during generation to avoid plot contradictions.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary-strong text-black font-semibold text-xs rounded-lg transition-all shadow-md self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Record Canon Fact</span>
        </button>
      </div>

      {/* Layer Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3 text-xs font-mono">
        <button
          onClick={() => setActiveLayer('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeLayer === 'all' ? 'bg-primary/20 text-primary font-semibold border border-primary/30' : 'text-text-muted hover:text-text-primary'
          }`}
        >
          All Layers (Overview)
        </button>
        <button
          onClick={() => setActiveLayer('layer1')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeLayer === 'layer1' ? 'bg-primary/20 text-primary font-semibold border border-primary/30' : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Layer 1: Universe Baseline
        </button>
        <button
          onClick={() => setActiveLayer('layer2')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeLayer === 'layer2' ? 'bg-accent/20 text-accent font-semibold border border-accent/30' : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Layer 2: Chapter Summaries ({chapters.length})
        </button>
        <button
          onClick={() => setActiveLayer('layer3')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeLayer === 'layer3' ? 'bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30' : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Layer 3: Lore Facts ({memories.length})
        </button>
      </div>

      {/* LAYER 1: UNIVERSE STATE */}
      {(activeLayer === 'all' || activeLayer === 'layer1') && (
        <section className="p-6 rounded-xl border border-primary/30 bg-surface space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-primary uppercase font-bold flex items-center gap-1.5">
              <Globe className="w-4 h-4" />
              <span>Layer 1: Master Universe Narrative State</span>
            </span>
            <span className="text-[10px] font-mono text-status-success bg-status-success/10 px-2 py-0.5 rounded border border-status-success/30">
              Immutable Anchor
            </span>
          </div>

          <h3 className="font-heading font-bold text-lg text-text-primary">
            {currentStory.title}
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed max-w-4xl">
            {currentStory.premise}
          </p>

          <div className="pt-2 border-t border-border flex flex-wrap gap-4 text-xs font-mono text-text-muted">
            <span>Genre: {currentStory.genre}</span>
            <span>Cadence: {currentStory.writingStyle}</span>
          </div>
        </section>
      )}

      {/* LAYER 2: CHAPTER SUMMARIES */}
      {(activeLayer === 'all' || activeLayer === 'layer2') && (
        <section className="p-6 rounded-xl border border-accent/30 bg-surface space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-accent uppercase font-bold flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>Layer 2: Sequential Chapter Summaries</span>
            </span>
            <span className="text-[10px] font-mono text-text-muted">
              Supplied to next generation context
            </span>
          </div>

          {chapters.length === 0 ? (
            <p className="text-xs text-text-muted">No chapters logged yet.</p>
          ) : (
            <div className="space-y-3">
              {chapters.map((ch) => (
                <div key={ch.id} className="p-3.5 rounded-lg bg-surface-secondary border border-border flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-accent">#{ch.order}</span>
                      <h4 className="font-heading font-semibold text-xs text-text-primary">{ch.title}</h4>
                      <span className="text-[10px] font-mono text-text-muted">({ch.wordCount} words)</span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed max-w-3xl">
                      {ch.summary || ch.content.slice(0, 160) + '...'}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-text-muted shrink-0">
                    Source Anchor
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* LAYER 3: STRUCTURED LORE FACTS */}
      {(activeLayer === 'all' || activeLayer === 'layer3') && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-purple-400 uppercase font-bold flex items-center gap-1.5">
                <BrainCircuit className="w-4 h-4" />
                <span>Layer 3: Structured Facts & World Lore ({memories.length})</span>
              </span>
              <p className="text-xs text-text-muted mt-0.5">
                Specific world rules, historical breaches, character secrets, and unresolved threads.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center space-x-2 text-xs font-mono">
              {['all', 'world_fact', 'character_fact', 'event', 'relationship'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-2 py-1 rounded capitalize ${
                    typeFilter === t ? 'bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/40' : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {t.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {filteredFacts.length === 0 ? (
            <div className="p-8 text-center rounded-xl border border-dashed border-border bg-surface text-xs text-text-muted">
              No facts found in this category. Click "Record Canon Fact" to add a worldbuilding rule.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFacts.map((mem) => (
                <div
                  key={mem.id}
                  className="p-4 rounded-xl border border-border bg-surface hover:border-purple-500/40 transition-colors flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 uppercase font-semibold">
                        {mem.type.replace('_', ' ')}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-text-muted">Imp: {mem.importance}/5</span>
                        <button
                          onClick={() => handleToggleStatus(mem)}
                          title="Toggle Approval Status"
                          className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                            mem.status === 'approved' 
                              ? 'bg-status-success/20 text-status-success' 
                              : 'bg-status-warning/20 text-status-warning'
                          }`}
                        >
                          {mem.status || 'approved'}
                        </button>
                      </div>
                    </div>

                    {mem.title && (
                      <h4 className="font-heading font-semibold text-xs text-text-primary">
                        {mem.title}
                      </h4>
                    )}

                    <p className="text-xs text-text-secondary leading-relaxed">
                      {mem.content}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between text-[10px] font-mono text-text-muted">
                    <span>
                      {mem.sourceChapterTitle ? `Source: ${mem.sourceChapterTitle}` : 'Universe Baseline'}
                    </span>
                    <button
                      onClick={() => handleDelete(mem.id)}
                      className="text-text-muted hover:text-status-error p-1 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Record Canon Fact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-lg w-full bg-surface border border-border p-6 rounded-xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-heading font-bold text-base text-text-primary flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-primary" />
                <span>Record Canon Memory Fact</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-text-primary">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFact} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono uppercase text-text-muted mb-1">Fact Headline / Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Relay 186-Kepler Signal Latency"
                  className="w-full px-3 py-2 bg-background border border-border rounded text-text-primary focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono uppercase text-text-muted mb-1">Memory Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as MemoryType)}
                    className="w-full px-2.5 py-2 bg-background border border-border rounded text-text-primary"
                  >
                    <option value="world_fact">World / Lore Fact</option>
                    <option value="character_fact">Character Fact</option>
                    <option value="event">Critical Event</option>
                    <option value="relationship">Relationship Dynamic</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono uppercase text-text-muted mb-1">Importance (1 to 5)</label>
                  <select
                    value={newImportance}
                    onChange={(e) => setNewImportance(Number(e.target.value))}
                    className="w-full px-2.5 py-2 bg-background border border-border rounded text-text-primary"
                  >
                    <option value={5}>5 - Paramount Canon Rule</option>
                    <option value={4}>4 - High Narrative Stake</option>
                    <option value={3}>3 - Important Detail</option>
                    <option value={2}>2 - Minor Lore</option>
                    <option value={1}>1 - Incidental</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono uppercase text-text-muted mb-1">Source Chapter (Optional)</label>
                <select
                  value={sourceChapterId}
                  onChange={(e) => setSourceChapterId(e.target.value)}
                  className="w-full px-2.5 py-2 bg-background border border-border rounded text-text-primary"
                >
                  <option value="">No specific chapter (Universe Foundation)</option>
                  {chapters.map(c => (
                    <option key={c.id} value={c.id}>#{c.order} - {c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono uppercase text-text-muted mb-1">Fact Description</label>
                <textarea
                  rows={3}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="e.g., Planetary communications take 22 hours each way; instant radio call is impossible."
                  className="w-full px-3 py-2 bg-background border border-border rounded text-text-primary focus:outline-none focus:border-primary leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-surface-secondary text-text-secondary hover:text-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-primary hover:bg-primary-strong text-black font-semibold shadow-md"
                >
                  Anchor Fact in Canon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
