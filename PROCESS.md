# PROCESS — the gates that stop the failures we actually had

Not aspirational. Each gate exists because a specific, dated failure happened. Referenced from `CLAUDE.md`
so it loads every session.

---

## ROOT-CAUSE LOG (what actually went wrong, 31 Jul 2026)

| # | Failure | Real cause | Gate that prevents it |
|---|---|---|---|
| 1 | Mailbox-access instruction changed 4× in one day (delegation → admin switch → OAuth → screen-share) | Platform capabilities asserted from memory, verified only after the client had already been told | **G1 VERIFY-BEFORE-INSTRUCT** |
| 2 | Asked the client "whose mailbox is `visa.lodgement@`?" | The answer was in our own D-64 header evidence the whole time | **G2 SEARCH-OURSELVES-FIRST** |
| 3 | Asked the client how the Make account was set up; proposed "I share my screen" | The screen-share history and credential-holding facts were never written down | **G3 SAME-DAY OPERATIONAL LOG** |
| 4 | Hours spent on M9 mailbox permission while T2/T3/T4 (the demo) sat undone | No focus lock — followed the newest thread instead of the critical path | **G4 ONE-FOCUS LOCK** |
| 5 | Gave the client steps that would dead-end (no Add button; mobile; personal-Gmail scopes) | No pre-send check on client-facing instructions | **G5 CLIENT-MESSAGE GATE** |

Note the pattern: **none** of these were hard technical problems. All five were process gaps.

---

## G1 — VERIFY-BEFORE-INSTRUCT (hard gate)

**No platform capability, UI path, permission model or limit reaches a client-facing message until verified
against a primary source this session.** Memory does not count. Prior chats do not count.

Cheap checks, in order:
1. **Public DNS/MX** for "what platform are they on" — never ask the client (D-76 closed a question this way)
2. **Vendor docs** for permission models (Google Workspace Admin Help, Gmail API docs)
3. **The connector's own docs** for what it supports (apps.make.com, help.make.com)
4. **The client's own screenshots** — they beat documentation for current UI state (D-84 proved a page had no
   Add button that the docs implied)

If a fact cannot be verified, the message says "I need to check X" rather than stating it.

## G2 — SEARCH OURSELVES FIRST (hard gate)

**Before any question goes to the client, grep this repo.** `DECISIONS.md` is 127 entries; the answer is
often already there.

```
grep -rn -i "<topic>" DECISIONS.md CLIENT-LOG.md ACCESS.md ROADMAP.md docs/
```

Asking a client something we already recorded is the single most credibility-damaging thing we can do. It
says we are not reading their answers.

## G3 — SAME-DAY OPERATIONAL LOG

`DECISIONS.md` captured technical decisions but not **operational** ones. Both go in, same day:
- who set up what, **on whose machine**, in whose account
- who holds which credential, and who does NOT
- how the client prefers to work (screen-share, WhatsApp, timing)

These go in `ACCESS.md`. Failure 3 above happened purely because this was missing.

## G4 — ONE-FOCUS LOCK (the expensive one)

**`ROADMAP.md` has exactly ONE 🎯 ACTIVE task at a time.** Nothing else gets built, specced or optimised.

When something new arrives (client question, discovered blocker, better idea):
1. Is it **blocking the active task**? → handle it
2. Otherwise → **one line in the right file, and stop.** `CHANGE-REQUESTS.md`, an OPEN CLIENT ASK, or a
   module note. Do **not** solve it now.

Failure 4 cost most of 31 Jul: a permission for M9 — a module **days away** and not on the critical path —
consumed the day while the demo that earns client confidence stayed unbuilt. Depth on the wrong thing looks
identical to progress and is not.

## G5 — CLIENT-MESSAGE GATE (run every time, before sending)

- [ ] **One ask.** Two asks = neither gets done (proven 30 Jul → 31 Jul)
- [ ] **Every instruction verified** under G1 — no "I think it's under…"
- [ ] **Exact account named** for every login ("sign in as `info@yalemigration.com.au`", not "your email")
- [ ] **Device stated** if it matters (Make's editor is desktop-only — mobile fails)
- [ ] **Not a repeat** of an ask already pending — check OPEN CLIENT ASKS
- [ ] **No blame language and no self-flagellation.** State the constraint, give the step, move on
- [ ] **Would this dead-end?** Mentally walk each click. If any step might not exist, verify it first

---

## SESSION RITUAL (replaces the old one in CLAUDE.md)

**START**
1. Read `STATUS.md` — the single source of "where are we"
2. Read the 🎯 ACTIVE task in `ROADMAP.md` — that is the only thing being worked on
3. Read the last 5 lines of `CLIENT-LOG.md`

**DURING**
- Any client-facing instruction → G1 + G5
- Any question for the client → G2 first
- Anything not the active task → one line, park it (G4)

**END**
1. Update `STATUS.md` (shipped vs specced — be honest, specs are not deliverables)
2. Update the 🎯 ACTIVE task status in `ROADMAP.md`
3. Append to `CLIENT-LOG.md` / `DECISIONS.md` / `ACCESS.md` (G3)
4. `git add -A && git commit -m "<module>: <what changed>" && git push`

---

## G6 — SINGLE SOURCE, NEVER RESTATE (added 2 Aug)

`ARCHITECTURE.md` v1 duplicated the MASTER column list and the folder tree that also lived in
`docs/MASTER-SHEET-SPEC.md` and `DECISIONS.md`. The copies drifted, and the stale copy was the one CLAUDE.md
pointed at — so the next build would have created 10 wrong folders in the client's live OneDrive (D-129).

**Rule: each fact has exactly ONE authoritative file. Every other document links to it.**
- Where we are → `STATUS.md` · What's next → `ROADMAP.md` · How → `ARCHITECTURE.md` ·
  Why → `DECISIONS.md` · Columns → `docs/MASTER-SHEET-SPEC.md` · Access/credentials → `ACCESS.md`
- **Before building anything, re-read the authoritative file for that thing** — not your memory of it, and
  not a summary in another document.

## G7 — DECISION IDS COME FROM MAX, NOT COUNT (added 2 Aug)

Seven duplicate decision IDs were created because the next number was taken from `grep -c` (a count) instead
of the highest existing ID (D-131). Duplicates make every cross-reference ambiguous.

```
grep -oE '^D-[0-9]+' DECISIONS.md | sort -t- -k2 -n | tail -1     # → next = that + 1
```
Also: after any renumber, update cross-references repo-wide and re-verify uniqueness:
```
grep -oE '^D-[0-9]+ \|' DECISIONS.md | sort | uniq -d            # must be empty
```

## THE STANDING RULE

**A spec is not a deliverable. A verified working thing the client can see is a deliverable.**

At any moment, be able to answer: *"what can the client actually see working?"* If the answer is "nothing
yet", that is the only thing that matters and everything else is a distraction.
