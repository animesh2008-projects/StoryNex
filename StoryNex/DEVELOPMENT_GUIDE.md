# STORYNEX — Development Guide

---

## Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- Google Gemini API key (from [Google AI Studio](https://aistudio.google.com/app/apikey))

---

## Directory Layout
```text
StoryNex/
├── src/
│   ├── components/
│   │   ├── common/       # Navbar, Sidebar, Modal, Badge
│   │   └── layout/       # PublicLayout, AppLayout
│   ├── context/          # AuthContext, StoryContext
│   ├── features/
│   │   ├── landing/      # Public landing, Features, About, Privacy, Terms
│   │   ├── auth/         # Login, Register, ForgotPassword
│   │   ├── dashboard/    # Author Dashboard & overview
│   │   ├── stories/      # StoryList, StoryNew, StoryDetail
│   │   ├── editor/       # 3-Panel Chapter Editor & Reviewable Drafts
│   │   ├── characters/   # Character Studio & Gemini Synthesizer
│   │   ├── memory/       # 3-Layer Story Memory Hub
│   │   ├── branches/     # Multiverse Branch Explorer
│   │   ├── assistant/    # Creative Co-Writer Lab
│   │   ├── innovations/  # 50% Innovation Lab interactive previews
│   │   └── settings/     # API keys & System Configuration
│   ├── services/
│   │   ├── firebase.ts           # Firebase SDK setup & fallback
│   │   ├── storage-adapter.ts    # Dual Firestore / resilient local adapter
│   │   ├── auth-service.ts       # Auth methods
│   │   ├── ai-service.ts         # 8-factor context builder & Gemini caller
│   │   └── continuity-checker.ts # Continuity auditing engine
│   ├── styles/           # Tailwind CSS & custom scrollbars
│   ├── types/            # TypeScript data contracts
│   ├── App.tsx           # Route trees & protected guards
│   └── main.tsx          # React DOM entry point
├── server/
│   └── index.js          # Express API server with rate limiting & Zod
├── tests/                # Vitest unit test suites
├── firestore.rules       # Firebase Firestore security rules
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## Local Commands
```bash
# Start frontend development server on port 5173
npm run dev

# Start local backend API server on port 3001
npm run server

# Run Vitest automated test suite
npm test

# Build production bundle
npm run build
```
