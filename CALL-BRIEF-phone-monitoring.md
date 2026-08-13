# CALL BRIEF — 13 Aug 2026
**For:** Sharjeel · **Call with:** Robinder Pal Singh (MARN 1573959), Director, Yale Migration
**Two topics:** (1) phone monitoring software, (2) MVP + dashboard progress

> **His words:** *"I want some advice on having some softwares for phones which can monitor
> activity / calls / msgs and if they can be integrated on the dashboard."*

---

# PART 1 — PHONE MONITORING

## 1.1 What he is actually asking for

Read this next to his other three asks — a CRM (19 Jul), the CRM demo running in parallel *"so our
other branches will start working on it"* (3 Aug), and the dashboard because *"he wants to run
multiple branches"* (6 Aug).

**This is the same need a fourth time: he is opening branches and cannot see what his staff are
doing.** He is not asking to spy on people. He is asking *"how do I know a client in Townsville is
being looked after when I am in Brisbane?"*

That reframe matters, because the answer he asked for is largely unlawful and the answer to the
question underneath it is cheap, legal, and half-built already.

## 1.2 The legal reality — this is the part to get right

Australia has no single "employee monitoring" law. Four separate regimes apply at once, and a
Philippines office adds a fifth.

### 🇦🇺 Federal
- **Telecommunications (Interception and Access) Act 1979 (Cth)** — prohibits intercepting a
  communication passing over a telecommunications system. Live interception of calls or messages is
  off the table without a warrant.
- **Privacy Act 1988 (Cth)** — governs how personal information is collected and used. A small
  business with turnover under $3M *may* be exempt; **do not rely on that** without advice, and see
  the tort below, which does not care.

### 🔴 The statutory tort — new, and the biggest change
**A statutory tort of serious invasion of privacy commenced 10 June 2025** (Privacy and Other
Legislation Amendment Act 2024, Sch 2). For the first time an individual can **sue directly** for
either *intrusion upon seclusion* or *misuse of information*, where the invasion was **intentional or
reckless**.

**It is a stand-alone action, independent of the Privacy Act — so the small-business exemption is no
shield.** Installing monitoring software on a staff member's personal phone is close to a textbook
example of intrusion upon seclusion.

### 🇦🇺 Queensland — the counter-intuitive bit
**Invasion of Privacy Act 1971 (Qld)**
- **s43** — offence to use a listening device to record a private conversation, **but there is an
  exception where the person recording is a party to the conversation.** So a consultant recording
  their own call with a client is generally lawful in Queensland.
- **s45** — 🔴 **communicating or publishing that recording is a *separate* offence**, unless an
  exception applies (consent of the other parties, another party to the conversation, legal
  proceedings, or someone with such an interest as to make it reasonable).

> **The recording is usually the legal part. Putting it on a dashboard the whole management team can
> open is the part that creates liability.** This is the single most commonly missed point, and it is
> precisely what he is proposing.

### 🇦🇺 Other states
NSW has the country's only dedicated **Workplace Surveillance Act 2005**, with strict written-notice
requirements. Irrelevant today, relevant the moment he hires in NSW.

### 🇵🇭 Philippines — a hard stop, not a caution
He has told us Townsville and Philippines offices are coming *"in a couple of months"* (D-230).

**Republic Act 4200 (Anti-Wiretapping Law) is all-party consent, and it binds participants too.**
*Ramirez v Court of Appeals* settled that you cannot lawfully record your own conversation just
because you are in it — every other party must authorise it. **Penalty: up to 6 years imprisonment.**

**A single monitoring policy cannot cover Brisbane and Manila.** Anything built must be
jurisdiction-aware from day one, or it exports a criminal offence to the Philippines team.

### ⚖️ And his own professional obligations
As a **Registered Migration Agent**, Robinder is bound by the MARA Code of Conduct on client
confidentiality. Recordings of client calls are client personal information — often including
passport numbers, health and character matters, relationship evidence. Storing that on a third-party
monitoring vendor's servers is a bigger exposure than the staff-privacy question.

## 1.3 ❌ What we will not build

**Spy apps on personal phones** — mSpy, FlexiSPY, Hoverwatch and similar.

| Why not | |
|---|---|
| Legality | Employee monitoring can be lawful, but only where **the business owns the device**, there is a **written policy**, and **staff are told**. None of that is true of a personal phone |
| The new tort | Covert install on a personal device is intentional intrusion — directly actionable since June 2025 |
| Vendor risk | mSpy suffered a breach exposing hundreds of thousands of users' data. **A firm holding ~150 clients' passports cannot route communications through that class of vendor** |
| Philippines | Straightforwardly criminal under RA 4200 |
| Staff | The day one person finds it, he loses the team and it reaches the industry |

