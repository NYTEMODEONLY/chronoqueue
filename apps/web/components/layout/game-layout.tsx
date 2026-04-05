'use client'

import { useState, useEffect } from 'react'
import { useGameStore } from '@/lib/game-store'
import { loadHero, loadHeroByPlayerId } from '@/app/actions/character'
import { useGameLoop } from '@/lib/use-game-loop'
import { CharacterCreationFlow } from '../character-creation/character-creation-flow'
import { TopBar } from './top-bar'
import { BottomNav } from './bottom-nav'
import { SideNav } from './side-nav'
import { CharacterPanel } from '../panels/character-panel'
import { calcMaxHp } from '@/lib/class-data'

export function GameLayout({ children }: { children: React.ReactNode }) {
  const { hero, hasCompletedCreation, setHero, clearHero, setLoading, isLoading, deviceId } =
    useGameStore()
  const [hydrated, setHydrated] = useState(false)
  const [serverChecked, setServerChecked] = useState(false)
  const [showGame, setShowGame] = useState(false)

  // Run game loop at layout level so it persists across route changes
  useGameLoop()

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated || serverChecked) return

    async function checkServer() {
      const currentDeviceId = useGameStore.getState().deviceId
      const cachedHero = useGameStore.getState().hero
      const cachedPlayerId = cachedHero?.playerId

      if (!currentDeviceId && !cachedHero?.playerId) {
        setServerChecked(true)
        return
      }

      setLoading(true)
      try {
        let serverHero = currentDeviceId ? await loadHero(currentDeviceId) : null

        if (!serverHero && cachedPlayerId) {
          serverHero = await loadHeroByPlayerId(cachedPlayerId)
        }

        if (serverHero) {
          setHero(serverHero)
        } else {
          clearHero()
        }
      } catch {
        // Fall back to cached hero
      } finally {
        setLoading(false)
        setServerChecked(true)
      }
    }

    checkServer()
  }, [hydrated, serverChecked, deviceId, setHero, clearHero, setLoading])

  useEffect(() => {
    if (hasCompletedCreation && hero) {
      setShowGame(true)
    }
  }, [hasCompletedCreation, hero])

  if (!hydrated || (!serverChecked && !isLoading)) {
    return <div className="min-h-screen bg-bg-deep" />
  }

  if (isLoading && !hero) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-deep">
        <p className="font-[family-name:var(--font-exo2)] text-text-secondary animate-pulse">
          Loading...
        </p>
      </div>
    )
  }

  // No hero — show character creation
  if (!hero || (!showGame && !hasCompletedCreation)) {
    return <CharacterCreationFlow onComplete={() => setShowGame(true)} />
  }

  const playerData = {
    name: hero.name,
    level: hero.level,
    hp: { current: hero.hp, max: calcMaxHp(hero.stats.vit) },
    mp: { current: 0, max: 0 },
    xp: { current: hero.xp, max: 50 },
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg-deep">
      <TopBar
        characterName={playerData.name}
        level={playerData.level}
        hp={playerData.hp}
        mp={playerData.mp}
        xp={playerData.xp}
      />

      <main
        className="
          mx-auto w-full max-w-[var(--max-content-width)]
          pt-[var(--topbar-height)]
          pb-[var(--bottombar-height)] lg:pb-0
        "
      >
        {/* Desktop: sidebar nav + character panel | content */}
        <div className="hidden h-[calc(100vh-var(--topbar-height))] lg:grid lg:grid-cols-[220px_1fr] lg:gap-[var(--panel-gap)]">
          <aside className="flex flex-col gap-[var(--panel-gap)] overflow-y-auto border-r border-border-subtle">
            <SideNav />
            <div className="px-1">
              <CharacterPanel />
            </div>
          </aside>
          <div className="overflow-y-auto p-[var(--panel-gap)]">
            {children}
          </div>
        </div>

        {/* Mobile/Tablet: content only, tabs at bottom */}
        <div className="h-[calc(100vh-var(--topbar-height)-var(--bottombar-height))] overflow-y-auto p-[var(--panel-gap)] lg:hidden">
          {children}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
