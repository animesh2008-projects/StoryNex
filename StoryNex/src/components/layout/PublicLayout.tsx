import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { Sparkles, Shield, Compass, BookOpen, ExternalLink } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      <Navbar />
      
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-border bg-surface text-text-secondary text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1 space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-surface-secondary border border-border flex items-center justify-center p-1">
                  <img src="/logo.svg" alt="StoryNex" className="w-full h-full" />
                </div>
                <span className="font-heading font-bold text-base tracking-wider text-text-primary">
                  STORY<span className="text-primary">NEX</span>
                </span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                Every Story Has a Universe. AI-powered narrative intelligence platform designed to maintain character psychology, story memory, and branching storylines.
              </p>
              <div className="text-[11px] font-mono text-text-muted">
                First 50% MVP + 50% Innovation Roadmap
              </div>
            </div>

            <div>
              <h4 className="font-heading font-semibold text-text-primary text-xs uppercase tracking-wider mb-3">
                Platform
              </h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/features" className="hover:text-text-primary">Narrative Intelligence</Link></li>
                <li><Link to="/app" className="hover:text-text-primary">Writing Workspace</Link></li>
                <li><Link to="/app/characters" className="hover:text-text-primary">Character Studio</Link></li>
                <li><Link to="/app/memory" className="hover:text-text-primary">3-Layer Story Memory</Link></li>
                <li><Link to="/app/branches" className="hover:text-text-primary">Branch Explorer</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-semibold text-text-primary text-xs uppercase tracking-wider mb-3">
                Research & Innovation
              </h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/app/innovations" className="hover:text-accent flex items-center gap-1 text-accent"><span>50% Innovation Lab</span> <Sparkles className="w-3 h-3"/></Link></li>
                <li><Link to="/app/innovations" className="hover:text-text-primary">Vector Memory Trees</Link></li>
                <li><Link to="/app/innovations" className="hover:text-text-primary">Lore Relationship Graph</Link></li>
                <li><Link to="/app/innovations" className="hover:text-text-primary">Multi-Agent Co-Writing</Link></li>
                <li><Link to="/app/innovations" className="hover:text-text-primary">Temporal Character Psychology</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-semibold text-text-primary text-xs uppercase tracking-wider mb-3">
                Trust & Legal
              </h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/about" className="hover:text-text-primary">About the Project</Link></li>
                <li><Link to="/privacy" className="hover:text-text-primary">Privacy & Data Isolation</Link></li>
                <li><Link to="/terms" className="hover:text-text-primary">Terms of Service</Link></li>
                <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-text-primary flex items-center gap-1"><span>Documentation</span> <ExternalLink className="w-3 h-3"/></a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted">
            <p>© {new Date().getFullYear()} STORYNEX. The author always retains creative control.</p>
            <p className="mt-2 sm:mt-0 font-mono text-[11px]">
              Built with Google Gemini & Firebase
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
