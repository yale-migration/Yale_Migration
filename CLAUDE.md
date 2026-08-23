# Yale Migration — automation build

Client: **Yale Migration and Education Consultants**, Brisbane visa agency. Contact **Robinder Pal
Singh**, MARN 1573959 (WhatsApp, Roman Urdu, short messages). Consultant: Muhammad Sharjeel Saleem.
Engagement: **48h MVP, $1,680, 50/50, $840 received.** Scope = Proposal v3, 19 Jul 2026.
⚠️ **Robinder came via Hardiek Patel, his brother-in-law, whose automation we built** (D-313). A
referral inside a family network — mistakes travel beyond this engagement.

---

## 📍 POSITION AS AT 23 AUG 2026 — read this before anything else

**MVP BUILD: 78% — 38.0 of 49 contracted hours written and tested.**
Modules 31.7/40 (79%) · C-items 6.3/9 (70%). Recomputed from evidence 23 Aug, not carried forward.

| ✅ 100% | M1 M2 M3 M4 M5 M7 M8 · C-3 C-4 |
|---|---|
| 🟡 partial | M9 90% (needs a Make slot) · C-1 90% (dry-run only) · M6 **45%** · C-5 50% · M11 30% |
| ⬜ 0% | M10 (blocked) · C-2 (blocked) |

**Green as at 23 Aug:** 298 Apps Script checks · 79/79 blueprint · hygiene PASS · working tree clean.
M6 and C-1 verified **live in Apps Script**, not just the node harness.

🔑 **11 contracted hours remain and 0.0 of them are unblocked: 8.8 wait on Robinder** (Meta ·
WhatsApp · OneDrive · a Make slot) **and 2.2 on RJ** (3 test-client emails + 1 assessing authority).
**No MODULE is blocked on engineering.**

⛔ **BUT "0.0 hours are ours" WAS WRONG AS A STATEMENT ABOUT THE PROJECT, and it read as
"stop looking" (D-383).** Three pieces of work are ours, unblocked, and none is a contracted module
hour — which is exactly why the hours table hid them:
1. ✅ **DONE 23 Aug — `CALL-RUNBOOK-robinder-friday.md` brought current.** Was 68% and 21 Aug's news;
   now 78%, 8.8 h, the closed pre-import defects, the dashboard quote, and four asks it silently
   dropped (row 28 · DOB · CRM · the templates 👍). 🔴 **It also records that the 21 Aug call never
   happened and Robinder has not been contacted since 13 Aug.**
2. ✅ **DONE 23 Aug — `docs/M8-FOLLOWUP-TEMPLATES.md`.** A-43's two emails, day 7 / day 30, bound to
   `M8_DAY1`/`M8_DAY2` so wording and code cannot drift. Awaiting the RMA's 👍, not our work.
3. ⬜ **STILL OPEN — two written quotes have never been sent:** `QUOTE-P3-DASHBOARD.md` (~21 h) and
   `QUOTE-CR-013-visa-lines.md` (USD 280). **Sharjeel's to send.**

✅ **And the class is now closed with a gate, not a note (D-385).** `scripts/docs_hygiene.py` checks
every live document's ids against their registers, paths against the disk, position numbers against
**`POSITION.json` — the single source, update it FIRST** — and money language inside the fenced blocks
a client actually reads. It runs inside `run_all_tests.sh`, and it **self-tests**: re-injecting each
real defect and proving it fails. ⛔ Read `LESSONS.md` § 7 for the four things it still cannot catch —
including a wrong number in `POSITION.json`, which it would then enforce *consistently everywhere*.

🔑 **The lesson, and it is LESSONS.md pattern 5 wearing a new coat:** *the remaining-hours table only
counts contracted module hours, so work that is real and ours becomes invisible the moment it is not
one.* Never answer "is anything left on our side?" from the hours table alone.

⛔ **AND THE THING THAT MATTERS MORE:** the system has **NEVER PROCESSED A REAL CLIENT.** MASTER holds
14 invented people; ENQUIRIES is empty. The two jobs described as "running daily" are running against
demo rows and an empty tab — they execute, they succeed, they do nothing. **Built is not running.**
▶ **`HONEST-ASSESSMENT.md`** before summarising this project to anyone.

### Live state, verified 23 Aug
- **Make:** 12 scenarios, **all OFF**. M3 · M4 · M9 rescheduled to Mon–Fri 09:00/13:00/17:00
  (5,760 → ~195 polls/month, D-375). ⚠️ `ZZ-OLD-M9-stub-SUPERSEDED-by-7064554` is parked, not deleted.
- **Apps Script:** 4 daily triggers verified — `updateFollowUps` 07:00 · `updateEnquiryFollowUps` 08:00 ·
  `parseS56Classifications` 09:00 · `verifyS56Deadlines` 10:00 · plus `assignMissingCodes` 5-min.
  All CLOCK, Brisbane, owned by `project1@`.
- **Sheets readable by `project1@`:** YALE BRISBANE OFFICE WORK · REYWARD JAKE M GAMOL-2026 ·
  STUDENTS · **Inquiry form (Responses)** · MASTER DATABASE.
