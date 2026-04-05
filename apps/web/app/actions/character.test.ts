import { describe, expect, it } from 'vitest'
import { isHeroNameTakenError } from '@/lib/hero-name-errors'

describe('isHeroNameTakenError', () => {
  it('matches duplicate-name conflicts from postgres-js constraint_name', () => {
    const error = {
      code: '23505',
      constraint_name: 'players_username_unique',
    }

    expect(isHeroNameTakenError(error)).toBe(true)
  })

  it('matches duplicate-name conflicts wrapped in cause', () => {
    const wrappedError = {
      message: 'query failed',
      cause: {
        code: '23505',
        message: 'duplicate key value violates unique constraint "players_username_key"',
      },
    }

    expect(isHeroNameTakenError(wrappedError)).toBe(true)
  })

  it('matches duplicate-name conflicts when code is stripped but constraint is in message', () => {
    const error = {
      message: 'duplicate key value violates unique constraint "players_username_key"',
    }

    expect(isHeroNameTakenError(error)).toBe(true)
  })

  it('matches duplicate-name conflicts when code is stripped but detail contains username key', () => {
    const error = {
      detail: 'Key (username)=(TakenName) already exists.',
    }

    expect(isHeroNameTakenError(error)).toBe(true)
  })

  it('matches duplicate-name conflicts from legacy constraint property', () => {
    const error = {
      code: '23505',
      constraint: 'heroes_name_key',
    }

    expect(isHeroNameTakenError(error)).toBe(true)
  })

  it('matches duplicate-name conflicts from Error instances', () => {
    const error = new Error(
      'duplicate key value violates unique constraint "players_username_unique"'
    )
    error.name = 'k'

    expect(isHeroNameTakenError(error)).toBe(true)
  })

  it('matches duplicate-name conflicts from stringified-only errors', () => {
    const error = {
      toString: () => 'k: duplicate key value violates unique constraint "players_username_unique"',
    }

    expect(isHeroNameTakenError(error)).toBe(true)
  })

  it('does not treat auth_id unique conflicts as name conflicts', () => {
    const error = {
      code: '23505',
      constraint_name: 'players_auth_id_unique',
      detail: 'Key (auth_id)=(qa-device-id) already exists.',
    }

    expect(isHeroNameTakenError(error)).toBe(false)
  })

  it('does not treat auth_id message conflicts as name conflicts when code is stripped', () => {
    const error = {
      message: 'duplicate key value violates unique constraint "players_auth_id_unique"',
      detail: 'Key (auth_id)=(qa-device-id) already exists.',
    }

    expect(isHeroNameTakenError(error)).toBe(false)
  })

  it('does not treat auth_id conflicts from stringified-only errors as name conflicts', () => {
    const error = {
      toString: () => 'k: duplicate key value violates unique constraint "players_auth_id_unique"',
    }

    expect(isHeroNameTakenError(error)).toBe(false)
  })
})
