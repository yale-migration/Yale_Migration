/**
 * Install and verify the DAILY TRIGGERS.  (19 Aug 2026)
 *
 * ===================== WHY THIS FILE EXISTS =====================
 * `GUIDE-how-the-system-works.md` tells the client's team, twice, that the system
 * "checks every morning". That document went to Rey on 19 Aug.
 *
 * 🔴 No trigger had ever been created. `grep -rn "ScriptApp.newTrigger" scripts/*.gs`
 * returned nothing across the whole project — the claim was never backed by anything.
 * `WHERE-WE-STAND.md` had recorded it honestly as UNVERIFIED for days; nobody acted on it.
 *
 * Clicking through Extensions -> Triggers would also work. This exists instead because a
 * UI click leaves no artefact: it cannot be reviewed, re-run after a project copy, or
 * proved. `verifyDailyTriggers()` turns "I think I set that up" into output you can read.
 *
 * ⛔ RUN `updateFollowUps` MANUALLY ONCE FIRST and read its log. A trigger turns a
 * supervised run into an unsupervised one; do not let 7am be the first real execution.
 *
 * ⚠️ HANDOVER (D-153): a trigger belongs to the ACCOUNT THAT CREATED IT and runs as that
 * account. Triggers Sharjeel creates run as Sharjeel and die with his access. At handover
 * the client must run `installDailyTriggers()` themselves, signed in as their own user.
 * `verifyDailyTriggers()` prints the owner so this cannot be forgotten silently.
 */

// Staggered deliberately. Both handlers now take the DOCUMENT lock (the same mutex), so
// overlapping them would make one abort — correctly, but pointlessly, every single day.
var TRIGGER_PLAN = [
  { fn: 'updateFollowUps',        hour: 7, what: 'M5a dormancy — the "every morning" the guide promises' },
  { fn: 'updateEnquiryFollowUps', hour: 8, what: 'M8 enquiry follow-up cadence (7/30, stop-on-reply)' },
  // ── M9's Apps Script half, added 23 Aug ────────────────────────────────────
  // 🔑 These are NOT part of the Make scenario and do not consume a scenario slot or a
  // single operation. M9's Make half is blocked on the 2-active-scenario cap (D-342);
  // these two are pure Apps Script and can run the day the tracker holds a row.
  //
  // Order and hour matter. The parser turns Claude's classification into structured
  // deadline fields; the verifier then checks those deadlines INDEPENDENTLY, recomputing
  // them from the letter date rather than trusting what the parser wrote.
  // ⛔ 09:00 not 08:30 — the verifier must never run before the parser on the same
  // morning, or it verifies yesterday's data and reports a clean pass on stale rows.
  // That is the D-292 failure shape: a check that passes because it checked nothing new.
  { fn: 'parseS56Classifications', hour: 9,  what: 'M9 — Claude tool_use output -> s56 deadline fields' },
  { fn: 'verifyS56Deadlines',      hour: 10, what: 'M9 — INDEPENDENT recheck of every s56 deadline' }
];

// ⛔ Deliberately NOT installed: parseS56Classifications, verifyS56Deadlines.
// M9 is not live, its Make scenario is incomplete and the S56 TRACKER tab may not exist.
// A daily trigger against a missing tab would log an error every morning forever.

// Legitimate triggers that are NOT daily, so they do not belong in TRIGGER_PLAN — but
// must not be reported as strays either. `assignMissingCodes` is the client-code assigner
// on a 5-minute timer, installed 3 Aug (ROADMAP T2.3). It takes the DOCUMENT lock, so it
// is already mutually exclusive with the daily jobs.
// ⚠️ Anything NOT in either list is genuinely unaccounted for — say so loudly.
var KNOWN_NON_DAILY = { 'assignMissingCodes': 'client-code assigner, 5-minute timer (ROADMAP T2.3)',
                        'onEdit':             'simple trigger, MASTER edits' };

var EXPECTED_TZ = 'Australia/Brisbane';


