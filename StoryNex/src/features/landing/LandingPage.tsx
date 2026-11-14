import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  BrainCircuit, 
  GitFork, 
  Users, 
  PenTool, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Terminal,
  BookOpen,
  ChevronRight,
  Eye,
  AlertTriangle
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'editor' | 'characters' | 'memory' | 'branches'>('editor');

  return (
    <div className="space-y-24 py-12 md:py-16">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-surface border border-border text-xs font-mono text-primary animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-POWERED NARRATIVE INTELLIGENCE PLATFORM</span>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-extrabold tracking-tight text-text-primary leading-[1.1]">
            Every Story Has a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-300 to-accent">Universe.</span>
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto font-sans leading-relaxed">
            Build characters with depth, preserve every important detail, and explore stories that evolve with every decision. The author always retains creative control.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-lg bg-primary hover:bg-primary-strong text-black font-semibold text-base transition-all shadow-lg hover:shadow-primary/20"
          >
            <span>Start Writing</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/app"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-lg bg-surface hover:bg-surface-secondary border border-border text-text-primary font-medium text-base transition-colors"
          >
            <BookOpen className="w-4 h-4 text-text-muted" />
            <span>Explore the Workspace</span>
          </Link>
        </div>

        {/* Feature Badges */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-text-muted font-mono">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-status-success" />
            <span>50% Fully Functional MVP</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-status-success" />
            <span>3-Layer Narrative Memory</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-status-success" />
            <span>Psychological Continuity Guard</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-accent" />
            <span>Multiverse Branching</span>
          </div>
        </div>
      </section>

      {/* Interactive Workspace Preview Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="border border-border rounded-xl bg-surface/90 overflow-hidden shadow-2xl">
          {/* Top Window Bar */}
          <div className="h-11 border-b border-border bg-surface-secondary/80 px-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-status-error/60"></div>
              <div className="w-3 h-3 rounded-full bg-status-warning/60"></div>
              <div className="w-3 h-3 rounded-full bg-status-success/60"></div>
              <span className="ml-3 font-mono text-xs text-text-muted">
                STORYNEX Studio v1.0 — "The Obsidian Archive"
              </span>
            </div>

            {/* Preview View Switcher */}
            <div className="hidden sm:flex items-center space-x-1 bg-surface p-1 rounded-md border border-border text-xs">
              <button 
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1 rounded transition-colors ${activeTab === 'editor' ? 'bg-primary/20 text-primary font-medium' : 'text-text-secondary hover:text-text-primary'}`}
              >
                3-Panel Editor
              </button>
              <button 
                onClick={() => setActiveTab('characters')}
                className={`px-3 py-1 rounded transition-colors ${activeTab === 'characters' ? 'bg-primary/20 text-primary font-medium' : 'text-text-secondary hover:text-text-primary'}`}
              >
                Character Studio
              </button>
              <button 
                onClick={() => setActiveTab('memory')}
                className={`px-3 py-1 rounded transition-colors ${activeTab === 'memory' ? 'bg-primary/20 text-primary font-medium' : 'text-text-secondary hover:text-text-primary'}`}
              >
                Story Memory
              </button>
              <button 
                onClick={() => setActiveTab('branches')}
                className={`px-3 py-1 rounded transition-colors ${activeTab === 'branches' ? 'bg-primary/20 text-primary font-medium' : 'text-text-secondary hover:text-text-primary'}`}
              >
                Branch Tree
              </button>
            </div>
          </div>

          {/* Simulated Workspace View */}
          <div className="p-6 bg-background/60">
            {activeTab === 'editor' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[440px] text-xs">
                {/* Left Panel: Outline & Branches */}
                <div className="md:col-span-3 border border-border bg-surface p-3.5 rounded-lg flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="font-mono text-[11px] text-text-muted uppercase tracking-wider flex justify-between">
                      <span>Chapters</span>
                      <span className="text-primary">2 Active</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="p-2 rounded bg-surface-secondary border border-border/80 flex items-center justify-between">
                        <span className="font-medium text-text-primary truncate">Prologue: Static Over Kepler</span>
                        <span className="text-[10px] font-mono text-status-success">Final</span>
                      </div>
                      <div className="p-2 rounded bg-primary/10 border border-primary/30 flex items-center justify-between">
                        <span className="font-medium text-primary truncate">Ch 1: The Sealed Conduit</span>
                        <span className="text-[10px] font-mono text-primary">Editing</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-border space-y-2">
                      <div className="font-mono text-[10px] text-text-muted uppercase">Active Branches</div>
                      <div className="p-1.5 rounded bg-surface-secondary/60 border border-border/50 text-[11px] text-accent">
                        • Choice A: Immediate Disclosure
                      </div>
                      <div className="p-1.5 rounded bg-surface-secondary/60 border border-border/50 text-[11px] text-text-secondary">
                        • Choice B: Solitary Investigation
                      </div>
                    </div>
                  </div>
                  <div className="font-mono text-[10px] text-text-muted">
                    Autosave: Synced 12s ago
                  </div>
                </div>

                {/* Center Panel: Serif Editor */}
                <div className="md:col-span-6 border border-border bg-surface p-5 rounded-lg flex flex-col justify-between">
                  <div className="space-y-3 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <h3 className="font-heading font-bold text-sm text-text-primary">Chapter 1: The Sealed Conduit</h3>
                      <span className="font-mono text-[11px] text-text-muted">422 words</span>
                    </div>
                    <div className="font-editor text-text-secondary text-sm leading-relaxed space-y-2 text-justify">
                      <p>
                        The bulkhead to Sub-Level Nine was secured with heavy manual hydraulic clamps, coated in a crust of crystallized coolant. Donald held the arc-torch while Lyra knelt in front of the bypass terminal.
                      </p>
                      <p className="text-text-primary">
                        "Someone overrode the lock from the inside," Lyra said, her flashlight beam cutting through the suspended dust motes. "The biometric signature is corrupted, but the authorization code was issued forty hours ago."
                      </p>
                      <p>
                        "Forty hours ago we were locked in the centrifuge during solar flare lockdown," Donald murmured.
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-text-muted">
                    <span>Focus Mode Ready (Ctrl+Shift+F)</span>
                    <span className="text-status-success flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-status-success"></span> Continuity Verified
                    </span>
                  </div>
                </div>

                {/* Right Panel: AI & Memory Inspector */}
                <div className="md:col-span-3 border border-border bg-surface p-3.5 rounded-lg space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="font-mono text-[11px] text-primary uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Co-Writer Assistant</span>
                    </div>
                    <div className="p-2.5 rounded bg-surface-secondary border border-border space-y-2">
                      <span className="font-medium text-text-primary text-[11px]">8-Factor Context Active:</span>
                      <ul className="text-[10px] text-text-muted space-y-1">
                        <li>• Characters: Donald Vance, Lyra Thorne</li>
                        <li>• Fact: Kepler radio delay is 22 hours</li>
                        <li>• Lore: Donald's fear of cognitive loss</li>
                      </ul>
                    </div>
                    <div className="space-y-1.5">
                      <button className="w-full py-1.5 px-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 rounded font-medium text-[11px] text-left flex items-center justify-between">
                        <span>Continue Dramatic Beat</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <button className="w-full py-1.5 px-2 bg-surface-secondary hover:bg-surface-secondary/80 text-text-secondary rounded text-[11px] text-left">
                        Doctor Dialogue Voice
                      </button>
                    </div>
                  </div>
                  <div className="p-2 rounded bg-status-warning/10 border border-status-warning/30 text-[10px] text-status-warning flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>Continuity Guard: Protects character motivation and timeline anchors.</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'characters' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[440px]">
                <div className="border border-border bg-surface p-4 rounded-lg space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center font-bold text-primary">
                      DV
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-text-primary">Donald Vance</h4>
                      <p className="text-xs text-text-muted">Lead Relic Archivist</p>
                    </div>
                  </div>
                  <div className="text-xs space-y-2 text-text-secondary">
                    <p><strong className="text-text-primary">Motivation:</strong> Uncover the true cause of frequency shifts before station decommissioning.</p>
                    <p><strong className="text-text-primary">Core Fear:</strong> Losing cognitive continuity; trusting synthetic intelligences.</p>
                    <p><strong className="text-text-primary">Dialogue Style:</strong> Measured, cadence-conscious, questions underlying motives before answering.</p>
                  </div>
                  <div className="pt-2 border-t border-border text-[11px] text-accent font-mono">
                    Relationship: Reluctant ally to Lyra Thorne (suspects planetary espionage)
                  </div>
                </div>

                <div className="border border-border bg-surface p-4 rounded-lg space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center font-bold text-accent">
                      LT
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-text-primary">Lyra Thorne</h4>
                      <p className="text-xs text-text-muted">Sub-Surface Cryptographer</p>
                    </div>
                  </div>
                  <div className="text-xs space-y-2 text-text-secondary">
                    <p><strong className="text-text-primary">Motivation:</strong> Retrieve the chronometer sequence without triggering orbital defense batteries.</p>
                    <p><strong className="text-text-primary">Core Fear:</strong> Total orbital de-orbiting into Kepler's ionosphere.</p>
                    <p><strong className="text-text-primary">Dialogue Style:</strong> Direct, razor-sharp technical precision, dry irony under stress.</p>
                  </div>
                  <div className="pt-2 border-t border-border text-[11px] text-accent font-mono">
                    Sealed Directives: Planetary security council orders unknown to Donald
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'memory' && (
              <div className="space-y-4 h-[440px] overflow-y-auto pr-1">
                <div className="p-3 border border-border bg-surface rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-primary uppercase">Layer 1: Universe State</span>
                    <span className="text-[10px] font-mono text-status-success">Approved</span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    Kepler-186f station operates in 22-hour signal isolation. A temporal signal was received from an unpowered bay.
                  </p>
                </div>
                <div className="p-3 border border-border bg-surface rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-accent uppercase">Layer 2: Chapter Summaries</span>
                    <span className="text-[10px] font-mono text-text-muted">Prologue & Chapter 1</span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    Donald breaches Sub-Level Nine with Lyra. They find Donald's personal biometric cipher was used during lockdown, accompanied by the organic scent of cedar.
                  </p>
                </div>
                <div className="p-3 border border-border bg-surface rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-purple-400 uppercase">Layer 3: Structured Facts</span>
                    <span className="text-[10px] font-mono text-text-muted">4 Facts Anchored</span>
                  </div>
                  <ul className="text-xs text-text-secondary space-y-1">
                    <li>• [WORLD] 22-hour planetary radio lag prevents real-time rescue.</li>
                    <li>• [EVENT] Sub-Level Nine unlocked from inside 40h prior.</li>
                    <li>• [RELATIONSHIP] Lyra conceals secret retrieval mission.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'branches' && (
              <div className="p-6 border border-border bg-surface rounded-lg h-[440px] flex flex-col items-center justify-center space-y-6">
                <div className="text-center space-y-1">
                  <div className="inline-block px-3 py-1 rounded bg-primary/20 text-primary font-mono text-xs">
                    Decision Point: Sub-Level Nine Cylinder Discovered
                  </div>
                  <p className="text-xs text-text-muted">Chapter 1 creates 2 parallel narrative possibilities:</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 w-full max-w-lg">
                  <div className="flex-1 p-3.5 rounded border border-accent/40 bg-accent/5 space-y-1 text-center">
                    <span className="text-[10px] font-mono text-accent uppercase">Choice A (Active Path)</span>
                    <p className="text-xs text-text-primary font-medium">Immediate Disclosure with Lyra</p>
                    <p className="text-[10px] text-text-muted">Fosters fragile trust; risks triggering automated alarms.</p>
                  </div>

                  <span className="font-mono text-xs text-text-muted">OR</span>

                  <div className="flex-1 p-3.5 rounded border border-border bg-surface-secondary/60 space-y-1 text-center">
                    <span className="text-[10px] font-mono text-text-muted uppercase">Choice B (Alternative)</span>
                    <p className="text-xs text-text-secondary font-medium">Solitary Investigation</p>
                    <p className="text-[10px] text-text-muted">Donald conceals relic; deepens suspicion with Lyra.</p>
                  </div>
                </div>

                <p className="text-[11px] font-mono text-text-muted">
                  STORYNEX preserves the original story path while generating isolated branch chapters.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Narrative Intelligence Pillars */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-heading font-bold text-text-primary">
            Beyond Ordinary AI Story Generators
          </h2>
          <p className="text-sm sm:text-base text-text-secondary">
            Generic LLMs forget chapter 2 by the time they write chapter 5, flattening characters into bland clones. STORYNEX solves continuity from the ground up.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-border bg-surface hover:border-primary/40 transition-colors space-y-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-lg text-text-primary">Character Psychology</h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Every character possesses immutable motivations, deep vulnerabilities, speech cadence, and interpersonal history that actively guide dialogue and decisions.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-surface hover:border-accent/40 transition-colors space-y-4">
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-lg text-text-primary">3-Layer Story Memory</h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Maintains an overarching universe summary, chapter summaries, and extracted lore facts. Automatically supplies relevant past events without flooding token limits.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-surface hover:border-purple-400/40 transition-colors space-y-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <GitFork className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-lg text-text-primary">Branching Multiverse</h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Fork key chapter decisions into distinct storylines. Compare alternate trajectories without risking accidental overwrites of your established canon.
            </p>
          </div>
        </div>
      </section>

      {/* 50/50 Hackathon Innovation Roadmap Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 rounded-2xl border border-accent/30 bg-surface-secondary/40 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-mono text-accent uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hackathon 50/50 Implementation Protocol</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
                50% Production MVP + 50% Innovation Roadmap
              </h3>
            </div>
            <Link
              to="/app/innovations"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded bg-accent/20 hover:bg-accent/30 text-accent border border-accent/40 font-mono text-xs transition-colors self-start md:self-auto"
            >
              <span>Explore Innovation Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-5 rounded-xl border border-border bg-surface space-y-3">
              <span className="font-mono text-status-success font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Part A: Fully Functional MVP (Implemented)
              </span>
              <ul className="space-y-1.5 text-text-secondary">
                <li>• Responsive 3-Panel Chapter Editor with autosave & word count</li>
                <li>• Firebase Authentication & strict Firestore Security Rules</li>
                <li>• Full Story and Character Studio with Gemini generation</li>
                <li>• 8-Factor contextual AI generation via Google Gemini API</li>
                <li>• 3-Layer Narrative Memory (universe, chapters, lore facts)</li>
                <li>• Continuity checking engine with character motivation audits</li>
                <li>• 2-3 Choice Narrative Branching with persistent story trees</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl border border-border bg-surface space-y-3">
              <span className="font-mono text-accent font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> Part B: Advanced Innovation (Interactive Labs)
              </span>
              <ul className="space-y-1.5 text-text-secondary">
                <li>• Vector Memory Trees & embedding-based semantic retrieval</li>
                <li>• 10+ Chapter Non-Linear Multiverse Simulation</li>
                <li>• Autonomous NPC Backstory Generation & World Engine</li>
                <li>• Real-Time Dialect Adaptation & Subtext Analyzer</li>
                <li>• Multi-Agent Co-Writing Studio (Plotter, Voice, Critic)</li>
                <li>• Temporal Character Psychology Timelines & Lore Graphs</li>
                <li>• Screenplay Export (Fountain / Final Draft Industry Standard)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-6 pt-8">
        <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-text-primary">
          Ready to construct your fictional universe?
        </h2>
        <p className="text-sm sm:text-base text-text-secondary">
          Step into a workspace designed for serious creative writing where your lore, characters, and storylines stay in sync.
        </p>
        <div className="pt-2">
          <Link
            to="/register"
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-lg bg-primary hover:bg-primary-strong text-black font-semibold text-base transition-all shadow-xl hover:shadow-primary/30"
          >
            <span>Open STORYNEX Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
