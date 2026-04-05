'use client'

import { GamePanel } from '../ui/game-panel'
import { ProgressBar } from '../ui/progress-bar'

const MOCK_STATS = [
  { name: 'STR', value: 24, bonus: 3 },
  { name: 'INT', value: 31, bonus: 5 },
  { name: 'VIT', value: 22, bonus: 2 },
  { name: 'SPD', value: 18, bonus: 1 },
  { name: 'LCK', value: 15, bonus: 0 },
]

const EQUIPMENT_SLOTS = [
  { slot: 'Helm', item: 'Iron Helm' },
  { slot: 'Armor', item: 'Chain Mail' },
  { slot: 'Weapon', item: 'Staff of Minor Flame' },
  { slot: 'Boots', item: 'Leather Boots' },
  { slot: 'Shield', item: null },
  { slot: 'Amulet', item: 'Copper Pendant' },
  { slot: 'Ring 1', item: null },
  { slot: 'Ring 2', item: null },
  { slot: 'Trinket', item: null },
]

export function CharacterPanel() {
  return (
    <div className="flex flex-col gap-[var(--panel-gap)]">
      <GamePanel title="Character Stats">
        {/* Bars */}
        <div className="mb-4 flex flex-col gap-2">
          <ProgressBar variant="health" current={234} max={450} />
          <ProgressBar variant="mana" current={180} max={220} />
          <ProgressBar variant="stamina" current={88} max={100} />
        </div>

        {/* Stats list */}
        <div className="flex flex-col gap-1">
          {MOCK_STATS.map((stat) => (
            <div
              key={stat.name}
              className="flex items-center font-[family-name:var(--font-mono)] text-[length:var(--font-stat)] leading-[1.3]"
            >
              <span className="text-text-accent">◆</span>
              <span className="ml-2 w-10 text-text-primary">{stat.name}</span>
              <span className="ml-auto tabular-nums text-text-primary">{stat.value}</span>
              {stat.bonus > 0 && (
                <span className="ml-2 w-10 text-right tabular-nums text-accent-gold">
                  (+{stat.bonus})
                </span>
              )}
              {stat.bonus === 0 && (
                <span className="ml-2 w-10 text-right tabular-nums text-text-tertiary">
                  (+0)
                </span>
              )}
            </div>
          ))}
        </div>
      </GamePanel>

      <GamePanel title="Equipment">
        <div className="grid grid-cols-3 gap-2">
          {EQUIPMENT_SLOTS.map((eq) => (
            <div
              key={eq.slot}
              className={`
                flex aspect-square flex-col items-center justify-center
                rounded-[var(--panel-radius)]
                border
                ${eq.item ? 'border-border-strong bg-bg-surface' : 'border-border-subtle bg-bg-deep'}
                p-1 text-center
              `}
            >
              {eq.item ? (
                <span className="text-[length:var(--font-micro)] leading-tight text-text-primary">
                  {eq.item}
                </span>
              ) : (
                <span className="text-[length:var(--font-micro)] text-text-tertiary">
                  {eq.slot}
                </span>
              )}
            </div>
          ))}
        </div>
      </GamePanel>
    </div>
  )
}
