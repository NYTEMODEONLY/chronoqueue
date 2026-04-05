'use client'

type BarVariant = 'health' | 'mana' | 'xp' | 'stamina' | 'quest'

const VARIANT_FILL: Record<BarVariant, string> = {
  health: 'bg-status-health-fill',
  mana: 'bg-status-mana-fill',
  xp: 'bg-status-xp-fill',
  stamina: 'bg-status-stamina',
  quest: 'bg-accent-teal',
}

const VARIANT_LABEL: Record<BarVariant, string> = {
  health: 'HP',
  mana: 'MP',
  xp: 'XP',
  stamina: 'STA',
  quest: '',
}

interface ProgressBarProps {
  current: number
  max: number
  variant: BarVariant
  label?: string
  size?: 'sm' | 'md' | 'lg'
  showValues?: boolean
  className?: string
}

export function ProgressBar({
  current,
  max,
  variant,
  label,
  size = 'md',
  showValues = true,
  className = '',
}: ProgressBarProps) {
  const pct = max > 0 ? Math.min((current / max) * 100, 100) : 0
  const displayLabel = label ?? VARIANT_LABEL[variant]

  const heights: Record<string, string> = {
    sm: 'h-1.5',
    md: 'h-5',
    lg: 'h-6',
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {displayLabel && (
        <span className="w-8 shrink-0 font-[family-name:var(--font-mono)] text-[length:var(--font-small)] text-text-secondary">
          {displayLabel}
        </span>
      )}
      <div className="relative flex-1">
        {/* Track */}
        <div
          className={`
            ${heights[size]}
            w-full
            rounded-[1px]
            border border-border-subtle
            bg-bg-deep
          `}
        >
          {/* Fill */}
          <div
            className={`
              ${heights[size]}
              ${VARIANT_FILL[variant]}
              rounded-[1px]
              transition-[width] duration-300 ease-out
            `}
            style={{ width: `${pct}%` }}
          />
        </div>
        {/* 25% segment marks */}
        {size !== 'sm' && (
          <div className="pointer-events-none absolute inset-0 flex">
            {[25, 50, 75].map((mark) => (
              <div
                key={mark}
                className="absolute top-0 h-full w-px bg-bg-deep/40"
                style={{ left: `${mark}%` }}
              />
            ))}
          </div>
        )}
      </div>
      {showValues && size !== 'sm' && (
        <span className="shrink-0 font-[family-name:var(--font-mono)] text-[length:var(--font-stat)] tabular-nums text-text-secondary">
          {current.toLocaleString()} / {max.toLocaleString()}
        </span>
      )}
    </div>
  )
}
