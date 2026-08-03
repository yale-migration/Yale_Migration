# DEFINITION OF DONE — every Make scenario in this project
**A module is not "done" when it works once. It is done when it survives being switched on.**

Created 3 Aug after the M3 production audit found 5 blockers in a scenario that had already run successfully
four times (`PRODUCTION-READINESS.md`). Working ≠ production-ready. This checklist is the difference.

**Apply to M3, M4, M5, M6, M7, M8, M9 — every one. No exceptions, no "we'll do it later".**

---

## 1. Naming and legibility
- [ ] Scenario named `YM-M<n>-<purpose>` (e.g. `YM-M3-folder-create`)
- [ ] Every module **renamed to its intent** — `Create client folder`, not `OneDrive`. The client will open
      this one day and must be able to read it.
- [ ] Connections named `YM <service> — <account>`
- [ ] As-built module IDs recorded in the scenario's spec file (Make does not number from 1)

## 2. Trigger correctness
- [ ] Filter proven to select **only** the intended rows — tested with a row that should NOT match
- [ ] **Idempotency PROVEN**: run twice unchanged, second run returns **0 bundles**
- [ ] Trigger limit set deliberately (not left at default) and justified in the spec

## 3. Mappings — the single biggest source of silent failure
- [ ] **Every field reference inserted by CLICKING** the panel, never typed or pasted (D-176)
- [ ] Visual check before saving: chips read `2. Field Name (X)` or `12. body: field` —
      **no backticks, no `Module.Body.field` form**
- [ ] Verified in a real run's **INPUT** panel that every mapped value resolved to a real value —
      **never `empty`** (D-185)
- [ ] ⚠️ **A formula that returns its DEFAULT branch is not proof it works** (D-175). Validate with an input
      that forces a NON-default branch.

## 4. Data safety
- [ ] No destructive operation (delete, overwrite, clear) without an explicit emptiness/existence guard
- [ ] Writes touch **only** intended cells — confirm `Updated cells: N` matches expectation (D-187)
- [ ] Existing client data can never be overwritten — e.g. `conflictBehavior: "fail"` on folder creation
- [ ] Blank mapped fields must not clear existing values

## 5. Input sanitization (B2 — was specified and never built on M3)
- [ ] Any client-entered text placed into **JSON** is escaped — a `"` or `\` in a name must not break the payload
- [ ] Any text placed into a **filename or folder name** strips `" * : < > ? / \ |`, collapses double spaces,
      trims leading/trailing spaces and dots, caps length (100 chars)
- [ ] Any text placed into a **URL** is encoded
- [ ] Tested with a deliberately hostile value, not just clean test data

## 6. Error handling — mandatory on every external call
- [ ] Error handler on **every** module that calls an external API → **Resume**, so one bad row cannot kill
      the batch
- [ ] Failure written to the row's `Notes` column — visible where staff actually work, not only in Make's history
- [ ] Alert raised to Sharjeel with client code + name + error message
- [ ] **No silent failures.** If it can fail, it must announce it.

## 7. Partial-failure recovery (B4 — the nastiest class)
- [ ] A run that fails halfway must not leave a row **permanently stuck**
- [ ] Trace it explicitly: "if step N fails, what state is the row in, and what happens on the next run?"
- [ ] A half-finished record must be either completable or clearly flagged — never silently re-attempted forever

## 8. Test matrix — one passing path is not a test
- [ ] **Every branch** exercised with a real input that forces it
- [ ] Both teams / all offices / all relevant visa categories
- [ ] Blank required fields
- [ ] Hostile text (apostrophe, slash, quote, very long name)
- [ ] Two rows in a single run
- [ ] Results recorded in the spec — not "it worked", but *what* was tested

## 9. Operational cost — measured, never estimated
- [ ] Ops per record **measured from a real run** and written into the spec (M3 estimate was 9; actual 11)
- [ ] **Polling cost calculated**: executions/day × 30. A 15-min schedule ≈ 2,880 ops/month **before any
      work is done** — that alone exceeds the free plan (B5)
- [ ] Monthly total projected against the plan's allowance, with the schedule tuned if needed
      (business hours only, longer interval)

## 10. Ownership and handover
- [ ] Every connection authorized as a **client-owned** account, not ours
- [ ] Any trigger/schedule owned by the client where possible — ours die silently when access is revoked (D-153)
- [ ] Recorded in `ACCESS.md` the same day (G3)

## 11. Documentation
- [ ] Spec file updated to as-built — module IDs, real values, measured cost
- [ ] Decision recorded in `DECISIONS.md` with what was proven and how
- [ ] Anything deferred written down as an explicit gap, not left implicit

## 12. The gate
- [ ] **Scenario stays OFF until items 1–11 pass.** Being switched on is the reward for passing, not the
      starting state.

---

## Why this pays for itself

M3 took far longer than planned because Make's mapping behaviour, the `&` operator, the `{{ }}` placement and
the field-reference format were all learned the expensive way. **Every one of those lessons is now encoded
above.** M4 through M9 use the same platform, the same sheet and the same patterns — they should be
substantially faster, and they will not repeat these specific failures.

**M3, once hardened, is the reference implementation. Copy its shape.**
