> 🔴 **THIS FILE IS THE MODULE CHECKLIST ONLY. IT IS NOT "WHERE WE ARE."**
> Frozen at v7 (31 Jul) and audited 15 Aug as the most contradictory file in the repo — it still shows
> M3 "IN PROGRESS", the demo unsent, routing hardcoded and the Make paid plan as the go-live gate.
> **All four are wrong and were fixed weeks ago.**
> **For current state read `WHERE-WE-STAND.md`. For hours read `HOURS-LEDGER.md`.**
> Only the contracted module list and hour figures below (M1–M11) and the **C-1…C-5 table** are
> authoritative — those are verified correct against Proposal v3.
> ⛔ **Do not update the per-module status section below to "fix" it.** It is frozen on purpose.
> `WHERE-WE-STAND.md` owns status (G6); a second status file drifts and then contradicts the first,
> which is how this file became the most contradictory in the repo in the first place.
> **Last touched 22 Aug 2026** — C-1 unblocked, C-5's SMS half correctly re-marked as out of scope.

# ROADMAP — Yale Migration MVP (48h)
Legend: ⬜ not started · 🟡 in progress · ✅ done · 🔒 blocked · ⏸️ deferred by decision
**v7 — 2026-07-31** (added FOCUS LOCK per PROCESS.md G4; corrected stale T2 detail that still described the
superseded v1 sheet spec; single 🎯 marker so "current" is unambiguous). Build order: **T2 sheet → T3 folder
scenario → T4 DEMO → then M4/M5 → M6/M9.** Read `STATUS.md` first.

---
## 🔴 FOCUS LOCK (G4, PROCESS.md) — ONE active task at a time

**✅ T2 COMPLETE 3 Aug** — MASTER + ENQUIRIES built, code engine live, `YM-2026-00001` issued on test.
**✅ T3 BUILT 3 Aug.** 🎯 **ACTIVE NOW: T3.1 idempotency proof → T3.2 delete test folders → T4 DEMO.**

**PARKED until T4 has shipped:** M9 mailbox connection (runbook frozen, execute at M9 start) · the Gmail
connection video · M4–M8 build work · tracker import of the ~48 rows (after T3).
Anything new that arrives gets ONE LINE in the right file and is dropped. See `STATUS.md`.

---
## ACTIVE TASKS

### T1 — Map the client-folder tree — ✅ COMPLETE (7 credits used)
- ✅ T1.1 BRISBANE OFFICE → CLIENT FILES · INQUIRY · PARTNER SCHOOL · Service Agreement · APPLICATION FORMS
- ✅ T1.2 CLIENT FILES → ENGAGED CLIENTS · GRANTED · REFUSED OR WITHDRAWN · **Engaged Client Tracker.xlsx**
      (lifecycle folders = their status system, D-41)
- ✅ T1.3 ENGAGED CLIENTS → `CLIENT FILES` (Indian, rev 239) + `CLIENT FILES- FILIPINO TEAM` (D-43/D-46)
- ✅ T1.4a/b 698 + 738 = **~1,436 client folders**; naming chaotic; team routing confirmed (D-44..D-46)
- ✅ T1.4c **Client folders are FLAT — no sub-folders exist** (D-47) → our structure is an improvement,
      needs client 👍 before build
- ✅ T1.5 Tracker readable via workbook API: `Client Tracker` + `Admissions Tracker ` (D-48)

### T1b — Read the client tracker — ✅ COMPLETE
- ✅ T1b.1 usedRange = `'Client Tracker'!A1:R49` → 18 cols × 49 rows = **ACTIVE case list, not the full
      register** (D-49). Folder tree (~1,436) = archive.
- ✅ T1b.2 rows 1–3 are TITLE rows (headers at row 4/5; manual F9 timestamp) (D-50)
- ✅ T1b.3 DONE 29 Jul — 14 real columns captured (CLIENT-LOG 29 Jul, D-51..D-56)
- ✅ T1b.4 DONE 29 Jul — mapping + import rules written into `docs/MASTER-SHEET-SPEC.md` v2
Expected output: column mapping table written into `docs/MASTER-SHEET-SPEC.md`.

