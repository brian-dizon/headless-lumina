# Lumina Insights - Project Log & Parking Lot

## 🚀 Optimization Roadmap (Completed Mar 4, 2026)
- [x] **Performance Wave 1:** Trailing slash redirects, SSR query caching, and production readiness in `next.config.ts`.
- [x] **Performance Wave 2:** Preconnect/DNS-prefetch for WordPress and transparenttextures.com, LCP fetchPriority/sizes for Hero images.
- [x] **Accessibility Wave 1:** ARIA labels for icon-only buttons, dynamic heading hierarchy (H1 -> H2 -> H3), and WCAG contrast fixes.
- [x] **Build Integrity:** ES2022 target, Partial Prerendering (PPR) compatibility with dynamic date/auth suspense.

---

## 🅿️ Parking Lot (Upcoming Ideas)

### 1. Third-Party Cookie Mitigation (Privacy Sandbox)
**Goal:** Resolve warnings regarding `clerk.accounts.dev` and `lumina.briandizon.com` third-party cookies.

- **Clerk Custom Domain:** 
    - Move from `novel-rattler-27.clerk.accounts.dev` to `auth.briandizon.com`.
    - *Impact:* Converts Clerk cookies to first-party, resolving Chrome DevTools warnings and future-proofing authentication.
- **WordPress Asset Proxy (Next.js Rewrites):**
    - Implement a rewrite in `next.config.ts` to tunnel WordPress images through `briandizon.com/cms-assets/`.
    - *Impact:* Strips third-party `__refresh` cookies from WordPress uploads, making images appear as first-party assets.
- **SVG Minification:**
    - Manually minify `hero-illustration.svg` (currently 340KB) using SVGOMG or an automated CLI tool to further reduce LCP.

### 2. Advanced Search & AI
- **ACF Static Summaries:** Waterfall logic to prioritize human-curated summaries over JIT AI generation.
- **n8n Orchestration:** Offload Assistant long-term memory to a dedicated n8n agent.

### 3. Feature Expansion
- **PDF Whitepaper Generation:** Server-side PDF creation from resource content.
- **Contributor Stacking:** Enhanced animation for expert profile transitions.
