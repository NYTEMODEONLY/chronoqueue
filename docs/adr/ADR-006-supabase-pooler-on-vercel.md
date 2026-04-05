## ADR-006: Use Supabase Pooler Connection String in Vercel Runtime

**Status:** Accepted
**Date:** 2026-04-05

### Context
Character creation in production failed with `{"success":false,"error":"Failed to create character"}`. Runtime logs showed:
`getaddrinfo ENOTFOUND db.nwpkjsnfwhkatsnygkxn.supabase.co`.

The configured `DATABASE_URL` used the direct Supabase host (`db.<project-ref>.supabase.co`), which is not reliable in the current serverless DNS/network path. This blocked all writes from server actions.

### Decision
Use the Supabase pooler endpoint for `DATABASE_URL` in all Vercel environments (development, preview, production), specifically the pooler hostname with project-scoped username.

Also harden DB bootstrap (`packages/db/src/index.ts`) to:
- normalize malformed env values (trim + remove escaped `\n`),
- accept common Vercel Postgres env fallbacks,
- warn when a direct Supabase host is configured.

### Consequences
Positive:
- Restores `createCharacter` write path in production.
- Avoids direct-host DNS/runtime incompatibilities in serverless contexts.
- Adds explicit diagnostics to prevent silent recurrence.

Negative:
- Runtime behavior now depends on pooler configuration correctness.
- Slightly tighter coupling to Supabase connection-string conventions.

Neutral:
- Drizzle schema, server action contracts, and gameplay logic remain unchanged.

### Alternatives Considered
1. Keep direct `db.<ref>.supabase.co` host and retry logic.
Rejected: retries do not solve unresolved host/address-family mismatch.

2. Move to Supabase JS REST writes for character creation.
Rejected: unnecessary architectural detour; would bypass existing Drizzle data layer.

3. Add custom DNS/IPv6 connection handling in app code.
Rejected: higher complexity and lower portability than using the provider-supported pooler endpoint.
