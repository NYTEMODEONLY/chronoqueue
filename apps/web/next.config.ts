import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@chronoqueue/db', '@chronoqueue/game-engine'],
}

export default nextConfig
