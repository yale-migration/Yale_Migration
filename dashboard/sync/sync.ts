import { createClient } from '@supabase/supabase-js'
import { SYNCED_COLUMNS, assertNoCredentialColumns } from './columns'

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

export async function syncMatters(rows: string[][], headers: string[]): Promise<SyncResult> {
  // 🔴 Before anything else, and before any data is read.
  assertNoCredentialColumns(headers)

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('ABORT — sync requires the service-role key. Nothing was read.')

  const supabase = createClient(url, key, { auth: { persistSession: false } })

  const letterToIndex = (letter: string): number =>
    [...letter].reduce((n, c) => n * 26 + (c.charCodeAt(0) - 64), 0) - 1

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
