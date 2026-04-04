export interface QueueSlot {
  id: string
  position: number
  actionType: string
  targetId: string
  durationSeconds: number
  startedAt: Date | null
  completesAt: Date | null
}

export interface CompletedAction {
  slotId: string
  actionType: string
  targetId: string
  completedAt: Date
}

export interface QueueResult {
  completed: CompletedAction[]
  updatedSlots: QueueSlot[]
}

/**
 * Process a player's queue at a given point in time.
 *
 * This is the core idle engine. It takes the current queue state and the current
 * time, and returns which actions have completed and the updated queue state.
 *
 * The engine is purely functional: (slots, now) → result.
 * No I/O, no side effects, no database access.
 */
export function processQueue(slots: QueueSlot[], now: Date): QueueResult {
  const sorted = [...slots].sort((a, b) => a.position - b.position)
  const completed: CompletedAction[] = []
  const updatedSlots: QueueSlot[] = []

  let chainTime: Date | null = null

  for (const slot of sorted) {
    let startedAt = slot.startedAt
    let completesAt = slot.completesAt

    // If this slot hasn't started yet, chain it from the previous completion
    if (!startedAt) {
      if (chainTime) {
        startedAt = chainTime
        completesAt = new Date(chainTime.getTime() + slot.durationSeconds * 1000)
      } else {
        // First slot in queue, start now
        startedAt = now
        completesAt = new Date(now.getTime() + slot.durationSeconds * 1000)
      }
    }

    if (completesAt && completesAt <= now) {
      // This action has completed
      completed.push({
        slotId: slot.id,
        actionType: slot.actionType,
        targetId: slot.targetId,
        completedAt: completesAt,
      })
      chainTime = completesAt
    } else {
      // This action is still in progress or hasn't started
      updatedSlots.push({
        ...slot,
        startedAt,
        completesAt,
      })
      // Don't chain from incomplete actions — they block the queue
      break
    }
  }

  // Any remaining slots after the break stay unchanged
  const processedIds = new Set([
    ...completed.map((c) => c.slotId),
    ...updatedSlots.map((s) => s.id),
  ])

  for (const slot of sorted) {
    if (!processedIds.has(slot.id)) {
      updatedSlots.push(slot)
    }
  }

  return { completed, updatedSlots }
}
