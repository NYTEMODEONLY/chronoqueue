'use client'

import { GamePanel } from '../ui/game-panel'
import { ProgressBar } from '../ui/progress-bar'

interface Quest {
  id: string
  name: string
  description: string
  progress: { current: number; max: number }
  rewards: string
  active: boolean
}

const MOCK_QUESTS: Quest[] = [
  {
    id: '1',
    name: 'Retrieve the Orb of Sufficient Importance',
    description: 'A wizard has misplaced his orb. Again. Find it in the Darkwood.',
    progress: { current: 0, max: 1 },
    rewards: '500 XP, 120 Gold, 1x Uncommon item',
    active: true,
  },
  {
    id: '2',
    name: 'Goblin Population Control',
    description: 'The mayor wants fewer goblins. You want XP. Everyone wins.',
    progress: { current: 3, max: 10 },
    rewards: '300 XP, 80 Gold',
    active: true,
  },
  {
    id: '3',
    name: 'Spider Silk Collection',
    description: 'The weaver needs silk. The spiders won\'t give it willingly.',
    progress: { current: 1, max: 5 },
    rewards: '200 XP, Uncommon Armor',
    active: true,
  },
]

function QuestCard({ quest }: { quest: Quest }) {
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
        max={quest.progress.max}
        size="md"
        label=""
        className="mb-1.5"
      />
      <div className="font-[family-name:var(--font-mono)] text-[length:var(--font-micro)] text-accent-gold">
        Rewards: {quest.rewards}
      </div>
    </div>
  )
}

export function QuestPanel() {
  const activeQuests = MOCK_QUESTS.filter((q) => q.active)

  return (
    <GamePanel title={`Active Quests (${activeQuests.length})`}>
      {activeQuests.map((quest) => (
        <QuestCard key={quest.id} quest={quest} />
      ))}
    </GamePanel>
  )
}
