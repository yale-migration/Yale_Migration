# Phase 3 — the client & staff dashboard
**Draft for Sharjeel. Not sent.** 20 Aug 2026.

---

## 🔴 Read this before you read the numbers

**About 21 hours of this is already built, and nobody has agreed to pay for any of it.**

That is a different situation from the MVP overrun, and the difference matters. `HOURS-LEDGER.md`
says do not back-bill the ~26 MVP hours, and that is right: we chose to spend them, Robinder was
never asked, and billing him for a decision he was not part of would be wrong.

**This is not that.** `CHANGE-REQUESTS.md` has carried it since 19 July as CR-001, re-raised as
CR-007, CR-009, CR-010 and CR-012 — five times, in his words each time. `PHASE-2-3-BACKLOG.md`
prices it at **40–80 h**. It has always been billable work that had not been started.

⚠️ **It has now been started.** So the choice is live today, not later: quote it, or it becomes the
largest thing this engagement has given away — roughly four times the MVP overrun.

---

## What exists right now

Not a prototype. It runs, it is tested, and its access model is proven against a live database.

| | |
|---|---|
| **All seven views he named** | active matters · ongoing · chase list · granted vs refused · stuck by stage · deadlines · new enquiries |
| **Client records** | open any file: stage, documents outstanding, key dates, s56 with the letter's own words |
| **The s56 escalation ladder** | his own 7/14/21/26 rule, and it compresses correctly on a 14-day letter |
| **Branch & consultant views** | the multi-branch oversight he has asked for five times |
| **Search** | name, code, visa type, consultant — findable when someone rings |
| **Client portal** | own matter only, opens on what they owe us |
| **Access control** | Postgres RLS, **22/22 assertions passed live**, every role against every table |
| **Quality** | 91 automated tests, typecheck clean, production build green |

---

## The numbers

### Already built — 21 h

| | h |
|---|---|
| Architecture, schema, RLS policies and the policy test suite | 4 |
| The application: auth, data layer, seven views, client records, drill-downs, search | 10 |
| Sheets → Postgres sync with the credential allowlist | 2 |
| Design: canvas, brand alignment, loading and error states | 3 |
| Verification scripts and the run-order runbook | 2 |

### Remaining to production — 13 h

| | h |
|---|---|
| Sync runner + hourly schedule against the real register | 3 |
| Real data migration, and testing against it | 3 |
| Deploy to company hosting, headers, domain, hardening | 2 |
| Onboarding: profile rows for staff, then invitations for clients | 3 |
| Handover and a short walkthrough | 2 |

### 🔵 Optional, and a real decision — 12 h

**Write actions**: log contact, mark a document received, reassign a consultant.

⛔ Not an oversight. The build is one-way by design — Sheets is the system of record and the app is
a window. Making it a writer means two systems editing the same row, which is the defect shape this
project has hit repeatedly, and here it would be a client and a consultant. **Doable, worth doing,
and worth quoting separately** so the decision is made rather than absorbed.

---

## Three options

| | Scope | h | @ USD 35 |
|---|---|---|---|
| **A** | Finish and launch what exists, read-only | 21 + 13 = **34** | **USD 1,190** |
| **B** | A, plus write actions | **46** | **USD 1,610** |
| **C** | Stop now. Keep it as a working demo, launch nothing | **21** | **USD 735** |

🔑 **Recommend A.** It is a complete product on its own — every view he asked for, real access
control, a client portal — and write actions are a better second conversation once staff have used
it for a month and can say what they actually want to change from inside it.

**All three are below the 40–80 h the backlog estimated**, because the MVP data layer already
existed. That is worth saying out loud: he is getting the CRM on top of work he has already paid for.

### Running costs, his to carry

| | |
|---|---|
| Supabase Pro | **USD 25/month** — the free tier pauses after a week of inactivity, and a portal that sleeps is not a portal |
| Hosting | company Vercel team |

⚠️ Name this alongside the Make paid plan. Two subscriptions in one conversation is a budget
decision; two separate asks a fortnight apart is a pattern he will start bracing for.

---

## What to actually say

> "Aapne jo dashboard maanga tha — har branch, har role — woh ban gaya hai. Chal raha hai, main aapko
> link bhej deta hoon: aap Director ke roop mein poora practice dekhenge, client sirf apni file.
>
> Yeh MVP ka hissa nahi tha — Phase 3 hai, aur maine pehle hi kaafi kaam kar liya hai taake aap
> dekh sakein ke cheez asli hai. **Launch tak chautiees ghante, 1,190 dollars.** Plus Supabase ka
> 25 dollar mahina.
>
> Agar aap chaahein ke staff andar se cheezein badal bhi sakein — contact log karna, document tick
> karna — woh alag se baarah ghante hain. Main tajweez karunga ke pehle ek mahina chala kar dekhein."

---

## ⛔ Before this goes anywhere

- [ ] The **MVP go-live** happens first. A Phase 3 quote landing while 68% of what he has paid for
      is still switched off reads as us chasing the interesting work instead of finishing his.
- [ ] Brand hexes from his logo — the navy and gold are currently matched by eye
- [ ] The **company-owned vs client-owned** hosting question answered by someone senior
- [ ] ⚠️ **Do not put a figure on the ~26 absorbed MVP hours.** They are not part of this and
      naming them turns a clean quote into a negotiation about the past.
