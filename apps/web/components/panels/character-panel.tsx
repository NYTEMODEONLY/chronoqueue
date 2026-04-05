'use client'

import { GamePanel } from '../ui/game-panel'
import { ProgressBar } from '../ui/progress-bar'
import { useGameStore } from '@/lib/game-store'
import { STAT_LABELS, STAT_KEYS, calcMaxHp } from '@/lib/class-data'

export function CharacterPanel() {
  const hero = useGameStore((s) => s.hero)

  if (!hero) return null

  const maxHp = calcMaxHp(hero.stats.vit)
  const stats = STAT_KEYS.map((key) => {
    const base = hero.stats[key]
    // Sum equipment bonuses for this stat
    const bonus = Object.values(hero.equipment)
      .filter(Boolean)
      .reduce((sum, item) => sum + ((item?.statBonuses[key] as number) ?? 0), 0)
    return { name: STAT_LABELS[key].short, value: base, bonus }
  })

  const equipmentSlots = [
    { slot: 'Weapon', item: hero.equipment.weapon?.name ?? null },
    { slot: 'Chest', item: hero.equipment.chest?.name ?? null },
    { slot: 'Legs', item: hero.equipment.legs?.name ?? null },
    { slot: 'Accessory', item: hero.equipment.accessory_1?.name ?? null },
  ]

  return (
    <div className="flex flex-col gap-[var(--panel-gap)]">
      <GamePanel title="Character Stats">
        {/* Bars */}
        <div className="mb-4 flex flex-col gap-2">
          <ProgressBar variant="health" current={hero.hp} max={maxHp} />
          <ProgressBar variant="xp" current={hero.xp} max={50} />
        </div>

        {/* Stats list */}
        <div className="flex flex-col gap-1">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="flex items-center font-[family-name:var(--font-mono)] text-[length:var(--font-stat)] leading-[1.3]"
            >
              <span className="text-text-accent">{'\u25C6'}</span>
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
        <div className="flex flex-col gap-2">
          {equipmentSlots.map((eq) => (
            <div
              key={eq.slot}
              className={`
                flex items-center justify-between
                rounded-[var(--panel-radius)]
                border px-3 py-2
                ${eq.item ? 'border-border-strong bg-bg-surface' : 'border-border-subtle bg-bg-deep'}
              `}
            >
              <span className="font-[family-name:var(--font-mono)] text-[length:var(--font-micro)] text-text-tertiary">
                {eq.slot}
              </span>
              {eq.item ? (
                <span className="text-[length:var(--font-small)] text-text-primary">
                  {eq.item}
                </span>
              ) : (
                <span className="text-[length:var(--font-micro)] text-text-tertiary">Empty</span>
              )}
            </div>
          ))}
        </div>
      </GamePanel>
    </div>
  )
}
