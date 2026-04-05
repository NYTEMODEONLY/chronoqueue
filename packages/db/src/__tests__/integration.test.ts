import { describe, it, expect, afterAll } from 'vitest'
import { hasDatabase, createTestDb } from './test-helpers'
import { players } from '../schema/player'

/**
 * Integration tests — require a live DATABASE_URL.
 * These tests verify actual database operations against Supabase/PostgreSQL.
 * They are skipped in CI until Supabase credentials are configured.
 */
describe.skipIf(!hasDatabase())('Database integration', () => {
  const testCtx = hasDatabase() ? createTestDb() : null

  afterAll(async () => {
    await testCtx?.cleanup()
  })

  it('can query the players table', async () => {
    const db = testCtx!.db
    const result = await db.select().from(players).limit(1)
    expect(Array.isArray(result)).toBe(true)
  })
})
