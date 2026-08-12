/**
 * seed_demo_rows.gs — puts 14 clearly-fake matters into MASTER so the DASHBOARD can be
 * proven to work with data in it, and so there is something to look at before the real
 * client list arrives.
 *
 * WHY THIS EXISTS: MASTER is empty, so every dashboard number reads 0. A QUERY that is
 * subtly wrong looks identical to a QUERY over no rows. This is the only way to tell
 * them apart before real data lands.
 *
 * ⚠️  THIS IS SAMPLE DATA, NOT CLIENTS.
 *   - every code is DEMO-### so it can never be confused with a real YM-2026-##### code
 *   - every name is invented; no real person appears here
 *   - removeDemoRows() takes all of it out again, cleanly
 *   - 🔴 REMOVE IT BEFORE THE CUTOVER IMPORT (CUTOVER-PLAN.md step 2)
 *
 * SAFE: M3 and M4 are both INACTIVE, so nothing here creates folders or copies files.
 * The DEMO- prefix in column A also stops master_codes.gs from burning real code numbers,
 * because that script only fills a code where column A is blank.
 *
 * RUN:  MASTER → Extensions → Apps Script → paste → Run → seedDemoRows
 *       to undo:                                    Run → removeDemoRows
 */

var SEED_TAB    = 'MASTER';
var DEMO_PREFIX = 'DEMO-';
var FOLDER_STUB = 'https://onedrive.live.com/?id=DEMO';

function seedDemoRows() {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(SEED_TAB);
  if (!sh) { Logger.log('ABORTED — no tab named "' + SEED_TAB + '".'); return; }

  if (countDemo_(sh) > 0) {
    Logger.log('Demo rows are already present. Run removeDemoRows() first if you want a clean reseed.');
    return;
  }

  var rows = demoRows_();
  var start = sh.getLastRow() + 1;
  sh.getRange(start, 1, rows.length, rows[0].length).setValues(rows);
  SpreadsheetApp.flush();

  Logger.log(rows.length + ' demo rows added, starting at row ' + start + '.');
  Logger.log('Open the DASHBOARD tab — every view should now have numbers in it.');
  Logger.log('Expected: 14 clients · 12 open · 4 going quiet · 1 granted · 6 without a folder · 7 without a checklist.');
  Logger.log('REMOVE BEFORE THE REAL IMPORT:  Run → removeDemoRows');
}

function removeDemoRows() {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(SEED_TAB);
  if (!sh) { Logger.log('ABORTED — no tab named "' + SEED_TAB + '".'); return; }

  var last = sh.getLastRow();
  if (last < 2) { Logger.log('Nothing to remove — sheet is empty.'); return; }

  var codes = sh.getRange(2, 1, last - 1, 1).getValues();
  var removed = 0;
  // bottom-up, so deleting a row never shifts the ones still to check
  for (var i = codes.length - 1; i >= 0; i--) {
    if (String(codes[i][0]).indexOf(DEMO_PREFIX) === 0) {
      sh.deleteRow(i + 2);
      removed++;
    }
  }
  SpreadsheetApp.flush();
  Logger.log(removed + ' demo rows removed. MASTER holds only real clients now.');
}

/* ------------------------------------------------------------------ data */

function countDemo_(sh) {
  var last = sh.getLastRow();
  if (last < 2) return 0;
  return sh.getRange(2, 1, last - 1, 1).getValues().filter(function (r) {
    return String(r[0]).indexOf(DEMO_PREFIX) === 0;
  }).length;
}

