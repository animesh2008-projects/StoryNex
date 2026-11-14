# STORYNEX — Testing & Quality Assurance

---

## 1. Test Suite Overview
Automated tests are powered by **Vitest** for fast, deterministic unit and component validation.

Run tests:
```bash
npm test
```

Current test status: **3 test files, 6 tests passing**.

---

## 2. Test Coverage Matrix

### A. Continuity Checker Engine (`tests/continuity-checker.test.ts`)
- **Fear Violations:** Verifies that when a character (e.g. Donald Vance) acts against their deep fear (e.g. "Synthetic AI") by expressing blind trust in station machines, a `character_conflict` warning with actionable resolution is returned.
- **Lore Violations:** Verifies that when draft prose attempts instant radio communications on an isolated relay with a verified 22-hour signal lag, a `worldbuilding_conflict` warning is triggered.
- **Passing State:** Confirms that compliant text returns zero false warnings.

### B. 8-Factor Context Assembly (`tests/context-builder.test.ts`)
- Verifies that the prompt compiler constructs an 8-factor packet containing Story Premise, Genre & Style, Chapter Objective, Cast Psychology, Continuity Anchors, Lore Facts, Multiverse Branch, and Author Directives without omission.

### C. Storage & Demo Generator (`tests/storage-adapter.test.ts`)
- Confirms pre-loaded demo universe ("The Obsidian Archive") instantiates with 2 characters, 2 chapters, 4 lore facts, and 2 multiverse branches with complete owner isolation.

---

## 3. Manual QA Verification Checklist
- [x] Responsive layout tested on Desktop, Tablet, and Mobile viewport widths.
- [x] Focus mode (`Ctrl+Shift+F`) hides outline and inspector for distraction-free drafting.
- [x] Autosave debouncing verified: 1200ms delay prevents excessive writes.
- [x] AI Reviewable Drafts tested: user can replace or append without unconfirmed overwrites.
- [x] Gemini API key configuration in Settings verified: status banners and error guidance work cleanly.
- [x] Multiverse branch creation tested: adding Choice A and Choice B forks new continuations without mutating Chapter 1.
