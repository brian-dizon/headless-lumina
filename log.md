# Lumina Project Log: Headless CMS Mastery

This document tracks the architectural decisions, milestones, and technical progress of the Lumina Enterprise Knowledge Hub.

---

## 🚀 Milestone 1: Data Modeling & Schema Architecture
- Registered **Resources**, **Experts**, and **Topics**.
- Implemented **ACF Relationship Fields**.
- Verified WPGraphQL schema.

## 🌉 Milestone 2: The Next.js Apollo Bridge
- Scaffolded Next.js 15 with TypeScript and Tailwind CSS (v4).
- Created `lib/apollo-client.ts` with Server-Side request handling.

## 🎨 Milestone 3: Enterprise UI & Component Architecture
- Integrated Shadcn/UI (Card, Badge, Avatar).
- Built `ResourceCard.tsx` with **Expert Stacking** and **+N Indicators**.
- Configured secure remote image fetching in `next.config.ts`.

## 🏗️ Milestone 4: Clean Architecture & Streaming
- Refactored components into `global/` and `resources/`.
- Decentralized data fetching into `ResourceGrid.tsx`.
- Implemented **Next.js Streaming** via `<Suspense>`.

## ⚡ Milestone 5: Dynamic Routing & Static Optimization (SSG/ISR)
- Created `app/resources/[slug]/page.tsx` with `generateStaticParams`.
- Configured **ISR (Revalidation)** in `apollo-client.ts`.
- Integrated `@tailwindcss/typography` for beautiful WordPress content rendering.

## 🎭 Milestone 6: Global Branding & Theme Control
- Implemented sticky `Navbar.tsx` and high-performance `Logo.tsx`.
- Added **Single-Click Dark Mode Toggle** with smooth CSS transitions (`0.4s fade`).
- Resolved `prose` readability with `dark:prose-invert`.
- Fixed `ThemeProvider` animation blocking by removing `disableTransitionOnChange`.

## 🏷️ Milestone 7: Static Taxonomy (Topic) Pages
- Implemented the **"Link Overlay" Pattern** in `ResourceCard.tsx` for nested links (Resources vs. Topics).
- Created `app/topic/[slug]/page.tsx` to handle dynamic topic archives.
- Implemented `generateStaticParams` for pre-rendering all topic pages.

## 🏙️ Milestone 8: Full Hub Architecture & Mobile UX
- **Refactoring**: Migrated full resource grid to `/resources` and transformed `/` into a high-end corporate landing page.
- **Hero Section**: Implemented a responsive grid with a 600x600px tech illustration.
- **Mobile Navigation**: Added a slide-out `MobileNav.tsx` using Shadcn/UI's `Sheet` component.
- **UX Polish**: Optimized hero illustration ordering (Text -> Image -> Buttons) for mobile devices.

---

## 🅿️ Parking Lot (Future Tasks)
- [ ] **Expert Hub:** List of all experts and individual profile pages.
- [ ] **Pagination/Load More:** Handling large datasets in the Resource Grid.
- [ ] **Block-to-Component Pipeline:** Mapping Gutenberg/ACF blocks to React components.
- [ ] **Search & Filtering:** Real-time client-side queries.
- [ ] **Gated Content:** Integration with Clerk for "Premium" resources.