**Recommended position: decline this cleanly and offer the three things below instead.** They give him
more actual visibility than a spy app would, and none of them carry the risk.

## 1.4 ✅ What we can build — three options

### ⭐ Option A — WhatsApp Business Platform (Cloud API) — RECOMMENDED

Their enquiries already arrive on WhatsApp. This is the official Meta business channel.

- Every message in and out is captured **in the business system**, not on a person's phone
- The client can see they are messaging a business account — **consent is inherent, nothing is covert**
- Feeds the dashboard directly: response times, who replied, unanswered threads, per-branch volume
- A consultant leaving does not take the conversation history with them

**Cost:** Meta moved to per-message billing on **1 July 2025**. Replies inside the 24-hour customer
service window are free; utility and authentication templates are cheap; marketing templates cost most
(roughly USD $0.01–0.14 depending on market). Add a provider markup of about **USD $0.003–0.010 per
message**. For their volume this is realistically **tens of dollars a month, not hundreds.**

**⚠️ Edge case that trips everyone:** migrating a number to the API means **that number can no longer
be used in the normal WhatsApp mobile app.** Staff work from a shared inbox instead. That is a real
change to how the team works and must be agreed before we start, not discovered afterwards.

**Already partly in scope** — M6 (enquiry capture) covers the intake half of this.

### Option B — Business phone system (VoIP) with recorded lines

Company numbers instead of personal mobiles.

- Automated *"this call may be recorded for quality purposes"* announcement → **consent obtained from
  the client**, which is what s45 needs before anything is shared internally
- Call logs, duration, who answered, missed calls → straight into the dashboard via API
- Recording is optional per number and can be switched off for a client who objects

**Indicative cost:** Aircall from about **USD $30/user/month** (3-user minimum); RingCentral roughly
**USD $20–30/user/month** on core plans. Self-hosted 3CX is cheaper but needs someone to run it.
**For 6 staff: roughly USD $120–180/month.**

**⚠️ Edge case:** porting existing Australian numbers can take **2–4 weeks** and has a cutover window.
Plan it, do not surprise the team with it.

### Option C — Company-owned phones + MDM

The **only** lawful route to device-level oversight.

- Business buys and owns the handsets · written policy · staff informed in writing
- **Google Workspace endpoint management is already included in their Workspace** — no new licence
- Paid alternatives (Scalefusion, Hexnode, Intune) sit around **USD $2–5/device/month**

**🔴 Set the expectation clearly:** MDM does **not** read calls or messages. It manages the device —
enforce a passcode, control apps, locate, remote-wipe if lost or on exit. Anyone who tells him MDM
gives call content is selling him something else.

## 1.5 The honest recommendation

> **Do not monitor the staff. Move the client conversations into the business.**

If client calls and messages run through **company channels** — WhatsApp Business API and business
phone lines — then oversight is a **by-product**, not surveillance. He sees response times, coverage
and volume per branch without reading anyone's private life, without a policy fight, and without
exposure under the new tort.

**Sequence:** WhatsApp Business API first (they already live there, it is cheapest, it is half in
scope), business phone lines second, MDM only if he actually issues company handsets.

## 1.6 Time and cost, if he says yes

🔴 **All of this is Phase 2 — outside the signed MVP.** Log it, quote it, do not absorb it.

| | Build | Waiting on others | Realistic total | Running cost |
|---|---|---|---|---|
| **A · WhatsApp Business API** | 3–5 days | Meta Business verification, **1–3 weeks** | **2–4 weeks** | tens of $/mo |
| **B · VoIP + recorded lines** | 3–4 days | number porting **2–4 weeks** | **3–5 weeks** | ~USD $120–180/mo for 6 |
| **C · MDM** | 2–3 days | handset purchase | **1 week** | $0 on Workspace, or $2–5/device |
| **Dashboard integration** | +3–5 days each | — | — | $0 |
| **Policy + consent pack** | 1–2 days | 🔴 **his lawyer must review** | — | legal fee |

**Do not start any of it before the MVP cutover.** All three read from the same data layer, and that
layer has not yet met their real client list.

## 1.7 Every edge case worth naming on the call

