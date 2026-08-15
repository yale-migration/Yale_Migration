# DATA AUDIT — the two files their team sent, 14 Aug 2026

**Files:** `DATA SHEET.xlsx` · `REYWARD JAKE M GAMOL-2026.xlsx`
🔴 **Both live in `SOP'S/` root, OUTSIDE this repo, and must stay there.** They hold client names,
phone numbers, emails and **plaintext passwords**. `.gitignore` carries a second line of defence.
**No content from them is reproduced in this file beyond structure, counts and column names.**

---

## 🔴 URGENT — read this first

### The `JRP` tab stores 73 clients' portal usernames and passwords in plaintext

Columns **D (USERNAME)** and **E (PASSWORD)** hold live login credentials for what looks like the Job
Ready Program portal — one per client, and **the same password is reused across nearly every row.**

**Why this is serious, in their own context:**
- It sits in a spreadsheet that gets emailed and shared. It has just been sent to us over WhatsApp.
- One password across 73 client accounts means one leak compromises all of them.
- These are **client** accounts, not staff accounts — Yale is holding credentials belonging to other
  people, alongside their passports.
- As a Registered Migration Agent, Robinder carries a professional confidentiality obligation over
  exactly this material.

**What to advise — say it once, calmly, not as a lecture:**
1. That password should be **rotated**, and treated as already exposed. It has been in an emailed
   spreadsheet for an unknown length of time.
2. Credentials should **not** live in the tracker. If they must be stored, a password manager with
   per-client entries is the answer, not a column.
3. Every client should have a **unique** password.

**Our position:** we flag it, we do not touch it. **⛔ Never import columns D/E into MASTER.** Never
copy them anywhere. If we build anything that reads this file, those two columns are skipped explicitly.

---

## 📄 FILE 1 — `DATA SHEET.xlsx`

**One tab, ~200 rows. This is the cold-call / enquiry log** — exactly what Sharjeel described.

| Col | Header | Notes |
|---|---|---|
| A | *(date)* | header cell is corrupted to a serial; values are `26/06/2026` style |
| B | Name | **often blank** — many rows are a phone number and nothing else |
| C | Phone Number | the only reliably populated field |
| D | Staff Assigned | real values: `priyanka` · `RJ` · `inder` · `none` / `None` |
| E | Enquiry | free text, but **visibly templated** — *"What are the requirements for Subclass 190?"*, *"PR Pathway"*, *"What construction courses lead to PR in Australia?"* |
| F | Remarks | rich free text: state, current visa, qualification, next action |

**What this is worth to us:**
- ✅ **This is the source for "new enquiries this week"** — the dashboard view we had marked as having
  no data source. It has one, and it already exists.
- ✅ It maps almost one-to-one onto our `ENQUIRIES` tab.
- ⚠️ **`Staff Assigned` casing is inconsistent** (`none` vs `None`, lowercase names) — must be
  normalised on import, and it confirms the consultant list should come from one source, not typing.
- ⚠️ Rows with no name are genuine cold calls. **Do not treat a blank name as a broken row.**

---

## 📊 FILE 2 — `REYWARD JAKE M GAMOL-2026.xlsx`

# 🔑 THIS IS THEIR REAL CLIENT DATABASE

**25 tabs. Roughly 460 client records.** This is the answer to *"where do you record a client today?"* —
we no longer need to ask it.

### The shape of it

| Tab group | Tabs | Records | What it is |
|---|---|---|---|
| **Monthly** | JANUARY → NOVEMBER | **~403** | 🔑 **the main client lists** — one tab per month |
| **JRP** | JRP | 73 | Job Ready Program pipeline, 4 steps with dates 🔴 *holds passwords* |
| **Enquiries** | GENERAL INQUIRY · CALL OUTS | 100 | walk-ins and call lists |
| **By visa line** | 500 OFFSHORE · 482407 · BVB · ART APPLICANTS | 33 | small per-stream lists |
| **Skills bodies** | AITSL · VETASSESS · ACECQA · CDR | 4 | ACECQA and CDR are **empty** |
| **Other** | FASTRACK COURSES · STUDENTS | 17 | STUDENTS is **empty** |
| **Their dashboard** | SUMMARY OF CLIENTS | 47 | `DATE · NAME · CONTACT · TYPE OF APPLICATION · STATUS · EXPIRATION OF THE NEW VISA` |

### 🔴 The single most important finding

> **They file clients by the MONTH THEY ARRIVED, not by status.**

A client who came in March lives on the MARCH tab forever, whatever happens to them afterwards.

**That is why nobody can answer "how many active files do you have."** The answer is spread across
eleven tabs with no way to roll it up. Their own `SUMMARY OF CLIENTS` tab — 47 rows against ~460
records — is a hand-built attempt to solve exactly this, and it covers about 10% of the file.

**This is the strongest possible justification for MASTER**, and it is their own data saying it. One
list, status as a column, month as a date field. Every question they cannot answer today becomes a
filter.

### The monthly tab schema — mostly consistent, with drift

Common columns across the monthly tabs:

`Name · Medical · Contact Number · Email · Visa Application Type · Expiry Date · DAYS LEFT ·
Qualifications · Requirements/pending · Skills Assessment · AFP Application Status · FEES · ACTION ·
Notes / Action Required`

