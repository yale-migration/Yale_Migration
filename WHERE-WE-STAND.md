# WHERE WE STAND — 18 Aug 2026
**The one file to read after a context reset.** Position, gaps, resume point.
`STATUS.md` is history only. `DECISIONS-INDEX.md` → `DECISIONS.md` is why.

---

# 1 · THE ONE-LINE POSITION

🎉 **THE TEAM ANSWERED, 18 Aug — THE CLIENT IMPORT IS UNBLOCKED. 38 rows ready.**
12 of 19 questions closed, the fee schedule corrected, and one answer reframed the whole pipeline:
`LODGEMENT JULY TO PRESENT` is the **engaged-onwards subset**, not the client base — everything
earlier lives on private per-consultant lists we have never seen (D-330).

✅ **ACCESS IS LIVE AND VERIFIED (D-337).** `project1@` reads all three of their sheets; we hold the
file IDs for the first time; 31 live tabs read back. **Q9 / A-20 / I-1 CLOSED — the import is
unblocked and runs against live data.**

🔴 **Two things that verification then exposed.** The live tab is `LODGEMENT: **JULY TO PRESENT**`
**with a colon** — Excel forbids `:` so every export renamed it, and 4 scripts + 11 docs carry the
wrong name (against the live sheet that returns *no rows and no error*). And the live tab has
**no TEAM, no CONSULTANT, no EMAIL column** (D-338) — so the 38 rows are a snapshot and client 39
arrives incomplete. That is not a new blocker; **it is the reason the cutover exists.**

🔴 **BUT Q9 IS NOT THE ONLY BLOCKER, and saying so on 18 Aug was wrong (D-331).** A full requirements
audit found **twelve inputs we do not hold**, two of which had never been asked for at all:
**no Anthropic API key** (M9, 5h — `ACCESS.md` had it marked ✅ and there is no such connection) and
**no Meta/Facebook/Instagram access** (M6, ~3h). **≈18.5 of the ~21 remaining contracted hours are
blocked on inputs, not on engineering** — and **7 of the 14 items on the access checklist we sent on
21 July were never delivered and never chased** (D-332). ▶ **`INPUTS-REGISTER.md`** is now the authority on this.

Behind that: M3 · M4a · M4b · M5a · M5b · M6 all built and verified; MASTER runs A–AE; the dashboard
has 9 views all proven against data; four audit rounds (D-323…D-326) closed 15 defects, none of them
in a feature.

---

# 2 · MVP PROGRESS — the workflow, and where each piece actually sits

**The pipeline, end to end.** ✅ built+verified · 🟠 spec'd · ⬜ not started · 🔴 blocked

```
  ENQUIRY                              CLIENT FILE                        CLOSE
  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
  │ M7 phone │   │ M6 chase │   │ M3 folder│   │ M4a file │   │ M5a quiet│
  │ ⬜       │──▶│ ✅ 7/30  │──▶│ ✅ proven│──▶│ ✅ proven│──▶│ ✅ daily │
  └──────────┘   └────┬─────┘   └──────────┘   └────┬─────┘   └────┬─────┘
  ┌──────────┐        │                             │              │
  │ M9 email │        ▼                             ▼              ▼
  │ 🟠 spec'd│   ┌──────────┐                  ┌──────────┐  ┌──────────┐
  └──────────┘   │ M8 send  │                  │ M4b draft│  │ M5b chase│
                 │ ⬜ next  │                  │ ✅ live  │  │ ✅ live  │
                 └──────────┘                  └──────────┘  └──────────┘
       ENQUIRIES tab ◀── 621 rows ready          MASTER tab A..AE, 31 cols
```

