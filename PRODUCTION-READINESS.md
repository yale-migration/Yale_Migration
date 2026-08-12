# PRODUCTION READINESS AUDIT — `YM-M3-folder-create`
**3 Aug 2026.** Audited as a system that will run unattended against a live client drive holding ~1,436 real
client folders — not as a demo.

**Verdict (3 Aug): DEMO-READY, NOT PRODUCTION-READY** — five blockers, four high-severity gaps.

---
## ⚡ UPDATE 5 Aug — B1·B2·B3·B4·H1·H2 CLOSED (D-197 … D-216)
| | Was | Now |
|---|---|---|
| B1 routing | 🔴 hardcoded Filipino + SET 1 | ✅ `switch(Team)` → parent · `switch(Visa Type)` → SET 1/2/3 (D-208) |
| B2 sanitization | 🔴 none | ✅ whitelist + `trim()` + double-space collapse (D-210) |
| B3 error handling | 🔴 none | ✅ `onerror` → write to **Notes (W)** + Skip, on modules 12/14/17 (D-215) |
| B4 partial failure | 🔴 row stuck forever | ✅ no loop; failures now land in Notes (D-204 + D-215) |
| H1 idempotency | 🔴 unproven | ✅ second run = **0 bundles** (D-207) |
| H2 test matrix | 🔴 one path | ✅ 4 rows / 1 run: both teams, SET 1 + SET 3, hostile name, unroutable (D-213) |
| SET 3 nesting | 🔴 missing | ✅ `820`/`801` inside `03 Relationship Evidence` (D-211) |
| M2 module names | 🔴 generic | ✅ renamed to intent (D-201) |
| M3 test folders | 🔴 7 left in live drive | ✅ removed (D-206) |

**Still open before the schedule goes ON:**
- 🔴 **B5** Make **Core** plan — 15-min polling ≈ 2,880 ops/mo vs 1,000 free. Client decision.
- 🟠 **D-216** SET 2 (482 · 407 · SBS · Nomination) has **never executed** — one `482` row closes it.
- 🟠 **H3** all three connections are ours, not the client's — re-authorize at handover (M11).
- 🟠 TOWNSVILLE / PHILIPPINES client-folder itemIds unknown — those rows are safely skipped (D-209).

**Measured cost:** SET 1/2 = **10 ops**, SET 3 = **13 ops** per client (D-212).

---
### Original 3 Aug audit follows (kept for the record)
Do not enable the schedule until every BLOCKER is closed.

---

## 🔴 BLOCKERS — must be fixed before the scenario is switched on

### B1. Routing is hardcoded (D-189)
`OneDrive 12` posts to a hardcoded Filipino-team folder id; `Iterator 13` splits a hardcoded SET 1 list.
**Impact:** an INDIAN-team client is silently misfiled into the Filipino team's folder. A 482/407 matter gets
standard folders instead of the step-based structure the client explicitly asked for (D-126). Both are
**silent** — no error, wrong result, in live data.
**Fix:** restore the Set-variables module using **clicked** chips inside the formula (never attempted — every
failed attempt used typed refs). Fallback: Router with dropdown filter conditions, zero formula syntax.

### B2. No name sanitization — can break the API call or corrupt JSON
Module 12's body is `{"name":"<Client Code> – <Full Name>", …}` built by raw string interpolation.
**Impact:**
- A name containing `"` produces **invalid JSON** → 400, row stuck.
- A name containing `\` breaks JSON escaping → 400.
- `/ \ : * ? < > |` are **rejected by OneDrive** → 400.
Their real data is messy — D-47 found filenames with typos, download cruft and mixed case; names like
`MARIA/JOSE` or `O"NEIL` are entirely plausible across 1,436 clients.
**Fix:** sanitize Full Name before use — strip `" * : < > ? / \ |`, collapse double spaces, trim leading and
trailing spaces and dots, cap at 100 chars. This was specified in ARCHITECTURE and D-18 and **was never
built**.

### B3. No error handling anywhere — one bad row kills the whole run
Neither OneDrive module has an error handler.
**Impact:** if OneDrive 12 returns 409/429/500 for row 1, the **entire execution stops** and rows 2–5 in that
batch are never processed. Nobody is told. The next cycle repeats the same failure.
**Fix:** error handler on OneDrive 12 and 14 → **Resume**, + write the error into the row's `Notes` column so
staff see it where they work, + an alert to Sharjeel. Mandated by D-14 and ARCHITECTURE; not yet built.

### B4. Partial-failure leaves a row permanently stuck
If sub-folder 3 of 6 fails, the run aborts **before** the write-back. Result: client folder exists, structure
incomplete, `Folder URL` still empty → the trigger picks the row up again → OneDrive 12 returns **409 because
the folder already exists** → aborts again. **The row is stuck forever and nothing reports it.**
**Fix:** two parts. (a) `conflictBehavior` on the CLIENT folder should tolerate an existing folder when we are
resuming — or better, an initial "does the folder already exist?" check. (b) The write-back must be reachable
even when sub-folders partially fail (error handler with Resume achieves this).

