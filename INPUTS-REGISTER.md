# INPUTS REGISTER — everything the build needs, and whether we actually hold it

**Created 18 Aug 2026 (D-331).** One row per input. **Verified state, not remembered state.**

This file exists because `ACCESS.md` marked the Claude API key **✅ held** for weeks. It is not
held. It was never asked for, appears in no `CLIENT-ASKS` row and no `CLIENT-LOG` entry, and
`connections_list` on team 2210317 returns four connections, none of them Anthropic. A ✅ that
nobody checked reads exactly like a ✅ that somebody did.

⛔ **A row here may only be marked ✅ with a primary source named in the Evidence column.**
"We discussed it", "it's in the engagement letter" and "the client agreed" are not evidence that a
thing is in our hands.

---

## 1 · ✅ HELD — verified against a primary source

| Input | Evidence (checked 18 Aug) |
|---|---|
| Google Sheets connection, **client-owned** | Make conn `9501125` · `project1@yalemigration.com.au` · 5 scopes · no expiry · used by M3 + M4 |
| Gmail connection, **client-owned** | Make conn `9452213` · `visa.lodgement@` · `gmail.modify` · expires **2027-02-12**, auto-refreshing |
| MASTER spreadsheet, A–AE | 31 columns · `verifyMasterColumns()` 22/22 · `verifyChaseFlagColumn()` 11/11 |
| 23 canonical checklists | `docs/05-canonical-checklists/` · hash-recorded in `MANIFEST.json` · cross-checked against CHECKLIST MAP and M4's router by `verify_blueprints.py` |
| Their 4 client workbooks | `client-data/` · all 66 tabs censused (`audit_all_tabs.py`, D-316) |
| **The returned client list** | `client-data/2026-08-18_CLIENT-LIST-TO-UPDATE_returned.xlsx` · 38 importable rows |
| **Their answers to 19 questions** | `client-data/2026-08-18_ANSWERED_YM-DQ-e573.docx` · 12 closed (D-330) |
| Staff roster | `access/Team roster.docx`, 26 Jul · transcribed into `ACCESS.md` · updated 18 Aug (Mershe out, GOPI in) |
| Their 12 process SOPs | `SOP'S 2/WORK FLOWS/` · 12 PNGs · transcribed in `CLIENT-SOP-WORKFLOWS.md` (D-307) |
| **Their real fee schedule** | `ANSWERED.docx` Q18/Q19, 18 Aug — supersedes every figure we had |
| M6 + M9 written specs | `docs/M6-AUTOREPLY-SPEC.md` · `docs/M9-EMAIL-AI-SPEC.md` |
| MARN for signatures | Robinder Pal Singh, **1573959** (D-60) |

---

## 1b · 🔴 THE KICK-OFF ACCESS CHECKLIST — audited 18 Aug for the first time

**We wrote a 14-item access checklist and sent it on 21 July** (`project documents/Yale-Migration-Access-Checklist.pdf`).
The Engagement Letter names it: *"the access checklist … sent the same day the invoice is settled."*
**Nobody has audited against it since.** Seven of the fourteen were never delivered, and we never chased them.

