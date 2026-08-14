# VOICE MESSAGE TO ROBINDER — 14 Aug 2026

He is not available for a call. This replaces `CALL-QUESTIONS-robinder.md` for now.

**Rules for a voice note that actually gets answered:**
- **Five questions maximum.** Ask twenty and he answers two.
- **Number them out loud** so he can reply *"number one…"* in his own voice note.
- **Repeat the list at the end.** He will be listening while doing something else.
- Roman Urdu speaker — plain English, short sentences, no idioms.
- **Under 2 minutes.** Two shorter notes beat one long one.

---

# 🎙 READ THIS ALOUD

> Hi Robinder, sorry we missed each other today — I'll do this as a voice note instead.
>
> First, thank you for those two files your team sent through. That answered the biggest question I had. I can see now exactly how you're tracking clients — the monthly tabs, the JRP list, all of it. That's really helpful.
>
> Quick update on progress. **The dashboard is built and tested.** It shows how each branch is performing, where matters are stuck, who's carrying the most work, which clients have gone quiet, and granted versus refused. It opens on your phone or your laptop, and it updates itself — nobody has to maintain it.
>
> Now, five quick things. If you can answer them by number in your reply, that would help me a lot.
>
> **Number one, and this is the one holding me up.** I need every staff member's email address, and which branch each one belongs to. You said managers should only see their own branch — the system does that by email address. Your tracker has the names, Priyanka, RJ, Inder, but no email addresses anywhere. Without those I can't switch the manager view on.
>
> **Number two.** In that tracker there are around four hundred and sixty clients across the monthly tabs. I can't tell which ones are still live and which are finished. Is there a list of who's currently active? Even a rough one is fine — I saw your Summary of Clients tab, is that the current one?
>
> **Number three.** There's a tab called JRP — Job Ready Program, about seventy-three clients, four steps each. I didn't know about that one. Do you want that inside the new system as well, or does that stay separate?
>
> **Number four.** Two things about going live. Who on your team owns this day to day — the person I should train, and who fixes things if something sticks? And when do you actually want it switched on?
>
> **Number five, Microsoft 365** — you asked about that. My recommendation is Business Standard, around eighteen dollars seventy per person per month plus GST. Basic is cheaper but it doesn't give you Word and Excel on the desktop, and you'll be annoyed within a week. Just tell me how many people need an account.
>
> One thing on that though. Buying the licences takes ten minutes, but moving your fourteen hundred client folders off the personal Microsoft account is a proper job — that needs planning. And I should tell you, the folder automation currently connects through my own Microsoft login, because that's how we got it working quickly. That needs to move onto your company account too. Buying Microsoft 365 is the right moment to sort both.
>
> Last thing, and it's not a question — just something you should know. In that JRP tab there's a column with client passwords saved as plain text, and it looks like the same password on nearly every row. That file gets emailed around. I'd change that password and stop keeping them in the spreadsheet. Happy to show you a safer way when you have time.
>
> So, to repeat — **staff emails and branches**, **which clients are still active**, **JRP in or out**, **who owns it and when to go live**, and **how many Microsoft accounts**.
>
> No rush, take your time. Thanks Robinder.

---

# ✂️ IF YOU WANT IT SHORTER

Cut **number five** and the Microsoft paragraph — send that as a separate note later. That leaves four
questions and about **75 seconds**, which is the sweet spot.

**Never cut number one.** Everything manager-level waits on it.

---

# 📊 WHY THESE FIVE, AND NOTHING ELSE

| # | Question | What it unblocks |
|---|---|---|
| 1 | Staff emails + branch | 🔴 **A-16 — the only real blocker.** Row-level security filters on email |
| 2 | Which clients are active | Real dashboard numbers instead of ~460 mixed live and closed |
| 3 | JRP in or out | 73 clients and a 4-step workflow we did not know existed |
| 4 | Owner + go-live date | Last two MVP pieces — training and switch-on |
| 5 | Microsoft count | He asked; answering fast builds credit, and it closes CR-003 |

## Questions deliberately dropped — the files already answered them

- ~~"Where do you record a client today?"~~ → their tracker
- ~~"Send me 8–10 real clients"~~ → we have ~460
- ~~"What are your real stages?"~~ → visible in the data
- ~~"Which consultants?"~~ → priyanka · RJ · inder
- ~~"The Google Sheet link"~~ → it was a cold-call list, closed

**Asking any of these now would show we did not read what they sent.**

## Held back on purpose

- **The final $840** — nothing is switched on yet. Raise it the day his real clients are running.
- **Any Phase 2 price** — dashboard for managers, client portal, phone monitoring. All in writing, never in a voice note.
- **s56 deadlines** — no source yet, needs M9. Do not mention them as a dashboard feature.

---

# ⏭ WHAT HAPPENS WITH HIS ANSWERS

| His answer | What I build |
|---|---|
| Staff emails | `STAFF` tab → Looker Studio with per-branch access, ~1–2 weeks |
| Active client list | Stage 1 import → **the dashboard becomes real** |
| JRP in | Extra stage set + 4-step tracking. Quote it |
| JRP out | Leave it alone, note it as excluded |
| Owner named | Training plan and handover scheduled around them |
| Go-live date | Set `Weekdays 09:00 / 13:00 / 17:00` and switch M3 + M4 on |
| Microsoft count | Plan the tenant move and re-point our OneDrive connection |

**None of this waits on him** — Stage 1 import (47 clean rows from their `SUMMARY OF CLIENTS` tab)
can start today, plus M4b and M5b. See `DASHBOARD-TRACKER.md`.
