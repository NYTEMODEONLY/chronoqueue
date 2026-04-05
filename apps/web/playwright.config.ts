import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright configuration for ChronoQueue E2E and responsive testing.
 *
 * Viewport matrix from VOI-7 acceptance criteria (Section 3):
 *   V1: Phone small  — 375x667  (iPhone SE portrait)
 *   V2: Phone large  — 390x844  (iPhone 14 portrait)
 *   V3: Phone landscape — 844x390
 *   V4: Tablet portrait — 768x1024 (iPad)
 *   V5: Tablet landscape — 1024x768
 *   V6: Desktop small — 1280x720
 *   V7: Desktop large — 1920x1080
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'html',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    // --- Responsive viewport matrix (VOI-7 Section 3) ---
    {
      name: 'v1-phone-small',
      use: {
        ...devices['iPhone SE'],
        viewport: { width: 375, height: 667 },
      },
    },
    {
      name: 'v2-phone-large',
      use: {
        ...devices['iPhone 14'],
        viewport: { width: 390, height: 844 },
      },
    },
    {
      name: 'v3-phone-landscape',
      use: {
        ...devices['iPhone 14 landscape'],
        viewport: { width: 844, height: 390 },
      },
    },
    {
      name: 'v4-tablet-portrait',
      use: {
        ...devices['iPad (gen 7)'],
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: 'v5-tablet-landscape',
      use: {
        ...devices['iPad (gen 7) landscape'],
        viewport: { width: 1024, height: 768 },
      },
    },
    {
      name: 'v6-desktop-small',
      use: {
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'v7-desktop-large',
      use: {
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],

  webServer: process.env.CI
    ? undefined
    : {
        command: 'pnpm dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 30_000,
      },
})
