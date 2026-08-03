# Scenario: `YM-M3-folder-create` — auto client folder + client-approved sub-folders
**v3 — 2026-08-03.** v1 = 10 sub-folders (wrong). v2 = 3 client-approved sets but built on a **Router**,
which in Make cannot reconverge and would have meant 16 modules. **v3 is linear: 7 modules, one Set-variables
module doing both lookups.** Authoritative structure: **`docs/FOLDER-STRUCTURE-BY-VISA-CATEGORY.md`** (G6).

**Trigger:** new row in MASTER with a Client Code and no Folder URL.
**Cost:** ≈9 Make operations per client (SET 1/2 ≈9 · SET 3 ≈10 with the two nested folders). Well inside the
free tier for testing; paid plan at go-live (D-15/D-22).
**Anchors:** driveId `A0BABA3C2640082C` · see `ONEDRIVE-IDS.md`. Use the **API-call module with IDs** —
never the folder picker (D-19/D-21). Write scope confirmed working (D-31).

---

## Module 1 — Trigger: Google Sheets → "Search Rows"
| Field | Value |
|---|---|
| Connection | automation Google account |
| Spreadsheet / Sheet | Yale Migration — MASTER DATABASE (`1ZE1OoTjgO5UyZI4dDxfGoGLy5ojHQibqHpMb3RTQc6k`) / `MASTER` |
| Filter | `Client Code` **is not empty** AND `Folder URL` **is empty** |
| Limit | `5` (keep small while testing) |
| Schedule | Off during build; later "Every 15 minutes" |

*Why polling instead of onEdit: rows can also be created by automation later (M6 enquiries), and a
scheduled search catches every case. Idempotent by design — a row with a Folder URL is never picked up
twice (D-14 safety).*

## Module 2 — Set variables (NOT a Router) — resolve parent folder + sub-folder set in ONE module

🔴 **v3 CHANGE (D-165): the Router design in v2 was wrong for Make.** In Make, a Router splits the flow into
routes that **never reconverge**. A router here would force Modules 3–6 to be **duplicated on every route**
(4 routes × 4 modules = 16 modules to build and maintain, and every future fix applied four times). Replaced
with a single **Tools → Set multiple variables** module and a linear flow. Fewer modules, one place to edit.

**Module: Tools → Set multiple variables** — two variables.

🔴 **VERIFIED FIELD NAMES (real Run-once output, 3 Aug — D-170).** Make's Sheets module names every field
`Header (ColumnLetter)`, e.g. **`Office (J)`**, not `Office`. The name contains a space and brackets, so it
**must be wrapped in backticks** inside formulas. Earlier versions of this spec used `1.Office` /
`1.Visa Type` — those resolve to nothing and every switch would have fallen to the default.
| Use | Correct reference |
|---|---|
| Client Code | `` {{2.`Client Code (A)`}} `` |
| Full Name | `` {{2.`Full Name (C)`}} `` |
| Visa Type | `` {{2.`Visa Type (H)`}} `` |
| Office | `` {{2.`Office (J)`}} `` |
| Team | `` {{2.`Team (K)`}} `` |
| Row number | `` {{2.`Row number`}} `` (no column letter) |

🔴 **`{{ }}` PLACEMENT RULE (D-174) — the mistake that cost a build cycle.** A *plain* mapping is
`` {{2.`Office (J)`}} ``. But when a FUNCTION is involved, **the whole expression takes ONE outer `{{ }}` and
the field references inside drop their braces**:
- ❌ `switch({{2.`Office (J)`}} & "|" & ...)` → Make strips the inner braces and stores the rest as literal text
- ✅ `` {{switch(2.`Office (J)` & "|" & 2.`Team (K)`; …)}} ``
Symptom of getting it wrong: the module output shows the formula source, with gaps where the references were.
**Module numbering: Search Rows is module `2` in this scenario, not 1** — Make does not always start at 1.

⚠️ **U, V and W are ABSENT from the output bundle** — Make trims trailing empty columns. Harmless: we never
READ Folder URL (the filter `V notexist` still works server-side), and Module 5 WRITES to V by column, not by
reading it. Do not try to map `{{1.Folder URL (V)}}` — it does not exist in the bundle.

