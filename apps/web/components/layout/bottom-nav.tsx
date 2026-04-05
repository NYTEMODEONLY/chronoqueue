'use client'

type GameTab = 'adventure' | 'character' | 'inventory' | 'quests'

interface BottomNavProps {
  activeTab: GameTab
  onTabChange: (tab: GameTab) => void
}

const TABS: { id: GameTab; label: string; icon: string }[] = [
  { id: 'adventure', label: 'Adventure', icon: '⚔' },
  { id: 'character', label: 'Character', icon: '◆' },
  { id: 'inventory', label: 'Inventory', icon: '▪' },
  { id: 'quests', label: 'Quests', icon: '▸' },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      className="
        fixed right-0 bottom-0 left-0 z-50
        border-t border-border-subtle
        bg-bg-base
      "
    >
      <div className="mx-auto flex h-[var(--bottombar-height)] max-w-[var(--max-content-width)] items-stretch">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative flex flex-1 cursor-pointer flex-col items-center justify-center gap-0.5
                transition-colors duration-100
                ${isActive ? 'text-text-accent' : 'text-text-secondary hover:text-text-primary'}
              `}
            >
              {/* Active indicator — gold underline on top */}
              {isActive && (
                <div className="absolute top-0 right-2 left-2 h-0.5 bg-accent-gold" />
              )}
              <span className="text-xl leading-none">{tab.icon}</span>
              <span className="font-[family-name:var(--font-inter)] text-[11px]">
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export type { GameTab }
