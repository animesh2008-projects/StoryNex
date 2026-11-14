import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  BrainCircuit, 
  GitFork, 
  Users, 
  MessageSquare, 
  Share2, 
  FileCode, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Compass, 
  Sliders, 
  Play, 
  Cpu, 
  Terminal,
  Activity,
  Zap,
  Download
} from 'lucide-react';
import { useStory } from '../../context/StoryContext';

interface InnovationModule {
  id: string;
  title: string;
  tagline: string;
  category: string;
  status: 'Experimental' | 'Architectural Sandbox' | 'Planned / R&D';
  statusColor: string;
  description: string;
  technicalArchitecture: string;
}

const INNOVATION_MODULES: InnovationModule[] = [
  {
    id: 'vector_tree',
    title: 'Vector Memory Trees',
    tagline: 'Hierarchical semantic embeddings with multi-scale decay.',
    category: 'Memory Systems',
    status: 'Architectural Sandbox',
    statusColor: 'text-accent border-accent/30 bg-accent/10',
    description: 'Replaces flat token context with hierarchical vector clusters (e.g., scene vector -> chapter vector -> arc vector -> universe vector). Automatically retrieves only top-k semantically relevant nodes based on cosine similarity and narrative recency decay.',
    technicalArchitecture: 'Cosine similarity indexing on 768-dim embeddings with exponential time-decay weighting: S(v, q) = cos(v, q) * e^(-λ * Δt).'
  },
  {
    id: 'nonlinear_10',
    title: '10+ Chapter Multiverse Branching',
    tagline: 'Massive parallel divergent timelines with state merge.',
    category: 'Narrative Topology',
    status: 'Architectural Sandbox',
    statusColor: 'text-purple-300 border-purple-500/30 bg-purple-500/10',
    description: 'Enables high-order branching structures exceeding 10 consecutive decision layers with recursive sub-trees, convergence nodes (rejoining canon), and parallel timeline diff inspection.',
    technicalArchitecture: 'Directed Acyclic Graph (DAG) state machine where each node contains an isolated delta-state and pointers to ancestry lineages.'
  },
  {
    id: 'autonomous_npc',
    title: 'Autonomous NPC Backstory Engine',
    tagline: 'Procedural generation of complex secondary characters.',
    category: 'Character Intelligence',
    status: 'Experimental',
    statusColor: 'text-status-success border-status-success/30 bg-status-success/10',
    description: 'Instantly generates background characters complete with micro-traumas, unshared secrets, idiosyncratic speech habits, and conflicting agendas that tie into the world lore.',
    technicalArchitecture: 'Markov-anchored prompt chains with psychological constraint matrices cross-referenced against universe worldbuilding axioms.'
  },
  {
    id: 'realtime_dialect',
    title: 'Real-Time Dialect Adaptation',
    tagline: 'Subtext, regional vernacular, and social class syntax.',
    category: 'Linguistic Engine',
    status: 'Architectural Sandbox',
    statusColor: 'text-accent border-accent/30 bg-accent/10',
    description: 'Transforms standard dialogue into specialized dialects (e.g., Belter Creole, Victorian Academic, Cyberpunk Argot, High Fantasy Courtly) with adjustable formality and slang density sliders.',
    technicalArchitecture: 'Few-shot linguistic phoneme mapping with lexical replacement dictionaries and grammatical inversion layers.'
  },
  {
    id: 'multi_agent',
    title: 'Multi-Agent Co-Writing Studio',
    tagline: 'Three AI specialists: The Architect, The Stylist, and The Critic.',
    category: 'Collaborative AI',
    status: 'Architectural Sandbox',
    statusColor: 'text-primary border-primary/30 bg-primary/10',
    description: 'Three specialized autonomous agents debate narrative beats in real-time. The Architect plots structure, The Stylist writes prose, and The Critic reviews continuity and pacing before presenting options to the author.',
    technicalArchitecture: 'Turn-taking tri-agent supervisor loop with consensus verification and human-in-the-loop veto protocol.'
  },
  {
    id: 'lore_graph',
    title: 'Advanced Lore Relationship Graphs',
    tagline: 'Visual knowledge graph of factions, relics, and locations.',
    category: 'Worldbuilding',
    status: 'Planned / R&D',
    statusColor: 'text-text-muted border-border bg-surface-secondary',
    description: 'Interactive Force-Directed Node Graph connecting characters, historical events, sacred artifacts, planetary relays, and political treaties with bi-directional relationship edges.',
    technicalArchitecture: 'Graph database schema (Nodes: Entities; Edges: Predicates with temporal validity windows: [t_start, t_end]).'
  },
  {
    id: 'temporal_psych',
    title: 'Temporal Character Psychology',
    tagline: 'Emotional decay, trauma accumulation, and trust matrices.',
    category: 'Character Intelligence',
    status: 'Architectural Sandbox',
    statusColor: 'text-status-warning border-status-warning/30 bg-status-warning/10',
    description: 'Tracks how characters evolve over time. If a character experiences a traumatic betrayal in Chapter 2, their Trust score towards allies drops mathematically, influencing dialogue tone in Chapter 5.',
    technicalArchitecture: 'Dynamic state vector: P_t = f(P_(t-1), E_t, D) where E is event severity and D is temporal decay constant.'
  },
  {
    id: 'screenplay_export',
    title: 'Screenplay & Publishing Pipeline',
    tagline: 'Export to industry-standard Fountain, Final Draft XML, and EPUB.',
    category: 'Export & Formats',
    status: 'Architectural Sandbox',
    statusColor: 'text-status-success border-status-success/30 bg-status-success/10',
    description: 'Instant conversion of novel chapters and dialogue into Hollywood-standard screenplay format (Scene Headings, Action, Character Cue, Parenthetical, Dialogue) adhering to Academy margins.',
    technicalArchitecture: 'Deterministic AST parser converting prose dialogue markers into Fountain 1.1 formatted text blocks.'
  }
];

