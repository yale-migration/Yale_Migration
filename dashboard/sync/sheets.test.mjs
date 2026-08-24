/**
 * Tests for the Google Sheets reader.  node sync/sheets.test.mjs
 *
 * ⛔ No network. The JWT is verified cryptographically against a throwaway key
 * generated here; the HTTP paths are asserted on shape, because a test that
 * calls Google is a test that fails when someone's wifi drops.
 */
import { writeFileSync, mkdirSync, rmSync, readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'
import { generateKeyPairSync, createVerify } from 'node:crypto'

const dir = join(process.cwd(), 'node_modules', '.cache', 'sheets-test')
rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true })
execFileSync('npx', ['tsc', 'sync/sheets.ts', '--outDir', dir, '--module', 'es2022',
                     '--target', 'es2022', '--moduleResolution', 'bundler'], { stdio: 'pipe' })
writeFileSync(join(dir, 'package.json'), '{"type":"module"}')
const { buildJwt, readTab } = await import(join(dir, 'sheets.js'))

let pass = 0, fail = 0
const check = (label, ok, detail) => {
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  — ${detail}` : ''}`)
  ok ? pass++ : fail++
}

const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 })
const pem = privateKey.export({ type: 'pkcs8', format: 'pem' })
const EMAIL = 'yale-dashboard-sync@example-project.iam.gserviceaccount.com'
const NOW = 1_756_000_000

console.log('=== the signed assertion ===')
const jwt = buildJwt(EMAIL, pem, NOW)
const [h, c, sig] = jwt.split('.')
check('has three dot-separated parts', jwt.split('.').length === 3)
const dec = (p) => JSON.parse(Buffer.from(p.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString())
check('header is RS256', dec(h).alg === 'RS256', dec(h).alg)
check('issuer is the service account', dec(c).iss === EMAIL)
check('audience is Google\'s token endpoint', dec(c).aud === 'https://oauth2.googleapis.com/token')

// 🔴 The single most important assertion in this file.
check('⛔ the scope is spreadsheets.READONLY',
      dec(c).scope === 'https://www.googleapis.com/auth/spreadsheets.readonly', dec(c).scope)
check('⛔ the scope grants no write and no Drive access',
      !/drive/.test(dec(c).scope) && dec(c).scope.endsWith('.readonly'))

check('expires within Google\'s one-hour maximum', dec(c).exp - dec(c).iat <= 3600,
      String(dec(c).exp - dec(c).iat))
check('is not already expired at issue', dec(c).exp > dec(c).iat)

// The signature must actually verify — a malformed signer would still produce
// three parts and pass every assertion above.
const v = createVerify('RSA-SHA256'); v.update(`${h}.${c}`)
check('🔑 the signature VERIFIES against the public key',
      v.verify(publicKey, Buffer.from(sig.replace(/-/g, '+').replace(/_/g, '/'), 'base64')))

console.log('\n=== escaped newlines in the key survive an env var ===')
// A PEM pasted into a Vercel env var arrives with literal backslash-n.
const escaped = pem.replace(/\n/g, '\\n')
const jwt2 = buildJwt(EMAIL, escaped, NOW)
const v2 = createVerify('RSA-SHA256'); v2.update(jwt2.split('.').slice(0, 2).join('.'))
check('a key with \\n literals still signs correctly',
      v2.verify(publicKey, Buffer.from(jwt2.split('.')[2].replace(/-/g, '+').replace(/_/g, '/'), 'base64')))
check('and produces an identical assertion to the real PEM', jwt2 === jwt)

console.log('\n=== it refuses to run unconfigured, rather than half-running ===')
const savedE = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
const savedK = process.env.GOOGLE_PRIVATE_KEY
delete process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
delete process.env.GOOGLE_PRIVATE_KEY
let msg = ''
try { await readTab('sheet-id', 'MASTER!A1:AE') } catch (e) { msg = e.message }
check('readTab throws NOT_CONFIGURED with no credentials', msg.startsWith('NOT_CONFIGURED'), msg.slice(0, 60))
check('⛔ and says nothing was read', /nothing was read/.test(msg))
if (savedE) process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = savedE
if (savedK) process.env.GOOGLE_PRIVATE_KEY = savedK

console.log('\n=== the source itself ===')
const src = readFileSync(new URL('./sheets.ts', import.meta.url), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
check('⛔ UNFORMATTED_VALUE — never the locale-rendered cell (47% of their dates were transposed)',
      /valueRenderOption=UNFORMATTED_VALUE/.test(src))
check('⛔ FORMATTED_STRING for dates — never a Sheets serial like 46216',
      /dateTimeRenderOption=FORMATTED_STRING/.test(src))
check('an empty tab is an ERROR, not an empty result',
      /Refusing to treat that as an empty sheet/.test(src))
check('ragged rows are padded to the header width', /while \(cells\.length < head\.length\)/.test(src))
check('🔴 the 404 message warns about the colon in the live tab name',
      /WITH A COLON/.test(readFileSync(new URL('./sheets.ts', import.meta.url), 'utf8')))

console.log(`\n${pass}/${pass + fail} checks passed`)
process.exit(fail === 0 ? 0 : 1)
