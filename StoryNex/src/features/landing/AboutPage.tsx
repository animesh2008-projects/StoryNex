import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Shield, Heart, Sparkles, Feather } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-primary uppercase">
          <Feather className="w-3.5 h-3.5" />
          <span>Our Creative Manifesto</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-text-primary">
          The Author Remains in Control.
        </h1>
        <p className="text-lg text-text-secondary leading-relaxed">
          STORYNEX was conceived from a fundamental frustration with generic AI text generators: they overwrite the writer's vision, produce bland prose, and forget everything after two paragraphs.
        </p>
      </div>

      <div className="space-y-6 text-sm text-text-secondary leading-relaxed border-t border-border pt-8">
        <h2 className="text-xl font-heading font-bold text-text-primary">Why Narrative Intelligence Matters</h2>
        <p>
          Great fiction is not a sequence of disconnected sentences. It is an interlocking web of character psychology, historical events, worldbuilding rules, and dramatic cause-and-effect. When an author spends months developing a universe, they need tools that respect that architecture.
        </p>
        <p>
          STORYNEX acts as an attentive, hyper-literate creative co-writer sitting across the desk. It remembers what happened on page 12 when drafting page 200. It catches when a character violates their deepest fear without narrative justification. It allows the writer to explore "What if?" through branching multiverse trees without destroying established drafts.
        </p>

        <h2 className="text-xl font-heading font-bold text-text-primary pt-4">Our Technology Philosophy</h2>
        <p>
          Built on top of Google Gemini and Firebase with strict data isolation, STORYNEX treats user manuscripts as confidential and sacred. We do not use your private fiction for public model training. Every memory fact is subject to author approval.
        </p>
      </div>

      <div className="p-6 rounded-xl border border-border bg-surface flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-bold text-text-primary">Ready to explore?</h3>
          <p className="text-xs text-text-muted">Jump straight into the workspace with our pre-loaded universe.</p>
        </div>
        <Link
          to="/app"
          className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-strong text-black font-semibold text-xs transition-colors shrink-0"
        >
          Open Workspace
        </Link>
      </div>
    </div>
  );
};
