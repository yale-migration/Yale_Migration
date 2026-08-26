# CLIENT FILES RECEIVED — the index
**Every file Yale has sent us, what is in it, and where it lives.** Updated 26 Aug 2026.

⛔ **THE FILES THEMSELVES ARE NOT IN THIS REPO AND MUST NOT BE.** They carry client names, email
addresses, phone numbers and — in the workbooks — plaintext portal credentials. They live in
**`SOP'S/client-data/`**, outside git. `repo_hygiene.py` blocks the commit if one lands here.

🔑 **This file is the tracking the folder cannot give you** — a repo-side index with no personal data
in it, so "what did they send and when" is answerable without opening anything.

---

## Received

| Date | File in `client-data/` | What it is | What it closed |
|---|---|---|---|
| 14 Aug | `REYWARD JAKE M GAMOL-2026.xlsx` | 25 tabs, ~460 client records by month of arrival | A-14 — their real client database |
| 14 Aug | `DATA SHEET.xlsx` | ~200 rows, the cold-call log | feeds ENQUIRIES |
| 18 Aug | `2026-08-18_ANSWERED_YM-DQ-e573.docx` | their answers to our 19 questions | 12 of 19, incl. the fee schedule |
| 18 Aug | `2026-08-18_CLIENT-LIST-TO-UPDATE_returned.xlsx` | 40 clients × 11 columns | the import source · 38 rows |
| 21 Aug | `docs/06-received-pending-CR013/YM-186-EMPLOYER-NOMINATION.pdf` | 186 checklist ✅ *in repo — no PII, verified* | CR-013 |
| 22 Aug | `docs/06-received-pending-CR013/YM-CITIZENSHIP.docx` | Citizenship checklist ✅ *in repo* | CR-013 |
| 22 Aug | `docs/06-received-pending-CR013/YM-SUBCLASS 600 (TOURIST VISA).docx` | 600 checklist ✅ *in repo* | CR-013 |
| 22 Aug | `2026-08-22_Inquiry-form-Responses.xlsx` | the enquiry form's responses | I-14 → C-1 |
| **25 Aug** | **`2026-08-25_RJ-reply-annotated_test-clients.pdf`** | our own 23 Aug email, returned with his answers typed inline | **A-48** — 3 test clients + ACECQA |
| **25 Aug** | **`2026-08-25_CLIENT-LIST-TO-UPDATE_returned-v2.xlsx`** | the client list, second pass | **A-49** — the row 22/23 duplicate is gone |

⚠️ **The three checklists sit in the repo deliberately** — they are blank Yale-letterhead templates
with no client data, verified against the D-249 markers before filing.

---

## What the 25 Aug spreadsheet changed

Counted without printing a single client value (D-403).

| Column | 18 Aug | 25 Aug |
|---|---|---|
| Anyone else on the application | 0 | **11** of 40 |
| Contact number | 0 | **10** of 40 |
| Email address | 27 | 28 |
| Skills authority | 4 × `<-- needed` | **all filled** (free text — see D-403) |
| Duplicate email addresses | **1** (rows 22/23) | **0** ✅ |

⚠️ **The `Visa` column appears to change on ~30 rows and does not.** It is an `int → float` artifact
of a round-trip through Google Sheets — `485` becomes `485.0`. Normalise before diffing, or you will
report thirty edits that never happened.

---

## Still thin, and what each gap costs

| | Have | Cost of the gap |
|---|---|---|
| Email address | 28/40 | 🔴 **12 clients cannot be emailed at all** — no checklist, no chase |
| Contact number | 10/40 | 🟠 M7's phone lookup cannot match that caller |
| Consultant | 34/40 | 🟠 drafts fall back to `Unassigned` |
| Date last spoken | 0/40 | 🟠 covered by `IMPORT_BASELINE` on the day |

🔑 **None of these blocks a contracted hour.** All four are the same problem — a spreadsheet emailed
back and forth — and all four are solved by the shared Google Sheet RJ has already agreed to.