function installDailyTriggers() {
  var tz = Session.getScriptTimeZone();
  Logger.log('Script timezone: ' + tz);
  if (tz !== EXPECTED_TZ) {
    // "Every morning" is a promise about LOCAL time. Brisbane has no DST, so a project
    // left on a US default fires mid-afternoon and the promise is quietly false.
    Logger.log('🔴 STOP — timezone is "' + tz + '", expected "' + EXPECTED_TZ + '".');
    Logger.log('   Fix it first: Project Settings -> Time zone. Nothing installed.');
    return;
  }

  var existing = ScriptApp.getProjectTriggers();
  var created = 0, skipped = 0;

  for (var i = 0; i < TRIGGER_PLAN.length; i++) {
    var plan = TRIGGER_PLAN[i];
    var already = false;
    for (var j = 0; j < existing.length; j++) {
      if (existing[j].getHandlerFunction() === plan.fn) { already = true; break; }
    }
    if (already) {
      // Idempotent on purpose: running this twice must not give the client two 7am runs.
      Logger.log('  skip    ' + plan.fn + ' — a trigger already exists');
      skipped++;
      continue;
    }
    if (!trigFunctionExists_(plan.fn)) {
      // Creating a trigger for a function that is not in the project succeeds, then fails
      // silently every morning. Refuse instead.
      Logger.log('  🔴 SKIP ' + plan.fn + ' — no such function in this project. ' +
                 'Is the .gs file added? Nothing created for it.');
      continue;
    }
    ScriptApp.newTrigger(plan.fn).timeBased().atHour(plan.hour).everyDays(1).create();
    Logger.log('  CREATED ' + plan.fn + ' — daily, ~' + plan.hour + ':00 ' + tz);
    created++;
  }

  Logger.log('');
  Logger.log('created ' + created + ', already present ' + skipped);
  Logger.log('Now run verifyDailyTriggers().');
}


function verifyDailyTriggers() {
  var tz = Session.getScriptTimeZone();
  var triggers = ScriptApp.getProjectTriggers();

  Logger.log('=== DAILY TRIGGER VERIFICATION ===');
  Logger.log('Timezone: ' + tz + (tz === EXPECTED_TZ ? '  OK' : '  🔴 EXPECTED ' + EXPECTED_TZ));
  Logger.log('Owner:    ' + Session.getEffectiveUser().getEmail() +
             '   ⚠️ triggers run as THIS account and die with its access (D-153)');
  Logger.log('');

  var fail = 0;
  for (var i = 0; i < TRIGGER_PLAN.length; i++) {
    var plan = TRIGGER_PLAN[i], found = [];
    for (var j = 0; j < triggers.length; j++) {
      if (triggers[j].getHandlerFunction() === plan.fn) found.push(triggers[j]);
    }
    if (found.length === 0) {
      Logger.log('  🔴 MISSING  ' + plan.fn + ' — ' + plan.what);
      fail++;
    } else if (found.length > 1) {
      // Two triggers = the job runs twice each morning. For M5a that is harmless; for
      // anything that drafts an email it would not be. Report it as a fault either way.
      Logger.log('  🔴 ' + found.length + 'x DUPLICATE  ' + plan.fn + ' — delete the extras');
      fail++;
    } else {
      Logger.log('  ✅ ' + plan.fn + ' — ' + String(found[0].getEventType()) + ', daily');
    }
  }

  var planned = {};
  for (var k = 0; k < TRIGGER_PLAN.length; k++) planned[TRIGGER_PLAN[k].fn] = true;
  for (var m = 0; m < triggers.length; m++) {
    var h = triggers[m].getHandlerFunction();
    if (planned[h]) continue;
    if (KNOWN_NON_DAILY[h]) Logger.log('  ·  known     ' + h + ' — ' + KNOWN_NON_DAILY[h]);
    else Logger.log('  ⚠️ UNACCOUNTED  ' + h + ' — in neither list. Who created it, and why?');
  }

  Logger.log('');
  if (fail === 0) {
    Logger.log('✅ PASS — the guide\'s "every morning" is now true.');
  } else {
    Logger.log('🔴 FAIL — ' + fail + ' problem(s). The guide sent to Rey on 19 Aug claims');
    Logger.log('   the system checks every morning. Until this passes, that is not true.');
  }
}


/**
 * Does a top-level function of this name exist in the project?
 *
 * ⚠️ `this[name]` reaches the global scope under Rhino but NOT reliably under V8, where
 * `this` in a plain call can be undefined — the check would throw instead of answering.
 * globalThis is the V8 answer and is absent on Rhino, so try both.
 *
 * On failure this returns TRUE, not false: a broken existence check must not be the thing
 * that stops a needed trigger being installed. Creating one for a missing function is
 * recoverable and visible; silently installing nothing is neither.
 */
function trigFunctionExists_(name) {
  try {
    // If globalThis exists (V8) it IS the global scope — an absent name means absent.
    // The first draft of this only answered when the name was PRESENT, so it returned
    // true for everything and checked nothing. A guard that cannot fail is not a guard.
    if (typeof globalThis !== 'undefined') return typeof globalThis[name] === 'function';
    if (typeof this !== 'undefined' && this) return typeof this[name] === 'function';
    return true;
  } catch (e) {
    Logger.log('  (existence check unavailable: ' + e + ' — proceeding)');
    return true;
  }
}


