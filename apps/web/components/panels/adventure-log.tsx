'use client'

import { useState, useEffect, useRef } from 'react'
import { GamePanel } from '../ui/game-panel'
import { RarityText } from '../ui/rarity-text'
import { useGameStore } from '@/lib/game-store'
import { loadGameEvents, type GameEventData } from '@/app/actions/game-data'

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
  'loot-drop': '',
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

// Map DB event types to display format
function eventToLogEntry(event: GameEventData): LogEntry {
  const time = new Date(event.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  const payload = event.payload

  if (event.eventType === 'character_created') {
    return { id: event.id, time, type: 'system', icon: '\u2726', text: `Hero created. The queue begins.` }
  }
  if (event.eventType.startsWith('action_complete_')) {
    const action = event.eventType.replace('action_complete_', '')
    return {
      id: event.id,
      time,
      type: 'combat-defeat',
      icon: '\u2716',
      text: `Completed: ${action}${payload.targetId ? ` (${payload.targetId})` : ''}`,
    }
  }
  if (event.eventType === 'level_up') {
    return { id: event.id, time, type: 'level-up', icon: '\u2605', text: `LEVEL UP! Now level ${payload.level ?? '?'}` }
  }
  if (event.eventType === 'item_drop') {
    return {
      id: event.id,
      time,
      type: 'loot-drop',
      icon: '\u2605',
      text: `Loot: ${payload.itemName ?? 'Unknown item'}`,
      rarity: (payload.rarity as LogEntry['rarity']) ?? 'common',
    }
  }

  return { id: event.id, time, type: 'system', icon: '\u00B7', text: `${event.eventType}` }
}

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
      <span className="shrink-0 text-text-tertiary">{entry.time}</span>
      <span className={`shrink-0 ${colorClass}`}>{entry.icon}</span>
      {entry.type === 'loot-drop' && entry.rarity ? (
        <RarityText rarity={entry.rarity} showLabel>
          {entry.text}
        </RarityText>
      ) : entry.type === 'level-up' ? (
        <span className={`font-[family-name:var(--font-cinzel)] font-bold tracking-[0.05em] ${colorClass}`}>
          {entry.text}
        </span>
      ) : entry.type === 'flavor' ? (
        <span className={`font-[family-name:var(--font-inter)] ${colorClass}`}>
          {entry.text}
        </span>
      ) : (
        <span className={colorClass}>{entry.text}</span>
      )}
    </div>
  )
}

export function AdventureLog() {
  const hero = useGameStore((s) => s.hero)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [logEntries, setLogEntries] = useState<LogEntry[]>([])

  useEffect(() => {
    if (!hero?.id) return
    loadGameEvents(hero.id).then((events) => {
      const entries = events.reverse().map(eventToLogEntry)
      setLogEntries(entries)
    })
  }, [hero?.id])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logEntries])

  return (
    <GamePanel title="Adventure Log">
      <div ref={scrollRef} className="max-h-[calc(100vh-200px)] overflow-y-auto lg:max-h-none">
        {logEntries.length === 0 ? (
          <p className="py-4 text-center font-[family-name:var(--font-inter)] text-[length:var(--font-small)] text-text-tertiary italic">
            Your journey has just begun. The log awaits your first action.
          </p>
        ) : (
          logEntries.map((entry) => <LogEntryRow key={entry.id} entry={entry} />)
        )}
      </div>
    </GamePanel>
  )
}
