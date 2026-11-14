import React from 'react';
import { NavLink, Link, useNavigate, useParams } from 'react-router-dom';
import { useStory } from '../../context/StoryContext';
import { 
  LayoutDashboard, 
  BookMarked, 
  PenTool, 
  Users, 
  BrainCircuit, 
  GitFork, 
  Sparkles, 
  Settings, 
  PlusCircle, 
  ChevronDown,
  Layers,
  ArrowLeft
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { stories, currentStory, selectStory, chapters } = useStory();
  const navigate = useNavigate();
  const params = useParams();

  // Pick first chapter id for direct editor shortcut
  const firstChapterId = chapters[0]?.id;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-surface border-r border-border
        flex flex-col transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-border flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-secondary border border-border flex items-center justify-center p-1">
              <img src="/logo.svg" alt="StoryNex" className="w-full h-full" />
            </div>
            <span className="font-heading font-bold text-base tracking-wider text-text-primary">
              STORY<span className="text-primary">NEX</span>
            </span>
          </Link>
          <Link 
            to="/" 
            title="Return to Public Site" 
            className="p-1.5 text-text-muted hover:text-text-primary rounded hover:bg-surface-secondary"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Story Selector Dropdown */}
        <div className="p-3 border-b border-border bg-surface-secondary/50">
          <div className="text-[11px] font-mono uppercase tracking-wider text-text-muted mb-1 px-1 flex justify-between items-center">
            <span>Universe Scope</span>
            <Link to="/app/stories/new" className="text-primary hover:text-primary-strong flex items-center gap-0.5">
              <PlusCircle className="w-3 h-3" />
              <span>New</span>
            </Link>
          </div>
          <div className="relative">
            <select
              value={currentStory?.id || ''}
              onChange={(e) => {
                if (e.target.value === 'new') {
                  navigate('/app/stories/new');
                } else if (e.target.value) {
                  selectStory(e.target.value);
                }
              }}
              className="w-full appearance-none bg-surface border border-border rounded-md px-3 py-2 pr-8 text-xs font-medium text-text-primary focus:outline-none focus:border-primary cursor-pointer truncate"
            >
              {stories.length === 0 ? (
                <option value="">No stories created</option>
              ) : (
                stories.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.genre})
                  </option>
                ))
              )}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 text-sm font-medium">
          <div className="px-2 pb-1 text-[10px] font-mono uppercase tracking-wider text-text-muted">
            Workspace
          </div>

          <NavLink
            to="/app"
            end
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center space-x-3 px-3 py-2 rounded-md transition-colors
              ${isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'}
            `}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/app/stories"
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center space-x-3 px-3 py-2 rounded-md transition-colors
              ${isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'}
            `}
          >
            <BookMarked className="w-4 h-4" />
            <span>All Stories</span>
          </NavLink>

          {currentStory && (
            <NavLink
              to={`/app/stories/${currentStory.id}/chapters/${firstChapterId || 'new'}`}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center space-x-3 px-3 py-2 rounded-md transition-colors
                ${isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'}
              `}
            >
              <PenTool className="w-4 h-4 text-primary" />
              <div className="flex-1 truncate">
                <span>Chapter Editor</span>
              </div>
              <span className="text-[10px] font-mono bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                Live
              </span>
            </NavLink>
          )}

          <div className="pt-4 px-2 pb-1 text-[10px] font-mono uppercase tracking-wider text-text-muted">
            Narrative Intelligence
          </div>

          <NavLink
            to="/app/characters"
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center space-x-3 px-3 py-2 rounded-md transition-colors
              ${isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'}
            `}
          >
            <Users className="w-4 h-4" />
            <span>Character Studio</span>
          </NavLink>

          <NavLink
            to="/app/memory"
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center space-x-3 px-3 py-2 rounded-md transition-colors
              ${isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'}
            `}
          >
            <BrainCircuit className="w-4 h-4 text-accent" />
            <div className="flex-1">
              <span>Story Memory</span>
            </div>
            <span className="text-[10px] font-mono text-accent">3-Layer</span>
          </NavLink>

          <NavLink
            to="/app/branches"
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center space-x-3 px-3 py-2 rounded-md transition-colors
              ${isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'}
            `}
          >
            <GitFork className="w-4 h-4" />
            <span>Branch Explorer</span>
          </NavLink>

          <NavLink
            to="/app/assistant"
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center space-x-3 px-3 py-2 rounded-md transition-colors
              ${isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'}
            `}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span>AI Co-Writer</span>
          </NavLink>

          <div className="pt-4 px-2 pb-1 text-[10px] font-mono uppercase tracking-wider text-accent/80 flex items-center justify-between">
            <span>50% Innovation</span>
            <span className="text-[9px] bg-accent/10 text-accent px-1 rounded">Part B</span>
          </div>

          <NavLink
            to="/app/innovations"
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center space-x-3 px-3 py-2 rounded-md transition-colors
              ${isActive ? 'bg-accent/10 text-accent border border-accent/20' : 'text-text-secondary hover:text-accent hover:bg-surface-secondary'}
            `}
          >
            <Layers className="w-4 h-4 text-accent" />
            <span>Innovation Lab</span>
          </NavLink>
        </nav>

        {/* Footer / Settings */}
        <div className="p-3 border-t border-border bg-surface-secondary/30">
          <NavLink
            to="/app/settings"
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
              ${isActive ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'}
            `}
          >
            <Settings className="w-4 h-4" />
            <span>Settings & Keys</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
};
