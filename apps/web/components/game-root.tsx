'use client'

import { useState, useEffect } from 'react'
import { useGameStore } from '@/lib/game-store'
import { CharacterCreationFlow } from './character-creation/character-creation-flow'
import { GameShell } from './layout/game-shell'

export function GameRoot() {
  const hero = useGameStore((s) => s.hero)
  const hasCompletedCreation = useGameStore((s) => s.hasCompletedCreation)
  const [showGame, setShowGame] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  // Wait for Zustand persist hydration before rendering
  useEffect(() => {
    setHydrated(true)
  }, [])

  // Show game after creation flow completes (transition screen finishes)
  useEffect(() => {
    if (hasCompletedCreation && hero) {
      setShowGame(true)
    }
  }, [hasCompletedCreation, hero])

  // Avoid flash while Zustand hydrates from localStorage
  if (!hydrated) {
    return <div className="min-h-screen bg-bg-deep" />
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