| # | Module | State | Notes |
|---|---|---|---|
| M1 | Discovery | ✅ done | reopened twice |
| M2 | Master data layer | ✅ built · 🟢 **38 rows ready · access LIVE** | MASTER A–AE **verified through Make's own RPC** (D-338). Waits only on the checklist-currency confirmation |
| M3 | Intake → folders | ✅ **proven + hardened** | v2 catch-all (E1, D-315) · **OFF** |
| M4a | Checklist select + file | ✅ **proven + hardened** | v2 guard · 190 mapped D-325 · **OFF** |
| M4b | Checklist email draft | ✅ **live in M4 route A** | D-321 · **OFF** · draft only |
| M5a | Dormancy detection | ✅ **TRIGGER CONFIRMED LIVE 19 Aug** — daily CLOCK, owner `project1@` | 🔑 **The trigger existed all along; what was missing was any RECORD of it.** "No record it was created" was true and was wrongly read as "it was never created" — `grep ScriptApp.newTrigger` proves only that no *code* made one, not that none exists. `verifyDailyTriggers()` settled it in 10 seconds. The guide's "every morning" was always true. · **40/40** (4 lock tests added 19 Aug) · 🔴 `updateFollowUps()` had held **NO lock** on a read-all → write-back-by-index over MASTER — document lock added before the trigger was touched · ⬜ **IMPORT_BASELINE is `''`** — must be set to the import date ON import day, or all 38 imported rows flag dormant on day 3 |
| M5b | Chase email draft | ✅ **live in M4 route C** | D-322 · **OFF** · partition proved over 1,008 rows |
| M6 | **Enquiry capture hub (8h)** | 🔴 **BARELY STARTED — spec only** | ⛔ what I shipped as "M6" was **M8** (D-331). Needs Meta/website/walk-in access we have never asked for |
| M7 | Phone intake | ⬜ not started | their 13-step SOP found (D-307) |
| M8 | **Lead follow-up sequences (2h)** | 🔴 **BUILT BUT NOT DEPLOYED — the .gs is not in the live project** | ⛔ `installDailyTriggers()` on 19 Aug returned *"no such function in this project"* for `updateEnquiryFollowUps`. Code is complete and passes **32/32**, but it exists only in this repo — MASTER's Apps Script project has never had the file pasted in. 🔑 **This row said "✅ COMPLETE" while the code was not deployed**; the row four lines down said "needs one script run" and neither was reconciled against the other. Tests passing is not deployment. ▶ **ACTION: paste `scripts/m8_lead_followup.gs` into the project, re-run `installDailyTriggers()`** |
| M9 | Email triage / s56 | 🟡 **PARSER + VERIFIER BUILT 19 Aug — 58 tests** | D-342 · tracker tab, JSON parser, **independent deadline recomputation**. 🔴 **Cannot be switched on: `scenarios:2` cap + ~600 ops/mo** |
| M10 | Testing | ⬜ | needs 2–3 real files from Robinder |
| M11 | Handover | 🔴 | **OneDrive on OUR personal account** — §5 |
| — | Dashboard | ✅ **DONE for MVP — 9 views, all verified against data** | goodwill, not MVP scope. Not being worked on further |
| — | C-1 … C-5 | C-3 ✅ C-4 ✅ C-5 half ✅ · C-1 ⬜ C-2 🔴 | the five contracted items |

## 🔄 DECISIONS THAT REVERSED — do not re-litigate, do not re-inherit the old one

| Was | Now | Why |
|---|---|---|
| M5b needs a 3rd Make scenario / paid plan | **Route C inside M4** | Free caps active scenarios at 2. No money question before go-live (D-322) |
| "186 cannot be typed into MASTER" | ⛔ **WRONG — it was always there** | My read started one line below the evidence (D-325) |
| "no 190 checklist exists" (D-236) | **It has existed since 11 Aug** | Comment outlived its truth; 190 now mapped (D-325) |
| ENQUIRIES `Channel` → `Phone` | ⛔ **REVERTED to blank after 4 hours** | Rey: *"inquiries come from both whatsapp and social media"* — not phone (D-330) |
| Student 500 charge = `$2,028` | **$2,500** (+ a full fee schedule) | Both our figures were stale; they supplied the real one (D-330) |
| `LODGEMENT JULY TO PRESENT` = the client base | **the engaged-onwards SUBSET** | Consultants keep private per-client lists until engaged (D-330) |
| Dashboard needs 3 access levels | **2** — Robinder is the only manager | *"Sir Robin is currently doing all those things"* (D-330) |
| `SUMMARY OF CLIENTS` is the import source | **`LODGEMENT JULY TO PRESENT`** | We recommended it without opening it (D-315) |
| Dashboard "Going quiet" = last contact −14 | **= Next Follow-up Due, same as its KPI** | Tile said 10, list shaded 5, same screen (D-326) |

