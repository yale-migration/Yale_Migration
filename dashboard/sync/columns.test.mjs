/**
 * Tests for the credential allowlist.  node sync/columns.test.mjs
 *
 * 🔴 This guard is the reason a web-facing database cannot end up holding
 * ImmiAccount logins. It gets tested against the names it exists to stop —
 * including the underscore spellings that defeated the first version of it.
 */
import { readFileSync } from 'node:fs'

const SEP = '[\\s_.\\-]*'
const FORBIDDEN = new RegExp([
  `pass${SEP}word`, 'passwd', 'pwd',
  `user${SEP}name`, `login${SEP}id`,
  'otp', `one${SEP}time`,
  '\\bpin\\b', `${SEP}pin${SEP}`,
  `security${SEP}question`, `secret${SEP}answer`,
  'secret', 'token', 'credential', `immi${SEP}account`,
].join('|'), 'i')

// Keep the test's copy honest — if the module's regex is edited and this is
// not, the assertions below would be testing a regex nothing uses.
const src = readFileSync(new URL('./columns.ts', import.meta.url), 'utf8')
const inSync = ['passwd', 'pwd', 'immi${SEP}account', 'credential', 'token'].every((t) => src.includes(t))

let pass = 0, fail = 0
const check = (label, ok) => { console.log((ok ? '  PASS  ' : '  FAIL  ') + label); ok ? pass++ : fail++ }

check('the module still contains the same terms this test asserts on', inSync)

console.log('\n=== must BLOCK — every spelling a real sheet might use ===')
for (const c of ['ImmiAccount Password', 'password', 'Password ', 'PASSWORD',
  'client_password', 'client.password', 'portal_pwd', 'PORTAL-PWD', 'pwd',
  'User Name', 'user_name', 'username', 'Login ID', 'login_id',
  'OTP', 'otp_code', 'one time code', 'one_time_code',
  'Phone PIN', 'phone_pin', 'staff pin',
  'Security Question', 'security_question', 'secret_answer', 'api_token',
  'ImmiAccount', 'immi account']) {
  check(`blocks "${c}"`, FORBIDDEN.test(c))
}

console.log('\n=== must ALLOW — a false positive aborts the entire sync ===')
for (const c of ['Client Code', 'Their Client ID', 'Full Name', 'Party 2 Name',
  'Contact Number', 'Email Address', 'Location', 'Visa Type', 'Visa Variant',
  'Office', 'Team', 'Assigned Consultant', 'Processing Stage', 'Visa Outcome',
  'Grant Date', 'Visa Expiry', 'Refusal Reason', 'Last Contact',
  'Next Follow-up Due', 'Date Added', 'Source', 'Folder URL', 'Notes',
  'Skills Authority', 'Checklist Filed', 'Docs Outstanding', 'Chase Flag']) {
  check(`allows "${c}"`, !FORBIDDEN.test(c))
}

/* ══════════════════════════════════════════════════════════════════════════
 * 🔴 THE ENQUIRY MAPPING. Added 24 Aug 2026 after G was found mapped to
 * `office` when it holds Onshore/Offshore (D-389).
 *
 * There was NO test on any allowlist mapping — only on the credential regex.
 * So a mapping that would have silently emptied every manager's enquiry list
 * sat green through 100 unit checks, 82 e2e tests and a production build,
 * because the demo fixtures hardcode office:'BRISBANE' and the live sync has
 * never run. **Everything downstream of a wrong mapping still passes.**
 * ══════════════════════════════════════════════════════════════════════════ */
console.log('\n=== enquiry column mapping — the sheet, not what we wish it said ===')
const enqBlock = src.slice(src.indexOf('export const ENQUIRY_ALLOWLIST'))
                    .slice(0, src.slice(src.indexOf('export const ENQUIRY_ALLOWLIST')).indexOf('} as const'))
const mapOf = (b) => Object.fromEntries(
  [...b.matchAll(/^\s*([A-Z]):\s*'([a-z_]+)'/gm)].map((m) => [m[1], m[2]]))
const enq = mapOf(enqBlock)

check("G maps to 'location'", enq.G === 'location', `G -> ${enq.G}`)
check("⛔ G must NEVER map to 'office' — ENQUIRIES has no office column, and the " +
      "manager RLS policy would compare 'Onshore' to 'BRISBANE' and deny in silence",
      enq.G !== 'office', `G -> ${enq.G}`)
check("no enquiry column claims to be 'office'",
      !Object.values(enq).includes('office'), JSON.stringify(enq))

// The rest of the mapping, against ENQUIRY_HEADERS in setup_master_sheet.gs:
// Date · Name · Phone · Email · Channel · Visa Interest · Location · Assigned To
// · Status · Follow-up Due · Notes, plus L Last Contact added later.
for (const [letter, col] of Object.entries({
  A: 'enquiry_date', B: 'name', C: 'phone', D: 'email', E: 'channel',
  F: 'visa_interest', G: 'location', H: 'assigned_to', I: 'status',
  J: 'follow_up_due', L: 'last_contact',
})) {
  check(`${letter} -> ${col}`, enq[letter] === col, `got ${enq[letter]}`)
}
check('K (Notes) is not synced — free text, may hold anything', !enq.K)

