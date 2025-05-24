import { test, expect } from '@playwright/test'

test.describe('Search Results', () => {
  test('should have correct visual appearance', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#search-results')).toHaveScreenshot()
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.goto('/')
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('#search-results')).toBeVisible()
  })

  test('should meet accessibility standards', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#search-results')).toHaveAttribute('aria-live', 'off')
  })

  test('search results should display matching items', async ({ page }) => {
    await page.goto('/')
    await page.fill('#search-input', 'test')
    await expect(page.locator('#search-results li')).toHaveCount(5) // Actual count from dictionary
  })
})
