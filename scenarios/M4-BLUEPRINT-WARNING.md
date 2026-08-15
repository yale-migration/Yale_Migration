# 🔴 THE COMMITTED M4 BLUEPRINT IS BROKEN — DO NOT RESTORE IT

`M4-checklist-file.blueprint.BROKEN-DO-NOT-RESTORE.json` is the **pre-D-255** version.
It contains **13 × `text:contains` and 1 × `text:notcontains`** — operators that Make accepts
and then **evaluates as false, silently, with no error** (D-255).

It was committed on 12 Aug, the day *after* the live scenario was fixed on 11 Aug. Restoring it
would send every client row to a dead end and produce no error anywhere.

## The live scenario is correct
Verified 15 Aug via the Make API. Live `YM-M4-checklist-file` (6867537) uses **only** the four
proven operators: `exist` · `notexist` · `text:equal` · `text:notequal`.

## To replace this file properly
Make → `YM-M4-checklist-file` → ⋯ menu → **Export Blueprint** → save over
`scenarios/M4-checklist-file.blueprint.json` → commit.

Until that is done **there is no valid M4 backup.** `M3-folder-create.blueprint.json` is fine —
it matches live byte-for-byte.
