import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStory } from '../../context/StoryContext';
import { 
  BookMarked, 
  PlusCircle, 
  Search, 
  Trash2, 
  PenTool, 
  Clock, 
  FileText, 
  Users, 
  AlertTriangle 
} from 'lucide-react';

export const StoryListPage: React.FC = () => {
  const { stories, selectStory, deleteStory } = useStory();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const filtered = stories.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
                          s.genre.toLowerCase().includes(search.toLowerCase()) ||
                          s.premise.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    await deleteStory(id);
    setDeletingId(null);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-xs font-mono text-primary uppercase tracking-wider">
            Narrative Archives
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary mt-1">
            All Story Universes
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Manage your fictional universes, canon chapters, and branching storylines.
          </p>
        </div>

        <Link
          to="/app/stories/new"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary-strong text-black font-semibold text-xs rounded-lg transition-all shadow-md self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Universe</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stories, genre, premise..."
            className="w-full pl-9 pr-3 py-2 bg-surface border border-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto text-xs font-mono">
          <span className="text-text-muted">Status:</span>
          {['all', 'active', 'draft', 'completed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded capitalize transition-colors ${
                filterStatus === st 
                  ? 'bg-primary/20 text-primary border border-primary/40 font-semibold' 
                  : 'bg-surface text-text-muted hover:text-text-primary border border-border'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Story Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-dashed border-border bg-surface/50 space-y-3">
          <BookMarked className="w-8 h-8 text-text-muted mx-auto" />
          <h3 className="font-heading font-semibold text-sm text-text-primary">No stories found</h3>
          <p className="text-xs text-text-muted max-w-sm mx-auto">
            {search ? 'No stories match your search query.' : 'Initialize your first fictional universe to begin.'}
          </p>
          <div className="pt-2">
            <Link
              to="/app/stories/new"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary-strong text-black font-semibold text-xs rounded-lg transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create New Universe</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((story) => (
            <div
              key={story.id}
              className="p-5 rounded-xl border border-border bg-surface hover:border-primary/40 transition-colors flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-surface-secondary border border-border text-primary font-semibold">
                    {story.genre}
                  </span>
                  <button
                    onClick={() => setDeletingId(story.id)}
                    title="Delete Story Universe"
                    className="p-1 text-text-muted hover:text-status-error transition-colors rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 
                  onClick={async () => {
                    await selectStory(story.id);
                    navigate(`/app/stories/${story.id}`);
                  }}
                  className="font-heading font-bold text-base text-text-primary group-hover:text-primary transition-colors cursor-pointer truncate"
                >
                  {story.title}
                </h3>

                <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed">
                  {story.premise}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between text-[11px] font-mono text-text-muted">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-text-secondary" />
                      {story.chapterCount} Ch.
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-text-secondary" />
                      {story.characterCount} Cast
                    </span>
                  </div>
                  <span className="capitalize">{story.status}</span>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={async () => {
                      await selectStory(story.id);
                      navigate(`/app/stories/${story.id}`);
                    }}
                    className="flex-1 py-1.5 px-3 bg-surface-secondary hover:bg-surface-secondary/80 border border-border text-text-primary text-xs font-medium rounded transition-colors text-center"
                  >
                    View Universe
                  </button>
                  <button
                    onClick={async () => {
                      await selectStory(story.id);
                      navigate(`/app/stories/${story.id}/chapters/new`);
                    }}
                    className="py-1.5 px-3 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 text-xs font-semibold rounded transition-colors flex items-center gap-1"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>Write</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full bg-surface border border-status-error/40 p-6 rounded-xl space-y-4 shadow-2xl">
            <div className="flex items-center space-x-3 text-status-error">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-heading font-bold text-base text-text-primary">
                Delete Fictional Universe?
              </h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              This action cannot be undone. All associated chapters, character profiles, 3-layer story memories, and branching timelines will be permanently removed.
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-1.5 rounded bg-surface-secondary text-text-primary text-xs hover:bg-surface-secondary/80"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="px-4 py-1.5 rounded bg-status-error text-white text-xs font-semibold hover:bg-red-600 transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
