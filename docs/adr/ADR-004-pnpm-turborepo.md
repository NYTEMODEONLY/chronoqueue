## ADR-004: pnpm + Turborepo Monorepo

**Status:** Proposed
**Date:** 2026-04-04

### Context

ChronoQueue has multiple logical packages: the web application, a database schema/client package, and a game engine package. These packages share TypeScript configuration, depend on each other, and must be built/tested together.

We need a package manager and build orchestrator that:
- Supports workspaces (inter-package dependencies).
- Works with Vercel's build system.
- Enables fast CI builds via caching.
- Enforces dependency discipline (no phantom dependencies).

### Decision

Use **pnpm** as the package manager and **Turborepo** as the monorepo build orchestrator.

**Key reasons:**
1. **pnpm is the fastest package manager** with the smallest disk footprint (content-addressable storage). On CI, faster installs mean faster feedback loops.
2. **pnpm's strict mode prevents phantom dependencies.** If a package doesn't declare a dependency, it can't import it. This catches real bugs that npm and yarn silently allow.
3. **Turborepo is Vercel's own build tool.** Zero-config deployment on Vercel: it detects pnpm workspaces and Turborepo automatically.
4. **Remote caching** shares build artifacts between CI runs and developers. A build that was already done by CI doesn't need to be redone locally.
5. **Minimal configuration.** A single `turbo.json` defines the task dependency graph (build depends on ^build, test depends on ^build, etc.).

### Consequences

**Positive:**
- CI install times 2-3x faster than npm.
- Deterministic builds via pnpm's lockfile and strict resolution.
- Turborepo's `--filter` enables targeted builds (only rebuild what changed).
- Vercel detects and optimizes for this setup automatically.

**Negative:**
- pnpm's strict module resolution occasionally breaks packages that rely on hoisting (rare, fixable via `pnpm.overrides` or `.npmrc` settings).
- Developers must install pnpm (not pre-installed like npm). Mitigated by `packageManager` field in `package.json` and corepack.
- Turborepo is another tool to learn. However, its config is minimal (~20 lines of JSON).

**Neutral:**
- Monorepo adds initial setup overhead vs. a single-package repo. This pays off quickly as the codebase grows.

### Alternatives Considered

| Alternative | Why Rejected |
|---|---|
| **npm workspaces** | Slower installs, larger `node_modules`, no strict mode, no remote caching. Works but offers no advantage over pnpm. |
| **yarn (Berry)** | PnP mode causes compatibility issues with many packages. Classic mode is fine but no meaningful advantage over pnpm. |
| **bun** | Fastest runtime, good package manager, but incomplete Vercel support and immature monorepo tooling. Too risky for a production project. |
| **Nx** | More powerful than Turborepo (distributed execution, module boundary enforcement), but heavier config and not Vercel-native. Overkill for our repo size. |
| **Single-package repo** | Simpler setup, but forces the game engine and DB schema to be coupled to the Next.js app. Can't test game logic in isolation. Can't share packages with a future mobile client. |
