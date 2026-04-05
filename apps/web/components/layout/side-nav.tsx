'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_TABS } from '@/lib/nav-items'

export function SideNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1 py-2">
      {NAV_TABS.map((tab) => {
        const isActive = pathname === tab.href
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`
              relative flex items-center gap-2 px-3 py-2
              font-[family-name:var(--font-exo2)] text-[length:var(--font-stat)]
              transition-colors duration-100
              ${isActive ? 'text-text-accent bg-bg-surface' : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface/50'}
            `}
          >
            {isActive && (
              <div className="absolute top-1 bottom-1 left-0 w-0.5 bg-accent-gold" />
            )}
            <span className="text-base">{tab.icon}</span>
            <span className="font-semibold uppercase tracking-[0.04em]">{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
