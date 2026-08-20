import { test, expect } from '@playwright/test'

/**
 * What a person can actually DO, not what renders.
 *
 * Every assertion here is a click a consultant would make with someone on the
 * phone. The unit tests already cover the arithmetic; this covers whether the
 * arithmetic is reachable.
 */

test.describe('the board', () => {
  test('opens on what needs you, not on charts', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.getByRole('heading', { name: 'Practice Board' })).toBeVisible()
    // D-302: the answer to "what needs me today" comes before any chart.
    const needs = page.getByRole('heading', { name: 'Needs you today' })
    await expect(needs).toBeVisible()
    const needsBox = await needs.boundingBox()
    const stuck = await page.getByRole('heading', { name: 'Where matters are stuck' }).boundingBox()
    expect(needsBox!.y).toBeLessThan(stuck!.y)
  })

  test('every counted number opens the rows it counted', async ({ page }) => {
    await page.goto('/dashboard')
    const quiet = page.getByRole('link').filter({ hasText: 'GOING QUIET' })
    await expect(quiet).toBeVisible()
    const stated = Number((await quiet.innerText()).match(/\n(\d+)\n/)?.[1] ?? -1)
    await quiet.click()
    await expect(page).toHaveURL(/filter=quiet/)
    // 🔴 The tile and the list it opens must agree. If they drifted, a person
    // would see 2 here and 3 there and stop trusting both numbers.
    const shown = Number((await page.getByText(/of \d+ clients?$/).innerText()).match(/^(\d+)/)?.[1] ?? -2)
    expect(shown).toBe(stated)
  })

  test('an alert row reaches the client file', async ({ page }) => {
    await page.goto('/dashboard')
    await page.locator('a[href*="/dashboard/matter/"]')
      .filter({ hasText: 'E. TAN' }).first().click()
    await expect(page).toHaveURL(/\/dashboard\/matter\//)
    await expect(page.getByText('Documents outstanding')).toBeVisible()
  })

  test('the s56 tile scrolls to the deadlines rather than a page that repeats them',
    async ({ page }) => {
      await page.goto('/dashboard')
      await page.getByRole('link').filter({ hasText: 'SECTION 56 LIVE' }).click()
      await expect(page).toHaveURL(/#s56/)
      await expect(page.getByRole('heading', { name: /Section 56/ })).toBeInViewport()
    })
})

test.describe('the client record', () => {
  test('shows the ladder, and says why it is short on a 14-day letter', async ({ page }) => {
    await page.goto('/dashboard')
    await page.locator('a[href*="/dashboard/matter/"]')
      .filter({ hasText: 'E. TAN' }).first().click()
    await expect(page.getByText('Follow-up ladder')).toBeVisible()
    // Their history has 14-day requests. Rungs past the deadline are dropped,
    // and a consultant who knows the ladder as 7/14/21/26 must be told why.
    await expect(page.getByText(/allows 14 days, not 28/)).toBeVisible()
  })

  test('quotes the letter beside the computed date', async ({ page }) => {
    await page.goto('/dashboard')
    await page.locator('a[href*="/dashboard/matter/"]')
      .filter({ hasText: 'E. TAN' }).first().click()
    await expect(page.getByText(/You have 14 days starting on the day after/)).toBeVisible()
  })

  test('a code that does not exist reads the same as one you cannot see',
    async ({ page }) => {
      await page.goto('/dashboard/matter/YM-NOPE-9999')
      // 🔴 One message for both. Two would let anyone walk the code sequence and
      // learn how many clients the practice has.
      await expect(page.getByText('That file is not available')).toBeVisible()
      await expect(page.getByText(/does not exist, or it is not one you have access to/)).toBeVisible()
    })
})

test.describe('roles', () => {
  test('a manager never receives the other branch', async ({ page }) => {
    await page.goto('/dashboard/clients?as=brisbane')
    await expect(page.getByText(/BRISBANE only/)).toBeVisible()
    await expect(page.getByText('TOWNSVILLE')).toHaveCount(0)
  })

  test('a client sees their own file and no practice totals', async ({ page }) => {
    await page.goto('/dashboard?as=client')
    await expect(page.getByText('What we still need from you')).toBeVisible()
    await expect(page.getByText('Needs you today')).toHaveCount(0)
    await expect(page.getByText('Consultant workload')).toHaveCount(0)
    // ⛔ A Section 56 date is a legal instrument the RMA explains in person.
    await expect(page.getByText('Section 56')).toHaveCount(0)
  })

  test('a client is redirected away from the staff lists', async ({ page }) => {
    await page.goto('/dashboard/clients?as=client')
    await expect(page).toHaveURL(/\/dashboard\?as=client/)
  })

  test('the client portal never promises a decision date', async ({ page }) => {
    await page.goto('/dashboard?as=client')
    await expect(page.getByText(/we never quote a decision date/)).toBeVisible()
  })
})

test.describe('search', () => {
  test('finds by visa type, because callers lead with "it is about a 485"',
    async ({ page }) => {
      await page.goto('/dashboard/clients')
      await page.getByLabel('Search clients').fill('485')
      await expect(page.getByText(/^\d+ of \d+ clients?$/)).toBeVisible()
      await expect(page.getByRole('link', { name: /485/ }).first()).toBeVisible()
    })

  test('an empty result says which filter caused it', async ({ page }) => {
    await page.goto('/dashboard/clients')
    await page.getByLabel('Search clients').fill('zzzzzz')
    await expect(page.getByText(/No client matches/)).toBeVisible()
    await expect(page.getByText(/Try clearing a filter/)).toBeVisible()
  })
})
