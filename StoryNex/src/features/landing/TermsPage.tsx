import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-text-primary">
          Terms of Service
        </h1>
        <p className="text-sm font-mono text-text-muted">
          Effective date: November 2026
        </p>
      </div>

      <div className="space-y-6 text-sm text-text-secondary leading-relaxed border-t border-border pt-8">
        <h2 className="text-lg font-heading font-bold text-text-primary">1. Acceptance of Terms</h2>
        <p>
          By accessing or using STORYNEX, you agree to be bound by these Terms of Service. If you do not agree, you may not access or use the application.
        </p>

        <h2 className="text-lg font-heading font-bold text-text-primary pt-4">2. Permitted Use</h2>
        <p>
          STORYNEX is intended as a creative writing and universe design workspace. You agree not to generate hate speech, non-consensual sexually explicit content, or dangerous instructions in violation of Google Gemini Acceptable Use Guidelines.
        </p>

        <h2 className="text-lg font-heading font-bold text-text-primary pt-4">3. Creative Sovereignty</h2>
        <p>
          You are the sole author and owner of your creative works. STORYNEX and its creators claim no ownership or royalties from any books, screenplays, or games you produce using the platform.
        </p>
      </div>
    </div>
  );
};
