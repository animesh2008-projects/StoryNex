# STORYNEX — Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend Framework** | React | `^19.0.0` | Declarative UI and component hierarchy |
| **Language** | TypeScript | `^5.7.3` | Type safety and schema validation |
| **Build Tool** | Vite | `^6.2.1` | Ultra-fast HMR and optimized production bundles |
| **Styling** | Tailwind CSS | `^3.4.17` | Utility-first design system with custom brand palette |
| **Icons** | Lucide React | `^1.16.0` | Consistent, readable icon set |
| **Routing** | React Router DOM | `^7.3.0` | Client-side routing with protected route guards |
| **AI SDK** | Google Generative AI | `^0.24.1` / `@google/genai` | Native Google Gemini integration |
| **Backend & Emulation** | Express.js | `^4.21.2` | Privileged proxy, rate limiting, and ownership checks |
| **Database & Auth** | Firebase & Firestore | `^11.4.0` | Cloud data synchronization & authentication |
| **Testing** | Vitest | `^3.0.8` | High-speed unit testing for continuity engine & prompts |
| **Validation** | Zod | `^3.24.2` | Runtime payload validation and output parsing |
| **Deployment** | Netlify / Firebase | Production | Static frontend CDN + Cloud Functions backend |

---

## Architecture Principles
1. **Zero Client Leakage:** Private server credentials are never exposed in browser bundles.
2. **Dual-Mode Persistence:** Firestore syncs when Firebase credentials are configured; seamless local storage engine allows offline instant usage and testing.
3. **Structured Generation:** All AI responses are validated against Zod schemas.
