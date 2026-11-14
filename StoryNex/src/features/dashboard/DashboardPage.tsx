import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStory } from '../../context/StoryContext';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, 
  PenTool, 
  PlusCircle, 
  Users, 
  BrainCircuit, 
  GitFork, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  FileText,
  Bookmark
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { stories, currentStory, chapters, characters, memories, branches, selectStory } = useStory();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Find latest edited chapter
  const latestChapter = chapters.length > 0 ? chapters[chapters.length - 1] : null;

  const totalWords = chapters.reduce((acc, c) => acc + (c.wordCount || 0), 0);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome & Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-xs font-mono text-primary uppercase tracking-wider">
            Creative Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary mt-1">
            Welcome back, {currentUser?.displayName || 'Author'}
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            {currentStory ? (
              <>Working in <strong className="text-text-primary">{currentStory.title}</strong> — {currentStory.genre}</>
            ) : (
              'Create or select a story to begin writing.'
            )}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/app/stories/new"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary-strong text-black font-semibold text-xs rounded-lg transition-all shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Universe</span>
          </Link>
        </div>
      </div>

      {/* Primary Continue Writing Card & Active Universe Stats */}
      {currentStory && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Continue Writing Hero Card */}
          <div className="lg:col-span-2 p-6 rounded-xl border border-primary/30 bg-gradient-to-br from-surface to-surface-secondary space-y-4 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <PenTool className="w-32 h-32 text-primary" />
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono text-primary">
              <Sparkles className="w-4 h-4" />
              <span>CONTINUE WRITING</span>
            </div>

            <div>
              <h2 className="text-xl font-heading font-bold text-text-primary">
                {latestChapter ? latestChapter.title : 'Ready for Chapter 1'}
              </h2>
              <p className="text-xs text-text-secondary mt-1 max-w-xl line-clamp-2">
                {latestChapter?.summary || currentStory.premise}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-text-muted pt-2">
              <div className="flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-text-secondary" />
                <span>{latestChapter ? `${latestChapter.wordCount} words` : '0 words'}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-text-secondary" />
                <span>Last updated {new Date(latestChapter?.updatedAt || currentStory.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="px-2 py-0.5 rounded bg-surface border border-border text-[11px] text-accent">
                Status: {latestChapter?.status || 'Draft'}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  if (latestChapter) {
                    navigate(`/app/stories/${currentStory.id}/chapters/${latestChapter.id}`);
                  } else {
                    navigate(`/app/stories/${currentStory.id}/chapters/new`);
                  }
                }}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-strong text-black font-semibold text-xs transition-all shadow-md"
              >
                <span>Resume Writing in 3-Panel Editor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Universe Statistics Overview */}
          <div className="p-6 rounded-xl border border-border bg-surface flex flex-col justify-between space-y-4">
            <h3 className="font-heading font-semibold text-xs uppercase tracking-wider text-text-muted font-mono">
              Universe Vital Signs
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-surface-secondary border border-border">
                <span className="text-[11px] font-mono text-text-muted">Total Words</span>
                <div className="text-xl font-bold font-mono text-text-primary mt-0.5">
                  {totalWords.toLocaleString()}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-secondary border border-border">
                <span className="text-[11px] font-mono text-text-muted">Chapters</span>
                <div className="text-xl font-bold font-mono text-text-primary mt-0.5">
                  {chapters.length}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-secondary border border-border">
                <span className="text-[11px] font-mono text-text-muted">Cast Characters</span>
                <div className="text-xl font-bold font-mono text-text-primary mt-0.5">
                  {characters.length}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-secondary border border-border">
                <span className="text-[11px] font-mono text-text-muted">Memory Facts</span>
                <div className="text-xl font-bold font-mono text-accent mt-0.5">
                  {memories.length}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-text-muted">
              <span>Continuity Health:</span>
              <span className="text-status-success font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-status-success inline-block"></span>
                Anchored
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Narrative Hub Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/app/characters"
          className="p-4 rounded-lg border border-border bg-surface hover:border-primary/40 transition-colors space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono text-text-muted">{characters.length} Cast</span>
          </div>
          <h4 className="font-heading font-semibold text-sm text-text-primary">Character Studio</h4>
          <p className="text-xs text-text-muted">Psychology, motivations, fears, and voice profiles.</p>
        </Link>

        <Link
          to="/app/memory"
          className="p-4 rounded-lg border border-border bg-surface hover:border-accent/40 transition-colors space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono text-accent">3-Layer</span>
          </div>
          <h4 className="font-heading font-semibold text-sm text-text-primary">Story Memory</h4>
          <p className="text-xs text-text-muted">Worldbuilding facts, timeline summaries, and lore.</p>
        </Link>

        <Link
          to="/app/branches"
          className="p-4 rounded-lg border border-border bg-surface hover:border-purple-400/40 transition-colors space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-md bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <GitFork className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono text-text-muted">{branches.length} Decisions</span>
          </div>
          <h4 className="font-heading font-semibold text-sm text-text-primary">Branch Explorer</h4>
          <p className="text-xs text-text-muted">Interactive narrative trees and alternate timelines.</p>
        </Link>

        <Link
          to="/app/assistant"
          className="p-4 rounded-lg border border-border bg-surface hover:border-primary/40 transition-colors space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono text-primary">Gemini</span>
          </div>
          <h4 className="font-heading font-semibold text-sm text-text-primary">Creative Co-Writer</h4>
          <p className="text-xs text-text-muted">Dialogue doctoring, pacing, and 8-factor generation.</p>
        </Link>
      </div>

      {/* Recent Chapters & Characters Two-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Chapters */}
        <div className="p-6 rounded-xl border border-border bg-surface space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-sm text-text-primary flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span>Chapter Ledger</span>
            </h3>
            {currentStory && (
              <Link
                to={`/app/stories/${currentStory.id}/chapters/new`}
                className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Chapter</span>
              </Link>
            )}
          </div>

          {chapters.length === 0 ? (
            <div className="p-6 text-center text-xs text-text-muted border border-dashed border-border rounded-lg">
              No chapters written in this universe yet. Click "Add Chapter" to begin.
            </div>
          ) : (
            <div className="space-y-2">
              {chapters.map((chap, idx) => (
                <div
                  key={chap.id}
                  onClick={() => navigate(`/app/stories/${chap.storyId}/chapters/${chap.id}`)}
                  className="p-3 rounded-lg bg-surface-secondary border border-border hover:border-primary/40 transition-colors cursor-pointer flex items-center justify-between group"
                >
                  <div className="space-y-0.5 min-w-0 pr-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[10px] text-text-muted">#{chap.order}</span>
                      <span className="font-medium text-xs text-text-primary truncate group-hover:text-primary transition-colors">
                        {chap.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted truncate max-w-sm">
                      {chap.summary || 'No summary recorded'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 shrink-0">
                    <span className="text-[11px] font-mono text-text-muted">
                      {chap.wordCount} words
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface border border-border text-text-secondary">
                      {chap.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Character Roster */}
        <div className="p-6 rounded-xl border border-border bg-surface space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-sm text-text-primary flex items-center gap-2">
              <Users className="w-4 h-4 text-accent" />
              <span>Active Cast & Psychology</span>
            </h3>
            <Link
              to="/app/characters"
              className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Studio</span>
            </Link>
          </div>

          {characters.length === 0 ? (
            <div className="p-6 text-center text-xs text-text-muted border border-dashed border-border rounded-lg">
              No characters created yet. Define cast members to ground AI dialogue in authentic voices.
            </div>
          ) : (
            <div className="space-y-2">
              {characters.map((char) => (
                <div
                  key={char.id}
                  onClick={() => navigate('/app/characters')}
                  className="p-3 rounded-lg bg-surface-secondary border border-border hover:border-accent/40 transition-colors cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center font-bold text-xs text-accent shrink-0">
                      {char.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-xs text-text-primary group-hover:text-accent transition-colors truncate">
                        {char.name}
                      </div>
                      <div className="text-[11px] text-text-muted truncate">
                        {char.role} • Fear: {char.fears[0] || 'Unknown'}
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-text-muted bg-surface px-2 py-0.5 rounded border border-border shrink-0">
                    {char.dialogueStyle.slice(0, 20)}...
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
