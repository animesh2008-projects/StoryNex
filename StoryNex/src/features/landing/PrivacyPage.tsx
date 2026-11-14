import React from 'react';
import { ShieldCheck, Lock, EyeOff, Trash2 } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-status-success uppercase">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Security & Data Governance</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-text-primary">
          Privacy Policy
        </h1>
        <p className="text-sm font-mono text-text-muted">
          Last updated: November 2026 • STORYNEX Data Policy v1.0
        </p>
      </div>

      <div className="space-y-8 text-sm text-text-secondary leading-relaxed border-t border-border pt-8">
        <section className="space-y-3">
          <h2 className="text-lg font-heading font-bold text-text-primary flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            1. Author Ownership & Copyright
          </h2>
          <p>
            You retain 100% ownership, copyright, and intellectual property rights over all stories, characters, lore, and text created or generated within STORYNEX. We claim zero proprietary stake in your manuscripts.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-heading font-bold text-text-primary flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-accent" />
            2. Strict Per-User Data Isolation
          </h2>
          <p>
            All stories, chapters, characters, memories, and branches are stored in per-user sandboxes enforced through Firebase Firestore Security Rules. User A can never query, read, or modify User B's narrative universes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-heading font-bold text-text-primary flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            3. AI Provider Transparency & Training Stance
          </h2>
          <p>
            STORYNEX connects to the Google Gemini API solely to generate your requested content during active sessions. When using the Google Gemini API with commercial developer terms, customer prompts and outputs are not used to train Google models. We do not sell your narrative data to third parties.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-heading font-bold text-text-primary flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-status-error" />
            4. Data Deletion Workflow
          </h2>
          <p>
            You can permanently delete individual stories, characters, chapters, and entire account data at any time from your Settings panel. When deleted, all associated records in Firestore and local caches are irrevocably expunged.
          </p>
        </section>
      </div>
    </div>
  );
};
