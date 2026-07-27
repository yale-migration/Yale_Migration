# ARCHITECTURE — Yale Migration MVP

## System map
```
ENQUIRY SOURCES                     BRAIN                          ACTIONS
FB / IG Messenger ──┐
WhatsApp Business ──┤   Google Sheet "MASTER DATABASE"   ──►  OneDrive folders (via Make↔OneDrive conn)
Website→MS email  ──┼─► (automation Google account)      ──►  Checklist emails + upload links (Gmail)
Walk-in sheet     ──┤   tabs: MASTER · ENQUIRIES         ──►  Chase reminders (Gmail/WhatsApp)
Phone log form    ──┘                                    ──►  Notifications to consultants
Gmail project1@ ──► Claude API (classify) ──► label + assign + draft (human sends)
```
All scenarios live in the CLIENT's Make.com org (we are Admin). All data stays in client accounts.

## Data contract — MASTER tab (source of truth)
| Column | Rule |
|---|---|
| Client Code | `YM-2026-#####`, starts 00001, unique, never reused; auto for new rows (Apps Script) |
| Full Name | UPPERCASE preferred (matches folder + file naming "JUAN DELA CRUZ - PASSPORT") |
| Phone | E.164 where possible; dedupe key for enquiries |
| Email | send target for checklists/chasing |
| Visa Type | dropdown: 500, 485, 820/801, 482, 407, 189, 190, 491, 494, 600, 101, 802, 417, SkillsAssessment, EOI, Other |
| Stage | dropdown: Enquiry · Engaged · Documents · Ready to Lodge · Lodged · Outcome · Closed |
| Assigned Consultant | from team roster (pending) |
| Date Added | auto timestamp; drives 7-day rule |
| Source | dropdown: Facebook · Instagram · WhatsApp · Phone · Walk-in · Email · Website · Referral |
| Folder URL | written back by Make after folder creation |

ENQUIRIES tab: Date · Name · Phone · Channel · Visa Interest · Assigned To · Status
(New/Assigned/Contacted/Pending Decision/Not Proceeding/Lost Lead/Converted) · Follow-up Due.

## Folder convention (from client SOPs; verify against model folder when named)
`YM-2026-##### – FULL NAME/` → `01 Enquiry · 02 Identity Documents · 03 Education · 04 Employment ·
05 Financial · 06 Enrolment · 07 Application Forms · 08 Lodgement · 09 Correspondence · 10 Visa Outcome`

## AI usage (client's Anthropic key, stored ONLY in Make connection)
- Email classification: claude-haiku (cheap, 20–50/day) — tool-use JSON schema {category, urgency,
  suggested_assignee, is_s56} — temperature 0, few-shot from client samples.
- Reply drafting: sonnet-class, template-grounded, ALWAYS saved as Gmail draft — never auto-sent.
- Conservative-by-design: confidence < threshold → label "Needs Review" + notify owner. S56 detection
  errs on the side of flagging.

## Message-sending rules
Business hours only (default Brisbane 08:00–20:00, confirm with client) · stop-on-reply for all
sequences · every outbound logged to the sheet · client-approved wording only (👍 in CLIENT-LOG).

## Error handling standard (every Make scenario)
Error route → WhatsApp/email alert to Sharjeel · no silent failures · scenarios idempotent (re-run
safe: check-before-create for folders, dedupe keys for rows) · run log kept in Make history.

## Naming
Make scenarios: `YM-M3-folder-create`, `YM-M5-doc-chase`, `YM-M6-enquiry-fb`… (module-prefixed).
Apps Script files in `scripts/` mirror the sheet functions: `code_assign.gs`, `master_validate.gs`.
