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

## The solution in one line

> **On an agreed date, their old sheet becomes read-only. After that there is only one place to type.**

Everything below is preparation for that single moment.

---

## The six steps

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
