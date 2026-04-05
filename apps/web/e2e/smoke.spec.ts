import { test, expect } from '@playwright/test'

test.describe('Smoke tests', () => {
  test('homepage loads and renders', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/ChronoQueue/)
  })

  test('no console errors on initial load', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    expect(errors).toEqual([])
  })
})
