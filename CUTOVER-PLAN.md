# CUTOVER PLAN — moving Yale from their live Google Sheet onto MASTER
**Created 13 Aug 2026 (D-289).** This is not a data import. They are working in their sheet *today*,
so this is a migration of a running system, and the thing that can go wrong is not data loss — it is
**two sheets both being edited.**

---

## The failure this exists to prevent

Every automation we have built reads MASTER and nothing else. If staff keep typing into their old
sheet after we import:

```
   day 0   import 48 rows      MASTER ✅ = old sheet ✅
   day 3   staff update old    MASTER ❌   old sheet ✅
   day 7   M5 chases a client who was granted on day 4
           M4 files a checklist for a matter that was withdrawn
           the dashboard shows Robinder numbers that are confidently wrong
```

Nothing errors. Nobody is told. It simply drifts, and the first person to notice is a client being
chased for documents they already sent. **Silence is what makes this the dangerous failure mode.**

---

## 🔴 WHY THIS IS NOT OPTIONAL — verified 18 Aug (D-338)

Their live `LODGEMENT: JULY TO PRESENT` tab has **11 columns and not one of them is TEAM, CONSULTANT
or EMAIL** — read directly through Make's `rpcGetFilterKeys`, 0 operations. They said they *could*
add them (Q4) and instead filled the one-off workbook we offered as a fallback.

So the 38 rows we import are a **snapshot**. The next client their team adds arrives with nothing the
folder automation needs. It degrades safely — the D-315 catch-all stamps `NEEDS ROUTING` — but a
human has to fix three fields, every time, forever.

⛔ **Asking for a fourth column is the wrong fix.** They already told us *"too much column is a lot to
handle"* (CR-014). **The cutover IS the fix:** MASTER becomes where clients are added, with dropdowns
that make the fields impossible to leave blank, and their tab becomes history. Step 5's freeze is the
mechanism.

## The solution in one line

> **On an agreed date, their old sheet becomes read-only. After that there is only one place to type.**

Everything below is preparation for that single moment.

---

## The steps

### 0 · 🔴 Clear the demo rows — BEFORE anything else

**MASTER holds 14 invented people** seeded by `seed_demo_rows.gs` so the dashboard could be proven
against data. Every one of them has an `@example.com` address. M3, M4a, M4b and route C are all
built now, and none of them can tell the difference — switch a scenario on with those rows present
and Yale's real OneDrive gains a dozen client folders for people who do not exist, each with a
checklist filed in it and an email drafted to a fake address. Nothing errors. It all reports success.

⛔ **The marker is the EMAIL, not the code** (D-296). `master_codes.gs` runs on a 5-minute timer and
overwrites anything in column A that is not a valid `YM-2026-#####`, so the `DEMO-` prefix was gone
within five minutes of seeding and `removeDemoRows()` had silently stopped matching. `@example.com`
is reserved by RFC 2606 and can never be a real client.

⛔ **NOT before import day.** The demo rows are the only data on the system. Delete them early and
every dashboard view reads empty — at which point a broken view and a correct one look identical
(D-292…D-296) and nothing can be verified again until real clients land.

**On import day, in this exact order:**

| # | Run | Expect |
|---|---|---|
| a | `previewDemoRows()` | read-only. Lists what would go. **Read it.** |
| b | `removeDemoRows()` | `14 demo row(s) removed in 1 block(s)` |
| c | `resetCodeSequence()` | `The first real client will be YM-2026-00001` |
| d | `preflightGoLive()` | must print **GO** |
| **e** | 🔴 **SET THE TWO BASELINES — edit the code, then save** | see below |

### 🔴 (e) THE BASELINES — the step that was missing from this plan until 23 Aug

Both are `''` today, which is the correct and safe state **before** import. On import day they must
be set to the import date in `yyyy-MM-dd`, or the first two mornings go badly:

| Edit | File | If you forget |
|---|---|---|
| `var IMPORT_BASELINE = '2026-MM-DD';` | `scripts/m5_dormant_detector.gs` line 52 | **All 38 imported clients flag dormant on day 3.** They have no contact history, so the dormancy check reads every one of them as neglected — a wall of red on Yale's sheet on the first morning they look at it |
| `var M8_BASELINE = '2026-MM-DD';` | `scripts/m8_lead_followup.gs` line 47 | Every imported enquiry is already past its 30-day window, so the first run stamps *"no outcome recorded"* across the lot |

⚠️ **Same date as the import, not today's date when you happen to remember.** The dormancy grace is
`CHASE_IMPORTED = 14` days measured from this value, so a wrong date moves 38 clients' first chase.

