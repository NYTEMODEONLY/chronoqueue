import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../schema/index'

/**
 * Creates a test database connection.
 * Requires DATABASE_URL to be set — integration tests skip gracefully without it.
 */
export function createTestDb() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is required for integration tests')
  }
  const client = postgres(url)
  return {
    db: drizzle(client, { schema }),
    client,
    async cleanup() {
      await client.end()
    },
  }
}

/**
 * Skip condition for integration tests that need a real database.
 * Use: `test.skipIf(!hasDatabase())(...)`
 */
export function hasDatabase(): boolean {
  return !!process.env.DATABASE_URL
}
