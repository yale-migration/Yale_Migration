# CR-013 — covering the four uncovered visa lines
**Draft quote for Sharjeel's approval. Not sent.** 19 Aug 2026 · for the Friday 21 Aug call.

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
| **186** ENS | 1.5 | Likely two variants — with and without dependants |
| **600** Tourist | 1.0 | Simplest of the four, single variant |
| **ART** review | 2.0 | Not a visa. Statutory deadlines, own stage set, own folder shape |
| **Citizenship** | 1.5 | Not a visa. Different document set and folder structure |
| Shared: router changes, partition proof, regression run | 2.0 | Done once, covers all four |
| | **8.0** | |

**8 hours @ USD 35 = USD 280.**

⛔ **Clock starts when the four document lists arrive**, not on acceptance. If he supplies two of
four, we do those two and the shared work — the other two stay quoted and unstarted.

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
> Aath ghante ka kaam hai — **280 dollars**. Jab aap chaaron document lists bhej dein, tab shuru."

---

## ⚠️ Do not send this alone

This is new billable work, and **we are already ~26 hours over a firm 48-hour cap with no change
order raised** (`HOURS-LEDGER.md`). The contract says overruns are quoted **before** the hours are
used. Quoting CR-013 while saying nothing about the overrun invites the obvious question later:
*"you charged me for this but not for that?"* — and the honest answer, that we absorbed ~16 hours of
Phase 2/3 for free, sounds like a bargaining position if it arrives second.

**Both go in the same conversation, in this order:** where the hours actually stand → what was
absorbed and why → then CR-013 as ordinary new work priced normally.
