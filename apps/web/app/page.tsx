export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight text-[var(--color-accent)]">
          ChronoQueue
        </h1>
        <p className="mb-8 text-lg text-[var(--color-text-secondary)]">
          Time is your greatest weapon.
        </p>
        <div className="rounded-lg border border-[var(--color-bg-card)] bg-[var(--color-bg-secondary)] p-6">
          <p className="font-mono text-sm text-[var(--color-text-secondary)]">
            {'>'} Initializing game systems...
          </p>
        </div>
      </div>
    </main>
  )
}
