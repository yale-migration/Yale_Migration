# WHERE WE STAND — 15 Aug 2026
**The one file to read after a context reset.** Written after a full census of all 181 client files.
`STATUS.md` has the history; this is the position, the gaps, and the resume point.

---

# 1 · MVP PROGRESS — 11 modules

| # | Module | State | Notes |
|---|---|---|---|
| M1 | Discovery | ✅ **done** | ⚠️ reopened twice — see §4 |
| M2 | Master data layer | ✅ built · 🔴 **empty** | MASTER + ENQUIRIES live. Needs the import |
| M3 | Intake → folders | ✅ **proven + hardened** | 3 folder sets, both teams, idempotent · **v2 catch-all 15 Aug (E1)** · **OFF** |
| M4a | Checklist select + file | ✅ **proven + hardened** | 0 errors, real files copied · **v2 guard 15 Aug (E2)** · **OFF** |
| M4b | Checklist email draft | 🟢 **buildable now** | nothing needed from client (D-297) |
| M5a | Dormancy detection | ✅ **running daily** | unattended since 10 Aug |
| M5b | Chase email draft | 🟢 **buildable now** | manager + consultant (D-266) |
| M6 | Enquiry capture | 🟠 spec'd, unbuilt | 🔑 **now has a real cadence: 7 and 30 days** (D-307) |
| M7 | Phone intake | ⬜ **NOT STARTED** — no spec of ours exists | 🔑 **their SOP found — 13 steps + QC list** (D-307) |
| M8 | Follow-up engine | ⬜ **NOT STARTED** | ⛔ *"partly = M5" was wrong* — M5 chases documents on open matters; M8 nurtures leads at 7/30 days over ENQUIRIES. No overlap |
| M9 | Email triage / s56 | 🟠 spec'd, unbuilt | 🔑 **their 7/14/28 ladder found, already lapsing** (D-305) |
| M10 | Testing | ⬜ | needs 2–3 real files |
| M11 | Handover | ⬜ | **1** connection is ours: 9279810 OneDrive, `sharry00010@`, used by **8 of 11 scenarios**, no expiry recorded |
| — | **Dashboard** | ✅ built + prototype | not in MVP scope — goodwill |

**Honest: ~26%** — 10.5 of 40 contracted build-hours, audited 15 Aug (D-311).
⛔ The former "53%" is retracted. **~47 of 48 contract hours are consumed**, the gap being ~16 hours
of absorbed out-of-scope work. See `HOURS-LEDGER.md`.

**Ops: 481 / 1,000 — 519 left, resets 25 Aug.** Both scenarios deliberately OFF.
The 15 Aug fix work cost **0 ops** — blueprints were edited over MCP, never run.
📌 A one-click reader scenario **`YM-TMP-read-checklist-map` (id 6959410)** is parked in Make, on-demand
and inactive. Press **Run once** and it prints the live `CHECKLIST MAP` tab (1 op). Delete when done.

---

# 2 · 🎯 RESUME HERE

**REVISED 15 Aug after E1/E2 were fixed and the import source was actually opened (D-315).**

## ✅ Done this session — verified, not assumed
| | What | Evidence |
|---|---|---|
| **E1** | M3 catch-all route — an unroutable row can no longer loop forever | applied via MCP, **re-fetched from Make and confirmed**; `verify_blueprints.py` 31/31 |
| **E2** | M4 guard stamps the row **before** the lookup — an unmapped visa can no longer loop, and a failed write can no longer duplicate files | same |
| **Backups** | `M4-checklist-file.blueprint.json` pulled **live**, post-D-255, zero `text:contains`. M3's committed backup diffed against live — current | ⛔ *"there is no valid M4 backup"* is **retracted** |
| **A-09** | closed **without asking the client** — its premise was wrong | D-315 |
| **E3** | `scripts/add_master_columns_z_to_ad.gs` written — refuses to run if MASTER's shape is not exactly as M4 expects | needs Sharjeel to run it |
| **Pilot** | `scripts/build_pilot_import.py` — maps their real list, predicts the outcome, writes outside the repo | **~56 ops, not ~130** |

