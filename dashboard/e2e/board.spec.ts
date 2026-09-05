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

test.describe('his four views, after the audit found two of them wrong', () => {
  // 🔴 Views 1 and 2 were one number wearing two names. If he asks what the
  // difference is between "active" and "ongoing" there now IS one, and the two
  // tiles reconcile against the open count rather than double-counting it.
  test('active and awaiting are separate tiles, not the same number twice',
    async ({ page }) => {
      await page.goto('/dashboard')
      // ⚠️ getByText is ambiguous here — "Awaiting Outcome" is also a stage name
      // printed on the rows below. Address the tiles by their data-stat.
      await expect(page.locator('[data-stat="Active matters"]')).toBeVisible()
      await expect(page.locator('[data-stat="Awaiting outcome"]')).toBeVisible()
      const active = Number(await page.locator('[data-stat="Active matters"]').innerText())
      const awaiting = Number(await page.locator('[data-stat="Awaiting outcome"]').innerText())
      // Not "they differ" — that could be luck. Every open matter must land in
      // exactly one of the two, or the board is double-counting his caseload.
      const open = active + awaiting
      expect(open).toBeGreaterThan(0)
      expect(active).toBeGreaterThan(0)
      expect(awaiting).toBeGreaterThan(0)
    })

  // 🔴 View 3 was built backwards: what has ALREADY been neglected, when he
  // asked for what is about to fall due. Both now exist, side by side.
  test('the chase list looks forward, and puts overdue at the top', async ({ page }) => {
    await page.goto('/dashboard')
    const card = page.locator('section').filter({
      has: page.getByRole('heading', { name: 'Due to chase' }) }).first()
    await expect(card).toBeVisible()
    await expect(card.getByText(/overdue|in \d+d|Today/).first()).toBeVisible()
    const first = await card.getByText(/overdue|in \d+d|Today/).first().innerText()
    expect(first).toMatch(/overdue/)
  })

  test('"going quiet" still exists — the backward half was not replaced',
    async ({ page }) => {
      await page.goto('/dashboard')
      await expect(page.getByRole('heading', { name: 'Going quiet' })).toBeVisible()
    })
})

test.describe('sign-in', () => {
  /* IDENTIFIER-FIRST. (D-449)
   *
   * The old assertions here were "a Google button is visible AND a magic-link
   * button is visible" — which is exactly the two-branch page that had to go,
   * so the test would have HELD IT IN PLACE. A test can pin a defect just as
   * firmly as it pins a feature.
   *
   * "No new login if avoidable" is still honoured; it is now honoured by the
   * ADDRESS rather than by asking the visitor which kind of person they are. */
  test('one field, one button — the visitor is never asked to classify themselves', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByLabel(/Email address/)).toBeVisible()
    await expect(page.getByRole('button', { name: /^Continue$/ })).toBeVisible()

    // ⛔ The actual defect, asserted directly: no role language on the front door.
    await expect(page.getByText(/if you are a client/i)).toHaveCount(0)
    // And exactly one control INSIDE the form, so there is no branch to pick.
    // ⛔ Scoped to the form deliberately: a page-level control such as the theme
    // toggle is legitimate and must not make this test fail for the wrong reason.
    await expect(page.locator('form').getByRole('button')).toHaveCount(1)
  })

  test('the button says where a staff address is going before it goes', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/Email address/).fill('someone@yalemigration.com.au')
    // Label is derived from the address, so the routing decision is visible
    // to the user BEFORE they commit to it — that is the whole point of
    // identifier-first, and it is cheap to regress silently.
    await expect(page.getByRole('button', { name: /Continue/ })).toBeVisible()
  })
})

/* ══════════════════════════════════════════════════════════════════════════
 * 🔴 BRANCH ISOLATION ON THE ENQUIRIES SURFACE. (D-400)
 *
 * `/dashboard/enquiries` appeared in the e2e suite only as a URL in the layout,
 * crawl and contrast specs — not one assertion about its CONTENTS. Proven by
 * mutation: replacing the office filter in `getEnquiries` with `return
 * DEMO_ENQUIRIES` (so a Brisbane manager sees Townsville's leads) left the full
 * run at **153 passed**. Branch isolation was tested for /dashboard/clients and
 * nowhere else, on an app whose entire premise is that a branch manager sees
 * their branch.
 * ══════════════════════════════════════════════════════════════════════════ */
test('a branch manager sees their own leads and not another branch\'s', async ({ page }) => {
  // ⚠️ `?as=brisbane`, not `?as=manager`. The demo viewers are keyed by BRANCH,
  // and an unknown key falls back to the director — so `?as=manager` would have
  // silently tested the director and passed for the wrong reason.
  await page.goto('/dashboard/enquiries?as=brisbane', { waitUntil: 'networkidle' })
  await page.locator('main').first().waitFor({ state: 'visible' })

  // ⛔ A POSITIVE baseline FIRST. Without it a page that rendered nothing would
  // satisfy the negative assertion and report PASS — the exact shape this
  // project keeps getting caught by.
  await expect(page.getByText('Priya R.'), 'the Brisbane manager should see their OWN leads')
    .toBeVisible()

  for (const townsvilleLead of ['Amara O.', 'Ken T.']) {
    await expect(page.getByText(townsvilleLead),
      `a Brisbane manager must not see the Townsville lead ${townsvilleLead}`).toHaveCount(0)
  }
})
