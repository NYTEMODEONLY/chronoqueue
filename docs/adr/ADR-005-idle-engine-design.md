## ADR-005: Deterministic Timestamp-Based Idle Engine

**Status:** Proposed
**Date:** 2026-04-04

### Context

ChronoQueue is an idle RPG where player progression continues even when the player is offline. The core mechanic is a "queue" of actions (train hero, run quest, craft item) that execute sequentially over real time.

The idle engine must:
- Process player actions over real time, including while offline.
- Compute arbitrarily long offline periods efficiently (up to 30 days).
- Produce deterministic results (same input → same output, regardless of when computed).
- Be server-authoritative (no client-side game state computation).
- Execute within Vercel serverless function limits (~10 second timeout, ~50 MB memory).

### Decision

Implement a **deterministic timestamp-based idle engine** that stores future completion timestamps and computes results on demand, rather than running real-time tick simulations.

**Core principle:** The engine never "runs" in the background. It stores `completes_at` timestamps and calculates outcomes when the player's state is next read.

**How it works:**

1. **Action start:** When a player starts an action, the engine computes `completes_at = now + duration` and stores it.
2. **State read (online poll or reconnect):** The engine reads all pending queue slots, checks which have `completes_at <= now`, applies their rewards, and chains the next action's `started_at` from the previous action's `completes_at`.
3. **Offline catch-up:** Identical to an online poll — the engine processes all completed actions in sequence. A 30-day absence with 20 queue slots is 20 sequential timestamp comparisons and reward applications. Trivial compute.

**Key design rules:**
- All durations are stored as seconds in the database.
- All timestamps are UTC (Postgres `timestamptz`).
- Chaining: `next_slot.started_at = prev_slot.completes_at` (not `now`). This ensures deterministic ordering regardless of when the player returns.
- Rewards are computed from the game data at the time the action was started (snapshot), not current game data. This prevents retroactive balance changes from altering past results.

### Consequences

**Positive:**
- **Zero background compute.** No daemon, no worker, no cron job running per-player ticks. The engine only runs when a player's state is read.
- **Infinite offline support** (up to the 30-day cap). No data loss, no missed ticks.
- **Deterministic.** Same input always produces the same output. Testable, debuggable, reproducible.
- **Serverless-compatible.** Each computation is stateless and short-lived. Fits Vercel's model perfectly.
- **Efficient.** Processing 30 days of a 20-slot queue is O(20) — constant time relative to offline duration.

**Negative:**
- **No real-time events for other players.** If player A's action completes, player B doesn't see it in real-time (relevant for future social features). Mitigation: Supabase Realtime can emit events when rows change — this is handled at the DB layer, not the engine layer.
- **Snapshot complexity.** Storing reward snapshots at action start time adds data to each queue slot. This prevents retroactive balance changes from being applied, which could be a gameplay concern. Mitigation: this is actually a feature — players can trust that what they queued is what they'll get.
- **Clock dependency.** The engine assumes server clocks are accurate. Mitigation: all timestamps are server-generated (never trust client clocks).

**Neutral:**
- The `game-engine` package is purely functional: `(state, currentTime) → newState`. No side effects, no I/O. The caller (Server Action / Route Handler) handles DB reads and writes.

### Alternatives Considered

| Alternative | Why Rejected |
|---|---|
| **Real-time tick simulation (interval-based)** | Requires a persistent process (server or worker) running per-player ticks. Doesn't work on Vercel serverless. Would require a separate infrastructure (Railway, Fly.io, etc.) for tick workers. Expensive, complex, unnecessary for an idle game. |
| **Cron-based batch processing** | Run a cron job every N minutes that processes all active players. Problem: Vercel Cron has a 60-second timeout. With enough players, this doesn't scale. Also adds latency (player returns, but their state won't be updated until the next cron run). |
| **Client-side simulation with server validation** | Client computes progression, server validates on sync. Problem: this makes the client an authority — opens the door to cheating and requires complex conflict resolution. Violates our server-authoritative principle. |
| **Event-sourcing with projections** | Store all actions as events, compute state by replaying. Elegant but adds significant complexity for the same deterministic result our timestamp approach achieves. The event log would grow linearly with play time. Overkill for our use case. |

### Performance Budget

| Metric | Budget | Rationale |
|---|---|---|
| Tick computation (online poll) | < 50ms | Must feel instant to the polling loop |
| Offline catch-up (30 days, 20 slots) | < 200ms | Must complete within serverless timeout with margin |
| Memory per computation | < 10 MB | Serverless function memory is limited |
| Queue slot limit | 20 | Bounds worst-case computation; also a game design lever |
