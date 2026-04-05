'use server'

import { getDb, players, heroes, items, inventories } from '@chronoqueue/db'
import { eq } from 'drizzle-orm'
import type { HeroClassId } from '@/lib/class-data'
import { getClassById, calcMaxHp } from '@/lib/class-data'

export interface CreateCharacterInput {
  name: string
  classId: HeroClassId
  deviceId: string
}

export interface HeroWithEquipment {
  id: string
  playerId: string
  name: string
  classId: HeroClassId
  level: number
  xp: number
  stats: { str: number; int: number; vit: number; spd: number; lck: number }
  hp: number
  maxHp: number
  gold: number
  currentZone: string
  currentAct: number
  combatState: string
  deaths: number
  kills: number
  equipment: {
    weapon: EquipmentItem | null
    chest: EquipmentItem | null
    legs: EquipmentItem | null
    accessory_1: EquipmentItem | null
  }
  createdAt: string
  lastTickAt: string
}

export interface EquipmentItem {
  id: string
  name: string
  slot: string
  weaponType: string | null
  weaponPower: number | null
  statBonuses: Record<string, number>
  rarityTier: number
  powerScore: number
}

export async function createCharacter(
  input: CreateCharacterInput
): Promise<{ success: true; hero: HeroWithEquipment } | { success: false; error: string }> {
  try {
    const db = getDb()
    const classDef = getClassById(input.classId)
    const maxHp = calcMaxHp(classDef.baseStats.vit)

    // 1. Upsert player by deviceId (used as authId placeholder)
    const existingPlayers = await db
      .select()
      .from(players)
      .where(eq(players.authId, input.deviceId))
      .limit(1)

    let playerId: string

    if (existingPlayers.length > 0) {
      playerId = existingPlayers[0].id
      // Check if player already has a hero
      const existingHeroes = await db
        .select()
        .from(heroes)
        .where(eq(heroes.playerId, playerId))
        .limit(1)
      if (existingHeroes.length > 0) {
        return { success: false, error: 'Player already has a hero' }
      }
    } else {
      const [newPlayer] = await db
        .insert(players)
        .values({
          authId: input.deviceId,
          username: input.name,
        })
        .returning()
      playerId = newPlayer.id
    }

    // 2. Create hero
    const [hero] = await db
      .insert(heroes)
      .values({
        playerId,
        name: input.name,
        class: input.classId,
        stats: classDef.baseStats,
        hp: maxHp,
      })
      .returning()

    // 3. Create starter items
    const starterWeapon = classDef.starterWeapon
    const starterArmor = classDef.starterArmor

    const [weaponItem] = await db
      .insert(items)
      .values({
        name: starterWeapon.name,
        slot: starterWeapon.slot === 'weapon' ? 'weapon' : starterWeapon.slot,
        rarityTier: 0,
        weaponType: starterWeapon.weaponType,
        weaponPower: starterWeapon.weaponPower,
        statBonuses: starterWeapon.statBonuses,
        powerScore: 5,
        sellPrice: 1,
        zoneLevel: 1,
      })
      .returning()

    const [armorItem] = await db
      .insert(items)
      .values({
        name: starterArmor.name,
        slot: starterArmor.slot as 'chest' | 'legs' | 'accessory_1',
        rarityTier: 0,
        weaponType: null,
        weaponPower: null,
        statBonuses: starterArmor.statBonuses,
        powerScore: 3,
        sellPrice: 1,
        zoneLevel: 1,
      })
      .returning()

    // 4. Create inventory entries (both equipped)
    await db.insert(inventories).values([
      { heroId: hero.id, itemId: weaponItem.id, equipped: true },
      { heroId: hero.id, itemId: armorItem.id, equipped: true },
    ])

    // 5. Build response
    const equipment: HeroWithEquipment['equipment'] = {
      weapon: null,
      chest: null,
      legs: null,
      accessory_1: null,
    }

    const toEquipmentItem = (item: typeof weaponItem): EquipmentItem => ({
      id: item.id,
      name: item.name,
      slot: item.slot,
      weaponType: item.weaponType,
      weaponPower: item.weaponPower,
      statBonuses: (item.statBonuses ?? {}) as Record<string, number>,
      rarityTier: item.rarityTier,
      powerScore: item.powerScore,
    })

    if (weaponItem.slot === 'weapon') equipment.weapon = toEquipmentItem(weaponItem)
    if (armorItem.slot === 'chest') equipment.chest = toEquipmentItem(armorItem)
    if (armorItem.slot === 'legs') equipment.legs = toEquipmentItem(armorItem)
    if (armorItem.slot === 'accessory_1') equipment.accessory_1 = toEquipmentItem(armorItem)

    return {
      success: true,
      hero: {
        id: hero.id,
        playerId,
        name: hero.name,
        classId: hero.class as HeroClassId,
        level: hero.level,
        xp: hero.xp,
        stats: hero.stats,
        hp: hero.hp,
        maxHp,
        gold: hero.gold,
        currentZone: hero.currentZone,
        currentAct: hero.currentAct,
        combatState: hero.combatState,
        deaths: hero.deaths,
        kills: hero.kills,
        equipment,
        createdAt: hero.createdAt.toISOString(),
        lastTickAt: hero.lastTickAt.toISOString(),
      },
    }
  } catch (error) {
    console.error('createCharacter error:', error)
    return { success: false, error: 'Failed to create character' }
  }
}

export async function loadHero(
  deviceId: string
): Promise<HeroWithEquipment | null> {
  try {
    const db = getDb()

    // Find player by deviceId
    const playerRows = await db
      .select()
      .from(players)
      .where(eq(players.authId, deviceId))
      .limit(1)

    if (playerRows.length === 0) return null

    const player = playerRows[0]

    // Find hero
    const heroRows = await db
      .select()
      .from(heroes)
      .where(eq(heroes.playerId, player.id))
      .limit(1)

    if (heroRows.length === 0) return null

    const hero = heroRows[0]

    // Load equipped items
    const equippedItems = await db
      .select({
        inventory: inventories,
        item: items,
      })
      .from(inventories)
      .innerJoin(items, eq(inventories.itemId, items.id))
      .where(eq(inventories.heroId, hero.id))

    const equipment: HeroWithEquipment['equipment'] = {
      weapon: null,
      chest: null,
      legs: null,
      accessory_1: null,
    }

    for (const row of equippedItems) {
      if (!row.inventory.equipped) continue
      const equipItem: EquipmentItem = {
        id: row.item.id,
        name: row.item.name,
        slot: row.item.slot,
        weaponType: row.item.weaponType,
        weaponPower: row.item.weaponPower,
        statBonuses: (row.item.statBonuses ?? {}) as Record<string, number>,
        rarityTier: row.item.rarityTier,
        powerScore: row.item.powerScore,
      }
      const slot = row.item.slot as keyof typeof equipment
      if (slot in equipment) {
        equipment[slot] = equipItem
      }
    }

    const maxHp = calcMaxHp(hero.stats.vit)

    return {
      id: hero.id,
      playerId: player.id,
      name: hero.name,
      classId: hero.class as HeroClassId,
      level: hero.level,
      xp: hero.xp,
      stats: hero.stats,
      hp: hero.hp,
      maxHp,
      gold: hero.gold,
      currentZone: hero.currentZone,
      currentAct: hero.currentAct,
      combatState: hero.combatState,
      deaths: hero.deaths,
      kills: hero.kills,
      equipment,
      createdAt: hero.createdAt.toISOString(),
      lastTickAt: hero.lastTickAt.toISOString(),
    }
  } catch (error) {
    console.error('loadHero error:', error)
    return null
  }
}