**Drift found — every one of these is an import hazard:**
| Tab | Problem |
|---|---|
| MARCH | three extra columns: `PENDING TO UPLOAD`, `S56 SUBMITTED?`, `NOTES` |
| JUNE | extra column `SIR ROBIN TO DO` |
| APRIL · AUGUST | extra `notes` / `NOTES` alongside the standard notes column |
| MAY | column A header is **`k`** — a typo, not a header |
| JULY | header reads `CLIENT NAME`, not `Name`; sheet extends to **row 1017** with only ~65 records |
| NOVEMBER | **Name header missing entirely** |

**Consequence:** the importer must map **per tab**, not once. Assuming one schema across eleven tabs
would silently drop columns from at least five of them.

---

## 🔧 WHAT THIS MEANS FOR MASTER — 5 columns we are missing

Their tracker records things MASTER has no home for. These are not nice-to-haves; they are fields
their staff fill in every day.

| Their column | Real values seen | MASTER today | Action |
|---|---|---|---|
| **Medical** | `DONE` · `URGENT` · `pending docs` · `completed` | ❌ none | **add** — a real workflow gate |
| **Qualifications** | `CHEF` · `ECE` · `IT` · `BACHELOR` · `PHD` · `MBA` | ❌ none | **add as Occupation** — it drives skills assessment and visa strategy |
| **AFP Application Status** | `APPLIED` · `NO ACTION REQUIRED` | ❌ none | **add** — police check tracking |
| **FEES** | `DONE` | ❌ none | **add** — and it confirms D-95: *payment gates progress*, so M5 must not chase documents when the real blocker is an unpaid invoice |
| **Requirements/pending** | `COMPLETE` · `X` | partially = Notes | **add** as a status field |

**Also worth noting:** their `Skills Assessment` column is a **status** (`COMPLETE` / `NO ACTION
REQUIRED`), whereas our column X is the **authority** (VETASSESS / TRA / ACECQA). Both are needed —
they answer different questions. Keep X, add a status field beside it.

### 🎯 And a deadline source we did not know existed

`Expiry Date` + `DAYS LEFT` are on **every monthly tab**, maintained by hand.

Robinder asked for **"deadlines"** on the dashboard and we recorded it as having no source, needing M9.
**Wrong — for visa expiry there is a source, and it is already in their data.**

- `Visa Expiry` already exists in MASTER as **column P**
- `DAYS LEFT` is a formula, not data — we compute it, they will never maintain it again
- **s56 deadlines still need M9.** Two different deadlines; do not conflate them.

> **This moves "deadlines" from "cannot show" to "can show for visa expiry, s56 comes with the email
> side."** That is a materially better answer for the call.

---

## ✅ QUESTIONS THIS FILE ANSWERS — remove them from the call

| Question we were going to ask | Answer |
|---|---|
| "Where do you record a client today?" | ✅ **This file. Monthly tabs.** |
| "How many active clients?" | ✅ ~460 records; ~403 in monthly tabs. *They cannot answer this themselves — that is the point* |
| "What are your real stages?" | ✅ `ACTION` column: `LODGED`; outcome in Notes: `GRANTED` |
| "Which consultants?" | ✅ `priyanka` · `RJ` · `inder` (+ `Sir Robin` referenced throughout) |
| "Which visa lines?" | ✅ 485 · 485 DEPENDENT · PARTNER · 500 · 482 · 407 · BVB · JRP · ART |
| "Do you need real client data for the demo?" | ✅ **We have it. No need to ask.** |

## ❓ STILL OPEN — keep these on the call

1. **Staff emails + branch** — names only, no emails anywhere. Still blocks the manager view.
2. **Is this file the ONLY place?** Or do consultants keep their own too?
3. **Who is Reyward Jake M Gamol?** The file is named after a person — staff member, or a client file
   that became the master by accident?
4. **Which records are still active?** ~460 records, many closed. We cannot tell `GRANTED` from
   `still working on it` reliably from `ACTION`/`Notes` alone.
5. **JRP** — a 4-step workflow, 73 clients, entirely outside our current scope. Is it in or out?
6. 🔴 **The password column** — raise it.

---

## 📌 IMPORT PLAN — revised on this evidence

**⛔ Do not attempt a single bulk import.** Eleven tabs with six schema variants and ~460 records of
mixed live and closed matters is how you poison a new database on day one.

**Staged:**

| Stage | What | Why |
|---|---|---|
| ~~**1**~~ | 🔴 ~~**`SUMMARY OF CLIENTS` (47 rows)** — clean, consistent, already curated~~ **WRONG, CORRECTED 15 Aug (D-315).** Opened it: **47 names**, 11 with a visa type or status, no email/office/team/consultant/expiry. Use **`LODGEMENT JULY TO PRESENT` (42 rows)** instead | this row was written from the tab's *name and row count*, never from its contents |
| **2** | **Monthly tabs, one at a time**, newest first (AUGUST → JULY → JUNE) | recent months are the live ones. Per-tab mapping handles the drift |
| **3** | **`DATA SHEET.xlsx` → ENQUIRIES** | lights up "new enquiries this week" |
| **4** | JRP · 500 OFFSHORE · 482407 | separate pipelines, decide in or out first |
| **⛔** | JRP columns **D and E** | **never** |

**Stage 1 is enough for a real demo today** — 47 real clients, real names, real visa types, real
statuses, in their own data.
