'use client'

import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { NameInputScreen } from './name-input-screen'
import { ClassSelectionScreen } from './class-selection-screen'
import { StatReviewScreen } from './stat-review-screen'
import { TransitionScreen } from './transition-screen'
import { validateHeroName } from '@/lib/validation'
import type { HeroClassId } from '@/lib/class-data'
import { useGameStore } from '@/lib/game-store'

type CreationStep = 'name_input' | 'class_select' | 'stat_review' | 'transition'

export function CharacterCreationFlow({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<CreationStep>('name_input')
  const [rawName, setRawName] = useState('')
  const [resolvedName, setResolvedName] = useState('')
  const [selectedClassId, setSelectedClassId] = useState<HeroClassId | null>(null)
  const createHero = useGameStore((s) => s.createHero)

  const handleNameNext = useCallback((name: string) => {
    const result = validateHeroName(name)
    setRawName(name)
    setResolvedName(result.value)
    setStep('class_select')
  }, [])

  const handleClassNext = useCallback((classId: HeroClassId) => {
    setSelectedClassId(classId)
    setStep('stat_review')
  }, [])

  const handleConfirm = useCallback(() => {
    if (!selectedClassId) return
    // Persist hero to store (local storage)
    createHero(resolvedName, selectedClassId)
    setStep('transition')
  }, [selectedClassId, resolvedName, createHero])

  const handleTransitionComplete = useCallback(() => {
    onComplete()
  }, [onComplete])

  return (
    <AnimatePresence mode="wait">
      {step === 'name_input' && (
        <NameInputScreen
          key="name"
          initialName={rawName}
          onNext={handleNameNext}
        />
      )}
      {step === 'class_select' && (
        <ClassSelectionScreen
          key="class"
          heroName={resolvedName}
          initialClassId={selectedClassId}
          onNext={handleClassNext}
          onBack={() => setStep('name_input')}
        />
      )}
      {step === 'stat_review' && selectedClassId && (
        <StatReviewScreen
          key="stats"
          heroName={resolvedName}
          classId={selectedClassId}
          onConfirm={handleConfirm}
          onBack={() => setStep('class_select')}
        />
      )}
      {step === 'transition' && (
        <TransitionScreen
          key="transition"
          heroName={resolvedName}
          onComplete={handleTransitionComplete}
        />
      )}
    </AnimatePresence>
  )
}
