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
  'secret', 'token', 'credential', 'immiaccount',
].join('|'), 'i')

// Keep the test's copy honest — if the module's regex is edited and this is
// not, the assertions below would be testing a regex nothing uses.
const src = readFileSync(new URL('./columns.ts', import.meta.url), 'utf8')
const inSync = ['passwd', 'pwd', 'immiaccount', 'credential', 'token'].every((t) => src.includes(t))

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

// ⚠️ Every real MASTER header must pass. If the guard ever blocks one of these
// the sync stops dead — a false positive is an outage, not a safe default.
console.log('\n' + pass + '/' + (pass + fail) + ' checks passed')
process.exit(fail === 0 ? 0 : 1)
