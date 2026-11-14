import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/app');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await login('creator@storynex.universe', 'author1234');
      navigate('/app');
    } catch (err: any) {
      setError(err.message || 'Error signing in as demo author');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-surface border border-border p-8 rounded-xl shadow-xl">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-surface-secondary border border-border flex items-center justify-center p-1">
              <img src="/logo.svg" alt="StoryNex" className="w-full h-full" />
            </div>
            <span className="font-heading font-bold text-lg tracking-wider text-text-primary">
              STORY<span className="text-primary">NEX</span>
            </span>
          </Link>
          <h2 className="text-2xl font-heading font-bold text-text-primary">
            Welcome back, Author
          </h2>
          <p className="text-xs text-text-secondary">
            Access your fictional universes and continuing drafts.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-status-error/10 border border-status-error/30 text-status-error text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="author@example.com"
                className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-text-muted">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-primary hover:bg-primary-strong disabled:opacity-50 text-black font-semibold rounded-lg text-sm transition-all flex items-center justify-center space-x-2 shadow-md"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative border-t border-border pt-4">
          <div className="text-center text-xs text-text-muted mb-3 font-mono">
            OR EXPLORE INSTANTLY
          </div>
          <button
            type="button"
            onClick={handleDemoSignIn}
            disabled={loading}
            className="w-full py-2 px-4 bg-surface-secondary hover:bg-surface-secondary/80 border border-border text-text-primary rounded-lg text-xs font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Sign In with Demo Creator Universe</span>
          </button>
        </div>

        <p className="text-center text-xs text-text-muted">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-primary hover:underline font-medium">
            Create universe account
          </Link>
        </p>
      </div>
    </div>
  );
};
