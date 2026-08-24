import { createSign } from 'node:crypto'

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GOOGLE SHEETS → rows. The half of the sync that did not exist. (D-401)
 *
 * `syncMatters`, `syncS56` and `syncEnquiries` all take `(rows, headers)` and
 * nothing produced them, so the "hourly refresh" had no source. This is that
 * source.
 *
 * ⛔ READ-ONLY, STRUCTURALLY — not by convention.
 *   · The scope requested is `spreadsheets.readonly`. Google will refuse a
 *     write with that token even if this code asked for one.
 *   · The only endpoint called is `GET .../values/{range}`.
 *   · The service account is granted **Viewer** on the sheet, not Editor.
 * Three independent layers, because Sheets is the client's system of record and
 * their real client register is in it. **Nothing this application does can
 * alter or delete a row of their data.**
 *
 * ⛔ NO NEW DEPENDENCY. `googleapis` is ~50MB and pulls a large transitive tree
 * into a project that handles immigration data; the whole job here is one
 * signed JWT and one GET. Signing uses node's own crypto. Fewer packages is a
 * security property, not a preference.
 *
 * 🔑 WHY A SERVICE ACCOUNT AND NOT OAUTH. OAuth binds the sync to one human's
 * Google login — it breaks when they change their password, and it means the
 * automation runs as a person. A service account is an identity Yale owns and
 * can revoke from their own Drive UI without touching anyone's account.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets'
/** ⛔ readonly. Changing this to a write scope is a reviewable, deliberate act. */
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets.readonly'

export interface SheetTab {
  /** The header row, exactly as the sheet returns it. */
  headers: string[]
  /** Every row BELOW the header, as an array of cells. */
  rows: string[][]
}

const b64url = (input: Buffer | string) =>
  Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

/**
 * Exchange the service-account key for a short-lived read-only access token.
 * @param nowSeconds injectable purely so the token shape can be tested.
 */
export function buildJwt(
  clientEmail: string, privateKey: string, nowSeconds: number,
): string {
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claims = b64url(JSON.stringify({
    iss: clientEmail,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: nowSeconds,
    // ⚠️ One hour is Google's maximum. Shorter is better and this token never
    // leaves the server, but a clock skew of a few minutes is common on hosts,
    // so anything very short becomes a flaky sync rather than a safer one.
    exp: nowSeconds + 3600,
  }))
  const signer = createSign('RSA-SHA256')
  signer.update(`${header}.${claims}`)
  // Newlines survive an env var as the two characters \n; restore them.
  const pem = privateKey.includes('\\n') ? privateKey.replace(/\\n/g, '\n') : privateKey
  return `${header}.${claims}.${b64url(signer.sign(pem))}`
}

async function accessToken(clientEmail: string, privateKey: string): Promise<string> {
  const assertion = buildJwt(clientEmail, privateKey, Math.floor(Date.now() / 1000))
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion,
    }),
  })
  if (!res.ok) {
    // ⛔ Never echo the body — it can contain the assertion back.
    throw new Error(`Google rejected the service-account key (HTTP ${res.status}). `
      + 'Check GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY, and that the '
      + 'Sheets API is enabled on the project.')
  }
  const json = await res.json() as { access_token?: string }
  if (!json.access_token) throw new Error('Google returned no access token.')
  return json.access_token
}

/**
 * Read one tab. `range` is an A1 range including the header row,
 * e.g. `'MASTER!A1:AE'`.
 *
 * 🔴 `valueRenderOption=UNFORMATTED_VALUE` is deliberate and load-bearing.
 * FORMATTED_VALUE returns whatever the cell LOOKS like, which for a date is
 * whatever locale the sheet is set to — and this project has already been bitten
 * by exactly that: 47% of their enquiry dates were day/month transposed by
 * Excel's US locale. `dateTimeRenderOption=FORMATTED_STRING` then gives ISO-like
 * text rather than a Sheets serial number (46216), which is the other half of
 * the same bug.
 */
export async function readTab(spreadsheetId: string, range: string): Promise<SheetTab> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const key = process.env.GOOGLE_PRIVATE_KEY
  if (!email || !key) {
    throw new Error('NOT_CONFIGURED: GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY '
      + 'are not set, so nothing was read.')
  }
  const token = await accessToken(email, key)
  const url = `${SHEETS_API}/${encodeURIComponent(spreadsheetId)}`
    + `/values/${encodeURIComponent(range)}`
    + '?valueRenderOption=UNFORMATTED_VALUE&dateTimeRenderOption=FORMATTED_STRING'

  const res = await fetch(url, { headers: { authorization: `Bearer ${token}` } })
  if (res.status === 403) {
    throw new Error(`Access denied to ${range}. Share the spreadsheet with ${email} `
      + 'as a VIEWER — that is all this needs.')
  }
  if (res.status === 404) {
    throw new Error(`No such spreadsheet or tab: ${range}. ⚠️ The live tab name is `
      + '`LODGEMENT: JULY TO PRESENT` WITH A COLON — Excel forbids `:` so every export '
      + 'renames it, and the wrong name returns no rows and no error.')
  }
  if (!res.ok) throw new Error(`Sheets API returned HTTP ${res.status} for ${range}.`)

  const json = await res.json() as { values?: unknown[][] }
  const values = json.values ?? []

  // ⛔ An empty tab is NOT an empty result — it is a failed read as far as this
  // system is concerned, and the sync's own empty-guard would otherwise be
  // reached with a legitimately-shaped zero. Fail here, loudly, first.
  if (values.length === 0) {
    throw new Error(`${range} returned no rows at all, not even a header. `
      + 'Refusing to treat that as an empty sheet.')
  }

  const head = values[0] ?? []
  const body = values.slice(1)
  return {
    headers: head.map((h) => String(h ?? '').trim()),
    // Sheets omits trailing empty cells, so rows arrive ragged. Pad them, or
    // every column mapping past the last filled cell reads `undefined`.
    rows: body.map((r) => {
      const cells = r.map((c) => (c == null ? '' : String(c)))
      while (cells.length < head.length) cells.push('')
      return cells
    }),
  }
}
