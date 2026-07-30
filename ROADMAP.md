# ROADMAP — Yale Migration MVP (48h)
Legend: ⬜ not started · 🟡 in progress · ✅ done · 🔒 blocked · ⏸️ deferred by decision
**v6 — 2026-07-29** (rewritten clean: removed duplicated lines, fixed stale statuses, added task IDs +
expected outputs, corrected storage note). Build order: **T1 tree-walk → T2 sheet → T3 folder scenario →
T4 DEMO → then M4/M5 → M6/M9.**

---
## 🎯 ACTIVE TASKS (the only things being worked on right now)

### T1 — Map the client-folder tree — ✅ COMPLETE (7 credits used)
- ✅ T1.1 BRISBANE OFFICE → CLIENT FILES · INQUIRY · PARTNER SCHOOL · Service Agreement · APPLICATION FORMS
- ✅ T1.2 CLIENT FILES → ENGAGED CLIENTS · GRANTED · REFUSED OR WITHDRAWN · **Engaged Client Tracker.xlsx**
      (lifecycle folders = their status system, D-41)
- ✅ T1.3 ENGAGED CLIENTS → `CLIENT FILES` (Indian, rev 239) + `CLIENT FILES- FILIPINO TEAM` (D-43/D-46)
- ✅ T1.4a/b 698 + 738 = **~1,436 client folders**; naming chaotic; team routing confirmed (D-44..D-46)
- ✅ T1.4c **Client folders are FLAT — no sub-folders exist** (D-47) → our structure is an improvement,
      needs client 👍 before build
- ✅ T1.5 Tracker readable via workbook API: `Client Tracker` + `Admissions Tracker ` (D-48)

### T1b — Read the client tracker — 🟡 2 of 3 done
- ✅ T1b.1 usedRange = `'Client Tracker'!A1:R49` → 18 cols × 49 rows = **ACTIVE case list, not the full
      register** (D-49). Folder tree (~1,436) = archive.
- ✅ T1b.2 rows 1–3 are TITLE rows (headers at row 4/5; manual F9 timestamp) (D-50)
- ⬜ T1b.3 read `A4:R10` → capture real column headers + 5 sample data rows
- ⬜ T1b.4 map tracker columns → MASTER columns; decide reconciliation rules
Expected output: column mapping table written into `docs/MASTER-SHEET-SPEC.md`.

### T1c — Also check the second sheet (1 call)
- ⬜ usedRange of `Admissions Tracker ` (id {03EB648D-4D8D-45EC-9A2D-89DF01C493FB}) — enrolment pipeline?
      Relevant to Phase 2 enrolment tracker; note the TRAILING SPACE in the name (address by ID).

