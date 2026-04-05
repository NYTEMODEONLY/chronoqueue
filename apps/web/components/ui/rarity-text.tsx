'use client'

import { type ReactNode } from 'react'

export type RarityTier = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'

const RARITY_STYLES: Record<RarityTier, { color: string; glow: string }> = {
  common: {
    color: 'text-rarity-common',
    glow: '',
  },
  uncommon: {
    color: 'text-rarity-uncommon',
    glow: 'drop-shadow-[0_0_4px_rgba(30,255,0,0.3)]',
  },
  rare: {
    color: 'text-rarity-rare',
    glow: 'drop-shadow-[0_0_4px_rgba(0,112,221,0.3)]',
  },
  epic: {
    color: 'text-rarity-epic',
    glow: 'drop-shadow-[0_0_4px_rgba(163,53,238,0.3)]',
  },
  legendary: {
    color: 'text-rarity-legendary',
    glow: 'drop-shadow-[0_0_6px_rgba(255,128,0,0.4)]',
  },
  mythic: {
    color: 'text-rarity-mythic',
    glow: 'drop-shadow-[0_0_8px_rgba(230,204,128,0.5)]',
  },
}

interface RarityTextProps {
  rarity: RarityTier
  children: ReactNode
  className?: string
  showLabel?: boolean
}

export function RarityText({ rarity, children, className = '', showLabel = false }: RarityTextProps) {
  const style = RARITY_STYLES[rarity]

  return (
    <span className={`${style.color} ${style.glow} ${className}`}>
      {children}
      {showLabel && (
        <span className="ml-1 text-[length:var(--font-small)] uppercase">
          [{rarity}]
        </span>
      )}
    </span>
  )
}
