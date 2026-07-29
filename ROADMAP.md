# ROADMAP — MVP (48h) · Status legend: ⬜ not started · 🟡 in progress · ✅ done · 🔒 blocked

Last updated: 2026-07-29 v5 — write access working (D-31); all 6 client samples audited → M9 + M6 specs
written (D-32..D-38). Build order now: M2 sheet → M3-B folder scenario → demo video → M9/M6.

## M1 — Discovery, access & security (3h) — 🟡 90%
- ✅ Kick-off meeting done (2026-07-25); SOPs confirmed against live practice
- ✅ Access: Sheets ✓ ops workbook "YALE BRISBANE OFFICE WORK" ✓ walk-in sheet (via OneDrive) ✓
  Meta BM ✓ Make (Admin) ✓ OneDrive connection (My Drive, tested) ✓ Claude API key ✓
- 🟡 Gmail delegation on project1@ (user doing self, password held meanwhile)
- ✅ OneDrive ACCESS CONFIRMED via direct share (D-21) — folder + IDs verified through Graph API
- ⬜ 2FA on project1@ + password rotation (client, non-blocking)
- 🟡 WhatsApp Business verification — CHECK in Meta Security Centre (don't ask client)
- ✅ Team roster received (routing = team × visa × office, per D-16) · ✅ model folder received (D-18)
- ✅ FULL samples bundle received 29 Jul (S56 letter + requests + email template, student & 485 threads,
  WhatsApp screenshots) — see ACCESS.md materials table. Remaining minor gaps: Detail/Consultation
  forms, roster gaps (Nisha, workvisa.bne@), walk-in sheet location

## M2 — Master data layer (3h) — 🟡 45% · NOW: structure+codes (M2-D inventory 🔒 on client share)
- ✅ MASTER DATABASE sheet created in automation account (MASTER + ENQUIRIES tabs, Stage/Source
  dropdowns, YM-code formula, sample rows)
- ⏸️ M2-D: folder inventory — DEFERRED until after the M3 demo (credit budget, D-22/D-23). Anchor IDs
  ready (ONEDRIVE-IDS.md); when run, use ?$select=name,id&$top=999 + bulk write.
- ⬜ M2-A: restructure MASTER (matter grain, Party-2, Office, Team) — DO NOW, no OneDrive needed
- ⬜ M2-B: YM-2026 auto-code Apps Script + validation/protection — DO NOW
- ⬜ M2-C: intake fields mapped from the client's own "Client Inquiry Form.xlsx" (already shared ✓)
- ⬜ Restructure MASTER to one-row-per-MATTER incl. Party-2 + Office + Team columns (D-11, D-16)
- ⬜ Import real client list from client's sheet → assign codes from YM-2026-00001
- ⬜ Auto-code Apps Script for NEW clients (onEdit/onForm trigger)
- ⬜ Column validation + protect header rows
- ⬜ Client walkthrough + 👍

## M3 — Client intake & auto folder creation (4h) — 🎯 CURRENT PRIORITY · UNBLOCKED END-TO-END (D-31)
- ✅ STEP 1 (gate): WRITE ACCESS WORKING (D-31) — fixed by adding Files.ReadWrite.All scope +
  Reauthorize. Test folder created in client's drive, then deleted. No client action was needed.
- 🟡 M3-A STEP 2: MASTER columns + dropdowns — SPEC WRITTEN (docs/MASTER-SHEET-SPEC.md); apply in sheet
- 🟡 STEP 3: code engine WRITTEN (scripts/master_codes.gs — onEdit + 5-min timer so API-created rows
  also get codes); paste into Apps Script + create trigger
- ✅ M3-B SPEC WRITTEN: scenarios/M3-folder-create.md (6 modules, sanitizer, error handling, ship ladder)
- ⬜ M3-B STEP 4 BUILD: Make scenario YM-M3-folder-create — resolve branch from Office+Team → create
  "YM-2026-##### – FULL NAME" → 10 sub-folders → write Folder URL back to row → error alert (~12 ops)
- ⬜ STEP 5: test 2 fake clients (TEST prefix), verify in OneDrive, delete tests
- ⬜ STEP 6: record 90-sec screen video → send to client (FIRST SHIPPED DELIVERABLE)
- ⬜ Intake trigger (new MASTER row / form) in Make
- ⬜ Make scenario: create OneDrive folder "CODE – FULL NAME" + 10 sub-folders (01 Enquiry…10 Visa
  Outcome, per SOP; replicate model folder)
- ⬜ Name sanitization (per ARCHITECTURE folder rules); existing folders linked, never renamed (D-12)
- ⬜ Write folder URL back to MASTER row; error alert on failure
- ⬜ Test ×5 real cases · client 👍

## M4 — Checklist selector & document request (3h) — ⬜
- ⬜ Checklist map table (visa × onshore/offshore × dependents → template file)
- ⬜ CLIENT ASK: OAuth project1@ into Make's Gmail connection (D-13 — needed to SEND)
- ⬜ Email template w/ upload link (needs client's sent-email samples for tone)
- ⬜ Make scenario: selection → email + log · test · client 👍

## M5 — Document tracking & auto-chasing (4h) — ⬜
- ⬜ Per-client checklist status columns · day-3/day-7 chase scenario (business hours only)
- ⬜ Third-party (school/insurer/embassy) responsible-party field · stop-on-complete · client 👍

## M6 — Enquiry capture hub (8h) — 🔒 partially (WhatsApp waits on Meta verification)
- ✅ Spec written (docs/M6-AUTOREPLY-SPEC.md): 4 qualifying questions designed from scratch (staff ask
  none today), their real holding-reply wording reused, hard-block list for refusal/ART/AAT/cancellation,
  language policy. Evidence: 2 of 3 paid-ad enquiries NEVER answered — the demo argument.
- ⬜ Build FB/IG → Make → ENQUIRIES + auto-reply (wording 👍 needed before live)
- 🔒 WhatsApp Business API channel (blocked until Meta verification = Verified)
- ⬜ Website-form emails (arrive at client's Microsoft email) → capture rule
- ⬜ Walk-in: fold client's walk-in sheet into ENQUIRIES (or replace w/ form)
- ⬜ Dedupe by phone · consultant auto-assignment (needs team roster) · 7-day pending follow-up

## M7 — Phone-call intake & callback queue (4h) — ⬜
- ⬜ Call-log form (fields per phone SOP) → ENQUIRIES · caller lookup view · callback tasks

## M8 — Lead follow-up sequences (2h) — ⬜
- ⬜ 7-day + 30-day lost-lead nudges, stop-on-reply (needs client's follow-up templates)

## M9 — Gmail triage & team delegation (5h) — 🟡 SPEC COMPLETE (docs/M9-EMAIL-AI-SPEC.md, D-32..D-38)
- ✅ Spec: categories+volumes, S56 phrase set (NOT "s56" — D-32), identifier regexes, deadline math
  (D-33), tone/signature block, safety rules, model plan
- ⬜ Build: Haiku classifier w/ tool-use schema · quote-stripper · Mailsuite suppression · draft-only output
- ⬜ S56 urgent flag (real S56 letter + requests + reply template now in hand) · auto-assignment by
  roster · draft replies grounded in their student/485/482 threads · Needs-Review path

## M10 — End-to-end testing with live files (2h) — ⬜ (client to nominate 2–3 test cases)
## M11 — Training & handover (2h) — ⬜ (guides + walkthrough; transfer everything)

## Go-live gates
- ⬜ Make paid plan active (D-15, pass-through) BEFORE live schedules
- ⬜ Every scenario passed the ladder: dry-run → 5 real cases → client 👍 (D-14)

## Payments
- ✅ Commencement 50% ($840) — sent by client (SWIFT, confirm landed)
- ⬜ Final 50% ($840) — on MVP go-live

## Parked (Phase 2/3) — see CHANGE-REQUESTS.md
Quotes+Xero · deadline engine (blueprint = client's S56 workbook) · QC gate · dashboard · advanced AI ·
enrolment tracker · refunds · extra visa lines · appointments · EOI calculator · role routing ·
CRM face (AppSheet vs GoHighLevel evaluation) · business storage upgrade (personal OneDrive 5GB risk)
