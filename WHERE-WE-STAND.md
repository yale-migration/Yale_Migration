# WHERE WE STAND — 15 Aug 2026
**The one file to read after a context reset.** Written after a full census of all 181 client files.
`STATUS.md` has the history; this is the position, the gaps, and the resume point.

---

# 1 · MVP PROGRESS — 11 modules

| # | Module | State | Notes |
|---|---|---|---|
| M1 | Discovery | ✅ **done** | ⚠️ reopened twice — see §4 |
| M2 | Master data layer | ✅ built · 🔴 **empty** | MASTER + ENQUIRIES live. Needs the import |
| M3 | Intake → folders | ✅ **proven** | 3 folder sets, both teams, idempotent · **OFF** |
| M4a | Checklist select + file | ✅ **proven** | 0 errors, real files copied · **OFF** |
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

**Ops: 481 / 1,000.** Both scenarios deliberately OFF.

---

# 2 · 🎯 RESUME HERE

Nothing below is blocked. **In this order:**

| # | Task | Hrs | Why first |
|---|---|---|---|
🔴 **REVISED 15 Aug — three fixes must precede ANY import (D-311).**

| # | Task | Hrs | Why |
|---|---|---|---|
| **1** | 🔴 **M3 catch-all route for unroutable rows** | 0.5 | **E1** — rows with blank Office/Team match the trigger forever. Five of them and M3 dies silently. The import creates hundreds |
| **2** | 🔴 **Reconcile `190`** across router / script / live MAP tab | 0.5 | **E2** — a 190 row loops forever eating a queue slot. Script (36 rows, no 190) has diverged from live |
| **3** | 🔴 **Add 5 MASTER columns STRICTLY RIGHT OF Y** | 1 | **E3** — M4 addresses columns by *number*; inserting left of Y makes it file the wrong checklist with no error |
| **4** | **10-row pilot import** — not 47 | 1 | **E4** — 519 ops left; 47 clients ≈ 611. Pilot ≈ 130 |
| 5 | Visa-expiry deadline view | 1 | source exists |
| 6 | `DATA SHEET` → ENQUIRIES using **their** status words | 2 | `Not Proceeding` · `Pending Decision` · `Lost Lead` (D-307) |
| 7 | **M4b + M5b** | 3 | nothing needed from the client |

⛔ **Do not switch M3/M4 on** until real clients are in and Robinder gives a date.
⛔ **Set the `Weekdays 09:00/13:00/17:00` schedule in the same action** — both are still on 15-min.

---

# 3 · WHAT WE NEED FROM THE CLIENT — the complete list

**Nothing else. This is everything, consolidated.**

## 🔴 Blocks the dashboard
| # | Ask | Why |
|---|---|---|
| **A-20** | **Re-share both sheets with `project1@yalemigration.com.au`** | access came to Sharjeel's personal Gmail; the automation runs as project1@ |
| **A-16** | **MANAGER ROLES ONLY** — who manages each team · Mershe's email · is the roster current? | 🔑 **We already hold every staff email** (`access/Team roster.docx`, 26 Jul → `ACCESS.md`, D-310). The roster has no role column — that is the only gap |
| **A-17** | **Which client list is live?** `LODGEMENT JULY TO PRESENT` (42) or `REYWARD` monthly tabs (~403)? They overlap | determines what every number means |
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
- **10 of 12 workflow PNGs unread** — the authoritative source for folder sets and checklist routing
- **5 CONTRACTED items missing from all tracking** (D-311): the **intake form** · the **secure upload
  link** · third-party responsible-party tracking · received/missing status · Referral + SMS channels
- **No valid M4 blueprint backup** — the committed one is quarantined as broken

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

⛔ **`DECISIONS.md` is 340 KB. Never read it whole.** Index first, then one entry.
