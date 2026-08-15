# CLIENT ASKS — live register of every open question
**Updated 14 Aug 2026.** One row per ask. Nothing is asked twice (G2); nothing is silently forgotten.
`CLIENT-LOG.md` is the chronological record — **this file is the outstanding balance.**

Status: 🔴 blocking · 🟠 blocks one module · 🟢 nice to have · ✅ answered · ⛔ withdrawn

---

## 🔴 BLOCKING GO-LIVE

| # | Ask | Asked | Status |
|---|---|---|---|
| ~~A-14~~ | ~~Link to the sheet they use today~~ | 12 Aug | ✅ **CLOSED 14 Aug (D-300).** The team sent `REYWARD JAKE M GAMOL-2026.xlsx` — 25 tabs, ~460 client records, filed by month of arrival. **That is their real client database.** Also `DATA SHEET.xlsx`, ~200 rows, the cold-call log → feeds ENQUIRIES |
| **A-20** | 🔴 **Share both Google Sheets with `project1@` (Viewer)** — we hold static exports, not live data (D-304) | 14 Aug | 🔴 **one click.** Without it the dashboard reads a snapshot that is already stale |
| ~~A-21~~ | ~~Who is the consultant for each client?~~ | 14 Aug | ✅ **ANSWERED FROM THEIR OWN DATA — do not ask (D-305, D-308).** `LODGEMENTS` has `Handled By`; `LAOAG FILES` has `Counsellor`; and in `STUDENTS.xlsx` **the consultant IS the tab name** (`Queries Gayatri`, `SV Ext. Gayatri`, `Inderpreet`). At import, each row inherits the consultant from its tab. D-303 said no such field existed — **that was wrong and is superseded** |
| **A-16** | **MANAGER ROLES ONLY** — who is a manager? + Mershe's email + is the roster current? | 14 Aug | 🟠 **SCOPE CORRECTED 15 Aug (D-310).** 🔑 **We already hold every staff email** — the client sent `access/Team roster.docx` on **26 Jul**; now transcribed into `ACCESS.md`. Five of our own files wrongly claimed *"no email anywhere"*. The roster has team and visa line but **no role column**, which is the only real gap |
| **A-17** | **Which of the ~460 records are still ACTIVE?** | 14 Aug | 🟠 cannot be told reliably from `ACTION`/`Notes`. Start with their own `SUMMARY OF CLIENTS` (47 curated rows) |
| **A-18** | 🔴 **JRP tab holds 73 clients' portal passwords in plaintext, one password reused** | 14 Aug | 🔴 **advise rotation + password manager.** We never import or copy those columns |
| **A-19** | **Is JRP (Job Ready Program, 4 steps, 73 clients) in scope or out?** | 14 Aug | 🟠 a whole workflow we did not know existed |

## 🟢 NO LONGER BLOCKING

| # | Ask | Asked | Status |
|---|---|---|---|
| A-01 | **Make Core paid plan** (~AUD 12/mo) | raised 5 Aug · **deliberately NOT re-raised** (D-273) | 🟢 **DOWNGRADED 13 Aug (D-291).** `Weekdays (Mon-Fri)` + 3 fixed times = ~392 ops/month against 1,000 — **M3 and M4 can go live on Free.** Still required later: Free caps *active scenarios* at 2, so M6 and M9 cannot run without it. Raise then, with M3/M4 already running as the evidence |

---

## 🟠 BLOCKS A SPECIFIC MODULE

