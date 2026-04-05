import { describe, it, expect } from 'vitest'
import { validateHeroName, validateNameLive, canProceedWithName } from './validation'

describe('validateHeroName', () => {
  it('accepts valid names', () => {
    const result = validateHeroName('TimeKnight')
    expect(result.value).toBe('TimeKnight')
    expect(result.error).toBeNull()
    expect(result.isValid).toBe(true)
  })

  it('defaults empty input to Adventurer', () => {
    const result = validateHeroName('')
    expect(result.value).toBe('Adventurer')
    expect(result.error).toBeNull()
  })

  it('defaults whitespace-only to Adventurer', () => {
    const result = validateHeroName('   ')
    expect(result.value).toBe('Adventurer')
    expect(result.error).toBeNull()
  })

  it('accepts exactly 20 characters', () => {
    const name = 'ABCDEFGHIJKLMNOPQRST'
    expect(name.length).toBe(20)
    const result = validateHeroName(name)
    expect(result.value).toBe(name)
    expect(result.error).toBeNull()
  })

  it('truncates names over 20 characters', () => {
    const name = 'ABCDEFGHIJKLMNOPQRSTU'
    expect(name.length).toBe(21)
    const result = validateHeroName(name)
    expect(result.value).toBe('ABCDEFGHIJKLMNOPQRST')
    expect(result.error).toBe('Name cannot exceed 20 characters.')
  })

  it('strips invalid characters and shows error', () => {
    const result = validateHeroName('Hero@#$Name')
    expect(result.value).toBe('HeroName')
    expect(result.error).toBe('Only letters, numbers, spaces, and hyphens are allowed.')
  })

  it('accepts hyphens and spaces', () => {
    const result = validateHeroName('Time-Knight One')
    expect(result.value).toBe('Time-Knight One')
    expect(result.error).toBeNull()
  })

  it('defaults all-invalid chars to Adventurer', () => {
    const result = validateHeroName('@#$%')
    expect(result.value).toBe('Adventurer')
    expect(result.error).toBe('Only letters, numbers, spaces, and hyphens are allowed.')
  })

  it('strips unicode/emoji', () => {
    const result = validateHeroName('Hero\u2B50')
    expect(result.value).toBe('Hero')
    expect(result.error).toBe('Only letters, numbers, spaces, and hyphens are allowed.')
  })
})

describe('validateNameLive', () => {
  it('returns no error for empty input', () => {
    const result = validateNameLive('')
    expect(result.error).toBeNull()
    expect(result.charCount).toBe(0)
  })

  it('returns error for invalid chars', () => {
    const result = validateNameLive('test@')
    expect(result.error).toBe('Only letters, numbers, spaces, and hyphens are allowed.')
  })

  it('returns error for over 20 chars', () => {
    const result = validateNameLive('ABCDEFGHIJKLMNOPQRSTU')
    expect(result.error).toBe('Name cannot exceed 20 characters.')
  })
})

describe('canProceedWithName', () => {
  it('allows empty (defaults to Adventurer)', () => {
    expect(canProceedWithName('')).toBe(true)
  })

  it('allows valid names', () => {
    expect(canProceedWithName('Gerald')).toBe(true)
  })

  it('rejects names over 20 chars', () => {
    expect(canProceedWithName('ABCDEFGHIJKLMNOPQRSTU')).toBe(false)
  })
})
