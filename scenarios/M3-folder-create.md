# Scenario: `YM-M3-folder-create` — auto client folder + 10 sub-folders

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

**folderName** = `{{1.Client Code}} – {{sanitized name}}` (en-dash with spaces, matching D-18).

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

## Module 4 — Create the 10 sub-folders (Iterator + API call)
1. **Tools → Set variable**: `subfolders` =
   `01 Enquiry;02 Identity Documents;03 Education;04 Employment;05 Financial;06 Enrolment;07 Application Forms;08 Lodgement;09 Correspondence;10 Visa Outcome`
2. **Tools → Iterator**: `split(subfolders; ";")`
3. **OneDrive → Make an API Call** (inside the iterator):
   - Method `POST`
   - URL `/v1.0/drives/A0BABA3C2640082C/items/{{3.body.id}}/children` ← parent = the folder just created
   - Body `{"name":"{{iterator.value}}","folder":{},"@microsoft.graph.conflictBehavior":"fail"}`

⚠️ **Verify the sub-folder list against a real client folder before going live.** Our list comes from
their SOPs; the live tree may differ. One read call on a real client folder settles it — if they differ,
the live structure wins (we mirror reality, not the SOP).

## Module 5 — Write the folder link back (Google Sheets → Update a Row)
| Field | Value |
|---|---|
| Row number | `{{1.__ROW_NUMBER__}}` |
| Folder URL (col M) | `{{3.body.webUrl}}` |
| Stage (col I) | `Engaged` *(only if currently blank — don't overwrite staff edits)* |

## Module 6 — Error handling (mandatory, D-14/ARCHITECTURE)
Right-click **each** API-call module → **Add error handler** → **Resume** (so one bad row can't kill the
run) → then a notification module (Gmail or WhatsApp) to Sharjeel with:
`FOLDER CREATE FAILED · {{1.Client Code}} · {{1.Full Name}} · {{error.message}}`
Also add a Sheets "Update a Row" in the error path writing `Notes` = `FOLDER ERROR: {{error.message}}`
so the failure is visible where staff work, not only in Make's history.

---

## Ship ladder (D-14 — do not skip)
1. **Dry-run**: 2 rows named `TEST DEMO ONE` / `TEST DEMO TWO`, Office BRISBANE, Team FILIPINO.
   Run once. Verify in OneDrive: folder + 10 sub-folders + link written back to the sheet.
2. **Clean up**: DELETE both test folders (`DELETE /v1.0/drives/A0BABA3C2640082C/items/<id>`),
   clear the test rows.
3. **5 real cases**: use 5 genuine upcoming clients (or 5 realistic names agreed with the client).
4. **Client 👍** on the naming convention and placement — *before* any live schedule.
5. **Go live**: set the trigger to every 15 minutes.

## Demo capture (the deliverable that matters)
Record 60–90 seconds, no narration needed:
type a name in MASTER → code appears (Apps Script) → cut to OneDrive → folder with 10 sub-folders exists
→ cut back to sheet → Folder URL populated. Send with one line:
*"First piece is live — new clients now get their folder and code automatically."*
