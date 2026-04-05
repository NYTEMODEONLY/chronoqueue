'use client'

import { useState } from 'react'
import { TopBar } from './top-bar'
import { BottomNav, type GameTab } from './bottom-nav'
import { CharacterPanel } from '../panels/character-panel'
import { AdventureLog } from '../panels/adventure-log'
import { InventoryPanel } from '../panels/inventory-panel'
import { QuestPanel } from '../panels/quest-panel'
import { useGameStore } from '@/lib/game-store'

export function GameShell() {
  const [activeTab, setActiveTab] = useState<GameTab>('adventure')
  const hero = useGameStore((s) => s.hero)

  const playerData = hero
    ? {
        name: hero.name,
        level: hero.level,
        hp: { current: hero.hp, max: hero.maxHp },
        mp: { current: 0, max: 0 },
        xp: { current: hero.xp, max: 50 }, // Level 1 XP threshold
      }
    : {
        name: 'Unknown',
        level: 1,
        hp: { current: 0, max: 0 },
        mp: { current: 0, max: 0 },
        xp: { current: 0, max: 50 },
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

      {/* Main content area — between fixed bars */}
      <main
        className="
          mx-auto w-full max-w-[var(--max-content-width)]
          pt-[var(--topbar-height)]
          pb-[var(--bottombar-height)]
        "
      >
        {/* Desktop: three-column layout */}
        <div className="hidden h-[calc(100vh-var(--topbar-height)-var(--bottombar-height))] lg:grid lg:grid-cols-[280px_1fr_260px] lg:gap-[var(--panel-gap)]">
          <aside className="overflow-y-auto">
            <CharacterPanel />
          </aside>
          <div className="overflow-y-auto">
            <AdventureLog />
          </div>
          <aside className="overflow-y-auto">
            <QuestPanel />
          </aside>
        </div>

        {/* Tablet: two-column layout */}
        <div className="hidden h-[calc(100vh-var(--topbar-height)-var(--bottombar-height))] md:grid md:grid-cols-[280px_1fr] md:gap-[var(--panel-gap)] lg:hidden">
          {activeTab === 'character' && (
            <div className="col-span-2 overflow-y-auto">
              <CharacterPanel />
            </div>
          )}
          {activeTab === 'adventure' && (
            <>
              <aside className="overflow-y-auto">
                <CharacterPanel />
              </aside>
              <div className="overflow-y-auto">
                <AdventureLog />
              </div>
            </>
          )}
          {activeTab === 'inventory' && (
            <div className="col-span-2 overflow-y-auto">
              <InventoryPanel />
            </div>
          )}
          {activeTab === 'quests' && (
            <div className="col-span-2 overflow-y-auto">
              <QuestPanel />
            </div>
          )}
        </div>

        {/* Mobile: single column, tab-switched */}
        <div className="h-[calc(100vh-var(--topbar-height)-var(--bottombar-height))] overflow-y-auto md:hidden">
          {activeTab === 'adventure' && <AdventureLog />}
          {activeTab === 'character' && <CharacterPanel />}
          {activeTab === 'inventory' && <InventoryPanel />}
          {activeTab === 'quests' && <QuestPanel />}
        </div>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
