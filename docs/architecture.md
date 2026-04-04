# ChronoQueue — System Architecture

**Date:** 2026-04-04
**Author:** Technical Director, VOID Studios
**Status:** Proposed

---

## 1. High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         VERCEL EDGE                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Next.js App Router                     │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │   │
│  │  │   React UI   │  │ Server       │  │  Route         │   │   │
│  │  │  (RSC + CC)  │  │ Actions      │  │  Handlers      │   │   │
│  │  └──────┬───────┘  └──────┬───────┘  └───────┬────────┘  │   │
│  │         │                 │                   │            │   │
│  │         │    ┌────────────┴───────────────────┘            │   │
│  │         │    │                                             │   │
│  │         │    ▼                                             │   │
│  │         │  ┌──────────────────────┐                       │   │
│  │         │  │    Game Engine        │                       │   │
│  │         │  │  (tick, formulas,     │                       │   │
│  │         │  │   offline calc)       │                       │   │
│  │         │  └──────────┬───────────┘                       │   │
│  │         │             │                                   │   │
│  └─────────┼─────────────┼───────────────────────────────────┘   │
│            │             │                                       │
└────────────┼─────────────┼───────────────────────────────────────┘
             │             │
     ┌───────┘             │
     ▼                     ▼
┌──────────┐      ┌────────────────┐
│  Client  │      │   Supabase     │
│  State   │      │  ┌──────────┐  │
│ (Zustand │      │  │ Postgres │  │
│  + TQ)   │      │  ├──────────┤  │
│          │      │  │   Auth   │  │
└──────────┘      │  ├──────────┤  │
                  │  │ Realtime │  │
                  │  └──────────┘  │
                  └────────────────┘
```

**RSC** = React Server Components | **CC** = Client Components | **TQ** = TanStack Query

---

## 2. Frontend Architecture

### 2.1 Rendering Strategy

| Page Type | Rendering | Why |
|---|---|---|
| Landing / Marketing | Static (SSG) | No user data, cache at edge |
| Game UI | Server Components + Client Islands | Server fetches game state, client handles interaction |
| Auth pages | Server Components | Minimal JS needed |

**Principle:** Server Components by default. Client Components only where interactivity demands it (buttons, animations, real-time counters).

### 2.2 Route Structure

```
app/
├── layout.tsx                    # Root layout (fonts, metadata, providers)
├── page.tsx                      # Landing page (SSG)
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── (game)/
│   ├── layout.tsx                # Game shell (persistent HUD, nav)
│   ├── page.tsx                  # Main game view (hero overview)
│   ├── queue/page.tsx            # Queue management (core mechanic)
│   ├── inventory/page.tsx        # Items and equipment
│   ├── quests/page.tsx           # Active and available quests
│   └── settings/page.tsx         # Player settings
└── api/
    ├── game/
    │   ├── tick/route.ts         # Process game tick
    │   └── action/route.ts       # Player action endpoint
    └── cron/
        ├── daily-reset/route.ts  # Daily rewards, resets
        └── cleanup/route.ts      # Inactive player maintenance
```

### 2.3 Game UI Layout

```
┌─────────────────────────────────────┐
│  ░░░ ChronoQueue ░░░    ⚡ 142  💰 3.2k │  ← Top bar (resources)
├─────────────────────────────────────┤
│                                     │
│          Main Content Area          │  ← Route-specific content
│       (hero, queue, inventory)      │
│                                     │
│                                     │
├─────────────────────────────────────┤
│  🏠 Home  📋 Queue  🎒 Inv  ⚔ Quest │  ← Bottom nav (mobile-first)
└─────────────────────────────────────┘
```

**Mobile-first:** Bottom navigation for thumb reach. On desktop, navigation moves to a sidebar. The game shell layout handles this via responsive CSS — same component tree, different arrangement.

### 2.4 State Flow

```
Server (Supabase)          Server Actions / Route Handlers         Client
┌──────────┐               ┌──────────────────────┐          ┌──────────────┐
│ Postgres │──read────────▶│  Game Engine          │────RSC──▶│ Server       │
│          │               │  (validate, compute)  │          │ Component    │
│          │◀──write───────│                       │          │              │
└──────────┘               └──────────────────────┘          └──────┬───────┘
                                                                    │ props
                                                              ┌─────▼───────┐
                                                              │ Client      │
                                                              │ Component   │
                                                              │ (Zustand    │
                                                              │  + TQ)      │
                                                              └─────────────┘
