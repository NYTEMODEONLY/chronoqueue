'use client'

import { motion } from 'framer-motion'
import { GameButton } from '../ui/game-button'
import {
  getClassById,
  STAT_LABELS,
  STAT_KEYS,
  calcMaxHp,
  calcTickInterval,
  calcCritChance,
  type HeroClassId,
} from '@/lib/class-data'

interface StatReviewScreenProps {
  heroName: string
  classId: HeroClassId
  onConfirm: () => void
  onBack: () => void
}

export function StatReviewScreen({
  heroName,
  classId,
  onConfirm,
  onBack,
}: StatReviewScreenProps) {
  const cls = getClassById(classId)
  const maxStat = Math.max(...STAT_KEYS.map((k) => cls.baseStats[k]))

  // Derived stats
  const maxHp = calcMaxHp(cls.baseStats.vit)
  const tickInterval = calcTickInterval(cls.baseStats.spd)
  const critChance = calcCritChance(cls.baseStats.lck)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex min-h-screen flex-col bg-bg-deep"
    >
      <div className="mx-auto w-full max-w-[640px] px-4 py-6 md:py-10">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="cursor-pointer font-[family-name:var(--font-inter)] text-[length:var(--font-stat)] text-text-secondary transition-colors hover:text-text-primary"
          >
            &larr; BACK
          </button>
        </div>

        <div className="mb-8 text-center">
          <h1 className="font-[family-name:var(--font-cinzel)] text-[length:var(--font-h1)] font-bold text-text-accent">
            YOUR HERO
          </h1>
        </div>

        {/* Hero identity card */}
        <div
          className="rounded-[var(--panel-radius)] border border-border-subtle bg-bg-base p-5"
          style={{ borderLeftWidth: '3px', borderLeftColor: cls.accentColor }}
        >
          <h2 className="font-[family-name:var(--font-cinzel)] text-[length:var(--font-display)] font-bold uppercase tracking-[0.08em] text-text-primary">
            {heroName}
          </h2>
          <p className="mt-1 font-[family-name:var(--font-exo2)] text-[length:var(--font-h3)] font-medium text-text-accent">
            Level 1 {cls.name}
          </p>
          <p className="mt-2 font-[family-name:var(--font-inter)] text-[length:var(--font-body)] italic text-text-secondary">
            &ldquo;{cls.flavor}&rdquo;
          </p>
        </div>

        {/* Starting Stats */}
        <div className="mt-6">
          <h3 className="mb-3 font-[family-name:var(--font-exo2)] text-[length:var(--font-stat)] font-semibold uppercase tracking-[0.04em] text-text-accent">
            Starting Stats
          </h3>
          <div className="space-y-2">
            {STAT_KEYS.map((key) => (
              <div key={key} className="flex items-center gap-2">
                <span className="w-8 shrink-0 font-[family-name:var(--font-mono)] text-[length:var(--font-stat)] text-text-secondary">
                  {STAT_LABELS[key].short}
                </span>
                <div className="relative h-3 flex-1 rounded-[1px] border border-border-subtle bg-bg-deep">
                  <div
                    className="h-full rounded-[1px] transition-[width] duration-300 ease-out"
                    style={{
                      width: `${(cls.baseStats[key] / 10) * 100}%`,
                      backgroundColor:
                        cls.baseStats[key] === maxStat
                          ? cls.accentColor
                          : 'var(--text-tertiary)',
                    }}
                  />
                </div>
                <span className="w-4 shrink-0 text-right font-[family-name:var(--font-mono)] text-[length:var(--font-stat)] text-text-primary">
                  {cls.baseStats[key]}
                </span>
                <span className="ml-2 w-24 font-[family-name:var(--font-inter)] text-[length:var(--font-small)] text-text-tertiary">
                  {STAT_LABELS[key].description}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Derived stats */}
        <div className="mt-6 rounded-[var(--panel-radius)] border border-border-subtle bg-bg-surface p-4">
          <h4 className="mb-2 font-[family-name:var(--font-exo2)] text-[length:var(--font-stat)] font-semibold uppercase tracking-[0.04em] text-text-accent">
            What This Means
          </h4>
          <div className="flex flex-wrap gap-x-6 gap-y-1 font-[family-name:var(--font-mono)] text-[length:var(--font-stat)]">
            <span>
              <span className="text-text-secondary">Max HP: </span>
              <span className="text-text-primary">{maxHp}</span>
            </span>
            <span className="text-border-strong">|</span>
            <span>
              <span className="text-text-secondary">Tick: </span>
              <span className="text-text-primary">{tickInterval.toFixed(2)}s</span>
            </span>
            <span className="text-border-strong">|</span>
            <span>
              <span className="text-text-secondary">Crit: </span>
              <span className="text-text-primary">{(critChance * 100).toFixed(1)}%</span>
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <GameButton onClick={onConfirm} className="w-full max-w-sm">
            ENTER THE QUEUE
          </GameButton>
          <p className="mt-3 font-[family-name:var(--font-inter)] text-[length:var(--font-small)] italic text-text-tertiary">
            You can change nothing about this later. Choose wisely. Or don&apos;t. Gerald doesn&apos;t judge.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
