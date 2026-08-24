/**
 * Tests for the pure half of the sync.  node sync/build.test.mjs
 *
 * 🔴 The D-389 mapping bug — ENQUIRIES column G synced as `office` when it
 * holds Onshore/Offshore — survived 100 unit checks, 82 e2e tests and a
 * production build, because the only way to observe it was to run a real sync
 * against a real sheet. These tests make the transformation observable with no
 * database and no network, using rows shaped exactly like the real tabs.
 *
 * ⛔ INVENTED PEOPLE ONLY. No real client data touches this file.
 */
import { execFileSync } from 'node:child_process'
import { writeFileSync, readFileSync, mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'

// 🔑 Compile and import the REAL modules — `buildRecords` from sync.ts, not a
// reimplementation of it here. A copy of the logic in the test drifts from the
// code and then the two agree with each other while both are wrong, which is
// this project's most expensive recurring bug (LESSONS § 1).
// ⚠️ Emit INSIDE the project, not into /tmp: sync.ts imports @supabase/supabase-js,
// and Node resolves node_modules by walking UP from the importing file. From /tmp
// there is nothing to walk up to.
const dir = join(process.cwd(), 'node_modules', '.cache', 'sync-build-test')
rmSync(dir, { recursive: true, force: true })
mkdirSync(dir, { recursive: true })
execFileSync('npx', ['tsc', 'sync/columns.ts', 'sync/sync.ts', '--outDir', dir,
                     '--module', 'es2022', '--target', 'es2022', '--skipLibCheck',
                     '--moduleResolution', 'bundler'], { stdio: 'pipe' })
writeFileSync(join(dir, 'package.json'), '{"type":"module"}')
// tsc's bundler resolution emits extensionless relative imports; Node's ESM
// loader requires the extension. One rewrite, rather than a second tsconfig.
{
  const f = join(dir, 'sync.js')
  writeFileSync(f, readFileSync(f, 'utf8').replace(/from '\.\/columns'/g, "from './columns.js'"))
}
const C = await import(join(dir, 'columns.js'))
const { buildRecords, syncS56, syncEnquiries } = await import(join(dir, 'sync.js'))

let pass = 0, fail = 0
const check = (label, ok, detail) => {
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  — ${detail}` : ''}`)
  ok ? pass++ : fail++
}

/** Thin adapter over the REAL buildRecords so the calls below read cleanly. */
const build = (rows, map, required, notNull) =>
  buildRecords(rows, { map, required, notNull })

/* ── ENQUIRIES ──────────────────────────────────────────────────────────── */
// A · Date | B Name | C Phone | D Email | E Channel | F Visa Interest
// G Location | H Assigned To | I Status | J Follow-up Due | K Notes | L Last Contact
console.log('=== ENQUIRIES — a row shaped exactly like the live tab ===')
const enqRow = ['2026-08-19', 'Test Person', '0400 000 000', 'test@example.com',
                'Facebook', 'Graduate Visa', 'Onshore', 'RJ', 'New',
                '2026-08-26', 'some free text notes', '']
const enq = build([enqRow], C.ENQUIRY_ALLOWLIST, 'enquiry_date').records[0]

check('location is "Onshore" — the value actually in column G',
      enq.location === 'Onshore', `location=${enq.location}`)
check('🔴 NOTHING is written to `office` — it has no source in this tab (D-389)',
      enq.office === undefined, `office=${JSON.stringify(enq.office)}`)
check("⛔ 'Onshore' never lands in a field an office policy compares to BRISBANE",
      !Object.entries(enq).some(([k, v]) => k.includes('office') && v === 'Onshore'))
check('visa_interest is the client\'s own words, not a subclass number',
      enq.visa_interest === 'Graduate Visa')
check('K (Notes) is not carried — free text may contain anything',
      !Object.values(enq).includes('some free text notes'))
check('an empty cell becomes null, not ""', enq.last_contact === null)
check('assigned_to survives', enq.assigned_to === 'RJ')

console.log('\n=== ENQUIRIES — rows that must be dropped, and counted ===')
const mixed = build([enqRow, ['', 'No Date Person'], ['2026-08-20', 'Second']],
                    C.ENQUIRY_ALLOWLIST, 'enquiry_date')
check('a row with no date is skipped', mixed.records.length === 2, `${mixed.records.length} kept`)
check('and it is COUNTED, not silently lost', mixed.skipped === 1, `skipped=${mixed.skipped}`)

/* ── S56 ────────────────────────────────────────────────────────────────── */
console.log('\n=== S56 — the identifiers must not survive the transformation ===')
// A Received | B Client Name | C Subclass | D Legal | E Internal | F Days
// G Letter date | H Sentence | I TRN | J App ID | K File No | ... N | ... R
const s56Row = ['2026-08-01T09:00', 'Test Client', '500', '2026-08-29', '2026-08-26',
                '28', '2026-08-01', 'You have 28 days', 'TRN-SHOULD-NOT-APPEAR',
                'APPID-SHOULD-NOT-APPEAR', 'FILE-SHOULD-NOT-APPEAR', '', '', 'no', '', '', '', 'Open']
const s56 = build([s56Row], C.S56_ALLOWLIST, 'client_name').records[0]
for (const secret of ['TRN-SHOULD-NOT-APPEAR', 'APPID-SHOULD-NOT-APPEAR', 'FILE-SHOULD-NOT-APPEAR']) {
  check(`"${secret.split('-')[0]}" is absent from every synced value`,
        !Object.values(s56).includes(secret), JSON.stringify(s56))
}
check('the Gmail timestamp (A) is dropped', !Object.values(s56).includes('2026-08-01T09:00'))
check('the deadline sentence IS carried — it is what the ladder explains',
      s56.deadline_sentence === 'You have 28 days')
