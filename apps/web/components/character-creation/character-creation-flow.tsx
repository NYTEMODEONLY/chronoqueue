'use client'

import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { NameInputScreen } from './name-input-screen'
import { ClassSelectionScreen } from './class-selection-screen'
import { StatReviewScreen } from './stat-review-screen'
import { TransitionScreen } from './transition-screen'
import { validateHeroName } from '@/lib/validation'
import type { HeroClassId } from '@/lib/class-data'
import { useGameStore, getOrCreateDeviceId } from '@/lib/game-store'
import { createCharacter } from '@/app/actions/character'

type CreationStep = 'name_input' | 'class_select' | 'stat_review' | 'transition'

export function CharacterCreationFlow({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<CreationStep>('name_input')
  const [rawName, setRawName] = useState('')
  const [resolvedName, setResolvedName] = useState('')
  const [selectedClassId, setSelectedClassId] = useState<HeroClassId | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const { deviceId, setDeviceId, setHero } = useGameStore()

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

  const handleConfirm = useCallback(async () => {
    if (!selectedClassId || isCreating) return
    setIsCreating(true)
    setError(null)

    try {
      // Ensure we have a deviceId for anonymous auth
      const id = getOrCreateDeviceId(deviceId)
      if (!deviceId) setDeviceId(id)

      const result = await createCharacter({
        name: resolvedName,
        classId: selectedClassId,
        deviceId: id,
      })

      if (result.success) {
        setHero(result.hero)
        setStep('transition')
      } else {
        setError(result.error)
        setIsCreating(false)
      }
    } catch {
      setError('Connection error. Please try again.')
      setIsCreating(false)
    }
  }, [selectedClassId, resolvedName, deviceId, setDeviceId, setHero, isCreating])

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
          onBack={() => { setStep('class_select'); setError(null) }}
          isLoading={isCreating}
          error={error}
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
