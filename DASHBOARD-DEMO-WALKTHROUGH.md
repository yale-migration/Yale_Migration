# 🖥 DASHBOARD DEMO — screen by screen, in plain words

**For Sharjeel to read before the Friday 21 Aug call.** Not for Robinder. Written to be read once
and then talked from, not read out.

**The link to send him:**
🔗 **https://claude.ai/code/artifact/93a02ec7-dccc-40f2-9327-e96a3591117b**

---

## 🔴 READ THIS FIRST — what is real and what is not

Three sentences you must have straight, because he will ask and a wrong answer here is expensive.

| | Truth |
|---|---|
| **Is it deployed?** | **No.** Nothing is on a live web address that his staff could log into. |
| **What is that link, then?** | **One self-contained web page** with invented data in it. It looks and behaves like the real thing — you can click between the four roles — but it is a picture that moves, not the system. |
| **Where is the real one?** | On your laptop, and its database is live on his own Supabase account. It runs with `npm run dev:demo`. It is real software; it just has no address yet. |

### Why it is not deployed, and why that is the correct decision
Anything holding real client data has to sit on the **company Vercel team account and company
Supabase** — not a personal account, not a free host. That decision is not ours to skip. The moment
one real client row goes onto a personal deployment, we have a data problem that no feature makes up
for. So the demo runs on **invented people**, which is exactly what makes a shareable link allowed.

> **If he asks "kab live hoga?"**
> *"Software tayyar hai. Sirf ye tay karna hai ke ye kis account par chalega — aapka apna, ya hamari
> company ka. Ye do din ka kaam hai, lekin faisla pehle chahiye, is liye ke jis din asli client data
> is par aaya, us ke baad jagah badalna mushkil ho jata hai."*

### ⛔ Three things you must not do on this demo

1. ⛔ **Do not click "Continue with Google" and expect it to work.** The button is on the sign-in
   screen and it is correct, but Google has not been switched on as a provider yet. On the demo page
   it just shows an alert, which is fine — but do not promise it works today.
2. ⛔ **Do not say the data is real.** Every name on the screen is invented. The page says so at the
   top and in the footer. Say it out loud anyway, once, at the start.
3. ⛔ **Do not quote a price.** He will ask. *"Main aap ko likh kar bhejta hoon."* Nothing else.

---

## The one-sentence pitch, before you share the screen

> *"Sir, aap ne kaha tha ke branches khul rahi hain aur aap ko nazar nahi aata ke kis staff ke paas
> kya hai. Ye woh cheez hai. Aur is mein sab se bari baat ye hai ke har banda sirf wohi dekhta hai
> jo us ka hai — manager sirf apni branch, client sirf apni file."*

**That is the whole demo.** Everything below is you proving that one sentence four times.

---

# The four screens

The page has a row of buttons at the top right: **Director · Brisbane manager · Townsville manager ·
Client**. In the real system that switcher does not exist — your role comes from your login. It is
there so you can show him all four in ninety seconds instead of logging in and out.

> **Say this when you first point at the switcher**, because otherwise it undermines the whole point:
> *"Ye buttons sirf dikhane ke liye hain. Asli system mein aap sirf apna hi view dekh sakte hain —
> jo cheez viewer khud badal sake, wo control nahi hoti."*

---

## SCREEN 1 · Director — "everything, everywhere"

**Click: Director.** This is Robinder's own view. Start here.

### What he is looking at, top to bottom

**① "Needs you today"** — the strip across the top.
This is the only part of the screen that tells him what to *do*. Everything else tells him what *is*.
It only shows things that are genuinely urgent: a Section 56 deadline inside a week, a visa expiring
within 14 days, a file nobody has touched for 21 days.

> *"Subah aap ye ek patti dekh lein. Agar ye khali hai, to aaj koi cheez jal nahi rahi."*

🔑 **The strongest line in the whole demo is here.** Point at the red row that says
**"Section 56 with NO deadline recorded"**:

> *"Ye sab se important cheez hai. Ye wo file hai jis par Department ne deadline di hai, lekin kisi
> ne date likhi hi nahi. Purane system mein aisi file kabhi nazar nahi aati — kyunki jo cheez likhi
> hi nahi gayi, uska alert kaise bajega? Yahan wo laal ho kar sab se upar aa jati hai."*

That is the difference between a report and a system, and it is worth thirty seconds.

**② The four number tiles.**

