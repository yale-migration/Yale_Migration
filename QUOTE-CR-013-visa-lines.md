# CR-013 — covering the four uncovered visa lines
**Draft quote for Sharjeel's approval. Not sent.** 19 Aug 2026 · **updated 21 Aug** · for the Friday call.

## 🔄 21 Aug — THE CONTENT BLOCKER IS CLEARING, THE WORK IS NOT

The single biggest caveat in this quote was *"we cannot author the checklists, Robinder must."*
**Yale is now supplying them, unprompted.**

| Line | Document | State |
|---|---|---|
| **186** | ✅ **RECEIVED 21 Aug** from RJ — `UPDATED 186 VISA CHECKLISTS.pdf` | Opened and read (G8). Yale letterhead, **one document** covering employer docs, applicant docs and both fee tables. No bank details, no client PII. Companion `EMPLOYEE DETAILS.docx` and a blank Form 80 came with it — both blank templates, verified |
| **600** | ✅ **RECEIVED 22 Aug** — `YM-SUBCLASS 600 (TOURIST VISA).docx` | Opened and scanned. **Single variant.** No bank details, no fee table, no PII. ⚠️ opens `3AUSTRALIAN VISITOR VISA` — a stray leading `3`, client-facing, theirs to fix |
| **Citizenship** | ✅ **RECEIVED 22 Aug** — `YM-CITIZENSHIP.docx` | Opened and scanned. **Single variant**, 6 sections. Clean on all D-249 markers |
| **ART** | ⬜ not offered | the only one still with no path |

**What this changes in the estimate.** 186 was priced at **1.5 h** on the assumption of *"likely two
variants — with and without dependants."* The document that arrived is **one variant**, handling
dependants inline (*"applicant and accompanying dependants, if applicable"*). **186 drops to 1.0 h.**
600 and Citizenship are unchanged until their documents arrive and can be read.

⛔ **THE CONTENT ARRIVING DOES NOT MAKE THE PLUMBING FREE — and this is the sentence that protects
the quote.** Every new line still needs: the file uploaded to OneDrive · its CHECKLIST MAP rows ·
**a router change in the M4 blueprint** · the partition proof extended · an end-to-end test.
**D-285 is the authority and it was learned the hard way:** when the 190 checklist arrived we told
the client *"two spreadsheet rows, no scenario edit"* — that is true only for a visa type **already
in the router**. A brand-new line also needs a scenario change, and 190 sat broken for a week
because we believed our own simpler description.

⚠️ **Citizenship carries a defect of its own (D-353):** it is **not in MASTER's Visa Type dropdown**,
which is `setAllowInvalid(false)`. Two Citizenship rows are already in the 38-row import and would be
**rejected outright**. That fix is ours and is not billable — but it must land before the line can
exist at all.

🔑 **On the call:** the honest and generous framing is *"your team has done the hard half."* Then the
number, in writing, for the half that is ours.

---

## ⚠️ Read before you price this

**1. It is FOUR lines, not six.** `CHANGE-REQUESTS.md` said *"six"* and then listed *five*, and one
of the five — `PARTNER VISA` — **is already covered**: the 820/801 checklist exists and M4 files it.
That row needs a cell changed from `PARTNER VISA` to `820/801`, which Rey has already been asked to
do at no charge. Verified against `docs/05-canonical-checklists/` — 30 files covering
`101 189 190 407 417 482 485 491 494 500 802 820`. **Quoting six would have overcharged a family
referral by 50%.**

**2. 🔴 We cannot author the checklists. Robinder must.** Deciding which documents a visa application
requires **is migration advice**, and only the RMA gives it. If we write a document list for a 186
and a client relies on it, that is an unregistered person advising on a visa under Yale's name.
So the split is: **he supplies the four document lists; we do the plumbing.** Say this out loud on
the call — it is also why the number is as low as it is.

**3. ART and Citizenship are not visas.** ART is a tribunal review with its own statutory deadlines;
Citizenship is a different application type entirely. Neither fits the existing folder structure or
stage list cleanly. They are priced higher for that reason, and if he wants them done properly they
may be better as their own small piece of work rather than bolted onto the visa pipeline.

---

## Scope

Per line, once Robinder supplies the document list:

1. Add his checklist to the canonical set, hash-recorded like the other 30
2. Add its `CHECKLIST MAP` row(s) — including the with/without-dependants variant where it applies
3. Add the routing branch to the M4 blueprint
4. Extend the partition proof in `verify_blueprints.py` so the new branch is covered by the same
   1,008-row exhaustive test as everything else