| # | Edge case | Why it matters |
|---|---|---|
| 1 | 🔴 **Philippines RA 4200** | All-party consent, binds participants, up to 6 years. One policy cannot cover both countries |
| 2 | 🔴 **QLD s45** | Recording is usually fine; **sharing it internally is the offence.** Consent must be captured before anything reaches a dashboard |
| 3 | 🔴 **Statutory tort, June 2025** | Staff can sue personally. The small-business exemption does not apply |
| 4 | **Clients must be told, not just staff** | Consent has two sides. An announcement on the line is the cheapest way to get it |
| 5 | **MARA confidentiality** | Recordings are client PII. Vendor choice and data location are a professional-conduct question, not an IT one |
| 6 | **Personal-phone data mixing** | If a consultant leaves, you cannot wipe their personal phone. Company devices or nothing |
| 7 | **A client who refuses recording** | Must be switchable per call. If it cannot be turned off, do not turn it on |
| 8 | **Recordings are discoverable** | In a complaint or MARA matter, they can be subpoenaed. Keeping everything can hurt more than it helps. Set a retention period and honour it |
| 9 | **WhatsApp number migration is disruptive** | The number leaves the normal app. Agree the shared-inbox workflow first |
| 10 | **Number porting window** | 2–4 weeks, with a cutover. Do not schedule it across a lodgement deadline |
| 11 | **Staff trust** | The internal cost of getting this wrong is larger than the software cost. Announce it as a client-service system, because that is what it should be |
| 12 | **Storage and cost drift** | Recordings grow forever. Budget storage and set deletion rules on day one |

## 1.8 What to say when he asks "can you just install something on their phones"

> *"We can, technically. I'd advise against it, and here's the short version. In Queensland recording
> your own call is usually fine — but sharing that recording internally is a separate offence unless
> the other person consented. And since June last year staff can sue personally for this kind of
> thing, which the small-business exemption doesn't protect against. In the Philippines it's
> straightforwardly criminal, up to six years, and you've got an office coming there.*
>
> *The good news is you don't need it. What you actually want is to see how each branch is looking
> after clients. If the calls and WhatsApps run through business channels instead of personal phones,
> you get all of that automatically — response times, who's answering, what's going unanswered — and
> nobody has to be watched. It's also cheaper."*

---

# PART 2 — PROGRESS, IN PLAIN LANGUAGE

## 2.1 What works today

| | What it does | Where it runs |
|---|---|---|
| **Client codes** | Type a name in the master sheet → a code is issued automatically | Their Google account ✅ **running now** |
| **Folders** | The right folder set appears in their OneDrive, in the right team's area, and the link comes back to the sheet | Built and proven ⏸️ waiting for cutover |
| **Checklists** | Works out the right checklist — visa type, onshore/offshore, dependants, skills assessment — and files it into the client's folder | Built and proven ⏸️ waiting for cutover |
| **Quiet-client alert** | Runs every morning, flags anyone not contacted. Replaces the `48hr Alert` column that has a broken `#REF!` in it | ✅ **running now, unattended** |
| **Dashboard** | Six live views on one screen. Opens on a phone | ✅ **built and tested** |

**Roughly 53% of the 40 build-hours.** Everything that does not depend on them is done.

## 2.2 The dashboard — what he will see

1. **Branch performance** — matters by office and team ← *the multi-branch answer he has asked for
   three times*
2. **Where matters are stuck** — by processing stage
3. **Workload per consultant** — who is carrying the most
4. **Going quiet** — oldest contact first, red past 14 days
5. **Outcomes** — granted / refused
6. **Visa mix** — what the practice actually works on

Plus six headline numbers, two of which watch the system itself: **folders missing** and **checklists
missing** turn red when automation has not covered someone.

It is **a tab inside the master sheet** — no new login, no new platform, nothing to install, and it
costs nothing to run.

**Tested properly.** We put 14 sample matters in and checked every number by hand. That found four
real faults that were invisible while the sheet was empty — including one where partner visas
(`820/801`) silently disappeared from the visa mix, and one where a column had been quietly rejecting
every entry since it was created. **All four are fixed.** An empty report and a broken report look
identical, which is why we never show one that has not been run against data.

## 2.3 🔴 The one thing holding everything up

**We need the link to the Google Sheet the team is using now.**

Their `Engaged Client Tracker.xlsx` is abandoned — the team told us on 12 Aug: *"we are not using
it."* Good that we asked; importing it would have filled the dashboard with dead clients and made it
confidently wrong.

Asked twice. Until it arrives, four things are stalled:
1. checking their columns against ours — **if they have a field we don't, we add it before importing**
2. bringing their clients across
3. real numbers in the dashboard
4. agreeing the switchover date

## 2.4 ⚠️ This is a switchover, not a copy — say this on the call

They are working in that sheet **every day**. So this is moving a live system, and the risk is not
losing data — it is **two sheets being edited at once**.

If we copy their clients across and the team keeps typing in the old one, within a week the folders,
checklists and alerts describe people who moved on days ago. Nothing breaks. Nobody is told. It just
drifts, and the first to notice is a client being chased for documents they already sent.

