import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core'
import { heroes } from './hero'

// -- Enums --

export const questTypeEnum = pgEnum('quest_type', [
  'kill',
  'collection',
  'milestone',
  'boss',
])

export const questStatusEnum = pgEnum('quest_status', [
  'active',
  'completed',
])

// -- Types for JSONB columns --

export type QuestRequirements = {
  enemyType?: string // for kill quests: which enemy to kill
  targetCount?: number // for kill/collection quests: how many
  targetLevel?: number // for milestone quests: level to reach
}

export type QuestRewards = {
  xp?: number
  gold?: number
  guaranteedDropMinRarity?: number // rarity tier floor for milestone/boss rewards
}

export type QuestProgress = {
  current: number
  target: number
}

// -- Static quest definitions --

export const quests = pgTable('quests', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  questType: questTypeEnum('quest_type').notNull(),
  act: integer('act').notNull(),
  zone: text('zone').notNull(), // e.g. "1-1", "2-3"
  sortOrder: integer('sort_order').notNull().default(0), // ordering within a zone
  requirements: jsonb('requirements').$type<QuestRequirements>().notNull(),
  rewards: jsonb('rewards').$type<QuestRewards>().notNull(),
})

// -- Per-hero quest progress --

export const questProgress = pgTable('quest_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  heroId: uuid('hero_id')
    .notNull()
    .references(() => heroes.id, { onDelete: 'cascade' }),
  questId: uuid('quest_id')
    .notNull()
    .references(() => quests.id, { onDelete: 'cascade' }),
  status: questStatusEnum('status').notNull().default('active'),
  progress: jsonb('progress').$type<QuestProgress>().notNull().default({ current: 0, target: 0 }),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
})