**`parentId`** — maps Office+Team to the destination folder:
```
{{switch(2.`Office (J)` & "|" & 2.`Team (K)`;
  "BRISBANE|FILIPINO"; "A0BABA3C2640082C!sbc920268db9044bdb12dd6072bf26d0f";
  "BRISBANE|INDIAN";   "A0BABA3C2640082C!529";
  "")
```
Anything else (Townsville, Philippines, blanks) returns **empty** → the next module stops it safely.

**`subfolders`** — picks the client-approved set from Visa Type. Comma-wrapped so `300` cannot match inside
another value:
```
{{if(contains(",482,407,SBS,Nomination,"; "," & 2.`Visa Type (H)` & ",");
   "01 Identity & Personal;02 Step 1 – Sponsorship;03 Step 2 – Nomination;04 Step 3 – Visa Lodgement;05 Dependents;06 Correspondence & Outcome";
if(contains(",820/801,300,101,802,"; "," & 2.`Visa Type (H)` & ",");
   "01 Applicant Documents;02 Sponsor Documents;03 Relationship Evidence;04 Forms & Lodgement;05 Correspondence & Outcome";
   "01 Identity & Personal;02 Education & Employment;03 Financial;04 Dependents & Relationship;05 Forms & Lodgement;06 Correspondence & Outcome"))
```
Default (no match) = **SET 1 STANDARD**, which is correct for every remaining visa type including `Other`.

## Module 2b — Filter: "parent is known"
On the link between Module 2 and Module 3 set a filter: **`parentId` Exists / is not empty**.
This is the safety gate that replaces the router's Fallback route — a Townsville, Philippines or
blank-Office row simply stops here. **Nothing is created in the wrong place, ever.**

### 🔴 TWO PLACEMENT GAPS STILL OPEN (D-136) — the filter above is what makes them safe
1. **TOWNSVILLE and PHILIPPINES internals are unmapped.** We hold only their top-level ids; Brisbane nests
   `CLIENT FILES → ENGAGED CLIENTS → <team>`. Creating at a branch ROOT would misfile in live data. They are
   deliberately absent from `parentId`, so those rows stop at Module 2b. Close later with:
   `GET /v1.0/drives/A0BABA3C2640082C/items/<branchId>/children?$select=name,id&$top=999`
2. **`Work visa BNE AND TSV`** (`A0BABA3C2640082C!s125354abdab141af87f47d49394feec3`, 82 MB) may be where
   482/407 matters actually live. Unverified — ask at the demo, or map with one API call.
3. **`!529` label unconfirmed** — `ONEDRIVE-IDS.md` records it as `CLIENT FILES (main/Indian?)`. Confirm it
   is the Indian-team folder during the dry-run **before any real Indian-team row uses it.**
   *(Demo path uses BRISBANE + FILIPINO, which is fully verified — so none of this blocks T4.)*

## Module 3 — Create the client folder (OneDrive → Make an API Call)
| Field | Value |
|---|---|
| Method | `POST` |
| URL | `/v1.0/drives/A0BABA3C2640082C/items/{{2.parentId}}/children` |
| Header | `Content-Type: application/json` |
| Body | `{"name":"{{folderName}}","folder":{},"@microsoft.graph.conflictBehavior":"fail"}` |

**folderName** = `` {{1.`Client Code (A)`}} `` + ` – ` + sanitized `` {{1.`Full Name (C)`}} `` (en-dash with spaces, D-18).
For employer/sponsorship matters the Full Name IS the company, so the folder becomes
`YM-2026-##### – COMPANY NAME (SPONSOR)` automatically — no special handling needed (D-99).

**Sanitizer** (apply to Full Name before use):
```
upper(trim(replace(replace(replace(replace(replace(replace(replace(replace(replace(
  1.Full Name; "\"" ; "") ; "*" ; "") ; ":" ; "") ; "<" ; "") ; ">" ; "") ; "?" ; "")
  ; "/" ; "") ; "\\" ; "") ; "|" ; "")))
```
Then collapse double spaces and cut to 100 chars. Rationale: OneDrive rejects `" * : < > ? / \ |`;
Filipino/Indian names with apostrophes and ñ are fine, but the illegal set must go (ARCHITECTURE folder
rules).

**`conflictBehavior: "fail"`** is deliberate — if a folder with that name already exists we want the
error (and an alert), not a silent duplicate or a rename. Existing client folders are never touched (D-12).