### T1c — Also check the second sheet (1 call)
- ⬜ usedRange of `Admissions Tracker ` (id {03EB648D-4D8D-45EC-9A2D-89DF01C493FB}) — enrolment pipeline?
      Relevant to Phase 2 enrolment tracker; note the TRAILING SPACE in the name (address by ID).

### ✅ T2 — Build the MASTER sheet — **COMPLETE 3 Aug** · one cleanup left: delete the `TZ TEST` row
*(Corrected 31 Jul: previously said "14 headers / 6 dropdowns / type in B2" from the superseded v1 spec —
stale. The scripts build the v2 layout: **23 headers A–W, 9 dropdowns**, name typed in **C**.)* ⚠️ **Now 25 columns A–Y** — `Skills Authority` (X, D-245) and `Checklist Filed` (Y, D-251) added for M4.
- ✅ **T2.0 SAFETY — DONE 3 Aug** (backup taken, container-bound, preflight clean: no formulas, no data past headers)
      1. Open the sheet → **File → Make a copy** (backup; a script-side column delete has no Ctrl+Z)
      2. Extensions → Apps Script — must be opened **from inside the sheet** (container-bound), else
         `SpreadsheetApp.getActive()` is null
      3. Paste **`setup_master_sheet.gs`** → Save → run **`preflightCheck`** FIRST → read the Execution log
         ⚠️ `preflightCheck` and `setupEverything` live in **setup_master_sheet.gs**;
            `onEdit`, `assignMissingCodes`, `auditDuplicateCodes` live in **master_codes.gs**.
            They are TWO separate script files — add the second with **+ → Script**, never overwrite the first.
      4. If it reports legacy rows / formulas in A or T / data right of the headers: clear or migrate them
         before continuing. Legacy v1 rows put the NAME in column **B**; v2 expects **C**.
- ✅ T2.1 Run `setupEverything` — DONE 3 Aug 02:00, clean (D-157)
      → Allow permissions *(builds 23 headers, 9 dropdowns, date formats, widths, header protection,
      + the ENQUIRIES tab — replaces all the old manual steps)*
- ✅ T2.2 `master_codes.gs` pasted in Code.gs (D-157)
- ✅ T2.3 Trigger installed 3 Aug — `assignMissingCodes` · Time-driven · Minutes timer · every 5 min ·
      notify immediately. One trigger only, no installable onEdit (D-159).
- ✅ T2.4 TEST PASSED — `TEST CLIENT ONE` in C2 → **`YM-2026-00001` in A2** (D-159)
- ✅ T2.5 `auditDuplicateCodes` → **`No duplicate codes ✅`** · `Date Added` = 2026-08-02 confirmed (D-161)
- ✅ T2.6 Test row deleted, `YM-2026-00001` freed (D-161)
- ✅ **T2.7 TIMEZONE FIXED 3 Aug (D-163)** — Apps Script · Sheet · Make all set to **Australia/Brisbane**
      (Make was on Sydney, which shifts to +11:00 in summer). Re-test stamped **2026-08-03** = correct.
      ⚠️ Re-verify all three at M5/M9 build time — s56 deadline maths depends on it.
Expected output: typing a name produces `YM-2026-00001` within seconds.

### ✅ T3 — Folder scenario BUILT AND WORKING (3 Aug, D-187)
- ✅ `YM-M3-folder-create` built: Sheets 2 → OneDrive 12 → Iterator 13 → OneDrive 14 → Aggregator 19 → Sheets 15
- ✅ Client folder + all 6 sub-folders created in the live drive · Folder URL written back to column V
- ✅ Only 1 cell updated (V2) — no other client data touched
- ✅ **T3 PROVEN END-TO-END WITH LIVE SHEET DATA 4 Aug (D-195)** — real row → `YM-2026-00001-DEMO CLIENTS`
      + all 6 sub-folders, every call 201.
