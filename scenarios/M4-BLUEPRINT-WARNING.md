# 🔴 THE COMMITTED M4 BLUEPRINT IS BROKEN — DO NOT RESTORE IT

`M4-checklist-file.blueprint.BROKEN-DO-NOT-RESTORE.json` is the **pre-D-255** version.
It contains **13 × `text:contains` and 1 × `text:notcontains`** — operators that Make accepts
and then **evaluates as false, silently, with no error** (D-255).

It was committed on 12 Aug, the day *after* the live scenario was fixed on 11 Aug. Restoring it
would send every client row to a dead end and produce no error anywhere.

## The live scenario is correct
Verified 15 Aug via the Make API. Live `YM-M4-checklist-file` (6867537) uses **only** the four
proven operators: `exist` · `notexist` · `text:equal` · `text:notequal`.

## ✅ RESOLVED 15 Aug — a valid backup now exists (D-315)

| File | What it is |
|---|---|
| `M4-checklist-file.blueprint.json` | **v1 as it ran** — pulled live over MCP, verified: 4 legal operators, zero `text:contains` |
| `M4-checklist-file.v2-guard.blueprint.json` | **v2, now live** — adds the pre-lookup guard (E2) |
| `M3-folder-create.blueprint.json` | **v1 as it ran** — diffed against live, current |
| `M3-folder-create.v2-catchall.blueprint.json` | **v2, now live** — adds the catch-all route (E1) |

⛔ The claim *"there is no valid M4 backup"* is **retracted**.

🔑 **Nobody needs to export a blueprint from the Make UI.** `scenarios_get` returns the full blueprint
over MCP, and `scenarios_update` writes it back. That is how v2 of both scenarios was applied.

**Before importing or editing either blueprint, run `python3 scripts/verify_blueprints.py`** — it
checks the operators and proves by exhaustive evaluation that every input reaches exactly one route.
A branch that can match nothing is a branch that loops forever.
