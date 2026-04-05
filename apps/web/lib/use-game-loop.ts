'use client'

import { useEffect, useRef } from 'react'
import { useGameStore } from './game-store'
import { processTick } from '@/app/actions/tick'

const TICK_INTERVAL_MS = 3000

export function useGameLoop() {
  const hero = useGameStore((s) => s.hero)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!hero?.id) return

    const tick = async () => {
      try {
        await processTick(hero.id)
      } catch {
        // Silently retry on next interval
      }
    }

    // Run first tick immediately
    tick()

    intervalRef.current = setInterval(tick, TICK_INTERVAL_MS)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [hero?.id])
}
