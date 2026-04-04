import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core'

export const players = pgTable('players', {
  id: uuid('id').primaryKey().defaultRandom(),
  authId: text('auth_id').notNull().unique(),
  username: text('username').notNull().unique(),
  settings: jsonb('settings').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  lastSeenAt: timestamp('last_seen_at', { withTimezone: true }).notNull().defaultNow(),
})
