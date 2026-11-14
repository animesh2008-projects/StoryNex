# STORYNEX — AI Prompts & Narrative Memory System

---

## 1. 8-Factor System Architecture
To avoid sending entire novels and overflowing token limits, STORYNEX dynamically synthesizes an 8-factor context packet:

```text
SYSTEM ROLE:
You are STORYNEX, an intelligent narrative co-writer and universe architect.
You preserve established story continuity, character psychology, and world rules.
The author retains complete creative control.

--- NARRATIVE CONTEXT (8-FACTOR SYSTEM) ---

UNIVERSE / STORY: "${story.title}"

1. STORY PREMISE:
"${story.premise}"

2. GENRE & WRITING STYLE:
Genre: ${story.genre}
Writing Style: ${story.writingStyle}

3. CHAPTER OBJECTIVE:
"${objective}"
Target Word Length: ${length}

4. ACTIVE CHARACTERS & PSYCHOLOGY:
${charactersContext}

5. PREVIOUS CHAPTER CONTINUITY:
${previousChapterContext}

6. ESTABLISHED STORY FACTS & LORE:
${importantFactsContext}

7. NARRATIVE BRANCH CONTEXT:
${branchContext}

8. AUTHOR'S SPECIFIC INSTRUCTIONS:
"${userInstructions}"
```

---

## 2. Structured JSON Output Schema
Gemini is instructed to return structured JSON matching this schema:

```json
{
  "title": "Evocative Chapter Title",
  "content": "Rich prose advancing the dramatic beat...",
  "summary": "2-3 sentence narrative memory log...",
  "continuityNotes": ["Key continuity anchor observed", "Character choice aligned with fear"],
  "unresolvedThreads": ["Open mystery 1", "Anomalous signal frequency"],
  "extractedFacts": [
    {
      "type": "world_fact",
      "content": "Concrete world rule established in this scene",
      "importance": 4
    }
  ]
}
```

---

## 3. 3-Layer Narrative Memory Engine
- **Layer 1: Master Universe Narrative State:** Contains foundational premise, global conflicts, and atmospheric rules.
- **Layer 2: Chapter Summaries:** Sequential ledger tracking the chronological chain of events.
- **Layer 3: Structured Facts & Lore:** Discrete verified items with source chapter pointers, importance scores (1 to 5), and author approval gates. AI suggestions are marked `suggested` until verified.
