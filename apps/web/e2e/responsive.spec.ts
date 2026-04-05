import { test, expect } from '@playwright/test'

/**
 * Responsive layout verification tests.
 * Runs across all 7 viewport projects defined in playwright.config.ts.
 *
 * VOI-7 Section 3 verification checklist:
 *  1. No horizontal overflow
 *  2. Touch targets >= 44x44px on mobile/tablet
 *  3. All game text legible (min 14px on mobile)
 *  4. All screens reachable
 *  5. No layout shifts during gameplay updates
 */
test.describe('Responsive layout — all viewports', () => {
  test('no horizontal scrollbar on homepage', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })
    expect(hasHorizontalScroll).toBe(false)
  })

  test('minimum font size is 14px on mobile viewports', async ({ page, browserName }, testInfo) => {
    // Only enforce 14px minimum on mobile/tablet projects
    const mobileProjects = ['v1-phone-small', 'v2-phone-large', 'v3-phone-landscape', 'v4-tablet-portrait', 'v5-tablet-landscape']
    if (!mobileProjects.includes(testInfo.project.name)) {
      test.skip()
      return
    }

    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    const smallestFont = await page.evaluate(() => {
      const elements = document.querySelectorAll('body *')
      let smallest = Infinity
      for (const el of elements) {
        const style = window.getComputedStyle(el)
        if (el.textContent?.trim() && style.display !== 'none') {
          const size = parseFloat(style.fontSize)
          if (size < smallest) smallest = size
        }
      }
      return smallest
    })

    expect(smallestFont).toBeGreaterThanOrEqual(14)
  })
})
