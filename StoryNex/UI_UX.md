# STORYNEX — UI/UX Design Specification

**Philosophy:** Cinematic, editorial, restrained, author-first. Avoid generic AI SaaS templates, glowing neon borders, and random floating particles.

---

## 1. Typography Hierarchy
- **Interface & System Labels:** Inter (`font-sans`) — Clean, legibly spaced for high information density.
- **Editorial Headings:** Manrope (`font-heading`) — Sophisticated, geometric with human warmth.
- **Writing Editor:** Georgia / Serif (`font-editor`) — 18px size, 1.85 line height, comfortable reading width (max-w-3xl) optimized for long-form creative writing sessions.
- **Technical & Metadata Labels:** JetBrains Mono (`font-mono`) — Used for word counts, timestamps, status badges, and prompt metrics.

---

## 2. Layout Architecture

### A. The 3-Panel Writing Workspace (`/app/stories/:id/chapters/:id`)
- **Left Panel (Width: 256px / 16rem):**
  - Universe chapter ledger with word counts and status indicators.
  - "Add Chapter" quick action.
  - Multiverse branch node indicators for current scene.
- **Center Panel (Flexible Width, Max-W: 768px):**
  - Chapter title input with subtle underline on focus.
  - Generous writing canvas with Georgia serif typography.
  - Sub-header status bar showing debounced autosave status ("Saving...", "Saved", "Unsaved changes") and real-time word count.
- **Right Panel (Width: 320px / 20rem):**
  - Tab 1: AI Co-Writer (8-Factor generation, scene continuation, dialogue doctor).
  - Tab 2: Cast Psychology (motivations, fears, voice cadences).
  - Tab 3: Story Memory (3-layer lore facts, importance scores).
  - Tab 4: Continuity Audit (actionable warning alerts with suggested fixes).
- **Focus Mode (`Ctrl+Shift+F`):**
  - Expands center writing canvas to full screen, hiding left and right panels for pure distraction-free drafting.

### B. Mobile & Tablet Responsiveness
- **Desktop (>= 1024px):** Complete 3-panel workspace visible simultaneously.
- **Tablet (768px - 1023px):** Left outline collapses into a slide-over drawer; right context panel is toggleable.
- **Mobile (< 768px):** Full-screen editor prioritized; top navigation bar provides drawer triggers for outline and AI tools.

---

## 3. Interaction States & Transitions
- **Reviewable Draft Banner:** Generated content never silently replaces author work. A prominent review bar presents options to "Replace Chapter", "Append to End", or "Discard".
- **Save Status Indicator:** Pulsing amber dot during debounced autosave (1.2s timeout) transitioning smoothly to green checkmark upon disk confirmation.
- **Continuity Warning Badges:** Amber alert pill with live count of inconsistencies in the top toolbar, opening directly to the audit panel upon click.
