# Build prompt — the Yale STAFF sheet

> ⚠️ **SUPERSEDED 13 Sep 2026.** The sheet was built, audited, and **rebuilt** — see D-475. This
> prompt is kept for the reasoning; the authoritative artefact is the workbook itself. Four things
> this prompt got wrong: it had **no `Receives Enquiries` column** (so routing would have gone to
> Jasmeet, Manali and Robinder), it **omitted Jasmeet and Manali**, it left **every email blank**
> when all of them were already in `ACCESS.md`, and it **omitted Mershe**, whose mailbox is still
> live under her name.

**Give this whole file to Claude Desktop.** It builds one Google Sheet / Excel file. Nothing else
is needed.

---

## Why this sheet exists — read this first, it shapes every column

Yale's roster changed **five times in six weeks**: Mershe left, Gopi joined and left inside four
days, Inder left, Priyanka was replaced, Gayatri went on maternity leave. Every single time, the
automation's routing rules had to be edited **by a developer**, and every gap between the change and
the edit sent client enquiries to somebody who was not there.

🔑 **So this is not an HR list. It is the routing table.** The automation reads it to decide who a
new enquiry goes to. If a name is wrong here, a real client's enquiry lands with nobody.

Two consequences the design must respect:

1. **Yale updates it themselves, with no developer involved.** That is the entire point.
2. **A blank or a typo must be visible, not silent.** A misspelled name does not "mostly work" —
   it routes to nothing.

---

## Build ONE file, `YALE STAFF`, with THREE tabs

### Tab 1 — `STAFF` (the one people use)

| Col | Header | Type | Notes |
|---|---|---|---|
| A | `Staff Name` | text | **Exactly as it should appear in the system.** One agreed spelling. |
| B | `Email` | text | Their Yale address |
| C | `Phone` | text | Format as **text**, not number — leading zeros must survive |
| D | `Office` | dropdown | `BRISBANE`, `TOWNSVILLE` |
| E | `Team` | dropdown | `INDIAN`, `FILIPINO`, `BOTH` |
| F | `Visa Types Handled` | text | Comma-separated, e.g. `189, 190, 491, 482, 494, 186` |
| G | `Role` | dropdown | `Director`, `Branch Manager`, `Consultant`, `Admin` |
| H | `Status` | dropdown | `Active`, `On Leave`, `Left` |
| I | `Leave From` | date | Only when Status = On Leave |
| J | `Leave Until` | date | Blank = open-ended |
| K | `Covered By` | dropdown | A name from column A |
| L | `Start Date` | date | |
| M | `End Date` | date | Only when Status = Left |
| N | `Notes` | text | Free text |
| O | `Last Updated` | date | Who/when this row last changed |

### Tab 2 — `VISA TYPES` (feeds the column F dropdown, and keeps spellings honest)

One column, `Visa Type`, with these exact values, one per row:

`189` · `190` · `191` · `407` · `408` · `417` · `462` · `482` · `485` · `491` · `494` · `500` ·
`590` · `600` · `801` · `820/801` · `858` · `186` · `Citizenship` · `ART` · `Other`

### Tab 3 — `HOW TO USE` (plain English, for the Yale team)

Short. Six bullets, no jargon:
- Someone joins → add a row, Status `Active`
- Someone goes on leave → change Status to `On Leave`, fill `Leave From` and `Covered By`
- Someone leaves → change Status to `Left`, fill `End Date`. ⛔ **Do not delete the row** — old
  client files still carry their name, and deleting it breaks those records
- Someone comes back → Status back to `Active`, clear the leave dates
- **Always fill `Covered By`** when Status is not `Active` — that is the field the system uses to
  redirect work
- Change nothing else. The column headers and the dropdowns are read by the automation

---

## Rules the build must follow

**1 · Dropdowns are strict.** Every dropdown column rejects anything not on its list. In Google
Sheets: Data validation → "Reject input", **not** "Show warning".

⛔ **But `Staff Name` (A) is FREE TEXT, never a dropdown.** A new hire must be addable without
editing a validation list first.

**2 · Conditional formatting**, so the eye finds problems before the automation does:
- Whole row **grey** when Status = `Left`
- Whole row **amber** when Status = `On Leave`
- Cell **red** when Status is `On Leave` or `Left` **and `Covered By` is empty** — this is the
  single most dangerous state in the sheet, because it means work is routed to a person who is not
  there and nobody is named to catch it

**3 · Freeze row 1.** Bold headers. Column A frozen too.

**4 · No formulas that reference other files.** This sheet must open and work on its own.

**5 · Protect the header row** so it cannot be edited or reordered by accident.

---

## Seed it with the roster as at 13 September 2026

Use exactly these rows. **Do not invent anyone, and do not fill a blank with a guess.**

| Staff Name | Office | Team | Visa Types Handled | Role | Status | Covered By |
|---|---|---|---|---|---|---|
| Robinder | BRISBANE | BOTH | *(all)* | Director | Active | |
| Cristelle | TOWNSVILLE | BOTH | *(all — whole office)* | Branch Manager | Active | |
| Star | BRISBANE | FILIPINO | 500, 485, 820/801 | Consultant | Active | |
| RJ | BRISBANE | FILIPINO | 189, 190, 491, 482, 494, 186 | Consultant | Active | |
| Anmol | BRISBANE | INDIAN | 189, 190, 491, 482, 494, 186 | Consultant | Active | |
| Fiza | BRISBANE | INDIAN | 820/801, 485, 600 | Consultant | Active | |
| Gayatri | BRISBANE | INDIAN | 500 | Consultant | **On Leave** | *(LEAVE BLANK — see below)* |
| Pooja | BRISBANE | INDIAN | *(leave blank)* | Consultant | Active | |
| Inder | BRISBANE | INDIAN | 189, 190, 491, 482, 494, 186 | Consultant | **Left** | Anmol |
| Priyanka | BRISBANE | INDIAN | *(leave blank)* | Consultant | **Left** | Pooja |
| Rey | BRISBANE | FILIPINO | *(leave blank)* | Consultant | Active | |

🔴 **Three deliberate blanks. Leave them blank — a guess here misroutes real clients:**

1. **Gayatri's `Covered By`.** Robinder said only *"a man"* took over and did not give the name.
   Put `?? ASK ROBINDER — name not given` in her **Notes** so the gap is loud.
2. **`Pooja` vs `Puja`.** He said *"Puja"*; our existing dropdowns say *"Pooja"*. **Ask which
   spelling Yale's own records use, and make every sheet match it.** A mismatch is rejected in
   silence by the validation.
3. **Visa types for Pooja, Priyanka and Rey.** Never established. Blank, not guessed.

---

## What to hand back

The finished file, plus a short list of every cell left blank and why — so those become questions
for Robinder rather than quietly staying empty.
