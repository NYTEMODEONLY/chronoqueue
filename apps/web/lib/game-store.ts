import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { HeroWithEquipment } from '@/app/actions/character'

// -- Game store state --
// Server is the source of truth. Zustand caches the last-known hero
// and stores the deviceId for anonymous auth.

interface GameState {
  deviceId: string | null
  hero: HeroWithEquipment | null
  hasCompletedCreation: boolean
  isLoading: boolean

  // Actions
  setDeviceId: (id: string) => void
  setHero: (hero: HeroWithEquipment) => void
  clearHero: () => void
  setLoading: (loading: boolean) => void
}

function generateDeviceId(): string {
  return crypto.randomUUID()
}

export function getOrCreateDeviceId(currentId: string | null): string {
  if (currentId) return currentId
  return generateDeviceId()
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      deviceId: null,
      hero: null,
      hasCompletedCreation: false,
      isLoading: false,

      setDeviceId: (id: string) => {
        set({ deviceId: id })
      },

      setHero: (hero: HeroWithEquipment) => {
        set({ hero, hasCompletedCreation: true, isLoading: false })
      },

      clearHero: () => {
        set({ hero: null, hasCompletedCreation: false })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
    }),
    {
      name: 'chronoqueue-game',
    }
  )
)
