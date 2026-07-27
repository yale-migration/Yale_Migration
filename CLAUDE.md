# Yale Migration Automation — Build Workspace

Client: Yale Migration and Education Consultants (Brisbane). Contact: Robinder (WhatsApp, Roman Urdu,
short messages). Consultant: Muhammad Sharjeel Saleem. Engagement: MVP 48h (signed, paid), scope locked
to Proposal v3 (19 Jul 2026) — see `../PROJECT-STATE.md` for full history.

## Session ritual (EVERY session in this folder)
1. START: read `ROADMAP.md` (current module + status) and the last 10 lines of `CLIENT-LOG.md`.
2. WORK: one module at a time, per `ARCHITECTURE.md` conventions.
3. END: update `ROADMAP.md` statuses, append decisions to `CLIENT-LOG.md`/`DECISIONS.md`, commit AND push:
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
  Anthropic billing). We hold invited/delegated access only.
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
client folders · Gmail (project1@, delegate) + Claude API (Haiku classify / Sonnet draft) = email triage
· Meta/WhatsApp Business = enquiry channels · Looker Studio = Phase 2 dashboard.