**Honest: ~36%** — 14.5 of 40 contracted build-hours. **~47 of 48 contract hours consumed**;
the gap is ~16h of absorbed out-of-scope work. See `HOURS-LEDGER.md`.

**Ops: 485 / 1,000 · 515 left · resets Tue 25 Aug.** All scenarios **OFF** (`activeScenarios: 0`).
The 4 ops since 16 Aug were the Anthropic smoke test and the M9 API probe — both bought a fact that
would otherwise have been a guess.

🔴 **`license.scenarios: 2` — a HARD cap on ACTIVE scenarios.** M3 + M4 are those two, so **M9 cannot
be switched on** without merging M3+M4 or moving to a paid plan. And at ~10 emails/day M9 costs
~600 ops/month on its own — **it needs the paid plan for OPERATIONS, not just for a slot** (D-342).

---

# 3 · 📤 SENT TO THE CLIENT — 16 Aug

Email + PDF **`YM-DQ-e573`** (19 questions, 7 parts) + `Yale-client-list-to-complete.csv`
(40 clients, 9 answer columns) + a WhatsApp nudge to the group. **Robinder is in that group** and was
tagged for the OneDrive item.

**The document leads with:** add three columns — `TEAM`, `CONSULTANT`, `EMAIL` — to their own
`LODGEMENT JULY TO PRESENT` tab. Our CSV is the fallback, deliberately demoted to a footnote.

**Ten asks now sit with them in one document:** A-25 · A-20 · A-16 + A-13 · A-17 · A-26 · plus new
ones for status-word meaning, their own client reference, the dashboard access list, and the
OneDrive re-authorisation.

⛔ **A-18 — the ~1,200 plaintext credentials — was deliberately NOT sent.** It goes on the call with
Robinder, verbally, alone. Written down and addressed to an RMA it is discoverable. Script is at the
bottom of `CLIENT-QUESTIONS-robinder.md`.

🔑 **The document states plainly that six of the 40 are visa lines we have no checklist for** —
`186`, `600`, `ART`, `Citizenship`, `PARTNER VISA` — so those clients not appearing later reads as
scope, not as failure. It plants the Phase-2 conversation with **no money word in it**.

**Regenerating any client document:** edit the template in the repo → `python3
scripts/build_client_questions.py` → the sendable copies land in `../client-data/`. **Every figure is
computed, never typed.** The `Ref: YM-DQ-xxxx` in the header is a hash of the body — if a PDF's ref
does not match the source, it was built from a stale copy. ⛔ **Never state the expected ref in the
prompt** (D-320) — that is how the check got defeated.

---

# 4 · 🎯 RESUME HERE — my side

