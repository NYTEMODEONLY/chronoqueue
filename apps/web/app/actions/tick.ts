'use server'

import { getDb, queueSlots, heroes, gameEvents } from '@chronoqueue/db'
import { eq } from 'drizzle-orm'
import { processQueue, type QueueSlot } from '@chronoqueue/game-engine'

export interface TickResult {
  completedCount: number
  remainingSlots: number
  lastTickAt: string
}

export async function processTick(heroId: string): Promise<TickResult> {
  const db = getDb()
  const now = new Date()

  // 1. Load queue slots for this hero
  const slots = await db
    .select()
    .from(queueSlots)
    .where(eq(queueSlots.heroId, heroId))

  if (slots.length === 0) {
    // No queue — just update lastTickAt
    await db
      .update(heroes)
      .set({ lastTickAt: now })
      .where(eq(heroes.id, heroId))

    return { completedCount: 0, remainingSlots: 0, lastTickAt: now.toISOString() }
  }

  // 2. Map DB slots to engine format
  // Duration is determined by action type — default 3s per action for MVP
  const ACTION_DURATIONS: Record<string, number> = {
    combat: 3,
    train: 5,
    quest: 10,
    craft: 8,
    rest: 2,
  }

  const engineSlots: QueueSlot[] = slots.map((s) => ({
    id: s.id,
    position: s.position,
    actionType: s.actionType,
    targetId: s.targetId ?? '',
    durationSeconds: ACTION_DURATIONS[s.actionType] ?? 3,
    startedAt: s.startedAt,
    completesAt: s.completesAt,
  }))

  // 3. Run deterministic engine
  const result = processQueue(engineSlots, now)

  // 4. Write results back to DB
  // Delete completed slots
  for (const completed of result.completed) {
    await db.delete(queueSlots).where(eq(queueSlots.id, completed.slotId))

    // Log game event for completed action
    await db.insert(gameEvents).values({
      heroId,
      eventType: `action_complete_${completed.actionType}`,
      payload: {
        actionType: completed.actionType,
        targetId: completed.targetId,
        completedAt: completed.completedAt.toISOString(),
      },
    })
  }

  // Update remaining slots with new start/complete times
  for (const slot of result.updatedSlots) {
    await db
      .update(queueSlots)
      .set({
        startedAt: slot.startedAt,
        completesAt: slot.completesAt,
      })
      .where(eq(queueSlots.id, slot.id))
  }

  // 5. Update hero lastTickAt
  await db
    .update(heroes)
    .set({ lastTickAt: now })
    .where(eq(heroes.id, heroId))

  return {
    completedCount: result.completed.length,
    remainingSlots: result.updatedSlots.length,
    lastTickAt: now.toISOString(),
  }
}
