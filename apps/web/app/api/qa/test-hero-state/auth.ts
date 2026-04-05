import { createHash, timingSafeEqual } from 'node:crypto'

type TokenInput = {
  headerToken?: string | null
  authorizationHeader?: string | null
  bodyToken?: string | null
}

function normalizeToken(value?: string | null): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function parseBearerToken(value?: string | null): string | null {
  const header = normalizeToken(value)
  if (!header) return null
  return normalizeToken(header.replace(/^Bearer\s+/i, ''))
}

function stringTokenMatch(expected: string, provided?: string | null): boolean {
  const normalized = normalizeToken(provided)
  if (!normalized) return false
  if (normalized.length !== expected.length) return false
  return timingSafeEqual(new TextEncoder().encode(normalized), new TextEncoder().encode(expected))
}

function deriveDatabaseFallbackToken(databaseUrl?: string): string | null {
  const normalized = normalizeToken(databaseUrl)
  if (!normalized) return null
  return createHash('sha256').update(normalized).digest('hex')
}

function resolveExpectedTokens(env: NodeJS.ProcessEnv): string[] {
  const configuredToken = normalizeToken(env.QA_TOOL_TOKEN)
  const databaseFallbackToken = deriveDatabaseFallbackToken(env.DATABASE_URL)

  const tokens = [configuredToken, databaseFallbackToken].filter((value): value is string => Boolean(value))
  return [...new Set(tokens)]
}

function resolveProvidedToken(input: TokenInput): string | null {
  return (
    normalizeToken(input.headerToken) ??
    parseBearerToken(input.authorizationHeader) ??
    normalizeToken(input.bodyToken)
  )
}

export function ensureToken(input: TokenInput, env: NodeJS.ProcessEnv = process.env): boolean {
  const expectedTokens = resolveExpectedTokens(env)
  if (expectedTokens.length === 0) {
    return env.NODE_ENV !== 'production'
  }

  const provided = resolveProvidedToken(input)
  if (!provided) return false
  return expectedTokens.some((expected) => stringTokenMatch(expected, provided))
}

