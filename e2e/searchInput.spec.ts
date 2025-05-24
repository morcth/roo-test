import { test, expect } from '@playwright/test'

test('Rejects special characters in input', async ({ page }) => {
  await page.goto('/')
  const input = page.getByLabel('Search')

  // Test invalid characters
  await input.fill('test@123')
  const errorMessage = page.getByTestId('error-message')
  await expect(errorMessage).toBeVisible()
  await expect(errorMessage).toHaveText('Only alphanumeric characters allowed')
})

test('Valid input propagates to SearchResults', async ({ page }) => {
  await page.goto('/')
  const input = page.getByLabel('Search')

  // Test valid input
  await input.fill('valid123')

  // Wait for results to appear
  const results = page.locator('#search-results')
  await results.waitFor({ state: 'visible' })

  // Verify results container has content
  await expect(results.locator('li')).not.toHaveCount(0)
  await expect(results).toContainText('Results:')
})

test('Shows error message immediately on invalid input', async ({ page }) => {
  await page.goto('/')
  const input = page.getByLabel('Search')

  // Test invalid input
  await input.fill('invalid!')

  // Error should appear immediately
  const errorMessage = page.getByTestId('error-message')
  await expect(errorMessage).toBeVisible()
})