## ▶ Next, in this order
| # | Task | Hrs | Blocked? |
|---|---|---|---|
| **1** | **Run `add_master_columns_z_to_ad.gs`** then `verifyMasterColumns()` | 0.25 | 🙋 Sharjeel — 2 min |
| **2** | **Add a `190` row to CHECKLIST MAP** | 0.25 | 🙋 needs the live tab read. **No longer urgent — the E2 guard means a missing 190 flags for review instead of looping** |
| **3** | 🔴 **10-row pilot import** | 1 | 🔴 **A-25** — `Office` and `Team` exist in no file they have sent, and M3 routes on both |
| **4** | **M4b + M5b** email drafts | 3 | 🟢 **nothing needed from anyone.** ⚠️ testable only on seeded rows — real rows have no email (A-25) |
| 5 | **C-1 … C-5** — the 5 contracted items now tracked in `ROADMAP.md` | 9 | 🟢 C-2/3/4 need step 1 first |
| 6 | Visa-expiry deadline view | 1 | 🟢 source exists |
| 7 | `DATA SHEET` → ENQUIRIES using **their** status words | 2 | 🟢 (D-307) |

⛔ **Do not switch M3/M4 on** until real clients are in and Robinder gives a date.
⛔ **Set the `Weekdays 09:00/13:00/17:00` schedule in the same action** — both are still on 15-min.
🔑 **`scenarios_get` works over MCP — never ask anyone to export a blueprint from the Make UI again.**

---

# 3 · WHAT WE NEED FROM THE CLIENT — the complete list

**Nothing else. This is everything, consolidated.**

## 🔴 Blocks the dashboard
| # | Ask | Why |
|---|---|---|
| **A-20** | **Re-share both sheets with `project1@yalemigration.com.au`** | access came to Sharjeel's personal Gmail; the automation runs as project1@ |
| **A-16** | **MANAGER ROLES ONLY** — who manages each team · Mershe's email · is the roster current? | 🔑 **We already hold every staff email** (`access/Team roster.docx`, 26 Jul → `ACCESS.md`, D-310). The roster has no role column — that is the only gap |
| **A-17** | **Which client list is live?** `LODGEMENT JULY TO PRESENT` (42) or `REYWARD` monthly tabs (~403)? They overlap | determines what every number means. ⚠️ **`SUMMARY OF CLIENTS` is NOT a third option — it is 47 names, 11 with a visa type (D-315)** |
| **A-25** | 🔴 **`Office` and `Team` per client — and client email addresses** | 🔴 **BLOCKS THE IMPORT.** M3 files every folder by Office + Team. **Neither column exists in any of the four workbooks.** Client email exists on 3 of 44 rows, so M4b/M5b cannot be tested on real data either (D-315) |
| ~~A-21~~ | ✅ **CLOSED — answered from their own data (D-305/D-308).** `LODGEMENTS` has `Handled By`; in `STUDENTS.xlsx` **the consultant IS the tab name**. Rows inherit the consultant from their tab at import | — |

## 🟠 Shapes scope
| # | Ask |
|---|---|
| **A-19** | EOI (6 states) · JRP · Tourist · ART · LAOAG · admissions — **in or out?** |
| **A-22** | 🔑 **Do the SOPs describe how you work now, or how you want to work?** Their phone SOP names Outlook and Teams; their mail is Google. **This decides whether the email question reopens** |

## 🔴 Private to Robinder
| # | Ask |
|---|---|
| **A-18** | ~1,200 plaintext credentials incl. **ImmiAccount** and staff phone PINs (D-306). Advice only, never our custody |