**The fix is simple and needs his authority:** on an agreed date the old sheet becomes **view-only**.
After that there is one place to type. We keep the old sheet forever as the record.

**He needs to pick that date and tell the team.** That is the only thing we cannot do for him.

## 2.5 What happens after the link arrives

| Step | Time |
|---|---|
| Check their columns against ours, add anything missing | half a day |
| Bring the clients across | half a day |
| Verification report — row counts, sample rows, anything contradictory | half a day |
| Dashboard live with real numbers | same day |
| **Switchover date** | **his call** |
| Turn the folder and checklist automation on | 1 hour |

**About three days of work from the moment we have the link.**

## 2.6 Good news on cost

We had assumed the automation needed a paid Make.com plan. **It does not.**

Running it three times a day on weekdays instead of every 15 minutes brings it to roughly **392
operations a month against the 1,000 free** — comfortably inside. A folder appears within a few
working hours instead of instantly, which nobody will notice.

A paid plan is still needed later for the email side (M6/M9), because the free tier only allows two
automations running at once. **Not now, and it is about AUD $12–20 a month when it comes.**

## 2.7 One small thing to ask for

**The current staff list.** Mershe Ventura is answering our questions but is not on any roster we
hold, and the consultant field is a locked dropdown — anyone missing cannot be selected against a
client.

---

# PART 3 — THINGS TO KEEP OFF THE CALL

- Don't quote Phase 2 numbers live. *"Let me put it in writing"* is the right answer — the phone
  monitoring work is a package, and packages quoted verbally get remembered as the low end.
- Don't promise a switchover date until the link arrives and we have seen their columns.
- Don't say the folder or checklist automation is "running". It is **built and tested, switching on at
  cutover**. Both scenarios are deliberately off.
- Don't re-ask about the old tracker. Closed on 12 Aug.
- If he pushes on spy apps after hearing the risks: **that is his decision to make.** Put the advice in
  writing, note it in `CLIENT-LOG.md`, and require his lawyer's sign-off before we build anything.

---

## Sources

- [Invasion of Privacy Act 1971 (Qld) — full text](https://www.legislation.qld.gov.au/view/whole/html/current/act-1971-050) · [s45 — communication/publication](https://classic.austlii.edu.au/au/legis/qld/consol_act/iopa1971222/s45.html)
- [Listening Devices (Qld) — Armstrong Legal](https://www.armstronglegal.com.au/criminal-law/qld/offences/listening-devices/)
- [Statutory tort for serious invasions of privacy — OAIC](https://www.oaic.gov.au/privacy/your-privacy-rights/more-privacy-rights/statutory-tort-for-serious-invasions-of-privacy)
- [Privacy gets teeth: Australia's new statutory tort — Norton Rose Fulbright](https://www.nortonrosefulbright.com/en/knowledge/publications/87ee5e95/privacy-gets-teeth-australias-new-statutory-tort-and-how-it-might-look-in-practice)
- [Tort for serious invasion of privacy now in effect — Rigby Cooke](https://www.rigbycooke.com.au/tort-for-serious-invasion-of-privacy-is-now-in-effect/)
- [Workplace surveillance and monitoring employees — Prosper Law](https://prosperlaw.com.au/workplace-surveillance-and-monitoring-employees/)
- [Recording phone calls in the workplace — Emplawyer](https://www.emplawyer.com.au/knowledge/emphasis/recording-phone-calls-in-the-workplace/)
- [Anti-Wiretapping Law in the Philippines (RA 4200) — Respicio & Co.](https://www.respicio.ph/commentaries/anti-wiretapping-law-in-the-philippines-ra-4200)
- [Philippines recording laws: all-party consent](https://www.recordinglaw.com/world-laws/world-recording-laws/philippines-recording-laws/)
- [WhatsApp Business API pricing 2026 — Blueticks](https://blueticks.co/blog/whatsapp-business-api-pricing-2026) · [Authgear](https://www.authgear.com/post/whatsapp-api-pricing/)
- [Aircall vs RingCentral 2026 — GetVoIP](https://getvoip.com/blog/aircall-vs-ringcentral/)
- [FlexiSPY — the spyware tool crossing the line — iVerify](https://iverify.io/blog/flexispy-the-spyware-tool-crossing-the-line-between-security-and-crime)
- [Stalkerware apps list — Clario](https://clario.co/blog/stalkerware-apps-list/)

⚖️ **Not legal advice.** This is engineering research so the conversation is informed. Anything that
records or shares a conversation needs a written policy reviewed by his lawyer before it goes live.
