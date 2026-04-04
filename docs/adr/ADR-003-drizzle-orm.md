## ADR-003: Drizzle ORM for Database Access

**Status:** Proposed
**Date:** 2026-04-04

### Context

We need a TypeScript ORM/query builder to interact with Supabase PostgreSQL from Vercel serverless functions. The ORM must:
- Be type-safe (TypeScript-first).
- Have fast cold starts (serverless functions spin up frequently).
- Support PostgreSQL-specific features (JSONB, enums, timestamps).
- Be lightweight enough for serverless deployment (Vercel function size limits).

### Decision

Use **Drizzle ORM** with the `postgres.js` driver for all database access.

**Key reasons:**
1. **No binary engine.** Drizzle is pure TypeScript — ~30 kB vs Prisma's ~2 MB Rust engine binary. This means 60x smaller deployment artifacts and significantly faster cold starts.
2. **SQL-native syntax.** Drizzle queries read like SQL, not a proprietary DSL. The team thinks in SQL; the ORM should match.
3. **Full type inference from schema.** Define the schema once in TypeScript; all queries, inserts, and results are fully typed without code generation.
4. **Zero code generation step.** Prisma requires `prisma generate` after every schema change. Drizzle infers types directly from schema definitions — no build step, no generated client.
5. **First-class PostgreSQL support.** JSONB columns, custom types, array columns, and Postgres-specific operators are all supported.

### Consequences

**Positive:**
- Faster serverless cold starts (smaller bundle, no binary).
- Schema-as-code: TypeScript schema files are the source of truth.
- `drizzle-kit` handles migration generation and management.
- Growing ecosystem and active maintenance.

**Negative:**
- Smaller ecosystem than Prisma (fewer examples, fewer Stack Overflow answers).
- Relational queries (nested includes) are less ergonomic than Prisma's `include` syntax. Drizzle's `with` API works but requires more explicit configuration.
- Newer project — less battle-tested in large production deployments.

**Neutral:**
- Migration workflow is similar to Prisma: edit schema → generate migration → apply. No significant DX difference.

### Alternatives Considered

| Alternative | Why Rejected |
|---|---|
| **Prisma** | Industry standard, excellent DX for relational queries, but the Rust engine binary (~2 MB) causes slow cold starts on Vercel serverless. Also requires a code generation step (`prisma generate`) that adds build complexity. |
| **Kysely** | Type-safe query builder, very lightweight, but lacks ORM features (relations, schema-as-code, migrations). We'd need to build more infrastructure around it. |
| **Raw SQL (postgres.js)** | Maximum control, zero abstraction overhead, but no type safety on query results, no migration tooling, and error-prone for complex joins. Not worth the risk for a team project. |