// ⚠️ Every real MASTER header must pass. If the guard ever blocks one of these
// the sync stops dead — a false positive is an outage, not a safe default.
/* ══════════════════════════════════════════════════════════════════════════
 * 🔴 MASTER MAPPING — bound to the SHEET BUILDER, not to a copy of it.
 *
 * `MASTER_ALLOWLIST` addresses the sheet by LETTER. Insert one column in
 * MASTER and every letter after it points at the wrong data — silently, with
 * no error, exactly as three hardcoded positions did in CALL LOG (LESSONS § 4).
 * `client_email` would quietly begin syncing `Location`.
 *
 * So this reads MASTER_HEADERS out of setup_master_sheet.gs and checks the
 * header actually AT each letter. A copy of the header list here would drift
 * and then agree with itself, which is how a validator ends up proving nothing.
 * ══════════════════════════════════════════════════════════════════════════ */
console.log('\n=== MASTER letters point at the headers we think they do ===')
const gs = readFileSync(new URL('../../scripts/setup_master_sheet.gs', import.meta.url), 'utf8')
const grab = (name) => {
  const m = gs.match(new RegExp('var ' + name + '\\s*=\\s*\\[([\\s\\S]*?)\\];'))
  return m ? [...m[1].matchAll(/'([^']*)'/g)].map((x) => x[1]) : null
}
const MASTER_HEADERS = grab('MASTER_HEADERS')
check('MASTER_HEADERS parsed from the .gs', Array.isArray(MASTER_HEADERS) && MASTER_HEADERS.length > 20,
      MASTER_HEADERS ? MASTER_HEADERS.length + ' headers' : 'PARSE FAILED')

const idx = (letter) => letter.split('').reduce((n, c) => n * 26 + (c.charCodeAt(0) - 64), 0) - 1
const EXPECT = {
  A: 'Client Code',      C: 'Full Name',        E: 'Contact Number',
  F: 'Email Address',    G: 'Location',         H: 'Visa Type',
  I: 'Visa Variant',     J: 'Office',           K: 'Team',
  L: 'Assigned Consultant', M: 'Processing Stage', N: 'Visa Outcome',
  O: 'Grant Date',       P: 'Visa Expiry',      R: 'Last Contact',
  S: 'Next Follow-up Due', V: 'Folder URL',
}
for (const [letter, header] of Object.entries(EXPECT)) {
  check(`${letter} is "${header}"`, MASTER_HEADERS?.[idx(letter)] === header,
        `found "${MASTER_HEADERS?.[idx(letter)]}"`)
}

// 🔑 The mapping's own claims, read from the module — so renaming a db column
// without updating this file is caught too.
const masterBlock = src.slice(src.indexOf('export const MASTER_ALLOWLIST'))
const masterMap = Object.fromEntries(
  [...masterBlock.slice(0, masterBlock.indexOf('} as const'))
    .matchAll(/^\s*([A-Z]{1,2}):\s*'([a-z_A-Z]+)'/gm)].map((m) => [m[1], m[2]]))
check("G is dropped as location_UNUSED — MASTER's Location is an ADDRESS, not Onshore/Offshore",
      masterMap.G === 'location_UNUSED', `G -> ${masterMap.G}`)
check('E (Contact Number) is dropped — a phone number is PII the board never shows',
      masterMap.E === 'contact_number_UNUSED', `E -> ${masterMap.E}`)
check("J -> office (MASTER genuinely HAS an Office column, unlike ENQUIRIES)",
      masterMap.J === 'office', `J -> ${masterMap.J}`)
check('AA -> docs_outstanding', masterMap.AA === 'docs_outstanding', `AA -> ${masterMap.AA}`)

// AA is added by a later script, so it is not in MASTER_HEADERS.
const zToAd = readFileSync(new URL('../../scripts/add_master_columns_z_to_ad.gs', import.meta.url), 'utf8')
check('AA really is "Docs Outstanding" in the sheet builder that adds it',
      /Docs Outstanding/.test(zToAd))

console.log('\n=== S56: identifiers must never reach a web-facing database ===')
const s56Block = src.slice(src.indexOf('export const S56_ALLOWLIST'))
const s56 = Object.fromEntries(
  [...s56Block.slice(0, s56Block.indexOf('} as const'))
    .matchAll(/^\s*([A-Z]):\s*'([a-z_A-Z]+)'/gm)].map((m) => [m[1], m[2]]))
for (const letter of ['I', 'J', 'K']) {
  check(`${letter} (TRN / Application ID / File Number) is NOT synced`, !s56[letter],
        `${letter} -> ${s56[letter]}`)
}
check('A (Gmail timestamp) is dropped', s56.A === 'received_UNUSED')

console.log('\n' + pass + '/' + (pass + fail) + ' checks passed')
process.exit(fail === 0 ? 0 : 1)
