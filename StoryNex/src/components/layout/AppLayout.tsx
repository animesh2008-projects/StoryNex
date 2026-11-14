import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Sidebar } from '../common/Sidebar';
import { useStory } from '../../context/StoryContext';
import { useAuth } from '../../context/AuthContext';
import { getAISettings } from '../../services/ai-service';
import { Menu, KeyRound, Sparkles, BookOpen, User, PlusCircle } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentStory } = useStory();
  const { currentUser } = useAuth();
  const aiSettings = getAISettings();
  const hasApiKey = Boolean(aiSettings.apiKey);

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar for Mobile & Universe Info */}
        <header className="h-14 border-b border-border bg-surface/80 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
            >
              <Menu className="w-5 h-5" />
            </button>
            {currentStory ? (
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-text-muted hidden sm:inline">Universe:</span>
                <span className="text-sm font-semibold text-text-primary truncate max-w-[200px] sm:max-w-xs">
                  {currentStory.title}
                </span>
                <span className="text-[10px] font-mono bg-surface-secondary text-primary px-2 py-0.5 rounded border border-border hidden md:inline">
                  {currentStory.genre}
                </span>
              </div>
            ) : (
              <div className="text-xs text-text-muted">
                No active universe selected
              </div>
            )}
          </div>

          {/* Quick status badges */}
          <div className="flex items-center space-x-3">
            {!hasApiKey && (
              <Link
                to="/app/settings"
                className="flex items-center space-x-1.5 px-2.5 py-1 text-xs rounded bg-status-warning/10 text-status-warning border border-status-warning/30 hover:bg-status-warning/20 transition-colors"
                title="Gemini API Key missing. Click to configure."
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Gemini Key</span>
              </Link>
            )}

            <div className="flex items-center space-x-2 text-xs text-text-secondary bg-surface-secondary px-2.5 py-1 rounded border border-border">
              <span className="w-2 h-2 rounded-full bg-status-success inline-block"></span>
              <span className="font-mono text-[11px] truncate max-w-[120px]">
                {currentUser?.displayName || 'Author'}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Outlet */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
