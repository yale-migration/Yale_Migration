# 🧠 LESSONS — the patterns, not the instances

**`DECISIONS.md` is 504 KB and 380 entries. Nobody will read it.** This is the distillation: six
recurring failure shapes that between them explain most of what has gone wrong on this project.

⛔ **Read this before writing code, before writing to the client, and before believing a green check.**
Each pattern is followed by its instances so you can find the detail if you need it — but the pattern
is the point. The instances are just proof it is real.

---

## 1 · A check that passes for the wrong reason

**The single most expensive pattern on this project.** A check runs, reports success, and has verified
nothing. Green and correct look identical from outside.

| | |
|---|---|
| D-292…296 | `onerror:Ignore` reported SUCCESS on a total write failure |
| — | The s56 verifier announced *"every deadline matches"* after checking **zero** |
| D-348 | Dashboard views 1–3 read ✅ because the tracker and the component shared a *word* |
| D-350 | The client confirmed **23 checklists** he had never been shown — a count, not a list |
| D-362 | A dropdown test that reads the *list* passes while the *cell* silently refuses writes |
| D-363 | A negative test corrupted index 15 to "move Promoted" — after a shift, 15 was a column the guard does not check, so it tested nothing and reported PASS |
| D-372 | Two empty screenshots: wrong account, wrong filter field. Both read as "nothing there" |

🔑 **The counter-practice:** ask *what would this check do if the thing were broken?* If you cannot
answer, it is not a check. **Negative-test every gate** — a gate that has never failed is not a gate.
And when a query returns nothing, prove the query *could* have returned something.

---

## 2 · Reasoning from our own notes to a claim about the world

Our records describe what we wrote down, not what exists. Treating the first as the second has now
gone wrong in **both directions**.

| | |
|---|---|
| D-341 | *"No record the trigger was created"* → concluded it did not exist. **It had existed all along.** |
| D-360 | *"No record the 190 checklist was uploaded"* → concluded it was missing. **It was uploaded 12 Aug.** |
| D-368 | Trigger exists → concluded it *works*. Google had been emailing failure notices for ten days |
| D-369 | The fix is in → concluded *nothing happened*. It had already failed twice, in an inbox we hold |

🔑 **The absence of a log entry is evidence about our logging.** Go and look at the system. On this
project that is almost always cheap: Make RPCs cost **zero operations**, the Apps Script Executions
list is one click, and the failure inbox has been sitting there since July.

---

## 3 · A locked dropdown refuses silently

`requireValueInList(...).setAllowInvalid(false)` blocks **script writes too**, not just typing. The
cell rejects the value, nothing errors, and the run reports success.

**Three occurrences before it was fixed as a class:** SBS/Nomination (D-138 — *"every sponsorship
matter was a dead end"*) · GOPI in the consultant list (A-33) · `Citizenship`, with **two rows already
in the import** (D-353).

🔑 **Closed at all three layers, and that is the model for any schema-shaped bug:** the importer parses
the dropdown lists **out of `setup_master_sheet.gs`** and refuses to write a CSV containing anything a
cell would reject; the `.gs` is the single source; and the live-sheet verifier **writes a real value
and clears it** rather than reading the list. ⛔ Lists are read, never copied — a copy drifts, and a
validator that drifts reports PASS against a schema nobody uses.

---

## 4 · A hardcoded position beside a list that grows

Adding three columns to CALL LOG exposed three of these in one afternoon. **Two failed silently.**

- `CL_HELPER_PHONE = 18` — at 20 headers, 18 became a **real** column; the lookup would have searched it
- `getRange(row, 1, n, 17)` ×2 — the read stopped before `Becomes Enquiry`, so promote saw no flagged
  rows and logged *"not marked Yes"* **while reporting success**
- A negative test keyed to index 15 — see pattern 1

⚠️ **And the fix for this pattern caused the worst outage of the project.** The derived constant was
placed **above** the array; `var` hoists the declaration and not the value, so the file threw at load —
and Apps Script shares one scope, so it broke **every trigger in the project** (D-364/D-371).
🔑 **The blast radius of an edit is not proportional to its size.** `test_gs_loads.js` guards it now.

---

## 5 · An input closed against what we ASKED, not what the module CONSUMES

The question gets a perfect answer. It was the wrong question, and the ✅ hides that better than a ❌ ever could.

| | |
|---|---|
| D-310 | Asked for a staff roster **we had held for three weeks** |
| D-332 | Seven of fourteen kick-off access items never delivered, never chased, for a month |
| D-358 | I-14 ticked on the form's **questions**; C-1 needs its **responses**, never asked for |
| D-357 | Re-asked for a visa type the client had already given — bundled with live asks, and the **whole item was skipped** |

🔑 **Before closing an input, name the module that eats it and check it is sufficient to build that
module.** *"C-1 turns enquiries into ENQUIRIES rows — can I write one row from this?"* Ten seconds.
And **never bundle a stale question with live ones**: the recipient triages the item on its weakest part.

---

## 6 · Blank beats a plausible guess

Every place the helpful-looking behaviour produces a confident wrong answer, the code writes nothing
and says so.

- **`Channel`** — we defaulted it to `Phone` once and Rey corrected it in four hours (D-330). A form
  submitted from a Facebook ad is a Facebook enquiry; `Website` would corrupt the one number the
  enquiry view exists to report.
- **`Visa Interest`** — their words verbatim. *"Graduate Visa"* → 485 is a one-line dictionary and it
  is **migration advice** (RSMS is closed, 494 is its successor). Only the RMA decides that.
- **`Assigned To`** — `Unassigned` unless unambiguous. A lead on the wrong consultant **looks handled**.
- **`Location`** — an address is not Onshore/Offshore. Dropped from the locked column, kept in Notes.
- **Grant rate** — `null`, never `0`, when nothing is decided.

🔑 **Nothing is discarded — it goes to Notes with its label.** Blank is honest; a guess that renders
identically to a fact is not.

---

## 🔟 The ten-second checklist

1. If this were broken, would my check notice?
2. Am I reading the system, or our notes about the system?
3. Does this value have to survive a locked dropdown?
4. Is this position hardcoded next to something that grows?
5. Does this input actually build the module I closed it for?
6. Am I about to write a plausible guess into a real client's record?
