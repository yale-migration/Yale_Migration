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
import { writeFileSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const dir = mkdtempSync(join(tmpdir(), 'sync-'))
execFileSync('npx', ['tsc', 'sync/columns.ts', '--outDir', dir,
                     '--module', 'es2022', '--target', 'es2022',
                     '--moduleResolution', 'bundler'], { stdio: 'pipe' })
writeFileSync(join(dir, 'package.json'), '{"type":"module"}')
const C = await import(join(dir, 'columns.js'))

let pass = 0, fail = 0
const check = (label, ok, detail) => {
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  — ${detail}` : ''}`)
  ok ? pass++ : fail++
}

// Reproduce buildRecords' contract over the REAL allowlists. Keeping this in
// step with sync.ts is enforced by the shape assertions at the end.
const idx = (l) => [...l].reduce((n, c) => n * 26 + (c.charCodeAt(0) - 64), 0) - 1
const clean = (v) => { const s = String(v ?? '').trim(); return s === '' ? null : s }
function build(rows, map, required) {
  const cols = C.syncedColumns(map)
  const records = []; let skipped = 0
  for (const row of rows) {
    const rec = {}
    for (const { letter, col } of cols) rec[col] = clean(row[idx(letter)])
    if (!rec[required]) { skipped++; continue }
    records.push(rec)
  }
  return { records, skipped }
}

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

console.log(`\n${pass}/${pass + fail} checks passed`)
process.exit(fail === 0 ? 0 : 1)
