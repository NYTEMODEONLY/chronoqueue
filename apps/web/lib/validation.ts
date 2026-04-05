const NAME_REGEX = /^[A-Za-z0-9 \-]+$/
const MAX_NAME_LENGTH = 20
const MIN_NAME_LENGTH = 1

export interface NameValidationResult {
  value: string
  error: string | null
  isValid: boolean
}

export function validateHeroName(raw: string): NameValidationResult {
  const trimmed = raw.trim()

  // Empty / whitespace-only → "Adventurer", no error
  if (trimmed.length === 0) {
    return { value: 'Adventurer', error: null, isValid: true }
  }

  // Strip invalid characters
  const cleaned = trimmed.replace(/[^A-Za-z0-9 \-]/g, '')

  // All chars were invalid → "Adventurer" with error
  if (cleaned.length === 0) {
    return {
      value: 'Adventurer',
      error: 'Only letters, numbers, spaces, and hyphens are allowed.',
      isValid: true,
    }
  }

  // Had invalid chars stripped
  if (cleaned !== trimmed) {
    const truncated = cleaned.slice(0, MAX_NAME_LENGTH)
    return {
      value: truncated,
      error: 'Only letters, numbers, spaces, and hyphens are allowed.',
      isValid: true,
    }
  }

  // Over max length
  if (trimmed.length > MAX_NAME_LENGTH) {
    return {
      value: trimmed.slice(0, MAX_NAME_LENGTH),
      error: 'Name cannot exceed 20 characters.',
      isValid: true,
    }
  }

  // Valid
  return { value: trimmed, error: null, isValid: true }
}

/** Live validation for the input field (doesn't auto-correct, just reports) */
export function validateNameLive(raw: string): { error: string | null; charCount: number } {
  const trimmed = raw.trim()
  const charCount = trimmed.length

  if (charCount === 0) {
    return { error: null, charCount: 0 }
  }

  if (!NAME_REGEX.test(trimmed)) {
    return { error: 'Only letters, numbers, spaces, and hyphens are allowed.', charCount }
  }

  if (charCount > MAX_NAME_LENGTH) {
    return { error: 'Name cannot exceed 20 characters.', charCount }
  }

  return { error: null, charCount }
}

/** Check if a raw name input is ready to proceed (2+ valid chars, or empty for default) */
export function canProceedWithName(raw: string): boolean {
  const trimmed = raw.trim()
  if (trimmed.length === 0) return true // Will default to "Adventurer"
  const cleaned = trimmed.replace(/[^A-Za-z0-9 \-]/g, '')
  return cleaned.length >= MIN_NAME_LENGTH && cleaned.length <= MAX_NAME_LENGTH
}
