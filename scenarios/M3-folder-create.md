# Scenario: `YM-M3-folder-create` — auto client folder + client-approved sub-folders
**v2 — 2026-08-02.** v1 specified 10 sub-folders; the client approved THREE sets routed by visa type
(D-113). Authoritative structure: `ARCHITECTURE.md` v2 (G6 — do not restate it elsewhere).

**Trigger:** new row in MASTER with a Client Code and no Folder URL.
**Cost:** ~13 Make operations per client (well inside the free tier for testing; paid plan at go-live, D-15).
**Anchors:** driveId `A0BABA3C2640082C` · see `ONEDRIVE-IDS.md`. Use the **API-call module with IDs** —
never the folder picker (D-19/D-21). Write scope confirmed working (D-31).

---

## Module 1 — Trigger: Google Sheets → "Search Rows"
| Field | Value |
|---|---|
| Connection | automation Google account |
| Spreadsheet / Sheet | Yale Migration — MASTER DATABASE / `MASTER` |
| Filter | `Client Code` **is not empty** AND `Folder URL` **is empty** |
| Limit | `5` (keep small while testing) |
| Schedule | Off during build; later "Every 15 minutes" |

*Why polling instead of onEdit: rows can also be created by automation later (M6 enquiries), and a
scheduled search catches every case. Idempotent by design — a row with a Folder URL is never picked up
twice (D-14 safety).*

## Module 2 — Router: resolve the target branch from Office + Team
Add a **Router**, one route per branch, filter on `Office` and `Team` from the row:

| Route | Filter | Parent folder |
|---|---|---|
| BNE Filipino | Office = BRISBANE AND Team = FILIPINO | Brisbane → CLIENT FILES → ENGAGED CLIENTS → CLIENT FILES- FILIPINO TEAM |
| BNE Indian | Office = BRISBANE AND Team = INDIAN | Brisbane → CLIENT FILES → ENGAGED CLIENTS → (Indian team folder) |
| Townsville | Office = TOWNSVILLE | TOWNSVILLE branch |
| Philippines | Office = PHILIPPINES | PHILIPPINES branch |
| Fallback | (no filter — last route) | Alert only, create nothing |

⚠️ **Before building this**: walk the tree once and record each parent's itemId into `ONEDRIVE-IDS.md`
(BNE → CLIENT FILES → ENGAGED CLIENTS → each team folder). Use:
`GET /v1.0/drives/A0BABA3C2640082C/items/<itemId>/children?$select=name,id&$top=999`

## Module 3 — Create the client folder (OneDrive → Make an API Call)
| Field | Value |
|---|---|
| Method | `POST` |
| URL | `/v1.0/drives/A0BABA3C2640082C/items/{{parentItemId}}/children` |
| Header | `Content-Type: application/json` |
| Body | `{"name":"{{folderName}}","folder":{},"@microsoft.graph.conflictBehavior":"fail"}` |

**folderName** = `{{1.Client Code}} – {{sanitized name}}` (en-dash with spaces, D-18).
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

## Module 4 — Create the sub-folders (Router on Visa Type → Set variable → Iterator → API call)

**Three sets, chosen automatically from `Visa Type` (col H). Staff never choose.** Full definitions and
rationale: `ARCHITECTURE.md` v2 §Folder convention.

1. **Router** on `{{1.Visa Type}}`:
   | Route | Visa Types | Set `subfolders` to |
   |---|---|---|
   | WORK / EMPLOYER | `482 · 407 · 186 · 494` | `01 Identity & Personal;02 Education & Employment;03 Step 1 – Sponsorship (SBS 482 / TAS 407);04 Step 2 – Nomination;05 Step 3 – Visa Lodgement;06 Correspondence & Outcome` |
   | PARTNER | `820/801 · 300` | `01 Identity & Personal;02 Relationship Evidence;03 Financial;04 Forms & Lodgement;05 Correspondence & Outcome` |
   | STANDARD (fallback, no filter) | everything else | `01 Identity & Personal;02 Education & Employment;03 Financial;04 Forms & Lodgement;05 Correspondence & Outcome` |
2. **Tools → Iterator**: `split(subfolders; ";")`
3. **OneDrive → Make an API Call** (inside the iterator):
   - `POST /v1.0/drives/A0BABA3C2640082C/items/{{3.body.id}}/children`
   - Body `{"name":"{{iterator.value}}","folder":{},"@microsoft.graph.conflictBehavior":"fail"}`
4. **PARTNER ONLY — one nested level.** After `02 Relationship Evidence` is created, POST two children into
   it: `820` and `801`. Reason (client's own): the 801 documents arrive ~2 years later and must not mix with
   the 820 bundle. Cost: +2 ops on partner matters only.

**Ops per matter:** standard ≈8 · work ≈9 · partner ≈11. Within the free tier for testing (D-22).

⚠️ **VERIFIED 2026-07-29 (T1.4c): live client folders are FLAT — zero sub-folders (D-47).** The SOP's
10-folder structure was never implemented; staff dump loose files. So this module DELIVERS A NEW STRUCTURE
rather than mirroring one. **Framing to the client:** "your SOP specifies a structure; in practice files sit
loose — the automation makes it real from now on, without touching existing folders."
✅ **Client approved the structure 2 Aug** (D-113), including their own improvement: work visas organised by
application STEP so the folder tree shows progress. Existing ~1,436 folders are never restructured (D-12/D-45).

## Module 5 — Write the folder link back (Google Sheets → Update a Row)
| Field | Value |
|---|---|
| Row number | `{{1.__ROW_NUMBER__}}` |
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
   Run once. Verify in OneDrive: folder + the 5 STANDARD sub-folders + link written back to the sheet.
   Then one WORK test (Visa Type 482) and one PARTNER test (820/801) to prove all three router branches.
2. **Clean up**: DELETE both test folders (`DELETE /v1.0/drives/A0BABA3C2640082C/items/<id>`),
   clear the test rows.
3. **5 real cases**: use 5 genuine upcoming clients (or 5 realistic names agreed with the client).
4. **Client 👍** on the naming convention and placement — *before* any live schedule.
5. **Go live**: set the trigger to every 15 minutes.

## Demo capture (the deliverable that matters)
Record 60–90 seconds, no narration needed:
type a name in MASTER → code appears (Apps Script) → cut to OneDrive → folder with its sub-folders exists
→ cut back to sheet → Folder URL populated. Send with one line:
*"First piece is live — new clients now get their folder and code automatically."*
