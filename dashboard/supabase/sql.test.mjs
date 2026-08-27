/**
 * Static checks over the SQL you paste into Supabase.  node supabase/sql.test.mjs
 *
 * 🔴 WHY. These files are the only part of the system with NO compiler and NO test
 * runner — they are validated by a human pasting them into a production SQL editor
 * and reading the error. Two defects shipped that way in two days (D-406):
 *
 *   1. `location` was added to the enquiries DEFINITION and to no migration, so
 *      `create table if not exists` left the live table without it.
 *   2. It was then added to the demo INSERT's column list and to none of the six
 *      VALUES rows — 12 columns, 11 values, on every row.
 *
 * Both were mine, both were half-applied edits, and both were found by the client
 * hitting them in a live editor. A compiler would have caught either in a second.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const DIR = new URL('./paste/', import.meta.url).pathname
let pass = 0, fail = 0
const check = (label, ok, detail) => {
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  — ${detail}` : ''}`)
  ok ? pass++ : fail++
}
const strip = (s) => s.replace(/--[^\n]*/g, '')

/**
 * Count top-level commas — ignoring nested parens AND anything inside a quoted
 * string.
 *
 * ⛔ THE QUOTE HANDLING IS NOT OPTIONAL. The first version counted bare commas
 * and reported two of the six demo rows in 03 as broken. They were fine: the
 * value is `'Bank statements — last 3 months, Health insurance certificate'`,
 * and `docs_outstanding` is a comma-separated list by design. Two phantom
 * failures in a brand-new gate, on the one file nobody had run yet — precisely
 * how a check gets ignored on the day it finds something real.
 */
function topLevelCount(inner) {
  let depth = 0, n = 1, inStr = false
  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i]
    if (inStr) {
      // '' is an escaped quote inside a SQL string literal, not the end of it.
      if (ch === "'") { if (inner[i + 1] === "'") i++; else inStr = false }
      continue
    }
    if (ch === "'") inStr = true
    else if (ch === '(') depth++
    else if (ch === ')') depth--
    else if (ch === ',' && depth === 0) n++
  }
  return n
}

const files = readdirSync(DIR).filter((f) => f.endsWith('.sql')).sort()
check('found the SQL files', files.length > 0, `${files.length} files`)

for (const f of files) {
  const sql = strip(readFileSync(join(DIR, f), 'utf8'))

  // ── 1 · every INSERT's column count must equal every VALUES row's count ──
  const inserts = [...sql.matchAll(/insert\s+into\s+([\w.]+)\s*\(([^;]*?)\)\s*values([\s\S]*?);/gi)]
  for (const m of inserts) {
    const [, table, colsRaw, valsRaw] = m
    const nCols = topLevelCount(colsRaw)
    const rows = [...valsRaw.matchAll(/\(([\s\S]*?)\)(?=\s*(?:,\s*\(|\s*$))/g)]
    let bad = 0
    for (const r of rows) if (topLevelCount(r[1]) !== nCols) bad++
    check(`${f} · insert into ${table} — every row matches its ${nCols} columns`,
          bad === 0, bad ? `${bad} of ${rows.length} rows mismatch` : `${rows.length} rows`)
  }

  // ── 2 · a create-if-not-exists table MUST have matching add-column-if-not-exists ──
  // ⛔ This is the D-406 defect. A column in the definition and not in the ALTER
  // list is invisible on a fresh database and fatal on a real one.
  for (const t of [...sql.matchAll(/create table if not exists\s+public\.(\w+)\s*\(([\s\S]*?)\n\);/gi)]) {
    const [, table, body] = t
    const defined = [...body.matchAll(/^\s{2,}(\w+)\s+(?:text|date|bigint|timestamptz|uuid|numeric|boolean|int)\b/gm)]
      .map((x) => x[1])
      // ⛔ A PRIMARY KEY cannot be bolted on with `add column if not exists` in
      // any meaningful way, so demanding one would be a permanent false failure.
      .filter((c) => c !== 'id' && !new RegExp(`\\b${c}\\b[^,\\n]*primary key`, 'i').test(body))
    const altered = new Set(
      [...sql.matchAll(new RegExp(`alter table public\\.${table} add column if not exists\\s+(\\w+)`, 'gi'))]
        .map((x) => x[1]))
    const missing = defined.filter((c) => !altered.has(c))
    check(`${f} · ${table} — every defined column has an idempotent ALTER`,
          missing.length === 0, missing.length ? `missing: ${missing.join(', ')}` : `${defined.length} columns`)
  }
}

console.log(`\n${pass}/${pass + fail} checks passed`)
process.exit(fail === 0 ? 0 : 1)
