# Yale Migration — automation build

Client: **Yale Migration and Education Consultants**, Brisbane visa agency. Contact **Robinder Pal
Singh**, MARN 1573959 (WhatsApp, Roman Urdu, short messages). Consultant: Muhammad Sharjeel Saleem.
Engagement: **48h MVP, $1,680, 50/50, $840 received.** Scope = Proposal v3, 19 Jul 2026.
⚠️ **Robinder came via Hardiek Patel, his brother-in-law, whose automation we built** (D-313). A
referral inside a family network — mistakes travel beyond this engagement.

---

## 🔴 START HERE — read in this order, nothing else until you know where you are

1. **`WHERE-WE-STAND.md`** — position, gaps, resume point. **This file owns "where are we".**
2. **`CLIENT-ASKS.md`** — what we are waiting on the client for
3. **`CLIENT-DATA-INVENTORY.md`** — before touching or asking for any client data
4. `DASHBOARD-TRACKER.md` — if the work touches the dashboard

⛔ **NEVER read `DECISIONS.md` whole — 350KB, it will eat the session.**
Use `DECISIONS-INDEX.md` to find the number, then `grep -A 25 "^D-297" DECISIONS.md`.
Regenerate with `bash scripts/gen_decisions_index.sh` after appending.

---

## 🔴 HARD RULES — never break

**Client data**
- All client workbooks live in **`SOP'S/client-data/`**, OUTSIDE this repo. Keep them there.
- ⛔ **~1,200 plaintext credentials** across those files, incl. **ImmiAccount logins** and staff phone
  PINs (D-306). **If a column name contains `password`, `username`, `OTP`, `PIN` or
  `security question`, it is excluded from every read, import, log line and message. No exceptions.**
- **NO SECRETS in this repo** — no keys, no passwords, no client PII.

**Professional**
- **AI never auto-sends migration advice.** Only the RMA advises. Every draft routes to human review.
- **Everything is built in CLIENT-owned accounts.** We hold invited access only.

**Commercial**
- **New client requests are NOT scope** → log in `CHANGE-REQUESTS.md` + `PHASE-2-3-BACKLOG.md`, reply
  *"Phase 2/3 list mein daal diya"*, keep building. **Never absorb. Quote before working.**
- 🔴 **We already gave away ~16h of Phase 2/3 free** (`HOURS-LEDGER.md`). Do not repeat it.
- ⚠️ Robinder's recurring ask is **multi-branch oversight** — CR-001 → 007 → 009 → 010 → 012. One
  need, five shapes. Largest revenue opportunity in the account.

---

## ⚠️ THE GATES — each exists because of a dated failure

- **G1 VERIFY BEFORE INSTRUCT** — no capability, UI path or limit reaches the client until verified
  against a **primary source this session**. Memory does not count.
- **G2 SEARCH OURSELVES FIRST** — before asking the client anything, grep `DECISIONS-INDEX` +
  `CLIENT-LOG` + `ACCESS` **and `access/` + `New-docs/` — the folders they actually sent.**
  🔴 A summary that omits something reads identically to a summary of something that never existed
  (D-310: we asked for a staff roster we had held for three weeks).
- **G3 SAME-DAY LOG** — `CLIENT-LOG.md` every day. A 13-day gap caused D-310.
- **G4 ONE FOCUS** — one active task. Depth on the wrong thing looks like progress.
- **G5 CLIENT MESSAGE GATE** — one ask · verified · exact account named · not a repeat ·
  **name the exact FILE, TAB and PATH.**
- **G6 SINGLE SOURCE** — one authority per fact. Copies drift and cause wrong builds.
- **G7 DECISION IDs FROM MAX, NOT COUNT.**
- **G8 OPEN THE FILE.** 🔴 *"Not relevant" is a conclusion that requires opening the file, never a
  starting assumption.* Broken three times: a 1MB workbook known by name (D-305), twelve `.png` SOPs
  (D-307), the fee master (D-312). **A filename is not evidence of content. A file type is not a
  relevance signal.**
- 🔴 **Before ANY access request: `connections_get`, NOT `connections_list`.** List returns a *count*;
  get returns the *scope strings*. We nearly asked twice for access already granted (D-271, D-297).

Full text of the gates: `PROCESS.md`.

---

## ⚠️ Before building or switching on any scenario

**`DEFINITION-OF-DONE.md`** — 12 points. M3 ran four times successfully and still had five production
blockers. **Working ≠ production-ready.**

**Make filter operators: only `exist` · `notexist` · `text:equal` · `text:notequal` work.**
`text:contains` is accepted and then **evaluates false silently** (D-255).

**Never show a client a report that has not been run against data** — an empty dashboard renders a
broken formula and a correct one identically (D-292…D-296).

---

## 📁 File map

| File | Owns |
|---|---|
| **`WHERE-WE-STAND.md`** | 🔑 position · gaps · resume point |
| `CLIENT-ASKS.md` | outstanding balance with the client |
| `CLIENT-DATA-INVENTORY.md` | every client file, what is in it, what is forbidden |
| `CLIENT-SOP-WORKFLOWS.md` | their own 12 process SOPs — the spec for M5/M6/M7/M9 |
| `DASHBOARD-TRACKER.md` | the dashboard workstream end to end |
| `HOURS-LEDGER.md` | hours vs the 48h cap |
| `DECISIONS-INDEX.md` → `DECISIONS.md` | why anything was decided |
| `CHANGE-REQUESTS.md` · `PHASE-2-3-BACKLOG.md` | billable work beyond MVP |
| `ACCESS.md` | access inventory **+ the staff email roster** |
| `CLIENT-LOG.md` | chronological client record |
| `ARCHITECTURE.md` · `PRODUCTION-READINESS.md` | design · blockers between works and can-switch-on |
| `ROADMAP.md` | ⚠️ module list + contracted hours ONLY. Stale on everything else |
| `scripts/` · `scenarios/` | Apps Script · Make blueprints |
| `docs/05-canonical-checklists/` | the ONLY set M4 may select from — 28 files, hash-recorded |

⛔ `scenarios/M4-checklist-file.blueprint.BROKEN-DO-NOT-RESTORE.json` — pre-D-255, would break silently.
**There is currently no valid M4 backup.**

---

## Stack — decided, do not relitigate

Google Sheet = database (**not** Microsoft — D-299) · Make.com = scenarios · OneDrive = client folders ·
Gmail via Make OAuth on `visa.lodgement@` — **`gmail.modify` is sufficient, nothing needed from the
client** (D-297) · Claude API = email triage · Meta/WhatsApp = enquiry channels ·
Looker Studio = staff dashboard · Next.js + Supabase = client portal (Phase 3, **company hosting only**).

## Session end — every time, no exceptions

Update `WHERE-WE-STAND.md` · append `DECISIONS.md` + run `gen_decisions_index.sh` ·
`CLIENT-LOG.md` same day · then
`git add -A && git commit -m "<module>: <what changed>" && git push`