```

1. **Server Components** fetch game state via the DB package (no client-side fetch for initial load).
2. **Client Components** use TanStack Query for ongoing state sync (polling) and mutations (player actions).
3. **Zustand** holds ephemeral UI state only (selected tab, animation flags, toast queue).
4. **Server Actions** handle mutations: validate input → run game engine → write to DB → return result.

---

## 3. Backend Architecture

### 3.1 API Design

No separate backend service. Next.js Route Handlers and Server Actions **are** the backend.

| Pattern | Use Case | Example |
|---|---|---|
| **Server Actions** | Player-initiated mutations | Train hero, equip item, start quest |
| **Route Handlers** | Polling, webhooks, cron | GET /api/game/tick, POST /api/cron/daily-reset |
| **Server Components** | Initial data loading | Fetch player state on page load |

**Why no separate API:**
- Vercel's serverless model means each Route Handler/Server Action is already an isolated function.
- Adding a separate Express/Fastify server means managing another deployment, another cold start, another failure point.
- Next.js co-location keeps game logic close to the UI that displays it.

### 3.2 Authentication Flow

```
Client                    Next.js Middleware              Supabase Auth
  │                            │                              │
  ├──login request────────────▶│                              │
  │                            ├──authenticate───────────────▶│
  │                            │◀──JWT + refresh token────────┤
  │◀──set cookies──────────────┤                              │
  │                            │                              │
  ├──game request─────────────▶│                              │
  │                            ├──verify JWT (middleware)──────│
  │                            ├──if expired, refresh──────── │
  │                            ├──proceed to route handler────│
  │◀──game response────────────┤                              │
