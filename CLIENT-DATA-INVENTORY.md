# CLIENT DATA INVENTORY — every data file we hold
**Updated 14 Aug 2026.** The register of what client data exists, where it lives, what is in it, and
what must never be touched. **Read this before asking the client for any data file** — twice now we
have asked for something already sitting on disk.

📁 **All four client workbooks now live in `SOP'S/client-data/`** (moved 15 Aug), with their own
`00-READ-ME.md`. **OUTSIDE this repo — keep it that way.** `.gitignore` is a second line of defence,
not the control. They were loose in `SOP'S/` root until 15 Aug, which is part of why one sat unread
for weeks.

---

# 📊 THE FILES

| File | Size | What it is | Audited |
|---|---|---|---|
| **`YALE BRISBANE OFFICE WORK.xlsx`** | **1,034 KB** | 🔑 **their real operational system** — 30+ tabs | ✅ 14 Aug (D-305) |
| **`STUDENTS.xlsx`** | **448 KB** | 🔑 education/admissions side — 9 tabs, ~3,600 records. **Tabs named after staff** (D-308) | ✅ 14 Aug (D-308) |
| `REYWARD JAKE M GAMOL-2026.xlsx` | 290 KB | client tracker, 25 tabs, filed by month | ✅ 14 Aug (D-300) |
| `DATA SHEET.xlsx` | 94 KB | cold-call / enquiry log, ~200 rows | ✅ 14 Aug (D-300) |
| `FEES AND INVOICE REFERENCE.xlsx` | 110 KB | fee master *(3 copies across folders)* | ✅ earlier |
| `EOI CALCULATOR.xlsx` | 13 KB | points calculator | ✅ P2-10 |
| `BREAKDOWN OF FEES_YALE MIGRATION.xlsx` | 31 KB | fee breakdown *(2 copies)* | ✅ earlier |

## 🖼 PROCESS DIAGRAMS — `SOP'S 2/WORK FLOWS/` (12 PNGs)
**Formal SOPs with numbered steps, roles and QC checklists. Not decoration.**

| Diagram | Read? | What it gives us |
|---|---|---|
| `INQUIRY WORK FLOW` | ✅ 14 Aug | **SOP-CI-001.** 15 steps · enquiry statuses `Not Proceeding`/`Pending Decision`/`Lost Lead` · **follow-up cadence 7 then 30 days** · their SOP already assumes a CRM |
| `ANSWERING PHONE CALL WORK FLOW` | ✅ 14 Aug | 13 steps + 15-point QC list · "answer within 3 rings" · RMA escalation gate · 🔴 **TOOLS list names Outlook + Teams + Excel** |
| `SKILLS ASSESSMENT` · `ENROLLMENT` · `STUDENT VISA` · `485 VISA` · `TOURIST VISA` · `GSM VISA SOP` · `DEPENDENT VISA` · `407 WORK FLOW` · `482 VISA WORK FLOW` · `PARTNER VISA` | ⬜ **unread** | per-visa process maps — **the authoritative source for M3 folder sets and M4 routing**, which we built from conversation instead |

🔴 **We audited every `.docx` and `.pdf` and never opened a `.png`.** A file type is not a relevance
signal (D-307).

---

# 🔑 `YALE BRISBANE OFFICE WORK.xlsx` — the one that matters

## Client lists
| Tab | Records | Notes |
|---|---|---|
| `LODGEMENTS` | **1,144** | historical register · **has `Handled By` + `Checked BY`** |
| **`LODGEMENT JULY TO PRESENT`** | **42** | 🔑 **the recent active list.** `STATUS` = LODGED / PENDING / WITHDRAWN. **No `Handled By`** |
| `LODGEMENTS DUE 2024` | 16 | has `Handled By` |
| `Sheet62` | 26 | same columns as JULY TO PRESENT — a duplicate/fragment |

## 🔑 The s56 deadline tracker — they already run this by hand
**`S56S57ART NEW SHEET`** — 191 records
`DATE RECEIVED · 7 DAYS · 14 DAYS · 28 DAYS · VISA TYPE · S56/S57 REQUIREMENT · ACTION TAKE ·
DATE OF ACTION · STATUS · DAYS LAPSED · NOTES`
STATUS values: `Monitor` · `Update Needed` · `Done`