- 🎯 **T3.1 NOW: fix the separator to ` – ` (D-196), clean test folders, then RECORD THE DEMO (T4).**
- ⬜ **T3.2 Delete the 7 test folders** from the live Filipino team folder
- ⬜ **T3.3 Error handlers** on OneDrive 12 and 14 (Resume + alert + write error to Notes)
- 🔴 **T3.5 RESTORE ROUTING BEFORE GO-LIVE (D-189)** — parent folder and sub-folder set are currently
      HARDCODED to Brisbane/Filipino + SET 1. Fine for the demo; would misfile Indian-team clients and give
      wrong folders to 482/partner matters. Approach (a) Set-variables with CLICKED chips (untried, cheapest)
      → fallback (b) Router with dropdown filters.
- ⬜ T3.4 Five real cases → client 👍 → enable the 15-minute schedule
      ⛔ **DO NOT enable the schedule until T3.5 is done.**
Expected output: new MASTER row ⇒ folder + sub-folders in the correct office/team branch + link in the sheet.

### ✅ T3 CLOSED 5–6 Aug — all blockers fixed, every branch proven (D-197 … D-233)
Routing · sanitization · SET 3 nesting · error handlers on ALL FOUR external calls · idempotency ·
full test matrix. **TOWNSVILLE/PHILIPPINES are OUT OF SCOPE by client decision (D-230)** — *"we will do in
future, in couples of months"*. Brisbane-only routing is therefore CORRECT, not a gap. Do not re-ask.
Only go-live gate left: **Make Core paid plan**.

### T4 — DEMO (SHARJEEL · 20 min · the first shipped deliverable)
- ⬜ Record 60–90s: name typed → code appears → folder tree exists → link written back
- ⬜ Send to Robinder with one line
Expected output: client sees working automation for the first time.

---
## MODULE STATUS

### M1 — Discovery, access & security (3h) — ✅ 100% (Gmail mailbox verified 3 Aug, D-149)
- ✅ Kick-off 25 Jul; SOPs confirmed against live practice
- ✅ Access: MASTER sheet · ops workbook "YALE BRISBANE OFFICE WORK" · Meta BM · Make (Admin) ·
  Claude API key · OneDrive **read + WRITE** proven (D-31), anchor IDs saved
- ✅ Materials: team roster (D-16) · model folder (D-18) · Client Inquiry Form · full samples bundle
  29 Jul (S56 letter + requests, student & 485 threads, WhatsApp screenshots) → `ACCESS.md`
- ✅ ~~Gmail delegation on project1@~~ — **DROPPED, not applicable** (D-78/D-79/D-80): delegation cannot reach an external Gmail and the API ignores delegated mailboxes. project1@ needs a Make↔Gmail **OAuth** at M4 time (D-13), not delegation.
- 🟡 WhatsApp Business verification — check ourselves in Meta Security Centre (M6 only)
- ⬜ 2FA + password rotation on project1@ (client, non-blocking)

### M2 — Master data layer (3h) — ✅ COMPLETE 3 Aug (D-159/D-161) · tracker import deferred to after the demo
- ✅ MASTER DATABASE sheet exists (MASTER · FOLDER INVENTORY · ENQUIRIES tabs)
- ✅ Spec written: `docs/MASTER-SHEET-SPEC.md` (matter grain D-11, Office+Team D-16)
- ✅ Code engine written: `scripts/master_codes.gs` (onEdit + 5-min timer, D-28)
- ⬜ Apply spec + install script (**= T2**)
- ⬜ Import the ~48 ACTIVE matters from their tracker + assign codes from YM-2026-00001 (D-49)
- ⬜ Protect header row · client walkthrough 👍
- ⏸️ M2-D folder inventory — deferred until after the demo (credit budget D-22/D-23)

### M3 — Client intake & auto folder creation (4h) — 🎯 IN PROGRESS (T3, spec v3)
- ✅ Write-access gate passed (D-31)
- ✅ Scenario spec written: `scenarios/M3-folder-create.md` (router, sanitizer, error handling, ladder)
- ⬜ Build + dry-run + 5 real cases + 👍 (**= T3**) · ⬜ Demo video (**= T4**)

### M4 — Checklist selector & document request (3h) — 🟡 **M4a COMPLETE 8 Aug (D-258)** · M4b buildable now (D-271)
- ⬜ Checklist map: visa × onshore/offshore × dependents × skills-authority → template file
- ⬜ **CLIENT ASK:** OAuth project1@ into Make's Gmail connection (D-13 — required to SEND)
- ⬜ Email template + upload link, tone grounded in their real threads
- ⬜ Build · test · 👍
- Note: onshore/offshore is often implicit — `VISA EXPIRY <MONTH YEAR>` in the subject is the reliable
  signal for an onshore renewal (from the student-thread audit)

