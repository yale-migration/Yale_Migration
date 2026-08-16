# TEMPLATE — data questions for the Yale team
**This is the template. It contains no client names.**
Generate the sendable copy with `python3 scripts/build_client_questions.py`.

**Audience:** the team who maintain the spreadsheets — same thread as the last data message.
**Not Robinder.** Everything here is *"look at your sheet and tell me"*.

**Covers:** A-25 · A-20 · A-17 · A-16 + A-13 (merged) · the fee-sheet lookups moved off Robinder.
**Ships with:** `Yale-client-list-to-complete.csv` — the 40 names with blank columns. Give them the
form, not the homework. This is the first project with this client; make it easy to say yes.

---

## Yale Migration — a few gaps in the data
**From:** Sharjeel · **Date:** {{DATE}}

Quick update first, then the questions.

**Where the build is up to.** The client folder automation is built and tested — it creates the full
folder set for a new client, picks the right checklist for their visa type and files it in the right
place. The dormancy check has been running daily since 10 August. The dashboard is built and tested.
Nothing is switched on against your live clients yet; that happens only when Robinder says so.

**What I need from you.** I went through every tab of the four files you sent so that I would not have
to ask you general questions. These are narrow ones. Most are a single word.

📎 **Attached: `Yale-client-list-to-complete.csv`** — your {{N_ACTIVE}} current clients, already typed out,
with four blank columns. Filling that in answers questions 1 to 4 in one go. Open it in Excel or
Google Sheets, fill what you know, leave the rest blank, send it back. **Blank is a fine answer** —
I would rather have 20 rows right than 40 rows guessed.

---

### Part 1 — the {{N_ACTIVE}} clients in `LODGEMENT JULY TO PRESENT`

**1. Email addresses.**
Across the four files there are about **{{N_EMAILS_TOTAL}} email addresses** recorded against client names — but
**not one of them belongs to the {{N_ACTIVE}} clients on the current lodgement list.** The ones I found are
older matters, JRP candidates and the education side. Is there anywhere else these {{N_ACTIVE}} would have an
email — Outlook, a different sheet, or only in the email threads?
*Why it matters: without an email the system cannot send a client their checklist or chase a missing
document. That is half of what it does.*

**2. Which team handles each one — Filipino or Indian.**
The system files each client's folder under **Brisbane – Filipino Team** or **Brisbane – Indian Team**.
There is no team column in any sheet, so I cannot work it out. From the consultants I can see
**{{TEAM_EVIDENCE}}** against a few of them, which suggests it is **mixed** rather than one team.
Just `F` or `I` in the attached sheet is enough.

**3. Is anyone on the list Townsville rather than Brisbane?**
If any belong to Cristelle's office, mark them `TSV`.

**4. {{N_PARTIAL}} of them are recorded with a first name only.**
{{PARTIAL_NAMES}}
Could I get surnames? I have held these back rather than create a client folder with half a name on it.

**5. There is a row called `SAMPLE`.**
Looks like a test row someone left in the sheet. I am leaving it out — just confirm that is right.

---

### Part 2 — one sharing change

**6. Please re-share these two files with `project1@yalemigration.com.au` — Viewer is enough:**

| File |
|---|
| `YALE BRISBANE OFFICE WORK` |
| `REYWARD JAKE M GAMOL-2026` |

They are currently shared with **`sharry00010@gmail.com`**, which is my personal Google account. The
automation does not run as me — it runs as **`project1@yalemigration.com.au`**, the account you set up
for it. Until that account can see the files, the dashboard is reading a copy from last week instead
of your live data.

*Open the file → Share → type `project1@yalemigration.com.au` → Viewer → Send.*

---

### Part 3 — which list should the system treat as current?

**7. Two lists overlap:**

| File | Tab | Client rows |
|---|---|---|
| `YALE BRISBANE OFFICE WORK` | `LODGEMENT JULY TO PRESENT` | 42 rows *(= {{N_ACTIVE}} people, after one duplicate and the `SAMPLE` row)* |
| `REYWARD JAKE M GAMOL-2026` | monthly tabs, `JANUARY` → `NOVEMBER` | {{N_REY_ROWS}} rows *(= about {{N_REY_PEOPLE}} people — a lot of names repeat month to month)* |

Someone who came in during August is probably in both. Which should the system treat as the live
client list — or are both live, with one being history?

---

### Part 4 — the staff list

I already have the roster you sent on **26 July**, so I am not asking for it again. Four gaps:

**8. Who is a manager?**
The roster gives team and visa line but not role. In the dashboard a manager sees their whole branch
and a consultant sees only their own clients — so I need to know which names are managers.

**9. Two addresses on the roster have no name against them.**
`Bne.skilled@yalemigration.com.au` and `migrate@yalemigration.com.au` — whose are these, and are they
still in use?

**10. Mershe Ventura.**
Mershe replied to our tracker questions on 11 August but is not on the roster. What is Mershe's email
address and team?

**11. Anyone joined or left since 26 July?**
*(I have Nisha down as no longer with you — still correct?)*

---

### Part 5 — two quick checks in your own fee sheet

Not urgent, but I want the system using your correct figures rather than mine.

**12. Student 500 government charge.**
`FEES AND INVOICE REFERENCE` lists it as **$2,500**. The quote page inside your own 500 dependent
checklist uses **$2,000**. Which is current?

**13. The 407 row looks like a column slip.**
The fee sheet has **$430** under *Professional Fee*, but your 407 checklist shows $430 as the
**government visa charge** and $2,200 as the professional fee. Worth a look.

---

**That is everything — there is nothing else I need from you to finish this.**
Questions **1, 2 and 6** unblock the most; the rest can follow whenever you get to them.

If it is quicker to talk any of it through, I am happy to jump on a call at whatever time suits.

Thanks,
Sharjeel
