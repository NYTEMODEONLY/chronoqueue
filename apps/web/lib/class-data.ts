import type { HeroStats } from '@chronoqueue/db'

// -- Hero class identifiers (match DB enum) --

export type HeroClassId =
  | 'chronoknight'
  | 'timestomper'
  | 'epoch_mage'
  | 'idlemaster'
  | 'loot_gremlin'
  | 'unflappable'

// -- Growth weights per stat (must sum to 100) --

export interface GrowthWeights {
  str: number
  int: number
  vit: number
  spd: number
  lck: number
}

// -- Starting equipment definition --

export interface StarterItem {
  name: string
  slot: 'weapon' | 'chest' | 'legs' | 'accessory_1'
  weaponType: 'physical' | 'magical' | null
  weaponPower: number | null
  statBonuses: Partial<HeroStats>
}

// -- Full class definition --

export interface HeroClassDef {
  id: HeroClassId
  name: string
  archetype: string
  flavor: string
  playstyle: string
  icon: string
  accentColor: string
  baseStats: HeroStats
  growthWeights: GrowthWeights
  starterWeapon: StarterItem
  starterArmor: StarterItem
}

// -- Constants --

export const HP_PER_VIT = 15
export const STAT_POINTS_PER_LEVEL = 3
export const BASE_TICK_INTERVAL = 3.0

// -- Derived stat formulas --

export function calcMaxHp(vit: number): number {
  return vit * HP_PER_VIT
}

export function calcTickInterval(spd: number): number {
  return BASE_TICK_INTERVAL / (1 + spd / 100)
}

export function calcCritChance(lck: number): number {
  return lck / 200
}

// -- All 6 classes --

export const HERO_CLASSES: HeroClassDef[] = [
  {
    id: 'chronoknight',
    name: 'Chronoknight',
    archetype: 'Tank',
    flavor: 'Time is a blade, and I am its edge.',
    playstyle: 'Balanced melee fighter. Steady, reliable progression.',
    icon: '\u2694',
    accentColor: 'var(--accent-gold)',
    baseStats: { str: 7, int: 3, vit: 7, spd: 4, lck: 4 },
    growthWeights: { str: 30, int: 10, vit: 30, spd: 15, lck: 15 },
    starterWeapon: {
      name: 'Rusty Longsword',
      slot: 'weapon',
      weaponType: 'physical',
      weaponPower: 5,
      statBonuses: { str: 1 },
    },
    starterArmor: {
      name: 'Worn Chainmail',
      slot: 'chest',
      weaponType: null,
      weaponPower: null,
      statBonuses: { vit: 2 },
    },
  },
  {
    id: 'timestomper',
    name: 'Timestomper',
    archetype: 'Blitz',
    flavor: 'Why wait? Hit harder.',
    playstyle: 'Glass cannon melee. Kills fast, dies sometimes.',
    icon: '\u26A1',
    accentColor: '#e05555',
    baseStats: { str: 9, int: 2, vit: 4, spd: 6, lck: 4 },
    growthWeights: { str: 40, int: 5, vit: 15, spd: 25, lck: 15 },
    starterWeapon: {
      name: 'Cracked Greathammer',
      slot: 'weapon',
      weaponType: 'physical',
      weaponPower: 5,
      statBonuses: { str: 1 },
    },
    starterArmor: {
      name: 'Ripped Vest',
      slot: 'legs',
      weaponType: null,
      weaponPower: null,
      statBonuses: { spd: 2 },
    },
  },
  {
    id: 'epoch_mage',
    name: 'Epoch Mage',
    archetype: 'Caster',
    flavor: 'The queue bends to my will.',
    playstyle: 'Magic damage dealer. High burst, squishy.',
    icon: '\u2726',
    accentColor: '#7b68ee',
    baseStats: { str: 2, int: 9, vit: 4, spd: 5, lck: 5 },
    growthWeights: { str: 5, int: 40, vit: 15, spd: 20, lck: 20 },
    starterWeapon: {
      name: 'Chipped Wand',
      slot: 'weapon',
      weaponType: 'magical',
      weaponPower: 5,
      statBonuses: { int: 1 },
    },
    starterArmor: {
      name: 'Threadbare Robe',
      slot: 'chest',
      weaponType: null,
      weaponPower: null,
      statBonuses: { int: 2 },
    },
  },
  {
    id: 'idlemaster',
    name: 'Idlemaster',
    archetype: 'Speed',
    flavor: 'I progress while I sleep.',
    playstyle: 'Idle optimization specialist. Best AFK performance.',
    icon: '\u25C8',
    accentColor: 'var(--accent-teal)',
    baseStats: { str: 4, int: 4, vit: 4, spd: 7, lck: 6 },
    growthWeights: { str: 15, int: 15, vit: 15, spd: 30, lck: 25 },
    starterWeapon: {
      name: 'Dull Dagger',
      slot: 'weapon',
      weaponType: 'physical',
      weaponPower: 5,
      statBonuses: { spd: 1 },
    },
    starterArmor: {
      name: 'Cozy Pajamas',
      slot: 'chest',
      weaponType: null,
      weaponPower: null,
      statBonuses: { spd: 2 },
    },
  },
  {
    id: 'loot_gremlin',
    name: 'Loot Gremlin',
    archetype: 'Luck',
    flavor: 'If it\'s shiny, it\'s mine.',
    playstyle: 'Item hunter. Better drop quality, slower kills.',
    icon: '\u2605',
    accentColor: '#e8c84a',
    baseStats: { str: 4, int: 3, vit: 5, spd: 4, lck: 9 },
    growthWeights: { str: 15, int: 10, vit: 20, spd: 15, lck: 40 },
    starterWeapon: {
      name: 'Bent Fork',
      slot: 'weapon',
      weaponType: 'physical',
      weaponPower: 5,
      statBonuses: { lck: 1 },
    },
    starterArmor: {
      name: 'Lucky Scarf',
      slot: 'accessory_1',
      weaponType: null,
      weaponPower: null,
      statBonuses: { lck: 2 },
    },
  },
  {
    id: 'unflappable',
    name: 'Unflappable',
    archetype: 'Defense',
    flavor: 'I have all the time in the world.',
    playstyle: 'Tank. Survives harder content earlier.',
    icon: '\uD83D\uDEE1',
    accentColor: '#7a8fa6',
    baseStats: { str: 5, int: 3, vit: 9, spd: 4, lck: 4 },
    growthWeights: { str: 20, int: 10, vit: 40, spd: 15, lck: 15 },
    starterWeapon: {
      name: 'Battered Mace',
      slot: 'weapon',
      weaponType: 'physical',
      weaponPower: 5,
      statBonuses: { str: 1 },
    },
    starterArmor: {
      name: 'Dented Breastplate',
      slot: 'chest',
      weaponType: null,
      weaponPower: null,
      statBonuses: { vit: 2 },
    },
  },
]

export function getClassById(id: HeroClassId): HeroClassDef {
  const cls = HERO_CLASSES.find((c) => c.id === id)
  if (!cls) throw new Error(`Unknown class: ${id}`)
  return cls
}

// -- Stat labels for display --

export const STAT_LABELS: Record<keyof HeroStats, { short: string; description: string }> = {
  str: { short: 'STR', description: 'Damage output' },
  int: { short: 'INT', description: 'Magic power' },
  vit: { short: 'VIT', description: 'Health pool' },
  spd: { short: 'SPD', description: 'Action speed' },
  lck: { short: 'LCK', description: 'Drop quality' },
}

export const STAT_KEYS: (keyof HeroStats)[] = ['str', 'int', 'vit', 'spd', 'lck']
