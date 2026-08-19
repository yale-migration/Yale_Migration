# M7 — Phone intake & callback queue
**Spec written 19 Aug 2026, after auditing the flow rather than the module.** Contracted 4 h.

---

## 🔴 Finding 1 — the SOP's identity check CANNOT be implemented

Their ANSWERING PHONE SOP specifies a **name + date-of-birth** identity check before discussing a
matter. **MASTER holds no date of birth. No passport number either. There is no second identity
factor anywhere in the system.**

⛔ **We must not silently substitute a weaker check.** For a migration practice, confirming who is on
the phone before discussing a visa matter is a compliance question, not a UX one. Quietly matching on
name alone and presenting the result as "verified" would be worse than offering nothing.

**So the design does the opposite of hiding it.** The lookup shows what it matched *on*, and a
separate `ID Verified` column stays **blank until a human sets it**. The tool finds the file; the
person confirms the human.

▶ **Open decision for Robinder — do NOT decide this for him:** add a DOB column (new PII in a sheet
that already has a credential-exposure problem, A-18), or accept name + phone + email as the
practical check. Logged as **A-35**.

## 🔴 Finding 2 — phone is an enquiry SOURCE, not a parallel pipeline

`ARCHITECTURE.md`'s system map is explicit:

```
Walk-in sheet     ──┤   tabs: MASTER · ENQUIRIES
Phone log form    ──┘
```

`Phone` is **already** a value in the ENQUIRIES `Channel` dropdown and the MASTER `Source` dropdown.
A standalone call log that kept its own leads would fork the pipeline and duplicate M8's 7/30 cadence
— two nurture clocks on one person.

**But a call is not an enquiry.** An existing client ringing about their 485 is not a lead, and
writing them into ENQUIRIES would have M8 nurturing them as a cold prospect. That is the same class
of error as M5a re-stamping CHASE over DRAFTED.

### The resolution

| | |
|---|---|
| **CALL LOG** | every call. A record and a **callback queue**. Never a lead pipeline. |
| **ENQUIRIES** | leads only. **M8 owns all nurture cadence, exclusively.** |
| **promotion** | a new-enquiry call is copied to ENQUIRIES **once**, one-way, idempotent |

⛔ **CALL LOG must never run a follow-up cadence.** A callback ("ring back at 3pm today") and a
nurture cadence ("chase in 7 days, then 30") are different clocks. One row, one clock, one owner.

## 🔑 The lookup is a FORMULA, not a script

A consultant cannot run an Apps Script menu item while someone is on the line. Typing the caller's
number into column C must show, in the same row and instantly, who they are and where their matter
stands. So the match lives in the sheet as a formula — no clicks, works on a phone.

⚠️ **Match order matters.** D-54: MASTER's `Contact Number` (E) is **often blank** and is explicitly
*not* the dedupe key; `Email` (F) is the reliable one. On an inbound call we have a number and a
spoken name, not an email — so it tries **phone first, then name**, and **says which one hit**. A
name-only match on a common surname is exactly where a wrong file gets opened.

## Scope

**Buildable now (~2 h)** — CALL LOG tab, in-row lookup, callback queue, promotion to ENQUIRIES, tests.

⬜ **Blocked (~2 h)** — the structured intake question set needs their **`Client Enquiry Form`**
(I-14, already asked of Rey as item 6). ⛔ Do not invent the questions: D-314 said *"ask for it, do
not design it."*
