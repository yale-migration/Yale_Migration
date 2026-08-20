/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔴 THE ALLOWLIST. This file is a security control, not configuration.
 *
 * Their workbooks carry roughly 1,200 plaintext credentials — ImmiAccount
 * logins, clients' own email passwords, security questions, staff phone PINs
 * (A-18). MASTER itself holds none today. This list is what guarantees that
 * stays true when somebody adds a column to a spreadsheet in six months without
 * telling anyone.
 *
 * ⛔ AN ALLOWLIST, NEVER A DENYLIST. A denylist of forbidden names fails OPEN:
 * a new column called `immi_pw` matches nothing on the list and flows straight
 * through to a web app. This fails CLOSED — anything not named here is simply
 * never read, whatever it is called.
 *
 * ⛔ Do not add a column here without checking what it actually contains in the
 * live sheet. A column's NAME is not evidence of its contents; this project has
 * been caught by that before.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** MASTER column letter → the database column it may populate. */
export const MASTER_ALLOWLIST = {
  A: 'client_code',
  C: 'full_name',
  E: 'contact_number_UNUSED',   // read to prove the shape, never stored
  F: 'client_email',
  G: 'location_UNUSED',
  H: 'visa_type',
  I: 'visa_variant',
  J: 'office',
  K: 'team',
  L: 'consultant',
  M: 'processing_stage',
  N: 'visa_outcome',
  O: 'grant_date',
  P: 'visa_expiry',
  R: 'last_contact',
  S: 'next_due',
  V: 'folder_url',
  AA: 'docs_outstanding',
} as const

/** Columns that reach Postgres. Anything mapped to *_UNUSED is dropped. */
export const SYNCED_COLUMNS = Object.entries(MASTER_ALLOWLIST)
  .filter(([, col]) => !col.endsWith('_UNUSED'))
  .map(([letter, col]) => ({ letter, col }))

/**
 * Last line of defence. Runs over the HEADER ROW the sheet actually returns,
 * before a single row of data is read.
 *
 * ⚠️ It aborts the whole sync rather than skipping the offending column.
 * Skipping would let a sync "succeed" while a credential column sat one
 * mapping mistake away from the database — and a green run is exactly how this
 * project has hidden failures before.
 */
// 🔴 Separators are [\s_-], NOT \s. The first draft used \s* and \b, and
// `portal_pwd` and `user_name` BOTH sailed through — an underscore is a word
// character, so `\bpwd\b` finds no boundary in `_pwd`, and `user\s*name`
// never matches `user_name`. Sheet columns are named with underscores far more
// often than with spaces, so the check was blind to the most likely spelling.
// Caught by testing the guard against the names it exists to stop.
const SEP = '[\\s_.\\-]*'
const FORBIDDEN = new RegExp(
  [
    `pass${SEP}word`, 'passwd', 'pwd',          // pwd matches anywhere on purpose
    `user${SEP}name`, `login${SEP}id`,
    'otp', `one${SEP}time`,
    `\\bpin\\b`, `${SEP}pin${SEP}`,             // 'pin' alone is too broad to match bare
    `security${SEP}question`, `secret${SEP}answer`,
    'secret', 'token', 'credential', `immi${SEP}account`,
  ].join('|'),
  'i',
)

export function assertNoCredentialColumns(headers: readonly string[]): void {
  const hits = headers
    .map((h, i) => ({ h: String(h ?? '').trim(), i }))
    .filter(({ h }) => h && FORBIDDEN.test(h))

  if (hits.length > 0) {
    throw new Error(
      `ABORT — the source sheet contains ${hits.length} column(s) that look like credentials: ` +
      hits.map(({ h, i }) => `"${h}" (col ${i + 1})`).join(', ') +
      `. Nothing was synced. These must never reach a web-facing database. ` +
      `If this is a false positive, rename the column in the sheet — do not weaken this check.`,
    )
  }
}


/**
 * The other two tabs. `matters` had a sync path; `s56_deadlines` and
 * `enquiries` did not — so both surfaces were real UI over data nobody fed.
 *
 * ⛔ Same rule: an ALLOWLIST. A denylist fails open the moment somebody adds a
 * column, and the S56 TRACKER sits in the same workbook as the credential-heavy
 * tabs.
 */
export const S56_ALLOWLIST = {
  A: 'received_UNUSED',      // Gmail timestamp, not needed here
  B: 'client_name',
  C: 'subclass',
  D: 'due_date_legal',
  E: 'due_date_internal',
  F: 'days_allowed',
  G: 'letter_date',
  H: 'deadline_sentence',
  N: 'needs_review',
  R: 'status',
  // ⛔ I, J, K (TRN · Application ID · File Number) are DELIBERATELY not synced.
  // They identify a person to the Department. The dashboard never needs them to
  // show a deadline, and a web-facing copy of a TRN buys nothing and risks a lot.
} as const

export const ENQUIRY_ALLOWLIST = {
  A: 'enquiry_date',
  B: 'name',
  C: 'phone',
  D: 'email',
  E: 'channel',
  F: 'visa_interest',
  G: 'office',
  H: 'assigned_to',
  I: 'status',
  J: 'follow_up_due',
  L: 'last_contact',
} as const

export const syncedColumns = (map: Record<string, string>) =>
  Object.entries(map).filter(([, c]) => !c.endsWith('_UNUSED')).map(([letter, col]) => ({ letter, col }))