| # | Ask | Asked | Status |
|---|---|---|---|
| ~~A-02~~ | ~~Correct Subclass 190 checklist~~ | 6 Aug · re-sent 7 Aug | ✅ **CLOSED 11 Aug (D-280).** Third version is correct — heading says 190, zero mentions of 491/189/regional, "+5 points state nomination". Filed as `190_SKILLED-NOMINATED.docx` |
| ~~A-03~~ | ~~Gmail OAuth on `project1@`~~ | ✅ **WITHDRAWN — NOT NEEDED (D-271).** `Yale's Gmail connection` (id 9452213) already exists on `visa.lodgement@`, created by the client, valid to Jan 2027, with **`gmail.modify`** — which permits both send and draft-create. **M4b/M5b are buildable today.** |
| A-03b | Which mailbox should checklist/chase **drafts** appear in — `visa.lodgement@` or `project1@`? | 11 Aug | 🟢 preference. Building on `visa.lodgement@` |
| ~~A-15~~ | ~~Gmail reauthorize for Create-a-Draft~~ | 13 Aug | ⛔ **WITHDRAWN 14 Aug — never real (D-297).** `gmail.modify` covers `drafts.create`, and `TriggerNewEmail` already runs on that exact connection with the same declared requirement. **M4b/M5b need nothing from the client.** Do not ask |
| ~~A-04~~ | ~~Dashboard requirements — 6 questions~~ | ~8 Aug | ✅ **ANSWERED 14 Aug (D-298).** Clients see own · managers see own branch · Robinder sees all · laptop-first but responsive · hourly refresh · views specified |
| A-05 | **CRM** — which of CRM4Agencies / Migration Manager / Agentcis is closest | ~8 Aug | 🟠 no answer. One word halves Phase-3 discovery |
| A-13 | **Updated staff list** — `Mershe Ventura` answered our tracker questions but is on no roster we hold (D-269) | 11 Aug | 🟠 `Assigned Consultant` is a locked dropdown; anyone missing cannot be selected at all |
| ~~A-14~~ | *(promoted to the blocking table above)* | | |

---

## 🟡 TEAM QUESTIONS — ⛔ CLOSED 12 Aug: THE FILE IS ABANDONED

| # | Ask | Their reply | Status |
|---|---|---|---|
| A-06 | P/Q manual summary — who maintains it, who uses it | 10 Aug *"Which sheet you are referring to?"* → 12 Aug *"we are not using it"* | ⛔ **WITHDRAWN — moot (D-289).** Never ask again |
| A-07 | `48hr Alert` — purpose, when it broke, who should be alerted | ✅ *"we are not currently following it but if we can work that out **both the manager and consultant** should be notified"* | ✅ **ANSWERED — see D-266.** Still valid: it defines who M5 notifies |
| A-08 | Tracker annoyances · missing columns · unused columns | 10 Aug *"I need to know the tracker we are referring."* → 12 Aug *"we are not using it"* | ⛔ **WITHDRAWN — moot (D-289).** Never ask again |

🔴 **`Engaged Client Tracker.xlsx` IS DEAD DATA (D-289).** Two weeks of discovery ran against a file they
have since left. It is *not* the import source and must not be treated as one. Its column vocabulary
survives in MASTER v2 — the concepts were right, the file was stale.
**Superseded — their real database is `REYWARD JAKE M GAMOL-2026.xlsx` (D-300).**

---

## 🟢 NOT BLOCKING ANYTHING YET

| # | Ask | Status |
|---|---|---|
| A-09 | **Fee quotes inside checklists** — `500_ADDING-DEPENDENT` shows **$2,028**, `407_TRAINING` shows **$4,060**. Fixed prices, or quote separately? Also $2,000 vs the $2,500 VAC in Appendix A | ⬜ not yet asked — hold until the next natural message (G5) |
| A-10 | 👍 on M6 auto-reply wording | ⬜ before M6 goes live |
| A-11 | 2–3 real client files for M10 end-to-end testing | ⬜ at M10 |
| A-12 | Final 50% ($840) on go-live | ⬜ |

---

## ✅ CLOSED — never ask again (G2)

| Ask | Answer | Ref |
|---|---|---|
| Folder structure for all visa types | Approved with 3 changes: health merged into Identity · work by Step 1/2/3 · 820/801 as sub-folders | D-126 |
| Townsville / Philippines offices | *"we will do in future, in couples of months"* — **out of MVP scope** | D-230 |
| GSM checklist filenames | 4 of 5 corrected by renaming | D-235 |
| 485 VETASSESS wrong header | New file supplied | D-235 |
| CDR section missing | Bachelor/Masters generally needs no assessment; CDR occupations → **Engineers Australia** | D-234 |
| Add a Skills Authority column | *"You can add a column on that one"* — **approved**, live as column X | D-234 / D-245 |
| Auto-send vs prepare-and-review | *"prepare and check first before sending"* — **M4b must never auto-send** | D-234 |
| `visa.lodgement@` owner · mail platform · roster (Nisha = former staff) | All resolved | D-80 / D-76 / D-124 |
| s56 cadence + client notification template | 7/14/21/26, template supplied | D-58 / D-117 |
