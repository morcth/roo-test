import { test, expect } from '@playwright/test'

test('Finds all valid permutations for "listen"', async ({ page }) => {
  await page.goto('/')
  const input = page.getByLabel('Search')
  await input.fill('listen')

  // Wait for results to load
  await expect(page.locator('#search-results li')).not.toHaveCount(0)

  // Collect all results from first page
  const allResults = await page.locator('#search-results li').allTextContents()

  // Collect results from all pages
  let nextButton = page.locator('button:has-text("Next")')
  while (!(await nextButton.isDisabled())) {
    await nextButton.click()
    await expect(page.locator('#search-results li')).not.toHaveCount(0)
    const pageResults = await page.locator('#search-results li').allTextContents()
    allResults.push(...pageResults)
    nextButton = page.locator('button:has-text("Next")') // Refresh locator
  }

  // Verify all expected permutations exist
  const expectedPermutations = ['silent', 'enlist', 'tinsel', 'inset', 'lines']
  for (const word of expectedPermutations) {
    expect(allResults).toContain(word)
  }

  // Verify input word is excluded
  expect(allResults).not.toContain('listen')
})
