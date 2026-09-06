// Loads the REAL s56_link_client_codes.gs and runs it against fake sheets.
// Stubs only the Google runtime. The logic under test is the shipped file.
//
// 🔴 WHAT THIS PROTECTS. The function writes a CLIENT CODE onto a row carrying a
// statutory deadline. Every check below exists because the failure it prevents
// is silent: a deadline attached to the wrong person's file looks exactly like
// one attached to the right person's file. There is no error, no empty screen,
// no clue — just a confident wrong answer on a legal date.
//
// So "does it link" is the least interesting assertion here. The important ones
// are all about when it REFUSES.
const fs = require('fs');
const path = "/Users/muhammadsharjeel/Downloads/SOP'S/yale-build/scripts/s56_link_client_codes.gs";
const src = fs.readFileSync(path, 'utf8');

let LOG = [];
global.Logger = { log: (m) => LOG.push(String(m)) };

function makeSheet(name, rows, width) {
  const grid = rows.map((r) => {
    const c = r.slice();
    while (c.length < width) c.push('');
    return c;
  });
  return {
    getName: () => name,
    getLastRow: () => grid.length,
    getRange(r, c, nr = 1, nc = 1) {
      return {
        getValues: () => {
          const out = [];
          for (let i = 0; i < nr; i++) {
            const row = [];
            for (let j = 0; j < nc; j++) row.push(grid[r - 1 + i]?.[c - 1 + j] ?? '');
            out.push(row);
          }
          return out;
        },
        setValues: (v) => {
          for (let i = 0; i < nr; i++)
            for (let j = 0; j < nc; j++) grid[r - 1 + i][c - 1 + j] = v[i][j];
        },
      };
    },
    _grid: grid,
  };
}

/** master: [[code, theirId, fullName], ...]  tracker: [[name, ...existingCode]] */
function run(master, tracker) {
  LOG = [];
  const M = makeSheet('MASTER', [['Client Code', 'Their Client ID', 'Full Name']]
    .concat(master.map(([code, name]) => [code, '', name])), 3);

  const T = makeSheet('S56 TRACKER',
    [new Array(20).fill('').map((_, i) => (i === 1 ? 'Client Name' : i === 19 ? 'Client Code' : ''))]
      .concat(tracker.map(([name, code]) => {
        const r = new Array(20).fill('');
        r[1] = name;              // B
        r[19] = code || '';       // T
        return r;
      })), 20);

  global.SpreadsheetApp = {
    getActive: () => ({
      getSheetByName: (n) => (n === 'MASTER' ? M : n === 'S56 TRACKER' ? T : null),
    }),
  };
  const stat = (0, eval)(src + '\nlinkS56ClientCodes();');
  return { stat, codes: T._grid.slice(1).map((r) => r[19]) };
}

let pass = 0, fail = 0;
const check = (label, ok, detail) => {
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${label}${ok ? '' : `  — ${detail || ''}`}`);
  ok ? pass++ : fail++;
};

/* ── The one it is supposed to do ─────────────────────────────────────────── */
{
  const { stat, codes } = run([['YM-1', 'Ana Cruz'], ['YM-2', 'Ben Lee']], [['Ana Cruz']]);
  check('links a deadline when exactly one client has that name', codes[0] === 'YM-1', codes[0]);
  check('  and counts it', stat.linked === 1, JSON.stringify(stat));
}

/* ── The refusals. These are the point of the file. ───────────────────────── */
{
  // ⛔ Two clients, same name. Picking either is a 50% chance of putting a legal
  // deadline on a stranger's file. It must pick neither.
  const { stat, codes } = run([['YM-1', 'Ana Cruz'], ['YM-2', 'Ana Cruz']], [['Ana Cruz']]);
  check('🔴 REFUSES when two clients share the name', codes[0] === '', `wrote "${codes[0]}"`);
  check('  and reports it as ambiguous, not as unknown', stat.ambiguous === 1, JSON.stringify(stat));
}
{
  const { stat, codes } = run([['YM-1', 'Ana Cruz']], [['Nobody Here']]);
  check('🔴 REFUSES when no client has that name', codes[0] === '', `wrote "${codes[0]}"`);
  check('  and reports it as unknown', stat.unknown === 1, JSON.stringify(stat));
}
{
  // Someone resolved an ambiguous name by hand. That is a human decision.
  const { stat, codes } = run([['YM-1', 'Ana Cruz'], ['YM-2', 'Ana Cruz']], [['Ana Cruz', 'YM-2']]);
  check('🔴 NEVER overwrites a code a human already typed', codes[0] === 'YM-2', codes[0]);
  check('  and counts it as skipped, not linked', stat.skipped === 1, JSON.stringify(stat));
}
{
  const { codes } = run([['YM-1', 'Ana Cruz']], [['']]);
  check('a blank client name links nothing', codes[0] === '', `wrote "${codes[0]}"`);
}

/* ── Normalisation. Must match the SQL bridge exactly, or the two disagree. ── */
{
  const { codes } = run([['YM-1', '  ana   CRUZ ']], [['Ana Cruz']]);
  check('name match ignores case and extra whitespace', codes[0] === 'YM-1', codes[0]);
}
{
  // ⚠️ The same person listed twice in MASTER under one code is ONE client, not
  // an ambiguity — otherwise a duplicated row would block a perfectly good link.
  const { codes } = run([['YM-1', 'Ana Cruz'], ['YM-1', 'Ana Cruz']], [['Ana Cruz']]);
  check('duplicate MASTER rows for one client still link', codes[0] === 'YM-1', codes[0]);
}

/* ── Shape ────────────────────────────────────────────────────────────────── */
{
  const { codes } = run(
    [['YM-1', 'Ana Cruz'], ['YM-2', 'Ben Lee']],
    [['Ana Cruz'], ['Ben Lee'], ['Ghost'], ['Ana Cruz', 'YM-9']],
  );
  check('handles a mixed sheet in one pass',
        JSON.stringify(codes) === JSON.stringify(['YM-1', 'YM-2', '', 'YM-9']),
        JSON.stringify(codes));
}
{
  const { stat } = run([['YM-1', 'Ana Cruz']], []);
  check('an empty tracker does nothing and does not throw', stat.linked === 0, JSON.stringify(stat));
}

console.log(`\n${pass}/${pass + fail} checks passed`);
process.exit(fail === 0 ? 0 : 1);
