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

/**
 * 🔴 THE PRACTICE'S CLOCK, NOT THE SERVER'S. Brisbane, UTC+10, no DST. (D-397)
 *
 * Every page built `today` with a bare `new Date()`. Vercel functions run in
 * **UTC**, so for the first ten hours of every Brisbane working day — 08:00 to
 * 18:00 local, i.e. the entire working day — the server's calendar date was
 * still *yesterday*, and every day-count on the board was off by one:
 *
 *   · a follow-up due TODAY rendered as "in 1d"
 *   · one that was a day OVERDUE rendered as "Today"
 *   · a file 15 days quiet read as 14 and dropped OUT of Going quiet
 *   · a Section 56 internal deadline falling today rendered "1d internal"
 *   · an enquiry logged this morning was excluded from "last 7 days"
 *
 * The last two are the ones that matter: a statutory deadline shown as a day
 * further away than it is, and today's lead invisible on the lead board.
 *
 * ⛔ Returns LOCAL midnight of the Brisbane civil date, because `daysBetween`
 * parses its input as local midnight too — both sides must be in the same
 * frame or the subtraction is meaningless.
 */
export function brisbaneToday(now: Date = new Date()): Date {
  // en-CA gives YYYY-MM-DD, which is the format daysBetween already parses.
  const ymd = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Australia/Brisbane', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now)
  return new Date(ymd + 'T00:00:00')
}

/** The "updated at" stamp, in the reader's own timezone rather than the server's. */
export function brisbaneStamp(now: Date = new Date()): string {
  return now.toLocaleString('en-AU', {
    timeZone: 'Australia/Brisbane',
    day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit',
  })
}

export function daysBetween(from: string | null, to: Date): number | null {
  if (!from) return null
  const d = new Date(from + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return null
  return Math.floor((to.getTime() - d.getTime()) / 86_400_000)
}

/**
 * 🔴 Days from `to` UNTIL `from`. Null stays null — that is the whole point.
 *
 * Eight call sites used to write `daysUntil(x, today)`, which turns
 * "this date could not be parsed" into "**zero days from now**". And because
 * `-(null ?? 0)` is `-0`, not null, every downstream guard waved it through:
 * `-0 <= 14` is true, `-0 < 0` is false, and `` `${-0}d` `` prints "0d".
 *
 * So one malformed cell in a spreadsheet rendered a red **"Visa expiry · 0d"**
 * tile — top of the board, top of "Needs you today", and on the CLIENT portal
 * as *"Current visa expires · 0 days"*. An anxious person was told their visa
 * expires today because of a typo. (D-395)
 *
 * ⛔ Every caller must handle null. That is not friction; it is the requirement.
 */
export function daysUntil(from: string | null, to: Date): number | null {
  const behind = daysBetween(from, to)
  return behind === null ? null : -behind
}

/**
 * 🔴 Outcomes are compared CASE- AND WHITESPACE-INSENSITIVELY (D-395).
 *
 * `visa_outcome` is plain `text` with no CHECK constraint, and the sync's
 * `clean()` only trims — it never normalises case. So `'granted'` from the
 * sheet was not `'Granted'`: it fell out of the numerator while staying in the
 * denominator, and the board printed **"0% granted · 3 decided"** — the exact
 * sentence this file swears can never appear. It also made a granted matter
 * read as OPEN, so it was chased for follow-up forever.
 */
const norm = (v: string | null | undefined) => (v ?? '').trim().toLowerCase()

const OPEN_EXCLUDED = ['granted', 'refused', 'withdrawn']
export const isOpen = (m: Matter) => !OPEN_EXCLUDED.includes(norm(m.visa_outcome))

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
    .map((m) => ({ m, left: daysUntil(m.visa_expiry, today) }))
    .filter((x): x is { m: Matter; left: number } => x.left !== null && x.left <= within)
    .sort((a, b) => a.left - b.left)
}

