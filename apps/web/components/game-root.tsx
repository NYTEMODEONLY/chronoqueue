'use client'

import { useState, useEffect } from 'react'
import { useGameStore } from '@/lib/game-store'
import { loadHero } from '@/app/actions/character'
import { CharacterCreationFlow } from './character-creation/character-creation-flow'
import { GameShell } from './layout/game-shell'

export function GameRoot() {
  const { hero, hasCompletedCreation, setHero, clearHero, setLoading, isLoading } =
    useGameStore()
  const [showGame, setShowGame] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [serverChecked, setServerChecked] = useState(false)

  // Wait for Zustand persist hydration before rendering
  useEffect(() => {
    setHydrated(true)
  }, [])

  // Once hydrated, check server for existing hero
  useEffect(() => {
    if (!hydrated || serverChecked) return

    async function checkServer() {
      const currentDeviceId = useGameStore.getState().deviceId
      if (!currentDeviceId) {
        setServerChecked(true)
        return
      }

      setLoading(true)
      try {
        const serverHero = await loadHero(currentDeviceId)
        if (serverHero) {
          setHero(serverHero)
        } else {
          // Server doesn't have this hero — clear stale local cache
          clearHero()
        }
      } catch {
        // If server is unreachable, fall back to cached hero
      } finally {
        setLoading(false)
        setServerChecked(true)
      }
    }

    checkServer()
  }, [hydrated, serverChecked, setHero, clearHero, setLoading])

  // Show game after creation flow completes (transition screen finishes)
  useEffect(() => {
    if (hasCompletedCreation && hero) {
      setShowGame(true)
    }
  }, [hasCompletedCreation, hero])

  // Avoid flash while Zustand hydrates from localStorage
  if (!hydrated || (!serverChecked && !isLoading)) {
    return <div className="min-h-screen bg-bg-deep" />
  }

  // Loading state while checking server
  if (isLoading && !hero) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-deep">
        <p className="font-[family-name:var(--font-exo2)] text-text-secondary animate-pulse">
          Loading...
        </p>
      </div>
    )
  }

  // Already has a character → show game
  if (hero && showGame) {
    return <GameShell />
  }

  // Already has a character from previous session → go straight to game
  if (hero && hasCompletedCreation) {
    return <GameShell />
  }

  // No character → creation flow
  return <CharacterCreationFlow onComplete={() => setShowGame(true)} />
}
