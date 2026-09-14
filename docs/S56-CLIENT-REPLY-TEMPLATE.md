# The s56 client reply — drafted from Robinder's own words

**Status: awaiting the RMA's 👍.** This closes **I-22**, which has been open since July.

🔑 **We are not asking him to write anything.** On 14 Sep he sent a real s56 reply to a client. This
template is *his* structure, his order, his phrasing — turned into something the system can fill in.
The ask is therefore **"is this right?"**, not "please write one", and that is the difference
between a reply today and a reply next week.

⛔ **The system NEVER sends this.** It creates a Gmail **draft** and stops. The Make connection was
deliberately requested without any send permission (D-469, D-476), so this is enforced by the token,
not by our discipline.

---

## What he actually sent, 14 Sep 2026

> Hi John
>
> Your 482 application has opened the case officer has requested:
>
> 1. Australian Federal Police (AFP) National Police Certificate
> 2. Police clearance certificates Philippines NBI and United States -FBI
>    Evidence of work experience
>    I) Experience letter
>    ii) payslips
>    iii) tax return
>
> We need to submit these documents before 10 October 2026. thank you
>
> — Kind Regards, Robinder Singh, Director, MARN 1573959

---

## The template

Everything in `{braces}` is filled automatically. Everything else is his wording, tidied only where
the original had a typo.

```
Subject: Your {subclass} application — documents requested by the Department

Hi {client_first_name}

Your {subclass} application has been opened and the case officer has requested
the following:

{numbered_requirement_list}

We need to submit these documents before {legal_deadline}. Thank you.

Kind Regards

{consultant_name}
{consultant_title}
Yale Migration and Education Consultants
MARN 1573959
```

### Where each field comes from

| Field | Source | Notes |
|---|---|---|
| `client_first_name` | MASTER, matched on Client Code | Never guessed from the email address |
| `subclass` | the s56 letter's own "Application summary" | Not from our sheet — the letter is authoritative |
| `numbered_requirement_list` | the **Request Checklist** attachment | ⚠️ The second PDF, not the letter (D-479) |
| `legal_deadline` | `letter_date + days_allowed` | Fixed 14 Sep — was a day late (D-477) |
| `consultant_name` / `title` | STAFF sheet, via the client's assigned consultant | Falls back to Robinder if unassigned |

---

## 🔴 One question only he can answer

**Which date does the client get told — the legal deadline, or our internal one?**

The system tracks two:

| | |
|---|---|
| **Legal deadline** | what the Department wrote. 10 October in this example |
| **Internal deadline** | **legal − 2 days** (D-58) — the date the team works to, so a late document still lands in time |

His own email used the **legal** date. **Two defensible answers, and it is his call, not ours:**

- **Legal date** — matches what he already does, and it is the truth. Risk: a client submitting on the
  last day leaves no room for a rejected scan or a slow upload.
- **Internal date** — builds in a safety margin. Risk: telling a client a deadline that is not the
  legal one, in writing, under an RMA's name.

**Recommend the legal date**, because it is what he already sends and because a written date that
differs from the Department's is a defensible-practice question we should not answer for him.

⚠️ **Do not choose silently.** Whichever he picks, the template says the same date to every client
from then on.

---

## Two things the draft deliberately does not do

**It does not give advice.** The requirement list is copied from the Department's checklist, not
summarised or interpreted. Nothing is added about how to obtain a document — the checklist's own
"Request detail" pages already explain that, and paraphrasing them would be advice.

**It does not chase.** If the client does not reply, the follow-up is a separate decision with its
own cadence, and it is not built yet. Raising it here would smuggle a second feature into an
approval.

---

## How to ask him

> Sir, for the Section 56 replies — rather than writing something new, I've taken the email you sent
> John Vic yesterday and turned it into the template, so it's your wording and not mine.
>
> Two things:
>
> 1. Have a quick look and tell me if anything should change.
> 2. One question: should the client be told the **legal deadline** (like your email said — 10
>    October), or the internal one we work to, which is two days earlier?
>
> The system only prepares the draft — it never sends anything to a client. You or the consultant
> reads it and presses send.
