'use client'

import { type ReactNode } from 'react'

interface GamePanelProps {
  title?: string
  children: ReactNode
  className?: string
  scrollable?: boolean
}

export function GamePanel({ title, children, className = '', scrollable = false }: GamePanelProps) {
  return (
    <div
      className={`
        rounded-[var(--panel-radius)]
        border border-border-subtle
        border-t-border-strong
        bg-bg-base
        ${className}
      `}
    >
      {title && (
        <div
          className="
            border-b border-border-subtle
            bg-linear-to-b from-bg-raised to-bg-base
            px-4 py-2
            font-[family-name:var(--font-exo2)]
            text-[length:var(--font-h3)]
            font-semibold
            uppercase
            tracking-[0.08em]
            text-text-accent
          "
        >
          {title}
        </div>
      )}
      <div
        className={`
          p-[var(--panel-padding-mobile)]
          md:p-[var(--panel-padding-tablet)]
          lg:p-[var(--panel-padding-desktop)]
          ${scrollable ? 'overflow-y-auto' : ''}
        `}
      >
        {children}
      </div>
    </div>
  )
}
