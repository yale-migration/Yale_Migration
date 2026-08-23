# 📊 WHERE THE PROJECT IS — in plain words

**For Sharjeel to read before the meeting.** No jargon, no module numbers you have to remember.
Updated **22 Aug 2026**.

> If you only remember one thing: **the building is almost finished. It is switched off, on purpose,
> and it is waiting on four things from Robinder.**

---

## 1 · The one paragraph you can say out loud

> *"We have built nine parts of the system and tested every one of them. Two are running every day
> right now. The rest are finished but switched off, because switching them on before your side is
> ready would do real damage — it would email your clients. Your team has now cleared almost
> everything we were waiting on them for. What's left is four things only you can give us."*

That is the whole status. Everything below is detail in case he asks.

---

## 2 · What the system does, in the order a client moves through it

Read this like a conveyor belt. Each box is one job.

| | What it does | State |
|---|---|---|
| **Enquiry comes in** | Someone messages on Facebook, Instagram or WhatsApp and it lands in the enquiry list by itself | 🔴 **Not built** — needs Meta + WhatsApp access |
| **Phone call comes in** | Staff type the caller's number and the client's file appears on screen while they're still talking | 🟡 **Half built** — the sheet is live and tested |
| **Chasing new leads** | If a lead is not followed up in 7 days, then 30, the system flags it | ✅ **Running daily** |
| **A client signs up** | A folder is created for them in OneDrive, in the right place, automatically | ✅ **Built and proven, switched off** |
| **Sending their document list** | The right checklist is picked for their visa type and filed into their folder, and an email is prepared | ✅ **Built and proven, switched off** |
| **Chasing quiet files** | Any open file with no contact is flagged, and a chase email is prepared | ✅ **Running daily** |
| **Department emails** | Incoming mail from Immigration is read, and Section 56 deadlines are logged with their due date | ✅ **Built and proven, switched off** |
| **The dashboard** | Robinder sees every branch, a manager sees only theirs, a client sees only their own file | ✅ **Built, demo-ready** |

🔑 **The pattern to explain:** *"Built" and "running" are not the same thing.* Nine things are built.
Two are running. That gap is deliberate — see section 4.

---

## 3 · The simple numbers

| | |
|---|---|
| Parts built and tested | **9** |
| Parts running today | **2** ⚠️ *see below before saying this out loud* |
| Work left on the contract | **about 10 and a half hours** |
| Of that, waiting on Robinder | **about 5 and a half hours** |
| Of that, waiting on his team | **2 hours** — asked this morning |
| Waiting on us | **nothing** |

⛔ **Do not say a percentage in the meeting.** If you say "68% built" the next question is *"so
what's the other 32%?"* — and the true answer is *"nothing, it's waiting on you"*, which sounds like
you're blaming him. **Say hours, and say four things.**

---

## 3b · ⚠️ HOLD ON "TWO ARE RUNNING DAILY" UNTIL ONE EMAIL IS OPENED

Google has been sending **"Summary of failures for Google Apps Script"** to `project1@` on **12 Aug,
14 Aug and again today**. Nobody has opened one. The two daily jobs are exactly the two things we
call "running", so until we know what failed, **do not tell Robinder they are running every day.**

Say instead: *"Two jobs are scheduled daily and I'm checking their run history before I call them
live."* That is true, it is careful, and it costs nothing. Claiming it and being wrong is the kind of
thing a client disproves by asking one staff member whether anything has happened.

---

## 4 · Why nearly everything is switched off — have this answer ready

He will ask *"so why isn't it running?"* This is the answer, and it makes us look careful, not slow:

> *"Because the moment we switch it on, it starts creating folders in your real OneDrive and
> preparing emails to your real clients. If one detail is wrong, that mistake goes out under your
> name and your registration number. So it stays off until your data is in and you have given me a
> date."*

**Three concrete examples you can give if he pushes:**
- There are still **14 test clients with fake names** in the sheet. If we switched on today, the
  system would create folders for people who don't exist and prepare emails to fake addresses —
  and it would report all of it as a success.
- Two clients are recorded with a visa type the sheet doesn't recognise. They'd be **rejected on
  import** with no explanation.
- **Staff keep changing and the consultant list is fixed in code.** Mershe left, Gopi joined on the 18th and left on the 22nd. Every change needs us to edit something — which means it is always slightly out of date.

None of these are hard to fix. All of them are invisible until you look — which is why we look.

---

## 5 · What we need from Robinder — the four things

Say these as *"the last four steps"*, not as a list of complaints.

**1. Meta — Facebook and Instagram access.** *(unlocks 3 hours)*
Their own process says enquiries come from Facebook and Instagram ads. Right now nobody is watching
them automatically — and during discovery we found **2 out of 3 paid-ad enquiries were never
answered at all.** Five minutes of clicking, done live on the call.