## Module 4 — Create the sub-folders (Iterator → API call) — set already chosen in Module 2

**Three sets, chosen automatically from `Visa Type` (col H). Staff never choose.** Full definitions and
rationale: `ARCHITECTURE.md` v2 §Folder convention.

1. `subfolders` was already resolved in **Module 2** — no second switch. Definitions live in
   `docs/FOLDER-STRUCTURE-BY-VISA-CATEGORY.md` (G6 single authority).
2. **Tools → Iterator**: `split(subfolders; ";")`
3. **OneDrive → Make an API Call** (inside the iterator):
   - `POST /v1.0/drives/A0BABA3C2640082C/items/{{3.body.id}}/children`
   - Body `{"name":"{{iterator.value}}","folder":{},"@microsoft.graph.conflictBehavior":"fail"}`
   - Iterator source: `split(2.subfolders; ";")`
4. **PARTNER ONLY — one nested level.** After `03 Relationship Evidence` is created, POST two children into
   it: `820` and `801`. Reason (client's own): the 801 documents arrive ~2 years later and must not mix with
   the 820 bundle. Cost: +2 ops on partner matters only.

**Ops per matter:** standard ≈9 · work ≈9 · partner ≈10. Within the free tier for testing (D-22).

⚠️ **VERIFIED 2026-07-29 (T1.4c): live client folders are FLAT — zero sub-folders (D-47).** The SOP's
10-folder structure was never implemented; staff dump loose files. So this module DELIVERS A NEW STRUCTURE
rather than mirroring one. **Framing to the client:** "your SOP specifies a structure; in practice files sit
loose — the automation makes it real from now on, without touching existing folders."
✅ **Client approved the structure 2 Aug** (D-126), including their own improvement: work visas organised by
application STEP so the folder tree shows progress. Existing ~1,436 folders are never restructured (D-12/D-45).

## Module 5 — Write the folder link back (Google Sheets → Update a Row)
| Field | Value |
|---|---|
| Row number | `` {{1.`Row number`}} `` — verified field name, NOT `__ROW_NUMBER__` (D-170) |
| Folder URL (col **V**) | `{{3.body.webUrl}}` |
| Processing Stage (col **M**) | `Engaged` *(only if currently blank — never overwrite staff edits)* |

## Module 6 — Error handling (mandatory, D-14/ARCHITECTURE)
Right-click **each** API-call module → **Add error handler** → **Resume** (so one bad row can't kill the
run) → then a notification module (Gmail or WhatsApp) to Sharjeel with:
`FOLDER CREATE FAILED · {{1.Client Code}} · {{1.Full Name}} · {{error.message}}`
Also add a Sheets "Update a Row" in the error path writing `Notes` = `FOLDER ERROR: {{error.message}}`
so the failure is visible where staff work, not only in Make's history.

---

## Ship ladder (D-14 — do not skip)
1. **Dry-run**: 2 rows named `TEST DEMO ONE` / `TEST DEMO TWO`, Office BRISBANE, Team FILIPINO.
   Run once. Verify in OneDrive: folder + **the 6 SET-1 STANDARD sub-folders** + link written back to the sheet.
   ⚠️ Counts differ per set — **SET 1 = 6 · SET 2 = 6 · SET 3 = 5 (+2 nested under Relationship Evidence)**.
   Check against the set the row's Visa Type routes to, not a fixed number (D-139).
   Then one WORK test (Visa Type 482) and one PARTNER test (820/801) to prove all three router branches.
2. **Clean up**: DELETE both test folders (`DELETE /v1.0/drives/A0BABA3C2640082C/items/<id>`),
   clear the test rows.
3. **5 real cases**: use 5 genuine upcoming clients (or 5 realistic names agreed with the client).
4. **Client 👍** on the naming convention and placement — *before* any live schedule.
5. **Go live**: set the trigger to every 15 minutes.

## Demo capture (the deliverable that matters)
Record 60–90 seconds, no narration needed. **Four fields get typed** (D-166) — do not imply fewer:
fill **Full Name · Office · Team · Visa Type** → `YM-2026-#####` appears on its own → cut to OneDrive →
the client folder with its correct sub-folder set exists → cut back to the sheet → Folder URL populated. Send with one line:
*"First piece is live — new clients now get their folder and code automatically."*