| # | Task | Hrs | Blocked? |
|---|---|---|---|
| ~~—~~ | ✅ **M4b — DONE 16 Aug.** Applied to M4 route A, re-fetched and confirmed. `verify_blueprints.py` **43/43** | — | ⚠️ untested against a real send — no client has an email yet |
| ~~—~~ | ✅ **Dormancy on imported rows — DONE 16 Aug (D-322).** `IMPORT_BASELINE` + 14-day grace. Found two real defects doing it: the rule fires **day 4 not day 3**, and the baseline parsed as **UTC midnight** | — | 24/24 |
| ~~—~~ | ✅ **M4 v4 / M5b — DONE 16 Aug.** Trigger widened to two OR-groups + `A1:AE1`, route C added, routes A+B closed against chase rows. Applied live, re-fetched, matches the file | — | verifier **31 → 76 checks** |
| ~~—~~ | ✅ **C-3 + C-4 — DONE 17 Aug.** Dashboard **6 → 9 views**: Documents Outstanding · Blocked On A Third Party · Visa Expiry. The columns existed; these make them visible | — | 🔴 **needs `buildDashboard()` re-run** |
| ~~—~~ | ✅ **Visa-expiry deadline view — DONE 17 Aug** (view 9, shaded inside 60 days) | — | same re-run |
| ~~—~~ | ✅ **C-5 column half — DONE 17 Aug.** `Referral` was already there; only `SMS` was missing | — | 🔴 needs `patchMasterDropdowns()` |
| ~~—~~ | ✅ **Dashboard views 4/7/8/9 VERIFIED 18 Aug.** View 4 now matches its own KPI exactly (10 = 10). View 8 excludes `Received`/`Not required`. View 9 excludes the 2 expired rows and shades exactly the 4 inside 60 days — every number predicted by the seeder matched the screen | — | ✅ |
| ~~—~~ | ✅ **`Sheet4` opened and confirmed EMPTY** (was an unearned assumption). Now a `preflightGoLive()` check, not an eyeball | — | ✅ |
| **1** | **C-1** — build to **their** `Client Enquiry Form` | 2 | 🔴 **BLOCKED — we never asked for the form** (D-332). D-314 said "ask for it, do not design it" |
| **2** | **C-2** — secure upload link generator. ⚠️ **Decide first:** a Graph share link on the client's whole folder exposes the checklist and everything else in it, so it needs its own `Upload` subfolder. Also depends on §5 risk 1 — do not build a link generator onto a personal OneDrive account | 2 | 🟠 **blocked on the OneDrive handover** |
| **3** | **C-5 capture path** — Referral and SMS need somewhere to come *from*, not just a dropdown value | 1 | 🟢 |
| ~~—~~ | ✅ **`DATA SHEET` → ENQUIRIES — BUILT 18 Aug (D-327).** `build_enquiries_import.py`, **621 rows** ready. Found **47% of their enquiry dates day/month transposed by Excel's US locale** — 55 impossible future dates → 0 after repair. `Status` and `Channel` left blank on purpose: the vocabulary is real, the source field does not exist | — | 🔴 needs the client to confirm Channel, then `--write` + paste |
| ~~—~~ | ✅ **M6 — BUILT 18 Aug (D-328).** 7/30 cadence, historical baseline, never writes Status | — | 22/22 |
| ~~—~~ | ✅ **M8 COMPLETE 18 Aug (D-339)** — stop-on-reply added, 32/32 | — | needs one script run |
| **0** | 🟢 **CLIENT IMPORT — 38 rows ready, `build_master_import.py`.** Runs the moment Q9 lands and the demo rows come out | 1 | ⛔ **Q9 (A-20) only** |

### ⛔ THE GO-LIVE GATE — nothing is activated until all four are true

| | Check | How |
|---|---|---|
| 1 | 🔴 **The 14 demo rows are OUT of MASTER** | on import day only: `previewDemoRows()` → `removeDemoRows()` → **`resetCodeSequence()`** → `preflightGoLive()` = **GO**. Order matters (D-324) |
| 2 | Scheduling is **Weekdays 09:00/13:00/17:00** | both scenarios are still on the 15-minute default |
| 3 | OneDrive is on a **Yale** account | connection 9279810 is still `sharry00010@gmail.com` — §5 risk 1 |
| 4 | **Robinder has given a date** | not implied by him saying yes to something else |

🔴 **On the demo rows.** They are 14 invented people with `@example.com` addresses. M3 would create
folders for them **in the client's real OneDrive**, M4 would file checklists into those folders, and
M4b + route C would draft emails to the fake addresses. Nothing errors — it all reports success.
⛔ The durable marker is the **email**, not the `DEMO-` code: `master_codes.gs` overwrites column A on
a 5-minute timer, which is how `removeDemoRows()` silently stopped working once before (D-296).
This instruction existed in four other files and in **neither** this one nor `CUTOVER-PLAN.md`.
Now it is `scripts/preflight_go_live.gs`, a check rather than a sentence (D-323).

---

# 5 · 🔴 THE THREE LIVE RISKS

**1. OneDrive runs on our personal account.**
Make connection **9279810** is OAuth'd as **`sharry00010@gmail.com`**. Every folder create and every
checklist copy in M3 and M4 goes through it. Asked of Robinder 16 Aug.
🔑 **Files do not move and the blueprints do not change** (D-318) — the drive is addressed by ID
(`A0BABA3C2640082C`) and `sharry00010` appears only in four cosmetic `metadata.restore` labels. Only
the connection's identity changes.
⛔ **ADD `project1@` first, prove it works, remove ours only after.** Revoke-first kills M3 and M4
the same minute. ⚠️ Unverified: that Graph resolves `/v1.0/drives/{id}/items/...` identically for a
guest-granted account. Test while both still work.

