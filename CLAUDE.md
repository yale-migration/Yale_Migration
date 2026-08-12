# Yale Migration Automation — Build Workspace

Client: Yale Migration and Education Consultants (Brisbane). Contact: Robinder (WhatsApp, Roman Urdu,
short messages). Consultant: Muhammad Sharjeel Saleem. Engagement: MVP 48h (signed, paid), scope locked
to Proposal v3 (19 Jul 2026) — see `../PROJECT-STATE.md` for full history.

## 🔴 READ `PROCESS.md` — its 8 gates are MANDATORY, not advice
Each gate exists because a specific dated failure happened (31 Jul: an instruction to the client changed
4 times in one day). Summary — the full rules are in `PROCESS.md`:
- **G1 VERIFY-BEFORE-INSTRUCT** — no platform capability, UI path, permission model or limit reaches a
  client-facing message until verified against a PRIMARY SOURCE **this session**. Memory does not count.
  Prior chats do not count. Check public DNS before asking a client what platform they use.
- **G2 SEARCH-OURSELVES-FIRST** — grep `DECISIONS.md`/`CLIENT-LOG.md`/`ACCESS.md` BEFORE asking the client
  anything. the full decision history is recorded; asking what they already answered is the most credibility-damaging
  thing we can do.
- **G3 SAME-DAY OPERATIONAL LOG** — who set up what, on whose machine, who holds which credential, how the
  client prefers to work → `ACCESS.md`, same day. Not just technical decisions.
- **G4 ONE-FOCUS LOCK** — `ROADMAP.md` has exactly ONE 🎯 ACTIVE task. Anything else gets ONE LINE in the
  right file and is dropped. Depth on the wrong thing looks identical to progress and is not.
- **G5 CLIENT-MESSAGE GATE** — before sending: one ask only · every instruction verified · exact account
  named · device stated if it matters · not a repeat · walk each click for dead-ends ·
  **name the exact FILE, TAB and PATH** when referring to a document (D-267).
- **G6 SINGLE SOURCE, NEVER RESTATE** — one authority per fact; copies drift and cause wrong builds.
- **G7 DECISION IDS FROM MAX, NOT COUNT** — `grep -c` produced 7 duplicate D-numbers once.
- **G8 SEARCH THE WHOLE TREE, NOT THE TIDY ONE** — a curated folder is not the library. And **a filename is
  not evidence of content — open the file** (D-223/D-224).
- 🔴 **BEFORE ANY ACCESS REQUEST: run `connections_list` and read the actual scopes** (D-271). We nearly
  asked Robinder to authorise Gmail he had already authorised on 1 Aug.

**Standing rule: a spec is not a deliverable.** Always be able to answer *"what can the client see working?"*

## Session ritual (EVERY session in this folder)
1. START: read **`STATUS.md`** (the single source of "where are we"), then **`CLIENT-ASKS.md`** (what we are
   waiting on the client for), then the 🎯 ACTIVE task in `ROADMAP.md`, then the last 5 lines of
   `CLIENT-LOG.md`.
2. WORK: **the active task only** (G4), per `ARCHITECTURE.md` conventions.
3. END: update `STATUS.md` (shipped vs specced — honestly) + `ROADMAP.md` statuses, append to
   `CLIENT-LOG.md`/`DECISIONS.md`/`ACCESS.md` (G3), commit AND push:
   `git add -A && git commit -m "<module>: <what changed>" && git push`.

## Remote
PRIVATE repo: https://github.com/m-sharjeel-saleem/Yale_Migration (origin/main, gh auth active).
docs/ is CURATED — never add: client PII files, third-party materials (Apex/Zap It samples),
archive junk, `~$` lock files, anything from `99 ARCHIVE`.

## Hard rules (never break)
- **NO SECRETS in this repo** — no API keys, no passwords, no client PII. The Claude key lives ONLY in
  Make's connection. Client names/passports never get copied here.
- **AI never auto-sends migration advice** — only the Registered Migration Agent advises (legal rule).
  All AI drafts route to human review. Confidence thresholds → "Needs Review", never silent guesses.
- **Everything is built in CLIENT-owned accounts** (their Make, their Sheet, their OneDrive, their
  Anthropic billing). We hold invited access only.