| # | Item (their priority order) | State |
|---|---|---|
| 1 | Client Engagement Log — share the Sheets | 🟠 shared with `sharry00010@` (personal), **not** `project1@` → this IS Q9 / A-20 |
| 2 | **M365: create an `automation@` user + share the folders** | 🔴 **NEVER DONE.** We OAuth'd my *personal* Microsoft account instead. **The checklist asked for exactly the right thing and it was never delivered — that is the whole of risk #1** |
| 3 | `project1@` 2-Step + delegate access | ⛔ **superseded, correctly** — `gmail.modify` on `visa.lodgement@` covers it (D-297) |
| 4 | **Meta Business Manager — invite + assign FB Page, IG, WhatsApp** | 🔴 **NEVER DONE** → M6 |
| 5 | **WhatsApp Business — verification status + number** | 🔴 **NEVER ANSWERED.** ⚠️ The Engagement Letter calls this *"the longest single item in the timeline"* and says start it *"right away"*. **28 days have passed** |
| 6 | **Website enquiries — where do they land?** | 🔴 **NEVER ANSWERED** → M6 |
| 7 | Make.com account + admin invite | ✅ **DONE** — team 2210317 |
| 8 | **Claude AI key** | 🔴 **NEVER DONE** (D-331) → M9, 5h |
| 9 | Sample emails sent + received, incl. a real s56 | ✅ **good coverage** — 4 s56 artefacts, 485 + student threads |
| 10 | Follow-up Email / SMS templates | 🟠 s56 template only; the Inquiry-SOP follow-up templates never arrived |
| 11 | Team roster | ✅ **DONE** 26 Jul |
| 12 | **Internal forms — Enquiry / Detail / Consultation** | 🔴 **NONE RECEIVED.** Their SOPs name **six** artefacts — `Client Enquiry Form`, `Client Information Sheet`, `Service Agreement`, `Client Quotation`, `Client Consent Form`, `Document Request Checklist` — **we hold none of them** |
| 13 | Enquiry conversation screenshots | 🟠 1 received, 2–3 asked for |
| 14 | **Confirm the checklists we hold are the CURRENT versions** | 🔴 **NEVER CONFIRMED.** 🔴 **M4 files these 23 documents to real clients.** If any is out of date we send a client an outdated document list under an RMA's name |

🔑 **Item 14 is the one that should not have waited.** Everything else costs time. That one costs
credibility with their clients, and M4 is built and one switch away from doing it.

🔑 **Item 12 changes what is buildable.** D-314 said of the intake form: *"Ask for it — do not design
it."* We never asked. **C-1 is therefore NOT buildable** — correcting yesterday's audit, which
marked it 🟢.

---

## 2 · 🔴 NOT HELD — and each one blocks contracted hours

| # | Input | Blocks | h | Ever asked? |
|---|---|---|---|---|
| **I-1** | **Live sheet access for `project1@`** (Q9 / A-20) | the import, and every number the dashboard shows | — | ✅ asked 16 Aug, **not answered** |
| **I-2** | 🔴 **Anthropic API key + a Make connection for it** | **M9 entirely** | **5** | ⛔ **NEVER ASKED.** `ACCESS.md` says ✅. It is not |
| **I-3** | **Facebook + Instagram page access** (Meta) | M6 capture | ~3 of 8 | ⛔ **never asked** |
| **I-4** | **WhatsApp Business verification status** | M6 WhatsApp channel | ~1 | 🟠 raised at proposal, never chased |
| **I-5** | **Where the website form lands** | M6 website capture | ~1 | ⛔ never asked |
| **I-6** | **Where the walk-in sheet lives** | M6 walk-in fold-in | ~1 | ⛔ never asked — ROADMAP says "location still to confirm" |
| **I-7** | **👍 on the auto-reply wording** (A-10) | M6 going live | — | 🟠 held until M6 exists |
| **I-8** | **OneDrive on a Yale account** | M11 handover · **C-2** | 2+2 | ✅ asked 16 Aug, not answered |
| **I-9** | **2–3 real client files** (A-11) | M10 | 2 | 🟠 due at M10 |
| **I-10** | **Skills authority for the 4 × 485** | 4 checklists at import | — | ✅ asked, returned blank |
| **I-11** | **Make paid plan** | the go-live gate | — | 🟢 deliberately deferred (D-291) |
| **I-12** | Dashboard access list (A-30) | Looker row-level security | — | 🟠 team deferred to Robinder |
| **I-13** | 🔴 **Confirmation the 23 checklists are CURRENT** (checklist item 14) | **M4 going live at all** | — | ⛔ **never chased** |
| **I-14** | 🔴 **`Client Enquiry Form`** (checklist item 12) | **C-1**, and M6's field set | 2 | ⛔ **never asked** — D-314 said "ask for it, do not design it" |
| **I-15** | Inquiry-SOP follow-up Email/SMS templates (item 10) | M8 wording, M6 auto-reply | — | 🟠 partial |