### B5. Polling alone exceeds the free plan
A 15-minute schedule = **96 executions/day ≈ 2,880 operations/month** *before a single client is processed*.
The free plan is **1,000/month** (956 remaining today).
**Impact:** the scenario stops mid-month, silently, and folders stop being created.
**Fix:** Make **Core plan** (10,000 ops/mo) is now confirmed as a hard go-live requirement, not a nice-to-have.
Realistic budget: polling ~1,000–2,900 + 11 ops × ~15 new clients ≈ 165 → **≈1,200–3,100 ops/month**.
Mitigation if cost matters: restrict the schedule to business hours (Mon–Fri 07:00–19:00 ≈ 1,056 polls/month)
and/or poll every 30 minutes.

---

## 🟠 HIGH — fix before real client data flows through

### H1. Idempotency is still unproven
The write-back now works, but the "run again and get 0 bundles" test has **not been executed**. Until it is,
we cannot assert the scenario won't reprocess rows. **This is the single cheapest test remaining.**

### H2. Only one path has ever been tested
Tested: BRISBANE + FILIPINO + 485. **Never tested:** Indian team · 482 · 820/801 · Townsville · Philippines ·
blank Office/Team · blank Visa Type · a name with an apostrophe, slash or quote · a very long name ·
two rows in one run. A system that has only met one input is not tested.

### H3. Every connection is owned by us, not the client
OneDrive connection = `sharry00010@gmail.com` (D-31) · Google Sheets connection = "Muhammad's Google
connection" (D-167 recommended project1@) · Apps Script trigger = Sharjeel's account (D-153).
**Impact:** at handover, or if Sharjeel's access is ever revoked, **all three stop silently.** No error, no
alert — folders and codes simply stop being created.
**Fix:** re-authorize as client-owned accounts before handover; add to M11 as a blocking item, not a nicety.

### H4. Failures are invisible to the client's team
Nothing writes to `Notes`, and there is no alert channel. Staff would discover a problem only by noticing a
missing folder.
**Fix:** ship H4 with B3 — the same error handler does both.

---

## 🟡 MEDIUM — before handover

- **M1.** Folder names live inside the Iterator's formula. Renaming a folder means editing a scenario. Move
  the three sets to a Data Store or a config tab so the client can change them without touching Make.
- **M2.** Modules are named generically ("OneDrive", "Google Sheets"). Rename to describe intent
  (`Create client folder`, `Write folder link back`) — the client will open this someday.
- **M3.** Seven `TEST DEMO` folders remain in the live Filipino team folder (D-183).
- **M4.** `!529` is labelled "BNE Indian" in the M3 spec but recorded as `CLIENT FILES (main/Indian?)` in
  ONEDRIVE-IDS — an unverified assumption hardened into a routing rule (D-136).
- **M5.** No scenario-level documentation. Make supports module notes; a future maintainer has nothing.

---

## ✅ What IS production-grade already

Worth stating, because it is real:
- **Idempotent by design** — the `Folder URL is empty` filter means a completed row is never reprocessed
  (mechanism sound; proof pending H1).
- **`conflictBehavior: "fail"`** — the automation can never overwrite or silently duplicate an existing
  client folder. This is the single most important safety property given 1,436 live folders, and it has
  already fired correctly several times.
- **Write-back touches exactly one cell** (`Updated cells: 1`) — verified. No risk of clobbering staff edits.
- **Timezone correct across all three clocks** (D-163) — s56 deadline maths will be right.
- **Client-code engine is concurrency-safe** (LockService, D-135) with a duplicate auditor.
- **Placement verified against live data**, not against our notes — the returned `path` proved it.

---

## Remediation order (fastest value first)

| # | Task | Effort | Gate |
|---|---|---|---|
| 1 | **H1** idempotency proof | 1 min | before anything |
| 2 | **M3** delete 7 test folders + clear row 2 | 5 min | before the demo |
| 3 | — | — | **RECORD T4 DEMO** ← client sees it working |
| 4 | **B3 + B4 + H4** error handlers, Notes write-back, alert | 30 min | before real data |
| 5 | **B2** name sanitization | 20 min | before real data |
| 6 | **B1** restore routing | 30 min | before real data |
| 7 | **H2** test all three sets + both teams + edge names | 30 min | before schedule |
| 8 | **B5** Make Core plan | client action | before schedule |
| 9 | **H3** re-authorize connections as client | 15 min | before handover |

**The demo is not blocked by any of this** — the demo path is exactly the one that works. Everything above is
between the demo and switching the scenario on.
