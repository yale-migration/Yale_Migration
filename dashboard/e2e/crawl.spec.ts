import { test, expect } from '@playwright/test'

/**
 * Click EVERYTHING and see what breaks.
 *
 * A link that 404s, a button that throws, a route that renders an error — none
 * of these fail a render test. They fail when the practice owner clicks them in
 * front of you.
 */

const ROLES = ['director', 'brisbane', 'townsville', 'client'] as const

for (const role of ROLES) {
  test(`${role}: every link on every reachable page resolves`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(`JS error: ${e.message}`))
    page.on('response', (r) => {
      if (r.status() >= 400 && !r.url().includes('/_next/')) {
        errors.push(`${r.status()} ${r.url()}`)
      }
    })

    const seen = new Set<string>()
    const queue = [`/dashboard?as=${role}`]

    while (queue.length && seen.size < 30) {
      const path = queue.shift()!
      if (seen.has(path)) continue
      seen.add(path)

      const res = await page.goto(path, { waitUntil: 'domcontentloaded' })
      expect(res?.status(), `${path} returned ${res?.status()}`).toBeLessThan(400)

      // Anything that rendered the error boundary is a failure, not a page.
      await expect(page.getByText('This did not load'),
        `${path} rendered the error boundary`).toHaveCount(0)

      const hrefs = await page.locator('a[href^="/"]').evaluateAll((as) =>
        as.map((a) => (a as HTMLAnchorElement).getAttribute('href')!))
      for (const h of hrefs) {
        const withRole = h.includes('as=') ? h : h + (h.includes('?') ? '&' : '?') + `as=${role}`
        if (!seen.has(withRole)) queue.push(withRole)
      }
    }

    expect(errors, `${role} hit: ${errors.join(' | ')}`).toEqual([])
    // ⚠️ A client correctly has exactly ONE page — their own file, with no nav
    // and nothing else to reach. Staff must reach several. Asserting ">1" for
    // everyone was the test being wrong, not the app.
    const floor = role === 'client' ? 1 : 3
    expect(seen.size, `${role} reached ${seen.size} page(s), expected at least ${floor}`)
      .toBeGreaterThanOrEqual(floor)
  })
}

test('every form control is labelled', async ({ page }) => {
  for (const path of ['/dashboard/clients', '/login']) {
    await page.goto(path)
    const unlabelled = await page.evaluate(() => {
      const bad: string[] = []
      for (const el of document.querySelectorAll('input, select, textarea')) {
        const id = el.getAttribute('id')
        const labelled = el.getAttribute('aria-label')
          || (id && document.querySelector(`label[for="${id}"]`))
          || el.closest('label')
        // A screen reader announcing "edit text, blank" is not a usable field.
        if (!labelled) bad.push(`${el.tagName}#${id ?? '(no id)'}`)
      }
      return bad
    })
    expect(unlabelled, `${path}: ${unlabelled.join(', ')}`).toEqual([])
  }
})

test('every page has its own title', async ({ page }) => {
  const titles = new Map<string, string>()
  for (const p of ['/dashboard', '/dashboard/clients', '/dashboard/enquiries',
                   '/dashboard/matter/YM-2026-00001', '/dashboard/branch/BRISBANE']) {
    await page.goto(p)
    titles.set(p, await page.title())
  }
  // Staff keep several tabs open on one client. Identical titles make them
  // guess, and guessing on a client file is how the wrong record gets edited.
  const unique = new Set(titles.values())
  expect(unique.size, `titles: ${[...titles].map(([k,v]) => `${k}="${v}"`).join(' | ')}`)
    .toBe(titles.size)
})

test('the back link on a client record actually goes back to the board', async ({ page }) => {
  await page.goto('/dashboard/matter/YM-2026-00001?as=director')
  await page.getByRole('link', { name: /Back to the board/ }).click()
  await expect(page).toHaveURL(/\/dashboard\?as=director$/)
})
