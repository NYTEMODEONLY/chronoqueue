'use client'

import { GamePanel } from '../ui/game-panel'
import { type RarityTier } from '../ui/rarity-text'

interface InventoryItem {
  id: string
  name: string
  rarity: RarityTier
}

const RARITY_BORDER: Record<RarityTier, string> = {
  common: 'border-rarity-common/40',
  uncommon: 'border-rarity-uncommon/40',
  rare: 'border-rarity-rare/40',
  epic: 'border-rarity-epic/40',
  legendary: 'border-rarity-legendary/40',
  mythic: 'border-rarity-mythic/40',
}

const RARITY_TEXT: Record<RarityTier, string> = {
  common: 'text-rarity-common',
  uncommon: 'text-rarity-uncommon',
  rare: 'text-rarity-rare',
  epic: 'text-rarity-epic',
  legendary: 'text-rarity-legendary',
  mythic: 'text-rarity-mythic',
}

const MOCK_ITEMS: (InventoryItem | null)[] = [
  { id: '1', name: 'Iron Helm', rarity: 'common' },
  { id: '2', name: 'Chain Mail', rarity: 'common' },
  { id: '3', name: 'Staff of Minor Flame', rarity: 'rare' },
  { id: '4', name: 'Leather Boots', rarity: 'common' },
  { id: '5', name: 'Copper Pendant', rarity: 'uncommon' },
  { id: '6', name: 'Spider Silk Thread', rarity: 'uncommon' },
  { id: '7', name: 'Health Potion', rarity: 'common' },
  { id: '8', name: 'Health Potion', rarity: 'common' },
  { id: '9', name: 'Scroll of Identify', rarity: 'uncommon' },
  { id: '10', name: 'Goblin Ear', rarity: 'common' },
  { id: '11', name: 'Cloak of Shadows', rarity: 'epic' },
  { id: '12', name: 'Rusty Dagger', rarity: 'common' },
  null, null, null, null, null, null, null, null,
  null, null, null, null, null, null, null, null,
  null, null, null, null, null, null, null, null,
  null, null, null, null,
]

const TOTAL_SLOTS = 40

export function InventoryPanel() {
  const filledCount = MOCK_ITEMS.filter(Boolean).length

  return (
    <GamePanel title={`Inventory (${filledCount}/${TOTAL_SLOTS})`}>
      <div className="grid grid-cols-5 gap-1.5 md:grid-cols-8 lg:grid-cols-5">
        {MOCK_ITEMS.map((item, i) => (
          <div
            key={item?.id ?? `empty-${i}`}
            className={`
              flex aspect-square items-center justify-center
              rounded-[var(--panel-radius)]
              border
              ${item ? `${RARITY_BORDER[item.rarity]} bg-bg-surface` : 'border-border-subtle bg-bg-deep'}
              p-1 text-center
            `}
            title={item?.name}
          >
            {item ? (
              <span className={`text-[length:var(--font-micro)] leading-tight ${RARITY_TEXT[item.rarity]} truncate`}>
                {item.name}
              </span>
            ) : (
              <span className="text-text-tertiary/30">▫</span>
            )}
          </div>
        ))}
      </div>
    </GamePanel>
  )
}
