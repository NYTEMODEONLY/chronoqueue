# ChronoQueue

A text-based idle RPG where time is your greatest weapon.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + Framer Motion |
| State | TanStack Query (server) + Zustand (client) |
| Database | Supabase (PostgreSQL) + Drizzle ORM |
| Auth | Supabase Auth |
| Monorepo | pnpm + Turborepo |
| CI | GitHub Actions |
| CD | Vercel |

## Project Structure

```
chronoqueue/
├── apps/
│   └── web/                  # Next.js application
├── packages/
│   ├── db/                   # Drizzle schema, migrations, DB client
│   └── game-engine/          # Core game logic (tick engine, formulas)
├── docs/
│   ├── architecture.md       # System architecture
│   ├── tech-stack-evaluation.md
│   └── adr/                  # Architecture Decision Records
└── .github/workflows/        # CI pipeline
```

## Prerequisites

- **Node.js** 20+ (see `.nvmrc`)
- **pnpm** 9+ (`corepack enable` to activate)
- **Supabase** account (for database)

## Setup

```bash
# 1. Clone the repo
git clone https://github.com/NYTEMODEONLY/chronoqueue.git
cd chronoqueue

# 2. Enable pnpm via corepack
corepack enable

# 3. Install dependencies
pnpm install

# 4. Set up environment variables
cp apps/web/.env.example apps/web/.env.local
# Edit .env.local with your Supabase credentials

# 5. Run the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start all packages in dev mode |
| `pnpm build` | Build all packages |
| `pnpm lint` | Lint all packages |
| `pnpm typecheck` | Type-check all packages |
| `pnpm test` | Run all tests |
| `pnpm format` | Format all files with Prettier |
| `pnpm format:check` | Check formatting |

### Database Commands

```bash
cd packages/db
pnpm db:generate    # Generate migration from schema changes
pnpm db:migrate     # Apply migrations
pnpm db:push        # Push schema directly (dev only)
pnpm db:studio      # Open Drizzle Studio (DB browser)
```

## Environment Variables

Create `apps/web/.env.local`:

```env
DATABASE_URL=postgresql://...    # Supabase connection string (pooler)
NEXT_PUBLIC_SUPABASE_URL=...     # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=...# Supabase anonymous key
QA_TOOL_TOKEN=...                # Optional shared token for /api/qa/test-hero-state
```

### QA mutation endpoint (manual refresh checks)

Use this endpoint to trigger deterministic hero state changes in non-player workflows:

```bash
curl -X POST "https://<staging-or-prod>/api/qa/test-hero-state" \
  -H "Content-Type: application/json" \
  -H "x-qa-token: $QA_TOOL_TOKEN" \
  --data '{
    "heroId": "<hero-id>",
    "action": "all",
    "questIncrement": 1,
    "eventType": "qa_test_event",
    "inventory": {
      "name": "QA Debug Item",
      "slot": "weapon"
    }
  }'
```

`action` options: `all`, `tick`, `quest`, `inventory`, `event`.

## Architecture

See [docs/architecture.md](docs/architecture.md) for the full system architecture.

See [docs/adr/](docs/adr/) for Architecture Decision Records explaining key technical choices.

## Deployment

The app deploys automatically via Vercel:
- **Preview:** Every PR gets a preview deployment.
- **Production:** Merges to `main` trigger production deployment.
