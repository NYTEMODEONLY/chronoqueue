## ADR-002: Supabase (PostgreSQL) as Primary Database

**Status:** Proposed
**Date:** 2026-04-04

### Context

ChronoQueue requires persistent player data that survives indefinitely (30+ day absence). The data is inherently relational: players have heroes, heroes have equipment, players have quest progress, queues have ordered slots with references to actions and targets.

The database must be:
- **Serverless-compatible** — Vercel functions create ephemeral connections.
- **Relational** — RPG data has many-to-many and one-to-many relationships.
- **Scalable** — must handle growth without re-architecting.
- **Feature-rich** — auth, real-time, and storage are needed at various points.

### Decision

Use **Supabase** as the managed PostgreSQL provider, leveraging its integrated Auth, Realtime, and connection pooling (Supavisor) services.

**Key reasons:**
1. **PostgreSQL is the right data model.** RPG entities are relational. Inventory joins to items, quest progress joins to quests, queue slots reference heroes and actions. SQL handles this natively.
2. **Supabase bundles the platform.** Auth, Realtime, Row Level Security, connection pooling, and a dashboard — all from one provider. This avoids integrating 3-4 separate services.
3. **Supavisor solves the serverless connection problem.** Vercel functions are ephemeral. Supavisor pools connections so we don't exhaust Postgres connection limits.
4. **Realtime is ready for social features.** Post-MVP social features (guilds, trades) need real-time events. Supabase Realtime (Postgres LISTEN/NOTIFY) is already available — zero additional infrastructure when the time comes.
5. **Row Level Security** provides defense-in-depth. Even if application code has a bug, RLS ensures players can only access their own data.

### Consequences

**Positive:**
- Single provider for DB + auth + realtime. Fewer bills, fewer dashboards, fewer failure points.
- Generous free tier (500 MB, 2 projects) for development and early launch.
- PostgreSQL's JSONB columns allow flexible data (stats, rewards, config) without migration churn.
- Strong Vercel integration (official Supabase integration in Vercel marketplace).

**Negative:**
- Vendor lock-in to Supabase's managed Postgres. Mitigation: Supabase is open-source; self-hosting is possible but operationally expensive.
- Supabase's free tier has limits (500 MB storage, pauses after 1 week inactivity on free). Must upgrade before launch.
- Connection pooling adds a hop. Negligible latency for our use case.

**Neutral:**
- Must manage Supabase project separately from Vercel (different dashboard, different billing).

### Alternatives Considered

| Alternative | Why Rejected |
|---|---|
| **Neon** | Excellent serverless Postgres with branching, but no auth, no realtime, no storage. We'd need Clerk + Pusher + S3 to match Supabase's feature set. |
| **PlanetScale** | MySQL (less natural for complex RPG joins), removed free tier, and MySQL lacks JSONB for flexible game data. |
| **MongoDB Atlas** | Document model works for some games, but ChronoQueue's data is highly relational. Embedding documents leads to update anomalies; referencing leads to application-level joins. PostgreSQL handles this natively. |
| **Turso (libSQL)** | Interesting edge-read performance via SQLite replicas, but immature for a primary write-heavy datastore. No auth, no realtime. |
