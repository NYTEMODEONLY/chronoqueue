## ADR-001: Next.js 15 App Router on Vercel

**Status:** Proposed
**Date:** 2026-04-04

### Context

ChronoQueue is a text-based idle RPG that must be deployed on Vercel (non-negotiable constraint). We need a frontend framework that supports server-side rendering, API routes, and a modern developer experience. The game must be fully responsive and feel like a game, not a web app.

Vercel supports multiple frameworks (Next.js, SvelteKit, Nuxt, Astro, Remix) but its own framework, Next.js, receives first-party optimizations: automatic ISR, edge middleware, server actions, cron jobs, speed insights, and zero-config deployment.

### Decision

Use **Next.js 15 with App Router** as the application framework, deployed on Vercel.

**Key reasons:**
1. **Zero deployment friction.** Vercel's build system understands Next.js natively — no adapters, no custom build configs, no edge-case incompatibilities.
2. **React Server Components** reduce client-side JavaScript. For a text-heavy idle RPG on mobile, this directly improves performance and data costs.
3. **Server Actions** provide a type-safe RPC pattern for game actions without hand-writing API routes, serialization, or error handling boilerplate.
4. **Vercel Cron Jobs** require Next.js Route Handlers — needed for daily resets and maintenance tasks.
5. **Ecosystem depth.** React/Next.js has the largest pool of libraries, examples, and developers. This de-risks hiring and reduces "how do I do X?" friction.

### Consequences

**Positive:**
- Preview deployments on every PR (automatic).
- Instant rollbacks via Vercel dashboard.
- Built-in analytics, speed insights, and error tracking.
- Server Components reduce bundle size for mobile users.

**Negative:**
- App Router has a steeper learning curve than Pages Router or SvelteKit.
- React's runtime is heavier than Svelte or Vue (~40 kB gzipped baseline). Acceptable for a text-based game.
- Tight coupling to Vercel's platform. Migrating away would require replacing cron, edge middleware, and deployment config.

**Neutral:**
- Team must learn RSC patterns (server vs client component boundaries). This is an investment that pays off in performance.

### Alternatives Considered

| Alternative | Why Rejected |
|---|---|
| **SvelteKit** | Better DX arguably, smaller runtime, but weaker Vercel integration (adapter-based), smaller ecosystem, harder to hire for. |
| **Nuxt (Vue)** | Good framework, but no meaningful advantage over Next.js on Vercel. Vue ecosystem is smaller for game-adjacent libraries. |
| **Astro** | SSG-first architecture is wrong for a dynamic, always-online game with per-player state. |
| **Remix** | Good data loading patterns, but Server Actions in Next.js 15 match Remix's loader/action model. Remix on Vercel is second-class. |
