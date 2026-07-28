# ROADMAP — MVP (48h) · Status legend: ⬜ not started · 🟡 in progress · ✅ done · 🔒 blocked

Last updated: 2026-07-26 v2 (roster+model+OneDrive received; D-16..D-18; first task = M2-D inventory)

## M1 — Discovery, access & security (3h) — 🟡 90%
- ✅ Kick-off meeting done (2026-07-25); SOPs confirmed against live practice
- ✅ Access: Sheets ✓ ops workbook "YALE BRISBANE OFFICE WORK" ✓ walk-in sheet (via OneDrive) ✓
  Meta BM ✓ Make (Admin) ✓ OneDrive connection (My Drive, tested) ✓ Claude API key ✓
- 🟡 Gmail delegation on project1@ (user doing self, password held meanwhile)
- ✅ OneDrive share link received — "YALE MIGRATION - ONE SYSTEM" (BNE 63.5GB / PH / TSV / WorkVisa)
- ⬜ 2FA on project1@ + password rotation (client, non-blocking)
- 🟡 WhatsApp Business verification — CHECK in Meta Security Centre (don't ask client)
- ✅ Team roster received (routing = team × visa × office, per D-16) · ✅ model folder received (D-18)
- ✅ ONE email sample received (SBS thread — tone/CC conventions) · 🔒 still pending: S56 letter
  example, Inquiry/Detail forms, follow-up templates, WhatsApp screenshots; roster gaps (Nisha,
  workvisa.bne@); which OneDrive sheet holds onsite/walk-in clients

## M2 — Master data layer (3h) — 🟡 40% · FIRST TASK: M2-D folder inventory (D-17)
- ✅ MASTER DATABASE sheet created in automation account (MASTER + ENQUIRIES tabs, Stage/Source
  dropdowns, YM-code formula, sample rows)
- ⬜ M2-D: Make one-time scenario — export ENGAGED CLIENTS folder tree (all offices/teams) into
  FOLDER INVENTORY tab (name, path, office, team, link) — THIS is the client-list source (D-17)
- ⬜ Restructure MASTER to one-row-per-MATTER incl. Party-2 + Office + Team columns (D-11, D-16)
- ⬜ Import real client list from client's sheet → assign codes from YM-2026-00001
- ⬜ Auto-code Apps Script for NEW clients (onEdit/onForm trigger)
- ⬜ Column validation + protect header rows
- ⬜ Client walkthrough + 👍

## M3 — Client intake & auto folder creation (4h) — ⬜
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
- ⬜ FB/IG messaging → Make → ENQUIRIES tab + auto-reply w/ qualifying questions (wording 👍 needed)
- 🔒 WhatsApp Business API channel (blocked until Meta verification = Verified)
- ⬜ Website-form emails (arrive at client's Microsoft email) → capture rule
- ⬜ Walk-in: fold client's walk-in sheet into ENQUIRIES (or replace w/ form)
- ⬜ Dedupe by phone · consultant auto-assignment (needs team roster) · 7-day pending follow-up

## M7 — Phone-call intake & callback queue (4h) — ⬜
- ⬜ Call-log form (fields per phone SOP) → ENQUIRIES · caller lookup view · callback tasks

## M8 — Lead follow-up sequences (2h) — ⬜
- ⬜ 7-day + 30-day lost-lead nudges, stop-on-reply (needs client's follow-up templates)

## M9 — Gmail triage & team delegation (5h) — 🔒 needs delegation + samples + roster
- ⬜ Claude classification (categories: enquiry/documents/Home Affairs/accounts) — Haiku, tool-use JSON
- ⬜ S56 urgent flag · auto-assignment by roster rules · draft replies (needs samples) · Needs-Review path

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
