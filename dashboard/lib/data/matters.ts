import { createClient } from '@/lib/supabase/server'
import { isLive } from '@/lib/supabase/config'
import { DEMO_MATTERS, DEMO_S56, DEMO_ENQUIRIES } from './fixtures'
import type { Matter, S56Deadline, Viewer, Enquiry } from './types'

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔴 READ THIS BEFORE CHANGING ANYTHING HERE.
 *
 * IN LIVE MODE THIS FILE APPLIES NO ACCESS CONTROL AND MUST NOT.
 *
 * The queries below are deliberately unfiltered — `select * from matters` with
 * no `where office = …`. That is not an oversight. Postgres RLS decides which
 * rows come back, and it decides for every caller including one that bypasses
 * this file entirely.
 *
 * ⛔ Adding a `.eq('office', viewer.office)` here would be actively harmful:
 * it would make the app APPEAR to enforce access, so the next person to read it
 * assumes the filtering lives in TypeScript — and a route that forgets it, or a
 * leaked anon key, silently returns everything. A control that can be forgotten
 * is not a control.
 *
 * The demo branch filters in memory because there is no database to enforce
 * anything. That filtering is a STAGE PROP, not a security boundary, and it is
 * marked as such below so nobody mistakes one for the other.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** ⚠️ DEMO ONLY. Imitates what RLS does for real. Never a security boundary. */
function demoScope<T extends { office: string; client_code?: string | null }>(
  rows: T[], viewer: Viewer,
): T[] {
  if (viewer.role === 'director') return rows
  if (viewer.role === 'manager') return rows.filter((r) => r.office === viewer.office)
  return rows.filter((r) => r.client_code === viewer.clientCode)
}

export async function getMatters(viewer: Viewer): Promise<Matter[]> {
  if (!isLive()) return demoScope(DEMO_MATTERS, viewer)

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('matters')
    .select('client_code, full_name, office, team, consultant, visa_type, processing_stage, visa_outcome, visa_expiry, last_contact, next_due, docs_outstanding')
    .order('next_due', { ascending: true, nullsFirst: false })

  // 🔴 Throw. Returning [] on error renders "no clients" — indistinguishable
  // from a real empty practice, and a manager would believe it.
  if (error) throw new Error(`matters query failed: ${error.message}`)
  return (data ?? []) as Matter[]
}

export async function getS56Deadlines(viewer: Viewer): Promise<S56Deadline[]> {
  // ⚠️ Clients are never shown a Section 56 deadline. RLS enforces this too —
  // the check here is so the UI does not even render a card it would then find
  // empty, which reads as "you have no deadlines" rather than "not shown here".
  if (viewer.role === 'client') return []
  if (!isLive()) return demoScope(DEMO_S56, viewer)

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('s56_deadlines')
    .select('id, client_code, client_name, office, subclass, letter_date, days_allowed, due_date_legal, due_date_internal, deadline_sentence, needs_review')
    .order('due_date_internal', { ascending: true, nullsFirst: false })

  if (error) throw new Error(`s56 query failed: ${error.message}`)
  return (data ?? []) as S56Deadline[]
}

// ── derived views ──────────────────────────────────────────────────────────
// Computed from the rows the caller was ALLOWED to see, never from a wider set.
// A count computed before filtering is how a manager learns how many clients
// the other branch has.

const OPEN_EXCLUDED = ['Granted', 'Refused', 'Withdrawn']
export const isOpen = (m: Matter) => !OPEN_EXCLUDED.includes(m.visa_outcome ?? '')

