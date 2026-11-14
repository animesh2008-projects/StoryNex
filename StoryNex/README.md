# STORYNEX — Every Story Has a Universe.

**STORYNEX** is an AI-powered narrative creation and intelligence platform designed to help authors build, organize, and evolve fictional universes. 

Unlike conventional AI tools that generate isolated text snippets and forget plot points two paragraphs later, STORYNEX connects **character psychology**, **3-layer story memory**, **narrative decisions**, and **multiverse branches** to maintain rigorous continuity while keeping complete creative control in the author's hands.

---

## 🌟 Hackathon 50/50 Implementation Protocol

STORYNEX is divided strictly according to the **50% Functional MVP + 50% Innovation Roadmap** rule:

### Part A: 50% Fully Functional MVP (Implemented & Tested)
1. **Responsive Application Shell**: Desktop 3-panel workspace, tablet collapsible panels, mobile-first writing drawer.
2. **User Registration & Login**: Firebase Auth + persistent session and dev guest mode.
3. **User Dashboard**: Story universe switcher, recent chapters, continue writing shortcut, cast overview.
4. **Story Management**: Full CRUD, status filtering, genre presets, premise expansion.
5. **Character Studio**: Deep character psychology (motivations, fears, goals, dialogue style, relationships).
6. **Gemini Character Profiler**: One-click 3D character generator producing fully editable profiles.
7. **Chapter Editor**: Distraction-free 3-panel writing environment with Georgia/serif typography, debounced autosave, word count, focus mode (`Ctrl+Shift+F`), and keyboard shortcuts.
8. **Reviewable Draft Engine**: AI generations appear as reviewable draft banners—never silently overwriting author manuscripts.
9. **Gemini-Powered Chapter Generation**: Context-grounded generation using the 8-Factor Narrative Context System.
10. **Dialogue Doctor**: Refines spoken lines to match character cadence, subtext, and motivation.
11. **Scene Continuation**: Extends active dramatic beats without repeating past exposition.
12. **3-Layer Story Memory**: 
    - *Layer 1: Universe Baseline* (overarching conditions).
    - *Layer 2: Chapter Summaries* (chronological event ledger).
    - *Layer 3: Structured Facts & Lore* (character secrets, world rules, unresolved mysteries with source anchors).
13. **Continuity Checking Engine**: Scans drafts against character fears and world rules (e.g. 22-hour signal lag, unpowered bays).
14. **Branching Narratives**: Creates 2-3 alternate decisions per chapter with independent continuations without overwriting canon.
15. **Firebase Security Rules (`firestore.rules`)**: Strict per-user isolation denying cross-user reads/writes.
16. **Backend Authorization & Rate Limiting**: Express API server with Zod request validation and 5 req/min rate limits.
17. **Full Backup & Export**: JSON export of entire universe, characters, chapters, and memory facts.

### Part B: 50% Advanced Innovation Lab (Interactive Roadmap Previews)
1. **Vector Memory Trees**: Hierarchical embeddings with exponential time-decay weighting.
2. **10+ Chapter Non-Linear Multiverse**: High-order DAG branching structures with convergence nodes.
3. **Autonomous NPC Backstory Engine**: Procedural micro-traumas and conflicting agendas.
4. **Real-Time Dialect Adaptation**: Linguistic phoneme mapping (Belter Creole, Noir, Victorian Academic).
5. **Multi-Agent Co-Writing Studio**: Real-time tripartite consensus loop (The Architect, The Stylist, The Critic).
6. **Advanced Lore Graphs**: Interactive force-directed entity relationship maps.
7. **Temporal Character Psychology**: Dynamic trust and trauma decay vectors over time.
8. **Screenplay & Publishing Pipeline**: Hollywood-standard Fountain 1.1 script export.

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/StoryNex.git
cd StoryNex
npm install
```

### 2. Configure Environment (Optional)
Create a `.env` file in the root:
```env
# Optional: Firebase config (if omitted, resilient local persistence is used automatically)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_PROJECT_ID=

# Optional: Google Gemini API Key (can also be entered in Settings UI)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Run Automated Tests
```bash
npm test
```

### 5. Production Build
```bash
npm run build
```

---

## 🎨 Color Palette & Design System

- **Primary Background (Void Black):** `#0B0B0F`
- **Surface (Card & Sidebar):** `#15151C`
- **Secondary Surface:** `#1B1B24`
- **Border:** `#252530`
- **Primary Accent (Story Violet):** `#A78BFA`
- **Strong Accent (Deep Violet):** `#7C3AED`
- **Secondary Accent (Electric Cyan):** `#67E8F9`
- **Primary Text:** `#F4F4F5`
- **Muted Text:** `#A1A1AA`
- **Success:** `#4ADE80` | **Warning:** `#FBBF24` | **Error:** `#F87171`

---

## 📜 Documentation Index
- [`STORYNEX_MASTER_DOCUMENT.md`](./STORYNEX_MASTER_DOCUMENT.md) — Master product specification
- [`PRD.md`](./PRD.md) — Product Requirements Document
- [`UI_UX.md`](./UI_UX.md) — Interface Design & Interaction Specification
- [`SECURITY.md`](./SECURITY.md) — Security Architecture & Data Isolation
- [`COLOR_AND_BRANDING.md`](./COLOR_AND_BRANDING.md) — Brand Identity & Design Tokens
- [`TECH_STACK.md`](./TECH_STACK.md) — Technology Stack & Dependencies
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — System Architecture & Context Flow
- [`DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md) — Firestore & Local Data Models
- [`AI_PROMPTS_AND_MEMORY.md`](./AI_PROMPTS_AND_MEMORY.md) — 8-Factor Prompts & 3-Layer Memory
- [`API_SPEC.md`](./API_SPEC.md) — Backend API Endpoints & Error Codes
- [`DEVELOPMENT_GUIDE.md`](./DEVELOPMENT_GUIDE.md) — Local Setup & Development Workflow
- [`TESTING.md`](./TESTING.md) — Vitest & Test Plan Coverage
- [`DEPLOYMENT.md`](./DEPLOYMENT.md) — Netlify & Firebase Deployment Guide
- [`IMPLEMENTATION_ROADMAP.md`](./IMPLEMENTATION_ROADMAP.md) — 50/50 Implementation Status Report

---

*STORYNEX — The author always retains creative control.*
