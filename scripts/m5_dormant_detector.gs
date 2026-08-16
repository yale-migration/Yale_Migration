/**
 * M5a — DORMANT FILE DETECTOR  (runs daily, zero Make operations)
 *
 * WHY: discovery found real client files with no contact for 16 and 71 days (D-34), and the
 * client's own "48hr Alert" column has been broken with a #REF! for months (D-55). This replaces it.
 *
 * WHAT IT DOES, per open matter:
 *   last touch = Last Contact (R), or Date Added (T) if never contacted
 *   never contacted   -> Next Follow-up Due = last touch + 3 days   (their day-3 chase)
 *   contacted before  -> Next Follow-up Due = last touch + 7 days   (their day-7 chase)
 *   overdue           -> Notes gets "DORMANT: no contact for N days"
 *
 * Closed matters are skipped entirely — never chase a granted or withdrawn file.
 * Idempotent: rewrites the same values, so running twice changes nothing.
 * NO getUi() — it hangs when run from the editor (D-245). Read the Execution log.
 *
 * ==================== THE IMPORT BASELINE — READ BEFORE EDITING ====================
 * The 40 clients coming over from `LODGEMENT JULY TO PRESENT` are LIVE, IN-FLIGHT matters
 * that Yale has been working for weeks. Their contact history lives in WhatsApp and in
 * people's heads — it is in no column we can read, so `Last Contact` imports BLANK.
 *
 * Without a baseline the rule above reads blank as "never contacted", sets due = import
 * date + 3, and on day three flags ALL FORTY as dormant on the client's own dashboard.
 * Every one of those alerts is false, and the day count printed next to it — "no contact
 * for 3 days" — is a claim about their contact history that we cannot support.
 *
 * So: a row whose `Last Contact` is blank AND whose `Date Added` is on or before
 * IMPORT_BASELINE is a HISTORICAL file, not a new intake. It gets CHASE_IMPORTED days
 * measured from the baseline, and a note that states what we actually know — that no
 * contact is LOGGED — never a day count we invented.
 *
 * A genuinely new client added after the baseline still gets the 3-day rule, unchanged.
 *
 * 🔴 Set IMPORT_BASELINE to the date the pilot import runs. Leave it '' until then:
 *    blank disables the whole branch and behaviour is exactly what it is today.
 * ===================================================================================
 */
var COL = { NAME:3, STAGE:13, OUTCOME:14, LAST_CONTACT:18, NEXT_DUE:19, DATE_ADDED:20, NOTES:23 };
var FIRST_ROW   = 2;
var CHASE_FIRST = 3;    // days after intake if never contacted
var CHASE_NEXT  = 7;    // days after the last contact
var TZ          = 'Australia/Brisbane';   // their clock, not ours (D-163)

var IMPORT_BASELINE  = '';   // 'yyyy-MM-dd' on import day. '' = branch off, today's behaviour.
var CHASE_IMPORTED   = 14;   // grace from the baseline before an imported file is called dormant

// A matter is CLOSED when either of these says so — never chase these.
var CLOSED_STAGES   = ['Closed'];
var CLOSED_OUTCOMES = ['Granted', 'Refused', 'Withdrawn'];

