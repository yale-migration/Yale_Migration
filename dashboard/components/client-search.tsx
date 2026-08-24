'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Chip, type Tone } from './primitives'
import type { Matter } from '@/lib/data/types'
import { daysBetween, daysUntil } from '@/lib/data/derive'

/**
 * The full client list, with search.
 *
 * 🔑 WHY THIS EXISTS. Until now a client could only be reached through an alert
 * list — going quiet, expiring, a live deadline. So the only findable people
 * were the ones already in trouble. If someone rings whose file is perfectly
 * healthy, there was no way to open it at all. That is the same mid-call lookup
 * M7 solves in the sheet, and the reason their SOP has a 3-ring answer target.
 *
 * ⚠️ Filtering happens in the browser over rows the SERVER already scoped. It
 * is convenience, not access control — the list never contains a row RLS did
 * not return, so a filter cannot leak one.
 */
export type ClientFilter = 'all' | 'open' | 'owing' | 'quiet' | 'expiring'

/* ⛔ `today` is REQUIRED. It used to default to `new Date()`, which — because
   this is a client component — was evaluated in the VISITOR'S browser, while
   the stat tiles directly above it were computed on the server. Two clocks,
   ten hours apart, on one screen: the "Going quiet" tile said 8 and the list it
   opened shaded 9. Making it required means a page cannot forget it. (D-397) */
