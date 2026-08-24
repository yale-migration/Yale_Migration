import { createClient } from '@supabase/supabase-js'
import {
  SYNCED_COLUMNS, assertNoCredentialColumns,
  S56_ALLOWLIST, ENQUIRY_ALLOWLIST, syncedColumns,
} from './columns'

/**
 * Google Sheets → Postgres. One way, hourly.
 *
 * ⛔ RUNS WITH THE SERVICE-ROLE KEY, which bypasses RLS entirely. That is what
 * makes this the most dangerous file in the project and why it does exactly one
 * thing: read an allowlisted set of columns and upsert them. It serves no HTTP
 * request, takes no user input, and must never be imported by anything under
 * app/ — a single accidental import would ship that key to the browser.
 *
 * ⚠️ Sheets stays the SYSTEM OF RECORD. Nothing here writes back to it.
 */

type Row = Record<string, string | null>

export interface SyncResult {
  read: number
  written: number
  skipped: number
  warnings: string[]
}

/** Blank string → null, so "no value" is one thing in the database, not two. */
const clean = (v: unknown): string | null => {
  const s = String(v ?? '').trim()
  return s === '' ? null : s
}

/** 'A' → 0, 'AA' → 26. One definition; a second copy would drift. */
const letterToIndex = (letter: string): number =>
  [...letter].reduce((n, c) => n * 26 + (c.charCodeAt(0) - 64), 0) - 1

export async function syncMatters(rows: string[][], headers: string[]): Promise<SyncResult> {
  // 🔴 Before anything else, and before any data is read.
  assertNoCredentialColumns(headers)

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('ABORT — sync requires the service-role key. Nothing was read.')

  const supabase = createClient(url, key, { auth: { persistSession: false } })

  const warnings: string[] = []
  const records: Row[] = []
  let skipped = 0

  for (const row of rows) {
    const rec: Row = {}
    for (const { letter, col } of SYNCED_COLUMNS) rec[col] = clean(row[letterToIndex(letter)])

    // A row with no client code cannot be upserted or looked up. Count it and
    // say so — silently dropping rows is how an import quietly loses people.
    if (!rec.client_code) { skipped++; continue }

    // ⚠️ The office drives the manager RLS policy. A row with no office would
    // be invisible to every manager and visible only to the director — which
    // looks like a missing client, not a data problem. Flag it loudly.
    if (!rec.office) warnings.push(`${rec.client_code}: no office — no branch manager will see this row`)

    records.push(rec)
  }

  if (records.length === 0) {
    // ⛔ Never let an empty read overwrite a populated table. A transient Sheets
    // failure returning zero rows would otherwise empty the dashboard, and an
    // empty dashboard reads as "this practice has no clients".
    throw new Error(`ABORT — 0 usable rows from ${rows.length} read. Refusing to sync an empty set.`)
  }

  const { error } = await supabase
    .from('matters')
    .upsert(records.map((r) => ({ ...r, synced_at: new Date().toISOString() })),
            { onConflict: 'client_code' })

  if (error) throw new Error(`sync failed: ${error.message}`)

  return { read: rows.length, written: records.length, skipped, warnings }
}


/* ═══════════════════════════════════════════════════════════════════════════
 * 🔴 THE OTHER TWO TABLES. Added 24 Aug 2026 (D-392).
 *
 * `S56_ALLOWLIST` and `ENQUIRY_ALLOWLIST` were written on 20 Aug and
 * `STATE.md` recorded the s56/enquiries sync path as ✅ DONE. **Nothing ever
 * imported them.** The only consumer either constant had was the test file.
 * So the Section 56 board and the enquiries board were exactly what that same
 * audit note warned about one line earlier: real UI over data nobody feeds.
 *
 * 🔑 The lists were the visible half of the job and they were mistaken for the
 * job. Defining a config and wiring a config look identical in a diff.
 *
 * ⛔ ONE implementation, parameterised — not three copies. Three copies of an
 * upsert drift, and the guard that matters (refusing to overwrite a populated
 * table with an empty read) would then exist in three versions, two of which
 * nobody re-reads.
 * ═══════════════════════════════════════════════════════════════════════════ */

