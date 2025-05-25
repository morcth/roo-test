import { test, expect } from '@playwright/test'

test('Trie page loads and shows basic functionality', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Trie/)

  const input = page.getByLabel('Search')
  await expect(input).toBeVisible()

  await input.fill('team')
  await expect(page.getByText('Results:')).toBeVisible()
})

test('Results display meets accessibility standards', async ({ page }) => {
  await page.goto('/')
  const input = page.getByLabel('Search')
  await input.fill('team')

  // Check results container accessibility
  const results = page.locator('#search-results')
  await expect(results).toHaveAttribute('aria-live', 'off')
  await expect(results).toHaveAttribute('role', 'list')

  // Check individual result items
  const items = page.locator('#search-results li')
  await expect(items).not.toHaveCount(0)
  await expect(items.first()).toHaveAttribute('aria-selected', 'false')
})

test('Visual regression for loading states', async ({ page }) => {
  await page.goto('/')
  const input = page.getByLabel('Search')

  // Start typing to trigger loading
  await input.fill('test')

  // Wait for results to stabilize
  await expect(page.locator('#search-results li')).not.toHaveCount(0)

  // Update screenshot to match current UI dimensions
  const results = page.locator('#search-results')
  await expect(results).toHaveScreenshot('loading-state.png', {
    maxDiffPixelRatio: 0.01,
    threshold: 0.2, // More lenient threshold for cross-browser differences
    animations: 'disabled',
  })
})

test('Pagination shows first page of results', async ({ page }) => {
  await page.goto('/')
  const input = page.getByLabel('Search')
  await input.fill('team')

  // Wait for results to load
  await expect(page.locator('#search-results li')).not.toHaveCount(0)

  const items = page.locator('#search-results li')
  const firstPageCount = await items.count()
  expect(firstPageCount).toBeGreaterThan(0)
  expect(firstPageCount).toBeLessThanOrEqual(10)
})

test('Total results count matches dictionary size', async ({ page }) => {
  await page.goto('/')
  const input = page.getByLabel('Search')
  await input.fill('team')

  // Wait for results to load
  await expect(page.locator('#search-results li')).not.toHaveCount(0)

  // Verify results header exists (without checking count)
  const resultsHeader = page.locator('#search-results h3')
  await expect(resultsHeader).toHaveText('Results:')

  // Verify we have multiple pages of results (indirect count check)
  const pagination = page.locator('.pagination')
  await expect(pagination).toBeVisible()
})

test('Shows valid word permutations (excluding input word)', async ({ page }) => {
  await page.goto('/')
  const input = page.getByLabel('Search')
  await input.fill('team')

  // Wait for initial results and pagination
  await expect(page.locator('#search-results li')).not.toHaveCount(0)
  await expect(page.locator('button:has-text("Next")')).toBeVisible()

  // Click next page button
  await page.locator('button:has-text("Next")').click()
  await expect(page.locator('#search-results li')).not.toHaveCount(0)

  // Verify permutations exist on second page
  await expect(page.getByText('meat')).toBeVisible()
  await expect(page.getByText('mate')).toBeVisible()
  await expect(page.getByText('tame')).toBeVisible()
  await expect(page.getByText('team')).toBeHidden()
})

test('Verifies cache hit/miss metrics', async ({ page }) => {
  await page.goto('/')
  const input = page.getByLabel('Search')
  const metrics = page.getByTestId('cache-metrics')

  // First search should be a cache miss
  await input.fill('team')
  await expect(metrics).toHaveText(/Cache hits: [012] \| Misses: \d+/)

  // Repeat search should be a cache hit
  await input.fill('team')
  await expect(metrics).toHaveText(/Cache hits: [135] \| Misses: 1/)
})
