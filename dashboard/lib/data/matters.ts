import { createClient } from '@/lib/supabase/server'
import { isLive } from '@/lib/supabase/config'
import { DEMO_MATTERS, DEMO_S56, DEMO_ENQUIRIES } from './fixtures'
import type { Matter, S56Deadline, Viewer, Enquiry } from './types'
// Pure derivations live in derive.ts so they can be tested without a database.
import { daysBetween } from './derive'
export * from './derive'

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
    .select('id, enquiry_date, name, phone, email, channel, visa_interest, office, location, assigned_to, status, follow_up_due, last_contact')
    .order('enquiry_date', { ascending: false, nullsFirst: false })

  if (error) throw new Error(`enquiries query failed: ${error.message}`)
  return (data ?? []) as Enquiry[]
}
