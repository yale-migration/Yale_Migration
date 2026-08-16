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
with nine blank columns. **That one sheet answers questions 1 to 7.** Open it in Excel or Google
Sheets, fill in what you know, send it back.

**If you only fill three columns, make them `1 Team`, `2 Consultant` and `3 Email`** — those three
are what actually stop the system running. Everything after column 3 improves it; those three switch
it on. **Blank is a fine answer** — I would much rather have 20 rows right than 40 rows guessed.

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
Just `F` or `I` in **column 1** of the attached sheet is enough.

**3. Is anyone on the list Townsville rather than Brisbane?** *(column 8)*
If any belong to Cristelle's office, mark them `TSV` — otherwise leave it blank and I will read it as Brisbane.

**4. Who is looking after each one?** *(column 2)*
The dashboard shows how the work is spread across the team and who has clients going quiet — both of
those are grouped by consultant. Your `LODGEMENTS` tab has a `Handled By` column, but this newer list
does not, and I could only match 4 of the {{N_ACTIVE}} by name. Without it two of the dashboard views sit empty.

**5. Is there anyone else on the application?** *(column 4 — just `Y` or `N`)*
This one has real consequences. The system sends a **different checklist** to a single applicant than
to one with a partner or dependent included. If I get it wrong, the client receives the wrong document
with your name on it. I will not guess it — `Y` or `N` per row.

**6. For the 485 clients — which skills assessing authority?** *(column 5)*
`TRA`, `VETASSESS`, `ACECQA` or `MASTERS/BACHELORS`. There are **{{N_485}} 485s** on the list and I have
marked each of them in the sheet. The 485 checklist is different for each authority, so without this the
system cannot file a 485 at all — it will flag them for someone to do by hand.

**7. {{N_PARTIAL}} of them are recorded with a first name only.** *(column 9)*
{{PARTIAL_NAMES}}
Could I get surnames? I have held these back rather than create a client folder with half a name on it.

**8. There is a row called `SAMPLE`.**
Looks like a test row someone left in the sheet. I am leaving it out — just confirm that is right.

---

### Part 2 — one sharing change

**9. Please re-share these two files with `project1@yalemigration.com.au` — Viewer is enough:**

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

**10. Two lists overlap:**

| File | Tab | Client rows |
|---|---|---|
| `YALE BRISBANE OFFICE WORK` | `LODGEMENT JULY TO PRESENT` | 42 rows *(= {{N_ACTIVE}} people, after one duplicate and the `SAMPLE` row)* |
| `REYWARD JAKE M GAMOL-2026` | monthly tabs, `JANUARY` → `NOVEMBER` | {{N_REY_ROWS}} rows *(= about {{N_REY_PEOPLE}} people — a lot of names repeat month to month)* |

Someone who came in during August is probably in both. Which should the system treat as the live
client list — or are both live, with one being history?

---

### Part 4 — the staff list

I already have the roster you sent on **26 July**, so I am not asking for it again. Four gaps:

**11. Who is a manager?**
The roster gives team and visa line but not role. In the dashboard a manager sees their whole branch
and a consultant sees only their own clients — so I need to know which names are managers.

**12. Two addresses on the roster have no name against them.**
`Bne.skilled@yalemigration.com.au` and `migrate@yalemigration.com.au` — whose are these, and are they
still in use?

**13. Mershe Ventura.**
Mershe replied to our tracker questions on 11 August but is not on the roster. What is Mershe's email
address and team?

**14. Anyone joined or left since 26 July?**
*(I have Nisha down as no longer with you — still correct?)*

---

### Part 5 — two things about how you record work

**15. What do your status words actually mean?**
`LODGEMENT JULY TO PRESENT` uses **LODGED**, **PENDING**, **DRAFTED** and **WITHDRAWN**. I need to be
sure I am reading them the way you do, because every number on the dashboard is built on it. In
particular — does **PENDING** mean *"we have not lodged it yet"*, or *"lodged, waiting on the
department"*? Those are opposite ends of the process and 12 of your clients are sitting on that word.

**16. Do you have your own file or client reference number?**
The system generates its own code (`YM-2026-00001`) but if you already use a reference of your own I
will store it alongside, so your sheets and the system can always be matched up.

---

### Part 6 — who should be able to open the dashboard?

**17. Which people get access, and at what level?**
- **Consultants** see only their own clients
- **Managers** see their whole branch
- **You / Robinder** see everything

The dashboard identifies people by their **Google login**, so anyone who needs access must sign in
with their `@yalemigration.com.au` account. Just tell me the names and which of the three levels
each one gets — and flag anyone who does *not* have a Google login, because they will not be able to
open it at all.

---

### Part 7 — two quick checks in your own fee sheet

Not urgent, but I want the system using your correct figures rather than mine.

**18. Student 500 government charge — two of your files disagree with the third.**

| File | Says |
|---|---|
| `BREAKDOWN OF FEES_YALE MIGRATION` → `500 visa` | **$2,000** + 1.4% surcharge = $2,028 |
| `500_ADDING-DEPENDENT` checklist, quote page | **$2,028** — the same figure |
| `FEES AND INVOICE REFERENCE` → `VISA AND PF FEE` | **$2,500** |

Two of them agree, so I suspect `FEES AND INVOICE REFERENCE` is just out of date — but I would rather
you confirm than have me pick.

**19. The 407 row looks like a column slip.**
The fee sheet has **$430** under *Professional Fee*, but your 407 checklist shows $430 as the
**government visa charge** and $2,200 as the professional fee. Worth a look.

---

**That is everything — there is nothing else I need from you to finish this.**
**If you are short of time, do these three and nothing else:**
**columns 1, 2 and 3 of the attached sheet** (team · consultant · email), and **question 9** (the
re-share). Those three switch the system on. Everything else makes it better.

If it is quicker to talk any of it through, I am happy to jump on a call at whatever time suits.

Thanks,
Sharjeel
