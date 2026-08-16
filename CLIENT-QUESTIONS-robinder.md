# TEMPLATE — for Robinder
**Audience: Robinder only.** Data lookups go to the team in `CLIENT-QUESTIONS-team.md`.

## 🔴 Rules — do not ignore them
- **Four items. That is the cap.** Ask twenty and he answers two (`VOICE-MESSAGE-robinder.md`).
- **Send AFTER the team document.** Two documents the same day compete; the team one unblocks more.
- ⛔ **NO money, cost, price, quote, fee or payment language anywhere in the sendable part.**
  This is the first project with this client and the goal is the second one. Every fee question was
  moved to the team document (they are lookups) or to the call (item 4).
- ⛔ **A-18, the plaintext credentials, IS NOT IN THIS DOCUMENT.** It goes in the item-4 call. See
  the bottom for why and the exact words.
- ✅ **Lead with what is built.** He has paid half and seen little. The progress section is not
  padding — it is the most valuable paragraph in the document.

**Covers:** A-19 · A-11 · go-live ownership · the OneDrive re-authorisation (D-315 handover risk).
**Held back:** A-12 · A-01 · A-05 · A-10 · A-26 — reasons at the bottom.

---

## Yale Migration — where the build is, and four things I need
**From:** Sharjeel · **Date:** {{DATE}}

Robinder — a short update first, then four things only you can answer.

---

## Where it is up to

**Working and tested:**

| | |
|---|---|
| **Client folders** | A new client in the sheet gets their full folder set created automatically, in the right team's directory, with the right sub-folders for their visa type |
| **Checklists** | The system picks the correct checklist for the visa — 28 of them — and files it into that client's folder. Tested, no errors |
| **Quiet-file check** | Runs every day, flags matters where nothing has moved |
| **Dashboard** | Built and tested — branch performance, where matters are stuck, who is carrying the most work, who has gone quiet, granted vs refused. Opens on a phone, updates itself, nobody maintains it |

**Deliberately switched off.** Nothing touches your live clients until you give me a date. Both
automations are sitting off, and your team's files have not been altered.

**Being built now:** the checklist email and the document-chase email, both as drafts in
`visa.lodgement@` for a human to read and send. **No email will ever go to a client automatically**
— every one waits for one of your people to press send. That is deliberate: you are the registered
agent, and advice goes out under your name, not a machine's.

---

## Four things I need from you

### 1. What should the system cover, and what stays outside it?

Going through your files I found whole pipelines nobody has mentioned:

| Pipeline | Roughly |
|---|---|
| **JRP** — Job Ready Program, 4 steps per candidate | 73 active, ~500 across four lists |
| **EOI** — across six states | ~500 |
| **Tourist visas** | ~104 |
| **ART** — tribunal reviews | ~7 |
| **LAOAG** — your Philippines files | ~78 |
| **Education / admissions** | ~3,600 records |

What we are building covers the **visa lodgement workflow** end to end. Each of the above is a
different process with its own steps, its own people and its own checklists, so none of them is
inside the current build.

**Which of these actually matter to you?**

Tell me the ones you want covered and I will come back with a proper plan for each — what it
involves, how it fits with what is already there, and how long it takes. I would rather show you now
what is in and what is out than have you find a gap later.

---

### 2. Two or three real clients I can test on

Before this touches anything live I want to run it end to end on **2–3 real matters** — folders
created, correct checklist filed, draft email produced — and show you the result before you commit
to anything.

Pick 2–3 current clients you are relaxed about me using. A mix is most useful: one 500, one 485,
one 482.

---

### 3. Who owns it day to day, and when do you want it live?

- **Who on your team owns it?** The person I train, and the person who glances at it each morning.
  It needs one named human, not "the team" — otherwise it belongs to nobody.
- **When do you want it switched on?** Give me a date and I will work backwards from it.

---

### 4. Ten minutes on a call — moving one connection onto a Yale account

The part of the system that creates client folders currently reaches your OneDrive through **my**
Microsoft login. That is just how we got it working quickly in the early weeks. It should sit on a
Yale account, not mine — so that nothing you rely on depends on me personally.

**Where it should end up:** `project1@yalemigration.com.au` — the same account the automation already
uses for the spreadsheets. One Yale account running everything, owned by you.

All it needs from you is to **give that account access to the `YALE MIGRATION - ONE SYSTEM` folder**,
the same way you shared it with me. I will do the rest of the setup.

> ⚠️ **One thing worth knowing:** please **add** the new account first and leave my access in place
> until I confirm the switch has worked. If the old access is removed before the new one is
> connected, folder creation stops that same minute. Once it is running on the Yale account I will
> tell you, and you can remove mine whenever you like.

There is also one thing about the files themselves I would rather say to you directly than put in a
document. Nothing urgent, and nothing wrong on your side.

Ten minutes, any time this week.

---

That is everything from me. Thanks Robinder.

---
---

# ⛔ NOT IN THE DOCUMENT — read before sending

## Item 4 is doing two jobs, on purpose

The OneDrive re-authorisation is real and needed (D-315: connection `9279810` is authenticated as
`sharry00010@gmail.com` and every folder operation in M3 and M4 runs through it — verified live).
It is also the **reason to get him on a call**, which is where A-18 belongs.

## A-18, the credentials — say this on the call, never write it

Their workbooks hold roughly **1,200 plaintext credentials**: ImmiAccount logins, clients' Gmail
passwords, security questions, and in `YALE COMPUTER AND PRINTER LOGS`, staff computer PINs and phone
passwords. `JRP LIST` reuses what looks like one password across ~73 candidates.

**Never in a PDF or an email.**
1. A written record that Yale was told, addressed to a **Registered Migration Agent**, is
   discoverable. If a client's ImmiAccount is ever misused, that document is exhibit one.
2. Documents circulate. This one would name the exact tabs — a map for whoever receives it.
3. In writing it reads as an accusation. On a call it reads as help. Same content, opposite outcome.

> "One thing I noticed, and I'd rather tell you than not — a few of your sheets have client portal
> passwords saved as plain text, including ImmiAccount logins, and one list looks like the same
> password reused across a lot of candidates. Those files get emailed around. I'd change those
> passwords and move them somewhere proper. Happy to show you how — it's about an hour of work."

Also raise on the same call: **`500_ADDING-DEPENDENT.pdf`** ends with a quote page dated 17/10/2025
carrying a fixed amount and Yale's bank details, and the system copies that whole file to every
500-dependent client. Ask whether that page should ship or be stripped. **Verbal, same reason.**

Follow up in writing with **the solution only** — never the inventory.

## Held back on purpose

| Ask | Why not now |
|---|---|
| **A-12 — the remaining balance** | Nothing is switched on yet. Raise it the day his real clients are running, with the system working as the evidence. This is the first project with this client and the second one is worth more than being early on the first |
| **A-26 — the two fee-sheet figures** | Moved to the team document. They are lookups in a spreadsheet, not decisions, and they do not belong in a document to the owner that is meant to read as progress |
| **A-01 — Make paid plan** | Not needed yet. `Weekdays × 3/day` fits the free tier. It becomes real at M6/M9, and by then M3 and M4 running is the argument |
| **A-05 — which CRM** | Phase 3 discovery. Asking now signals we are thinking past the MVP before the MVP is delivered |
| **A-10 — M6 wording** | M6 is not built. Approving wording for something that does not exist wastes one of the four |