/** days ago → Date */
function ago_(n) {
  var d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * A–Y, 25 columns:
 * A code · B their id · C name · D party2 · E phone · F email · G location · H visa · I variant
 * J office · K team · L consultant · M stage · N outcome · O grant · P expiry · Q refusal
 * R last contact · S next due · T date added · U source · V folder · W notes · X authority · Y checklist
 */
function demoRows_() {
  var F = FOLDER_STUB, B = '';
  return [
    // ---- open, healthy contact -------------------------------------------------
    r_('001','CL-101','ANJALI SHARMA',    B,'0412 000 101','demo101@example.com','Onshore','485','Main',
       'BRISBANE','INDIAN','RJ','Documents Pending','',B,B,B, ago_(3),  B, ago_(40),'Referral', F, B,'VETASSESS','485_INDIVIDUAL_MASTERS-BACHELORS.pdf'),
    r_('002','CL-102','MARIA SANTOS',     B,'0412 000 102','demo102@example.com','Onshore','482','Main',
       'BRISBANE','FILIPINO','REY','Documents Complete','',B,B,B, ago_(2), B, ago_(35),'Facebook', F, B, B,'482_SKILLS-IN-DEMAND.pdf'),
    r_('003','CL-103','HARPREET SINGH',   B,'0412 000 103','demo103@example.com','Onshore','189','Main',
       'BRISBANE','INDIAN','RJ','Ready for Lodgement','',B,B,B, ago_(1), B, ago_(60),'Website', F, B,'Engineers Australia','189_SKILLED-INDEPENDENT.pdf'),
    r_('004','CL-104','JOSE REYES',       B,'0412 000 104','demo104@example.com','Offshore','500','Main',
       'BRISBANE','FILIPINO','REY','Lodged','',B,B,B, ago_(5), B, ago_(70),'Instagram', F, B, B,'500_STUDENT-OFFSHORE.pdf'),
    r_('005','CL-105','NEHA PATEL',       B,'0412 000 105','demo105@example.com','Onshore','190','Main',
       'BRISBANE','INDIAN','Star','Lodged','',B,B,B, ago_(6), B, ago_(85),'Referral', F, B,'ACECQA','190_SKILLED-NOMINATED.docx'),
    r_('006','CL-106','GRACE MENDOZA',    B,'0412 000 106','demo106@example.com','Onshore','407','Main',
       'BRISBANE','FILIPINO','REY','Lodged','',B,B,B, ago_(4), B, ago_(52),'WhatsApp', F, B, B,'407_TRAINING.pdf'),

    // ---- going quiet — these should shade red on the dashboard -----------------
    r_('007','CL-107','RAJESH KUMAR',     B,'0412 000 107','demo107@example.com','Onshore','485','Main',
       'BRISBANE','INDIAN','RJ','Documents Pending','',B,B,B, ago_(25), ago_(11), ago_(48),'Walk-in', B, B,'TRA', B),
    r_('008','CL-108','ANA CRUZ',         B,'0412 000 108','demo108@example.com','Onshore','820/801','Main',
       'BRISBANE','FILIPINO','REY','Documents Pending','',B,B,B, ago_(19), ago_(5), ago_(44),'Phone', B, B, B, B),
    r_('009','CL-109','SIMRAN KAUR',      B,'0412 000 109','demo109@example.com','Onshore','491','Main',
       'TOWNSVILLE','INDIAN','RJ','Documents Pending','',B,B,B, ago_(31), ago_(17), ago_(66),'Referral', B, B,'VETASSESS', B),
    r_('010','CL-110','MARK VILLANUEVA',  B,'0412 000 110','demo110@example.com','Onshore','189','Main',
       'TOWNSVILLE','FILIPINO','Star','Documents Pending','',B,B,B, ago_(16), ago_(2), ago_(38),'Email', B, B, B, B),

    // ---- variants, so the visa mix is not all "Main" ---------------------------
    r_('011','CL-111','DEV SHARMA',       'ANJALI SHARMA','0412 000 111','demo111@example.com','Onshore','485','Dependent',
       'BRISBANE','INDIAN','Star','Documents Pending','',B,B,B, ago_(12), B, ago_(40),'Referral', F, B,'VETASSESS', B),
    r_('012','CL-112','LIWAYWAY DELA CRUZ','JOSE REYES','0412 000 112','demo112@example.com','Onshore','500','Subsequent Entrant',
       'BRISBANE','FILIPINO','REY','Documents Complete','',B,B,B, ago_(4), B, ago_(30),'WhatsApp', F, B, B, B),

    // ---- decided, so the outcomes view is not empty ----------------------------
    r_('013','CL-113','PRIYA MEHTA',      B,'0412 000 113','demo113@example.com','Onshore','485','Main',
       'BRISBANE','INDIAN','RJ','Lodged','Granted', ago_(9), B, B, ago_(9), B, ago_(150),'Website', F, B,'TRA','485_INDIVIDUAL_MASTERS-BACHELORS.pdf'),
    r_('014','CL-114','CARLO BAUTISTA',   B,'0412 000 114','demo114@example.com','Offshore','500','Main',
       'BRISBANE','FILIPINO','REY','Lodged','Refused', B, B,'Insufficient financial capacity evidence', ago_(14), B, ago_(120),'Facebook', B, B, B, B)
  ];
}

function r_(n, theirId, name, party2, phone, email, loc, visa, variant, office, team,
            consultant, stage, outcome, grant, expiry, refusal, lastContact, nextDue,
            added, source, folder, notes, authority, checklist) {
  return [DEMO_PREFIX + n, theirId, name, party2, phone, email, loc, visa, variant, office, team,
          consultant, stage, outcome, grant, expiry, refusal, lastContact, nextDue,
          added, source, folder, notes, authority, checklist];
}
