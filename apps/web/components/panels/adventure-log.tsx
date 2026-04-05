'use client'

import { useEffect, useRef } from 'react'
import { GamePanel } from '../ui/game-panel'
import { RarityText } from '../ui/rarity-text'

type LogEntryType =
  | 'combat-attack'
  | 'combat-defend'
  | 'combat-crit'
  | 'combat-defeat'
  | 'loot-drop'
  | 'loot-gold'
  | 'loot-xp'
  | 'quest-start'
  | 'quest-complete'
  | 'level-up'
  | 'zone-enter'
  | 'flavor'
  | 'system'

interface LogEntry {
  id: string
  time: string
  type: LogEntryType
  icon: string
  text: string
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'
}

const TYPE_COLORS: Record<LogEntryType, string> = {
  'combat-attack': 'text-text-primary',
  'combat-defend': 'text-status-health',
  'combat-crit': 'text-accent-gold-bright',
  'combat-defeat': 'text-accent-teal',
  'loot-drop': '', // handled by rarity
  'loot-gold': 'text-accent-gold',
  'loot-xp': 'text-status-xp',
  'quest-start': 'text-accent-blue',
  'quest-complete': 'text-accent-teal',
  'level-up': 'text-accent-gold-bright',
  'zone-enter': 'text-accent-blue',
  flavor: 'text-text-secondary italic',
  system: 'text-text-tertiary',
}

const SPACING_BEFORE: Partial<Record<LogEntryType, string>> = {
  'zone-enter': 'mt-4',
  'quest-complete': 'mt-3',
  'level-up': 'mt-3',
  'loot-drop': 'mt-2',
  flavor: 'mt-2',
}

const MOCK_LOG: LogEntry[] = [
  { id: '1', time: '14:21', type: 'zone-enter', icon: '▸', text: 'Entering: Darkwood Clearing (Act 1-3)' },
  { id: '2', time: '14:22', type: 'combat-attack', icon: '⚔', text: 'Gerald attacks Goblin Scout for 24 damage.' },
  { id: '3', time: '14:22', type: 'combat-defend', icon: '🛡', text: 'Goblin Scout strikes Gerald for 12 damage.' },
  { id: '4', time: '14:22', type: 'combat-attack', icon: '⚔', text: 'Gerald attacks Goblin Scout for 19 damage.' },
  { id: '5', time: '14:22', type: 'combat-defeat', icon: '✦', text: 'Gerald defeats the Goblin Scout!' },
  { id: '6', time: '14:22', type: 'loot-xp', icon: '◆', text: '+85 XP' },
  { id: '7', time: '14:22', type: 'loot-gold', icon: '●', text: '+24 Gold' },
  { id: '8', time: '14:23', type: 'combat-attack', icon: '⚔', text: 'Gerald attacks Goblin Shaman for 22 damage.' },
  { id: '9', time: '14:23', type: 'combat-defend', icon: '🛡', text: 'Goblin Shaman casts Fireball! Gerald takes 18 damage.' },
  { id: '10', time: '14:23', type: 'combat-crit', icon: '★', text: 'CRITICAL! Gerald strikes for 58 damage!' },
  { id: '11', time: '14:23', type: 'combat-defeat', icon: '✦', text: 'Gerald defeats the Goblin Shaman!' },
  { id: '12', time: '14:23', type: 'loot-drop', icon: '★', text: 'Loot: Staff of Minor Flame', rarity: 'rare' },
  { id: '13', time: '14:23', type: 'loot-xp', icon: '◆', text: '+120 XP' },
  { id: '14', time: '14:23', type: 'loot-gold', icon: '●', text: '+34 Gold' },
  { id: '15', time: '14:24', type: 'flavor', icon: '~', text: 'Gerald pauses to adjust his helmet. It\'s on backwards again.' },
  { id: '16', time: '14:25', type: 'quest-start', icon: '▸', text: 'Quest accepted: Retrieve the Orb of Sufficient Importance' },
  { id: '17', time: '14:26', type: 'combat-attack', icon: '⚔', text: 'Gerald attacks Forest Spider for 26 damage.' },
  { id: '18', time: '14:26', type: 'combat-defend', icon: '🛡', text: 'Forest Spider bites Gerald for 8 damage.' },
  { id: '19', time: '14:26', type: 'combat-attack', icon: '⚔', text: 'Gerald attacks Forest Spider for 21 damage.' },
  { id: '20', time: '14:26', type: 'combat-defeat', icon: '✦', text: 'Gerald defeats the Forest Spider!' },
  { id: '21', time: '14:26', type: 'loot-drop', icon: '★', text: 'Loot: Spider Silk Thread', rarity: 'uncommon' },
  { id: '22', time: '14:26', type: 'loot-xp', icon: '◆', text: '+95 XP' },
  { id: '23', time: '14:26', type: 'loot-gold', icon: '●', text: '+18 Gold' },
  { id: '24', time: '14:27', type: 'system', icon: '·', text: 'Auto-save complete. Connection stable.' },
]

function LogEntryRow({ entry }: { entry: LogEntry }) {
  const spacing = SPACING_BEFORE[entry.type] ?? 'mt-1'
  const colorClass = entry.type === 'loot-drop' ? '' : TYPE_COLORS[entry.type]

  return (
    <div
      className={`
        flex items-start gap-2
        font-[family-name:var(--font-mono)]
        text-[length:var(--font-stat)]
        leading-[1.3]
        ${spacing}
      `}
    >
      {/* Timestamp */}
      <span className="shrink-0 text-text-tertiary">{entry.time}</span>

      {/* Icon */}
      <span className={`shrink-0 ${colorClass}`}>{entry.icon}</span>

      {/* Text */}
      {entry.type === 'loot-drop' && entry.rarity ? (
        <RarityText rarity={entry.rarity} showLabel>
          {entry.text}
        </RarityText>
      ) : entry.type === 'level-up' ? (
        <span className={`font-[family-name:var(--font-cinzel)] font-bold tracking-[0.05em] ${colorClass}`}>
          {entry.text}
        </span>
      ) : (
        <span className={colorClass}>{entry.text}</span>
      )}
    </div>
  )
}

export function AdventureLog() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  return (
    <GamePanel title="Adventure Log">
      <div ref={scrollRef} className="max-h-[calc(100vh-200px)] overflow-y-auto lg:max-h-none">
        {MOCK_LOG.map((entry) => (
          <LogEntryRow key={entry.id} entry={entry} />
        ))}
      </div>
    </GamePanel>
  )
}
