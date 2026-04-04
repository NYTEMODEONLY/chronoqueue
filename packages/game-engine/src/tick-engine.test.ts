import { describe, it, expect } from 'vitest'
import { processQueue, type QueueSlot } from './tick-engine'

function makeSlot(overrides: Partial<QueueSlot> & { id: string; position: number }): QueueSlot {
  return {
    actionType: 'train',
    targetId: 'hero-1',
    durationSeconds: 3600,
    startedAt: null,
    completesAt: null,
    ...overrides,
  }
}

describe('processQueue', () => {
  it('returns empty result for empty queue', () => {
    const result = processQueue([], new Date())
    expect(result.completed).toEqual([])
    expect(result.updatedSlots).toEqual([])
  })

  it('starts the first slot when nothing is in progress', () => {
    const now = new Date('2026-01-01T12:00:00Z')
    const slots = [makeSlot({ id: 'a', position: 0, durationSeconds: 3600 })]

    const result = processQueue(slots, now)

    expect(result.completed).toHaveLength(0)
    expect(result.updatedSlots).toHaveLength(1)
    expect(result.updatedSlots[0].startedAt).toEqual(now)
    expect(result.updatedSlots[0].completesAt).toEqual(new Date('2026-01-01T13:00:00Z'))
  })

  it('completes a slot that has finished', () => {
    const now = new Date('2026-01-01T14:00:00Z')
    const slots = [
      makeSlot({
        id: 'a',
        position: 0,
        durationSeconds: 3600,
        startedAt: new Date('2026-01-01T12:00:00Z'),
        completesAt: new Date('2026-01-01T13:00:00Z'),
      }),
    ]

    const result = processQueue(slots, now)

    expect(result.completed).toHaveLength(1)
    expect(result.completed[0].slotId).toBe('a')
    expect(result.completed[0].completedAt).toEqual(new Date('2026-01-01T13:00:00Z'))
  })

  it('chains slots sequentially during offline catch-up', () => {
    const now = new Date('2026-01-01T20:00:00Z')
    const slots = [
      makeSlot({
        id: 'a',
        position: 0,
        durationSeconds: 3600,
        startedAt: new Date('2026-01-01T12:00:00Z'),
        completesAt: new Date('2026-01-01T13:00:00Z'),
      }),
      makeSlot({
        id: 'b',
        position: 1,
        durationSeconds: 7200, // 2 hours
      }),
      makeSlot({
        id: 'c',
        position: 2,
        durationSeconds: 3600,
      }),
    ]

    const result = processQueue(slots, now)

    // Slot A: completed at 13:00
    expect(result.completed).toHaveLength(3)
    expect(result.completed[0].slotId).toBe('a')
    expect(result.completed[0].completedAt).toEqual(new Date('2026-01-01T13:00:00Z'))

    // Slot B: chained from 13:00, completed at 15:00
    expect(result.completed[1].slotId).toBe('b')
    expect(result.completed[1].completedAt).toEqual(new Date('2026-01-01T15:00:00Z'))

    // Slot C: chained from 15:00, completed at 16:00
    expect(result.completed[2].slotId).toBe('c')
    expect(result.completed[2].completedAt).toEqual(new Date('2026-01-01T16:00:00Z'))
  })

  it('stops at an incomplete slot', () => {
    const now = new Date('2026-01-01T14:00:00Z')
    const slots = [
      makeSlot({
        id: 'a',
        position: 0,
        durationSeconds: 3600,
        startedAt: new Date('2026-01-01T12:00:00Z'),
        completesAt: new Date('2026-01-01T13:00:00Z'),
      }),
      makeSlot({
        id: 'b',
        position: 1,
        durationSeconds: 7200, // 2 hours — chains from 13:00, completes at 15:00
      }),
      makeSlot({
        id: 'c',
        position: 2,
        durationSeconds: 3600,
      }),
    ]

    const result = processQueue(slots, now)

    // Slot A completed
    expect(result.completed).toHaveLength(1)
    expect(result.completed[0].slotId).toBe('a')

    // Slot B in progress (started at 13:00, completes at 15:00, now is 14:00)
    expect(result.updatedSlots[0].id).toBe('b')
    expect(result.updatedSlots[0].startedAt).toEqual(new Date('2026-01-01T13:00:00Z'))
    expect(result.updatedSlots[0].completesAt).toEqual(new Date('2026-01-01T15:00:00Z'))

    // Slot C is unchanged (still null start)
    expect(result.updatedSlots[1].id).toBe('c')
    expect(result.updatedSlots[1].startedAt).toBeNull()
  })
})