- **New client requests are NOT scope** — log them in `CHANGE-REQUESTS.md` (what/when) AND
  `PHASE-2-3-BACKLOG.md` (estimate/dependency/commercial position), reply "Phase 2/3 list mein daal diya",
  keep building the MVP. **Everything in the backlog is billable — quoted after go-live, never absorbed.**
  ⚠️ Robinder's recurring ask is **multi-branch oversight** (CR-001 → CR-007 → CR-009). Three shapes, one
  need. It is the largest revenue opportunity in the account — treat it as a headline, not a favour.
- Client approvals arrive as WhatsApp 👍 — paste the message into `CLIENT-LOG.md` same day.

## ⚠️ Before building or switching on ANY scenario
**`DEFINITION-OF-DONE.md` — the 12-point gate every scenario must pass.** M3 ran successfully four times and
still had five production blockers. Working ≠ production-ready. Apply it to M4–M9 too, not just M3.

## ⚠️ Current blocker status (13 Aug)
**M3 ✅ · M4a ✅ · M5a ✅ · DASHBOARD ✅ — all built and proven against live client data.**
- ✅ **A-01 downgraded (D-291):** `Weekdays (Mon-Fri)` + 3 fixed times = ~392 ops/mo against 1,000.
  **M3 and M4 can go live on the Free plan.** Paid plan still needed for M6/M9 — Free caps *active
  scenarios* at 2, and M3+M4 is exactly two.
- 🔴 **The ONE blocker is A-14** — the link to the Google Sheet they actually use. Their
  `Engaged Client Tracker.xlsx` is **abandoned** (D-289); importing it would have loaded dead data.
- 🟠 **A-15** — Make's Create-a-Draft module needs `https://mail.google.com/`; our connection has only
  `gmail.modify` (D-290). Blocks M4b/M5b. One reauthorize click, bundled with the cutover call.
- ⚠️ **This is a CUTOVER, not an import** — read `CUTOVER-PLAN.md` before touching M2.
**481 of 1,000 ops used.** Read `PRODUCTION-READINESS.md` and `CLIENT-ASKS.md`.

## File map
- `STATUS.md` — where we are · `CLIENT-ASKS.md` — **what we are waiting on the client for**
- `PROCESS.md` — the 8 gates · `PHASE-2-3-BACKLOG.md` — billable work beyond the MVP, with estimates
- `ROADMAP.md` — module checklist with live statuses
- `CLIENT-LOG.md` — chronological log of every client message/decision that matters
- `CHANGE-REQUESTS.md` — new asks parked for Phase 2/3, dated
- `DECISIONS.md` — architecture decisions + why (append-only)
- `ARCHITECTURE.md` — system design, naming conventions, data contract
- `ACCESS.md` — access inventory + status (no secrets)
- `PRODUCTION-READINESS.md` — blockers between 'it works' and 'it can be switched on'
- `DEFINITION-OF-DONE.md` — the 12-point gate EVERY scenario must pass before going live
- `scripts/` — Apps Script sources · `scenarios/` — Make blueprints (JSON, restorable) · `assets/samples/` —
  client-provided samples (sanitized only)
- **`docs/05-canonical-checklists/`** — the ONLY checklist set M4 may select from. 27 files, hash-recorded
  in `MANIFEST.json`, mirrored to OneDrive `INFORMATION HUB → CLIENT DOCUMENT CHECKLISTS` (D-242/D-247)

## Stack (decided, don't relitigate)
Google Sheet = database · Make.com = connector/scenarios · OneDrive (personal, via Make connection) =
client folders · Gmail via **Make↔Gmail OAuth** — ✅ **`Yale's Gmail connection` (id 9452213) ALREADY EXISTS**
on `visa.lodgement@`, client-created, `gmail.modify` (can send AND draft), valid to Jan 2027. **No further
authorisation is needed for M4b/M5b** (D-271). ⛔ NOT delegation (D-78/D-79/D-80) — + Claude API
(Haiku classify / Sonnet draft) = email triage
· Meta/WhatsApp Business = enquiry channels · Looker Studio = Phase 2 dashboard.
