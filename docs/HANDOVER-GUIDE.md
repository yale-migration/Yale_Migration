# Yale Migration — how the system works, and how to run it

**For Yale. Plain English. No module numbers.**

---

## What it does, in one paragraph

Your spreadsheet stays exactly as it is. The system reads it, and does the remembering: it watches
your two mailboxes for Department letters and records the deadline, it chases documents on a
schedule, it flags files that have gone quiet, it routes new enquiries to the right consultant, and
it shows the whole practice on one screen. **It does not make decisions and it never contacts a
client without a person pressing send.**

---

## The four things that run on their own

| What | When | What you see |
|---|---|---|
| **Reads the mailboxes** | every 15 min, Mon–Fri 08:00–18:00 | new Section 56 letters appear in the S56 TRACKER with the deadline worked out |
| **Chases documents** | daily, 07:00 | the chase date moves on in MASTER |
| **Spots quiet files** | daily | a file nobody has touched is flagged |
| **Follows up enquiries** | daily, 08:00 | the next follow-up date appears in ENQUIRIES |

⚠️ **Nothing sends to a client by itself.** Emails are created as **drafts**. Somebody reads them
and presses send. That is deliberate — only the Registered Migration Agent advises.

---

## The Section 56 deadline — read this one

The Department never writes "Section 56". Their letters say *"We need more information to help us
assess your application"* and give the time limit as a **sentence, not a date**:

> "You have 28 days starting on the day after we emailed this request."

**The system copies that sentence exactly, reads the number out of it, and works out the date.**
It never assumes 28 — the number varies, and the wrong number is a missed legal deadline.

**Two dates are recorded:**
- **Legal deadline** — what the Department's letter means
- **Internal deadline** — two days earlier, so a late document still arrives in time

🔑 **It also re-checks its own arithmetic** and flags any disagreement rather than silently
correcting it. If you see a flag on a due date, **open the letter** — do not trust either number.

---

## Who sees what on the dashboard

| | Sees |
|---|---|
| **Director** | every client, every branch, every consultant |
| **Branch manager** | their own branch only |
| **Client** | their own file only — never that other clients exist |

**Clients are matched by client code, not email address.** Families share email addresses, and a
typo must never open the wrong person's visa file.

---

## Things you will need to do

### Someone joins or leaves
Update the **STAFF** sheet — name, office, team, visa types, and `Receives Enquiries` Yes/No. Routing
follows it. ⛔ **Never delete a leaver's row** — existing client files carry their name.

### A new client
Add a row to **MASTER**. Leave **Client Code blank** — it is filled automatically within 5 minutes.
The folder and checklist follow from there.

### A column will not accept what you type
That is deliberate. Those columns have fixed lists because the automation reads them. Pick from the
list; if the value you need is missing, ask for it to be added rather than working around it.

---

## When something looks wrong

**First, check it is actually wrong.** Two things look like faults and are not:

- **A sync that reports "0 rows — refusing to sync an empty set"** on the S56 or ENQUIRIES tab. That
  tab really is empty, and the system is refusing to wipe the destination. Correct behaviour.
- **A blank Client Code on a new row.** Filled on the next 5-minute pass.

**Then look at the Notes column.** Anything the automation could not do writes a plain-English line
there saying what and why.

---

## What it deliberately does NOT do

- **Send anything to a client unread.** Drafts only.
- **Give migration advice.** It transcribes what a letter says so a person can act on it.
- **Edit your spreadsheet's client data.** It writes folder links, dates and notes — never a name,
  a visa type or a decision.
- **Read anything that looks like a password.** Columns whose headings contain *password*,
  *username*, *OTP*, *PIN* or *security question* are excluded from every read, import and log line.

---

## Running costs

| | |
|---|---|
| Automation platform | **USD 9/month** — already active |
| Dashboard database | **USD 25/month** once it holds real client data |
| Dashboard hosting | free |
| Sign-in email | free at this volume |

Everything sits in accounts **Yale owns**. If you stop working with us, nothing switches off.
