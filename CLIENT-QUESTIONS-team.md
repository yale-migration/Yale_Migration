# TEMPLATE — data questions for the Yale team
**This is the template. It contains no client names.**
Generate the sendable copy with `python3 scripts/build_client_questions.py`, which fills the
placeholders from `../client-data/` and writes outside the repo.

**Audience:** the team who maintain the spreadsheets (whoever received the last data message —
keep it in the same thread). **Not Robinder.** Everything here is *"look at your sheet and tell me"*.
Decisions go to Robinder in `CLIENT-QUESTIONS-robinder.md`.

**Covers:** A-25 (sent, this is the follow-up) · A-20 · A-17 · A-16 + A-13 (merged — both asked
about Mershe; asking twice is how you get two answers).

---

## Yale Migration — data questions
**From:** Sharjeel · **Date:** {{DATE}}
**Why:** the automation is built and tested. These are the gaps that stop it running on your real
clients. Most are one-line answers.

---

### Part 1 — the {{N_ACTIVE}} clients in `LODGEMENT JULY TO PRESENT`

I went through all {{N_TABS}} tabs of the files you sent, so these are narrow questions, not general ones.

**1. Email addresses.**
Across the four files there are about **{{N_EMAILS_TOTAL}} email addresses** recorded against client names — but
**not one of them belongs to the {{N_ACTIVE}} clients on the current lodgement list.** They are older matters,
JRP candidates and the education side. Is there anywhere else the {{N_ACTIVE}} would have an email?
*(Without an email the system cannot send a client their checklist or a document reminder. It is
half of what the system does.)*

**2. Which team handles each one.**
The system files every client folder under **Brisbane – Filipino Team** or **Brisbane – Indian Team**.
There is no team column in any sheet, so I cannot tell. From the names I can see **{{TEAM_EVIDENCE}}**
against some of them, which looks **mixed** rather than one team. **Is that right?**
The most useful answer is a team letter next to each of the {{N_ACTIVE}} names — `F` or `I`.

**3. Are any of them Townsville?**
Same question for office. If any belong to Cristelle's Townsville office, please mark them.

**4. {{N_PARTIAL}} of them have a first name only.**
{{PARTIAL_NAMES}}
Could I get surnames? I have held these back rather than create folders with half a name.

**5. There is a row called `SAMPLE`.**
Looks like a test row left in the sheet. I am leaving it out — please confirm that is right.

---

### Part 2 — access

**6. Please re-share both Google Sheets with `project1@yalemigration.com.au` (Viewer is enough).**
They were shared with **`sharry00010@gmail.com`** — my personal Google account. The automation does
not run as me, it runs as **`project1@yalemigration.com.au`**. Until that account can see them, the
dashboard is reading a snapshot from last week instead of live data.
*One click: open the sheet → Share → add `project1@yalemigration.com.au` → Viewer.*

---

### Part 3 — which list is the real one

**7. Two lists overlap and I need to know which one is authoritative:**

| Sheet | Tab | Rows |
|---|---|---|
| `YALE BRISBANE OFFICE WORK` | `LODGEMENT JULY TO PRESENT` | {{N_ACTIVE}} |
| `REYWARD JAKE M GAMOL-2026` | monthly tabs, `JANUARY` → `NOVEMBER` | ~403 |

A client who came in during August is likely in both. Which one should the system treat as the
current client list — or is it both, with one being history?

---

### Part 4 — the staff list

I already have the team roster you sent on **26 July**, so I am not asking for it again. Four gaps:

**8. Who is a manager?**
The roster shows team and visa line, never role. Managers see their whole branch; consultants see
only their own clients. I need to know which names are managers.

**9. Two addresses on the roster have no name against them:**
`Bne.skilled@yalemigration.com.au` and `migrate@yalemigration.com.au` — who are these, and are they
still in use?

**10. Mershe Ventura.**
Mershe answered our tracker questions on 11 August but is not on the roster. What is Mershe's email
address, and which team?

**11. Is the roster still current?**
Anyone joined or left since 26 July? *(I have `Nisha` marked as a former employee — still correct?)*

---

**That is everything.** Questions 1, 2 and 6 are the ones that unblock the most; the rest can follow.

Thanks,
Sharjeel
