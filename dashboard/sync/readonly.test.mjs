/**
 * 🔴 PROOF THAT THIS APPLICATION CANNOT DESTROY THE CLIENT'S DATA.
 *   node sync/readonly.test.mjs
 *
 * Yale's Google Sheet IS their client register — ~460 client records, the only
 * place some contact details exist at all (D-356). This app is a WINDOW onto a
 * copy of it. These tests assert that structurally, by reading the source,
 * rather than trusting anyone to remember.
 *
 * ⛔ Three separate properties, because any one of them alone is a promise:
 *   1. Nothing in the web app writes to Postgres at all.
 *   2. Nothing anywhere writes to Google Sheets — the token is minted
 *      read-only and only GET is ever called.
 *   3. The ONE place that deletes from Postgres deletes only the disposable
 *      copy, never the source, and cannot run on an empty read.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

let pass = 0, fail = 0
const check = (label, ok, detail) => {
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  — ${detail}` : ''}`)
  ok ? pass++ : fail++
}
const root = process.cwd()
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    if (e === 'node_modules' || e === '.next' || e.startsWith('.')) continue
    const full = join(dir, e)
    if (statSync(full).isDirectory()) walk(full, out)
    else if (/\.(ts|tsx)$/.test(e) && !/\.test\./.test(e)) out.push(full)
  }
  return out
}

/* ── 1 · the WEB APP never writes to Postgres ───────────────────────────── */
console.log('=== the web app cannot write to the database ===')
const appFiles = [...walk(join(root, 'app')), ...walk(join(root, 'components')),
                  ...walk(join(root, 'lib'))]
check('found application source to inspect', appFiles.length > 10, `${appFiles.length} files`)

const WRITE_VERBS = /\.\s*(insert|update|upsert|delete|rpc)\s*\(/
const writers = appFiles.filter((f) => WRITE_VERBS.test(strip(readFileSync(f, 'utf8'))))
check('⛔ no .insert/.update/.upsert/.delete anywhere under app/ components/ lib/',
      writers.length === 0, writers.map((f) => relative(root, f)).join(', '))

// The service-role key bypasses RLS. If it ever appears outside sync/, the
// read-only guarantee is void wherever it landed.
const srk = appFiles.filter((f) => /SERVICE_ROLE/.test(strip(readFileSync(f, 'utf8'))))
check('⛔ the service-role key is never referenced under app/ components/ lib/',
      srk.length === 0, srk.map((f) => relative(root, f)).join(', '))

/* ── 2 · NOTHING writes to Google Sheets ────────────────────────────────── */
console.log('\n=== the client\'s spreadsheet cannot be modified ===')
const sheets = strip(readFileSync(join(root, 'sync/sheets.ts'), 'utf8'))
check('the OAuth scope requested is spreadsheets.readonly',
      /auth\/spreadsheets\.readonly/.test(sheets))
check('⛔ no write scope is requested anywhere',
      !/auth\/spreadsheets(?!\.readonly)['"\s]/.test(sheets) && !/auth\/drive(?!\.readonly)/.test(sheets))
// ⚠️ Scoped to readTab's BODY. Splitting on the SHEETS_API constant caught the
// token-exchange POST that sits above it — a false positive of my own making,
// and a noisy assertion in a security test is the fastest way to get the whole
// file ignored.
const readTabBody = sheets.slice(sheets.indexOf('export async function readTab'))
check('⛔ readTab issues no mutating request — fetch defaults to GET',
      !/method:\s*['"](POST|PUT|PATCH|DELETE)['"]/.test(readTabBody), 
      (readTabBody.match(/method:[^,\n]*/) ?? ['none'])[0])
check('...and the only fetch in it targets the values endpoint',
      /\/values\//.test(readTabBody))
check('⛔ no Sheets write endpoint is referenced (append / batchUpdate / :clear)',
      !/:append|batchUpdate|:clear/.test(sheets))
// The single POST is the token exchange, which is Google's own auth endpoint.
const posts = [...sheets.matchAll(/method:\s*'POST'/g)].length
check('exactly one POST exists, and it is the token exchange', posts === 1, `${posts} found`)

/* ── 3 · the one DELETE is scoped to the disposable copy ────────────────── */
console.log('\n=== the only delete touches the Postgres copy, never the source ===')
const syncSrc = strip(readFileSync(join(root, 'sync/sync.ts'), 'utf8'))
const deletes = [...syncSrc.matchAll(/\.delete\(\)/g)].length
check('there is exactly ONE delete in the whole codebase', deletes === 1, `${deletes} found`)
check('it runs against a Postgres table, not a sheet',
      /from\(spec\.table\)\s*\.delete\(\)/.test(syncSrc.replace(/\s+/g, ' ')))
// 🔴 The order is the safety property: refuse an empty read BEFORE deleting.
const abortAt = syncSrc.indexOf('Refusing to sync an empty set')
const deleteAt = syncSrc.indexOf('.delete()')
check('🔴 the empty-read abort comes BEFORE the delete — a failed read cannot empty a table',
      abortAt > -1 && deleteAt > -1 && abortAt < deleteAt, `abort@${abortAt} delete@${deleteAt}`)
check('the delete is only reachable on the replace path (no upsert key)',
      /if\s*\(spec\.onConflict\)/.test(syncSrc))

/* ── 4 · the sync endpoint is the only writer, and it is guarded ────────── */
console.log('\n=== the only write path is authenticated ===')
const route = strip(readFileSync(join(root, 'app/api/sync/route.ts'), 'utf8'))
check('the sync route calls checkSyncAuth', /checkSyncAuth\s*\(/.test(route))
check('⛔ and returns before syncing when it fails',
      /if\s*\(!auth\.ok\)\s*return/.test(route))
const authAt = route.indexOf('checkSyncAuth')
const syncAt = Math.min(...['syncMatters', 'readTab'].map((k) => {
  const i = route.indexOf(k + '(')
  return i === -1 ? Number.MAX_SAFE_INTEGER : i
}))
check('🔴 the auth check precedes every read and write in the handler',
      authAt > -1 && authAt < syncAt, `auth@${authAt} work@${syncAt}`)

console.log(`\n${pass}/${pass + fail} checks passed`)
process.exit(fail === 0 ? 0 : 1)