**2. WhatsApp Business — what is the verification status?** *(unlocks 1 hour)*
⚠️ **This is the slow one and it should have started a month ago.** Meta has to verify the business
first, and only then can the WhatsApp name be approved. That part takes days to weeks and nothing
we do can speed it up. **Ask about this even if you run out of time for everything else.**

**3. OneDrive on a Yale account.** *(unlocks 1 hour, and removes a real risk)*
Right now the folder automation runs through **our personal Microsoft login.** That has to change
before handover no matter what. If we disappeared tomorrow, their folder creation stops.

**4. A paid Make plan — one more scenario slot.** *(unlocks half an hour)*
The free plan allows two automations running at once. Folder creation and document filing already
use both. So the email-reading part is built, tested, proven on a real Department email — and
**cannot be switched on at all** until there's a third slot.

**And three quick ones that cost no time but block go-live:**
- **The current staff list** — ⚠️ Gopi has now left, so don't ask for her details. RJ says there's another update and asked if Robinder had told us
- **Row 28** — one client's name is spelled two different ways; it becomes their folder name
- **A go-live date** — everything is built and waiting for him to name a day

---

## 6 · What his team did — say this, it's a genuine compliment

RJ cleared almost everything in two days:

- ✅ **Confirmed the document checklists are current.** This was the big one. It had been waiting
  since 21 July, and it was the one thing deciding whether the document-filing engine could run.
- ✅ **Sent their enquiry form**, so we build to their questions instead of inventing our own
- ✅ **Sent the 186 checklist**, and offered to write the 600 and Citizenship ones too
- ✅ **Named three clients** for end-to-end testing
- ✅ Confirmed there is no website form and no walk-in sheet — so that's work we now never have to do
- ✅ Confirmed the two clients who have left, and agreed the plan for new clients
- 🟡 Promised the **600 and Citizenship checklists** and the **client phone numbers** in the next few days

**One thing he raised himself that matters** — see section 5b.

> *"Sir, aap ki team ne aaj bohot achha kaam kiya. Sab jawab de diye."*

---

## 5b · The one thing to raise with Robinder that isn't an ask

RJ told us, unprompted, when we asked why the client phone numbers were blank:

> *"I think I am the only one who has a sheet containing the client's email and contact number."*

**In plain terms: Yale's own client contact details may exist only on one consultant's personal
spreadsheet.** If he left tomorrow, the business could not phone or email those clients.

⛔ **This is not a complaint about RJ and must never sound like one.** He raised it himself, honestly,
when he could easily have just said "I'll get them". There is no central place to put a phone number
because nobody has built one yet.

**How to say it, then stop talking:**
> *"Sir, ek cheez aaj samne aayi. RJ ne bataya ke clients ke email aur phone numbers shayad sirf unki
> apni sheet mein hain. Ye unki ghalti nahi — unke paas aur koi jagah thi hi nahi. Lekin matlab ye
> hai ke agar koi consultant chala jaye, to us ke clients ke contact details bhi saath chale jayenge."*

🔑 This is the best argument you will ever have for the central database and the dashboard — because
it isn't a feature request, it's a business risk, and it came from his own team.
⛔ **Still no price on the call.**

---

## 7 · The dashboard — separate conversation, handle carefully

It is **built and ready to show**, with the role-based access working: Robinder sees all branches, a
manager sees only their own, a client sees only their own file. Tested and proven **22 out of 22**
against the real database.

**Three things you must have straight:**
- ⛔ **It is not deployed.** The link is one self-contained page with **invented people** in it. Real
  software, no live address yet.
- ⛔ **Never quote a price on the call.** *"Main aap ko likh kar bhejta hoon."*
- ⚠️ **Do not click "Continue with Google"** in the demo — that sign-in method isn't switched on yet.

▶ Full screen-by-screen script: **`DASHBOARD-DEMO-WALKTHROUGH.md`**

---

## 8 · Two rules for the meeting

**1 · When he asks for something new, the answer is always the same.**
> *"Bilkul, main likh leta hoon — Phase 2 ki list mein daal deta hoon."*

Write it down, don't agree to it, don't price it. We have already given away a lot of unpaid extra
work; that stops now.

**2 · Do not give a go-live date yourself.**
> *"Jis din ye chaar cheezein mil jayein, us ke baad do hafte. Tareekh aap den, main us se ulta chal
> kar plan bana dunga."*

He gives the date, we work backwards. A date we invent becomes a promise we never agreed to.

---

## 9 · If you only get five minutes

1. **The build is nearly done — nine parts built, two running.**
2. **Your team cleared everything today. Nothing is stuck on them.**
3. **Four things are left, and all four are yours: Meta, WhatsApp, OneDrive, the Make plan.**
4. **WhatsApp is the slow one — please start it today even if we do nothing else.**
5. **Give me a go-live date and I'll work backwards from it.**