```

- Supabase Auth handles registration, login, password reset, OAuth (future).
- Next.js Middleware verifies the JWT on every request to `/(game)/*` routes.
- No custom auth implementation. Supabase Auth is battle-tested and free.

### 3.3 Server Action Pattern (Player Action)

```typescript
// Pseudocode — illustrative, not production code
"use server"

async function trainHero(heroId: string) {
  // 1. Authenticate
  const player = await getAuthenticatedPlayer()

  // 2. Load current state
  const hero = await db.query.heroes.findFirst({
    where: eq(heroes.id, heroId),
    with: { equipment: true }
  })

  // 3. Validate action
  if (hero.playerId !== player.id) throw new Error("Not your hero")
  if (hero.isTraining) throw new Error("Already training")

  // 4. Run game engine
  const result = gameEngine.startTraining(hero)

  // 5. Write result
  await db.update(heroes).set(result).where(eq(heroes.id, heroId))

  // 6. Return for UI update
  revalidatePath("/game")
  return { success: true, completesAt: result.trainingCompletesAt }
}
```

---

## 4. Database Architecture

### 4.1 Schema Overview

```
┌──────────────┐     ┌──────────────────┐     ┌───────────────┐
│   players    │     │     heroes        │     │    items      │
├──────────────┤     ├──────────────────┤     ├───────────────┤
│ id (PK)      │────▶│ id (PK)          │     │ id (PK)       │
│ auth_id (FK) │     │ player_id (FK)   │     │ name          │
│ username     │     │ name             │     │ type          │
│ created_at   │     │ class            │     │ rarity        │
│ last_seen_at │     │ level            │     │ base_stats    │
│ settings     │     │ xp               │     └───────────────┘
└──────────────┘     │ stats (JSONB)    │
                     │ is_training      │     ┌───────────────┐
                     │ training_end_at  │     │  inventories  │
                     └──────────────────┘     ├───────────────┤
                                              │ id (PK)       │
┌──────────────────┐     ┌───────────────┐    │ player_id(FK) │
│  quest_progress  │     │    quests     │    │ item_id (FK)  │
├──────────────────┤     ├───────────────┤    │ quantity      │
│ id (PK)          │     │ id (PK)       │    │ equipped_on   │
│ player_id (FK)   │     │ name          │    └───────────────┘
│ quest_id (FK)    │     │ description   │
│ status           │     │ requirements  │    ┌───────────────┐
│ started_at       │     │ rewards       │    │  queue_slots  │
│ completed_at     │     │ duration_sec  │    ├───────────────┤
│ progress (JSONB) │     └───────────────┘    │ id (PK)       │
└──────────────────┘                          │ player_id(FK) │
                                              │ action_type   │
┌──────────────────┐                          │ target_id     │
│  game_events     │                          │ position      │
├──────────────────┤                          │ started_at    │
│ id (PK)          │                          │ completes_at  │
│ player_id (FK)   │                          └───────────────┘
│ event_type       │
│ payload (JSONB)  │
│ created_at       │
└──────────────────┘
```

### 4.2 Key Design Decisions

**JSONB for flexible data:** Stats, progress, rewards, and game config use JSONB columns. This avoids migration churn when game design iterates on stat formulas or reward structures. The JSONB is typed at the application layer via Drizzle + TypeScript.

**Timestamps for idle mechanics:** `training_end_at`, `completes_at`, `started_at` — the idle engine doesn't run real-time simulations. It stores "when does this finish?" and calculates the result on demand.

**`queue_slots` table:** The "ChronoQueue" core mechanic. Players arrange actions in a queue (train, quest, craft). Each slot has a position, action, and completion time. The engine processes the queue sequentially.

### 4.3 Connection Strategy

```
Vercel Serverless Function ──▶ Supavisor (Connection Pooler) ──▶ PostgreSQL
```

- Every DB query goes through Supavisor (Supabase's connection pooler).
- Serverless functions don't hold persistent connections — each invocation gets a pooled connection.
- Drizzle's `postgres` driver (via `postgres.js`) supports this natively.

---

## 5. Idle Game Tick Engine

This is the most architecturally critical system. It must handle:
1. **Online ticks** — player is active, state refreshes every 10 seconds.
2. **Offline catch-up** — player returns after hours/days, all missed progress computed instantly.
3. **Queue processing** — sequential actions execute in order, even offline.

### 5.1 Design Principle: Deterministic Timestamp Math

The engine does **not** run real-time simulations. It stores future completion timestamps and computes results on demand.

```
Player starts training at 14:00.
Training takes 2 hours.
Engine stores: training_end_at = 16:00.

At 14:30 (online poll): training_end_at > now → still training, 1h30m remaining.
At 18:00 (player returns): training_end_at < now → training complete. Apply XP.

No ticks ran while the player was away. The result is computed on reconnect.
```

### 5.2 Online Tick Flow

```
Client (every 10s)              Server                          Database
      │                           │                                │
      ├──GET /api/game/tick──────▶│                                │
      │                           ├──load player state────────────▶│
      │                           │◀──player + queue + heroes──────┤
      │                           │                                │
      │                           ├──processQueue(state, now)      │
      │                           │  ├─ for each completed slot:   │
      │                           │  │  ├─ apply reward            │
      │                           │  │  ├─ start next slot         │
      │                           │  │  └─ log event               │
      │                           │  └─ return updated state       │
      │                           │                                │
      │                           ├──write updated state──────────▶│
      │◀──updated game state──────┤                                │
```

### 5.3 Offline Catch-Up Flow

```
processQueue(state, currentTime):
  for each slot in queue (ordered by position):
    if slot.completes_at <= currentTime:
      // This action finished while player was away
      applyReward(slot)
      
      // Start next slot from when this one finished (not from now)
      nextSlot.started_at = slot.completes_at
      nextSlot.completes_at = slot.completes_at + nextSlot.duration
    else:
      break  // This slot hasn't finished yet
  
  return updatedState
```

**Critical:** When processing offline catch-up, each action's start time chains from the previous action's completion time. This ensures deterministic results regardless of when the player reconnects.

### 5.4 Performance Guardrails

| Constraint | Limit | Rationale |
|---|---|---|
| Max offline time | 30 days | Prevents unbounded computation |
| Max queue depth | 20 slots | Bounds catch-up processing |
| Tick computation budget | < 100ms | Must fit in serverless function time |
| Max events per catch-up | 1000 | Prevents log explosion |

If a player returns after 30 days with a full 20-slot queue, the worst case is 20 sequential reward calculations — trivial for a serverless function.

---

## 6. Deployment Pipeline

### 6.1 CI (GitHub Actions)

```yaml
# Triggers on every push and PR
jobs:
  lint:        # ESLint + Prettier check
  typecheck:   # tsc --noEmit across all packages
  test:        # Vitest across all packages
  build:       # turbo run build (validates Next.js build)
```

All jobs run in parallel where possible. Turborepo remote caching speeds up repeated builds.

### 6.2 CD (Vercel)

| Trigger | Environment | URL |
|---|---|---|
| PR opened/updated | Preview | `chronoqueue-{branch}.vercel.app` |
| Merge to `main` | Production | `chronoqueue.vercel.app` (+ custom domain) |

**Zero-config:** Vercel detects pnpm + Turborepo automatically. No custom build scripts needed.

### 6.3 Cron Jobs (Vercel Cron)

```json
// vercel.json
{
  "crons": [
    { "path": "/api/cron/daily-reset", "schedule": "0 0 * * *" },
    { "path": "/api/cron/cleanup",     "schedule": "0 4 * * 0" }
  ]
}
```

| Job | Schedule | Purpose |
|---|---|---|
| Daily reset | 00:00 UTC daily | Refresh daily quests, grant login rewards |
| Cleanup | 04:00 UTC weekly | Archive data for players inactive > 90 days |

---

## 7. Security Model

### 7.1 Layers

| Layer | Mechanism |
|---|---|
| Authentication | Supabase Auth (JWT) |
| Authorization | Next.js Middleware (route protection) + Row Level Security (DB) |
| Input validation | Zod schemas on all Server Actions and Route Handlers |
| Rate limiting | Vercel WAF (built-in) + custom per-player action throttle |
| CSRF | Next.js Server Actions have built-in CSRF protection |

### 7.2 Anti-Cheat (Server-Authoritative)

The client **never** computes game state. It only sends action requests ("start training hero X") and displays the server's response. This means:

- No client-side timers that can be manipulated.
- No client-side stat calculations that can be spoofed.
- All rewards are computed server-side from timestamps stored in the DB.
- The only attack surface is sending invalid action requests, which Server Actions validate via Zod.

---

## 8. Scalability Considerations (Post-MVP)

These are not MVP features but the architecture must not preclude them:

| Feature | Architecture Impact | Readiness |
|---|---|---|
| Social (guilds, chat) | Supabase Realtime channels | Ready — no architecture change |
| Leaderboards | Postgres materialized views + Vercel KV cache | Ready — add a cron job |
| Multiple game servers | Supabase supports multiple projects; schema is player-scoped | Low effort |
| Mobile app | React Native with shared `game-engine` package | Package structure supports this |
| Localization | Next.js i18n routing + JSON translation files | Built-in framework support |

---

## 9. Monitoring and Observability

| Concern | Tool | Notes |
|---|---|---|
| Error tracking | Vercel (built-in) or Sentry (if needed) | Start with Vercel, add Sentry if volume demands |
| Performance | Vercel Speed Insights + Analytics | Core Web Vitals, function duration |
| Database | Supabase Dashboard | Query performance, connection count, storage |
| Uptime | Vercel status + Supabase status | Both have status pages and incident alerts |
| Game metrics | Custom `game_events` table | Player retention, action frequency, queue usage |