const CLOSED_LEAD = ['not proceeding', 'lost lead', 'converted']
export const isLiveLead = (e: Enquiry) => !CLOSED_LEAD.includes(norm(e.status))

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
    if (!o || norm(o) === 'pending') continue      // undecided is not a result
    // Key on the normalised value so 'Granted' and 'granted ' are ONE row, and
    // display the tidy form rather than whichever spelling arrived first.
    const key = norm(o)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  const decided = [...counts.values()].reduce((a, b) => a + b, 0)
  const granted = counts.get('granted') ?? 0
  return {
    rows: [...counts.entries()]
      .map(([k, n]) => [k.charAt(0).toUpperCase() + k.slice(1), n] as [string, number])
      .sort((a, b) => b[1] - a[1]),
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
  /* 🔴 A NON-POSITIVE `days_allowed` IS MALFORMED, NOT A CRISIS. (D-400)
   * The column is a plain int with no CHECK and the sync passes it straight
   * through. `0` used to yield pct 100 and no rungs, and `-5` rendered the
   * emergency panel reading **"−5 days only."** Neither is a deadline; both are
   * a parse that went wrong, and they must read as unknown. */
  if (allowed <= 0) {
    return { placeable: false as const, elapsed, allowed, rungs: [], dropped: 0,
             pct: 0, internal: null }
  }

  /* 🔴 THE INTERNAL DEADLINE IS `allowed - 2`, NOT ALWAYS DAY 26. (D-400)
   *
   * The ladder is 7/14/21/26 because the standard letter is 28 days and their
   * SOP works to two days early (D-58). The component hardcoded `r === 26` as
   * "the internal deadline" — so on a 60-day letter it painted that label at
   * 43% of the track and then showed **34 days with no rung at all** before the
   * real deadline, with `dropped === 0` so the explanatory note never fired.
   * A consultant saw a confident, complete-looking ladder that was wrong.
   *
   * ⛔ And the filter was `r < allowed`, which on a 26-day letter kept day 21
   * and dropped day 26 while the copy said the dropped rung *"would fall after
   * the deadline"* — it falls ON the internal one. Bound to `internal`. */
  const internal = allowed - 2
  const rungs = [...new Set([...LADDER.filter((r) => r < internal), internal])]
    .sort((a, b) => a - b)
  return {
    placeable: true as const,
    elapsed,
    allowed,
    internal,
    rungs,
    // ⛔ STRICTLY greater. A standard 28-day letter has internal = 26, and 26 IS
    // a rung — counting it as dropped told the reader a step was missing when
    // the ladder was complete.
    dropped: LADDER.filter((r) => r > internal).length,
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

/**
 * View 3 — "1–2 week chase list", his words.
 *
 * 🔴 This was built BACKWARDS. What existed was `goingQuiet`: files with no
 * contact for OVER 14 days — a look at what has already been neglected. He
 * asked for the opposite: what falls due in the NEXT one to two weeks, so it
 * can be chased before it slips. Both are useful; only one is what he asked for,
 * and the missing one is the preventive half.
 *
 * Reads `next_due`, which the sync already carries and which nothing rendered.
 */
export function dueWithin(matters: Matter[], today: Date, days = 14) {
  return matters
    .filter(isOpen)
    .map((m) => ({ m, inDays: daysUntil(m.next_due, today) }))
    // Overdue included — a follow-up that has already slipped belongs at the top
    // of a chase list, not filtered out of it.
    .filter((x): x is { m: Matter; inDays: number } => x.inDays !== null && x.inDays <= days)
    .sort((a, b) => a.inDays - b.inDays)
}

/**
 * View 1 vs View 2 — "active matters" and "ongoing" were one concept wearing
 * two names, so if he asked what the difference was there wasn't one.
 *
 * Their own stage vocabulary already draws the line (D-51..56): a matter being
 * WORKED, versus one lodged and waiting on the Department. Nothing to do at all
 * on the second kind — which is exactly why they should not sit in one number.
 */
// ⛔ NORMALISED, like isOpen and isLiveLead. D-395 fixed those three and left
// these two case-SENSITIVE — a half-applied fix, which is worse than none,
// because the file now looks consistent. `'lodged'` from the sheet counted as
// ACTIVE ("being worked on now") instead of AWAITING ("sitting with the
// Department, nothing to do"), so a lodged file appeared on the team's own
// workload. And the test invariant "exactly one of the two" still passed,
// because it is satisfied by the wrong bucket just as well as the right one.
const AWAITING = ['lodged', 'awaiting outcome']
export const isActive   = (m: Matter) => isOpen(m) && !AWAITING.includes(norm(m.processing_stage))
export const isAwaiting = (m: Matter) => isOpen(m) &&  AWAITING.includes(norm(m.processing_stage))
