import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  smallint,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core'

// -- Enums --

export const equipmentSlotEnum = pgEnum('equipment_slot', [
  'head',
  'chest',
  'legs',
  'weapon',
  'off_hand',
  'accessory_1',
  'accessory_2',
])

export const weaponTypeEnum = pgEnum('weapon_type', ['physical', 'magical'])

// -- Types for JSONB columns --

export type ItemStatBonuses = {
  str?: number
  int?: number
  vit?: number
  spd?: number
  lck?: number
}

// -- Table --

export const items = pgTable('items', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slot: equipmentSlotEnum('slot').notNull(),
  rarityTier: smallint('rarity_tier').notNull(), // 0=Common, 1=Uncommon, 2=Rare, 3=Epic, 4=Legendary, 5=Mythic
  weaponType: weaponTypeEnum('weapon_type'), // null for non-weapons
  weaponPower: integer('weapon_power'), // null for non-weapons
  statBonuses: jsonb('stat_bonuses').$type<ItemStatBonuses>().notNull().default({}),
  powerScore: integer('power_score').notNull(),
  sellPrice: integer('sell_price').notNull(),
  zoneLevel: integer('zone_level').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
