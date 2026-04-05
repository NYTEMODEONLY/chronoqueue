type CandidateDbError = {
  code?: string
  detail?: string
  message?: string
  constraint?: string
  constraint_name?: string
  table_name?: string
  column_name?: string
  cause?: unknown
  error?: unknown
  originalError?: unknown
  errors?: unknown
}

const HERO_NAME_UNIQUE_CONSTRAINTS = new Set([
  'players_username_key',
  'players_username_unique',
  'heroes_name_key',
  'heroes_name_unique',
])

function parseConstraintFromMessage(message: string): string | null {
  const quotedMatch = message.match(/unique constraint "([^"]+)"/i)
  if (quotedMatch?.[1]) return quotedMatch[1]

  const unquotedMatch = message.match(/unique constraint ([^\s]+)/i)
  if (unquotedMatch?.[1]) return unquotedMatch[1]

  return null
}

function toErrorText(value: unknown): string {
  try {
    return String(value)
  } catch {
    return ''
  }
}

function mentionsDuplicateName(text: string): boolean {
  const normalized = text.toLowerCase()
  if (normalized.includes('(username)=(') || normalized.includes('(name)=(')) {
    return true
  }
  return (
    normalized.includes('duplicate key') &&
    (normalized.includes('username') || normalized.includes('name'))
  )
}

function mentionsUniqueViolation(text: string): boolean {
  const normalized = text.toLowerCase()
  return normalized.includes('duplicate key value') || normalized.includes('unique constraint')
}

function collectNestedErrors(root: unknown): CandidateDbError[] {
  const stack = [root]
  const visited = new Set<object>()
  const collected: CandidateDbError[] = []

  while (stack.length > 0) {
    const value = stack.pop()
    if (!value || typeof value !== 'object') continue
    if (visited.has(value)) continue
    visited.add(value)

    const candidate = value as CandidateDbError
    collected.push(candidate)

    if (candidate.cause) stack.push(candidate.cause)
    if (candidate.error) stack.push(candidate.error)
    if (candidate.originalError) stack.push(candidate.originalError)
    if (Array.isArray(candidate.errors)) {
      for (const nested of candidate.errors) {
        stack.push(nested)
      }
    }
  }

  return collected
}

export function isHeroNameTakenError(error: unknown): boolean {
  for (const dbError of collectNestedErrors(error)) {
    const message = typeof dbError.message === 'string' ? dbError.message : ''
    const detail = typeof dbError.detail === 'string' ? dbError.detail : ''
    const rawText = toErrorText(dbError)
    const parsedConstraint = message ? parseConstraintFromMessage(message) : null
    const parsedConstraintFromDetail = detail ? parseConstraintFromMessage(detail) : null
    const parsedConstraintFromRawText = rawText ? parseConstraintFromMessage(rawText) : null
    const constraintCandidates = [
      dbError.constraint,
      dbError.constraint_name,
      parsedConstraint,
      parsedConstraintFromDetail,
      parsedConstraintFromRawText,
    ].filter((constraint): constraint is string => typeof constraint === 'string')

    const hasHeroNameConstraint = constraintCandidates.some((constraint) =>
      HERO_NAME_UNIQUE_CONSTRAINTS.has(constraint)
    )

    if (hasHeroNameConstraint) {
      return true
    }

    const hasDuplicateNameMarkers =
      mentionsDuplicateName(detail) ||
      mentionsDuplicateName(message) ||
      mentionsDuplicateName(rawText)
    if (hasDuplicateNameMarkers) {
      return true
    }

    const tableName = typeof dbError.table_name === 'string' ? dbError.table_name : null
    const columnName = typeof dbError.column_name === 'string' ? dbError.column_name : null
    const hasHeroNameColumnMarkers =
      (tableName === 'players' && columnName === 'username') ||
      (tableName === 'heroes' && columnName === 'name')

    const code = typeof dbError.code === 'string' ? dbError.code : null
    const isUniqueViolation =
      code === '23505' || mentionsUniqueViolation(message) || mentionsUniqueViolation(detail)
    if (hasHeroNameColumnMarkers && isUniqueViolation) {
      return true
    }
  }

  return false
}
