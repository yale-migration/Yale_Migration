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
| ENQUIRIES column **L `Last Contact`** | added live 18 Aug — `WROTE L = Last Contact`. Drives M8 stop-on-reply (D-339) |
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

## 1c · 📤 ASKED vs NEVER ASKED — the distinction that matters

⛔ **"Open" is not one state.** D-331 found two inputs that had **never been requested at all**,
hiding among items that were merely awaiting a reply. So every open row below must say which it is.

| Asked, awaiting reply | Never asked / not yet asked |
|---|---|
| **I-5 · I-9 · I-10 · I-13 · I-14 · I-15 · I-16 · I-17 · I-18 · I-19** — all in the team email of **18 Aug** (`SENT-2026-08-18-team-email.md`) | **I-3 Meta · I-4 WhatsApp · I-8 OneDrive** — Robinder's, going to **Friday's call** |
| | **I-20** real `.eml` — in the spec since 29 Jul → **Friday item 9** |
| | **I-22** S56 client-email wording + cadence — same 29 Jul batch → **A-34(b)** |
| | **I-23** S56 samples for 500/485/820 — same 29 Jul batch → **A-34(c)** |
| | 🔴 **I-24** GOPI's email/team — **blocks assigning him a client at all** → **Friday item 8** |
| | **I-21** M9 slot + operations — a decision, not an ask |

**I-7 · I-11 · I-12** are deliberately deferred, not blocked.

🔴 **19 Aug — the same failure D-331 named, found again by a different route.** All four rows above were
invisible to this register until a reconciliation ran the *other* way: not "is each open input tracked?" but
"is each thing the build needs actually **on a surface that reaches the client**?" I-20/22/23 sat in
`docs/M9-EMAIL-AI-SPEC.md` under the heading **"Still needed from client"** for three weeks — a heading that
reads exactly like a register and is not one. **I-24 is worse: it was hidden by a ✅.** A-13 was closed on
18 Aug as *"folded into A-16"*, but A-16's answer settled only the manager question; *"GOPI has joined"*
arrived with no email, and the tick on the parent carried the unanswered child away with it.
🔑 **A closure is only as complete as the narrowest question it absorbed.**


## 2 · 🔴 NOT HELD — and each one blocks contracted hours