check('days_allowed survives as text for the ladder to parse', s56.days_allowed === '28')

/* ── MASTER ─────────────────────────────────────────────────────────────── */
console.log('\n=== MASTER — PII that must never reach a web-facing table ===')
const masterRow = ['YM-2026-00001', 'CL-1', 'Test Name', '', '0400 999 888',
                   'test@example.com', '12 Fake St, Brisbane', '500', 'Onshore',
                   'BRISBANE', 'Filipino', 'Star', 'Lodged', '', '', '2027-01-01',
                   '', '2026-08-01', '2026-08-15', '', '', 'https://example.com/f']
const mast = build([masterRow], C.MASTER_ALLOWLIST, 'client_code').records[0]
check('the phone number is NOT synced (E is contact_number_UNUSED)',
      !Object.values(mast).includes('0400 999 888'), JSON.stringify(mast))
check("the street address is NOT synced (G is location_UNUSED)",
      !Object.values(mast).includes('12 Fake St, Brisbane'))
check('client_code survives', mast.client_code === 'YM-2026-00001')
check('office is the BRANCH, not a location word', mast.office === 'BRISBANE')
check('a row with no client code is skipped',
      build([['', 'x']], C.MASTER_ALLOWLIST, 'client_code').skipped === 1)

/* ── the credential guard runs on every tab ─────────────────────────────── */
console.log('\n=== the credential guard is not optional on any tab ===')
for (const bad of ['Password', 'portal_pwd', 'user_name', 'ImmiAccount', 'Phone PIN']) {
  let threw = false
  try { C.assertNoCredentialColumns(['Date', 'Name', bad]) } catch { threw = true }
  check(`a tab containing "${bad}" aborts the sync`, threw)
}
check('a clean header set does not abort', (() => {
  try { C.assertNoCredentialColumns(['Date', 'Name', 'Location']); return true } catch { return false }
})())

/* ── one bad row must not take the batch with it ────────────────────────── */
console.log('\n=== a row that would violate NOT NULL is skipped, not shipped (D-393) ===')
// MASTER: A code, ..., J Office. This row has a code and NO office.
const noOffice = ['YM-2026-00002', '', 'No Office Person', '', '', 'x@example.com', '',
                  '500', '', '', 'Filipino', 'Star', 'Lodged']
const batch = build([masterRow, noOffice], C.MASTER_ALLOWLIST, 'client_code', ['full_name', 'office'])
check('the good row still syncs — one bad row does not abort the batch',
      batch.records.length === 1 && batch.records[0].client_code === 'YM-2026-00001',
      `${batch.records.length} kept`)
check('the bad row is skipped and COUNTED', batch.skipped === 1, `skipped=${batch.skipped}`)
check('a warning NAMES the row so it can be fixed in the sheet',
      batch.warnings.some((w) => w.includes('YM-2026-00002')), JSON.stringify(batch.warnings))
check('the warning says the row was SKIPPED, not that it is merely invisible',
      batch.warnings.some((w) => /SKIPPED/.test(w)), JSON.stringify(batch.warnings))
check('nothing with a null office reaches the records',
      batch.records.every((r) => r.office), JSON.stringify(batch.records.map((r) => r.office)))

console.log('\n=== enquiries and s56 enforce their own NOT NULL column ===')
const enqNoDate = build([enqRow, ['', 'Nameless']], C.ENQUIRY_ALLOWLIST, 'enquiry_date', ['enquiry_date'])
check('an enquiry with no date is skipped', enqNoDate.records.length === 1)
const s56NoName = build([s56Row, ['2026-08-01T09:00', '']], C.S56_ALLOWLIST, 'client_name', ['client_name'])
check('an s56 row with no client name is skipped', s56NoName.records.length === 1)

/* ── the two guards that were dead code as far as any test could tell ────── */
console.log('\n=== the credential guard is actually CALLED by the sync (D-399) ===')
// ⛔ These run with NO service-role key on purpose. The guards were reordered
// ahead of `createClient` precisely so this is reachable: deleting the
// `assertNoCredentialColumns` call, or neutering the empty-read abort, used to
// leave the whole suite green because neither could be reached without a live key.
async function throwsWith(fn, needle) {
  try { await fn(); return { threw: false, msg: '(did not throw)' } }
  catch (e) { return { threw: String(e.message).includes(needle), msg: e.message.slice(0, 90) } }
}
for (const [name, fn] of [['syncS56', syncS56], ['syncEnquiries', syncEnquiries]]) {
  const r = await throwsWith(() => fn([['x']], ['Date', 'ImmiAccount Password']), 'credentials')
  check(`${name} aborts on a credential column BEFORE it asks for the key`, r.threw, r.msg)
}

console.log('\n=== an empty read must never overwrite a populated table ===')
for (const [name, fn] of [['syncS56', syncS56], ['syncEnquiries', syncEnquiries]]) {
  const r = await throwsWith(() => fn([], ['Date', 'Name']), 'Refusing to sync an empty set')
  check(`${name} refuses 0 usable rows`, r.threw, r.msg)
  // 🔴 The tables with no stable key are REPLACED (delete then insert). Without
  // this abort, one transient Sheets failure returning zero rows empties the
  // s56 table — which the board then renders as "no deadlines recorded yet".
}
const allSkipped = await throwsWith(
  () => syncEnquiries([['', 'no date'], ['', 'also no date']], ['Date', 'Name']),
  'Refusing to sync an empty set')
check('rows that all get skipped also count as an empty read', allSkipped.threw, allSkipped.msg)

console.log(`\n${pass}/${pass + fail} checks passed`)
process.exit(fail === 0 ? 0 : 1)
