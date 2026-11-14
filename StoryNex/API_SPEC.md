# STORYNEX — Backend API Specification

**Base URL:** `/api/v1`  
**Authentication:** `Authorization: Bearer <token>` or active session.

---

## Endpoints

### 1. `POST /api/v1/generate-chapter`
Synthesizes a structured chapter draft using the 8-Factor context engine.
- **Rate Limit:** 5 requests / minute / user.
- **Payload:**
  ```json
  {
    "story": {
      "id": "story_123",
      "title": "The Obsidian Archive",
      "premise": "Relay archivist uncovers temporal signal.",
      "genre": "Sci-Fi",
      "writingStyle": "Atmospheric, introspective"
    },
    "objective": "Breach the sealed conduit",
    "characters": [...],
    "previousChapter": {...},
    "memories": [...],
    "branch": {...},
    "length": "medium"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "title": "The Sealed Conduit",
      "content": "The bulkhead to Sub-Level Nine...",
      "summary": "Donald breaches the bay...",
      "continuityNotes": ["Donald's skepticism preserved"],
      "unresolvedThreads": ["Cedar smoke anomaly"]
    }
  }
  ```

---

### 2. `POST /api/v1/generate-dialogue`
Doctors spoken lines to match character psychology and speech habits.
- **Rate Limit:** 10 requests / minute / user.
- **Payload:**
  ```json
  {
    "speaker": {
      "name": "Donald Vance",
      "dialogueStyle": "Measured, cadence-conscious",
      "motivation": "Uncover signal truth"
    },
    "text": "I think we shouldn't open this."
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "rewritten": "Option 1: \"We trip that seal before planetary acknowledges, and we're breathing vacuum in forty seconds.\""
    }
  }
  ```

---

## Error Codes
| Code | HTTP Status | Description |
|---|---|---|
| `UNAUTHENTICATED` | 401 | User must sign in. |
| `PERMISSION_DENIED` | 403 | User does not own the requested universe. |
| `INVALID_ARGUMENT` | 400 | Malformed payload failing Zod validation. |
| `RATE_LIMITED` | 429 | Rate limit exceeded. |
| `AI_PROVIDER_ERROR` | 503 | Gemini API error or missing server API key. |
| `INTERNAL_ERROR` | 500 | Unexpected server error. |
