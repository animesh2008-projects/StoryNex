# STORYNEX — Product Requirements Document (PRD)

**Product Name:** STORYNEX  
**Tagline:** Every Story Has a Universe.  
**Version:** 1.0 (Hackathon MVP Release)  
**Status:** 50% Functional MVP Implemented + 50% Innovation Roadmap Documented  

---

## 1. Problem Statement
Contemporary AI writing assistants suffer from severe narrative amnesia:
1. They forget characters' motivations, fears, and speech cadences across successive chapters.
2. They invent contradictory facts (e.g., claiming radio communication is instantaneous when established lore specifies a 22-hour delay).
3. They overwrite author prose destructively without review checkpoints.
4. They cannot manage multiverse branching without duplicating or destroying the main canon.

## 2. Product Objectives
- Provide an author-first workspace where AI serves as a creative co-writer, not an automated replacement.
- Maintain rigorous continuity across characters, chapters, and world lore using an 8-Factor context engine and a 3-Layer story memory system.
- Provide a distraction-free writing environment with serif typography, autosave, focus mode, and non-destructive reviewable draft generation.
- Enable branching multiverse narratives where decisions fork into parallel continuations without altering canon.

## 3. Functional Requirements (FR) Status

| ID | Feature | Specification | Status |
|---|---|---|---|
| **FR-01** | User Authentication | Email/password, session persistence, route guards, account deletion workflow | **Implemented** |
| **FR-02** | Story Management | Title, premise, genre, tone style, status (draft/active/completed), CRUD, search, filter | **Implemented** |
| **FR-03** | Character Studio | 3D profiles (motivation, fears, goals, dialogue style, relationships), Gemini profile synthesis | **Implemented** |
| **FR-04** | Chapter Editor | 3-panel distraction-free workspace, serif typography, debounced autosave, word count, focus mode | **Implemented** |
| **FR-05** | Reviewable Drafts | AI generations appear as reviewable banners allowing "Replace" or "Append" without silent overwrites | **Implemented** |
| **FR-06** | Gemini Generation | 8-Factor Context Engine incorporating premise, genre, objective, cast psychology, lore facts, and branch state | **Implemented** |
| **FR-07** | Dialogue Doctor | Tunes dialogue lines to match character voice, subtext, and motivation | **Implemented** |
| **FR-08** | 3-Layer Memory | Layer 1 Universe State, Layer 2 Chapter Summaries, Layer 3 Lore Facts with source anchors | **Implemented** |
| **FR-09** | Continuity Checker | Scans content for character fear violations and lore discrepancies, returning actionable warnings | **Implemented** |
| **FR-10** | Branching Multiverse | 2-3 alternate choices per chapter, interactive tree visualization, separate continuation forks | **Implemented** |
| **FR-11** | Security Isolation | Firestore rules isolating `/users/{userId}/*` data; backend rate limiting and input validation | **Implemented** |
| **FR-12** | Data Sovereignty | Complete JSON export of all universes, characters, chapters, and memory facts | **Implemented** |

---

## 4. Part B: Remaining 50% Innovation Scope
The following modules represent the research and innovation roadmap, accessible via the interactive `/app/innovations` lab:
1. Vector Memory Trees with hierarchical embeddings and decay functions.
2. 10+ Chapter Non-Linear Multiverse branching with state convergence.
3. Autonomous NPC Backstory procedural generation.
4. Real-Time Dialect Adaptation with slang intensity sliders.
5. Multi-Agent Co-Writing Studio (The Architect, The Stylist, The Critic).
6. Interactive Lore Relationship Graphs.
7. Temporal Character Psychology matrices.
8. Hollywood-standard Screenplay Export (Fountain / Final Draft).
