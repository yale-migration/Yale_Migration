import type { Matter, Enquiry, S56Deadline } from './types'

/**
 * Pure derivations. NO imports from Supabase, Next, or anything with I/O.
 *
 * 🔑 That constraint is the point. These functions decide what counts as
 * "going quiet", whether a visa has expired, what the grant rate is, and which
 * rungs of the follow-up ladder still apply — every one of them a judgement a
 * consultant will act on. While they lived alongside the query layer they could
 * not be tested without mocking a database, so they never were.
 */

export function daysBetween(from: string | null, to: Date): number | null {
  if (!from) return null
  const d = new Date(from + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return null
  return Math.floor((to.getTime() - d.getTime()) / 86_400_000)
}

const OPEN_EXCLUDED = ['Granted', 'Refused', 'Withdrawn']
export const isOpen = (m: Matter) => !OPEN_EXCLUDED.includes(m.visa_outcome ?? '')

/** Open files with no contact for over `threshold` days. */
export function goingQuiet(matters: Matter[], today: Date, threshold = 14) {
  return matters
    .filter(isOpen)
    .map((m) => ({ m, days: daysBetween(m.last_contact, today) }))
    .filter((x): x is { m: Matter; days: number } => x.days !== null && x.days > threshold)
    .sort((a, b) => b.days - a.days)
}

/** Visas expiring within `within` days. Negative = already expired, still listed. */
export function expiringSoon(matters: Matter[], today: Date, within = 60) {
  return matters
    .filter(isOpen)
    .map((m) => ({ m, left: m.visa_expiry ? -(daysBetween(m.visa_expiry, today) ?? 0) : null }))
    .filter((x): x is { m: Matter; left: number } => x.left !== null && x.left <= within)
    .sort((a, b) => a.left - b.left)
}

const CLOSED_LEAD = ['Not Proceeding', 'Lost Lead', 'Converted']
export const isLiveLead = (e: Enquiry) => !CLOSED_LEAD.includes(e.status ?? '')

export function recentEnquiries(rows: Enquiry[], today: Date, days = 7) {
  return rows.filter((e) => {
    const d = daysBetween(e.enquiry_date, today)
    return d !== null && d >= 0 && d <= days
  })
}

/** View 4 — granted vs refused. */
export function outcomes(matters: Matter[]) {
  const counts = new Map<string, number>()
  for (const m of matters) {
    const o = m.visa_outcome
    if (!o || o === 'Pending') continue      // undecided is not a result
    counts.set(o, (counts.get(o) ?? 0) + 1)
  }
  const decided = [...counts.values()].reduce((a, b) => a + b, 0)
  const granted = counts.get('Granted') ?? 0
  return {
    rows: [...counts.entries()].sort((a, b) => b[1] - a[1]),
    decided,
    granted,
    // ⚠️ null, NEVER 0. A practice that has decided nothing has no grant rate,
    // and "0% granted" printed on their own board is a libel on their numbers.
    rate: decided > 0 ? Math.round((granted / decided) * 100) : null,
  }
}

/**
 * The s56 follow-up ladder (D-58): day 7, 14, 21, 26 from the letter date.
 *
 * 🔴 Calibrated for a 28-day letter. Their history contains 14-day requests, on
 * which rungs 21 and 26 land AFTER the legal deadline — chasing then would be
 * chasing after the Department had already decided. Rungs past the allowance
 * are dropped, and `dropped` is reported so the UI can say why rather than
 * appearing to have lost them.
 */
export const LADDER = [7, 14, 21, 26] as const

export function ladderFor(d: Pick<S56Deadline, 'letter_date' | 'days_allowed'>, today: Date) {
  const elapsed = daysBetween(d.letter_date, today)
  const allowed = d.days_allowed
  if (elapsed === null || allowed == null) {
    return { placeable: false as const, elapsed, allowed, rungs: [], dropped: 0, pct: 0 }
  }
  const rungs = LADDER.filter((r) => r < allowed)
  return {
    placeable: true as const,
    elapsed,
    allowed,
    rungs,
    dropped: LADDER.length - rungs.length,
    pct: Math.min(100, Math.max(0, (elapsed / allowed) * 100)),
  }
}

/**
 * The ONE date format. Four different shapes were rendering at once, including
 * raw ISO strings straight out of the column, on a board a practice owner reads.
 */
export function fmtDate(d: string | null | undefined): string {
  if (!d) return '—'
  const dt = new Date(d.length <= 10 ? d + 'T00:00:00' : d)
  if (Number.isNaN(dt.getTime())) return '—'
  return dt.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}