### M5 — Document tracking & auto-chasing (4h) — 🟡 **M5a COMPLETE 10 Aug (D-261)**, Apps Script, zero Make ops · M5b buildable now
- ⬜ Per-client checklist status columns
- ⬜ **Dormant-file detector** — highest-value item (D-34: real gaps of 16 and 71 days, no chase)
- ⬜ Day-3/day-7 chases, business hours only, stop-on-reply
- ⬜ Responsible-party field (client / school / insurer / embassy) — third parties owe items too
- ⬜ Test · 👍

### M6 — Enquiry capture hub (8h) — 🟡 spec complete
- ✅ Spec: `docs/M6-AUTOREPLY-SPEC.md` — 4 qualifying questions (staff currently ask none), their real
  holding-reply reused, hard-block list (refusal/ART/AAT/cancellation/s501/expiry), language policy (D-36)
- ⬜ FB/IG → Make → ENQUIRIES + instant auto-reply (**wording 👍 required before live**)
- 🔒 WhatsApp channel — blocked until Meta verification = Verified
- ⬜ Website-form capture (lands in the client's Microsoft mailbox)
- ⬜ Walk-in: fold their separate walk-in sheet into ENQUIRIES (location still to confirm)
- ⬜ Dedupe by phone · consultant auto-assignment via roster · 7-day pending rule
- Evidence for the client: 2 of 3 paid ad enquiries were never answered

### M7 — Phone intake & callback queue (4h) — ⬜
- ⬜ Call-log form per the phone SOP → ENQUIRIES · caller lookup view · callback tasks

### M8 — Lead follow-up sequences (2h) — ⬜
- ⬜ 7-day + 30-day lost-lead cadence, stop-on-reply (their Inquiry SOP rule)

### M9 — Gmail triage & s56 detection (5h) — 🟡 spec complete
- ✅ Spec: `docs/M9-EMAIL-AI-SPEC.md` — S56 phrase set (**never "s56"**, D-32), identifier regexes,
  deadline computation (D-33), categories + volumes, tone/signature, safety rules, model plan
- ⬜ Build: Haiku classifier (tool-use schema) · quote-stripper (D-35) · Mailsuite suppression ·
  attachment-driven classification · draft-only output · Needs-Review path
- ⬜ S56 urgent flag + deadline write-back to MASTER
- ⬜ Auto-assignment by roster
- ✅ MARN gate RESOLVED: supervising RMA = Robinder Pal Singh, MARN 1573959, shown in signature (D-60)
- ⬜ S56 escalation ladder 7/14/21/26 days, internal due date = day 26, legal = day 28 (D-58)
- 🔴 **M9 GATE — ONE ACTION, FROZEN (D-80). Do not re-scope this again.**
  **Robinder authorizes Make's Gmail connection once, signed in as the mailbox that receives the
  Department emails.** That is the entire requirement. Verified against Google + Make primary docs.
  - ✅ Platform: **Google Workspace** (MX `aspmx.l.google.com`, D-76) → Make's **Gmail** connector.
  - ✅ Owner: **Robinder himself** — D-64 header reads `To: ROBINDER PAL SINGH <visa.lodgement@…>`.
       No third party, no roster gap. (Alias vs separate account: he knows; either way he signs in.)
  - ❌ NOT needed: Gmail delegation (web-UI only, invisible to the API — D-79/D-80) · the admin
       Mail-delegation switch · admin.google.com access for us · shared credentials · a new Workspace seat.
  - Plan C only if he refuses to authorize that mailbox: forwarding rule → project1@, or IMAP + app
       password (needs 2SV + admin IMAP; basic auth died May 2025). Degraded — do not lead with either.

### M10 — End-to-end testing with live files (2h) — ⬜ client to nominate 2–3 real cases
### M11 — Training, docs & handover (2h) — ⬜ guides + walkthrough + access transfer
- ⬜ Re-authorize the **OneDrive** Make connection as the client (currently `sharry00010@`, D-31) — or
      confirm with the client that our access stays. Same silent-break risk as the trigger.
- ⬜ 🔴 **Client re-creates the 5-minute `assignMissingCodes` trigger under THEIR account**, then Sharjeel
      deletes his. Triggers are owned by their creator — if ours is removed, code assignment stops SILENTLY
      with no error (D-153).
- ⬜ Delete the 7 leftover "Integration OneDrive" discovery scenarios from the client's Make org (D-154)
- ⬜ Rename the Make organization "My Organization" → `Yale Migration` (D-164)
- ⬜ Tell Robinder his Make org **Region is EU** — Australian client data on EU servers, fixed at signup (D-164)
- ⬜ Rename Apps Script project "Untitled project" → `YM MASTER automation`; fix file name
      `etup_master_sheet.gs` → `setup_master_sheet.gs` (D-154)

---
## GO-LIVE GATES (nothing goes live until all pass)
- ⬜ Make **paid plan** active (D-15) — free tier is 1,000 ops/month, insufficient for live volume
- ⬜ Every scenario through the ladder: dry-run → 5 real cases → client 👍 (D-14)
- ⬜ Error handler + alert on every scenario (no silent failures)
- ✅ MARN/RMA gate RESOLVED (D-60): supervising RMA = Robinder Pal Singh, MARN 1573959, shown in signatures.

## OPEN CLIENT ASKS — 2 Aug: nearly all CLOSED
✅ **M9 MAILBOX FULLY VERIFIED 3 Aug (D-149).** Run-once returned a real message from the
   `visa.lodgement@yalemigration.com.au` INBOX with full body, headers and folder metadata — 1 operation,
   1 credit. Connection + scopes + read access all PROVEN. Nothing outstanding on this item from anyone.
✅ CLOSED 2 Aug: **s56 client template** received (D-117) · **folder structure approved** with 3 changes
   (D-126) · **Nisha = former employee**, roster fully closed (D-124) · full 482 + 485 s56 threads supplied
   (D-118..D-123).
✅ CLOSED 31 Jul: `workvisa.bne@` = Robinder (D-94) · mail platform = Google Workspace (D-76) ·
   `visa.lodgement@` owner = Robinder (D-80).
✅ CLOSED 30 Jul: s56 cadence 7/14/21/26 · MARN shown · 1,400 folders are live clients · fewer sub-folders
   than the SOP's 10 *(the exact structure was superseded 2 Aug by the three folder SETS — D-132)*.
Remaining, none blocking: ⬜ 2–3 test client files (M10) · ⬜ 👍 M6 auto-reply wording (before M6 live) ·
⬜ walk-in sheet location *(likely NOT a client ask — one API call on `BNE → INQUIRY` should find it, ONEDRIVE-IDS)* · ⬜ **Make paid plan** (go-live gate, raise at demo) · ⬜ final 50% on go-live.

✅ **Folder-set question CLOSED (D-130/D-132/D-133)** — the authority doc was found in `docs/`, is
   marked CLIENT-APPROVED, and all three sets match across ARCHITECTURE / M3 spec / authority. Nothing to confirm.


## KNOWN ISSUES TO RAISE AT THE DEMO (not blockers)
- **`info@` drops out of threads after message 1** — the shared inbox never sees the documents or later
  steps, which limits how much M9 can see. Either CC habit changes or we read consultant mailboxes too.
- **No MARN in outbound emails** while consultants give procedural direction (D-37).
- Client documents live on a **personal Microsoft account** — capacity is fine (Brisbane alone is 68 GB,
  so they're on a paid plan), but ownership/governance is worth a Phase-2 recommendation.

## PAYMENTS
- ✅ Commencement 50% ($840) — sent by client (SWIFT); confirm landed
- ⬜ Final 50% ($840) — on MVP go-live

## PARKED — Phase 2/3 (see `CHANGE-REQUESTS.md`)
Quotes+Xero · deadline engine (blueprint = their S56 workbook) · QC gate · Looker dashboard · advanced AI
(doc classify + rename) · enrolment tracker · refunds · extended visa lines · appointment booking · EOI
points calculator · role routing · CRM face (AppSheet vs GoHighLevel) · storage/governance recommendation

---

# 🔴 CONTRACTED MVP ITEMS THAT WERE NEVER ON THIS LIST
**Added 15 Aug 2026 (D-311 → D-315).** All five are inside Proposal v3 scope. None appeared in any
tracking file, so none were built and none were counted. They are MVP work, not Phase 2.
**~9 hours total against the 48h cap — see `HOURS-LEDGER.md`.**

| # | Item | Hrs | State | The thing that decides it |
|---|---|---|---|---|
| **C-1** | **Client intake form** | 2 | 🟢 **UNBLOCKED 21 Aug** | 🔑 **Do not design one.** They already have `Client Enquiry Form` (D-314) and their SOP-CI-001 is built around it. Build to *their* form, or we ship a second form nobody fills in. ✅ **HELD AND READ 21 Aug** — `INQUIRY FORM YALE MIGRATION PINOY`, 9 questions pulled from the form's own payload: Complete Name · Age · Mobile/WhatsApp · Email · Location (Australia\|Philippines) · Current Work Experience · Course completed · Interested in? (10-way checkbox) · free-text situation. **Mapping decided:** 6 map straight to `ENQUIRIES`; Age, Work Experience and Course completed have no column and go to **Notes, not new columns** (A-32). Location translates Australia→Onshore, Philippines→Offshore. ⚠️ A **second form exists for Brisbane/Indian** (A-46) but its link is unreadable — **not a blocker**: both forms target the same 11 `ENQUIRIES` columns |
| **C-2** | **Secure upload link** | 2 | ⬜ | Column **AD `Upload Link`** now exists in MASTER (`add_master_columns_z_to_ad.gs`). Needs the generator + the wording that goes to the client |
| **C-3** | **Third-party responsible-party tracking** | 2 | ⬜ | Columns **AB `Third Party`** + **AC `Third Party Status`**. Their SOPs name employer · college · RTO · assessing authority as blockers on the client's own file |
| **C-4** | **Received / missing status per client** | 2 | ⬜ | Columns **Z `Docs Received`** + **AA `Docs Outstanding`**. 🔑 **AA is what the M5b chase email lists** — without it M5b can only say "something is missing" |
| **C-5** | **Referral + SMS enquiry channels** | 1 | 🔒 **PART BLOCKED** | **Not a column.** `Source` (U) already exists — it needs `Referral` and `SMS` added to its dropdown, plus a capture path for each. ⛔ **SMS SENDING IS NOT IN SCOPE AND NOT POSSIBLE TODAY** (CR-015, 22 Aug): a `Source` value records where a lead *came from*; it is **not a send path**. Texting needs a paid gateway, sender-ID registration and opt-out handling, none of which is in any plan or quote. **Never let "SMS is already in the dropdown" be read as "SMS nearly works."** |

⚠️ **C-2 → C-4 depend on the five new MASTER columns.** Those go **STRICTLY RIGHT OF Y** — M4 addresses
MASTER by numeric index, so a column inserted left of Y makes it file the wrong checklist and report
success. `scripts/add_master_columns_z_to_ad.gs` enforces this and refuses to run if the shape is wrong.

## Gaps found in the visa coverage itself (15 Aug)
Reading their live `LODGEMENT JULY TO PRESENT` (42 rows) against M4's router:

| Their value | Rows | Status |
|---|---|---|
| `186` Employer Nomination | 1 | 🔴 **GAP** — in their fee master and their live pipeline, but in **neither** MASTER's dropdown **nor** M4's router. A real subclass we simply do not handle |
| `600` Tourist | 1 | ⬜ no checklist in the canonical set — out of scope unless A-19 says otherwise |
| `PARTNER VISA` | 1 | ⚠️ ambiguous — 820/801 onshore or 309/100 offshore. Needs one word from them |
| `Citizenship` | 2 | ⬜ not a visa application |
| `ART` | 1 | ⬜ tribunal review, not a visa application |

**6 of 42 live rows (14%) are things M4 cannot file.** Before the E2 guard they would have looped
forever; now they land as `NEEDS REVIEW`. That is correct behaviour, not coverage.
