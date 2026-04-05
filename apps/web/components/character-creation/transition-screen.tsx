'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TransitionScreenProps {
  heroName: string
  onComplete: () => void
}

type Phase = 'text-in' | 'hold' | 'text-out'

export function TransitionScreen({ heroName, onComplete }: TransitionScreenProps) {
  const [phase, setPhase] = useState<Phase>('text-in')

  const skip = useCallback(() => {
    if (phase !== 'text-in') {
      onComplete()
    }
  }, [phase, onComplete])

  // Phase progression timers
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    // text-in → hold after 1s (fade-in animations complete)
    timers.push(setTimeout(() => setPhase('hold'), 1000))

    // hold → text-out after 2.5s total
    timers.push(setTimeout(() => setPhase('text-out'), 2500))

    // text-out → complete after 3.1s total
    timers.push(setTimeout(() => onComplete(), 3100))

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-screen cursor-pointer flex-col items-center justify-center bg-bg-deep px-4"
      onClick={skip}
    >
      <AnimatePresence>
        {phase !== 'text-out' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3 text-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0 }}
              className="font-[family-name:var(--font-inter)] text-[length:var(--font-h3)] italic text-text-secondary"
            >
              {heroName} joins the queue.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.4 }}
              className="font-[family-name:var(--font-mono)] text-[length:var(--font-stat)] text-text-tertiary"
            >
              Position 9,417 of 9,417.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
