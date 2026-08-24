import { test, expect } from '@playwright/test'

/**
 * Layout faults a functional test sails straight past.
 *
 * Every check below is something that renders "successfully" while being wrong
 * to look at or impossible to tap.
 */

/**
 * 🔴 GO TO THE PAGE, NOT ITS SKELETON. (D-399)
 *
 * `page.goto(path)` resolves on `load`, and every dashboard route is
 * `force-dynamic` with a `loading.tsx`. So at that moment the DOM is the
 * SKELETON — no links, no buttons, no real text. Every layout and contrast
 * check here has been measuring a placeholder, and passing, because a skeleton
 * has no small tap targets and no unreadable copy.
 *
 * It only surfaced once the specs were made to assert they had examined
 * something: `/dashboard/clients` reported **0 controls** on a page that has 17.
 */
async function open(page: import('@playwright/test').Page, path: string) {
  await page.goto(path, { waitUntil: 'networkidle' })
  // The skeletons carry role="status"; the real page does not.
  await page.locator('main').first().waitFor({ state: 'visible' })
}

const PAGES = ['/dashboard', '/dashboard/clients', '/dashboard/enquiries',
               '/dashboard?as=client', '/login']

for (const path of PAGES) {
  test(`${path} — nothing overflows sideways`, async ({ page }) => {
    await open(page, path)
    // 🔴 Horizontal scroll on a phone is the single most common responsive
    // failure and it never throws. A wide table or an unwrapped string pushes
    // the body out and every page starts feeling broken.
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow, `${path} scrolls ${overflow}px sideways`).toBeLessThanOrEqual(1)
  })

  test(`${path} — every tap target is at least 36px`, async ({ page }) => {
    await open(page, path)
    const small = await page.evaluate(() => {
      const bad: string[] = []
      let examined = 0
      for (const el of document.querySelectorAll('a[href], button, input, select')) {
        const r = el.getBoundingClientRect()
        if (r.width === 0 && r.height === 0) continue          // hidden
        if (el.closest('.sr-only, [aria-hidden="true"]')) continue
        examined++
        // ⚠️ The title said 44px and this said 36. 44 is Apple's guideline;
        // 36 is what this build actually holds itself to, and a test whose name
        // overstates its own threshold is worse than one that admits it. The
        // NAME now matches the number. (D-399)
        if (r.height < 36) bad.push(`${el.tagName}.${(el.className || '').toString().slice(0,30)} ${Math.round(r.height)}px`)
      }
      return { bad, examined }
    })
    // ⛔ Zero controls ⇒ [] ⇒ pass. Assert we actually looked. (D-399)
    expect(small.examined, `${path}: found no controls at all`).toBeGreaterThan(0)
    expect(small.bad, `${path}: ${small.bad.join(' | ')}`).toEqual([])
  })

  test(`${path} — no text is smaller than 11px`, async ({ page }) => {
    await open(page, path)
    const tiny = await page.evaluate(() => {
      const bad: string[] = []
      let examined = 0
      for (const el of document.querySelectorAll('body *')) {
        if (!el.textContent?.trim() || el.children.length) continue
        examined++
        const size = parseFloat(getComputedStyle(el).fontSize)
        if (size < 11) bad.push(`${Math.round(size)}px "${el.textContent.trim().slice(0,28)}"`)
      }
      return { bad: [...new Set(bad)], examined }
    })
    expect(tiny.examined, `${path}: found no text at all`).toBeGreaterThan(5)
    expect(tiny.bad, `${path}: ${tiny.bad.join(' | ')}`).toEqual([])
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
    await open(page, path)
    const body = await page.locator('body').innerText()
    expect(body, `${path} leaked a placeholder`).not.toMatch(/\bundefined\b|\bNaN\b|\[object Object\]/)
  }
})
