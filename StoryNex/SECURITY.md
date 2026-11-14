# STORYNEX — Security & Privacy Architecture

**Security Philosophy:** Never trust client-supplied ownership IDs. Strictly isolate user universes. Do not log private manuscript contents. Expose no API keys to browser clients.

---

## 1. Firebase Firestore Security Rules
All story data is isolated under the user's authentic UID (`request.auth.uid`). Anonymous or cross-user access is denied by default.

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    match /users/{userId} {
      allow read, write: if isOwner(userId);

      match /stories/{storyId} {
        allow read, delete: if isOwner(userId);
        allow create: if isOwner(userId) && request.resource.data.ownerId == request.auth.uid;
        allow update: if isOwner(userId) && request.resource.data.ownerId == resource.data.ownerId;

        match /chapters/{chapterId} {
          allow read, write: if isOwner(userId);
        }

        match /characters/{characterId} {
          allow read, write: if isOwner(userId);
        }

        match /memories/{memoryId} {
          allow read, write: if isOwner(userId);
        }

        match /branches/{branchId} {
          allow read, write: if isOwner(userId);
        }
      }
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 2. Server-Side Rate Limiting & Validation
- **Backend API (`server/index.js`):**
  - Enforces rate limits using a sliding window:
    - Chapter generation: 5 requests / minute / user.
    - Dialogue generation: 10 requests / minute / user.
  - Maximum payload size capped at 50 KB to mitigate denial-of-service attempts.
  - Request schema enforced strictly with Zod.

## 3. Threat Model & Mitigations

| Threat | Risk Level | Mitigation Implemented |
|---|---|---|
| Cross-user manuscript leakage | Critical | Per-user Firestore security rules + client-side storage keyspacing (`storynex_data_v1_{uid}`) |
| Unauthorized AI quota abuse | High | 5 req/min rate limiters + server-side token checks |
| Malformed model output | Medium | Zod schema validation + JSON sanitization stripping markdown blocks |
| Inadvertent data loss | Critical | Debounced autosave (1200ms) + manual Save shortcut (Ctrl+S) + full JSON export |
| Prompt injection via user lore | Medium | Strict demarcation of system instructions from user inputs in 8-factor prompts |

---

## 4. Privacy & Data Sovereignty
- **Zero Training Guarantee:** When interacting with Google Gemini API commercial developer endpoints, author prompts and manuscripts are not utilized to train Google models.
- **Permanent Deletion:** Authors can permanently purge universes or clear their entire local cache in the Settings panel.
