'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_TABS } from '@/lib/nav-items'

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="
        fixed right-0 bottom-0 left-0 z-50
        border-t border-border-subtle
        bg-bg-base
        lg:hidden
      "
    >
      <div className="mx-auto flex h-[var(--bottombar-height)] max-w-[var(--max-content-width)] items-stretch">
        {NAV_TABS.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`
                relative flex flex-1 flex-col items-center justify-center gap-0.5
                transition-colors duration-100
                ${isActive ? 'text-text-accent' : 'text-text-secondary hover:text-text-primary'}
              `}
            >
              {isActive && (
                <div className="absolute top-0 right-2 left-2 h-0.5 bg-accent-gold" />
              )}
              <span className="text-xl leading-none">{tab.icon}</span>
              <span className="font-[family-name:var(--font-inter)] text-[11px]">
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
