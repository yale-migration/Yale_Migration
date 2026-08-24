/**
 * Tests for the /api/sync authorisation guard.  node app/api/sync/guard.test.mjs
 *
 * 🔴 This route holds the service-role key, which bypasses RLS. Every other
 * access-control test in this repo is void on this endpoint, so the guard gets
 * tested against the ways past it — including the one that was actually there.
 */
import { execFileSync } from 'node:child_process'
import { writeFileSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// Compile the guard with tsc so the test runs the REAL module, not a copy of
// its logic. A reimplementation here would drift and then agree with itself.
const dir = mkdtempSync(join(tmpdir(), 'guard-'))
execFileSync('npx', ['tsc', 'app/api/sync/guard.ts', '--outDir', dir,
                     '--module', 'es2022', '--target', 'es2022', '--moduleResolution', 'bundler'], { stdio: 'pipe' })
writeFileSync(join(dir, 'package.json'), '{"type":"module"}')
const { checkSyncAuth } = await import(join(dir, 'guard.js'))

let pass = 0, fail = 0
const check = (label, ok, detail) => {
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  — ${detail}` : ''}`)
  ok ? pass++ : fail++
}
const S = 'the-real-secret-value'

console.log('=== must ALLOW ===')
check('the correct secret', checkSyncAuth({ secret: S, authorization: `Bearer ${S}` }).ok)
check('the correct secret without the Bearer prefix',
      checkSyncAuth({ secret: S, authorization: S }).ok)
check('case-insensitive bearer', checkSyncAuth({ secret: S, authorization: `bearer ${S}` }).ok)

console.log('\n=== must REFUSE — each of these was or could be a way in ===')
const denied = [
  ['🔴 a spoofed x-vercel-cron header alone — THE REAL BUG (D-391)',
   { secret: S, authorization: null, xVercelCron: '1' }],
  ['🔴 a spoofed cron header WITH a wrong secret',
   { secret: S, authorization: 'Bearer wrong', xVercelCron: 'anything' }],
  ['a wrong secret',            { secret: S, authorization: 'Bearer wrong' }],
  ['no authorization header',   { secret: S, authorization: null }],
  ['an empty authorization',    { secret: S, authorization: '' }],
  ['just the word Bearer',      { secret: S, authorization: 'Bearer ' }],
  ['a PREFIX of the real secret — a length-leaking compare would differ here',
   { secret: S, authorization: `Bearer ${S.slice(0, -1)}` }],
  ['the secret plus one character',
   { secret: S, authorization: `Bearer ${S}x` }],
]
for (const [label, input] of denied) {
  check(label, checkSyncAuth(input).ok === false, `status ${checkSyncAuth(input).status}`)
}

console.log('\n=== must FAIL CLOSED when misconfigured ===')
for (const [label, secret] of [['SYNC_SECRET unset', undefined], ['SYNC_SECRET empty', '']]) {
  const r = checkSyncAuth({ secret, authorization: 'Bearer anything' })
  check(`${label} refuses`, r.ok === false, `status ${r.status}`)
  // ⛔ 503 not 401: "I am not configured" is a different fact from "your
  // credential is wrong", and the deploy that caused it needs to be visible.
  check(`${label} returns 503, not 401`, r.status === 503, `status ${r.status}`)
}

console.log('\n=== the error body must not leak the secret ===')
for (const input of [{ secret: S, authorization: 'Bearer wrong' }, { secret: S, authorization: null }]) {
  check('reason text contains no part of the secret',
        !checkSyncAuth(input).reason.includes(S.slice(0, 8)), checkSyncAuth(input).reason)
}

console.log(`\n${pass}/${pass + fail} checks passed`)
process.exit(fail === 0 ? 0 : 1)
