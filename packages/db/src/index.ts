import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema/index'

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null

function resolveDatabaseUrl(): string {
  const raw =
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.POSTGRES_PRISMA_URL

  if (!raw) {
    throw new Error('DATABASE_URL environment variable is required')
  }

  // Guard against accidental trailing newlines or escaped "\n" from copy/paste.
  const connectionString = raw.trim().replace(/\\n/g, '')

  try {
    const url = new URL(connectionString)
    if (/^db\.[a-z0-9]{20}\.supabase\.co$/i.test(url.hostname)) {
      console.warn(
        '[db] DATABASE_URL points to direct Supabase host. In IPv4-only serverless runtimes, use Supabase pooler host instead.'
      )
    }
  } catch {
    throw new Error('DATABASE_URL is not a valid URL')
  }

  return connectionString
}

export function getDb() {
  if (!_db) {
    const connectionString = resolveDatabaseUrl()
    const client = postgres(connectionString, { prepare: false })
    _db = drizzle(client, { schema })
  }
  return _db
}

export type Database = ReturnType<typeof getDb>

export * from './schema/index'
