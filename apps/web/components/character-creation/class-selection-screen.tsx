'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GameButton } from '../ui/game-button'
import {
  HERO_CLASSES,
  STAT_LABELS,
  STAT_KEYS,
  type HeroClassDef,
  type HeroClassId,
} from '@/lib/class-data'

interface ClassSelectionScreenProps {
  heroName: string
  initialClassId: HeroClassId | null
  onNext: (classId: HeroClassId) => void
  onBack: () => void
}

function StatBar({ label, value, maxValue, accentColor }: {
  label: string
  value: number
  maxValue: number
  accentColor: string
}) {
  const pct = Math.min((value / maxValue) * 100, 100)
  return (
    <div className="flex items-center gap-2">
      <span className="w-8 shrink-0 font-[family-name:var(--font-mono)] text-[length:var(--font-stat)] text-text-secondary">
        {label}
      </span>
      <div className="relative h-3 flex-1 rounded-[1px] border border-border-subtle bg-bg-deep">
        <div
          className="h-full rounded-[1px] transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%`, backgroundColor: accentColor }}
        />
      </div>
      <span className="w-4 shrink-0 text-right font-[family-name:var(--font-mono)] text-[length:var(--font-stat)] text-text-primary">
        {value}
      </span>
    </div>
  )
}

function GrowthRow({ label, weight }: { label: string; weight: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-8 shrink-0 font-[family-name:var(--font-mono)] text-[length:var(--font-small)] text-text-secondary">
        {label}
      </span>
      <div className="relative h-2 flex-1 rounded-[1px] bg-bg-deep">
        <div
          className="h-full rounded-[1px] bg-text-tertiary transition-[width] duration-300 ease-out"
          style={{ width: `${weight}%` }}
        />
      </div>
      <span className="w-8 shrink-0 text-right font-[family-name:var(--font-mono)] text-[length:var(--font-small)] text-text-tertiary">
        {weight}%
      </span>
    </div>
  )
}

function ClassCard({
  cls,
  isSelected,
  onSelect,
}: {
  cls: HeroClassDef
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={`
        w-full cursor-pointer rounded-[var(--panel-radius)]
        border bg-bg-base p-4
        text-left transition-all duration-150
        ${
          isSelected
            ? 'border-accent-gold bg-bg-raised'
            : 'border-border-subtle hover:border-border-strong hover:bg-bg-surface'
        }
      `}
    >
      <div className="flex items-start gap-3">
        <span
          className="shrink-0 text-2xl leading-none"
          style={{ color: cls.accentColor }}
        >
          {cls.icon}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-[family-name:var(--font-exo2)] text-[length:var(--font-h3)] font-semibold uppercase text-text-primary">
            {cls.name}
          </h3>
          <p className="mt-0.5 font-[family-name:var(--font-inter)] text-[length:var(--font-small)] text-text-secondary">
            {cls.playstyle}
          </p>
          <p className="mt-1 font-[family-name:var(--font-mono)] text-[length:var(--font-micro)] uppercase text-text-tertiary">
            {cls.archetype}
          </p>
        </div>
      </div>
    </button>
  )
}

function ClassDetail({ cls }: { cls: HeroClassDef }) {
  const maxStat = Math.max(...STAT_KEYS.map((k) => cls.baseStats[k]))
  const sortedGrowth = [...STAT_KEYS].sort(
    (a, b) => cls.growthWeights[b] - cls.growthWeights[a]
  )

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.15 }}
      className="overflow-hidden"
    >
      <div className="rounded-[var(--panel-radius)] border border-border-subtle bg-bg-surface p-4 md:p-5">
        {/* Header */}
        <h2
          className="font-[family-name:var(--font-cinzel)] text-[length:var(--font-h2)] font-bold text-text-primary"
          style={{ color: cls.accentColor }}
        >
          {cls.name}
        </h2>
        <p className="mt-1 font-[family-name:var(--font-inter)] text-[length:var(--font-body)] italic text-text-secondary">
          &ldquo;{cls.flavor}&rdquo;
        </p>
        <p className="mt-2 font-[family-name:var(--font-inter)] text-[length:var(--font-body)] text-text-primary">
          {cls.playstyle}
        </p>

        {/* Stats + Growth side by side on tablet+ */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {/* Starting Stats */}
          <div>
            <h4 className="mb-2 font-[family-name:var(--font-exo2)] text-[length:var(--font-stat)] font-semibold uppercase tracking-[0.04em] text-text-accent">
              Starting Stats
            </h4>
            <div className="space-y-1.5">
              {STAT_KEYS.map((key) => (
                <StatBar
                  key={key}
                  label={STAT_LABELS[key].short}
                  value={cls.baseStats[key]}
                  maxValue={10}
                  accentColor={
                    cls.baseStats[key] === maxStat ? cls.accentColor : 'var(--text-tertiary)'
                  }
                />
              ))}
            </div>
            <p className="mt-1.5 font-[family-name:var(--font-mono)] text-[length:var(--font-micro)] text-text-tertiary">
              Total: 25
            </p>
          </div>

          {/* Growth Focus */}
          <div className="hidden md:block">
            <h4 className="mb-2 font-[family-name:var(--font-exo2)] text-[length:var(--font-stat)] font-semibold uppercase tracking-[0.04em] text-text-accent">
              Growth Focus
            </h4>
            <div className="space-y-1.5">
              {sortedGrowth.map((key) => (
                <GrowthRow
                  key={key}
                  label={STAT_LABELS[key].short}
                  weight={cls.growthWeights[key]}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function ClassSelectionScreen({
  heroName,
  initialClassId,
  onNext,
  onBack,
}: ClassSelectionScreenProps) {
  const [selectedId, setSelectedId] = useState<HeroClassId | null>(initialClassId)
  const selectedClass = selectedId
    ? HERO_CLASSES.find((c) => c.id === selectedId) ?? null
    : null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex min-h-screen flex-col bg-bg-deep"
    >
      <div className="mx-auto w-full max-w-[960px] px-4 py-6 md:py-10">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <button
            onClick={onBack}
            className="cursor-pointer font-[family-name:var(--font-inter)] text-[length:var(--font-stat)] text-text-secondary transition-colors hover:text-text-primary"
          >
            &larr; BACK
          </button>
        </div>

        <div className="mb-6 text-center">
          <h1 className="font-[family-name:var(--font-cinzel)] text-[length:var(--font-h1)] font-bold text-text-accent">
            CHOOSE YOUR CLASS
          </h1>
          <p className="mt-1 font-[family-name:var(--font-inter)] text-[length:var(--font-body)] italic text-text-secondary">
            {heroName} awaits a path.
          </p>
        </div>

        {/* Class card grid */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {HERO_CLASSES.map((cls) => (
            <ClassCard
              key={cls.id}
              cls={cls}
              isSelected={selectedId === cls.id}
              onSelect={() => setSelectedId(cls.id)}
            />
          ))}
        </div>

        {/* Detail panel */}
        <div className="mt-4">
          <AnimatePresence mode="wait">
            {selectedClass && (
              <ClassDetail key={selectedClass.id} cls={selectedClass} />
            )}
          </AnimatePresence>
        </div>

        {/* CTA */}
        {selectedClass && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center"
          >
            <GameButton
              onClick={() => onNext(selectedClass.id)}
              className="w-full max-w-sm"
            >
              BEGIN AS {selectedClass.name.toUpperCase()}
            </GameButton>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
