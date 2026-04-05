import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  bigint,
  boolean,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core'
import { players } from './player'

// -- Enums --

export const heroClassEnum = pgEnum('hero_class', [
  'chronoknight',
  'timestomper',
  'epoch_mage',
  'idlemaster',
  'loot_gremlin',
  'unflappable',
])

export const combatStateEnum = pgEnum('combat_state', [
  'idle',
  'in_combat',
  'victory',
  'loot',
  'defeat',
  'respawn',
])

// -- Types for JSONB columns --

export type HeroStats = {
  str: number
  int: number
  vit: number
  spd: number
  lck: number
}

// -- Table --

export const heroes = pgTable('heroes', {
  id: uuid('id').primaryKey().defaultRandom(),
  playerId: uuid('player_id')
    .notNull()
    .references(() => players.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  class: heroClassEnum('class').notNull(),
  level: integer('level').notNull().default(1),
  xp: bigint('xp', { mode: 'number' }).notNull().default(0),
  stats: jsonb('stats').$type<HeroStats>().notNull(),
  hp: integer('hp').notNull(),
  gold: bigint('gold', { mode: 'number' }).notNull().default(0),
  currentZone: text('current_zone').notNull().default('1-1'),
  currentAct: integer('current_act').notNull().default(1),
  combatState: combatStateEnum('combat_state').notNull().default('idle'),
  deaths: integer('deaths').notNull().default(0),
  kills: integer('kills').notNull().default(0),
  isTraining: boolean('is_training').notNull().default(false),
  trainingEndAt: timestamp('training_end_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  lastTickAt: timestamp('last_tick_at', { withTimezone: true }).notNull().defaultNow(),
})