| # | Input | Blocks | h | Ever asked? |
|---|---|---|---|---|
| ~~I-1~~ | ✅ **CLOSED 18 Aug — access granted AND verified** via `rpcSpreadsheet` on conn 9501125, 0 ops. IDs now held for all three of their sheets; 31 live tabs read back. This also closed access-checklist item 1, whose *"reply with the sheet's link"* half had been open since 21 July (D-337) | — | ✅ **DONE** |
| ~~I-2~~ | ✅ **CLOSED 19 Aug — connection 9948850 live and PROVEN by a real call.** Robinder had already created the key; it had simply never reached Make. **M9's 5 hours are unblocked** (D-340) | — | ✅ **DONE** |
| **I-3** | **Facebook + Instagram page access** (Meta) | M6 capture | ~3 of 8 | ⛔ **never asked** |
| **I-4** | **WhatsApp Business verification status** | M6 WhatsApp channel | ~1 | 🟠 raised at proposal, never chased |
| ~~I-5~~ | ✅ **CLOSED 21 Aug — there is NO website form.** RJ: *"none"*. Not a gap to fill; a channel that does not exist. ⛔ Do not build website capture |
| ~~I-6~~ | ✅ **CLOSED 21 Aug — there is NO walk-in sheet.** RJ: *"none"*. ROADMAP's *"location still to confirm"* was looking for a file that was never created |
| **I-7** | **👍 on the auto-reply wording** (A-10) | M6 going live | — | 🟠 held until M6 exists |
| **I-8** | **OneDrive on a Yale account** | M11 · **C-2** | 2+2 | 🔴 **THE ASK WAS IMPOSSIBLE (D-341).** Checklist item 2 said create an `automation@` M365 user — **there is no M365 tenant**; the drive is Robinder's personal `@hotmail.com`. Revised ask: a Microsoft account on `project1@`, folder shared to it. Friday |
| ~~I-9~~ | ✅ **CLOSED 25 Aug (D-402).** Three test-client emails + **ACECQA** for the 485. Verified against the module that eats it, not just received: both ACECQA checklists exist and the CHECKLIST MAP carries both rows, so M4 can file. ⛔ Details in `client-data/` only. **M10's 2 h is now actionable by us** — the last team-side blocker on contracted hours is gone | M10 | 2 | ✅ |
| **I-10** | **Skills authority for the 4 × 485** | 4 checklists at import | — | 🟢 **DOWNGRADED 21 Aug — no longer blocks the import (D-352).** All 38 are pre-stamped `Checklist Filed`, so M4 never evaluates them. Needed only for **new** clients from #39, and for the 485 among the three pilot files |
| **I-11** | **Make paid plan** | the go-live gate | — | 🟢 deliberately deferred (D-291) |
| **I-12** | Dashboard access list (A-30) | Looker row-level security | — | 🟠 team deferred to Robinder |
| ~~I-13~~ | ✅ **CLOSED 21 Aug — `"all the checklists are currently in used"` (RJ).** **M4 IS UNBLOCKED.** ⚠️ But read D-350 before treating this as settled: he confirmed a **count**, not a **list** — the guide only ever said *"23 of your own checklists"* and never named one. The filenames were sent on 21 Aug so the confirmation has something to attach to. **A confirmation of a number is not a confirmation of the documents.** |
| ~~I-14~~ | ✅ **CLOSED 21 Aug — HELD AND READ.** `INQUIRY FORM YALE MIGRATION PINOY`, public `/viewform`, **9 questions** extracted from the form's own payload, not guessed. **C-1 is unblocked.** Fields: Complete Name · Age · Mobile/WhatsApp · Email · Location (Australia\|Philippines) · Current Work Experience · Course completed · Interested in? (10-way checkbox) · free-text situation. ⚠️ **Three have no ENQUIRIES column** — Age, Work Experience, Course completed → Notes, not new columns (A-32: *"too much column is a lot to handle"*). ⚠️ Location needs translating: Australia→Onshore, Philippines→Offshore. ⚠️ Title says **PINOY** — asked whether Brisbane/Indian has its own form |
| **I-15** | Inquiry-SOP follow-up Email/SMS templates (item 10) | M8 wording, M6 auto-reply | — | 🔴 **ANSWERED 21 Aug: THEY DO NOT EXIST.** RJ: *"it doesn't exist but that is what we need to do and we need to have."* Not a file we are missing — a thing they have never had. **Email:** we already author administrative wording (checklist + chase drafts), so drafting two lead templates for the RMA to approve is consistent, small and offered. **SMS: ⛔ NOT POSSIBLE TODAY** — sending texts needs a paid SMS provider that is in no plan, no quote and no connection. → `CHANGE-REQUESTS.md` CR-015. ✅ **23 Aug — WE WROTE THEM.** `docs/M8-FOLLOWUP-TEMPLATES.md`, both emails, cadence bound to the code's own constants. **This input is no longer an input:** it was never a file they held, so it stops being something to wait for and becomes something to get approved. Reclassified from 🔴 blocking to 🟢 awaiting the RMA's 👍 |
| ~~I-25~~ | ✅ **CLOSED 22 Aug — SHARED AND VERIFIED, same day it was asked.** `Inquiry form (Responses)` = `1vNnefC2nS4dKDDWPnCSJDvt09tkwdjpUQSK7KbuHwAo`, confirmed readable by `project1@` via `rpcSpreadsheet` at **zero operations cost** — not taken on trust. Two response tabs: `Form Responses 1` and `Form Responses 2 2025`. **C-1's transform is built and tested; this is its source.** ~~🔴 the enquiry form's RESPONSE FEED. We hold the form's nine QUESTIONS (I-14). We do not hold its ANSWERS, and `project1@` cannot read the response destination. **C-1's transform is built and tested 21/21; it has no source.** Ask: *where do the responses land, and can `project1@` read that sheet?* → **D-358** | **C-1 completing** (transform done, ~0.5 h to wire) | 0.5 | ⛔ **never asked — I-14 was closed on the field set alone** |
| **I-20** | 🟡 **PARTLY ANSWERED BY OUR OWN MAILBOX, 19 Aug — not by the client** | M9's trigger filter | — | 🔑 The first live M9 run fetched a real Department email: sender `noreply.skilled@homeaffairs.gov.au`, full subject line, full body. **The sender and subject — the two 'cheapest classifier features' this row existed to obtain — were in the mailbox we already had access to.** Logged as never-asked since 29 Jul. ⬜ Still genuinely wanted: a real **s56 request** specifically (this one was a bridging-visa grant), to confirm the deadline sentence survives as text and is not trapped in an image-only PDF attachment |
| **I-21** | 🔴 **A Make slot AND the operations for M9** | M9 running at all — `scenarios:2` cap, and ~600 ops/mo at their volume | — | go-live decision (D-342) |
| **I-22** | Yale's **S56 client-request + follow-up wording** + the reminder cadence | M9's draft replies — the file sent under this name is WhatsApp screenshots (D-38) | — | ⛔ **never asked** — same 29 Jul batch as I-20 → A-34(b) |
| **I-23** | S56 samples for **500 / 485 / 820-801** | confirms the 28-day figure holds beyond the one subclass we have seen | — | ⛔ **never asked** — same 29 Jul batch → A-34(c) |
| ~~I-24~~ | ✅ **CLOSED 22 Aug — GOPI HAS LEFT** (*"She will no longer continue with us."*), four days after we were told she joined. ⛔ Do not add her, do not ask for her. **The defect it exposed is real and unfixed: the consultant dropdown is hardcoded, so every staff change is a code change → D-355.** ❓ And RJ says there is *another* staff update we have not been told about → **A-45** ~~| 🔴 GOPI's work email, team and visa line~~ | `MASTER` col L dropdown is `setAllowInvalid(false)` — **he cannot be assigned a client at all** until he is on the list | — | ⛔ **never asked.** Hidden by A-13 being closed into A-16 on 18 Aug → A-33, Friday item 8 |
| **I-16** | 🔴 **"Anyone else on the application?" — Q5, returned 0/41** | **the RIGHT checklist per client** | — | 🟢 **DOWNGRADED 21 Aug — no longer blocks the import (D-352).** Column D `Party 2 Name` drives ONLY M4's checklist selection, and M4 is switched off for all 38. Becomes a **go-forward data-entry rule**, not a 38-row backfill. 🔑 His own answer dissolved our biggest data ask |
| ~~I-17~~ | ✅ **CLOSED 21 Aug — LIVE, but personal.** RJ: *"This is live but I am the only one using it. Its my personal sheet before I can transfer them in the main lists."* 🔑 **Decision: the 247 stay OUT.** Every MASTER row creates a folder and a client record; people who are not engaged should have neither. Confirms A-17/D-330 — `LODGEMENT: JULY TO PRESENT` is the engaged-onwards subset and remains the single import source. ⚠️ **Phase-2 flag, not raised with him:** a consultant's private list is invisible to the director's dashboard. That IS the multi-branch oversight problem (CR-001→012) |
| ~~I-18~~ | ✅ **CLOSED 21 Aug — duplicate of I-6, same answer: none.** Two rows for one input; G6 |
| ~~I-19~~ | ✅ **CLOSED 21 Aug — both are Robinder's** (RJ: *"Robin"*). The roster's two unattributed mailboxes are resolved. ⚠️ Note D-94's trap was avoided here only because we asked |

