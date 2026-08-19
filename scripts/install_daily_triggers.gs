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
  { fn: 'updateEnquiryFollowUps', hour: 8, what: 'M8 enquiry follow-up cadence (7/30, stop-on-reply)' }
];

// ⛔ Deliberately NOT installed: parseS56Classifications, verifyS56Deadlines.
// M9 is not live, its Make scenario is incomplete and the S56 TRACKER tab may not exist.
// A daily trigger against a missing tab would log an error every morning forever.

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
    if (!planned[h]) Logger.log('  ⚠️ UNPLANNED  ' + h + ' — not in TRIGGER_PLAN. Intended?');
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