**2. ~~M5b has nowhere to run.~~ ✅ CLOSED 16 Aug (D-322) — built and applied.** Route C inside M4.
No third scenario, no paid plan, draft still lands in `visa.lodgement@`.
⚠️ **The one thing still untested:** no row has ever carried `AE = CHASE` in anger. The partition is
proved on paper over 1,008 row shapes and the module identifiers are the same ones M4b already runs,
but route C has not executed once. **It gets its first real run in the pilot, not before.**

**3b. ⚠️ `Sheet4` in the MASTER workbook is unexplained.** Not created by us, never opened. G8:
"probably empty" is a conclusion that requires opening the file. Ask Sharjeel.

**3. ⛔ ~~Subclass `186` is a coverage gap.~~ THE 186 FINDING WAS WRONG — RETRACTED (D-325).**
186 was already in the dropdown. The run log said `OK H — already has 186. Nothing to do.` The claim
came from a `sed` read that started **one line below** the array element it was looking for. Nothing
was ever checked against the live sheet.

✅ **The real gap, found by cross-checking properly: `190` had no CHECKLIST MAP row.** It was in the
router and in the dropdown, so every 190 client was stamped `NO CHECKLIST MAPPED — review` and the
checklist — **the one we asked Robinder for three times** (A-02, D-280) — was never filed. Cause: a
comment reading *"no 190 checklist exists"* that was true when written and false from 11 Aug. Now
mapped, and `verify_blueprints.py` has a permanent router-vs-map-vs-disk cross-check (**79 checks**).

🔑 **Genuinely true about coverage:** MASTER offers 23 visa types, CHECKLIST MAP resolves 14.
The other 10 — `300 · 186 · 191 · 600 · Skills Assessment · EOI · ART · Bridging · Other` — route to
`NEEDS REVIEW`, which is correct, and was already disclosed to the client in `YM-DQ-e573`.

---

# 6 · WHAT WE HOLD, AND WHAT WE DO NOT

**Census of all 66 tabs across the four workbooks** (`scripts/audit_all_tabs.py`, D-316) — a census,
not a sample:

| Field | Present? |
|---|---|
| **Team** | ⛔ **nowhere.** Not one column in any tab |
| **Office** | ⛔ **nowhere.** The two `LOCATION` columns hold Australian *states* and *ONSHORE/OFFSHORE* |
| Email | ~66 clients book-wide — **but 0 of the 40 active ones** |
| Consultant | 713 names book-wide — **but only 4 of the 40 active ones**, and they span *both* teams |
| Phone | `DATA SHEET` **654 of 676** non-empty rows. ⚠️ our notes said "~200 rows" and "392/395" — **both wrong, never computed** (D-327) |

**The import source is `LODGEMENT JULY TO PRESENT`** — 42 rows = **40 people** after one duplicate and
a row literally named `SAMPLE`. ⛔ `SUMMARY OF CLIENTS` is **not** an import source: 47 names, 11 with
a visa type. We recommended it once without opening it (D-315).

---

# 6b · 🤖 HOW THIS PROJECT KEEPS ITSELF HONEST (D-329)

| | |
|---|---|
| `.claude/hooks/git-guard.py` | `PreToolUse` on Bash. **Blocks `git commit`** if `repo_hygiene.py` fails; warns that `origin` is a personal account on `git push` |
| `/yale-ship` | session-end ritual — was a CLAUDE.md section, now a skill that loads only when used |
| `/yale-client-message` | the G5/G9 gate before anything reaches Robinder or the team |

🔑 **Why:** the gate was declared mandatory twice in CLAUDE.md and enforced by nothing — it ran
because the model remembered. Writing a test for the new hook then found that `repo_hygiene.py`
had been scanning **tracked files only**, so a brand-new file carrying a secret was invisible at
exactly the moment the check exists for. Both fixed and both tested by planting real violations.

---

# 6c · 📞 FRIDAY 21 AUG — THE CALL

▶ **`CALL-RUNBOOK-robinder-friday.md`** — read-aloud steps for Meta · WhatsApp · OneDrive, researched
19 Aug against current sources (D-341).

