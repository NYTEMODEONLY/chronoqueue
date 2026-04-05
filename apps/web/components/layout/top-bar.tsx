'use client'

import { ProgressBar } from '../ui/progress-bar'

interface TopBarProps {
  characterName: string
  level: number
  hp: { current: number; max: number }
  mp: { current: number; max: number }
  xp: { current: number; max: number }
}

export function TopBar({ characterName, level, hp, mp, xp }: TopBarProps) {
  return (
    <header
      className="
        fixed top-0 right-0 left-0 z-50
        flex h-[var(--topbar-height)] items-center
        border-b border-border-subtle
        bg-bg-base
        px-3 md:px-4
      "
    >
      <div className="mx-auto flex w-full max-w-[var(--max-content-width)] items-center gap-3 md:gap-4">
        {/* Character identity */}
        <div className="flex shrink-0 items-center gap-2">
          <span className="font-[family-name:var(--font-exo2)] text-[length:var(--font-body)] font-semibold text-text-primary">
            {characterName}
          </span>
          <span className="rounded-[var(--panel-radius)] border border-accent-gold-dim bg-bg-surface px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[length:var(--font-small)] text-accent-gold">
            Lv.{level}
          </span>
        </div>

        {/* Status bars — desktop: full, mobile: mini stacked */}
        <div className="hidden flex-1 items-center gap-3 md:flex">
          <ProgressBar variant="health" current={hp.current} max={hp.max} size="md" />
          {mp.max > 0 && <ProgressBar variant="mana" current={mp.current} max={mp.max} size="md" />}
          <ProgressBar variant="xp" current={xp.current} max={xp.max} size="md" />
        </div>

        {/* Mobile: mini stacked bars */}
        <div className="flex flex-1 flex-col gap-0.5 md:hidden">
          <ProgressBar variant="health" current={hp.current} max={hp.max} size="sm" showValues={false} />
          {mp.max > 0 && <ProgressBar variant="mana" current={mp.current} max={mp.max} size="sm" showValues={false} />}
          <ProgressBar variant="xp" current={xp.current} max={xp.max} size="sm" showValues={false} />
        </div>
      </div>
    </header>
  )
}
