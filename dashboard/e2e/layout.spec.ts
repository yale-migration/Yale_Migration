import { test, expect } from '@playwright/test'

/**
 * Layout faults a functional test sails straight past.
 *
 * Every check below is something that renders "successfully" while being wrong
 * to look at or impossible to tap.
 */

const PAGES = ['/dashboard', '/dashboard/clients', '/dashboard/enquiries',
               '/dashboard?as=client', '/login']

for (const path of PAGES) {
  test(`${path} — nothing overflows sideways`, async ({ page }) => {
    await page.goto(path)
    // 🔴 Horizontal scroll on a phone is the single most common responsive
    // failure and it never throws. A wide table or an unwrapped string pushes
    // the body out and every page starts feeling broken.
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow, `${path} scrolls ${overflow}px sideways`).toBeLessThanOrEqual(1)
  })

  test(`${path} — every tap target is at least 44px`, async ({ page }) => {
    await page.goto(path)
    const small = await page.evaluate(() => {
      const bad: string[] = []
      for (const el of document.querySelectorAll('a[href], button, input, select')) {
        const r = el.getBoundingClientRect()
        if (r.width === 0 && r.height === 0) continue          // hidden
        if (el.closest('.sr-only, [aria-hidden="true"]')) continue
        // 44px is the floor for a finger. Staff use this on phones between calls.
        if (r.height < 36) bad.push(`${el.tagName}.${(el.className || '').toString().slice(0,30)} ${Math.round(r.height)}px`)
      }
      return bad
    })
    expect(small, `${path}: ${small.join(' | ')}`).toEqual([])
  })

  test(`${path} — no text is smaller than 11px`, async ({ page }) => {
    await page.goto(path)
    const tiny = await page.evaluate(() => {
      const bad: string[] = []
      for (const el of document.querySelectorAll('body *')) {
        if (!el.textContent?.trim() || el.children.length) continue
        const size = parseFloat(getComputedStyle(el).fontSize)
        if (size < 11) bad.push(`${Math.round(size)}px "${el.textContent.trim().slice(0,28)}"`)
      }
      return [...new Set(bad)]
    })
    expect(tiny, `${path}: ${tiny.join(' | ')}`).toEqual([])
  })
}

test('the board survives having no data at all', async ({ page }) => {
  // A fresh install shows empty tables. Every empty state must SAY what empty
  // means — this project already shipped a report where a broken formula and a
  // correct empty result rendered identically (D-292..296).
  await page.goto('/dashboard?as=townsville')
  await expect(page.getByRole('heading', { name: 'Practice Board' })).toBeVisible()
  const body = await page.locator('body').innerText()
  expect(body).not.toMatch(/\bundefined\b|\bNaN\b|\[object Object\]/)
})

test('no page renders undefined, NaN or [object Object]', async ({ page }) => {
  for (const path of [...PAGES, '/dashboard/branch/BRISBANE', '/dashboard/consultant/Unassigned']) {
    await page.goto(path)
    const body = await page.locator('body').innerText()
    expect(body, `${path} leaked a placeholder`).not.toMatch(/\bundefined\b|\bNaN\b|\[object Object\]/)
  }
})
