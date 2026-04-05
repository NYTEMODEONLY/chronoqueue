import { NextRequest, NextResponse } from 'next/server'
import { and, desc, eq } from 'drizzle-orm'
import { processQueue, type QueueSlot } from '@chronoqueue/game-engine'
import {
  getDb,
  heroes,
  queueSlots,
  questProgress,
  items,
  inventories,
  gameEvents,
} from '@chronoqueue/db'
import { ensureToken } from './auth'

export const runtime = 'nodejs'

type MutationAction = 'all' | 'tick' | 'quest' | 'inventory' | 'event'

type InventorySeedInput = {
  name?: string
  slot?: string
  rarityTier?: number
  weaponType?: string | null
  weaponPower?: number | null
  statBonuses?: Record<string, number>
  powerScore?: number
  sellPrice?: number
  zoneLevel?: number
  equipped?: boolean
  slotIndex?: number | null
}

type MutationInput = {
  action?: MutationAction
  heroId?: string
  questIncrement?: number
  eventType?: string
  eventPayload?: Record<string, unknown>
  inventory?: InventorySeedInput
  token?: string
}

type OperationResult = {
  operation: string
  success: boolean
  message: string
  details?: Record<string, unknown>
}

const ALLOWED_SLOT_VALUES = ['head', 'chest', 'legs', 'weapon', 'off_hand', 'accessory_1', 'accessory_2'] as const
type AllowedSlot = (typeof ALLOWED_SLOT_VALUES)[number]
const ALLOWED_SLOTS = new Set(ALLOWED_SLOT_VALUES)
const ALLOWED_WEAPON_TYPE_VALUES = ['physical', 'magical'] as const
type AllowedWeaponType = (typeof ALLOWED_WEAPON_TYPE_VALUES)[number]
const ALLOWED_WEAPON_TYPES = new Set(ALLOWED_WEAPON_TYPE_VALUES)
const ACTION_DURATIONS: Record<string, number> = {
  combat: 3,
  train: 5,
  quest: 10,
  craft: 8,
  rest: 2,
}

function isAllowedSlot(value: string): value is AllowedSlot {
  return ALLOWED_SLOTS.has(value as AllowedSlot)
}

function isAllowedWeaponType(value: string): value is AllowedWeaponType {
  return ALLOWED_WEAPON_TYPES.has(value as AllowedWeaponType)
}

function parseIntValue(value: unknown, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || Number.isNaN(value)) return fallback
  return Math.max(0, Math.floor(value))
}

function parseQuestDelta(raw: unknown): number {
  const parsed = typeof raw === 'number' ? Math.floor(raw) : 1
  return Math.max(1, Math.min(parsed, 9999))
}

function parseInventoryItem(input?: InventorySeedInput) {
  return {
    name: input?.name && input.name.trim() ? input.name.trim() : 'QA Debug Item',
    slot: input?.slot && isAllowedSlot(input.slot) ? input.slot : 'weapon',
    rarityTier: parseIntValue(input?.rarityTier, 0),
    weaponType:
      input?.weaponType && isAllowedWeaponType(input.weaponType) ? input.weaponType : null,
    weaponPower: input?.weaponPower == null ? null : parseIntValue(input.weaponPower, 1),
    statBonuses: input?.statBonuses ?? {},
    powerScore: parseIntValue(input?.powerScore, 3),
    sellPrice: parseIntValue(input?.sellPrice, 1),
    zoneLevel: parseIntValue(input?.zoneLevel, 1),
    equipped: input?.equipped ?? false,
    slotIndex: input?.slotIndex ?? null,
  }
}

function parseOperation(input: MutationInput): MutationAction {
  const requested = input.action
  if (requested === 'tick' || requested === 'quest' || requested === 'inventory' || requested === 'event') return requested
  return 'all'
}

async function ensureHeroExists(db: ReturnType<typeof getDb>, heroId: string) {
  const result = await db.select({ id: heroes.id }).from(heroes).where(eq(heroes.id, heroId)).limit(1)
  return result[0] ?? null
}

