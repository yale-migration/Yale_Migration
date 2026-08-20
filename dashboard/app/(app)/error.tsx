'use client'
import Link from 'next/link'

/**
 * 🔴 What a query failure looks like to a human.
 *
 * The data layer THROWS rather than returning [] — deliberately, because "no
 * clients" and "the query failed" must never look identical to a branch
 * manager. That decision only pays off if the throw lands somewhere that says
 * so. Without this file it lands on a white screen in production.
 *
 * ⛔ The raw message is not shown. It can carry column names, table names and
 * fragments of a policy — none of which helps the person reading it, and all of
 * which helps someone probing the app.
 */
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main id="main" className="max-w-[560px] mx-auto px-5 py-20">
      <div className="w-11 h-11 rounded-xl grid place-items-center mb-5"
           style={{ background: 'var(--crit-soft)' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 8v5M12 16.2v.1" stroke="var(--crit)" strokeWidth="1.9"
                strokeLinecap="round" />
          <circle cx="12" cy="12" r="9" stroke="var(--crit)" strokeWidth="1.7" />
        </svg>
      </div>
      <h1 className="text-[24px]">This did not load</h1>
      <p className="text-[14px] text-ink-2 mt-2.5 leading-relaxed">
        Something went wrong fetching your data. Nothing has been changed — this board only ever
        reads, so a failure here cannot affect a client file.
      </p>
      <div className="flex flex-wrap gap-2.5 mt-6">
        <button onClick={reset}
          className="min-h-[46px] px-5 rounded-xl text-white font-semibold text-[14.5px] transition-opacity hover:opacity-90 active:opacity-80"
          style={{ background: 'var(--accent)' }}>
          Try again
        </button>
        <Link href="/dashboard"
          className="min-h-[46px] px-5 rounded-xl border border-rule-strong bg-card
                     text-accent font-semibold text-[14.5px] flex items-center
                     transition-colors hover:bg-[var(--card-sunk)]">
          Back to the board
        </Link>
      </div>
      <p className="text-[12px] text-ink-3 mt-8 pt-5 border-t border-rule">
        If it keeps happening, tell your Yale contact what you were looking at.
      </p>
    </main>
  )
}
