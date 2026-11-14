import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Sparkles, User, LogOut, ArrowRight, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center p-1.5 transition-colors group-hover:border-primary">
            <img src="/logo.svg" alt="StoryNex Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-heading font-bold text-lg tracking-wider text-text-primary">
              STORY<span className="text-primary">NEX</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] tracking-widest text-text-muted uppercase font-mono">
              Narrative Intelligence
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-text-secondary">
          <Link to="/features" className="hover:text-text-primary transition-colors">
            Features
          </Link>
          <Link to="/about" className="hover:text-text-primary transition-colors">
            About
          </Link>
          <Link to="/app/innovations" className="flex items-center space-x-1.5 text-accent hover:text-cyan-300 transition-colors">
            <Sparkles className="w-3.5 h-3.5" />
            <span>50% Innovation Lab</span>
          </Link>
          <Link to="/privacy" className="hover:text-text-primary transition-colors">
            Privacy
          </Link>
        </nav>

        {/* Right Action / Auth CTA */}
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <div className="flex items-center space-x-3">
              <Link
                to="/app"
                className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-md bg-surface border border-border text-sm font-medium text-text-primary hover:border-primary/50 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-primary" />
                <span>Workspace</span>
              </Link>
              <div className="flex items-center space-x-2 pl-2 border-l border-border">
                <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-xs font-semibold text-primary">
                  {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                </div>
                <button
                  onClick={() => logout()}
                  title="Sign out"
                  className="p-1.5 text-text-secondary hover:text-text-primary transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors px-3 py-1.5"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-md bg-primary hover:bg-primary-strong text-black font-semibold text-sm transition-all shadow-sm"
              >
                <span>Start Writing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
