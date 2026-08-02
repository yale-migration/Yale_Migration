# Yale Migration Automation — Build Workspace

Client: Yale Migration and Education Consultants (Brisbane). Contact: Robinder (WhatsApp, Roman Urdu,
short messages). Consultant: Muhammad Sharjeel Saleem. Engagement: MVP 48h (signed, paid), scope locked
to Proposal v3 (19 Jul 2026) — see `../PROJECT-STATE.md` for full history.

## 🔴 READ `PROCESS.md` — its 5 gates are MANDATORY, not advice
Each gate exists because a specific dated failure happened (31 Jul: an instruction to the client changed
4 times in one day). Summary — the full rules are in `PROCESS.md`:
- **G1 VERIFY-BEFORE-INSTRUCT** — no platform capability, UI path, permission model or limit reaches a
  client-facing message until verified against a PRIMARY SOURCE **this session**. Memory does not count.
  Prior chats do not count. Check public DNS before asking a client what platform they use.
- **G2 SEARCH-OURSELVES-FIRST** — grep `DECISIONS.md`/`CLIENT-LOG.md`/`ACCESS.md` BEFORE asking the client
  anything. 127 decisions are recorded; asking what they already answered is the most credibility-damaging
  thing we can do.
- **G3 SAME-DAY OPERATIONAL LOG** — who set up what, on whose machine, who holds which credential, how the
  client prefers to work → `ACCESS.md`, same day. Not just technical decisions.
- **G4 ONE-FOCUS LOCK** — `ROADMAP.md` has exactly ONE 🎯 ACTIVE task. Anything else gets ONE LINE in the
  right file and is dropped. Depth on the wrong thing looks identical to progress and is not.
- **G5 CLIENT-MESSAGE GATE** — before sending: one ask only · every instruction verified · exact account
  named · device stated if it matters · not a repeat · walk each click for dead-ends.

**Standing rule: a spec is not a deliverable.** Always be able to answer *"what can the client see working?"*

## Session ritual (EVERY session in this folder)
1. START: read **`STATUS.md`** (the single source of "where are we"), then the 🎯 ACTIVE task in
   `ROADMAP.md`, then the last 5 lines of `CLIENT-LOG.md`.
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
- **New client requests are NOT scope** — log them in `CHANGE-REQUESTS.md`, reply "Phase 2/3 list mein
  daal diya", keep building the MVP.
- Client approvals arrive as WhatsApp 👍 — paste the message into `CLIENT-LOG.md` same day.

## File map
- `ROADMAP.md` — module checklist with live statuses (the single source of "where are we")
- `CLIENT-LOG.md` — chronological log of every client message/decision that matters
- `CHANGE-REQUESTS.md` — new asks parked for Phase 2/3, dated
- `DECISIONS.md` — architecture decisions + why (append-only)
- `ARCHITECTURE.md` — system design, naming conventions, data contract
- `ACCESS.md` — access inventory + status (no secrets)
- `scripts/` — Apps Script sources · `scenarios/` — Make blueprints/exports · `assets/samples/` —
  client-provided samples (sanitized only)

## Stack (decided, don't relitigate)
Google Sheet = database · Make.com = connector/scenarios · OneDrive (personal, via Make connection) =
client folders · Gmail via **Make↔Gmail OAuth** — `visa.lodgement@` inbound (s56) + `project1@` outbound; ⛔ NOT delegation (D-78/D-79/D-80) — + Claude API (Haiku classify / Sonnet draft) = email triage
· Meta/WhatsApp Business = enquiry channels · Looker Studio = Phase 2 dashboard.
