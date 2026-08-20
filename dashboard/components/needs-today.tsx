import type { ReactNode } from 'react'
import Link from 'next/link'
import type { Tone } from './primitives'

export interface Action {
  tone: Tone; count: number; title: string; detail: string
  /** Where this number lives. Omitted only when there is genuinely nowhere. */
  href?: string
}

/**
 * The band above everything else.
 *
 * D-302: competitor dashboards open on charts. A practice owner opens one to
 * find out what needs them TODAY, so that answer goes first and the charts go
 * below it. Order here is by consequence, not by count — a single missed
 * Section 56 outranks nine quiet files.
 */
export function NeedsToday({ actions }: { actions: Action[] }) {
  const total = actions.reduce((a, b) => a + b.count, 0)
  const N: Record<Tone, string> = {
    crit: 'text-[var(--crit)]', warn: 'text-[color-mix(in_srgb,var(--warn)_78%,var(--ink))]',
    good: 'text-[var(--good)]', neutral: 'text-ink-3', accent: 'text-[var(--accent)]',
  }
  return (
    <section className="border border-rule rounded-card bg-card overflow-hidden mt-4">
      <header className="flex items-baseline justify-between gap-3 px-4 pt-3.5 pb-3 border-b border-rule">
        <h2 className="text-[15px]">Needs you today</h2>
        <span className="text-xs text-ink-3">{actions.length ? `${total} items` : 'all clear'}</span>
      </header>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
        {actions.length === 0 ? (
          <div className="grid grid-cols-[auto_1fr] gap-3 items-start px-4 py-3.5 text-ink-3">
            <div className="font-serif text-[27px] leading-none">—</div>
            <div>
              <div className="text-[13.5px] font-semibold">Nothing needs chasing</div>
              {/* Says what was checked. "All clear" alone is not trustworthy. */}
              <div className="text-xs text-ink-3 mt-0.5">
                No Section 56 deadline inside a week, no visa expiring within 14 days,
                and no open file left quiet for 21 days.
              </div>
            </div>
          </div>
        ) : actions.map((a) => {
          const body = (
            <>
              <div className={`font-serif text-[27px] leading-none num ${N[a.tone]}`}>{a.count}</div>
              <div className="min-w-0">
                <div className="text-[13.5px] font-semibold flex items-center gap-1.5">
                  {a.title}
                  {a.href && (
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"
                         className="text-ink-3 shrink-0">
                      <path d="M6 3.5L10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.8"
                            strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <div className="text-xs text-ink-3 mt-0.5">{a.detail}</div>
              </div>
            </>
          )
          const cls = 'grid grid-cols-[auto_1fr] gap-3 items-start px-4 py-3.5 border-r border-rule '
            + 'last:border-r-0 max-[700px]:border-r-0 max-[700px]:border-b'
          // 🔑 These are the most urgent numbers on the screen. Leaving them as
          // text makes someone read "2 files have gone quiet" and then go and
          // find those two by hand — the exact work the band exists to remove.
          return a.href
            ? <Link key={a.title} href={a.href}
                    className={`${cls} transition-colors hover:bg-[var(--card-sunk)]
                                focus-visible:bg-[var(--card-sunk)]`}>{body}</Link>
            : <div key={a.title} className={cls}>{body}</div>
        })}
      </div>
    </section>
  )
}