| Tile | What it means | Why it is separate |
|---|---|---|
| **Active matters** | Files being worked on right now | Someone has to do something |
| **Awaiting outcome** | Lodged, sitting with the Department | **Nobody can do anything.** Waiting is not workload |
| **Section 56 live** | Legal deadlines currently running | The ones that cannot slip |
| **Going quiet** | Open files with no contact for 14+ days | The quiet failure |
| **Expiring 60 days** | Visas running out | |

> **If he asks why Active and Awaiting are split** — and he might, this is his own view 1 and view 2:
> *"Pehle ye ek hi number tha. Lekin lodged file par kaam nahi hota, sirf intezaar hota hai. Agar
> dono ek number mein hon, to aap ko lagta hai team par bees files ka bojh hai — jab ke asal mein
> bara ka hai aur aath sirf Department ke paas pade hain."*

**③ Section 56 — Department deadlines.** The full-width card.
Each row shows the internal date and the legal date. **Internal runs two days ahead of legal** — on
purpose, so a missed internal date is a warning and not yet a disaster.

> *"Section 56 ka jawab agar waqt par na jaye to Department jo uske paas hai usi par faisla kar deta
> hai — dobara nahi poochta. Is liye ye alag card hai, aur is liye hamari date do din pehle hai."*

**④ Due to chase** *(next 14 days)* and **⑤ Going quiet** *(oldest first)* — side by side.
These two look similar and they are opposites. Worth naming, because the pair is the point:

- **Going quiet** looks **backwards** — files we have *already* let go cold.
- **Due to chase** looks **forwards** — follow-ups falling due in the next fortnight, so they get done
  *before* they go cold. Anything already overdue sits at the top in red.

> *"Ek batata hai ke kya chhoot gaya. Doosra batata hai ke kya chhootne wala hai. Practice ko doosre
> wali chahiye — pehli wali to sirf afsos hai."*

**⑥ Consultant workload** and **⑦ Where matters are stuck** — the two bar charts.
Workload answers *"kaun zyada load mein hai"*. Stuck-at-stage answers *"kahan pe kaam ruk raha hai"*
— the longest bar is the bottleneck. **Unassigned shows in red** in the workload chart, deliberately:
a file with no owner is not a small problem.

⏱ **Time on this screen: 3–4 minutes.** It is the most impressive one. Do not rush it, but do not
narrate every tile either — hit ①, the Active/Awaiting split, and the ④/⑤ pair.

---

## SCREEN 2 · Brisbane manager — "the same board, but only their branch"

**Click: Brisbane manager.**

Do not explain first. **Let him notice the numbers drop.** Then say:

> *"Yehi board hai. Lekin ab sirf Brisbane. Townsville ki files gayab nahi ki gayin — wo is user ko
> di hi nahi jatin."*

**Then click Townsville manager**, and let him watch it change again.

### 🔑 The sentence that matters most in the entire demo

> *"Aur ye rok app mein nahi hai — database mein hai. Matlab agar koi programmer bhi ho, aur wo app
> ke bahar se seedha data mangwane ki koshish kare, to bhi usay doosri branch ki ek line nahi
> milegi. Ye hum ne test kiya hai — **bais mein se bais test paas**."*

**Why that line is worth memorising:** it is the exact thing a spreadsheet can never do. Google
Sheets protects a *file* or a *range* — never *this row for this person*. That limitation is the
whole reason this exists, and it is the reason a competitor's dashboard costs him AUD 3,500 plus
$600 a month. Say the number **22 out of 22**. Specific numbers sound like engineering; "it's
secure" sounds like sales.

⏱ **Time: 1 minute.** It is short and it is the strongest minute in the call.

---

## SCREEN 3 · Client — "what his client sees on their phone"

**Click: Client.** The layout changes completely, and that is the point.

A staff board is *numbers*. A client screen is **one question answered: what do you need from me?**

**① "What we still need from you"** — a yellow panel at the top, with each missing document listed
and, under it, **how to actually produce it**:
- *Bank statements — last 3 months* → *"A PDF from your online banking. Every page, including blank ones."*
- *Health insurance certificate* → *"The certificate of currency — not the tax statement."*

> *"Aap ki team ka aadha waqt yehi samjhane mein jata hai ke kaun sa kaghaz chahiye aur kis shakal
> mein. Ye us call ko khatam kar deta hai."*

**② "What happens next"** — one paragraph in plain English, and a line that says we **never quote a
decision date** because Department processing times are not ours to promise.