export function daysBetween(from: string | null, to: Date): number | null {
  if (!from) return null
  const d = new Date(from + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return null
  return Math.floor((to.getTime() - d.getTime()) / 86_400_000)
}

/** Files with no contact for over `threshold` days. Open matters only. */
export function goingQuiet(matters: Matter[], today: Date, threshold = 14) {
  return matters
    .filter(isOpen)
    .map((m) => ({ m, days: daysBetween(m.last_contact, today) }))
    .filter((x): x is { m: Matter; days: number } => x.days !== null && x.days > threshold)
    .sort((a, b) => b.days - a.days)
}

/** Visas expiring within `within` days. Negative = already expired, still shown. */
export function expiringSoon(matters: Matter[], today: Date, within = 60) {
  return matters
    .filter(isOpen)
    .map((m) => ({ m, left: m.visa_expiry ? -(daysBetween(m.visa_expiry, today) ?? 0) : null }))
    .filter((x): x is { m: Matter; left: number } => x.left !== null && x.left <= within)
    .sort((a, b) => a.left - b.left)
}

/**
 * One matter, by code.
 *
 * 🔴 THE SECURITY PROPERTY IS THAT THIS LOOKS IDENTICAL WHEN THE ROW DOES NOT
 * EXIST AND WHEN YOU ARE NOT ALLOWED TO SEE IT. Both return null.
 *
 * RLS gives us that for free — a row you cannot read simply is not returned —
 * and the page must not undo it by saying "no such client" versus "not
 * permitted". The difference between those two messages is an enumeration
 * oracle: walk YM-2026-00001 upward and the error text tells you exactly how
 * many clients the practice has and which codes are real.
 */
export async function getMatter(code: string, viewer: Viewer): Promise<Matter | null> {
  if (!isLive()) {
    const rows = demoScope(DEMO_MATTERS, viewer)
    return rows.find((m) => m.client_code === code) ?? null
  }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('matters')
    .select('client_code, full_name, office, team, consultant, visa_type, processing_stage, visa_outcome, visa_expiry, last_contact, next_due, docs_outstanding')
    .eq('client_code', code)
    .maybeSingle()

  if (error) throw new Error(`matter query failed: ${error.message}`)
  return (data as Matter | null) ?? null
}

/** Deadlines for one matter. Staff only — same rule as the list. */
export async function getMatterS56(code: string, viewer: Viewer): Promise<S56Deadline[]> {
  if (viewer.role === 'client') return []
  const all = await getS56Deadlines(viewer)
  return all.filter((d) => d.client_code === code)
}

/**
 * Enquiries — leads, not clients.
 *
 * ⛔ Clients never see this. There is no client RLS policy on the table at all,
 * and this returns early so the UI does not render a card it would then find
 * empty — "you have no enquiries" is a different statement from "not shown".
 */
export async function getEnquiries(viewer: Viewer): Promise<Enquiry[]> {
  if (viewer.role === 'client') return []
  if (!isLive()) {
    return viewer.role === 'director'
      ? DEMO_ENQUIRIES
      : DEMO_ENQUIRIES.filter((e) => e.office === viewer.office)
  }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('enquiries')
    .select('id, enquiry_date, name, phone, email, channel, visa_interest, office, assigned_to, status, follow_up_due, last_contact')
    .order('enquiry_date', { ascending: false, nullsFirst: false })

  if (error) throw new Error(`enquiries query failed: ${error.message}`)
  return (data ?? []) as Enquiry[]
}

/** Enquiries received in the last `days`. View 7 of the seven he named. */
export function recentEnquiries(rows: Enquiry[], today: Date, days = 7) {
  return rows.filter((e) => {
    const d = daysBetween(e.enquiry_date, today)
    return d !== null && d <= days && d >= 0
  })
}

const CLOSED_LEAD = ['Not Proceeding', 'Lost Lead', 'Converted']
export const isLiveLead = (e: Enquiry) => !CLOSED_LEAD.includes(e.status ?? '')

/** Outcomes — view 4. Decided matters only; Pending is not an outcome. */
export function outcomes(matters: Matter[]) {
  const counts = new Map<string, number>()
  for (const m of matters) {
    const o = m.visa_outcome
    if (!o || o === 'Pending') continue     // undecided is not a result
    counts.set(o, (counts.get(o) ?? 0) + 1)
  }
  const decided = [...counts.values()].reduce((a, b) => a + b, 0)
  const granted = counts.get('Granted') ?? 0
  return {
    rows: [...counts.entries()].sort((a, b) => b[1] - a[1]),
    decided,
    granted,
    // ⚠️ null, not 0, when nothing has been decided. A 0% grant rate on a
    // practice that has decided nothing is a libel on the practice.
    rate: decided > 0 ? Math.round((granted / decided) * 100) : null,
  }
}
