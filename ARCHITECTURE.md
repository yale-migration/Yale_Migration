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
- **Assigned Consultant:** roster names only. ⛔ **Nisha is a FORMER EMPLOYEE — never in any dropdown** (D-124).

**ENQUIRIES tab (11 columns):** Date · Name · Phone · Email · Channel · Visa Interest · Location ·
Assigned To · Status · Follow-up Due · Notes.

## Folder convention — CLIENT-APPROVED 2 Aug (D-126). Supersedes the SOP's 10-folder tree.
Their SOP's 10 folders were **never implemented** — real folders are flat (D-47). The client chose fewer
folders and asked for work visas to be organised by **application step**.

**Naming:** `YM-2026-##### – FULL NAME` · employer/sponsorship matters:
`YM-2026-##### – COMPANY NAME (SPONSOR)` (D-99). Existing folders are **NEVER** renamed or moved (D-12).

**M3 routes on Visa Type to one of three sets — staff never choose.**
⚠️ **`docs/FOLDER-STRUCTURE-BY-VISA-CATEGORY.md` is the SINGLE AUTHORITY (G6).** The trees below are a
convenience copy for readers of this file — **if they ever differ, the authority doc wins and this copy is the
bug.** Sets derive from **Yale's own checklists** (`docs/FOLDER-STRUCTURE-BY-VISA-CATEGORY.md`), with the client's 2 Aug changes applied:
Health & Character merged into Identity · Work organised by STEP · Partner gets 820/801 sub-folders.

**SET 1 — STANDARD** (500 · 485 · 189/190/191/491/494/186 · 600 · 417 · Skills Assessment · EOI · Bridging · ART · **Other** — this is M3's DEFAULT case)
```
01 Identity & Personal        ← now also holds AFP/NBI police checks, medicals/HAP, OSHC (client merged)
02 Education & Employment     ← CoE, transcripts, completion letter, PTE/IELTS, skills assessment, JRP/PSA
03 Financial
04 Dependents & Relationship  ← their "485 WITH DEPENDENT" checklist needs full relationship evidence
05 Forms & Lodgement
06 Correspondence & Outcome
```
**SET 2 — WORK / EMPLOYER** (482 · 407 · SBS · Nomination) — *by STEP, so the tree shows progress*
```
01 Identity & Personal        ← incl. health & character
02 Step 1 – Sponsorship       ← P&L, ABN/ACN/ASIC, Trust Deed, licences, premises, payroll, menu, SAF, invoices
03 Step 2 – Nomination        ← position description, contract, org chart, LMT/advertising, training plan (407)
04 Step 3 – Visa Lodgement    ← applicant skills assessment, quals, CV, payslips, Form 80/1221, ImmiAccount, TRN
05 Dependents
06 Correspondence & Outcome
```
**SET 3 — PARTNER / FAMILY** (820/801 · 300 · 101 · 802) — *organised by PARTY, mirroring their checklist*
```
01 Applicant Documents        ← passport, AFP/NBI, birth cert, tax returns, super beneficiary letter, medicals
02 Sponsor Documents          ← passport/PR card, tax returns, super letter, income evidence
03 Relationship Evidence
     ├── 820                  ← initial bundle
     └── 801                  ← updated bundle, lodged ~2 years later (client's explicit request)
04 Forms & Lodgement          ← Form 47SP, 40SP, 888 (+ ID of each witness), Form 80, 1229
05 Correspondence & Outcome
```
**Why party-based for partner:** their checklist splits APPLICANT and SPONSOR documents, and the two lists are
nearly identical (both submit passport, police check, tax returns, super letter). Filing by document type would
put two passports together **with no way to tell whose is whose.** No employment folder — partner applicants
submit none.

**Contents of every folder, per set: `docs/FOLDER-STRUCTURE-BY-VISA-CATEGORY.md` — the single authority (G6).**
Disambiguation rule for staff — **state it by NAME, never by number** (numbers differ per set, and SET 2 has
no Forms & Lodgement folder at all): **from the Department → Correspondence & Outcome. Sent to the Department
→ Forms & Lodgement** (SET 2: → `04 Step 3 – Visa Lodgement`).

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
- **s56 client notification uses THEIR template verbatim** (D-117):
  `[NAME]'s file has opened the case officer has requested:` + items verbatim + `We need to submit the
  documents before [DATE]. thank you` — where **[DATE] = internal day-26, never the legal day-28** (D-58).
- Escalation ladder **7 / 14 / 21 / 26 days**, stop-on-reply.
- Attachments: **.zip/.rar cannot be read** — detect, log "compressed bundle", route to a human (D-119).
  Dedupe by document TYPE + client, never filename (the same doc arrives as photo then PDF).
- One s56 may cover **multiple applicants** — parse the applicant table, don't assume one person (D-121).

## Message-sending rules
Business hours only (Brisbane 08:00–20:00) · stop-on-reply on every sequence · every outbound logged to the
sheet · client-approved wording only (👍 recorded in `CLIENT-LOG.md`) · **AI never gives migration advice** —
only the RMA does. MARN **1573959 (Robinder Pal Singh)** appears in signatures (D-60).

## Error handling standard (EVERY scenario, no exceptions)
Error route → alert to Sharjeel · **no silent failures** · idempotent (check-before-create; a row with a
Folder URL is never picked up twice) · failure also written to the row's `Notes` so staff see it where they
work · ship ladder **dry-run → clean up → 5 real cases → client 👍 → live schedule** (D-14).

## Capacity
Make **FREE = 1,000 ops/month** — build and testing only. Folder creation **≈9 ops/matter** (SET 3 ≈10). Live volume
(60–70 enquiries/week + chasing + folders) needs a **paid plan at go-live** (D-15/D-22). Raise at the demo.

## Naming conventions
- Make scenarios: `YM-M3-folder-create`, `YM-M5-doc-chase`, `YM-M9-email-triage` (module-prefixed)
- Make connections: `YM <service> — <account>`
- Apps Script (actual files): `scripts/setup_master_sheet.gs` (one-run builder) ·
  `scripts/master_codes.gs` (code engine: onEdit + 5-minute timer, because onEdit does NOT fire for
  API-created rows)
