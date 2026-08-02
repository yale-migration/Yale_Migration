# ROADMAP — Yale Migration MVP (48h)
Legend: ⬜ not started · 🟡 in progress · ✅ done · 🔒 blocked · ⏸️ deferred by decision
**v7 — 2026-07-31** (added FOCUS LOCK per PROCESS.md G4; corrected stale T2 detail that still described the
superseded v1 sheet spec; single 🎯 marker so "current" is unambiguous). Build order: **T2 sheet → T3 folder
scenario → T4 DEMO → then M4/M5 → M6/M9.** Read `STATUS.md` first.

---
## 🔴 FOCUS LOCK (G4, PROCESS.md) — ONE active task at a time

**🎯 ACTIVE NOW: T2 — build the MASTER sheet.** Both scripts written + verified. ~10 min, no dependencies.
**Then T3 → T4 (demo) in strict order. Nothing else.**

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

### 🎯 T2 — Build the MASTER sheet (SHARJEEL · **10 min** · no dependencies) — ACTIVE
*(Corrected 31 Jul: previously said "14 headers / 6 dropdowns / type in B2" from the superseded v1 spec —
stale. The scripts build the v2 layout: **23 headers A–W, 9 dropdowns**, name typed in **C**.)*
- ⬜ **T2.0 SAFETY FIRST (D-145 — the tabs are NOT empty; they were hand-built 25 Jul under the v1 layout)**
      1. Open the sheet → **File → Make a copy** (backup; a script-side column delete has no Ctrl+Z)
      2. Extensions → Apps Script — must be opened **from inside the sheet** (container-bound), else
         `SpreadsheetApp.getActive()` is null
      3. Paste **`setup_master_sheet.gs`** → Save → run **`preflightCheck`** FIRST → read the Execution log
         ⚠️ `preflightCheck` and `setupEverything` live in **setup_master_sheet.gs**;
            `onEdit`, `assignMissingCodes`, `auditDuplicateCodes` live in **master_codes.gs**.
            They are TWO separate script files — add the second with **+ → Script**, never overwrite the first.
      4. If it reports legacy rows / formulas in A or T / data right of the headers: clear or migrate them
         before continuing. Legacy v1 rows put the NAME in column **B**; v2 expects **C**.
- ⬜ T2.1 Run `setupEverything`
      → Allow permissions *(builds 23 headers, 9 dropdowns, date formats, widths, header protection,
      + the ENQUIRIES tab — replaces all the old manual steps)*
- ⬜ T2.2 Paste `scripts/master_codes.gs` → Save → Run `assignMissingCodes` → Allow
- ⬜ T2.3 Triggers (⏰) → Add trigger → `assignMissingCodes` → Time-driven → Minutes → **every 5 minutes**
- ⬜ T2.4 Test: type a name in **C2** (Full Name) → code appears in **A2**, date in **T2**
- ⬜ T2.5 Run **`auditDuplicateCodes`** → expect `No duplicate codes ✅`
- ⬜ T2.6 **DELETE the test row AND its code** — otherwise the client's genuinely-first client becomes
      `YM-2026-00002`, which is permanent and visible (D-145)
Expected output: typing a name produces `YM-2026-00001` within seconds.

### T3 — Build the folder scenario (JOINT · ~90 min · after T1+T2)
- ⬜ Build `YM-M3-folder-create` per `scenarios/M3-folder-create.md` (6 modules)
- ⬜ Dry-run 2 test rows → verify in OneDrive → delete tests
- ⬜ 5 real cases → client 👍 → enable 15-min schedule
Expected output: new MASTER row ⇒ folder + sub-folders in the correct office/team branch + link in the sheet.

### T4 — DEMO (SHARJEEL · 20 min · the first shipped deliverable)
- ⬜ Record 60–90s: name typed → code appears → folder tree exists → link written back
- ⬜ Send to Robinder with one line
Expected output: client sees working automation for the first time.

---
## MODULE STATUS

### M1 — Discovery, access & security (3h) — 🟡 95%
- ✅ Kick-off 25 Jul; SOPs confirmed against live practice
- ✅ Access: MASTER sheet · ops workbook "YALE BRISBANE OFFICE WORK" · Meta BM · Make (Admin) ·
  Claude API key · OneDrive **read + WRITE** proven (D-31), anchor IDs saved
- ✅ Materials: team roster (D-16) · model folder (D-18) · Client Inquiry Form · full samples bundle
  29 Jul (S56 letter + requests, student & 485 threads, WhatsApp screenshots) → `ACCESS.md`
- ✅ ~~Gmail delegation on project1@~~ — **DROPPED, not applicable** (D-78/D-79/D-80): delegation cannot reach an external Gmail and the API ignores delegated mailboxes. project1@ needs a Make↔Gmail **OAuth** at M4 time (D-13), not delegation.
- 🟡 WhatsApp Business verification — check ourselves in Meta Security Centre (M6 only)
- ⬜ 2FA + password rotation on project1@ (client, non-blocking)

### M2 — Master data layer (3h) — 🟡 45% → completes with T2
- ✅ MASTER DATABASE sheet exists (MASTER · FOLDER INVENTORY · ENQUIRIES tabs)
- ✅ Spec written: `docs/MASTER-SHEET-SPEC.md` (matter grain D-11, Office+Team D-16)
- ✅ Code engine written: `scripts/master_codes.gs` (onEdit + 5-min timer, D-28)
- ⬜ Apply spec + install script (**= T2**)
- ⬜ Import the ~48 ACTIVE matters from their tracker + assign codes from YM-2026-00001 (D-49)
- ⬜ Protect header row · client walkthrough 👍
- ⏸️ M2-D folder inventory — deferred until after the demo (credit budget D-22/D-23)

### M3 — Client intake & auto folder creation (4h) — next after T2 · unblocked end-to-end
- ✅ Write-access gate passed (D-31)
- ✅ Scenario spec written: `scenarios/M3-folder-create.md` (router, sanitizer, error handling, ladder)
- ⬜ Build + dry-run + 5 real cases + 👍 (**= T3**) · ⬜ Demo video (**= T4**)

### M4 — Checklist selector & document request (3h) — ⬜
- ⬜ Checklist map: visa × onshore/offshore × dependents × skills-authority → template file
- ⬜ **CLIENT ASK:** OAuth project1@ into Make's Gmail connection (D-13 — required to SEND)
- ⬜ Email template + upload link, tone grounded in their real threads
- ⬜ Build · test · 👍
- Note: onshore/offshore is often implicit — `VISA EXPIRY <MONTH YEAR>` in the subject is the reliable
  signal for an onshore renewal (from the student-thread audit)

### M5 — Document tracking & auto-chasing (4h) — ⬜
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