🔑 **Why this was missing matters more than the fix.** The two baselines were written up in
`WHERE-WE-STAND.md` under M5a and M8 as *"⬜ set it on import day"* — twice, correctly — and the plan
that lists what to do **on import day** never picked them up. **A warning in the module's own row is
not a step in the runbook.** Exactly what D-323 said about `preflightGoLive()`, which was a sentence
in four documents and in no checklist. (D-386)

🔑 **(c) is not optional and the order matters.** The demo rows burned `YM-2026-00001…00014`, and
those numbers are now permanently retired by the high-water mark added in D-324 — so without a reset
Yale's first real client is `00015`, for a reason nobody could ever explain to them.
`resetCodeSequence()` refuses to run while a demo row is still present, because resetting first and
deleting second would hand the demo numbers straight back out.

`preflightGoLive()` is read-only and also reports what M3/M4 would do on their first run, and the
rough operation cost of that run. **This step existed only as a sentence in four other documents
and was in neither this plan nor `WHERE-WE-STAND.md`. It is a check now, not a sentence (D-323).**

### 1 · Reconcile the schema — BEFORE any data moves
Read the headers of their live sheet and compare, column by column, against MASTER's 25 (A–Y).

| Case | Action |
|---|---|
| They have a column we don't | **Add it to MASTER.** Non-negotiable |
| We have a column they don't | Fine — it is an addition (auto code, folder URL, checklist filed, next follow-up due) |
| Same idea, different word | Adopt **their** word (D-51…D-56 — we reconcile to their vocabulary, never replace it) |

🔴 **Never import into a schema that is missing one of their fields.** If a consultant opens MASTER
and the one column they check every morning is gone, they go back to their own sheet that afternoon
and the migration is dead. This is the step that decides whether the cutover holds.

### 2 · Import once, with provenance
Native Google Sheets → Google Sheets in Make (connection 9501125, `project1@`). ~2 operations.

Every imported row gets stamped in `Notes`: `Imported from <sheet name> on <date>`. If anything looks
wrong in three weeks, its origin is on the row itself.

Rules carried over from the original spec:
- **TRIM everything** — their text carries trailing spaces
- Keep **both** ids: their `CL-###` in column B, our `YM-2026-#####` in column A
- Split free-text visa type: `"485 visa dependent"` → `485` + `Dependent`
- **Flag contradictions, never fix them** (D-56) — a note in `Notes`, and a human decides
- **One-way.** We never write back to their sheet

### 3 · Verification report — the trust moment
Before anyone is asked to switch, send the team a short report:

- row count: theirs vs MASTER
- 5 rows shown side by side
- every contradiction we flagged, listed
- every field we could not map, named

This is the step that earns the cutover. Skipping it means asking them to trust a black box.

### 4 · Agree a date — out loud, in writing
Not "once it's ready". A **date**, agreed with Robinder, with the team told in advance.

Best day is a Monday: a clean week, and anyone who forgets gets corrected on day one rather than
discovering it after a weekend.

### 5 · 🔒 The freeze — the mechanism that actually solves it
On cutover day, on **their** sheet:

1. `Share` → change everyone from **Editor** to **Viewer** (Robinder keeps edit rights)
2. Insert a row at the top:
   `⚠️ THIS SHEET IS NO LONGER UPDATED — client records now live in MASTER → <link>`
3. Rename it: `ARCHIVED — Client Tracker (to 17 Aug 2026)`

**If nobody can type in it, nothing can diverge.** That is the entire solution; steps 1–4 exist only
so that this step is safe to take.

### 6 · Keep the old sheet forever
Never delete it. It costs nothing, it is the historical record, and it is the rollback if anything
about the import turns out wrong.

---

## First two weeks after cutover

| Check | Why |
|---|---|
| Old sheet revision history — any edits since freeze? | Someone with edit rights typed there out of habit |
| MASTER row count rising? | If it is flat, they are keeping records somewhere else entirely |
| `Folder missing` / `Checklist missing` tiles on the DASHBOARD | Our own coverage — should trend to zero |

If MASTER is flat after a week, the migration has failed quietly and needs a conversation, not
another feature.

---

## What this changes commercially

**Nothing.** Migration to the master data layer is M2 — signed MVP scope. The extra steps here are
sequencing and care, not new scope, and must not be logged as a change request.

The only thing worth saying to Robinder is that the cutover has a **date** attached, because his team
has to be told. That is a courtesy, not a variation.
