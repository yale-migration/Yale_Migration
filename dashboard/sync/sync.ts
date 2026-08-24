import { createClient } from '@supabase/supabase-js'
import {
  MASTER_ALLOWLIST, assertNoCredentialColumns,
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

/**
 * MASTER → `matters`. The only table with a stable key, so the only upsert.
 *
 * ⛔ Goes through the SAME `syncTable` as the other two. It had its own copy of
 * the row loop until 24 Aug and the copies had already diverged — the office
 * check existed in this one and nowhere else, and the empty-read guard was
 * about to exist in three versions, two of which nobody re-reads. (D-393)
 */
export const syncMatters = (rows: string[][], headers: string[]) =>
  syncTable(rows, headers, {
    table: 'matters',
    map: MASTER_ALLOWLIST,
    onConflict: 'client_code',
    required: 'client_code',
    // 🔴 Both are `not null` in Postgres. `office` additionally drives the
    // manager RLS policy, so a row without one is unusable twice over.
    notNull: ['full_name', 'office'],
  })

/* ═══════════════════════════════════════════════════════════════════════════
 * 🔴 ONE sync implementation, parameterised — never three copies.
 *
 * `S56_ALLOWLIST` and `ENQUIRY_ALLOWLIST` were written on 20 Aug and STATE.md
 * recorded the s56/enquiries sync path as done. **Nothing ever imported them**
 * (D-392). `syncMatters` then kept its own copy of the row loop, and the copies
 * had already diverged — the office check lived in one and nowhere else, and
 * the empty-read guard was about to exist in three versions, two of which
 * nobody re-reads (D-393). All three tables now go through `syncTable`.
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
  /**
   * 🔴 Columns the DATABASE declares NOT NULL. A row missing any of these does
   * not just render badly — Postgres rejects the statement, and because the
   * write is one batch upsert, **one bad row aborts the entire refresh**.
   * Every good row is lost with it. (D-393)
   */
  notNull?: string[]
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
export function buildRecords(
  rows: string[][], spec: Pick<TableSpec, 'map' | 'required' | 'notNull'>,
) {
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

    // ⛔ Drop rows that would violate a NOT NULL column, and NAME them.
    // Previously `matters` warned *"no office — no branch manager will see this
    // row"* and then pushed it anyway. That description was wrong in a way that
    // mattered: `office` is `not null` in Postgres, so the row did not become
    // invisible — it killed the whole batch, taking all 37 good rows with it,
    // inside a cron nobody watches. **Skip the one, keep the rest, say so.**
    const missing = (spec.notNull ?? []).filter((c) => !rec[c])
    if (missing.length) {
      warnings.push(
        `${rec[spec.required]}: SKIPPED — no ${missing.join(', ')}. ` +
        `The database requires ${missing.length > 1 ? 'these' : 'this'}, so the row cannot be ` +
        `stored. Fix it in the sheet; every other row synced normally.`)
      skipped++
      continue
    }
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

  /* ⛔ ORDER MATTERS, AND IT IS DELIBERATE. Every check that can be made
   * WITHOUT credentials happens first.
   *
   * The credential guard and the empty-read abort used to sit either side of
   * `createClient`, which meant neither could be tested without a live
   * service-role key — so neither was. Proven by mutation: deleting the
   * `assertNoCredentialColumns` call, and changing the empty-read guard to
   * `if (false)`, both left the entire suite green. The two controls that
   * protect ~1,200 plaintext credentials and a populated live table were
   * dead code as far as any test could tell. (D-399)
   *
   * Validating before authenticating is also just correct: refuse bad data
   * without ever reaching for the key that bypasses RLS.
   */
  const { records, skipped, warnings } = buildRecords(rows, spec)

  if (records.length === 0) {
    // ⛔ Same rule as matters. An empty read must never empty a live board —
    // a transient Sheets failure would otherwise read as "no deadlines", which
    // on the s56 table means "no statutory deadlines are approaching".
    throw new Error(
      `ABORT — 0 usable rows for ${spec.table} from ${rows.length} read. Refusing to sync an empty set.`)
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('ABORT — sync requires the service-role key. Nothing was read.')
  const supabase = createClient(url, key, { auth: { persistSession: false } })

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
    // ⚠️ `office` is NOT here: the tracker tab has no office column, so the
    // Postgres column was made nullable rather than pretending (08 · D-396).
    notNull: ['client_name'],
  })

/** Enquiries — leads. `location` is Onshore/Offshore; `office` has no source (D-389). */
export const syncEnquiries = (rows: string[][], headers: string[]) =>
  syncTable(rows, headers, {
    table: 'enquiries', map: ENQUIRY_ALLOWLIST, onConflict: null, required: 'enquiry_date',
    notNull: ['enquiry_date'],
  })
