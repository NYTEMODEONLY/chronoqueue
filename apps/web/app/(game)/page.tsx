import { AdventureLog } from '@/components/panels/adventure-log'
import { QuestPanel } from '@/components/panels/quest-panel'

export default function HomePage() {
  return (
    <div className="flex flex-col gap-[var(--panel-gap)] lg:grid lg:grid-cols-[1fr_260px]">
      <AdventureLog />
      <aside className="hidden lg:block">
        <QuestPanel />
      </aside>
    </div>
  )
}
