import React, { useState, useEffect } from 'react';
import { useStory } from '../../context/StoryContext';
import { useAuth } from '../../context/AuthContext';
import { getAISettings, saveAISettings } from '../../services/ai-service';
import { isFirebaseConfigured } from '../../services/firebase';
import { 
  Settings, 
  KeyRound, 
  ShieldCheck, 
  Download, 
  Upload, 
  Trash2, 
  Check, 
  AlertCircle, 
  ExternalLink,
  Cpu,
  Layers,
  Database
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currentStory, stories } = useStory();
  const { currentUser, logout } = useAuth();

  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gemini-1.5-flash');
  const [temperature, setTemperature] = useState(0.7);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const s = getAISettings();
    setApiKey(s.apiKey);
    setModel(s.model);
    setTemperature(s.temperature);
  }, []);

  const handleSaveAISettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveAISettings({ apiKey, model, temperature });
    setSavedSuccess(true);
    setMessage("Gemini API configuration successfully saved.");
    setTimeout(() => {
      setSavedSuccess(false);
      setMessage(null);
    }, 3000);
  };

  const handleExportData = () => {
    const exportData = {
      exportTimestamp: Date.now(),
      author: currentUser?.displayName || 'Author',
      stories,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StoryNex_Backup_${Date.now()}.json`;
    a.click();
  };

  const handleClearAllData = () => {
    if (confirm("WARNING: Are you sure you want to erase all local stories, characters, and memories? This cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-border space-y-1">
        <span className="text-xs font-mono text-primary uppercase tracking-wider">
          System Configuration
        </span>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
          Settings & Credentials
        </h1>
        <p className="text-xs text-text-muted">
          Manage your AI intelligence provider, data isolation guarantees, and workspace exports.
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-lg bg-status-success/10 border border-status-success/30 text-status-success text-xs flex items-center space-x-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Google Gemini AI Configuration */}
      <section className="p-6 rounded-xl border border-border bg-surface space-y-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-primary" />
            <h2 className="font-heading font-bold text-base text-text-primary">
              Google Gemini API Engine
            </h2>
          </div>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-primary hover:underline flex items-center gap-1 font-mono"
          >
            <span>Get Gemini API Key</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <form onSubmit={handleSaveAISettings} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-text-muted mb-1.5">
              Gemini API Key
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-sm font-mono text-text-primary focus:outline-none focus:border-primary"
              />
            </div>
            <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
              Your API key is used exclusively for generating story drafts, dialogue, and memory summaries. It is never logged or exposed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-text-muted mb-1.5">
                Model Architecture
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs font-mono text-text-primary focus:outline-none focus:border-primary"
              >
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast, High Quality)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Reasoning, Long Context)</option>
                <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-text-muted mb-1.5">
                Creative Temperature ({temperature})
              </label>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-primary mt-2"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-strong text-black font-semibold text-xs transition-colors shadow-md flex items-center space-x-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save AI Credentials</span>
            </button>
          </div>
        </form>
      </section>

      {/* Persistence & Database Architecture */}
      <section className="p-6 rounded-xl border border-border bg-surface space-y-4 shadow-lg">
        <div className="flex items-center space-x-2 pb-3 border-b border-border">
          <Database className="w-5 h-5 text-accent" />
          <h2 className="font-heading font-bold text-base text-text-primary">
            Database & Persistence Layer
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-surface-secondary border border-border space-y-1">
            <span className="font-mono text-text-muted uppercase text-[10px]">Active Engine</span>
            <div className="font-semibold text-text-primary flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-status-success"></span>
              <span>{isFirebaseConfigured ? 'Cloud Firestore (Production)' : 'Resilient LocalStorage (Dev / Sandbox)'}</span>
            </div>
            <p className="text-[11px] text-text-muted mt-1">
              {isFirebaseConfigured ? 'Secured by Firestore Security Rules' : 'Instant offline persistence active'}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-surface-secondary border border-border space-y-1">
            <span className="font-mono text-text-muted uppercase text-[10px]">Author Identity</span>
            <div className="font-semibold text-text-primary truncate">
              {currentUser?.email || 'Guest Author'}
            </div>
            <p className="text-[11px] font-mono text-text-muted mt-1">
              UID: {currentUser?.uid.slice(0, 16)}...
            </p>
          </div>
        </div>
      </section>

      {/* Data Sovereignty & Backup Export */}
      <section className="p-6 rounded-xl border border-border bg-surface space-y-4 shadow-lg">
        <div className="flex items-center space-x-2 pb-3 border-b border-border">
          <Download className="w-5 h-5 text-purple-400" />
          <h2 className="font-heading font-bold text-base text-text-primary">
            Data Export & Sovereignty
          </h2>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed">
          You own 100% of your manuscripts. Export a complete JSON archive of all stories, chapters, character psychology profiles, and 3-layer story memories.
        </p>

        <div className="pt-2">
          <button
            onClick={handleExportData}
            className="px-4 py-2 rounded-lg bg-surface-secondary hover:bg-surface-secondary/80 border border-border text-xs text-text-primary font-medium transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4 text-primary" />
            <span>Export Complete Universe Backup (.json)</span>
          </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="p-6 rounded-xl border border-status-error/30 bg-surface space-y-4">
        <div className="flex items-center space-x-2 text-status-error">
          <Trash2 className="w-5 h-5" />
          <h2 className="font-heading font-bold text-base text-text-primary">
            Danger Zone
          </h2>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed">
          Permanently clear local manuscript caches, reset demo stories, or sign out.
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            onClick={handleClearAllData}
            className="px-4 py-2 rounded-lg bg-status-error/10 hover:bg-status-error/20 border border-status-error/30 text-status-error text-xs font-semibold transition-colors"
          >
            Reset All Local Data
          </button>
          <button
            onClick={() => logout()}
            className="px-4 py-2 rounded-lg bg-surface-secondary hover:bg-surface-secondary/80 border border-border text-text-muted hover:text-text-primary text-xs transition-colors"
          >
            Sign Out
          </button>
        </div>
      </section>
    </div>
  );
};