- **Import ready:** 38 rows, locked-column gate clean, all pre-stamped `Checklist Filed` (D-352).

### ⛔ Do not repeat these — each cost real time
- **Make RPCs are FREE.** `rpcSpreadsheet` verified the shared sheet at zero operations. Ask "can I
  check this for nothing?" before every check.
- **`Import Blueprint` CREATES a scenario, it does not update one** — and resets its scheduling (D-379).
- **A blueprint import un-does every out-of-blueprint setting.**
- **`var` hoists the declaration, not the value.** A derived constant above its array threw at load and
  broke **every trigger in the project** for 10 minutes (D-364/D-371). `test_gs_loads.js` guards it now.
- **A pipeline's exit status is the last command's** (D-334) — walked into twice, once on the very
  check meant to prove a gate.
- **Before deleting anything in the client's account, read `createdByUser`** — one of seven "junk"
  scenarios was theirs (D-375).
- **The failure inbox is part of shipping.** A green manual run says nothing about the triggers.

---

## 🔴 START HERE — read in this order, nothing else until you know where you are

1. **`WHERE-WE-STAND.md`** — position, gaps, resume point. **This file owns "where are we".**
2. **`CLIENT-ASKS.md`** — what we are waiting on the client for
3. **`INPUTS-REGISTER.md`** — 🔑 **every input the build needs and whether we VERIFIABLY hold it.**
   A row may only be ✅ with a primary source named. Created because `ACCESS.md` marked the Claude
   API key ✅ for weeks when no such connection existed (D-331)
4. **`CLIENT-DATA-INVENTORY.md`** — before touching or asking for any client data
5. `DASHBOARD-TRACKER.md` — if the work touches the dashboard

🧠 **`LESSONS.md` FIRST — six recurring failure shapes distilled from 380 decisions. Two minutes,
and it is most of what `DECISIONS.md` would teach you.**

⛔ **NEVER read `DECISIONS.md` whole — 504KB, it will eat the session.**
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
  **Enforced, not trusted:** `.claude/hooks/git-guard.py` runs `repo_hygiene.py` on every
  `git commit` and denies the commit if it fails (D-329). It checks tracked **and untracked**
  files — the set `git add -A` would stage.
- ⚠️ **`origin` is a PERSONAL GitHub account, not a company org.** 52 commits unpushed.
  **Never push without asking Sharjeel** — company orgs are BrandRadar-AI · Roar-AI-Labs · Apex-AI-Clients.

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
- 🔴 **G9 NOTHING GOES TO THE CLIENT THAT OUR OWN FILES CAN ANSWER.**
  ▶ **`/yale-client-message`** before anything reaches Robinder or the team — the full gate,
  with the dated failures behind each line. Loads only when used (D-329).

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
| **`LESSONS.md`** | 🧠 **the six failure patterns** — read before coding, before writing to the client, before believing a green check |
| **`HONEST-ASSESSMENT.md`** | 🔍 **has any of it helped Yale yet?** — the answer is *not yet* — the uncomfortable one. Read before summarising the project to anyone |
| `CLIENT-ASKS.md` | outstanding balance with the client |
| **`INPUTS-REGISTER.md`** | 🔑 every input the build needs · **verified** state only · what each one blocks |
| `CLIENT-DATA-INVENTORY.md` | every client file, what is in it, what is forbidden |
| `CLIENT-SOP-WORKFLOWS.md` | their own 12 process SOPs — the spec for M5/M6/M7/M9 |
| `DASHBOARD-TRACKER.md` | the dashboard workstream end to end |
| **`MVP-STATUS-simple.md`** | 🗣 **the plain-English status for talking to the client** — no module numbers, what to say, what not to say |
| `DASHBOARD-DEMO-WALKTHROUGH.md` | 🖥 screen-by-screen demo script — what is real, what is not, what not to promise |
| `dashboard/STATE.md` | the Phase-3 web app's own handoff — read before touching that code |
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
✅ Valid backups exist for both scenarios, v1 and v2 (D-315). 🔑 **`scenarios_get` returns any blueprint
over MCP and `scenarios_update` writes it back — never ask anyone to export one from the Make UI.**
**Run `python3 scripts/verify_blueprints.py` before importing or editing either one.**

---

## Stack — decided, do not relitigate

Google Sheet = database (**not** Microsoft — D-299) · Make.com = scenarios · OneDrive = client folders ·
Gmail via Make OAuth on `visa.lodgement@` — **`gmail.modify` is sufficient, nothing needed from the
client** (D-297) · Claude API = email triage · Meta/WhatsApp = enquiry channels ·
Looker Studio = staff dashboard · Next.js + Supabase = client portal (Phase 3, **company hosting only**).

## Session end

▶ **`/yale-ship`** — hygiene gate, WHERE-WE-STAND, DECISIONS + index, CLIENT-LOG, commit.
The procedure lives in the skill so it does not cost context every session (D-329).

⛔ **COMMIT ONLY — never `git push`.** `origin` is a personal GitHub account and this repo
documents client data. Ask Sharjeel first, every time (D-317).