function updateFollowUps() {
  var sh = SpreadsheetApp.getActive().getSheetByName('MASTER');
  if (!sh) { Logger.log('ERROR: MASTER tab not found.'); return; }

  var lastRow = sh.getLastRow();
  if (lastRow < FIRST_ROW) { Logger.log('No data rows.'); return; }
  var n = lastRow - FIRST_ROW + 1;

  var names    = sh.getRange(FIRST_ROW, COL.NAME,         n, 1).getValues();
  var stages   = sh.getRange(FIRST_ROW, COL.STAGE,        n, 1).getValues();
  var outcomes = sh.getRange(FIRST_ROW, COL.OUTCOME,      n, 1).getValues();
  var contacts = sh.getRange(FIRST_ROW, COL.LAST_CONTACT, n, 1).getValues();
  var added    = sh.getRange(FIRST_ROW, COL.DATE_ADDED,   n, 1).getValues();
  var dueRange = sh.getRange(FIRST_ROW, COL.NEXT_DUE,     n, 1);
  var notesRng = sh.getRange(FIRST_ROW, COL.NOTES,        n, 1);
  var due      = dueRange.getValues();
  var notes    = notesRng.getValues();

  var today = startOfDay_(new Date());
  var baseline = parseBaseline_(IMPORT_BASELINE);
  if (IMPORT_BASELINE && !baseline) {
    Logger.log('ABORT: IMPORT_BASELINE "' + IMPORT_BASELINE + '" is not a yyyy-MM-dd date.');
    return;   // a mistyped baseline must stop the run, not silently fall back to day-3
  }
  var open = 0, dormant = 0, skipped = 0, imported = 0;

  for (var i = 0; i < n; i++) {
    if (!String(names[i][0]).trim()) continue;                       // blank row

    if (contains_(CLOSED_STAGES,   stages[i][0]) ||
        contains_(CLOSED_OUTCOMES, outcomes[i][0])) {
      due[i][0]   = '';                                              // closed: clear any stale date
      notes[i][0] = stripDormant_(notes[i][0]);
      skipped++;
      continue;
    }

    var hadContact = !!String(contacts[i][0]).trim();
    var touch = startOfDay_(toDate_(hadContact ? contacts[i][0] : added[i][0]));
    if (!touch) { skipped++; continue; }                             // no usable date — leave alone

    // Historical file from the import: blank Last Contact, and it predates the baseline.
    // We do not know when it was last touched, so we never print a day count for it.
    var isImported = !hadContact && baseline && touch <= baseline;

    var dueDate = isImported ? addDays_(baseline, CHASE_IMPORTED)
                             : addDays_(touch, hadContact ? CHASE_NEXT : CHASE_FIRST);
    due[i][0] = fmt_(dueDate);
    open++;
    if (isImported) imported++;

    var days = Math.floor((today - touch) / 86400000);
    notes[i][0] = stripDormant_(notes[i][0]);
    if (dueDate < today) {
      var msg = isImported
        ? 'DORMANT: no contact logged since go-live'
        : 'DORMANT: no contact for ' + days + ' days';
      notes[i][0] = notes[i][0] ? msg + ' | ' + notes[i][0] : msg;
      dormant++;
    }
  }

  dueRange.setValues(due);
  notesRng.setValues(notes);
  SpreadsheetApp.flush();
  Logger.log('Open matters: ' + open + ' | DORMANT: ' + dormant + ' | closed or skipped: ' + skipped);
  Logger.log(baseline
    ? 'Import baseline ' + fmt_(baseline) + ' — ' + imported +
      ' historical file(s) on the ' + CHASE_IMPORTED + '-day grace, due ' +
      fmt_(addDays_(baseline, CHASE_IMPORTED))
    : 'Import baseline NOT SET — every blank Last Contact is treated as a new intake (3-day rule). ' +
      'Set IMPORT_BASELINE on import day or the imported files all flag on day 3.');
}

/** Highlights every overdue row orange. Run once — the formatting then maintains itself. */
function addDormantHighlight() {
  var sh = SpreadsheetApp.getActive().getSheetByName('MASTER');
  var range = sh.getRange('A2:Y1000');
  var rule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND($S2<>"", $S2<TODAY(), $N2="")')
    .setBackground('#FFE0B2')
    .setRanges([range])
    .build();
  var rules = sh.getConditionalFormatRules();
  rules.push(rule);
  sh.setConditionalFormatRules(rules);
  Logger.log('Dormant highlight added — overdue rows turn orange.');
}

function contains_(list, v) {
  v = String(v).trim();
  for (var i = 0; i < list.length; i++) if (list[i] === v) return true;
  return false;
}
function toDate_(v) {
  if (v instanceof Date) return v;
  var s = String(v).trim();
  if (!s) return null;
  var d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}
function startOfDay_(d) { if (!d) return null; var x = new Date(d); x.setHours(0,0,0,0); return x; }

/**
 * Strict. Built from components on purpose — do NOT route this through toDate_().
 *   new Date('2026-08-20') parses as UTC MIDNIGHT, so west of Greenwich the baseline
 *   silently lands a day early, and every imported file gets one day less grace.
 *   new Date('20 August 2026') also parses "successfully", so loose parsing means a
 *   typo in a format we never intended is accepted instead of stopping the run.
 * Returns null for anything that is not exactly yyyy-MM-dd and a real calendar date.
 */
function parseBaseline_(s) {
  s = String(s || '').trim();
  if (!s) return null;
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  var y = +m[1], mo = +m[2], d = +m[3];
  var dt = new Date(y, mo - 1, d);
  dt.setHours(0, 0, 0, 0);
  // rejects 2026-02-31 and friends, which Date silently rolls forward into March
  if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
  return dt;
}
function addDays_(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
function fmt_(d) { return Utilities.formatDate(d, TZ, 'yyyy-MM-dd'); }
// Must strip BOTH note forms. Miss one and the notes column grows a new DORMANT line
// every single day the detector runs — the same row, stacked, until nobody reads it.
function stripDormant_(note) {
  var s = String(note || '');
  return s.replace(/DORMANT: (no contact for \d+ days|no contact logged since go-live)( \| )?/g, '')
          .trim();
}