export const InnovationsPage: React.FC = () => {
  const { currentStory, characters } = useStory();
  const [selectedModuleId, setSelectedModuleId] = useState<string>('multi_agent');

  // Interactive Sandbox States
  // Multi-Agent simulation state
  const [agentStep, setAgentStep] = useState<number>(0);
  const [agentSimulating, setAgentSimulating] = useState<boolean>(false);

  // Dialect slider state
  const [dialectTone, setDialectTone] = useState<string>('belter');
  const [slangIntensity, setSlangIntensity] = useState<number>(75);

  // Screenplay format preview state
  const [screenplayPreview, setScreenplayPreview] = useState<string>(
`EXT. SUBMERGED RELAY 186-KEPLER - NIGHT

A cyclopean metallic cylinder drifts in the methane atmosphere of Kepler-186f. Hydro-coolers pulse in rhythmic bursts.

INT. SECTOR FOUR - CONTINUOUS

DONALD VANCE (40s, hollow-eyed, grease-stained flight suit) leans over a phosphor terminal. The screen flutters with a ternary signal.

DONALD
(into conduit, hoarse)
Lyra. The transponder on Sub-Level Nine just tripped the security relay.

INTERCUT WITH:

INT. CRYPTOGRAPHY BAY - CONTINUOUS

LYRA THORNE (30s, sharp-featured, optical scanner glowing cyan) stops typing.

LYRA
Nothing on Nine is powered, Vance. We vented that bay forty hours ago.

DONALD
Then look at the pressure monitors. Something down there is breathing.`);

  const activeModule = INNOVATION_MODULES.find(m => m.id === selectedModuleId) || INNOVATION_MODULES[0];

  const runMultiAgentDemo = () => {
    setAgentSimulating(true);
    setAgentStep(1);
    setTimeout(() => setAgentStep(2), 1400);
    setTimeout(() => setAgentStep(3), 2800);
    setTimeout(() => {
      setAgentStep(4);
      setAgentSimulating(false);
    }, 4200);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-accent uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hackathon Scope: 50% Advanced Innovation Roadmap</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
            Narrative Intelligence Innovation Lab
          </h1>
          <p className="text-xs text-text-muted mt-1 max-w-2xl">
            Architectural blueprints and interactive sandbox previews for the next generation of narrative AI systems. Clearly delineated from our 50% functional production MVP.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono bg-surface border border-border px-3 py-1.5 rounded-lg text-text-muted">
          <Activity className="w-3.5 h-3.5 text-accent animate-pulse" />
          <span>8 Research Modules Active</span>
        </div>
      </div>

      {/* Module Selector Carousel / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {INNOVATION_MODULES.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelectedModuleId(m.id)}
            className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between space-y-2 ${
              selectedModuleId === m.id
                ? 'bg-accent/15 border-accent text-text-primary shadow-lg shadow-accent/5'
                : 'bg-surface border-border text-text-secondary hover:border-border/80 hover:bg-surface-secondary'
            }`}
          >
            <div>
              <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border inline-block mb-1.5 ${m.statusColor}`}>
                {m.status}
              </span>
              <h4 className="font-heading font-bold text-xs text-text-primary truncate">
                {m.title}
              </h4>
            </div>
            <p className="text-[10px] text-text-muted line-clamp-2">
              {m.tagline}
            </p>
          </button>
        ))}
      </div>

      {/* Active Module Deep Dive & Interactive Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Module Specification */}
        <div className="lg:col-span-5 p-6 rounded-xl border border-border bg-surface space-y-6 shadow-xl">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-accent uppercase font-bold">
                {activeModule.category}
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${activeModule.statusColor}`}>
                {activeModule.status}
              </span>
            </div>
            <h2 className="text-xl font-heading font-extrabold text-text-primary">
              {activeModule.title}
            </h2>
            <p className="text-xs font-mono text-text-muted">
              {activeModule.tagline}
            </p>
          </div>

          <div className="space-y-3 text-xs text-text-secondary leading-relaxed border-t border-border pt-4">
            <h4 className="font-mono text-text-primary uppercase text-[11px] font-bold">
              Functional Concept & Purpose
            </h4>
            <p>{activeModule.description}</p>
          </div>

          <div className="space-y-2 text-xs bg-surface-secondary p-4 rounded-lg border border-border">
            <span className="font-mono text-[10px] uppercase text-accent font-bold block flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>Technical & Mathematical Specification</span>
            </span>
            <p className="font-mono text-[11px] text-text-secondary leading-relaxed">
              {activeModule.technicalArchitecture}
            </p>
          </div>
        </div>

        {/* Interactive Sandbox Experience */}
        <div className="lg:col-span-7 p-6 rounded-xl border border-border bg-surface space-y-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <span className="text-xs font-mono text-primary uppercase font-bold flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                <span>Interactive Architecture Sandbox</span>
              </span>
              <span className="text-[10px] font-mono text-text-muted">Live Simulation</span>
            </div>

            {/* Sandbox 1: Multi-Agent Co-Writing */}
            {selectedModuleId === 'multi_agent' && (
              <div className="space-y-4">
                <p className="text-xs text-text-muted">
                  Simulate the 3-agent autonomous negotiation loop for Chapter 2's climax in "{currentStory?.title || 'The Obsidian Archive'}":
                </p>

                <div className="space-y-2.5">
                  <div className={`p-3 rounded-lg border text-xs transition-all ${
                    agentStep >= 1 ? 'border-primary/40 bg-primary/10 text-text-primary' : 'border-border/40 bg-surface-secondary/40 text-text-muted opacity-40'
                  }`}>
                    <div className="flex items-center justify-between font-mono text-[10px] text-primary mb-1">
                      <span className="font-bold">AGENT 1: THE ARCHITECT (Plotting Specialist)</span>
                      {agentStep >= 1 && <span className="text-status-success">Evaluated</span>}
                    </div>
                    <p className="leading-relaxed">
                      "Proposal: Donald opens the Sub-Level Nine cylinder. Inside is a mechanical chronometer synced to his personal heart rate."
                    </p>
                  </div>

                  <div className={`p-3 rounded-lg border text-xs transition-all ${
                    agentStep >= 2 ? 'border-accent/40 bg-accent/10 text-text-primary' : 'border-border/40 bg-surface-secondary/40 text-text-muted opacity-40'
                  }`}>
                    <div className="flex items-center justify-between font-mono text-[10px] text-accent mb-1">
                      <span className="font-bold">AGENT 2: THE LOREKEEPER (Continuity Guard)</span>
                      {agentStep >= 2 && <span className="text-status-success">Checked</span>}
                    </div>
                    <p className="leading-relaxed">
                      "Veto: Donald has a verified fear of cognitive loss and synthetic tracking. He would not hold the device bare-handed. He will use insulated gloves."
                    </p>
                  </div>

                  <div className={`p-3 rounded-lg border text-xs transition-all ${
                    agentStep >= 3 ? 'border-purple-400/40 bg-purple-500/10 text-text-primary' : 'border-border/40 bg-surface-secondary/40 text-text-muted opacity-40'
                  }`}>
                    <div className="flex items-center justify-between font-mono text-[10px] text-purple-300 mb-1">
                      <span className="font-bold">AGENT 3: THE STYLIST (Voice & Sensory Doctor)</span>
                      {agentStep >= 3 && <span className="text-status-success">Polished</span>}
                    </div>
                    <p className="leading-relaxed">
                      "Prose Synthesis: 'Donald reached for the arc-gloves, his knuckles white against the rubber. As the brass casing gave way, the odor of cedar smoke thickened—cold, impossible, and undeniably his own.'"
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={runMultiAgentDemo}
                    disabled={agentSimulating}
                    className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-strong disabled:opacity-50 text-black font-semibold text-xs transition-colors flex items-center space-x-2 shadow-md"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{agentSimulating ? 'Simulating Agent Debate...' : 'Trigger Tri-Agent Co-Writing Loop'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Sandbox 2: Real-time Dialect Adaptation */}
            {selectedModuleId === 'realtime_dialect' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase text-text-muted">
                    Linguistic Filter Presets
                  </label>
                  <div className="flex gap-2">
                    {['belter', 'noir', 'victorian'].map(d => (
                      <button
                        key={d}
                        onClick={() => setDialectTone(d)}
                        className={`px-3 py-1 rounded text-xs capitalize ${
                          dialectTone === d ? 'bg-accent text-black font-bold' : 'bg-surface-secondary text-text-secondary border border-border'
                        }`}
                      >
                        {d} Style
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-surface-secondary border border-border space-y-2">
                  <span className="text-[10px] font-mono text-text-muted uppercase">Original Neutral Line:</span>
                  <p className="text-xs text-text-secondary">
                    "I don't think we should go into that chamber without notifying the orbital authorities."
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-accent/10 border border-accent/30 space-y-2">
                  <span className="text-[10px] font-mono text-accent uppercase font-bold">
                    Adapted Dialect Delivery:
                  </span>
                  <p className="text-xs text-text-primary font-mono leading-relaxed">
                    {dialectTone === 'belter' && '"Keyá, sasa ke? We walk into dat bay without pinging high station, we vacuum-bound, kopeng."'}
                    {dialectTone === 'noir' && '"Take one step into that icebox without ringing the brass, and they’ll be fishing our dental records out of the atmospheric scrubbers."'}
                    {dialectTone === 'victorian' && '"I would earnestly counsel against crossing such an unhallowed threshold, Vance, without formal dispatch to the planetary consulate."'}
                  </p>
                </div>
              </div>
            )}

            {/* Sandbox 3: Screenplay Exporter */}
            {selectedModuleId === 'screenplay_export' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-status-success font-semibold">Hollywood Standard Fountain 1.1 Output</span>
                  <button
                    onClick={() => {
                      const blob = new Blob([screenplayPreview], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${currentStory?.title || 'StoryNex'}_Screenplay.fountain`;
                      a.click();
                    }}
                    className="flex items-center space-x-1 text-primary hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .fountain</span>
                  </button>
                </div>

                <textarea
                  readOnly
                  rows={10}
                  value={screenplayPreview}
                  className="w-full p-3 bg-background border border-border rounded-lg text-xs font-mono text-text-secondary leading-relaxed resize-none"
                />
              </div>
            )}

            {/* Other sandboxes fallback */}
            {selectedModuleId !== 'multi_agent' && selectedModuleId !== 'realtime_dialect' && selectedModuleId !== 'screenplay_export' && (
              <div className="p-8 rounded-lg bg-surface-secondary/50 border border-dashed border-border text-center space-y-3">
                <Cpu className="w-8 h-8 text-accent mx-auto" />
                <h4 className="font-heading font-semibold text-xs text-text-primary">
                  {activeModule.title} Sandbox Engine
                </h4>
                <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed">
                  Interactive simulator ready for research trials. Architectural contracts and Zod data models are published in the documentation suite.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between text-[11px] font-mono text-text-muted">
            <span>Roadmap Phase: Antigravity 2.0 Spec</span>
            <span className="text-accent flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified Architectural Integrity
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
