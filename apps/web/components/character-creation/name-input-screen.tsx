'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { GameButton } from '../ui/game-button'
import { validateNameLive, canProceedWithName } from '@/lib/validation'

const TAGLINES = [
  'Your heroes are busy.',
  'The queue awaits.',
  'Time is a suggestion.',
]

interface NameInputScreenProps {
  initialName: string
  onNext: (name: string) => void
}

export function NameInputScreen({ initialName, onNext }: NameInputScreenProps) {
  const [name, setName] = useState(initialName)
  const inputRef = useRef<HTMLInputElement>(null)
  const tagline = useMemo(() => TAGLINES[Math.floor(Math.random() * TAGLINES.length)], [])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const { error, charCount } = validateNameLive(name)
  const canProceed = canProceedWithName(name)
  const showCounter = charCount >= 14

  function handleSubmit() {
    if (canProceed) {
      onNext(name)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex min-h-screen flex-col items-center justify-center bg-bg-deep px-4"
    >
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Title */}
        <div className="space-y-2">
          <h1
            className="
              font-[family-name:var(--font-cinzel)]
              text-[length:var(--font-display)]
              font-bold
              tracking-[0.1em]
              text-text-accent
            "
          >
            CHRONOQUEUE
          </h1>
          <p className="font-[family-name:var(--font-inter)] text-[length:var(--font-body)] italic text-text-secondary">
            {tagline}
          </p>
        </div>

        {/* Name input */}
        <div className="space-y-3">
          <label
            htmlFor="hero-name"
            className="
              block
              font-[family-name:var(--font-exo2)]
              text-[length:var(--font-h3)]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-text-accent
            "
          >
            NAME YOUR HERO
          </label>

          <input
            ref={inputRef}
            id="hero-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={24}
            autoComplete="off"
            spellCheck={false}
            className="
              w-full
              rounded-[var(--panel-radius)]
              border border-border-subtle
              bg-bg-surface
              px-4 py-3
              font-[family-name:var(--font-inter)]
              text-[length:var(--font-h3)]
              text-text-primary
              caret-accent-gold
              outline-none
              transition-colors duration-150
              placeholder:text-text-tertiary
              focus:border-accent-gold-dim
            "
          />

          {/* Hint / Error / Counter row */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-h-5">
              {error ? (
                <p className="font-[family-name:var(--font-inter)] text-[length:var(--font-small)] text-status-critical">
                  {error}
                </p>
              ) : (
                <p className="font-[family-name:var(--font-inter)] text-[length:var(--font-small)] text-text-tertiary">
                  1-20 characters. Letters, numbers, spaces, and hyphens.
                </p>
              )}
            </div>
            {showCounter && (
              <span className="shrink-0 font-[family-name:var(--font-mono)] text-[length:var(--font-small)] text-text-tertiary">
                {charCount}/20
              </span>
            )}
          </div>
        </div>

        {/* CTA */}
        <GameButton
          onClick={handleSubmit}
          disabled={!canProceed}
          className="w-full disabled:cursor-not-allowed disabled:opacity-40"
        >
          CHOOSE CLASS &rarr;
        </GameButton>
      </div>
    </motion.div>
  )
}
