import { GamePanel } from '@/components/ui/game-panel'

export default function QueuePage() {
  return (
    <GamePanel title="Action Queue">
      <p className="py-8 text-center font-[family-name:var(--font-inter)] text-[length:var(--font-body)] text-text-tertiary italic">
        The queue is empty. Your hero idles, waiting for direction.
      </p>
      <div className="flex flex-col gap-2">
        <div className="rounded-[var(--panel-radius)] border border-border-subtle bg-bg-surface px-3 py-2">
          <span className="font-[family-name:var(--font-exo2)] text-[length:var(--font-stat)] text-text-secondary">
            Slot 1 — <span className="text-text-tertiary">Empty</span>
          </span>
        </div>
        <div className="rounded-[var(--panel-radius)] border border-border-subtle bg-bg-deep px-3 py-2">
          <span className="font-[family-name:var(--font-exo2)] text-[length:var(--font-stat)] text-text-secondary">
            Slot 2 — <span className="text-text-tertiary">Empty</span>
          </span>
        </div>
        <div className="rounded-[var(--panel-radius)] border border-border-subtle bg-bg-deep px-3 py-2">
          <span className="font-[family-name:var(--font-exo2)] text-[length:var(--font-stat)] text-text-secondary">
            Slot 3 — <span className="text-text-tertiary">Empty</span>
          </span>
        </div>
      </div>
    </GamePanel>
  )
}