### T2 — Build the MASTER sheet (SHARJEEL · 30 min · no dependencies)
- ⬜ T2.1 14 headers in row 1, bold, freeze row 1 (`docs/MASTER-SHEET-SPEC.md`)
- ⬜ T2.2 6 dropdowns (Visa Type, Office, Team, Stage, Assigned Consultant, Source)
- ⬜ T2.3 Paste `scripts/master_codes.gs` → Save → Run → Allow permissions
- ⬜ T2.4 Add time-driven trigger: `assignMissingCodes`, every 5 minutes
- ⬜ T2.5 Test: type a name in B2 → code + date appear
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
- 🟡 Gmail delegation on project1@ (Sharjeel's own task; needed for M9 only)
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

### M3 — Client intake & auto folder creation (4h) — 🎯 CURRENT · unblocked end-to-end
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

### M9 — Gmail triage & delegation (5h) — 🟡 spec complete
- ✅ Spec: `docs/M9-EMAIL-AI-SPEC.md` — S56 phrase set (**never "s56"**, D-32), identifier regexes,
  deadline computation (D-33), categories + volumes, tone/signature, safety rules, model plan
- ⬜ Build: Haiku classifier (tool-use schema) · quote-stripper (D-35) · Mailsuite suppression ·
  attachment-driven classification · draft-only output · Needs-Review path
- ⬜ S56 urgent flag + deadline write-back to MASTER
- ⬜ Auto-assignment by roster
- ✅ MARN gate RESOLVED: supervising RMA = Robinder Pal Singh, MARN 1573959, shown in signature (D-60)
- 🔴 **NEW BLOCKER: needs `visa.lodgement@` mailbox access — S56 emails land there (D-64)**
- ⬜ S56 escalation ladder 7/14/21/26 days, internal due date = day 26, legal = day 28 (D-58)
- 🔴 **M9 START GATE — all three must be answered BEFORE the first M9 module is built (D-75).**
  Deliberately NOT asked yet (deferred 31 Jul) so the three items already pending with the client
  aren't diluted. Ask as one message the day M9 starts:
  - a) delegation on `visa.lodgement@yalemigration.com.au` (already asked 30 Jul, no reply)
  - b) **is `yalemigration.com.au` mail on Google Workspace or Microsoft 365?** Determines the whole
       M9 connector path — Gmail modules vs Outlook/Graph. Do NOT infer from the OneDrive account
       (that is a separate personal Microsoft account and proves nothing about their mail).
  - c) **whose mailbox is `visa.lodgement@`?** (roster gap — same unknown as `workvisa.bne@`).
       Needed because delegation must be granted BY the owner.
  - d) Make needs its OWN OAuth on that mailbox, not just human delegation (D-13 pattern) — say this
       in the same breath so it is one approval, not two round-trips.

### M10 — End-to-end testing with live files (2h) — ⬜ client to nominate 2–3 real cases
### M11 — Training, docs & handover (2h) — ⬜ guides + walkthrough + access transfer

---
## GO-LIVE GATES (nothing goes live until all pass)
- ⬜ Make **paid plan** active (D-15) — free tier is 1,000 ops/month, insufficient for live volume
- ⬜ Every scenario through the ladder: dry-run → 5 real cases → client 👍 (D-14)
- ⬜ Error handler + alert on every scenario (no silent failures)
- ⬜ MARN/RMA question resolved before any AI-drafted email goes out (D-37)

## OPEN CLIENT ASKS
🔴 **BLOCKING M9 — ASKED 30 Jul, awaiting reply:** delegation on **`visa.lodgement@yalemigration.com.au`**
   (Department S56 emails arrive there, not project1@/info@ — D-64). S56 detection cannot fire without it.
1. ✅ ANSWERED 30 Jul: S56 wording + cadence (D-58/D-59/D-70) · MARN = Robinder, show it (D-60) ·
   1,400 folders are live retained clients (D-61) · **5 sub-folders** (D-62) · real S56 emails supplied (D-63..D-70)
2. 🟡 ASKED 30 Jul — 👍 on the 5 sub-folder NAMES (proposed set in D-62); building against the proposed
   names in the meantime (they are a variable in the scenario, renaming later costs 2 minutes)
3. 🟡 ASKED 30 Jul — their s56 email screenshot; we DRAFT the template from their real wording (D-70) and
   send for 👍 rather than waiting for them to author one
4. ⬜ Roster gaps: **Nisha**, **workvisa.bne@** owner (now also `visa.lodgement@` — whose is it?)
   ⏸️ DEFERRED 31 Jul — bundled into the M9 start gate above, not asked as a separate message (D-75)
4b. ⏸️ **Is their domain mail Google Workspace or Microsoft 365?** Deferred to the M9 start gate (D-75).
   Blocks nothing in T2/T3/T4 — those are Sheets + OneDrive only.
5. ⬜ 👍 on M6 auto-reply questions + block-list wording (before M6 live)
6. ⬜ 2–3 test client files for M10
7. ⬜ Where the **walk-in/onsite client sheet** lives (candidate: BNE → INQUIRY folder, id in ONEDRIVE-IDS)
8. ⬜ Screenshot of their common S56 client email (client offered to send)

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
