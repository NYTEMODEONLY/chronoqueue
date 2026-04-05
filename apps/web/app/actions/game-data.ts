'use server'

import { getDb, inventories, items, questProgress, quests, gameEvents } from '@chronoqueue/db'
import { eq, desc } from 'drizzle-orm'

// -- Inventory --

export interface InventoryItemData {
  id: string
  name: string
  slot: string
  rarityTier: number
  rarityName: string
  equipped: boolean
  slotIndex: number | null
}

const RARITY_NAMES = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'] as const

function tierToRarity(tier: number): string {
  return RARITY_NAMES[tier] ?? 'common'
}

export async function loadInventory(heroId: string): Promise<InventoryItemData[]> {
  try {
    const db = getDb()
    const rows = await db
      .select({
        inventoryId: inventories.id,
        equipped: inventories.equipped,
        slotIndex: inventories.slotIndex,
        itemId: items.id,
        itemName: items.name,
        itemSlot: items.slot,
        rarityTier: items.rarityTier,
      })
      .from(inventories)
      .innerJoin(items, eq(inventories.itemId, items.id))
      .where(eq(inventories.heroId, heroId))

    return rows.map((r) => ({
      id: r.itemId,
      name: r.itemName,
      slot: r.itemSlot,
      rarityTier: r.rarityTier,
      rarityName: tierToRarity(r.rarityTier),
      equipped: r.equipped,
      slotIndex: r.slotIndex,
    }))
  } catch (error) {
    console.error('loadInventory error:', error)
    return []
  }
}

// -- Quests --

export interface QuestData {
  id: string
  name: string
  description: string
  questType: string
  status: string
  progress: { current: number; target: number }
  rewards: Record<string, unknown>
}

export async function loadActiveQuests(heroId: string): Promise<QuestData[]> {
  try {
    const db = getDb()
    const rows = await db
      .select({
        progressId: questProgress.id,
        status: questProgress.status,
        progress: questProgress.progress,
        questId: quests.id,
        questName: quests.name,
        questDescription: quests.description,
        questType: quests.questType,
        rewards: quests.rewards,
      })
      .from(questProgress)
      .innerJoin(quests, eq(questProgress.questId, quests.id))
      .where(eq(questProgress.heroId, heroId))

    return rows.map((r) => ({
      id: r.questId,
      name: r.questName,
      description: r.questDescription,
      questType: r.questType,
      status: r.status,
      progress: (r.progress as { current: number; target: number }) ?? { current: 0, target: 0 },
      rewards: (r.rewards as Record<string, unknown>) ?? {},
    }))
  } catch (error) {
    console.error('loadActiveQuests error:', error)
    return []
  }
}

// -- Adventure Log (Game Events) --

export interface GameEventData {
  id: string
  eventType: string
  payload: Record<string, unknown>
  createdAt: string
}

export async function loadGameEvents(heroId: string, limit = 50): Promise<GameEventData[]> {
  try {
    const db = getDb()
    const rows = await db
      .select()
      .from(gameEvents)
      .where(eq(gameEvents.heroId, heroId))
      .orderBy(desc(gameEvents.createdAt))
      .limit(limit)

    return rows.map((r) => ({
      id: r.id,
      eventType: r.eventType,
      payload: (r.payload as Record<string, unknown>) ?? {},
      createdAt: r.createdAt.toISOString(),
    }))
  } catch (error) {
    console.error('loadGameEvents error:', error)
    return []
  }
}