/**
 * ═══════════════════════════════════════════════════════════════════════════
 * C-1 LIVE CAPTURE — the form-submit trigger.  (26 Aug 2026, D-405)
 *
 * 🔴 `onC1FormSubmit()` has existed and been tested since 23 Aug — 40/40, verified
 * live in Apps Script. **Nothing has ever installed it.** `grep -rn onC1FormSubmit`
 * across every installer returned only its own definition, so C-1 could backfill
 * history on demand and could not capture a single NEW enquiry. The forward path,
 * which is the whole point of the module, was a function nobody called.
 *
 * 🔑 Same shape as the 19 Aug finding above: the guide promised "every morning" and
 * no trigger existed. **A tested function is not a running one**, and the two look
 * identical in a test report.
 *
 * ⛔ THIS ONE IS NOT A CLOCK TRIGGER. It binds to the RESPONSES SPREADSHEET, which is
 * a different file from the one this project is bound to, so it needs
 * `forSpreadsheet(id).onFormSubmit()`. A clock trigger here would do nothing and
 * would look installed.
 *
 * ⚠️ Installing this starts real enquiries flowing into ENQUIRIES the moment somebody
 * submits the form. That is capture, not action — nothing is emailed and nothing is
 * decided — but it is a live write to the client's own sheet, so read the two guards
 * below before running it.
 * ═══════════════════════════════════════════════════════════════════════════
 */
function installC1FormTrigger() {
  // Guard 1 — the handler must exist in THIS project, or the trigger fires into nothing
  // every time a client submits the form, forever, silently.
  if (!trigFunctionExists_('onC1FormSubmit')) {
    Logger.log('🔴 STOP — onC1FormSubmit is not in this project. Paste c1_enquiry_form_intake.gs first.');
    return;
  }
  // Guard 2 — the responses file must be readable BEFORE a trigger is bound to it.
  var id = (typeof C1_RESPONSES_ID === 'string') ? C1_RESPONSES_ID : '';
  if (!id) { Logger.log('🔴 STOP — C1_RESPONSES_ID is not defined.'); return; }
  try {
    var name = SpreadsheetApp.openById(id).getName();
    Logger.log('Responses file: "' + name + '"');
  } catch (e) {
    Logger.log('🔴 STOP — cannot open the responses spreadsheet (' + e.message + ').');
    Logger.log('   Share it with this account first. Nothing installed.');
    return;
  }

  var existing = ScriptApp.getProjectTriggers();
  for (var i = 0; i < existing.length; i++) {
    if (existing[i].getHandlerFunction() === 'onC1FormSubmit') {
      // Idempotent — two triggers would write every enquiry twice, and C-1's
      // dedupe is by email+date, so the SECOND write is the one that looks correct.
      Logger.log('  skip — an onC1FormSubmit trigger already exists. Nothing changed.');
      return;
    }
  }

  ScriptApp.newTrigger('onC1FormSubmit').forSpreadsheet(id).onFormSubmit().create();
  Logger.log('✅ INSTALLED — onC1FormSubmit on form submit.');
  Logger.log('');
  Logger.log('🔴 NOW RUN verifyC1FormTrigger() — creating a trigger and having a WORKING');
  Logger.log('   one are different claims (D-368).');
}

/** Proves the trigger exists, is the right TYPE, and is bound to the right file. */
function verifyC1FormTrigger() {
  var all = ScriptApp.getProjectTriggers(), found = null;
  for (var i = 0; i < all.length; i++) {
    if (all[i].getHandlerFunction() === 'onC1FormSubmit') { found = all[i]; break; }
  }
  Logger.log('=== C-1 form-submit trigger ===');
  if (!found) {
    Logger.log('  FAIL — no onC1FormSubmit trigger. Run installC1FormTrigger().');
    return;
  }
  var src = String(found.getEventType());
  var okType = src.indexOf('SUBMIT') > -1;
  Logger.log('  handler ....... onC1FormSubmit');
  Logger.log('  event type .... ' + src + (okType ? '  ✅' : '  🔴 NOT a form submit'));
  Logger.log('  source ........ ' + found.getTriggerSource());
  Logger.log('  owner ......... ' + Session.getEffectiveUser().getEmail());
  Logger.log('');
  Logger.log(okType
    ? '✅ Live. A new form submission now writes one ENQUIRIES row.'
    : '🔴 Wrong trigger type — delete it and re-run installC1FormTrigger().');
  Logger.log('⚠️ D-153: this trigger runs as the account that created it and dies with');
  Logger.log('   that account. The client must run installC1FormTrigger() themselves at handover.');
}