5. End-to-end test on a real row

## Estimate

| Line | h | Note |
|---|---|---|
| **186** ENS | ~~1.5~~ **1.0** | ✅ **document received 21 Aug — ONE variant, not two.** Re-read before re-pricing |
| **600** Tourist | 1.0 | ✅ received 22 Aug, single variant — estimate holds |
| **ART** review | 2.0 | Not a visa. Statutory deadlines, own stage set, own folder shape |
| **Citizenship** | ~~1.5~~ **1.0** | ✅ received 22 Aug, single variant. **Drops because the dropdown work is already done** — `Citizenship` went live in MASTER column H on 22 Aug (D-362), which was most of the *"not a visa"* caveat |
| Shared: router changes, partition proof, regression run | 2.0 | Done once, covers all four |
| | ~~8.0~~ **7.5** | |

### 🔄 22 Aug — THREE OF FOUR ARE IN HAND. Deliverable scope is now:

| Line | h | State |
|---|---|---|
| 186 | 1.0 | ✅ document held |
| 600 | 1.0 | ✅ document held |
| Citizenship | 1.0 | ✅ document held |
| Shared: router, partition proof, regression | 2.0 | |
| | **5.0** | **USD 175** |

⛔ **ART is NOT in that figure.** No document, never offered, and it is a tribunal review with its own
statutory deadlines — **2.0 h / USD 70, quoted and unstarted**, and it stays unstarted until a
document exists. Do not let "the visa lines" be heard as including it.

*(superseded figure below, kept so the movement is visible)*
~~**7.5 hours @ USD 35 = USD 262.50.**~~ ⛔ Re-price once 600 and Citizenship actually arrive and have
been opened — 186 fell by half an hour purely because the real document was simpler than assumed,
and the same could go either way for the other two. **Never price a document you have not read.**

⛔ **Clock starts when each document list arrives**, not on acceptance. **186 has arrived; 600 and
Citizenship are promised; ART has no path.** We do the lines we hold plus the shared work; the rest
stay quoted and unstarted. ⚠️ **These go out to clients automatically under an RMA's registration —
Robinder should sight each one before it is loaded.** Said to RJ on 21 Aug, once, lightly.

---

## What to say on the call

> "Aapki team ne poocha tha ke jo lines cover nahi hain woh cover ho jayein. Maine dekha — woh
> **chaar** hain, chhe nahi: 186, 600, ART aur Citizenship. Partner visa pehle se covered hai,
> bas sheet mein `820/801` likhna hai.
>
> Ek zaroori baat: **checklist ka content aap denge, main nahi.** Kaunse documents chahiye — woh
> migration advice hai aur woh sirf aap de sakte hain, aapke registration ke under. Main sirf
> system mein daalunga, route karunga aur test karunga.
>
> Teen lines ke documents aap ki team ne bhej diye hain — 186, 600, Citizenship. Un teeno ka kaam
> **paanch ghante — 175 dollars**. ART abhi shamil nahi hai: uska document nahi aaya, aur woh tribunal
> ka kaam hai — alag se **do ghante, 70 dollars**, jab document aa jaye."

🔴 **THE FIGURE ABOVE WAS `280` UNTIL 23 AUG AND IT WAS WRONG BY $105.** `280` is 8.0 h × $35 — the
**original** estimate, from before three of the four documents arrived and 186 and Citizenship each
dropped by half an hour. The scope table in this same file already said **5.0 h / USD 175**, so the
document contradicted itself, and **the half a reader speaks from is the script.** Corrected (D-387).
⛔ **Never leave a superseded number in the sentence someone reads aloud** — strike it or restate it."

---

## ⚠️ Do not send this alone

This is new billable work, and **we are already ~52 hours over a firm 48-hour cap with no change
order raised** — ~100 spent against 48 (`HOURS-LEDGER.md`, and this said *"~26"* until 23 Aug, from
before the ~21 h dashboard was counted). The contract says overruns are quoted **before** the hours are
used. Quoting CR-013 while saying nothing about the overrun invites the obvious question later:
*"you charged me for this but not for that?"* — and the honest answer, that we absorbed ~16 hours of
Phase 2/3 for free, sounds like a bargaining position if it arrives second.

**Both go in the same conversation, in this order:** where the hours actually stand → what was
absorbed and why → then CR-013 as ordinary new work priced normally.