**③ Two buttons** — *Email my documents* and *Call Yale*. A client on a phone gets two choices, not a
menu.

**④ Their consultant, by name**, and Robinder underneath with his MARN.

### What is deliberately NOT on this screen — say this, it lands well
- **No Section 56 date.** Not hidden — *not sent to the browser at all.* There is no rule granting a
  client access to that table, so the database returns nothing.
  > *"Section 56 ki date client ko nahi dikhani chahiye. Wo ek legal cheez hai jo agent letter saath
   > le kar samjhata hai. Agar wo achanak portal par nazar aa jaye to client ya to ghabra jayega ya
   > khud kuch kar baithega."*
- **No other client's name, and no totals.** Not even a count.
- **The page title is the file code, not the name** — so a screenshot or a browser tab never leaks
  who the client is.

⏱ **Time: 2 minutes.**

---

## SCREEN 4 · The sign-in screen — "no new password for anybody"

**Scroll to the bottom, click "See the sign-in screen".**

Two ways in, and the reason for each:

| Who | How | Why |
|---|---|---|
| **Staff (~10)** | **Continue with Google** | They already have a Yale Google account. **There is no new login to create.** |
| **Clients (~150)** | A one-time link by email | They have no Google account — and that is exactly why an ordinary Google dashboard could never serve them |

> *"Aap ne kaha tha koi nayi login na bane to behtar. Staff ke liye bilkul nayi login nahi hai —
> wohi Google account. Client ke paas Google hota hi nahi, is liye unhein email par ek link jata
> hai. Password kisi ka bhi nahi banta."*

🔑 **And there is a second reason there are no passwords, which you should be ready with:**

> *"Password is liye bhi nahi rakha ke password kahin na kahin likha jata hai — aur uska anjaam hum
> dono jaante hain."*

⚠️ That is as close as you go to A-18 **in front of anyone else.** The credentials conversation is
one-to-one and verbal only — § ⑤ of the call runbook.

⏱ **Time: 1 minute.**

---

# Questions he will ask, and the answer

| He asks | You say |
|---|---|
| *"Ye abhi chal raha hai?"* | *"Software chal raha hai, live address par nahi hai. Pehle ye tay karna hai ke kis account par jayega."* ⛔ Never let "built" sound like "live". |
| *"Ye data asli hai?"* | *"Nahi, sab naam banaye hue hain. Asli data tab aayega jab aap ki files import hongi."* |
| *"Kitne ka hai?"* | *"Main likh kar bhejta hoon."* **Nothing else. No range, no hint.** (`QUOTE-P3-DASHBOARD.md` — option A, 34 h) |
| *"Mera staff kal se use kar sakta hai?"* | *"Do din ka kaam hai host karna, lekin uska faisla — aap ka account ya hamari company ka — pehle chahiye."* |
| *"Client ko kaise pata chalega?"* | *"Unhein email par link jata hai. Koi app install nahi karni, koi password nahi banana."* |
| *"Mobile par chalta hai?"* | *"Ji. Phone par test kiya hua hai."* — true: 82 automated tests, run at phone width as well as laptop. |
| *"Kya main ismein file edit kar sakta hoon?"* | *"Abhi nahi — abhi ye sirf dikhata hai. Likhna sheet mein hi hota hai. Edit karna alag kaam hai."* 🔑 Log it as a change request; **do not agree to it on the call.** |
| *"Sheet ka kya hoga?"* | *"Sheet hi asli record rahegi. Ye us ke upar ki khirki hai."* |

---

# ⛔ The two traps on this call

**1 · "Isme ye bhi add kar dein."** He will say it — he always does, and it is usually a good idea.
The answer is the same every time:

> *"Bilkul likh leta hoon, Phase 2 ki list mein daal deta hoon."*

Then log it in `CHANGE-REQUESTS.md` and `PHASE-2-3-BACKLOG.md`. **Never absorb it.** ~16 hours have
already gone that way, and ~21 more went into this dashboard, which was never quoted at all.

**2 · Letting the demo eat the setup items.** The three access items in the runbook (§①②③) have
**days of lead time** — Meta verification alone can take a week. The demo has none. If the call is
running short, **cut the demo, not the access.** You can send him the link afterwards; you cannot
send him a Meta approval.

---

# After the call

Tell me: what he said about hosting, anything he asked for that is not built, and whether he gave a
date. I will update `DASHBOARD-TRACKER.md`, log any change requests, and send you the quote to
forward.