---

## 3 · 📊 What that means for the remaining hours — **RECALCULATED 21 Aug**

| Module | h | Buildable **today**? |
|---|---|---|
| M6 Enquiry capture hub | 8 | 🟠 **PARTLY — and this changed today.** I-5 and I-6 closed as *"there is no such channel"*, and I-14 (their form) is now held and read. **Still blocked on I-3 Meta + I-4 WhatsApp**, which are the two channels that actually carry volume |
| M9 Gmail triage / s56 | 5 | 🔴 **NO** — I-21, a Make slot and the ops to run it |
| M7 Phone intake | 4 | 🟡 **half done.** The buildable half shipped 20 Aug, 63 tests. The intake question set now has a source — **I-14 is held** |
| M10 End-to-end testing | 2 | 🟡 **names supplied 21 Aug**, details requested. Runs as a **pilot of three** |
| M11 Handover | 2 | 🔴 NO — I-8 |
| M8 Lead follow-up | 2 | ✅ **DONE and triggered**, 37/37 |
| C-1 Intake form | 2 | 🟡 **1.5 of 2 h BUILT 22 Aug** — `c1_enquiry_form_intake.gs`, 21/21 tests, mapping decided and three deliberate blanks recorded (D-359). 🔴 **Cannot complete: no response feed (I-25).** The transform is the work; the feed is one sharing setting |
| C-2 Upload link | 2 | 🔴 NO — I-8 |
| C-5 capture path | 0.5 | 🔴 NO — same channels as M6 |

**What actually moved today.** Five inputs closed (I-5 · I-6 · I-13 · I-14 · I-17 · I-19 — six) and
two were **downgraded from blocking to go-forward** (I-10 · I-16) by D-352. 🔑 **The single biggest
one is I-13: M4 can now be switched on.** That was the one input gating whether the checklist engine
— the most-tested thing we have built — was allowed to run at all.

🔴 **But the shape of the constraint is unchanged: it is still inputs, not engineering.** What
remains is **I-3 Meta · I-4 WhatsApp · I-8 OneDrive · I-21 the Make slot** — and all four go to
**Robinder**, not the team. The team has now answered essentially everything they can answer.

⚠️ **Two defects found on OUR side today, both of which would have surfaced at import** — neither is
a client input and neither belongs in this register. They are tasks in `WHERE-WE-STAND.md` §4:
`Citizenship` missing from MASTER's dropdown (D-353), and the 190 checklist that may never have been
uploaded to the folder M4 reads from (D-354).

---

## 4 · What must go to the client, in priority order

1. ~~I-1 — the re-share~~ ✅ **DONE 18 Aug, verified.**
2. ~~I-2 — the Anthropic key~~ ✅ **DONE 19 Aug.**
3. **I-8** — OneDrive onto `project1@`. ⛔ **ADD first, remove ours only after it is proven.**
4. **I-3 · I-5 · I-6** — the three M6 channel questions. One message, three lines.
5. ~~I-10 — the four 485 authorities~~ ✅ **no longer blocking** (D-352). Still wanted for the 485
   among the three pilot files, and asked for on 21 Aug.
6. **I-21** — the Make scenario slot and the operations to run M9. Robinder, Friday.

🔑 **As at 21 Aug the team's side is essentially clear.** Everything left is Robinder's: Meta,
WhatsApp, OneDrive, the Make plan. ⛔ Do not send the team another list — send Robinder four things.

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
