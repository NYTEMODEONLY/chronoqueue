'use client'

import { useState, useEffect } from 'react'
import { GamePanel } from '../ui/game-panel'
import { type RarityTier } from '../ui/rarity-text'
import { useGameStore } from '@/lib/game-store'
import { loadInventory, type InventoryItemData } from '@/app/actions/game-data'

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

const TOTAL_SLOTS = 40

export function InventoryPanel() {
  const hero = useGameStore((s) => s.hero)
  const [inventoryItems, setInventoryItems] = useState<InventoryItemData[]>([])

  useEffect(() => {
    if (!hero?.id) return
    loadInventory(hero.id).then(setInventoryItems)
  }, [hero?.id])

  const unequipped = inventoryItems
    .filter((item) => !item.equipped)
    .sort((a, b) => (a.slotIndex ?? 999) - (b.slotIndex ?? 999))

  const filledCount = unequipped.length
  const slots: (InventoryItemData | null)[] = [...unequipped]
  while (slots.length < TOTAL_SLOTS) slots.push(null)

  return (
    <GamePanel title={`Inventory (${filledCount}/${TOTAL_SLOTS})`}>
      {inventoryItems.length === 0 ? (
        <p className="py-4 text-center font-[family-name:var(--font-inter)] text-[length:var(--font-small)] text-text-tertiary italic">
          Your bags are empty. Adventure awaits.
        </p>
      ) : (
        <div className="grid grid-cols-5 gap-1.5 md:grid-cols-8 lg:grid-cols-5">
          {slots.map((item, i) => {
            const rarity = item ? (item.rarityName as RarityTier) : 'common'
            return (
              <div
                key={item?.id ?? `empty-${i}`}
                className={`
                  flex aspect-square items-center justify-center
                  rounded-[var(--panel-radius)]
                  border
                  ${item ? `${RARITY_BORDER[rarity]} bg-bg-surface` : 'border-border-subtle bg-bg-deep'}
                  p-1 text-center
                `}
                title={item?.name}
              >
                {item ? (
                  <span className={`text-[length:var(--font-micro)] leading-tight ${RARITY_TEXT[rarity]} truncate`}>
                    {item.name}
                  </span>
                ) : (
                  <span className="text-text-tertiary/30">{'\u25AB'}</span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </GamePanel>
  )
}