---

## 3 · 📊 What that means for the remaining hours

| Module | h | Buildable **today**? |
|---|---|---|
| M6 Enquiry capture hub | 8 | 🔴 **NO** — I-3 · I-4 · I-5 · I-6 |
| M9 Gmail triage / s56 | 5 | 🔴 **NO** — I-2 |
| M7 Phone intake | 4 | 🟢 **YES** — their phone SOP is transcribed |
| M10 End-to-end testing | 2 | 🔴 NO — I-9 |
| M11 Handover | 2 | 🔴 NO — I-8 |
| M8 Lead follow-up | 2 | ✅ **DONE** bar stop-on-reply (~0.5h) |
| C-1 Intake form | 2 | 🟢 **YES** — built to their existing form |
| C-2 Upload link | 2 | 🔴 NO — I-8 |
| C-5 capture path | 0.5 | 🔴 NO — same channels as M6 |

**≈18.5 of the ~21 contracted hours left are blocked on inputs we do not hold.**
🟢 **Genuinely unblocked: stop-on-reply (0.5h) + the half of M7 that does not need their form (~2h)
— about 2.5 hours.** ⛔ Yesterday I said 6.5. That counted C-1 as buildable and it is not.

🔑 **The constraint on this project is no longer engineering. It is inputs.** Two of the twelve
missing ones — **I-2 and I-3** — were never asked for at all, and between them they gate
**13 of the 40 contracted hours**.

---

## 4 · What must go to the client, in priority order

1. **I-1** — the re-share. One click. Unblocks the import and everything downstream.
2. **I-2** — the Anthropic key. ⚠️ Their billing per the Engagement Letter, so this is also the
   first time they see a running cost. Do not bundle it with anything else.
3. **I-8** — OneDrive onto `project1@`. ⛔ **ADD first, remove ours only after it is proven.**
4. **I-3 · I-5 · I-6** — the three M6 channel questions. One message, three lines.
5. **I-10** — the four 485 authorities, plus the answer they asked us for (A-28).

⛔ **Not four separate messages.** Cap is four items for Robinder (`VOICE-MESSAGE-robinder.md`);
the team took nineteen in one document and answered twelve. **Channel questions to the team,
account and billing questions to Robinder.**


---

## 5 · 🔬 Data issues inside the returned sheet (D-333) — need one reply each

| Row(s) | Issue | Why it cannot be guessed |
|---|---|---|
| 28 | spelled one way here, another on their tab (one letter) | becomes a OneDrive folder name and is typed into client email |
| 22 + 23 | **one email on two clients** (482 and 500, both RJ) | email is MASTER's identity key; both checklists land in one inbox |
| 13 | domain `gmil.com` | one character from `gmail.com` — will bounce, and we must not invent an address |
| 18 · 24 · 34 · 41 | **485 with no skills authority** | five different 485 checklists exist; M4 cannot choose |
| 34 | no consultant + no email + 485 with no authority | unprocessable as it stands |
| all 41 | **column F "anyone else on the application" returned empty** | we told them ourselves this one "has real consequences" — wrong checklist otherwise |

**Degraded but not blocking:** 12 rows without an email · 6 without a consultant (→ `Unassigned`).

## 6 · ✅ Verified clean — do not re-check these

- Visa type on the returned sheet matches their own `TYPE OF VISA APPLICATION` on **all 39** joinable
  rows — **0 mismatches**.
- `SAMPLE` was dropped by them without being asked again (answers Q8 in practice).
- one client is duplicated in **their** tab; the returned list correctly has him once.
- Office is BRISBANE on all 41 — Q3 answered by omission, no Townsville clients in this batch.
