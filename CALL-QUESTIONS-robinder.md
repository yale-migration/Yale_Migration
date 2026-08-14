# QUESTIONS FOR ROBINDER — call 14 Aug

Read them out as written. The *(why)* line is for you, don't say it.

---

# ⚠️ BEFORE THE CALL — 5 minutes, do this or the demo can fail

**1. Can Robinder actually OPEN the MASTER sheet?**
It lives on `project1@`. If he has never opened it, he will hit a permission wall live on the call.
**Check now** — send him the link and ask him to confirm it opens. If not, share it to his email first.

**2. Remove the demo rows** — `removeDemoRows()`.
Real client names and fake ones must never appear in the same screenshot.

**3. Re-run `buildDashboard`** with the latest script, and check the date column reads `19 Jul 2026`,
not `46216`.

---

# 1 · THE BIG ONE — ask this first

### ❓ "Where do you record a client today? From the first phone call all the way to the grant?"

*(why: their old tracker is abandoned, and the Google Sheet turns out to be just phone numbers for cold calling. So we may be building their FIRST real client list. That changes everything — and it's good news, not bad.)*

**Follow-ups if he's vague:**

- "So if I asked you right now how many active files you have — where would you look?"
- "Does each consultant keep their own list, or is there one shared place?"
- "How do you know when someone hasn't been contacted in two weeks?"

---

# 2 · FOR THE DEMO TODAY — ask early, you need it during the call

### ❓ "Can you send me 8 to 10 real clients you're working on right now?"

For each one, just:

- Name
- Visa type
- Onshore or offshore
- Which consultant
- What stage they're at
- Last time you contacted them

**Say this:** *"Mershe can paste it in five minutes. I'll put them in live on this call and you'll watch the folders create themselves and the dashboard fill up with your own clients."*

*(why: a real demo beats a mock demo by a mile. He can show his team something that's actually his.)*

---

# 3 · WHO SEES WHAT

You already told us: clients see their own, managers see their branch, you see everything. Just confirming the detail.

### ❓ "Can you send me the email address of every staff member, and which branch each one belongs to?"

*(why: the access control works email by email. No email, no access. This is the single thing that blocks the manager view.)*

### ❓ "Should a manager see the other branches' totals, or nothing at all from other branches?"

*(why: "my branch has 12, the company has 40" vs "my branch has 12" — completely different build.)*

### ❓ "For clients — do you want them logging in to see their own file, or is a status email enough for now?"

*(why: a login portal is a much bigger build than a dashboard. Need to know if it's really wanted or just nice-to-have.)*

### ❓ "When someone leaves, who takes their access away?"

*(why: nobody ever thinks about this and it's how data walks out the door.)*

---

# 4 · WHAT GOES ON THE DASHBOARD

You've already given us the list. **Two of them we need to talk about.**

### ✅ Already built and working

- Active matters
- Ongoing
- Clients not contacted in 1–2 weeks
- Granted vs refused
- Who is stuck at which stage
- Per branch, per consultant

### ⚠️ Two we need to discuss

### ❓ "New enquiries this week — where do enquiries come in? Facebook, Instagram, WhatsApp, walk-in?"

*(why: we can build this, but we need to connect the channels first. Small job, just not free.)*

### ❓ "Deadlines — which deadlines do you mean? Department letters, visa expiry, or something else?"

🔴 **Be honest here:** *"That one needs the system reading your Department emails first. It's coming, but it's not in what I'll show you today."*

*(why: there's no deadline column and no source for it yet. Do NOT promise it.)*

### ❓ "Anything you've always wanted to see and never could?"

*(why: better asked over a working screen than in the abstract — that's why the last version of this question got no answer.)*

---

# 5 · MICROSOFT 365

### ❓ "How many people need an account?"

**Then tell him the prices** *(per person, per month, plus GST):*

- **Basic — about $9** → email + Teams + online Word/Excel only
- **⭐ Standard — about $18.70** → adds proper Word/Excel/Outlook on the computer ← **recommend this**
- **Premium — about $32.90** → adds device control and extra security

**Say:** *"Go Standard. Basic doesn't give you Word and Excel on the desktop, and you'll hate that within a week."*

### 🔴 Then give him the warning

> *"Buying the licences takes ten minutes. Moving your 1,400 client folders off the personal account is the real job — that needs planning, and it will break the folder automation for a bit while we move it. Let's plan that properly before you buy."*

### ❓ "Is the plan to move all the client files onto the new Microsoft account?"

*(why: this is a genuinely good move — right now ~150 clients' passports sit on one personal account with no company control. But it's a project, not a purchase.)*

---

# 5b · 🔴 TELL HIM THIS — it goes with the Microsoft purchase

### The OneDrive connection is currently on MY personal Microsoft account

Right now the automation reaches his OneDrive through **`sharry00010@gmail.com` — my account, not his.**

**Say it plainly, before he buys anything:**

> *"One thing you should know. The folder automation currently connects through my own Microsoft login, because that's how we got it working quickly. That needs to move onto your company account — and buying Microsoft 365 is exactly the right moment to do it. If we don't move it, the day I hand this over the folders stop being created."*

*(why: this is the last thing we still hold that should be his. Telling him now, while he's already buying M365, turns a handover problem into a natural next step. If we say nothing and he finds out later, it looks like we hid it.)*

---

# 5c · HOW MANY BRANCHES, ACTUALLY?

### ❓ "How many offices do you have running today — and how many in six months?"

*(why: he wants manager-sees-own-branch access. But today Brisbane is the only office — Townsville and Philippines are "a couple of months away". If it's one branch right now, we build the access system but there is nothing to separate yet. Better to know than to build a permission system for branches that don't exist.)*

### ❓ "Who would be the manager in each branch?"

*(why: "manager" has to be a real named person with an email, or the role is empty.)*

---

# 6 · IF THERE'S TIME

### ❓ "Your current staff list — Mershe isn't on the one I have."

*(why: the consultant field is a locked dropdown. Anyone missing can't be picked at all.)*

### ❓ "The weekly report — what would you want in it, and who gets it?"

*(why: you mentioned it. Cheap to add once the dashboard is live.)*

### ❓ "Two checklists have fixed prices printed in them — $2,028 and $4,060. Are those still right?"

*(why: one of them also disagrees with your fee appendix — $2,000 vs $2,500. Worth catching before a client sees it.)*

### ❓ "The auto-reply for new enquiries — happy for me to draft the wording and send it to you to approve?"

*(why: A-10. Needed before the enquiry automation can go live. Asking now saves a round trip later.)*

### ❓ "When we get to testing, can you give me 2 or 3 real client files to run end to end?"

*(why: A-11. Not needed today — but flagging it now means it is not a surprise later.)*

### ❓ "Of the CRMs you sent me — CRM4Agencies, Migration Manager, Agentcis — which one felt closest?"

*(why: A-05, unanswered since 8 Aug. One word halves the discovery work on the client portal. And it tells you what he is comparing our price against — CRM4Agencies is about $3,500 setup plus $600 a month.)*

---

# ❌ DON'T SAY

- ❌ **Any price for our work** → *"I'll put it in writing"*
- ❌ **"Folders are running"** → say *"built and tested, switching on when you're ready"*
- ❌ **A date for the client portal** → too big, not scoped
- ❌ **That deadlines are on the dashboard** → they are not

---

# 💰 NOT TODAY — but know where it sits

**The final 50% ($840) is due on go-live.** Do not raise it on this call — nothing is switched on yet
and it would land badly next to a Phase 2 conversation. **Raise it the day the automation goes live
with his real clients in it.** That is the moment it is obviously earned.

---

# 📌 THE 3 THINGS YOU MUST NOT LEAVE THE CALL WITHOUT

1. **8–10 real client names** → today's demo
2. **The answer to "where do you record a client today?"** → shapes the whole project
3. **Staff emails + branches** → unblocks the manager view

Everything else can wait.
