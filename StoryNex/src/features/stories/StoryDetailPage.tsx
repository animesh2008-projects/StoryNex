import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStory } from '../../context/StoryContext';
import { 
  PenTool, 
  PlusCircle, 
  Users, 
  BrainCircuit, 
  GitFork, 
  FileText, 
  Clock, 
  ArrowRight,
  BookOpen,
  Edit3
} from 'lucide-react';

export const StoryDetailPage: React.FC = () => {
  const { storyId } = useParams();
  const { currentStory, stories, chapters, characters, memories, branches } = useStory();
  const navigate = useNavigate();

  const story = currentStory?.id === storyId ? currentStory : stories.find(s => s.id === storyId);

  if (!story) {
    return (
      <div className="p-12 text-center text-text-muted space-y-4">
        <p>Story universe not found.</p>
        <Link to="/app/stories" className="text-primary hover:underline text-xs">
          Return to All Stories
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Story Universe Header */}
      <div className="p-6 rounded-xl border border-border bg-surface space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 font-semibold">
              {story.genre}
            </span>
            <span className="text-xs font-mono text-text-muted capitalize">
              Status: {story.status}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to={`/app/stories/${story.id}/chapters/new`}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary-strong text-black font-semibold text-xs rounded-lg transition-all shadow-md"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Draft New Chapter</span>
            </Link>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-text-primary">
            {story.title}
          </h1>
          <p className="text-xs font-mono text-text-muted mt-1">
            Stylistic Tone: {story.writingStyle}
          </p>
        </div>

        <p className="text-sm text-text-secondary leading-relaxed max-w-3xl border-t border-border pt-3">
          {story.premise}
        </p>

        {/* Quick Nav Pills */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono">
          <Link to="/app/characters" className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-secondary border border-border hover:border-primary/40 text-text-primary transition-colors">
            <Users className="w-3.5 h-3.5 text-accent" />
            <span>{characters.length} Characters in Studio</span>
          </Link>
          <Link to="/app/memory" className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-secondary border border-border hover:border-primary/40 text-text-primary transition-colors">
            <BrainCircuit className="w-3.5 h-3.5 text-primary" />
            <span>{memories.length} Lore Facts Recorded</span>
          </Link>
          <Link to="/app/branches" className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-secondary border border-border hover:border-primary/40 text-text-primary transition-colors">
            <GitFork className="w-3.5 h-3.5 text-purple-400" />
            <span>{branches.length} Multiverse Branches</span>
          </Link>
        </div>
      </div>

      {/* Chapters Outline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-heading font-bold text-text-primary flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <span>Chronological Chapter Outline</span>
          </h2>
          <Link
            to={`/app/stories/${story.id}/chapters/new`}
            className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Chapter</span>
          </Link>
        </div>

        {chapters.length === 0 ? (
          <div className="p-12 text-center rounded-xl border border-dashed border-border bg-surface text-xs text-text-muted space-y-3">
            <p>No chapters written yet in this universe.</p>
            <Link
              to={`/app/stories/${story.id}/chapters/new`}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded bg-primary text-black font-semibold text-xs"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Write Chapter 1</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {chapters.map((chap) => (
              <div
                key={chap.id}
                onClick={() => navigate(`/app/stories/${story.id}/chapters/${chap.id}`)}
                className="p-4 rounded-xl border border-border bg-surface hover:border-primary/50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs text-primary font-bold">
                      #{chap.order}
                    </span>
                    <h3 className="font-heading font-semibold text-sm text-text-primary group-hover:text-primary transition-colors truncate">
                      {chap.title}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-secondary border border-border text-text-muted">
                      {chap.status}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted line-clamp-2 max-w-2xl leading-relaxed">
                    {chap.summary || chap.content.slice(0, 140) + '...'}
                  </p>
                </div>

                <div className="flex items-center space-x-4 shrink-0 text-xs font-mono text-text-muted">
                  <span>{chap.wordCount} words</span>
                  <button
                    className="p-2 rounded bg-surface-secondary text-primary hover:bg-primary/20 transition-colors"
                    title="Open in Chapter Editor"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
