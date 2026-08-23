# M8 — LEAD FOLLOW-UP EMAIL TEMPLATES
**For Robinder's approval as the Registered Migration Agent (MARN 1573959).**
Drafted 23 Aug 2026 · closes **A-43 / I-15** · cadence taken from **SOP-CI-001 step 10D**

---

## Why this document exists

RJ, 21 Aug, asked whether Yale had follow-up templates:

> *"it doesn't exist but that is what we need to do and we need to have."*

**They have never had them.** This is not a file we were missing — it is a thing that does not exist.
So we have drafted it, in the same voice as the checklist and chase emails we already author for the
system, for the RMA to approve or edit.

🔴 **Right now `M8` writes a `Follow-up Due` date into column J and one line into Notes. That is all
it writes.** A consultant opens the sheet, sees that a lead is due today, and has **no wording** —
which is exactly the manual work the module was supposed to remove. These two templates close that gap.

⛔ **SMS is NOT included and cannot be.** Sending a text needs a paid SMS provider that is in no plan,
no quote and no connection on this project. Logged as **CR-015**, quoted separately if he wants it.

---

## The cadence — their own SOP, not our invention

> **SOP-CI-001 10D:** *"Follow up within 7 days and again after 30 days unless the client requests no
> further contact."*

That is **two emails and then stop.** The code already enforces it exactly — `M8_DAY1 = 7`,
`M8_DAY2 = 30` — so these templates and the automation cannot drift apart.

| | When | What it is |
|---|---|---|
| **Email 1** | day **7** after the enquiry | a genuine second attempt, assumes nothing went wrong |
| **Email 2** | day **30** | the last contact. It says so, warmly, and leaves the door open |

### 🔴 When NOT to send — both are already enforced in code

1. **The lead has replied.** 🔴 **This one needs a human, and Robinder should know that.** The system
   **cannot see replies yet** — reading the inbox is the email module and WhatsApp/Facebook are the
   enquiry module, and both are still waiting on access. So the rule is: **the moment a consultant
   logs the reply in `Last Contact` (column L), the chasing stops.** If nobody logs it, the day-30
   email will go to somebody who already answered. When the other two modules go live they write that
   same column and this becomes automatic with no change to anything here.
2. **Status is `Not Proceeding`, `Lost Lead` or `Converted`.** These three end the sequence — and
   `Not Proceeding` is exactly how *"the client requests no further contact"* is recorded.

---

## ⛔ THE FOUR RULES BAKED INTO THIS WORDING — please do not edit them out

🔴 **One line was drafted and then removed, and it is worth knowing why.** Email 1 originally ended
*"There is no obligation and no cost for the first conversation."* It reads warm and it is the kind
of thing agencies say — but **we have no evidence Yale offers a free first consultation.** We would
have been inventing a commercial term for their business and putting it in writing to their leads.
It also broke rule 2 below, inside the very document that states rule 2. **If Yale DOES offer a free
first consultation, Robinder should say so and we will put the line back** — it is a good line, once
it is true.

These are not style preferences. Each one is a way this could go wrong for Yale.

1. **No migration advice.** Nothing here says which visa anyone should apply for, whether they are
   eligible, or what their chances are. Only the RMA advises. The emails ask a question and offer a
   conversation — nothing more.
2. **No fees, no prices, no "from $X".** A number in a follow-up email becomes a quote in the reader's
   mind.
3. **No timeframes we cannot keep.** No *"we will call you within 24 hours"*, no *"processing takes
   6 months"*. An SLA nobody is measuring is a broken promise waiting to happen.
4. **No guarantees, no urgency pressure.** No *"places are filling"*, no *"apply before the change"*.
   The reader is often anxious about their status already.

---

## 📧 EMAIL 1 — day 7

**Subject:** `Following up on your enquiry — Yale Migration`

```
Hi {{Name}},

Thank you for getting in touch with Yale Migration last week about {{Visa Interest}}.

I wanted to make sure your enquiry reached us properly and did not get lost — we know
how easily that happens.

If you would still like to talk it through, just reply to this email and let us know a
time that suits you, or give us a call on the number below.

If your plans have changed, that is completely fine — a one-line reply telling us so
means we will not keep following up.

Kind regards,

{{Assigned To}}
Yale Migration and Education Consultants
```

### Merge fields — all from the `ENQUIRIES` tab, nothing invented

| Field | Column | ⚠️ If it is blank |
|---|---|---|
| `{{Name}}` | **B** Name | use `Hi there,` — never guess a name |
| `{{Visa Interest}}` | **F** Visa Interest | replace the phrase *"about {{Visa Interest}}"* with *"about your visa options"* |
| `{{Assigned To}}` | **H** Assigned To | use `The Yale Migration team` — never a random consultant |

🔴 **`{{Visa Interest}}` is inserted VERBATIM, in the client's own words.** If they wrote
*"Graduate Visa"*, the email says *"Graduate Visa"* — **not "subclass 485"**. Translating their
description into a subclass number is a judgement about which visa applies to them, and that is
migration advice. Their words are always safe; our translation is not.

---

## 📧 EMAIL 2 — day 30, and this one is the last

**Subject:** `Still here if you need us — Yale Migration`

```
Hi {{Name}},

It has been about a month since you contacted Yale Migration about {{Visa Interest}},
and we have not heard back — so this is just a short note to close the loop.

We will not keep emailing you after this one.

If your situation has changed, or you are ready to talk now, simply reply to this email
or call us. Your enquiry stays on file, so you will not have to start from the beginning.

And if the timing is simply not right, we completely understand — we wish you the very
best with it.

Kind regards,

{{Assigned To}}
Yale Migration and Education Consultants
```

🔑 **Why it announces that it is the last one.** Their SOP stops at 30 days, so the client is about to
stop hearing from Yale either way. Saying so turns silence into a courtesy instead of a firm that lost
interest — and it is the line most likely to earn a reply, because it removes any pressure to answer.

---

## ✅ What we need back from Robinder

One of three answers, on the call or in writing:

1. **"Theek hai, bhej do"** — approved as written, and they go into the system as drafts.
2. **Edits** — mark up the wording; the RMA's words always win over ours.
3. **A phone-script version too** — if consultants would rather call than email at day 7, say so and
   we will draft that instead. It is the same two touch points either way.

⛔ **Nothing is sent to any client until he approves.** As with every other email on this project,
these are **drafts for a human to review and send** — the system never emails a client by itself.

---

## How these get delivered — decide AFTER the wording is approved

Do not build either of these before the words are signed off; building first is how we would end up
implementing wording that changes.

| | Option | Cost | Note |
|---|---|---|---|
| **A** | The consultant copies the text from a `TEMPLATES` tab in the sheet | ~0.5 h | Simplest. Consultant stays in control, sends from their own mailbox |
| **B** | The system creates a **Gmail draft** at day 7 / day 30, exactly as M4 does for checklists | ~1 h | Consistent with everything else we have built. Still a human clicks send |

**Recommendation: B**, because it matches the pattern the rest of the system already uses and the
consultant never has to leave their inbox. But **A is enough to make the module useful**, and A can
ship on go-live day.

---

## Sources
- `SOP-CI-001` step 10D — the 7/30 cadence, their document
- `scripts/m8_lead_followup.gs` — `M8_DAY1`, `M8_DAY2`, `M8_CLOSED`, stop-on-reply
- `scripts/setup_master_sheet.gs` — `ENQUIRY_HEADERS`, the merge fields
- `docs/M6-AUTOREPLY-SPEC.md` — the approved voice these were written to match
- RJ's reply, 21 Aug 2026 — *"it doesn't exist but that is what we need to do"*
