import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStory } from '../../context/StoryContext';
import { StoryBranch, Chapter } from '../../types';
import { storageAdapter } from '../../services/storage-adapter';
import { 
  GitFork, 
  PlusCircle, 
  ArrowRight, 
  FileText, 
  Check, 
  Trash2, 
  GitBranch, 
  GitMerge, 
  BookOpen,
  Sparkles,
  HelpCircle,
  X
} from 'lucide-react';

export const BranchExplorerPage: React.FC = () => {
  const { currentStory, chapters, branches, refreshCurrentStoryData } = useStory();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState('');
  const [choiceText, setChoiceText] = useState('');
  const [label, setLabel] = useState('Choice A: Immediate Action');

  if (!currentStory) {
    return (
      <div className="p-8 text-center text-text-muted">
        <p>No story universe active. Select or create a story first.</p>
      </div>
    );
  }

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParentId || !choiceText.trim()) return;

    const parentChap = chapters.find(c => c.id === selectedParentId);

    const branch: StoryBranch = {
      id: `branch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      storyId: currentStory.id,
      parentChapterId: selectedParentId,
      parentChapterTitle: parentChap?.title,
      choiceText,
      label: label || 'Alternative Path',
      status: 'active',
      createdAt: Date.now(),
    };

    await storageAdapter.saveBranch(branch, currentStory.ownerId);
    await refreshCurrentStoryData();
    setIsModalOpen(false);
    setChoiceText('');
  };

  const handleDeleteBranch = async (branchId: string) => {
    if (confirm("Delete this narrative branch path?")) {
      await storageAdapter.deleteBranch(currentStory.ownerId, currentStory.id, branchId);
      await refreshCurrentStoryData();
    }
  };

  // Create an alternative chapter directly from a branch
  const handleForkChapterFromBranch = async (branch: StoryBranch) => {
    const parentChap = chapters.find(c => c.id === branch.parentChapterId);
    const newOrder = parentChap ? parentChap.order + 1 : chapters.length + 1;

    const forkedChapter: Chapter = {
      id: `chap_branch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      storyId: currentStory.id,
      title: `${branch.label} — ${parentChap?.title || 'Continuation'}`,
      order: newOrder,
      content: `[NARRATIVE BRANCH: ${branch.label}]\nPremise of decision: "${branch.choiceText}"\n\nDonald paused as the ramifications settled in...`,
      summary: `Branch continuation where decision is: ${branch.choiceText}`,
      status: 'draft',
      wordCount: 18,
      branchId: branch.id,
      parentChapterId: branch.parentChapterId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await storageAdapter.saveChapter(forkedChapter, currentStory.ownerId);
    // Update branch nextChapterId
    const updatedBranch: StoryBranch = { ...branch, nextChapterId: forkedChapter.id };
    await storageAdapter.saveBranch(updatedBranch, currentStory.ownerId);
    await refreshCurrentStoryData();

    navigate(`/app/stories/${currentStory.id}/chapters/${forkedChapter.id}`);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">
            Nonlinear Multiverse Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary mt-1">
            Branch Explorer
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Explore 2-3 alternate decisions per chapter without overwriting your original canon manuscript.
          </p>
        </div>

        <button
          onClick={() => {
            if (chapters.length > 0) setSelectedParentId(chapters[0].id);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary-strong text-black font-semibold text-xs rounded-lg transition-all shadow-md self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Decision Point</span>
        </button>
      </div>

      {/* Interactive Story Tree Map */}
      <div className="p-6 rounded-xl border border-border bg-surface space-y-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GitBranch className="w-5 h-5 text-primary" />
            <h3 className="font-heading font-bold text-sm text-text-primary">
              Narrative Decision Tree
            </h3>
          </div>
          <span className="text-xs font-mono text-text-muted">
            Canon Path (Mainline) + Alternate Multiverse
          </span>
        </div>

        {/* Tree Visual Flow */}
        <div className="space-y-8">
          {chapters.map((chap, idx) => {
            const chapterBranches = branches.filter(b => b.parentChapterId === chap.id);

            return (
              <div key={chap.id} className="relative pl-6 sm:pl-8 border-l-2 border-border space-y-4">
                {/* Node Dot */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-surface border-2 border-primary flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
                </div>

                {/* Chapter Card (Canon Path) */}
                <div className="p-4 rounded-lg bg-surface-secondary border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs text-primary font-bold">Chapter #{chap.order}</span>
                      <h4 className="font-heading font-semibold text-sm text-text-primary">{chap.title}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                        Canon Baseline
                      </span>
                    </div>
                    <p className="text-xs text-text-muted line-clamp-2 max-w-2xl">
                      {chap.summary || chap.content.slice(0, 120) + '...'}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => navigate(`/app/stories/${currentStory.id}/chapters/${chap.id}`)}
                      className="px-3 py-1.5 rounded bg-surface border border-border text-xs text-text-primary hover:border-primary/50 transition-colors flex items-center gap-1"
                    >
                      <span>Open Chapter</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedParentId(chap.id);
                        setIsModalOpen(true);
                      }}
                      className="px-2.5 py-1.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs hover:bg-purple-500/20 transition-colors"
                      title="Add Decision Fork here"
                    >
                      <GitFork className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Attached Multiverse Branches */}
                {chapterBranches.length > 0 && (
                  <div className="pl-6 border-l-2 border-dashed border-purple-500/40 space-y-3 pt-2">
                    <span className="text-[10px] font-mono uppercase text-purple-400 font-semibold tracking-wider">
                      Branching Decisions ({chapterBranches.length} Paths)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {chapterBranches.map((br) => (
                        <div
                          key={br.id}
                          className="p-3.5 rounded-lg border border-purple-500/30 bg-purple-500/5 space-y-2 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between text-[11px] font-mono">
                              <span className="text-purple-300 font-bold">{br.label}</span>
                              <button
                                onClick={() => handleDeleteBranch(br.id)}
                                className="text-text-muted hover:text-status-error"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                              "{br.choiceText}"
                            </p>
                          </div>

                          <div className="pt-2 border-t border-purple-500/20 flex items-center justify-between">
                            {br.nextChapterId ? (
                              <button
                                onClick={() => navigate(`/app/stories/${currentStory.id}/chapters/${br.nextChapterId}`)}
                                className="text-xs font-mono text-accent hover:underline flex items-center gap-1 font-medium"
                              >
                                <span>Open Forked Chapter</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleForkChapterFromBranch(br)}
                                className="px-2.5 py-1 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 text-xs font-mono flex items-center gap-1"
                              >
                                <Sparkles className="w-3 h-3" />
                                <span>Write Continuation</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Branch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full bg-surface border border-border p-6 rounded-xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-heading font-bold text-base text-text-primary flex items-center gap-2">
                <GitFork className="w-4 h-4 text-primary" />
                <span>Create Decision Point</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-text-primary">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBranch} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono uppercase text-text-muted mb-1">
                  Parent Chapter
                </label>
                <select
                  value={selectedParentId}
                  onChange={(e) => setSelectedParentId(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded text-text-primary"
                >
                  {chapters.map(c => (
                    <option key={c.id} value={c.id}>
                      #{c.order} - {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono uppercase text-text-muted mb-1">
                  Branch Label
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g., Choice A: Immediate Disclosure"
                  className="w-full px-3 py-2 bg-background border border-border rounded text-text-primary focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-text-muted mb-1">
                  Decision Choice Text
                </label>
                <textarea
                  rows={3}
                  required
                  value={choiceText}
                  onChange={(e) => setChoiceText(e.target.value)}
                  placeholder="e.g., Open the cylinder immediately and decipher the inscription with Lyra instead of concealing it."
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
                  Fork Narrative Path
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