🔴 **Multiple rows say "FIRST S56 LAPSED".** They are already missing statutory deadlines. This is the
highest-value thing in the entire engagement to automate, and their own file is the evidence.

## Pipelines outside MVP scope
EOI across six states (`All EOIs` 124 · `WA` 111 · `QLD` 88 · `SA` 25 · `Victoria` 6 · `EOI LIST` 497) ·
JRP (`Copy of JRP LIST` 323 · `JRP LIST` 106 · `JRP 2 List` 62 · `TRA-JRP LIST NEW` 39) ·
`WORK VISA NEW` 118 · `Tourist Visa` 104 · `LAOAG FILES` 78 (**Philippines already operating**) ·
`FINALIZATION` 77 · `ART` 7 · `College list` · `Employer docs` · `withdrawal`

⚠️ `Nishas TASKS` (81) — a **former employee's** task list, still live in the file.

---

# ⛔ NEVER TOUCH — credential columns (D-306)

**~1,200 plaintext credential records across these tabs. Never import, copy, echo, screenshot or commit.**

| Tab | What is in it |
|---|---|
| **`immis`** (268) | 🔴 **ImmiAccount logins + clients' Gmail passwords** |
| `JRP LIST` (106) | passwords **+ security questions** |
| `Copy of JRP LIST` (323) · `JRP 2 List` (62) · `TRA-JRP LIST NEW` (39) | usernames + passwords |
| `All EOIs` + 4 state tabs (~354) | `EOI PASSWORD` per state portal |
| `eca password` (61) | assessment portal |
| **`YALE COMPUTER AND PRINTER LOGS`** (15) | 🔴 staff **computer PINs and phone passwords** |
| `REYWARD` → `JRP` tab, cols D/E (73) | usernames + passwords |

**Rule: if a column name contains `password`, `username`, `OTP`, `PIN` or `security question`, it is
excluded from every read, every import and every log line. No exceptions.**

---

# 🗺 WHERE THE ACTIVE CLIENT LIST ACTUALLY IS

Robinder told Sharjeel by phone: **"we only track clients from January to now."**
Cross-referenced against the files, that resolves to **two lists, not one**:

| Source | Covers | Records |
|---|---|---|
| `REYWARD` → monthly tabs JANUARY → NOVEMBER | Jan → now | ~403 |
| `YALE BRISBANE OFFICE WORK` → `LODGEMENT JULY TO PRESENT` | Jul → now | 42 |

**They overlap.** A client who arrived in August is likely in both. **Deduplicate on name + visa type
before importing anything**, or the dashboard double-counts.

⚠️ Still unconfirmed: which of the two is authoritative, and whether `SUMMARY OF CLIENTS` (47) is a
third curated view of the same people. **This is the question to ask — not "where do you track
clients."**

---

# ✅ WHAT WE NOW HAVE vs WHAT WE STILL NEED

## Have it — stop asking
- ✅ Their real client lists (three of them)
- ✅ Real stages, outcomes, visa types
- ✅ **Consultant** — `Handled By` in `LODGEMENTS` (D-305 corrects D-303)
- ✅ **s56 deadline model** — their own 7/14/28-day ladder
- ✅ Visa expiry + days-left
- ✅ Enquiry source — `DATA SHEET.xlsx`

## Still need
- 🔴 **A-16** staff emails + branch *(no email anywhere in any file)*
- 🔴 **A-20** live access — **granted to `sharry00010@gmail.com`, but the automation runs as
  `project1@yalemigration.com.au`.** Needs re-sharing to the right account
- 🟠 **A-17** which list is authoritative, and the Jan-vs-July overlap
- 🟠 **A-19** JRP + EOI + Tourist + ART — in scope or out?
- 🔴 **A-18** the credential exposure — Robinder, privately

---

# 📌 THE PROCESS LESSON

`YALE BRISBANE OFFICE WORK.xlsx` had been on disk the whole time. It was named in
`PHASE-2-3-BACKLOG.md` — *"their 'YALE BRISBANE OFFICE WORK' S56 tabs"* — so we knew it existed and
never opened it.

> **Knowing a file's name is not knowing its contents.** Same lesson as D-223 (a filename is not
> evidence of content), now at workbook scale.

**Gate: this inventory is updated the same day any client file arrives, and re-read before any data
question goes to the client.**
