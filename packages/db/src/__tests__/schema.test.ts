import { describe, it, expect } from 'vitest'
import { players } from '../schema/player'
import { getTableName } from 'drizzle-orm'

describe('Schema validation', () => {
  it('players table has correct name', () => {
    expect(getTableName(players)).toBe('players')
  })

  it('players table has required columns', () => {
    const columns = Object.keys(players)
    expect(columns).toContain('id')
    expect(columns).toContain('authId')
    expect(columns).toContain('username')
    expect(columns).toContain('createdAt')
    expect(columns).toContain('lastSeenAt')
  })
})
