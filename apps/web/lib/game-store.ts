import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { HeroStats } from '@chronoqueue/db'
import {
  type HeroClassId,
  type StarterItem,
  getClassById,
  calcMaxHp,
} from './class-data'

// -- Persisted hero data (matches DB schema shape for future Supabase swap) --

export interface PersistedHero {
  id: string
  name: string
  classId: HeroClassId
  level: number
  xp: number
  stats: HeroStats
  hp: number
  maxHp: number
  gold: number
  currentZone: string
  currentAct: number
  combatState: 'idle' | 'in_combat' | 'victory' | 'loot' | 'defeat' | 'respawn'
  deaths: number
  kills: number
  equipment: {
    weapon: StarterItem | null
    chest: StarterItem | null
    legs: StarterItem | null
    accessory_1: StarterItem | null
  }
  createdAt: string
  lastTickAt: string
}

// -- Game store state --

interface GameState {
  hero: PersistedHero | null
  hasCompletedCreation: boolean

  // Actions
  createHero: (name: string, classId: HeroClassId) => void
  deleteHero: () => void
  updateHero: (partial: Partial<PersistedHero>) => void
}

function generateId(): string {
  return crypto.randomUUID()
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      hero: null,
      hasCompletedCreation: false,

      createHero: (name: string, classId: HeroClassId) => {
        const classDef = getClassById(classId)
        const maxHp = calcMaxHp(classDef.baseStats.vit)
        const now = new Date().toISOString()

        const hero: PersistedHero = {
          id: generateId(),
          name,
          classId,
          level: 1,
          xp: 0,
          stats: { ...classDef.baseStats },
          hp: maxHp,
          maxHp,
          gold: 0,
          currentZone: '1-1',
          currentAct: 1,
          combatState: 'idle',
          deaths: 0,
          kills: 0,
          equipment: {
            weapon: classDef.starterWeapon,
            chest: classDef.starterArmor.slot === 'chest' ? classDef.starterArmor : null,
            legs: classDef.starterArmor.slot === 'legs' ? classDef.starterArmor : null,
            accessory_1:
              classDef.starterArmor.slot === 'accessory_1' ? classDef.starterArmor : null,
          },
          createdAt: now,
          lastTickAt: now,
        }

        set({ hero, hasCompletedCreation: true })
      },

      deleteHero: () => {
        set({ hero: null, hasCompletedCreation: false })
      },

      updateHero: (partial) => {
        set((state) => {
          if (!state.hero) return state
          return { hero: { ...state.hero, ...partial } }
        })
      },
    }),
    {
      name: 'chronoqueue-game',
    }
  )
)
