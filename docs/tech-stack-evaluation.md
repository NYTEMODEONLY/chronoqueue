# ChronoQueue — Tech Stack Evaluation

**Date:** 2026-04-04
**Author:** Technical Director, VOID Studios
**Status:** Proposed

---

## 1. Project Constraints

| Constraint | Detail |
|---|---|
| Genre | Text-based idle RPG |
| Platform | Web (100% browser-based) |
| Hosting | Vercel (non-negotiable) |
| Responsiveness | Phone, tablet, desktop — must look like a game, not a web app |
| Persistence | 24/7 online, survive 30-day player absence |
| Social | Planned post-MVP; architecture must accommodate but not implement |

---

## 2. Frontend Framework

### Evaluated Options

| Framework | Vercel Support | SSR/SSG | Ecosystem | Team Fit |
|---|---|---|---|---|
| **Next.js 15 (App Router)** | Native (Vercel's own) | Full | Massive | High |
| SvelteKit | Good (adapter) | Full | Growing | Medium |
| Nuxt (Vue) | Adapter exists | Full | Large | Medium |
| Astro | Good | SSG-first | Growing | Low (too static) |

### Recommendation: **Next.js 15 with App Router**

**Why:**
- Vercel's first-party framework — zero friction on deployment, preview deploys, edge functions, cron jobs, analytics, speed insights all work out of the box.
- React Server Components reduce client-side JS bundle — critical for mobile performance.
- Server Actions provide a clean RPC-like pattern for game actions (train hero, start quest) without boilerplate API routes.
- Largest ecosystem for hiring, community support, and third-party libraries.
- App Router's layout system maps well to game UI (persistent HUD, tabbed views).

**Tradeoffs:**
- App Router is more complex than Pages Router or SvelteKit's simpler model.
- React's rendering model is heavier than Svelte/Vue for pure client interactivity.
- Acceptable: the game is text-based, not a canvas renderer. React's overhead is negligible here.

---

## 3. Styling

### Evaluated Options

| Option | Performance | DX | Game Aesthetic | Responsive |
|---|---|---|---|---|
| **Tailwind CSS v4** | Excellent | Fast iteration | Custom theme | Built-in |
| CSS Modules | Good | Moderate | Manual | Manual |
| styled-components | Runtime cost | Good | Flexible | Manual |
| Panda CSS | Good | Learning curve | Flexible | Built-in |

### Recommendation: **Tailwind CSS v4 + CSS custom properties**

**Why:**
- Zero-runtime CSS — critical for mobile game feel (no style recalc jank).
- Utility-first allows rapid prototyping of game UI without context-switching.
- Custom theme tokens via CSS properties enable a consistent RPG aesthetic (colors, fonts, spacing).
- Built-in responsive utilities (no media query boilerplate).
- v4's new engine is faster and supports CSS-first configuration.

**Animation:** Framer Motion for game-feel animations (level up, quest completion, loot drops). CSS transitions for simple state changes.

---

## 4. State Management

### The Idle RPG State Model

An idle RPG has two distinct state domains:

1. **Authoritative game state** — lives on the server (player progress, inventory, quest status). This is the source of truth.
2. **Ephemeral UI state** — lives on the client (which tab is open, animation states, toast notifications).

### Evaluated Options

| Library | Server State | Client State | Bundle Size | Complexity |
|---|---|---|---|---|
| **Zustand** | No | Excellent | 1.1 kB | Low |
| **TanStack Query** | Excellent | No | ~13 kB | Medium |
| Redux Toolkit | Both | Both | ~30 kB | High |
| Jotai | No | Good | 2.4 kB | Low |

### Recommendation: **TanStack Query (server state) + Zustand (client state)**

**Why:**
- **TanStack Query** handles all server state: fetching game state, mutations (player actions), cache invalidation, optimistic updates, background refetching (the "tick" poll).
- **Zustand** handles ephemeral UI state: selected tab, modal state, animation flags. Minimal API, no boilerplate, tiny bundle.
- This split mirrors the idle RPG reality: server is authoritative, client is a view layer.
- Together they're ~14 kB vs Redux Toolkit's ~30 kB with far less boilerplate.

**Rejected:**
- Redux Toolkit: too much ceremony for our needs. The game doesn't need a global client-side state graph.
- Jotai: atomic model is elegant but less suited to the "fetch-and-display" pattern we need.

---

## 5. Database

### Requirements
- Persistent player data (structured: stats, inventory, quests, timers)
- Relational queries (player → inventory → items, player → quest_progress → quests)
- Must survive 30-day absence (no ephemeral/in-memory stores)
- Serverless-compatible (Vercel functions have cold starts)
- Real-time capabilities for future social features

### Evaluated Options

| Database | Type | Serverless | Real-time | Auth Built-in | Free Tier |
|---|---|---|---|---|---|
| **Supabase** | PostgreSQL (managed) | Yes (pooling) | Yes (LISTEN/NOTIFY) | Yes | 500 MB, 2 projects |
| Neon | PostgreSQL (serverless) | Native | No | No | 512 MB |
| PlanetScale | MySQL (serverless) | Native | No | No | Removed free tier |
| MongoDB Atlas | Document | Yes | Change streams | No | 512 MB |
| Turso (libSQL) | SQLite (edge) | Yes | No | No | 9 GB |

### Recommendation: **Supabase (PostgreSQL)**

**Why:**
- PostgreSQL is the right model for an RPG: player stats, inventory items, quest trees, and progression logs are inherently relational.
- Supabase bundles: managed Postgres + connection pooling (Supavisor) + Row Level Security + Auth + Realtime subscriptions + Edge Functions + Storage.
- Auth is built-in — no need for NextAuth/Clerk/Auth0 for MVP.
- Realtime subscriptions (via Postgres LISTEN/NOTIFY) are ready when social features land post-MVP.
- Connection pooling (Supavisor) handles Vercel's serverless connection model cleanly.
- Generous free tier for development and early launch.

**Rejected:**
- Neon: great serverless Postgres, but no auth, no realtime. We'd need to add 2-3 more services.
- PlanetScale: no free tier, MySQL is less natural for complex RPG data models.
- MongoDB: document model works but RPG data is highly relational (items ↔ players ↔ quests ↔ effects). Joins/relations are a first-class need.
- Turso: interesting for edge reads but immature for a primary datastore with writes.

### ORM: **Drizzle ORM**

| ORM | Bundle Size | Cold Start | Type Safety | SQL Closeness |
|---|---|---|---|---|
| **Drizzle** | ~30 kB | Fast | Full | SQL-like |
| Prisma | ~2 MB engine | Slow | Full | Custom DSL |

**Why Drizzle over Prisma:**
- No binary engine — 60x smaller, much faster cold starts on Vercel serverless.
- SQL-like syntax means the team thinks in SQL, not a proprietary DSL.
- Full TypeScript inference from schema — type-safe queries without code generation.
- First-class Supabase/PostgreSQL support.

---

## 6. Real-Time Strategy

### The Idle Game "Real-Time" Problem

An idle RPG doesn't need 60fps real-time sync. It needs:
1. **Periodic state refresh** — "what happened since I last checked?" (every 5-30 seconds)
2. **Event notifications** — "your quest completed!" (when it happens)
3. **Offline catch-up** — "here's what happened in the 3 days you were away" (on reconnect)

### Evaluated Options

| Strategy | Vercel Support | Complexity | Latency | Cost |
|---|---|---|---|---|
| **Short polling (TanStack Query `refetchInterval`)** | Native | Low | 5-30s | Low |
| Server-Sent Events (SSE) | Serverless limits | Medium | Real-time | Medium |
| WebSockets | Not native (needs infra) | High | Real-time | High |
| Supabase Realtime | External service | Medium | Real-time | Low |

### Recommendation: **Polling (primary) + Supabase Realtime (future social)**

**Primary (MVP):** TanStack Query's `refetchInterval` polls game state every 10 seconds. Simple, works perfectly on Vercel, no infrastructure overhead.

**Future (social features):** Supabase Realtime channels for player-to-player events (trade requests, guild notifications). Already available in the Supabase stack — zero additional infrastructure.

**Why not WebSockets/SSE now:**
- Vercel serverless functions have a 30-second execution limit. Persistent connections don't fit.
- For an idle game, 10-second polling is indistinguishable from "real-time" to the player.
- Polling is the simplest thing that works. We can layer real-time on top when social features demand it.

---

## 7. Hosting Architecture on Vercel

| Layer | Technology | Vercel Feature |
|---|---|---|
| Frontend | Next.js App Router | Automatic deployment |
| API | Next.js Route Handlers + Server Actions | Serverless Functions |
| Cron Jobs | Scheduled tasks (daily rewards, cleanup) | Vercel Cron |
| Database | Supabase PostgreSQL | External (Supabase integration) |
| Auth | Supabase Auth | External (Supabase integration) |
| CDN/Assets | Static assets, fonts, icons | Vercel Edge Network |
| Config | Feature flags, game balance tuning | Vercel Edge Config |
| Monitoring | Performance, errors | Vercel Analytics + Speed Insights |

### Deployment Pipeline
- **Preview:** Every PR gets an automatic preview deployment.
- **Production:** Merge to `main` triggers production deploy.
- **Cron:** `vercel.json` defines scheduled tasks (daily reset, inactive player cleanup).
- **Rollback:** Instant rollback via Vercel dashboard.

---

## 8. Monorepo & Package Management

### Recommendation: **pnpm + Turborepo**

| Tool | Speed | Disk Usage | Monorepo | Vercel Support |
|---|---|---|---|---|
| **pnpm** | Fastest | Lowest (hard links) | Native workspaces | First-class |
| npm | Moderate | High | Workspaces (basic) | First-class |
| yarn | Fast | Moderate | Workspaces | Good |
| bun | Fastest (runtime) | Low | Workspaces | Partial |

**Why pnpm:**
- 2-3x faster installs than npm.
- Content-addressable storage saves disk space (one copy of each package version).
- Strict dependency resolution prevents phantom dependencies.
- Vercel has native pnpm support.

**Why Turborepo:**
- Vercel's own build orchestrator — zero config on Vercel.
- Remote caching (shared CI cache) speeds up builds.
- Understands package dependency graph for correct build ordering.
- Minimal config (single `turbo.json`).

### Monorepo Structure

```
chronoqueue/
├── apps/
│   └── web/                  # Next.js application
├── packages/
│   ├── db/                   # Drizzle schema, migrations, DB client
│   └── game-engine/          # Core game logic (tick engine, formulas, types)
├── .github/workflows/        # CI pipeline
├── turbo.json                # Build orchestration
├── pnpm-workspace.yaml       # Workspace definition
└── package.json              # Root scripts and devDependencies
```

**Why these packages:**
- `game-engine`: isolates core game logic (tick calculation, offline progression, combat formulas) from the web framework. Testable in isolation. Could theoretically power a different client.
- `db`: encapsulates schema and migration ownership. Single source of truth for data types. Prevents web app from depending on raw SQL.

---

## 9. Testing

| Layer | Tool | Why |
|---|---|---|
| Unit / Integration | **Vitest** | Fast, ESM-native, Jest-compatible API, works with TypeScript out of the box |
| E2E (future) | **Playwright** | Cross-browser, Vercel preview deploy integration |

Vitest for MVP. Playwright when the UI is stable enough to warrant E2E tests.

---

## 10. Summary

| Concern | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + Framer Motion |
| Server State | TanStack Query v5 |
| Client State | Zustand |
| Database | Supabase (PostgreSQL) |
| ORM | Drizzle ORM |
| Auth | Supabase Auth |
| Real-time | Polling (MVP) → Supabase Realtime (social) |
| Monorepo | pnpm + Turborepo |
| Testing | Vitest |
| CI | GitHub Actions |
| CD | Vercel (automatic) |
| Cron | Vercel Cron Jobs |
