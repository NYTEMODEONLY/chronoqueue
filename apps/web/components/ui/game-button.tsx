'use client'

import { type ButtonHTMLAttributes, type ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger'

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: `
    bg-accent-gold text-bg-deep
    hover:bg-accent-gold-bright hover:-translate-y-px
    active:brightness-90 active:translate-y-px
  `,
  secondary: `
    bg-bg-surface text-text-accent border border-accent-gold-dim
    hover:border-accent-gold hover:bg-bg-raised
    active:translate-y-px
  `,
  danger: `
    bg-bg-surface text-status-critical border border-status-critical
    hover:bg-status-critical/10
    active:translate-y-px
  `,
}

interface GameButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: ReactNode
}

export function GameButton({
  variant = 'primary',
  children,
  className = '',
  ...props
}: GameButtonProps) {
  return (
    <button
      className={`
        min-h-10
        rounded-[var(--panel-radius)]
        px-4 py-2
        font-[family-name:var(--font-exo2)]
        text-[length:var(--font-stat)]
        font-semibold
        uppercase
        tracking-[0.04em]
        transition-all duration-150
        cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
        ${VARIANT_CLASSES[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
