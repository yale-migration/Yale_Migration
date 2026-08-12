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
 */
var COL = { NAME:3, STAGE:13, OUTCOME:14, LAST_CONTACT:18, NEXT_DUE:19, DATE_ADDED:20, NOTES:23 };
var FIRST_ROW   = 2;
var CHASE_FIRST = 3;    // days after intake if never contacted
var CHASE_NEXT  = 7;    // days after the last contact
var TZ          = 'Australia/Brisbane';   // their clock, not ours (D-163)

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
  var open = 0, dormant = 0, skipped = 0;

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

    var dueDate = addDays_(touch, hadContact ? CHASE_NEXT : CHASE_FIRST);
    due[i][0] = fmt_(dueDate);
    open++;

    var days = Math.floor((today - touch) / 86400000);
    notes[i][0] = stripDormant_(notes[i][0]);
    if (dueDate < today) {
      var msg = 'DORMANT: no contact for ' + days + ' days';
      notes[i][0] = notes[i][0] ? msg + ' | ' + notes[i][0] : msg;
      dormant++;
    }
  }

  dueRange.setValues(due);
  notesRng.setValues(notes);
  SpreadsheetApp.flush();
  Logger.log('Open matters: ' + open + ' | DORMANT: ' + dormant + ' | closed or skipped: ' + skipped);
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
function addDays_(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
function fmt_(d) { return Utilities.formatDate(d, TZ, 'yyyy-MM-dd'); }
function stripDormant_(note) {
  var s = String(note || '');
  return s.replace(/DORMANT: no contact for \d+ days( \| )?/g, '').trim();
}
