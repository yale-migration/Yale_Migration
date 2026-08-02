# ARCHITECTURE — Yale Migration MVP
**v2 — 2026-08-02.** v1 had drifted badly (10-folder tree, 10-column data contract, obsolete Gmail
delegation model, wrong script names). Building T3 from v1 would have produced the wrong structure.
Authority order: `STATUS.md` (where we are) → `ROADMAP.md` (what's next) → this file (how) →
`DECISIONS.md` (why, with a SUPERSEDED INDEX at the top).

## System map
```
ENQUIRY SOURCES                     BRAIN                              ACTIONS
FB / IG Messenger ──┐
WhatsApp Business ──┤   Google Sheet "MASTER DATABASE"      ──►  OneDrive folders (Make↔OneDrive conn)
Website→MS email  ──┼─► (automation Google account)         ──►  Checklist emails (Make↔Gmail project1@)
Walk-in sheet     ──┤   tabs: MASTER · ENQUIRIES            ──►  Chase reminders (Gmail / WhatsApp)
Phone log form    ──┘   · FOLDER INVENTORY (deferred)       ──►  Consultant notifications

visa.lodgement@ (Dept s56) ──► Make↔Gmail conn ──► Claude Haiku classify ──► flag + deadline + DRAFT
                                                     (human always sends)
```
All scenarios live in the **client's** Make org (Owner `info@yalemigration.com.au`; we are member/Admin).
All data stays in client-owned accounts.

## Data contract — MASTER tab (source of truth)
**GRAIN: one row per MATTER, not per person** (D-11). Returning client = NEW row + new code; old row Closed.
Dual-party matters (482 employer+worker, partner applicant+sponsor) = ONE row, counterparty in `Party 2 Name`.

**23 columns A–W. Canonical definition: `docs/MASTER-SHEET-SPEC.md` (v2) — do not restate it here.**
Built by `scripts/setup_master_sheet.gs`. Key positions the code depends on:
`A Client Code · B Their Client ID · C Full Name (typing here triggers the code) · T Date Added · V Folder URL`

Vocabulary is **THEIRS**, not ours (D-51..D-56):
- **Processing Stage:** Enquiry · Engaged · Documents Pending · Documents Complete · Ready for Lodgement ·
  Lodged · Awaiting Outcome · Closed
- **Visa Outcome:** Pending · Granted · Refused · Withdrawn
- **Assigned Consultant:** roster names only. ⛔ **Nisha is a FORMER EMPLOYEE — never in any dropdown** (D-111).

**ENQUIRIES tab (11 columns):** Date · Name · Phone · Email · Channel · Visa Interest · Location ·
Assigned To · Status · Follow-up Due · Notes.

## Folder convention — CLIENT-APPROVED 2 Aug (D-113). Supersedes the SOP's 10-folder tree.
Their SOP's 10 folders were **never implemented** — real folders are flat (D-47). The client chose fewer
folders and asked for work visas to be organised by **application step**.

**Naming:** `YM-2026-##### – FULL NAME` · employer/sponsorship matters:
`YM-2026-##### – COMPANY NAME (SPONSOR)` (D-99). Existing folders are **NEVER** renamed or moved (D-12).

**M3 routes on Visa Type to one of three sets — staff never choose:**

**STANDARD** (500 · 485 · 189/190/491 · 600 · 101/802 · 417)
```
01 Identity & Personal      ← incl. health, insurance, medicals, police checks (client merged these in)
02 Education & Employment
03 Financial
04 Forms & Lodgement
05 Correspondence & Outcome
```
**WORK / EMPLOYER** (482 · 407 · 186 · 494) — *by step, so the tree shows application progress*
```
01 Identity & Personal
02 Education & Employment
03 Step 1 – Sponsorship (SBS 482 / TAS 407)
04 Step 2 – Nomination
05 Step 3 – Visa Lodgement
06 Correspondence & Outcome
```
**PARTNER** (820/801 · 300)
```
01 Identity & Personal
02 Relationship Evidence
     ├── 820
     └── 801          ← 801 documents arrive ~2 years later; must not mix (client's reason)
03 Financial
04 Forms & Lodgement
05 Correspondence & Outcome
```
Contents per visa type: `docs/FOLDER-CONTENTS-CHART.md`.
Disambiguation rule for staff: **from the Department → 05. Sent to the Department → 04.**

**Name sanitization** before creation: uppercase · strip `" * : < > ? / \ |` · collapse double spaces ·
trim trailing dots/spaces · max 100 chars.

## Mailboxes — three, with different jobs (do not conflate)
| Mailbox | Role | Access model |
|---|---|---|
| `visa.lodgement@` | **Department s56 arrives here** (D-64) — Robinder's own address | Make↔Gmail OAuth **as that mailbox**. 🔴 currently 403 insufficient scopes (D-97) |
| `project1@` | outbound sending for M4/M5 | Make↔Gmail OAuth, one-time client login (D-13) |
| `info@` | general/shared; also the **Make account Owner login** | not an automation target |

⛔ **Gmail delegation is NOT part of this architecture.** It is web-UI only and invisible to the Gmail API,
and cannot target an external Gmail at all (D-78/D-79/D-80). Every mailbox the automation touches must be
OAuth'd **as itself**.

## AI usage (client's Anthropic key, stored ONLY in the Make connection)
- **Classification:** Haiku, tool-use JSON schema `{category, urgency, suggested_assignee, is_s56}`,
  temperature 0, few-shot from their real threads.
- **Drafting:** Sonnet-class, template-grounded, **always saved as a Gmail draft — never auto-sent** (D-06).
- Confidence below threshold → label **Needs Review** + notify owner. s56 detection errs toward flagging.
- **s56 client notification uses THEIR template verbatim** (D-104):
  `[NAME]'s file has opened the case officer has requested:` + items verbatim + `We need to submit the
  documents before [DATE]. thank you` — where **[DATE] = internal day-26, never the legal day-28** (D-58).
- Escalation ladder **7 / 14 / 21 / 26 days**, stop-on-reply.
- Attachments: **.zip/.rar cannot be read** — detect, log "compressed bundle", route to a human (D-106).
  Dedupe by document TYPE + client, never filename (the same doc arrives as photo then PDF).
- One s56 may cover **multiple applicants** — parse the applicant table, don't assume one person (D-108).

## Message-sending rules
Business hours only (Brisbane 08:00–20:00) · stop-on-reply on every sequence · every outbound logged to the
sheet · client-approved wording only (👍 recorded in `CLIENT-LOG.md`) · **AI never gives migration advice** —
only the RMA does. MARN **1573959 (Robinder Pal Singh)** appears in signatures (D-60).

## Error handling standard (EVERY scenario, no exceptions)
Error route → alert to Sharjeel · **no silent failures** · idempotent (check-before-create; a row with a
Folder URL is never picked up twice) · failure also written to the row's `Notes` so staff see it where they
work · ship ladder **dry-run → clean up → 5 real cases → client 👍 → live schedule** (D-14).

## Capacity
Make **FREE = 1,000 ops/month** — build and testing only. Folder creation ≈8 ops/matter. Live volume
(60–70 enquiries/week + chasing + folders) needs a **paid plan at go-live** (D-15/D-22). Raise at the demo.

## Naming conventions
- Make scenarios: `YM-M3-folder-create`, `YM-M5-doc-chase`, `YM-M9-email-triage` (module-prefixed)
- Make connections: `YM <service> — <account>`
- Apps Script (actual files): `scripts/setup_master_sheet.gs` (one-run builder) ·
  `scripts/master_codes.gs` (code engine: onEdit + 5-minute timer, because onEdit does NOT fire for
  API-created rows)
