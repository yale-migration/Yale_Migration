# WHERE WE STAND — 16 Aug 2026
**The one file to read after a context reset.** Position, gaps, resume point.
`STATUS.md` is history only. `DECISIONS-INDEX.md` → `DECISIONS.md` is why.

---

# 1 · THE ONE-LINE POSITION

**The consolidated data document went to the client today. Nothing from us is blocked by it.**
M4b is fully specced with every identifier verified (D-321) and is the next thing to build.

---

# 2 · MVP PROGRESS — 11 modules

| # | Module | State | Notes |
|---|---|---|---|
| M1 | Discovery | ✅ done | reopened twice |
| M2 | Master data layer | ✅ built · 🔴 **empty** | MASTER + ENQUIRIES live. Needs the import |
| M3 | Intake → folders | ✅ **proven + hardened** | v2 catch-all (E1, D-315) · **OFF** |
| M4a | Checklist select + file | ✅ **proven + hardened** | v2 guard (E2, D-315) · **OFF** |
| M4b | Checklist email draft | 🟢 **specced, every id verified — BUILD THIS NEXT** | D-321 |
| M5a | Dormancy detection | ✅ running daily | **Apps Script, not Make.** Zero ops |
| M5b | Chase email draft | 🟠 **blocked by a plan limit, not by data** | see §5 |
| M6 | Enquiry capture | 🟠 spec'd, unbuilt | cadence 7 + 30 days (D-307) |
| M7 | Phone intake | ⬜ not started | their 13-step SOP found (D-307) |
| M8 | Follow-up engine | ⬜ not started | nurtures leads over ENQUIRIES. Not M5 |
| M9 | Email triage / s56 | 🟠 spec'd, unbuilt | their 7/14/28 ladder, already lapsing (D-305) |
| M10 | Testing | ⬜ | needs 2–3 real files from Robinder |
| M11 | Handover | 🔴 | **OneDrive runs on OUR personal account** — see §5 |
| — | Dashboard | ✅ built + tested | goodwill, not MVP scope |

**Honest: ~26%** — 10.5 of 40 contracted build-hours (D-311). **~47 of 48 contract hours consumed**;
the gap is ~16h of absorbed out-of-scope work. See `HOURS-LEDGER.md`.

**Ops: 481 / 1,000 · 519 left · resets 25 Aug.** Both scenarios deliberately **OFF**, `activeScenarios: 0`.
All 16 Aug work cost **0 ops** — blueprints edited over MCP, never run.

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
| **1** | 🟢 **M4b — checklist email draft.** Full spec + every verified identifier in **D-321** | 2 | **nothing.** ⚠️ testable on seeded rows only — no real client has an email yet |
| **2** | 🟠 **M5b — chase email draft.** Decide the route first (§5) | 2 | plan limit, not data |
| **3** | **Suppress dormancy on imported rows** until first contact — else 40 false alarms on day 3 | 0.5 | 🟢 (D-321) |
| **4** | **C-1 … C-5** — the five contracted items, now tracked in `ROADMAP.md` | 9 | C-2/3/4 need the MASTER columns run first |
| **5** | Visa-expiry deadline view | 1 | 🟢 source exists |
| **6** | `DATA SHEET` → ENQUIRIES using **their** words: `Not Proceeding` · `Pending Decision` · `Lost Lead` | 2 | 🟢 (D-307) |
| — | **10-row pilot import** | 1 | 🔴 waits on the team's reply (`TEAM`/`CONSULTANT`/`EMAIL`) |

⛔ **Do not switch M3/M4 on** until real clients are in and Robinder gives a date.
⛔ **Set `Weekdays 09:00/13:00/17:00` in the same action** — both are still on 15-min.

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

**2. M5b has nowhere to run.** Free plan caps **active** scenarios at **2**; M3 + M4 are those two.
M5a is Apps Script and cannot write to `visa.lodgement@`. Decide: fold into an existing scenario ·
leave it off until Make Core (~$9/mo) · or draft from `project1@` (free, wrong sender).

**3. Subclass `186` is a coverage gap.** In their live pipeline *and* their own fee master, but in
neither MASTER's dropdown nor M4's router.

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
| Phone | plentiful — `DATA SHEET` 392/395 |

**The import source is `LODGEMENT JULY TO PRESENT`** — 42 rows = **40 people** after one duplicate and
a row literally named `SAMPLE`. ⛔ `SUMMARY OF CLIENTS` is **not** an import source: 47 names, 11 with
a visa type. We recommended it once without opening it (D-315).

---

# 7 · TOOLING — built this week, use it

| Command | What it does |
|---|---|
| `python3 scripts/repo_hygiene.py` | 🔴 **before every commit.** Secrets, client PII, tracked spreadsheets, remote warning (D-317) |
| `python3 scripts/verify_blueprints.py` | 31 checks. Proves M3/M4 routes partition their input — no row matches both, none matches neither |
| `python3 scripts/audit_all_tabs.py` | census of every tab; skips credential columns by header |
| `python3 scripts/build_client_questions.py` | regenerates the client documents + CSV with computed figures |
| `python3 scripts/build_pilot_import.py` | pilot rows from their real list. `--office`/`--team` default **blank** on purpose |
| `bash scripts/gen_decisions_index.sh` | after appending to `DECISIONS.md`. Header **must** be `## D-NNN \| Title` on one line |

🔑 **`scenarios_get` / `scenarios_update` work over MCP** — never ask anyone to export a blueprint.
🔑 **Verify a Make module identifier by creating a throwaway on-demand scenario.** Costs 0 ops.
⚠️ `validate_module_configuration` gives a **false** "connection not found in options" for Gmail
9452213 — it says the same for a module that provably runs (D-321). Do not trust that negative.

🧹 **Delete when M4b is applied:** scenarios `6959410` and `6967000`, both on-demand, inactive, 0 ops.

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
