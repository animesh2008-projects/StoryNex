# STORYNEX — Database Schema Specification

All documents are scoped under `/users/{uid}/stories/{storyId}` to guarantee strict user-level isolation.

---

## 1. Story Document
**Path:** `/users/{uid}/stories/{storyId}`

```typescript
interface Story {
  id: string;               // Unique story universe identifier
  ownerId: string;          // Firebase UID of author
  title: string;            // Universe title (e.g., "The Obsidian Archive")
  premise: string;          // Core narrative premise & conflict
  genre: string;            // Primary genre (e.g., "Sci-Fi / Space Mystery")
  writingStyle: string;     // Stylistic tone instruction
  status: "draft" | "active" | "completed";
  createdAt: number;        // Epoch timestamp (ms)
  updatedAt: number;        // Epoch timestamp (ms)
  chapterCount: number;     // Total chapters in outline
  characterCount: number;   // Total active characters
}
```

---

## 2. Chapter Document
**Path:** `/users/{uid}/stories/{storyId}/chapters/{chapterId}`

```typescript
interface Chapter {
  id: string;               // Unique chapter identifier
  storyId: string;          // Parent story identifier
  title: string;            // Chapter title
  order: number;            // Chronological order (1, 2, 3...)
  content: string;          // Full prose manuscript
  summary: string;          // 2-3 sentence memory summary
  status: "draft" | "generated" | "final";
  wordCount: number;        // Real-time word count
  branchId?: string | null; // Associated branch if forked
  parentChapterId?: string | null;
  createdAt: number;
  updatedAt: number;
}
```

---

## 3. Character Document
**Path:** `/users/{uid}/stories/{storyId}/characters/{characterId}`

```typescript
interface Character {
  id: string;
  storyId: string;
  name: string;             // Full character name (e.g. "Donald Vance")
  role: string;             // Archetype (e.g. "Lead Relic Archivist")
  personality: string[];    // ["Meticulous", "Skeptical", "Haunted"]
  background: string;       // Origin context
  motivation: string;       // Primary driving desire
  goals: string[];          // Immediate and long-term goals
  fears: string[];          // Psychological vulnerabilities (e.g. "Synthetic AI")
  dialogueStyle: string;    // Cadence, verbal habits, subtext
  relationships: Array<{
    characterId: string;
    characterName: string;
    description: string;
  }>;
  createdAt: number;
  updatedAt: number;
}
```

---

## 4. Memory Document (3-Layer Memory)
**Path:** `/users/{uid}/stories/{storyId}/memories/{memoryId}`

```typescript
interface StoryMemory {
  id: string;
  storyId: string;
  type: 
    | "world_fact"          // Planetary rules, physics, technology
    | "character_fact"      // Hidden past, physical traits
    | "event"               // Historical incident (e.g. Sub-Level 9 breach)
    | "relationship"        // Relational shift between characters
    | "chapter_summary";    // Chapter ledger entry
  title?: string;
  content: string;          // Concrete lore statement
  sourceChapterId?: string; // Originating chapter reference
  sourceChapterTitle?: string;
  importance: number;       // 1 (minor) to 5 (paramount canon rule)
  status?: "suggested" | "approved";
  createdAt: number;
  updatedAt: number;
}
```

---

## 5. Branch Document
**Path:** `/users/{uid}/stories/{storyId}/branches/{branchId}`

```typescript
interface StoryBranch {
  id: string;
  storyId: string;
  parentChapterId: string;  // The chapter where decision occurs
  parentChapterTitle?: string;
  choiceText: string;       // Description of decision
  label: string;            // e.g. "Choice A: Immediate Disclosure"
  nextChapterId?: string;   // Pointer to continuation chapter if written
  status: "draft" | "active" | "completed";
  createdAt: number;
}
```