interface TableSpec {
  /** Postgres table. */
  table: string
  /** Sheet letter → column, straight from the allowlist. */
  map: Record<string, string>
  /** Upsert key, or null to replace the table wholesale. */
  onConflict: string | null
  /** A row missing this column cannot be used at all. */
  required: string
}

/**
 * 🔑 THE PURE HALF, pulled out so it can be tested WITHOUT a database.
 *
 * Everything that decides what reaches Postgres — letter resolution, blank
 * handling, which rows are dropped — lives here and takes no I/O. The half that
 * cannot be tested without live credentials is then only the upsert itself.
 *
 * ⛔ This exists because the mapping bug in D-389 was untestable while it was
 * welded to a network call: the only way to see it was to run a real sync
 * against a real sheet, which nobody was going to do before go-live.
 */
export function buildRecords(rows: string[][], spec: Pick<TableSpec, 'map' | 'required'>) {
  const cols = syncedColumns(spec.map)
  const warnings: string[] = []
  const records: Row[] = []
  let skipped = 0

  for (const row of rows) {
    const rec: Row = {}
    for (const { letter, col } of cols) rec[col] = clean(row[letterToIndex(letter)])
    // A row without the required field cannot be upserted or looked up. Count
    // it — silently dropping rows is how an import quietly loses people.
    if (!rec[spec.required]) { skipped++; continue }
    records.push(rec)
  }
  return { records, skipped, warnings }
}

async function syncTable(
  rows: string[][], headers: string[], spec: TableSpec,
): Promise<SyncResult> {
  // 🔴 Before anything else, on every table — the S56 TRACKER and the enquiry
  // log live in the same workbook as the credential-heavy tabs.
  assertNoCredentialColumns(headers)

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('ABORT — sync requires the service-role key. Nothing was read.')
  const supabase = createClient(url, key, { auth: { persistSession: false } })

  const { records, skipped, warnings } = buildRecords(rows, spec)

  if (records.length === 0) {
    // ⛔ Same rule as matters. An empty read must never empty a live board —
    // a transient Sheets failure would otherwise read as "no deadlines", which
    // on the s56 table means "no statutory deadlines are approaching".
    throw new Error(
      `ABORT — 0 usable rows for ${spec.table} from ${rows.length} read. Refusing to sync an empty set.`)
  }

  const stamped = records.map((r) => ({ ...r, synced_at: new Date().toISOString() }))

  if (spec.onConflict) {
    const { error } = await supabase.from(spec.table).upsert(stamped, { onConflict: spec.onConflict })
    if (error) throw new Error(`${spec.table} sync failed: ${error.message}`)
  } else {
    // ⚠️ These two tabs carry no stable key — an enquiry is a row in a log, not
    // an entity with an id, and the sheet's own row number is not stable
    // because rows get inserted above. So the table is REPLACED, inside one
    // request: delete then insert. If the insert fails the delete is already
    // committed, which is why the empty-read guard above runs first and why
    // this is the last thing that happens.
    const { error: delErr } = await supabase.from(spec.table).delete().gte('id', 0)
    if (delErr) throw new Error(`${spec.table} clear failed: ${delErr.message}`)
    const { error } = await supabase.from(spec.table).insert(stamped)
    if (error) {
      throw new Error(
        `${spec.table} sync failed AFTER the table was cleared — it is now EMPTY and must be ` +
        `re-synced before anyone reads it: ${error.message}`)
    }
  }

  return { read: rows.length, written: records.length, skipped, warnings }
}

/** Section 56 deadlines. ⛔ TRN, Application ID and File Number never come. */
export const syncS56 = (rows: string[][], headers: string[]) =>
  syncTable(rows, headers, {
    table: 's56_deadlines', map: S56_ALLOWLIST, onConflict: null, required: 'client_name',
  })

/** Enquiries — leads. `location` is Onshore/Offshore; `office` has no source (D-389). */
export const syncEnquiries = (rows: string[][], headers: string[]) =>
  syncTable(rows, headers, {
    table: 'enquiries', map: ENQUIRY_ALLOWLIST, onConflict: null, required: 'enquiry_date',
  })
