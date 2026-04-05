import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core'
import { heroes } from './hero'

// -- Enums --

export const actionTypeEnum = pgEnum('action_type', [
  'combat',
  'train',
  'quest',
  'craft',
  'rest',
])

// -- Table --

export const queueSlots = pgTable('queue_slots', {
  id: uuid('id').primaryKey().defaultRandom(),
  heroId: uuid('hero_id')
    .notNull()
    .references(() => heroes.id, { onDelete: 'cascade' }),
  actionType: actionTypeEnum('action_type').notNull(),
  targetId: text('target_id'), // contextual reference (quest id, zone id, etc.)
  position: integer('position').notNull(),
  startedAt: timestamp('started_at', { withTimezone: true }),
  completesAt: timestamp('completes_at', { withTimezone: true }),
})