🔴 **Two things that runbook corrects:** the `automation@` M365 user we have been asking for since
21 July **cannot be created — there is no M365 tenant**, the drive is Robinder's personal Hotmail
account. And "WhatsApp verification" is really **Meta business verification first**, with display-name
review blocked behind it — so the only question worth asking is whether the *business* is verified.

---

# 7 · TOOLING — built this week, use it

| Command | What it does |
|---|---|
| `python3 scripts/repo_hygiene.py` | 🔴 **before every commit.** Secrets, client PII, tracked spreadsheets, **Apps Script global-name collisions** (D-326), remote warning |
| `python3 scripts/verify_blueprints.py` | **79 checks.** Proves M3/M4 routes partition their input — enumerates all 1,008 row shapes M4's trigger can emit and asserts exactly one of the three routes fires |
| `python3 scripts/audit_all_tabs.py` | census of every tab; skips credential columns by header |
| `python3 scripts/build_client_questions.py` | regenerates the client documents + CSV with computed figures |
| **`INPUTS-REGISTER.md`** | 🔑 read before planning ANY module — what we hold, what we do not, what each gap blocks (D-331) |
| `python3 scripts/build_master_import.py` | **38 MASTER rows** from the team's returned list joined to their live tab. Report-only by default (D-330) |
| `python3 scripts/build_enquiries_import.py` | 621 ENQUIRIES rows from their call log. **Report-only by default**; `--write` emits PII outside the repo. Repairs the transposed dates (D-327) |
| `python3 scripts/build_pilot_import.py` | pilot rows from their real list. `--office`/`--team` default **blank** on purpose |
| **`preflightGoLive()`** (`scripts/preflight_go_live.gs`) | 🔴 **the go-live gate.** Read-only. Must print **GO** before any scenario is activated (D-323) |
| `previewDemoRows()` · `seedDemoWorkflowColumns()` | dry-run the teardown · fill Z–AC on demo rows so dashboard views 7/8 can be **seen working** (D-324) |
| `node scripts/test_m8_lead_followup.js` | **32 checks.** Runs the real M6 `.gs` under a frozen clock. Proves the 621-row flood is prevented |
| `node scripts/test_s56_parse.js` | **36 checks** — the M9 JSON parser against fenced/prose/double-encoded/garbage input |
| `node scripts/test_s56_deadlines.js` | **22 checks** — independent recomputation of every legal deadline |
| `node scripts/test_m5_dormancy.js` | **24 checks.** Loads the real `m5_dormant_detector.gs` and runs it against a fake MASTER with a frozen clock. Run it after ANY edit to that file |
| `bash scripts/gen_decisions_index.sh` | after appending to `DECISIONS.md`. Header **must** be `## D-NNN \| Title` on one line |

🔑 **`scenarios_get` / `scenarios_update` work over MCP** — never ask anyone to export a blueprint.
🔑 **Verify a Make module identifier by creating a throwaway on-demand scenario.** Costs 0 ops.
⚠️ `validate_module_configuration` gives a **false** "connection not found in options" for Gmail
9452213 — it says the same for a module that provably runs (D-321). Do not trust that negative.

✅ **Throwaways `6959410` and `6967000` deleted 16 Aug.** One on-demand leftover remains:
`6839607 YM-TMP-list-application-forms` — inactive, so it does not count against the 2-active cap.
**Ops still 481/1000** — the whole of 16 Aug cost zero, blueprints edited over MCP and never run.

---

# 8 · CONTEXT MAP

| Question | File |
|---|---|
| Where are we? | **this file** |
| What is outstanding with the client? | `CLIENT-ASKS.md` |
| What data do we hold? | `CLIENT-DATA-INVENTORY.md` |
| Their own 12 process SOPs | `CLIENT-SOP-WORKFLOWS.md` |
| Dashboard end to end | `DASHBOARD-TRACKER.md` |
| Contracted modules + the 5 forgotten items (C-1…C-5) | `ROADMAP.md` |
| Hours vs the 48h cap | `HOURS-LEDGER.md` |
| Why was X decided? | `DECISIONS-INDEX.md` → grep one entry |
| The two client documents | `CLIENT-QUESTIONS-team.md` · `CLIENT-QUESTIONS-robinder.md` (**held**) |

⛔ **`DECISIONS.md` is ~380 KB. Never read it whole.** Index first, then one entry.
