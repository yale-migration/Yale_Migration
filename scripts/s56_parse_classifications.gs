/**
 * M9 — parse the classifier's raw output into the S56 TRACKER columns.  (D-342)
 *
 * ===================== WHY THE PARSING IS HERE, NOT IN MAKE =====================
 * The obvious build is for Make to map fifteen fields out of the model's response
 * straight into fifteen sheet columns. I deliberately did not do that.
 *
 *   · A Make mapping cannot be unit-tested. It is verified by running it, which
 *     costs operations and needs a real Department email to arrive.
 *   · Fifteen mappings into a nested model response is fifteen chances to get a
 *     path wrong, and a wrong path writes an EMPTY CELL — not an error. A blank
 *     deadline column looks exactly like "no deadline in this email".
 *   · The one thing that must never silently blank is the one carrying a legal
 *     date.
 *
 * So Make writes **ONE** field — the model's raw JSON — into `Raw Classification`,
 * and this script does the rest. One uncertain mapping instead of fifteen, and
 * the fragile part now lives where `node scripts/test_s56_parse.js` can hammer it.
 *
 * ⛔ IT TRANSCRIBES, IT DOES NOT COMPUTE. Dates are written exactly as the model
 * returned them. `s56_deadline_verifier.gs` then recomputes them independently
 * and flags disagreement. Two jobs, two scripts, two chances to catch an error —
 * if this file also did the arithmetic there would only be one.
 *
 * Safe to run repeatedly: a row is only parsed when `Raw Classification` has
 * content and `Category` is still empty. Re-running touches nothing already done.
 */

var S56P_SHEET_ID = '1ZE1OoTjgO5UyZI4dDxfGoGLy5ojHQibqHpMb3RTQc6k';
var S56P_TAB      = 'S56 TRACKER';
var S56P_FIRST    = 2;

// Column numbers, proven against the header row before anything is written.
var S56P_COL = { RECEIVED:1, NAME:2, SUBCLASS:3, DUE:4, INTERNAL:5, DAYS:6,
                 LETTER:7, SENTENCE:8, TRN:9, APPID:10, FILENO:11, CATEGORY:12,
                 CONFIDENCE:13, REVIEW:14, SUBJECT:15, LINK:16, ASSIGNEE:17,
                 STATUS:18, RAW:19 };

// Below this the model is guessing, and a guess about a legal deadline is worse
// than an admission of uncertainty (spec safety rule 6: never a silent guess).
var S56P_MIN_CONFIDENCE = 0.75;


function parseS56Classifications() {
  var lock = LockService.getDocumentLock();
  if (!lock.tryLock(30000)) { Logger.log('ABORT — could not get the document lock.'); return; }
  try { s56pRun_(); } finally { lock.releaseLock(); }
}


/**
 * Pull a JSON object out of whatever the model/Make actually put in the cell.
 * Handles, in order: a clean object, a ```json fenced block, JSON with prose
 * around it, and a double-encoded string. Returns null rather than throwing —
 * an unparseable cell must become a visible flag, never a crashed run that
 * leaves half the rows done.
 */
function s56pExtractJson_(raw) {
  var s = String(raw == null ? '' : raw).trim();
  if (!s || s === '[object Object]') return null;

  // ```json … ``` or ``` … ```
  var fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) s = fence[1].trim();

  var attempt = function (t) {
    try {
      var o = JSON.parse(t);
      if (typeof o === 'string') o = JSON.parse(o);   // double-encoded
      return (o && typeof o === 'object' && !(o instanceof Array)) ? o : null;
    } catch (e) { return null; }
  };

  var out = attempt(s);
  if (out) return out;

  // Prose either side of the object — take the outermost {...}
  var first = s.indexOf('{'), last = s.lastIndexOf('}');
  if (first > -1 && last > first) return attempt(s.substring(first, last + 1));
  return null;
}


/** First non-empty value among several possible key spellings. */
function s56pPick_(obj, keys) {
  for (var i = 0; i < keys.length; i++) {
    var v = obj[keys[i]];
    if (v !== undefined && v !== null && String(v).trim() !== '') return v;
  }
  return '';
}


