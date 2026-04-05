import { GameLayout } from '@/components/layout/game-layout'

export default function GameRouteLayout({ children }: { children: React.ReactNode }) {
  return <GameLayout>{children}</GameLayout>
}
