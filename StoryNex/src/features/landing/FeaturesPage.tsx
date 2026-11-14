import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BrainCircuit, 
  Users, 
  GitFork, 
  PenTool, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Layers,
  ArrowRight,
  Cpu,
  Lock,
  Compass
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-surface border border-border text-xs font-mono text-primary">
          <Compass className="w-3.5 h-3.5" />
          <span>ARCHITECTURE & CAPABILITIES</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-text-primary">
          The Narrative Intelligence Engine
        </h1>
        <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
          STORYNEX transforms AI from a disconnected text predictor into a persistent universe co-writer that respects your worldbuilding.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Feature 1 */}
        <div className="p-8 rounded-xl border border-border bg-surface space-y-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Cpu className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-heading font-bold text-text-primary">8-Factor Context Assembly</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Rather than dumping entire manuscripts or sending empty prompts, STORYNEX dynamically constructs an optimized prompt packet incorporating premise, tone, chapter goals, active characters, lore facts, and active branch context.
          </p>
          <div className="p-3 rounded bg-surface-secondary text-xs font-mono text-text-muted space-y-1">
            <div>1. Story Premise & Universe Baseline</div>
            <div>2. Genre & Specific Stylistic Cadence</div>
            <div>3. Current Chapter Goal & Dramatic Stakes</div>
            <div>4. Participating Character Psychology & Fears</div>
            <div>5. Previous Chapter Summary Anchors</div>
            <div>6. Approved Lore Facts (Importance &gt;= 3)</div>
            <div>7. Narrative Decision Fork Context</div>
            <div>8. Author's Real-Time Directives</div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="p-8 rounded-xl border border-border bg-surface space-y-4">
          <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-heading font-bold text-text-primary">3-Layer Narrative Memory</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Long-term story memory is split across three distinct operational layers. The author reviews every extracted fact, ensuring the AI never hallucinates or overrides established canon.
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded bg-surface-secondary border border-border">
              <span className="font-semibold text-primary">Layer 1: Universe State</span>
              <p className="text-text-muted mt-0.5">High-level overarching narrative conditions and core conflicts.</p>
            </div>
            <div className="p-2.5 rounded bg-surface-secondary border border-border">
              <span className="font-semibold text-accent">Layer 2: Chapter Summaries</span>
              <p className="text-text-muted mt-0.5">Sequential ledger of what occurred in each chapter.</p>
            </div>
            <div className="p-2.5 rounded bg-surface-secondary border border-border">
              <span className="font-semibold text-purple-400">Layer 3: Structured Facts & Lore</span>
              <p className="text-text-muted mt-0.5">Character facts, world rules, unresolved mysteries, and relationship changes.</p>
            </div>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="p-8 rounded-xl border border-border bg-surface space-y-4">
          <div className="w-12 h-12 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-heading font-bold text-text-primary">Character Psychology Studio</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Characters are defined by their internal psychology, motivations, deepest fears, and dialogue style. When generating dialogue or character actions, the model is bound by these personality anchors.
          </p>
          <ul className="text-xs text-text-secondary space-y-1.5 list-disc list-inside">
            <li>Generate complete 3D psychological profiles with Gemini.</li>
            <li>Define unique cadence, speech vocabulary, and subtext tendencies.</li>
            <li>Track evolving relational dynamics across chapters.</li>
            <li>Instant dialogue rewrite engine matching character voice.</li>
          </ul>
        </div>

        {/* Feature 4 */}
        <div className="p-8 rounded-xl border border-border bg-surface space-y-4">
          <div className="w-12 h-12 rounded-lg bg-status-success/10 border border-status-success/20 flex items-center justify-center text-status-success">
            <GitFork className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-heading font-bold text-text-primary">Branching Multiverse Explorer</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Create critical decision points with 2 or 3 alternative choices. Branch off into alternate continuations without modifying or destroying the primary story timeline.
          </p>
          <ul className="text-xs text-text-secondary space-y-1.5 list-disc list-inside">
            <li>Interactive decision tree visualization.</li>
            <li>Isolated branch chapters with dedicated memory states.</li>
            <li>Switch between main canon and alternate timelines with 1 click.</li>
            <li>Compare character reactions across divergent plot points.</li>
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-8">
        <Link
          to="/register"
          className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-lg bg-primary hover:bg-primary-strong text-black font-semibold text-base transition-all"
        >
          <span>Experience the Engine</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
