import { pgTable, uuid, boolean, integer, timestamp } from 'drizzle-orm/pg-core'
import { heroes } from './hero'
import { items } from './item'

export const inventories = pgTable('inventories', {
  id: uuid('id').primaryKey().defaultRandom(),
  heroId: uuid('hero_id')
    .notNull()
    .references(() => heroes.id, { onDelete: 'cascade' }),
  itemId: uuid('item_id')
    .notNull()
    .unique()
    .references(() => items.id, { onDelete: 'cascade' }),
  equipped: boolean('equipped').notNull().default(false),
  slotIndex: integer('slot_index'), // inventory position (0-49) when not equipped; null when equipped
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
