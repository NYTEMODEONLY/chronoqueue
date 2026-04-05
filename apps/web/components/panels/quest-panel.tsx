'use client'

import { useState, useEffect } from 'react'
import { GamePanel } from '../ui/game-panel'
import { ProgressBar } from '../ui/progress-bar'
import { useGameStore } from '@/lib/game-store'
import { loadActiveQuests, type QuestData } from '@/app/actions/game-data'

function QuestCard({ quest }: { quest: QuestData }) {
  const rewardParts: string[] = []
  const rewards = quest.rewards as { xp?: number; gold?: number; guaranteedDropRarityFloor?: number }
  if (rewards.xp) rewardParts.push(`${rewards.xp} XP`)
  if (rewards.gold) rewardParts.push(`${rewards.gold} Gold`)
  const rewardText = rewardParts.length > 0 ? rewardParts.join(', ') : 'Unknown rewards'

  return (
    <div className="border-b border-border-subtle py-3 last:border-0">
      <div className="mb-1 font-[family-name:var(--font-exo2)] text-[length:var(--font-body)] font-medium text-text-primary">
        {quest.name}
      </div>
      <p className="mb-2 font-[family-name:var(--font-inter)] text-[length:var(--font-small)] leading-relaxed text-text-secondary italic">
        {quest.description}
      </p>
      <ProgressBar
        variant="quest"
        current={quest.progress.current}
        max={quest.progress.target}
        size="md"
        label=""
        className="mb-1.5"
      />
      <div className="font-[family-name:var(--font-mono)] text-[length:var(--font-micro)] text-accent-gold">
        Rewards: {rewardText}
      </div>
    </div>
  )
}

export function QuestPanel() {
  const hero = useGameStore((s) => s.hero)
  const [quests, setQuests] = useState<QuestData[]>([])

  useEffect(() => {
    if (!hero?.id) return
    loadActiveQuests(hero.id).then(setQuests)
  }, [hero?.id])

  const activeQuests = quests.filter((q) => q.status === 'active')

  return (
    <GamePanel title={`Active Quests (${activeQuests.length})`}>
      {activeQuests.length === 0 ? (
        <p className="py-4 text-center font-[family-name:var(--font-inter)] text-[length:var(--font-small)] text-text-tertiary italic">
          No active quests. The queue churns on.
        </p>
      ) : (
        activeQuests.map((quest) => <QuestCard key={quest.id} quest={quest} />)
      )}
    </GamePanel>
  )
}
