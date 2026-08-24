import { test, expect } from '@playwright/test'

/**
 * 🔴 THE INVISIBLE-BUTTON CLASS.
 *
 * Dark mode once inverted `--navy` and the login hero rendered white on white:
 * an invisible heading and an invisible submit button, on the first screen a
 * client ever sees. Every functional test passed throughout — the button was
 * present, focusable and clickable. It simply could not be seen.
 *
 * ⛔ These tests exist because "renders successfully" and "is visible to a
 * human" are different claims, and only one of them was ever being checked.
 * They run in EVERY project, so light mode is held to the same bar.
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

const PAGES = ['/login', '/dashboard', '/dashboard/clients',
               '/dashboard/enquiries', '/dashboard?as=client']

/** WCAG relative luminance → contrast ratio. */
const RATIO = `(() => {
  const lum = (c) => {
    const [r, g, b] = c.map((v) => {
      v /= 255
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const parse = (s) => {
    const m = s.match(/rgba?\\(([^)]+)\\)/)
    if (!m) return null
    const p = m[1].split(',').map((x) => parseFloat(x))
    if (p.length > 3 && p[3] === 0) return null      // fully transparent
    return [p[0], p[1], p[2]]
  }
  // Walk up for the first non-transparent background — that is what the eye sees.
  const bgOf = (el) => {
    for (let n = el; n; n = n.parentElement) {
      const c = parse(getComputedStyle(n).backgroundColor)
      if (c) return c
    }
    return [255, 255, 255]
  }
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
    return (x + 0.05) / (y + 0.05)
  }
  return { parse, bgOf, ratio }
})()`

for (const path of PAGES) {
  test(`${path} — no text is invisible against its background`, async ({ page }) => {
    await open(page, path)
    const res = await page.evaluate(`(() => {
      const { parse, bgOf, ratio } = ${RATIO}
      const out = []
      let examined = 0
      for (const el of document.querySelectorAll('body *')) {
        const text = el.textContent?.trim()
        if (!text || el.children.length) continue
        examined++
        const cs = getComputedStyle(el)
        if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') continue
        const r = el.getBoundingClientRect()
        if (r.width === 0 || r.height === 0) continue
        const fg = parse(cs.color)
        if (!fg) continue
        const c = ratio(fg, bgOf(el))
        // 🔑 The bar is 1.6, not WCAG's 4.5. This is not an accessibility audit
        // — it is a tripwire for text that CANNOT BE READ AT ALL. A strict bar
        // would fire on every muted caption and be switched off within a week,
        // which is how a noisy gate becomes no gate.
        if (c < 1.6) out.push(Math.round(c * 100) / 100 + ':1 "' + text.slice(0, 30) + '"')
      }
      return { bad: [...new Set(out)], examined }
    })()`) as { bad: string[]; examined: number }
    // ⛔ A zero-element loop yields [] and passes. Proven: pointing this spec at
    // a page returning <></> gave 7/7 green, including the invisible-button
    // tripwire built for exactly that class. Assert we LOOKED. (D-399)
    expect(res.examined, `${path}: examined no text at all`).toBeGreaterThan(5)
    expect(res.bad, `${path}: ${res.bad.join(' | ')}`).toEqual([])
  })

  test(`${path} — every control is either readable or visibly a control`, async ({ page }) => {
    await open(page, path)
    const res = await page.evaluate(`(() => {
      const { parse, bgOf, ratio } = ${RATIO}
      const out = []
      let examined = 0
      for (const el of document.querySelectorAll('button, a[href], input[type=submit]')) {
        const r = el.getBoundingClientRect()
        if (r.width === 0 || r.height === 0) continue
        const cs = getComputedStyle(el)
        if (cs.visibility === 'hidden' || cs.opacity === '0') continue
        examined++
        const label = (el.textContent || el.value || '').trim()
        const fg = parse(cs.color)
        if (label) {
          // A labelled control is visible if its LABEL is readable. That is the
          // whole test. The invisible submit button failed exactly here: white
          // text on a white fill.
          if (fg && ratio(fg, parse(cs.backgroundColor) || bgOf(el)) < 1.6) {
            out.push('text "' + label.slice(0, 24) + '"')
          }
        } else {
          // No label at all — an icon-only control. It can only be seen by its
          // own fill or its border, so one of them has to exist.
          const own = parse(cs.backgroundColor)
          const filled = own && ratio(own, bgOf(el.parentElement || el)) >= 1.12
          if (!filled && parseFloat(cs.borderTopWidth) < 0.5) {
            out.push('unlabelled ' + el.tagName + '.' + String(el.className).slice(0, 20))
          }
        }
      }
      return { bad: [...new Set(out)], examined }
    })()`) as { bad: string[]; examined: number }
    expect(res.examined, `${path}: examined no controls at all`).toBeGreaterThan(0)
    expect(res.bad, `${path}: ${res.bad.join(' | ')}`).toEqual([])
  })
}

/* ⛔ WHY THERE IS NO "the fill must contrast with the page" ASSERTION.
 *
 * The first version had one, and it failed on every active nav pill: "Board",
 * "Clients", "Enquiries", "All", plus the Director/Client role badges — 9 of
 * the 13 failures on its first run. Every one was a FALSE POSITIVE. The active
 * pill is `bg-[var(--accent-soft)]` with `text-accent font-semibold`: it is
 * distinguished by bold accent-coloured text, which is a perfectly ordinary way
 * to show state and needs no fill contrast at all.
 *
 * 🔑 A noisy gate is the same failure as a blind one. Nine phantoms would have
 * had this spec deleted inside a week, and the one real defect it found — the
 * navy wordmark at 1.2:1 in dark mode — would have gone with it.
 */
