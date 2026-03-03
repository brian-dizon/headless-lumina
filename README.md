# Lumina Enterprise Knowledge Hub

Lumina is a high-performance knowledge ecosystem designed for the modern enterprise. It bridges the gap between structured content management and intelligent data synthesis, transforming a headless WordPress instance into a resilient, AI-enhanced frontend experience.

This project serves as a demonstration of technical depth in full-stack orchestration, focusing on performance, defensive engineering, and seamless user experiences.

---

## 🏛️ Architectural Pillars

### **The Gutenberg Bridge**
At the core of the platform is a sophisticated block-rendering engine. Rather than rendering raw HTML from the CMS, Lumina utilizes an atomic mapping strategy. Each Gutenberg block is parsed via WPGraphQL fragments and mapped to optimized React components. This ensures hydration safety, allows for Tailwind-driven design consistency, and enables the injection of interactive client-side logic into static CMS data.

### **Resilient AI Orchestration**
Lumina integrates **Google Gemini 2.0 Flash** through a decoupled factory pattern. To ensure 100% UI uptime, the system implements a multi-tier resilience strategy:
- **RAG-Enhanced Search:** Contextual data injection ensures AI responses are grounded in the Lumina knowledge base.
- **Defensive Heuristics:** In the event of API quota exhaustion or latency, a regex-driven heuristic engine takes over to provide non-AI architectural summaries.
- **Concierge Fallback:** The "Assistant" chatbot features a keyword-matching concierge that recommends relevant resources even when the LLM is offline.

### **Hybrid Rendering Strategy**
To achieve near-instantaneous load times while maintaining data freshness, the platform employs a mix of advanced Next.js rendering patterns:
- **SSG & ISR:** Critical resource and expert pages are pre-rendered at build time and revalidated every 60 seconds.
- **Partial Prerendering (PPR):** Static content shells are served immediately, while dynamic metadata and AI summaries are streamed in via React Suspense.
- **AJAX Hybrid Search:** Combines sub-100ms keyword matching with deeper RAG-based analysis for a comprehensive discovery experience.

---

## 🚀 Key Features

- **Personal Reading List:** User-specific state persistence using **Clerk Metadata**, allowing for cross-device bookmarking without the overhead of a dedicated secondary database.
- **Expert Ecosystem:** A bidirectional relationship model linking contributors to resources, featuring animated profile transitions and contributor stacking.
- **Mission Control:** A carbon-fiber glassmorphic dashboard providing real-time infrastructure health monitoring from Vercel and GitHub APIs.
- **Industry Pulse:** Edge-cached orchestration of external technical feeds, balanced for freshness and performance.
- **Animated Branding:** A vector-based, CSS-animated glowing favicon and high-impact "Premium" UI synchronization.

---

## 🛠️ Technical Stack

- **Framework:** Next.js 16.1 (App Router, Turbopack)
- **Styling:** Tailwind CSS v4, @tailwindcss/typography
- **Authentication:** Clerk (Middleware-protected routes & Public Metadata)
- **CMS:** Headless WordPress (WPGraphQL, ACF Pro)
- **AI/ML:** Vercel AI SDK, Google Gemini 2.0 Flash
- **UI Components:** Shadcn/UI (Radix Primitives)
- **State Management:** React 19 Server Actions, Optimistic UI Transitions

---

## 🛠️ Getting Started

### **1. Environment Setup**
Create a `.env.local` file with the following variables:
```env
NEXT_PUBLIC_WORDPRESS_API_URL=
WORDPRESS_AUTH_REFRESH_TOKEN=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=
```

### **2. Installation**
```bash
npm install
npm run dev
```

### **3. Production Verification**
Ensure all routes and types are valid:
```bash
npm run build
npm run lint
```

---

## 📈 Future Roadmap

- **ACF Static Summaries:** Implementing a waterfall logic to prioritize human-curated summaries stored in WordPress over just-in-time AI generation.
- **n8n Orchestration:** Offloading the Assistant's long-term memory and complex workflow logic to a dedicated n8n agent.
- **PDF Generation:** Server-side generation of architectural whitepapers directly from resource content.

---

Proudly built with a focus on technical integrity, performance, and the future of headless content delivery.