## 🟢 Later, already parked
M6 wording 👍 · 2–3 test files · final $840 · M365 licence count
⚠️ **Fee-quote conflict — open OUR OWN fee workbooks first.** `FEES AND INVOICE REFERENCE.xlsx` and
`BREAKDOWN OF FEES_YALE MIGRATION.xlsx` are on disk and unopened; they may resolve $2,028 / $4,060 /
$2,000-vs-$2,500 with no client contact at all.
⚠️ **The TRA tracker Robinder offered on 6 Aug** (*"I can send you the tracker I we are using if you
need it"*) was never accepted or declined. **Decline it with a reason** — it holds credentials.

## 🔴 STILL OWED BY US, not by them
- ✅ **ALL 12 workflow SOPs READ 15 Aug (D-314)** — full analysis in `CLIENT-SOP-WORKFLOWS.md`.
  Findings: the intake form is their **`Client Enquiry Form`** (they have it) · **six roles, not two** ·
  payment gates the folder · **s56 is in all 12** · **Partner 801 has a 2-year deadline nobody modelled** ·
  ~25 templates named that we do not hold · and they are **platform-agnostic**, correcting D-307
- ⚠️ **Our own fee workbook is unopened** — `FEES AND INVOICE REFERENCE.xlsx` has a 26-row
  `VISA AND PF FEE` tab that likely closes A-09 with no client contact (D-312)
- ✅ **5 CONTRACTED items NOW TRACKED as C-1…C-5 in `ROADMAP.md`** (D-315) — intake form · secure upload
  link · third-party tracking · received/missing status · Referral + SMS. **~9h, MVP scope, not Phase 2**
- ✅ ~~No valid M4 blueprint backup~~ — **RETRACTED 15 Aug.** Pulled live via MCP, post-D-255, verified
- 🔴 **Subclass `186` is a coverage gap** — in their live pipeline *and* their fee master, but in neither
  MASTER's dropdown nor M4's router. 6 of 42 live rows (14%) are types M4 cannot file (D-315)

---

# 4 · 📁 FILES TO REQUEST — updated versions

Sharjeel asked which files to get fresh. **These four, as live Google Sheet links, not exports:**

| File | Why we need it live |
|---|---|
| **`YALE BRISBANE OFFICE WORK.xlsx`** | 🔑 the real operational system — lodgements, the s56 ladder, EOI, JRP |
| **`REYWARD JAKE M GAMOL-2026.xlsx`** | the monthly client tracker |
| **`DATA SHEET.xlsx`** | the enquiry log → feeds "new enquiries this week" |
| *(any newer lodgement sheet)* | Robinder mentioned tracking "January to now" — confirm nothing newer exists |

⚠️ **Exports go stale the day they are sent.** Live links or the dashboard shows history.

---

# 5 · 🔴 WHAT THE AUDIT FOUND — and what it cost

Two files sat unread while we asked the client for data we already had.

| Missed | Size | How long | Why |
|---|---|---|---|
| `YALE BRISBANE OFFICE WORK.xlsx` | 1 MB, 30+ tabs | weeks | **its name was in our own backlog file.** We knew it existed and never opened it |
| `SOP'S 2/WORK FLOWS/*.png` | 12 diagrams | since July | **we audited `.docx` and `.pdf` and never opened a `.png`** |

**What was in them:**
- their s56 7/14/28-day ladder — **already lapsing** on multiple rows
- `Handled By` — the consultant field we told ourselves did not exist (corrects D-303)
- enquiry status vocabulary: `Not Proceeding` · `Pending Decision` · `Lost Lead`
- the lead cadence: **7 days, then 30**
- a 13-step phone SOP with a 15-point QC checklist
- **their SOPs assume Outlook and Teams** — which explains the Microsoft request
- ~1,200 plaintext credentials including ImmiAccount

**The rule:**
> **A file type is not a relevance signal, and a filename is not evidence of content.**
> `CLIENT-DATA-INVENTORY.md` now lists every file and whether it has been opened. It is a required
> read before any data question reaches the client.

---

# 6 · CONTEXT MAP — which file owns what

| Question | File |
|---|---|
| Where are we? | **`WHERE-WE-STAND.md`** ← this |
| What data do we hold? | **`CLIENT-DATA-INVENTORY.md`** |
| Dashboard, end to end | `DASHBOARD-TRACKER.md` |
| What are we waiting on? | `CLIENT-ASKS.md` |
| Why was X decided? | `DECISIONS-INDEX.md` → then grep the entry |
| Billable beyond MVP | `PHASE-2-3-BACKLOG.md` · `CHANGE-REQUESTS.md` |
| Microsoft 365 | `GUIDE-microsoft-365-purchase.md` · `SCRIPT-m365-plan-answer.md` |
| Competitors | `COMPETITOR-ANALYSIS-dashboards.md` |
| **Their own process SOPs** | **`CLIENT-SOP-WORKFLOWS.md`** — all 12, the spec for M5/M6/M7/M9 |
| Hours vs the 48h cap | `HOURS-LEDGER.md` |

⛔ **`DECISIONS.md` is 340 KB. Never read it whole.** Index first, then one entry.
