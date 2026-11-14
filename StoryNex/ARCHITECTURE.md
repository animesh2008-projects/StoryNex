# STORYNEX — System Architecture

```mermaid
flowchart TD
    subgraph Client [Browser Application]
        UI[React 19 / Tailwind UI]
        Editor[3-Panel Writing Workspace]
        Checker[Continuity Audit Engine]
        StorageAdapter[Dual Storage Adapter]
    end

    subgraph Identity [Authentication Layer]
        Auth[Firebase Auth / Local Dev Provider]
    end

    subgraph Data [Persistence Layer]
        Firestore[(Cloud Firestore / LocalStorage)]
        RuleGuard[Firestore Security Rules]
    end

    subgraph Backend [Server & AI Engine]
        ProxyAPI[Express / Cloud Functions API]
        RateLimiter[Sliding Window Rate Limiter]
        ZodValidator[Zod Request / Output Validator]
        ContextEngine[8-Factor Context Assembly]
        Gemini[Google Gemini 1.5 Flash / Pro]
    end

    UI --> Auth
    UI --> StorageAdapter
    StorageAdapter --> RuleGuard --> Firestore
    Editor --> Checker
    Editor --> ProxyAPI
    ProxyAPI --> RateLimiter --> ZodValidator --> ContextEngine
    ContextEngine --> Firestore
    ContextEngine --> Gemini
    Gemini --> ZodValidator --> Editor
```

---

## 8-Factor Context Flow
1. **Story Premise:** Foundational universe reality and primary anomaly.
2. **Genre & Style:** Tone constraints (e.g. atmospheric, clipped, noir).
3. **Chapter Objective:** Dramatic goal of current scene.
4. **Cast Psychology:** Active characters' motivations, fears, and cadences.
5. **Previous Chapter Continuity:** Summary of previous chapter's events.
6. **3-Layer Memory:** Approved facts (Importance >= 3).
7. **Branch Context:** Current alternate decision choice.
8. **Author Directives:** Real-time steering instructions.

---

## Data Flow: Non-Destructive Reviewable Drafts
1. Author triggers generation.
2. AI synthesizes draft based on 8 factors.
3. Output is parsed into `{ title, content, summary, continuityNotes, unresolvedThreads }`.
4. Result is presented in the **Reviewable Draft Banner**.
5. Author chooses **Replace Chapter**, **Append to End**, or **Discard**.
6. Autosave debounces and persists the decision to Firestore.
