import { relations } from 'drizzle-orm'
import { players } from './player'
import { heroes } from './hero'
import { items } from './item'
import { inventories } from './inventory'
import { quests, questProgress } from './quest'
import { queueSlots } from './queue'
import { gameEvents } from './game-event'

// -- Player relations --

export const playersRelations = relations(players, ({ many }) => ({
  heroes: many(heroes),
}))

// -- Hero relations --

export const heroesRelations = relations(heroes, ({ one, many }) => ({
  player: one(players, {
    fields: [heroes.playerId],
    references: [players.id],
  }),
  inventory: many(inventories),
  questProgress: many(questProgress),
  queueSlots: many(queueSlots),
  gameEvents: many(gameEvents),
}))

// -- Item relations --

export const itemsRelations = relations(items, ({ one }) => ({
  inventoryEntry: one(inventories, {
    fields: [items.id],
    references: [inventories.itemId],
  }),
}))

// -- Inventory relations --

export const inventoriesRelations = relations(inventories, ({ one }) => ({
  hero: one(heroes, {
    fields: [inventories.heroId],
    references: [heroes.id],
  }),
  item: one(items, {
    fields: [inventories.itemId],
    references: [items.id],
  }),
}))

// -- Quest relations --

export const questsRelations = relations(quests, ({ many }) => ({
  progress: many(questProgress),
}))

export const questProgressRelations = relations(questProgress, ({ one }) => ({
  hero: one(heroes, {
    fields: [questProgress.heroId],
    references: [heroes.id],
  }),
  quest: one(quests, {
    fields: [questProgress.questId],
    references: [quests.id],
  }),
}))

// -- Queue slot relations --

export const queueSlotsRelations = relations(queueSlots, ({ one }) => ({
  hero: one(heroes, {
    fields: [queueSlots.heroId],
    references: [heroes.id],
  }),
}))

// -- Game event relations --

export const gameEventsRelations = relations(gameEvents, ({ one }) => ({
  hero: one(heroes, {
    fields: [gameEvents.heroId],
    references: [heroes.id],
  }),
}))
