import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { ensureToken } from './auth'

function hash(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

describe('qa test-hero-state auth', () => {
  it('accepts QA_TOOL_TOKEN from x-qa-token header', () => {
    const ok = ensureToken(
      {
        headerToken: 'super-secret-token',
      },
      {
        NODE_ENV: 'production',
        QA_TOOL_TOKEN: 'super-secret-token',
      }
    )

    expect(ok).toBe(true)
  })

  it('accepts bearer token from authorization header', () => {
    const ok = ensureToken(
      {
        authorizationHeader: 'Bearer qa-bearer-token',
      },
      {
        NODE_ENV: 'production',
        QA_TOOL_TOKEN: 'qa-bearer-token',
      }
    )

    expect(ok).toBe(true)
  })

  it('accepts derived fallback token from DATABASE_URL when QA_TOOL_TOKEN is missing', () => {
    const databaseUrl = 'postgresql://postgres:password@example.test:5432/postgres'

    const ok = ensureToken(
      {
        headerToken: hash(databaseUrl),
      },
      {
        NODE_ENV: 'production',
        DATABASE_URL: databaseUrl,
      }
    )

    expect(ok).toBe(true)
  })

  it('rejects request in production when no token sources exist', () => {
    const ok = ensureToken(
      {
        headerToken: 'anything',
      },
      {
        NODE_ENV: 'production',
      }
    )

    expect(ok).toBe(false)
  })

  it('permits request in non-production when no token sources exist', () => {
    const ok = ensureToken(
      {
        headerToken: null,
      },
      {
        NODE_ENV: 'development',
      }
    )

    expect(ok).toBe(true)
  })
})

