
## D-439 | Inder has left — removed from ROUTING, deliberately kept in the DROPDOWNS

**RJ, 4 Sep 2026, verbatim:** *"Inder sir has left the office for good sir. we can just make it
blank then."*

Fourth roster change in three weeks (Mershe left · Gopi joined and left · three hires · now Inder).

### The measured footprint, before touching anything
| | |
|---|---|
| clients assigned to Inder in the 38-row import | **8** (6 × subclass 500, 2 × 485) |
| already unassigned (the six RJ says to blank) | **6** |
| 🔴 **rows with no active owner at go-live** | **14 of 38 — 37%** |
| M6 routes he owned | Indian team 189/190/491/482/494/186 |

### The distinction this forced — worth more than the change
Removing a leaver is two different edits and this file previously answered both with one list:

* **routing** = who receives NEW work → **must exclude** leavers. Removed.
* **dropdown** = who may appear on a record → **must include** them. Kept.

⛔ Deleting "Inder" from a `setAllowInvalid(false)` list while **8 rows still hold that value**
is the **D-353** bug exactly: the rows are refused at paste, in silence. The tidy-up is the defect.

### Consequence, stated not hidden
Indian-team PR enquiries (189/190/491/482/494/186) now match no rule and fall to `Unassigned`
(verified: `m6AssignTo_` returns `'Unassigned'`). That is the honest outcome — a visible gap beats
handing a PR enquiry to someone who left — but it is a **real hole until Robinder names a successor**.

🔑 **Anmol is "Indian, Brisbane, PR"** (RJ, 28 Aug) — exactly this line. He is very likely Inder's
replacement, and what D-409 recorded as a *collision* may have been a *handover*. ⛔ Not assumed. Asked.

⚠️ **Reassigning the 8 is Robinder's call, not RJ's, and not ours.**

## D-440 | The six blanks are confirmed blank — not a data gap to chase

RJ: *"we can just make it blank then."* Closes the open question from D-421. `Assigned Consultant`
empty is now a **decided state**, not missing data. No follow-up, no placeholder, no guess.

## D-441 | Jasmeet is Brisbane, and is NOT an enquiry-routing destination — A-50 CLOSED

**RJ, 4 Sep, verbatim:** *"Jameet is based in Brisbane"* and *"If there is a new Filipino inquiry, it
should be given to Filipino consultants. once they are ready for visa drafting that's the only time
we will forward to Jasmeet for visa drsfting."*

This answers a question we had been asking the wrong way round. Jasmeet sits **downstream of
assignment**: the enquiry goes to a Filipino consultant, who later hands the drafting to him.

✅ **He therefore stays OUT of `M6_ROSTER` permanently** — which independently validates the call
already taken in D-409 not to add him. It was the right answer for a reason we had not yet been told.
✅ He stays **IN the dropdowns** — he can legitimately hold a record at drafting stage.

⚠️ M6 assigns at *enquiry* time only. It has no concept of a *stage handover*, so the Jasmeet step is
**human, by design**, and nothing in the build needs to change to support it.