async function runTickForHero(db: ReturnType<typeof getDb>, heroId: string): Promise<{
  completedCount: number
  remainingSlots: number
}> {
  const now = new Date()
  const slots = await db.select().from(queueSlots).where(eq(queueSlots.heroId, heroId))

  if (slots.length === 0) {
    await db.update(heroes).set({ lastTickAt: now }).where(eq(heroes.id, heroId))
    return { completedCount: 0, remainingSlots: 0 }
  }

  const engineSlots: QueueSlot[] = slots.map((slot) => ({
    id: slot.id,
    position: slot.position,
    actionType: slot.actionType,
    targetId: slot.targetId ?? '',
    durationSeconds: ACTION_DURATIONS[slot.actionType] ?? 3,
    startedAt: slot.startedAt,
    completesAt: slot.completesAt,
  }))

  const result = processQueue(engineSlots, now)

  for (const completed of result.completed) {
    await db.delete(queueSlots).where(eq(queueSlots.id, completed.slotId))
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

  for (const slot of result.updatedSlots) {
    await db
      .update(queueSlots)
      .set({
        startedAt: slot.startedAt,
        completesAt: slot.completesAt,
      })
      .where(eq(queueSlots.id, slot.id))
  }

  await db.update(heroes).set({ lastTickAt: now }).where(eq(heroes.id, heroId))

  return { completedCount: result.completed.length, remainingSlots: result.updatedSlots.length }
}

async function runQuestStep(db: ReturnType<typeof getDb>, heroId: string, questIncrement: number): Promise<{
  questProgressId: string
  status: string
  before: { current: number; target: number }
  after: { current: number; target: number }
}> {
  const rows = await db
    .select({
      id: questProgress.id,
      status: questProgress.status,
      progress: questProgress.progress,
    })
    .from(questProgress)
    .where(and(eq(questProgress.heroId, heroId), eq(questProgress.status, 'active')))
    .orderBy(desc(questProgress.startedAt))
    .limit(1)

  const row = rows[0]
  if (!row) {
    throw new Error('Hero has no active quest rows')
  }

  const progress = (row.progress as Record<string, unknown>) ?? {}
  const current = typeof progress.current === 'number' ? progress.current : 0
  const target = typeof progress.target === 'number' ? progress.target : 0
  if (target <= 0) {
    throw new Error('Quest progress target is invalid')
  }

  const nextCurrent = Math.min(current + Math.max(0, questIncrement), target)
  const nextStatus = nextCurrent >= target ? 'completed' : 'active'
  const nextProgress = { ...progress, current: nextCurrent, target }

  const now = new Date()
  await db
    .update(questProgress)
    .set({
      progress: nextProgress,
      status: nextStatus,
      ...(nextStatus === 'completed' ? { completedAt: now } : {}),
    })
    .where(eq(questProgress.id, row.id))

  return {
    questProgressId: row.id,
    status: nextStatus,
    before: { current, target },
    after: { current: nextCurrent, target },
  }
}

async function runInventoryStep(db: ReturnType<typeof getDb>, heroId: string, inventoryInput?: InventorySeedInput): Promise<{
  itemId: string
  inventoryId: string
  equipped: boolean
}> {
  const payload = parseInventoryItem(inventoryInput)
  const [createdItem] = await db
    .insert(items)
    .values({
      name: payload.name,
      slot: payload.slot,
      rarityTier: payload.rarityTier,
      weaponType: payload.weaponType,
      weaponPower: payload.weaponPower,
      statBonuses: payload.statBonuses,
      powerScore: payload.powerScore,
      sellPrice: payload.sellPrice,
      zoneLevel: payload.zoneLevel,
    })
    .returning({ id: items.id })

  if (!createdItem) {
    throw new Error('Unable to create seed item')
  }

  const [createdInventory] = await db
    .insert(inventories)
    .values({
      heroId,
      itemId: createdItem.id,
      equipped: payload.equipped,
      slotIndex: payload.slotIndex,
    })
    .returning({ id: inventories.id })

  if (!createdInventory) {
    throw new Error('Unable to create inventory row')
  }

  return {
    itemId: createdItem.id,
    inventoryId: createdInventory.id,
    equipped: payload.equipped,
  }
}

async function runEventStep(db: ReturnType<typeof getDb>, heroId: string, eventType?: string, eventPayload?: Record<string, unknown>) {
  const payload = {
    type: 'qa',
    ...(eventPayload ?? {}),
  }
  const [createdEvent] = await db
    .insert(gameEvents)
    .values({
      heroId,
      eventType: eventType?.trim() || 'qa_test_event',
      payload,
    })
    .returning({ id: gameEvents.id })

  if (!createdEvent) {
    throw new Error('Unable to insert debug game event')
  }

  return { eventId: createdEvent.id }
}

function jsonResponse(body: Record<string, unknown>, status: number = 200) {
  return NextResponse.json(body, { status })
}

export async function GET() {
  return jsonResponse({
    action: 'POST /api/qa/test-hero-state',
    supportedActions: ['tick', 'quest', 'inventory', 'event', 'all'],
    auth: {
      header: 'x-qa-token',
      fallback: 'sha256(DATABASE_URL)',
    },
    defaults: {
      action: 'all',
      questIncrement: 1,
      eventType: 'qa_test_event',
    },
  })
}

export async function POST(request: NextRequest) {
  let body: MutationInput = {}
  try {
    const rawBody = await request.json()
    if (typeof rawBody === 'object' && rawBody !== null) {
      body = rawBody as MutationInput
    } else {
      return jsonResponse({ ok: false, error: 'Invalid request body' }, 400)
    }
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON body' }, 400)
  }

  if (
    !ensureToken({
      headerToken: request.headers.get('x-qa-token'),
      authorizationHeader: request.headers.get('authorization'),
      bodyToken: body.token,
    })
  ) {
    return jsonResponse({ ok: false, error: 'Unauthorized' }, 401)
  }

  if (!body.heroId || typeof body.heroId !== 'string') {
    return jsonResponse({ ok: false, error: 'heroId is required' }, 400)
  }

  const action = parseOperation(body)
  const db = getDb()

  try {
    const hero = await ensureHeroExists(db, body.heroId)
    if (!hero) {
      return jsonResponse({ ok: false, error: 'Hero not found' }, 404)
    }

    const results: OperationResult[] = []
    const requestedActions =
      action === 'all' ? ['tick', 'quest', 'inventory', 'event'] : [action]

    if (requestedActions.includes('tick')) {
      try {
        const data = await runTickForHero(db, hero.id)
        results.push({
          operation: 'tick',
          success: true,
          message: `Processed tick for ${hero.id}`,
          details: data,
        })
      } catch (error) {
        results.push({
          operation: 'tick',
          success: false,
          message: error instanceof Error ? error.message : 'Tick mutation failed',
        })
      }
    }

    if (requestedActions.includes('quest')) {
      try {
        const data = await runQuestStep(db, hero.id, parseQuestDelta(body.questIncrement))
        results.push({
          operation: 'quest',
          success: true,
          message: `Updated quest progress to ${data.after.current}/${data.after.target}`,
          details: data,
        })
      } catch (error) {
        results.push({
          operation: 'quest',
          success: false,
          message: error instanceof Error ? error.message : 'Quest mutation failed',
        })
      }
    }

    if (requestedActions.includes('inventory')) {
      try {
        const data = await runInventoryStep(db, hero.id, body.inventory)
        results.push({
          operation: 'inventory',
          success: true,
          message: 'Added debug item to hero inventory',
          details: data,
        })
      } catch (error) {
        results.push({
          operation: 'inventory',
          success: false,
          message: error instanceof Error ? error.message : 'Inventory mutation failed',
        })
      }
    }

    if (requestedActions.includes('event')) {
      try {
        const data = await runEventStep(db, hero.id, body.eventType, body.eventPayload)
        results.push({
          operation: 'event',
          success: true,
          message: 'Inserted debug game event',
          details: data,
        })
      } catch (error) {
        results.push({
          operation: 'event',
          success: false,
          message: error instanceof Error ? error.message : 'Event mutation failed',
        })
      }
    }

    return jsonResponse({
      ok: true,
      heroId: hero.id,
      executedAt: new Date().toISOString(),
      action,
      results,
    })
  } catch (error) {
    console.error('QA test hero state mutation failed:', error)
    return jsonResponse({ ok: false, error: 'Server processing error' }, 500)
  }
}
