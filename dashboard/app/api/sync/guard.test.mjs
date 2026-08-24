/**
 * Tests for the /api/sync authorisation guard.  node app/api/sync/guard.test.mjs
 *
 * 🔴 This route holds the service-role key, which bypasses RLS. Every other
 * access-control test in this repo is void on this endpoint, so the guard gets
 * tested against the ways past it — including the one that was actually there.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
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
  ['a PREFIX of the real secret is refused (the TIMING property is asserted separately below)',
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

console.log('\n=== the comparison is constant-time (structural assertion) ===')
/* ⛔ The "a PREFIX of the real secret" case above asserts only `.ok === false`,
 * and a plain `a === b` passes it too — proven by mutation. A timing property
 * cannot be asserted reliably from JS, so assert the MECHANISM instead: that
 * the module imports and uses node's constant-time compare, and does not fall
 * back to `===` on the secret. A `===` here leaks the secret's length and
 * prefix, byte by byte, on a public route holding the service-role key. (D-400) */
// ⚠️ Comments stripped first. The file DOCUMENTS the old vulnerable line
// (`given !== secret`) so the bug is not silently forgotten — and the naive
// check flagged that comment as if it were live code. A test that reads prose
// as code is a false positive, and a false positive gets a gate switched off.
const guardSrc = readFileSync(new URL('./guard.ts', import.meta.url), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
check("imports timingSafeEqual from node:crypto",
      /import\s*\{[^}]*timingSafeEqual[^}]*\}\s*from\s*'node:crypto'/.test(guardSrc))
check("actually CALLS timingSafeEqual", /timingSafeEqual\s*\(/.test(guardSrc))
// ⛔ "calls it somewhere" is not enough — it is also called in the length-
// mismatch branch. Mutating `return timingSafeEqual(x, y)` to `return a === b`
// left the previous version of this assertion GREEN. The RESULT must come from
// the constant-time compare, so assert on the return itself.
check("RETURNS the constant-time comparison, not a === b",
      /return\s+timingSafeEqual\s*\(/.test(guardSrc))
check("⛔ never compares the secret with === or !==",
      !/\b(given|secret)\s*[!=]==\s*(given|secret)\b/.test(guardSrc))
check("compares as Buffers, not strings", /Buffer\.from\(/.test(guardSrc))

console.log(`\n${pass}/${pass + fail} checks passed`)
process.exit(fail === 0 ? 0 : 1)