function s56pRun_() {
  var sh = SpreadsheetApp.openById(S56P_SHEET_ID).getSheetByName(S56P_TAB);
  if (!sh) { Logger.log('ABORT — no tab named ' + S56P_TAB); return; }

  var hdr = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0]
              .map(function (h) { return String(h || '').trim(); });
  var EXPECT = { 4: 'DUE DATE (legal)', 6: 'Days Allowed', 7: 'Letter Date',
                 8: 'Deadline Sentence', 12: 'Category', 14: 'Needs Review',
                 19: 'Raw Classification' };
  for (var pos in EXPECT) {
    if (hdr[Number(pos) - 1] !== EXPECT[pos]) {
      Logger.log('ABORT — column ' + pos + ' is "' + hdr[Number(pos) - 1] +
                 '", expected "' + EXPECT[pos] + '". Tab shape changed; not writing.');
      return;
    }
  }

  var last = sh.getLastRow();
  if (last < S56P_FIRST) { Logger.log('No rows yet — nothing to parse.'); return; }
  var n = last - S56P_FIRST + 1;

  var rng  = sh.getRange(S56P_FIRST, 1, n, 19);
  var rows = rng.getValues();

  var parsed = 0, already = 0, unparseable = 0, lowConf = 0, notDept = 0, blank = 0;

  for (var i = 0; i < n; i++) {
    var r = rows[i];
    var raw = String(r[S56P_COL.RAW - 1] || '').trim();
    if (!raw) { blank++; continue; }
    if (String(r[S56P_COL.CATEGORY - 1] || '').trim()) { already++; continue; }

    var o = s56pExtractJson_(raw);
    if (!o) {
      // Say so in the sheet. An unreadable classification is a finding.
      r[S56P_COL.CATEGORY - 1] = 'UNPARSEABLE';
      r[S56P_COL.REVIEW - 1]   = 'YES';
      unparseable++;
      continue;
    }

    // Transcribe. Multiple key spellings accepted because the prompt may evolve
    // and a renamed key must not silently blank a legal deadline.
    r[S56P_COL.NAME - 1]     = s56pPick_(o, ['client_name', 'clientName', 'name']);
    r[S56P_COL.SUBCLASS - 1] = s56pPick_(o, ['subclass', 'visa_subclass']);
    r[S56P_COL.DUE - 1]      = s56pPick_(o, ['due_date', 'dueDate', 'deadline_date']);
    r[S56P_COL.INTERNAL - 1] = s56pPick_(o, ['internal_due_date', 'internalDueDate']);
    r[S56P_COL.DAYS - 1]     = s56pPick_(o, ['days_allowed', 'daysAllowed']);
    r[S56P_COL.LETTER - 1]   = s56pPick_(o, ['letter_date', 'letterDate']);
    r[S56P_COL.SENTENCE - 1] = s56pPick_(o, ['deadline_sentence', 'deadlineSentence']);
    r[S56P_COL.TRN - 1]      = s56pPick_(o, ['trn', 'transaction_reference_number']);
    r[S56P_COL.APPID - 1]    = s56pPick_(o, ['application_id', 'applicationId']);
    r[S56P_COL.FILENO - 1]   = s56pPick_(o, ['file_number', 'fileNumber']);
    r[S56P_COL.CATEGORY - 1] = s56pPick_(o, ['category']) || 'UNCATEGORISED';

    var conf = parseFloat(s56pPick_(o, ['confidence']));
    r[S56P_COL.CONFIDENCE - 1] = isNaN(conf) ? '' : conf;

    // ---- when does a human have to look? ----------------------------------
    var flags = [];
    var isDept = o.is_department_request === true || o.is_department_request === 'true';
    var modelWantsReview = o.needs_review === true || o.needs_review === 'true';

    if (modelWantsReview) flags.push('model asked for review');
    if (isNaN(conf)) {
      flags.push('no confidence returned');
    } else if (conf < S56P_MIN_CONFIDENCE) {
      flags.push('confidence ' + conf + ' below ' + S56P_MIN_CONFIDENCE);
      lowConf++;
    }
    // 🔴 A Department request with no deadline evidence is the worst possible
    // silent failure — it looks like an ordinary logged email.
    if (isDept) {
      if (!String(r[S56P_COL.SENTENCE - 1]).trim())
        flags.push('DEPARTMENT REQUEST WITH NO DEADLINE SENTENCE');
      if (!String(r[S56P_COL.LETTER - 1]).trim() || !String(r[S56P_COL.DAYS - 1]).trim())
        flags.push('DEPARTMENT REQUEST MISSING LETTER DATE OR DAYS ALLOWED');
    } else {
      notDept++;
    }

    if (flags.length) r[S56P_COL.REVIEW - 1] = 'YES';
    if (!String(r[S56P_COL.STATUS - 1]).trim()) r[S56P_COL.STATUS - 1] = 'New';
    if (!String(r[S56P_COL.ASSIGNEE - 1]).trim()) r[S56P_COL.ASSIGNEE - 1] = 'Unassigned';
    parsed++;
  }

  rng.setValues(rows);
  SpreadsheetApp.flush();

  Logger.log('=== S56 classification parse ===');
  Logger.log('  newly parsed .................. ' + parsed);
  Logger.log('     of which NOT a Dept request  ' + notDept);
  Logger.log('     of which low confidence .... ' + lowConf);
  Logger.log('  🔴 UNPARSEABLE ................ ' + unparseable);
  Logger.log('  already parsed, left alone .... ' + already);
  Logger.log('  no raw classification ......... ' + blank);
  Logger.log('');
  Logger.log('Now run verifyS56Deadlines() — it recomputes every date independently.');
}
