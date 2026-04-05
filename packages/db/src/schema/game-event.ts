import { pgTable, uuid, text, timestamp, jsonb } from 'drizzle-orm/pg-core'
import { heroes } from './hero'

export const gameEvents = pgTable('game_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  heroId: uuid('hero_id')
    .notNull()
    .references(() => heroes.id, { onDelete: 'cascade' }),
  eventType: text('event_type').notNull(), // e.g. "level_up", "item_drop", "quest_complete", "boss_kill"
  payload: jsonb('payload').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