export function ClientSearch({ matters, as, initial = 'all', today }: {
  matters: Matter[]; as?: string; initial?: ClientFilter; today: Date
}) {
  const [q, setQ] = useState('')
  const [office, setOffice] = useState<string>('all')
  // Seeded from the URL so a tile on the board lands you on the list it counted.
  // A number you cannot click is a number you have to go and find by hand.
  const [only, setOnly] = useState<ClientFilter>(initial)

  const offices = useMemo(
    () => [...new Set(matters.map((m) => m.office))].sort(), [matters])

  const shown = useMemo(() => {
    // Normalise both sides: their data carries mixed case and stray spaces, and
    // someone typing "nguyen" must find "A. NGUYEN".
    const needle = q.trim().toLowerCase()
    return matters.filter((m) => {
      if (office !== 'all' && m.office !== office) return false
      const open = !['Granted','Refused','Withdrawn'].includes(m.visa_outcome ?? '')
      if (only === 'open' && !open) return false
      if (only === 'owing' && !m.docs_outstanding) return false
      // ⚠️ These reuse the SAME thresholds as the board's cards. If they drifted,
      // a tile would say 2 and the list it opens would show 3, and the person
      // would stop trusting both numbers.
      if (only === 'quiet') {
        const d = daysBetween(m.last_contact, today)
        if (!open || d === null || d <= 14) return false
      }
      if (only === 'expiring') {
        const left = daysUntil(m.visa_expiry, today)
        if (!open || left === null || left > 60) return false
      }
      if (!needle) return true
      // Search everything a person on the phone might say: name, code, visa,
      // consultant. Not just the name — half the time they lead with "it's
      // about a 485".
      return [m.full_name, m.client_code, m.visa_type, m.consultant, m.processing_stage]
        .some((f) => (f ?? '').toLowerCase().includes(needle))
    })
  }, [matters, q, office, only])

  const href = (code: string) =>
    `/dashboard/matter/${encodeURIComponent(code)}${as ? `?as=${as}` : ''}`

  const stageTone = (m: Matter): Tone =>
    m.visa_outcome === 'Granted' ? 'good'
    : m.visa_outcome === 'Refused' ? 'crit'
    : m.docs_outstanding ? 'warn' : 'neutral'

  return (
    <>
      <div className="flex flex-wrap gap-2.5 items-center mb-3.5">
        <div className="relative flex-1 min-w-[220px]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
               className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3">
            <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            value={q} onChange={(e) => setQ(e.target.value)} type="search"
            placeholder="Name, client code, visa type or consultant"
            aria-label="Search clients"
            className="w-full min-h-[44px] pl-10 pr-3.5 rounded-xl border border-rule bg-card
                       text-[14px] focus:outline-none focus:border-[var(--accent)]
                       focus:ring-4 focus:ring-[var(--accent)]/10"
          />
        </div>
        <select value={office} onChange={(e) => setOffice(e.target.value)} aria-label="Office"
          className="min-h-[44px] px-3 rounded-xl border border-rule bg-card text-[14px]
                     focus:outline-none focus:border-[var(--accent)]
                     focus:ring-4 focus:ring-[var(--accent)]/10">
          <option value="all">All offices</option>
          {offices.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <div className="flex bg-card-sunk border border-rule rounded-xl p-[3px] gap-0.5">
          {([['all','All'],['open','Open'],['owing','Owing docs'],
             ['quiet','Going quiet'],['expiring','Expiring']] as const).map(([k, label]) => (
            <button key={k} type="button" onClick={() => setOnly(k)} aria-pressed={only === k}
              className={`text-[13px] px-3 min-h-[44px] rounded-lg whitespace-nowrap
                ${only === k ? 'bg-card text-accent font-semibold shadow-card'
                            : 'text-ink-2 hover:text-ink font-medium'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-[12.5px] text-ink-3 mb-2.5" aria-live="polite">
        {shown.length} of {matters.length} {matters.length === 1 ? 'client' : 'clients'}
      </p>

      <div className="bg-card border border-rule rounded-card overflow-hidden">
        {shown.length === 0 ? (
          // 🔴 Says which filter is responsible. "No results" leaves the person
          // to work out whether they mistyped or the practice has nobody.
          <p className="py-10 text-center text-[13px] text-ink-3 px-6">
            No client matches {q ? <>“<b className="text-ink">{q}</b>”</> : 'these filters'}
            {office !== 'all' && <> in {office}</>}
            {only !== 'all' && <> ({({open:'open matters', owing:'owing documents',
              quiet:'gone quiet', expiring:'expiring soon', all:''})[only]})</>}.
            {' '}Try clearing a filter.
          </p>
        ) : shown.map((m) => (
          <Link key={m.client_code} href={href(m.client_code)}
                className="grid grid-cols-[3px_1fr_auto_15px] gap-3 items-center px-4 min-h-[56px] py-2.5
                           border-b border-rule last:border-b-0 transition-colors
                           hover:bg-[var(--card-sunk)] focus-visible:bg-[var(--card-sunk)]">
            <span className={`w-[3px] h-7 rounded-sm ${
              stageTone(m)==='good' ? 'bg-[var(--good)]' : stageTone(m)==='crit' ? 'bg-[var(--crit)]'
              : stageTone(m)==='warn' ? 'bg-[var(--warn)]' : 'bg-[var(--rule-strong)]'}`}
              aria-hidden="true" />
            <div className="min-w-0">
              <div className="text-[14px] font-medium truncate">
                {m.full_name} <span className="text-ink-3 font-normal num">· {m.client_code}</span>
              </div>
              <div className="text-[12px] text-ink-3 truncate">
                {m.visa_type ?? '—'} · {m.office} ·{' '}
                <span className={m.consultant ? '' : 'text-[var(--crit)] font-medium'}>
                  {m.consultant ?? 'Unassigned'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {m.docs_outstanding && (
                <Chip tone="warn">
                  {/* ⛔ `.trim()` matches the matter page, which always trimmed. Without
                      it "Bank statements, , Police check" counted 3 here and 2 there —
                      the list and the file disagreeing about the same client. And the
                      count is pluralised: it read "1 docs". (D-400) */}
                  {(() => {
                    const n = m.docs_outstanding.split(',').map((x) => x.trim()).filter(Boolean).length
                    return `${n} ${n === 1 ? 'doc' : 'docs'}`
                  })()}
                </Chip>
              )}
              <span className="text-[12px] text-ink-3 hidden sm:inline">{m.processing_stage ?? '—'}</span>
            </div>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"
                 className="text-ink-3">
              <path d="M6 3.5L10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.6"
                    strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        ))}
      </div>
    </>
  )
}
