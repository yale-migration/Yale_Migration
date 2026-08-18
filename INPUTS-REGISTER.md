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

**≈15 of the ~21 contracted hours left are blocked on inputs we do not hold.**
🟢 **Unblocked and mine to do: M7 (4h) · C-1 (2h) · stop-on-reply (0.5h) — about 6.5 hours.**

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
