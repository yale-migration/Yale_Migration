# COMPETITOR ANALYSIS — migration CRMs and what their dashboards do
**Researched 14 Aug 2026.** Sources at the bottom. This is what Robinder is comparing us against —
he sent us three of these links himself on 19 Jul.

---

## ⚠️ Method note, so nothing here is over-claimed

**Playwright / browser automation is NOT available in this session.** Nothing in this repo can log
into a competitor's product and click through its real dashboard. Everything below comes from their
public pages and independent reviews.

- **CRM4Agencies** — ✅ page read in full, features and pricing confirmed
- **Agentcis** — ⛔ **403 to automated fetch.** Features below come from independent review sites, not
  their own page. Treat as good, not gospel.
- **ImmiLedger** — ⛔ 403. Not assessed.
- **WIDEN AI** — ✅ read, though the page is promotional positioning rather than a feature list

To see a real competitor dashboard we would need to book a demo like any prospect. **Worth doing
before we quote the client portal** — an hour of watching Agentcis would sharpen the Phase 3 scope
more than any amount of reading.

---

## 🥇 CRM4Agencies — the one that matters

**This is the price anchor. Confirmed on their own site:**

| | |
|---|---|
| Setup | **from AUD $3,500 one-time** |
| Ongoing | **AUD $600/month** (4–6 hours specialist assistance) |
| Implementation | 2–6 weeks |
| **3-year cost** | **≈ AUD $25,100** |

### What they have
Lead pipeline with segmentation · document preparation from templates · Department communication ·
interaction and transaction history · **visa tracking and application status** · client document
storage · appointment scheduling with calendar sync · course management and enrolment · invoicing and
payments · social media integration · **automated notifications and reminders** ·
**user roles and access control**.

### 🎯 What they DO NOT have — and this is the opening
- ❌ **No client portal** mentioned anywhere
- ❌ **No document checklists** — they do document *storage* and *templates*, not "here is the exact
  list this visa needs"
- ❌ No dashboard specifics published at all — only stock imagery

> **We already beat them on the one thing Yale actually asked us for first.** M4 selects the correct
> checklist from 28 canonical files using visa type, onshore/offshore, dependants and skills
> authority, and files it into the client's folder automatically. CRM4Agencies stores documents. It
> does not know a 485 onshore with a dependent needs a different list from a 485 offshore individual.

---

## Agentcis — the feature-complete incumbent
*(from independent reviews; their own site blocks automated reading)*

Client, partner and subagent data in one place · workflow automation · **built-in client portal for
document upload and application status** · **document checklist management with automated reminders
for missing or expiring files** · commission tracking for B2B referral networks · calendar reminders ·
email marketing · StudyLink Connect integration.

**Where they are genuinely ahead of us:** the client portal and commission tracking. Both are real
products, not marketing.
**Where we are ahead:** we *select* the checklist; they *manage* it. And we run inside the client's
own accounts rather than renting them a platform.

---

## WIDEN AI — the AI-positioned newcomer
Four features named: **AI email classification · smart reply drafting · client intake automation ·
visa deadline tracking.**

> **That list is M9, M6 and the deadline engine.** Someone is already selling exactly what we have
> specced and half-built. Good news commercially — it validates the roadmap. Bad news if we are slow:
> the differentiation window on "AI reads your Department emails" is closing.

---

# 📊 WHAT THIS MEANS FOR OUR DASHBOARD

## Where we already win — say these out loud

| # | Us | Them |
|---|---|---|
| 1 | **Runs inside their own Google and Microsoft accounts** | rented platform, data on a third party's servers |
| 2 | **No monthly platform fee** | $600/month, forever |
| 3 | **Checklist is chosen automatically**, not just stored | storage and templates |
| 4 | **Dormancy detection** — flags anyone gone quiet | ⚠️ **nobody advertises this** |
| 5 | Nothing to migrate, nothing to learn | 2–6 week implementation |

**Point 4 is the sharpest.** Discovery found real client files dormant for **16 and 71 days** with no
chase, and their own `48hr Alert` column has been broken with a `#REF!` for months. Not one competitor
sells "we will tell you who you have forgotten." **That is Yale's actual pain, and it is ours to own.**

## Where we are behind — and what it costs to close

| Gap | Who has it | Our answer |
|---|---|---|
| Client portal | Agentcis | Phase 3 — Next.js + Supabase. **Prototype already built and demonstrable** |
| Commission tracking | Agentcis | not a Yale need — they are not running a subagent network |
| Invoicing | CRM4Agencies | Xero already in scope (P2-03) |
| Course/enrolment | both | their `Admissions Tracker` — P2-06 |

---

# 🎨 DESIGN RESEARCH — what changed in the prototype

**2026 dashboard practice, from the design research:** lead with metrics that prove value rather than
a wall of charts · role-based views so each person sees their own job · progressive disclosure ·
state encoded in *form* as well as number · ≥4.5:1 contrast · dark mode designed as its own set, not
an inversion · performance is a design decision (≈53% abandon past three seconds).

### The change that matters most

> **Competitor dashboards open on charts. A practice owner opens a dashboard to answer
> "what needs me today."**

So the prototype now opens with a **"Needs you today"** band above everything else — expiring visas
inside 14 days, files quiet for 21+ days, and the document queue, each with a count and the actual
names. Charts sit below it. That single change is the difference between a dashboard that gets opened
every morning and one that gets opened once.

**Also added:** week-on-week movement on every KPI — a number tells you the state, an arrow tells you
whether it is getting better.

🔗 **https://claude.ai/code/artifact/e21c10b5-4de1-4b41-8ac2-62102e6838ec**

---

# 🧰 TOOLING FOR THE REAL BUILD

**Recommended stack — and it matches our house defaults exactly:**

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js App Router** | our default; server components suit a read-heavy dashboard |
| UI | **shadcn/ui** | copy-paste source, no dependency lock-in |
| Charts | **Tremor** | 35+ dashboard components, **now fully free and open source, backed by Vercel**. 300+ blocks — KPI grids, chart groups, filter bars — all copy-paste. Built on React + TS + Tailwind + Radix, same substrate as shadcn |
| Data + auth | **Supabase** (Postgres + Auth) | row-level security is exactly the client/manager/director requirement |
| Hosting | **company Vercel + company Supabase** | 🔴 real client data — never a personal or free-tier host |

**Tremor going free in 2026 is the material change.** It was a paid product; the blocks that would
have cost money are now the fastest route to a professional dashboard, and the copy-paste model means
no runtime dependency we have to maintain for Yale afterwards.

⚠️ **Nothing off GitHub gets adopted as a "skill" for this project.** The open-source immigration
repos found (a USCIS pro-bono portal, assorted visa trackers) are US-focused, unmaintained, and would
import someone else's data model into a build whose schema we now understand better than they do.
**NextCRM** is worth reading for structure only — never forking.

---

# ✅ RECOMMENDED NEXT MOVES

1. **Send Robinder the prototype link.** He is comparing us to products with polished marketing sites;
   a working role switcher he can click beats any deck.
2. **Book an Agentcis demo before quoting Phase 3.** An hour of watching the real thing beats reading
   about it, and their site blocks us.
3. **Lead with dormancy, not with charts.** It is their live pain, it is already built, and nobody
   else sells it.
4. **Use the $25,100 anchor when the portal is quoted** — three years of CRM4Agencies, for a rented
   platform with no client portal and no automatic checklists.

---

## Sources — checked 14 Aug 2026
- [CRM4Agencies](https://www.crm4agencies.com.au/) — features + pricing, read directly
- [Agentcis](https://agentcis.com/) *(403 to fetch)* · [Capterra listing](https://www.capterra.com/p/181884/Agentcis/) · [CRMs for immigration consultants](https://integrateiq.com/blogs/best-crms-for-immigration-consultants/)
- [Migration agent software Australia 2026 — WIDEN AI](https://ai.widen.com.au/blog/migration-agent-software-australia)
- [SaaS dashboard design best practices 2026](https://flowmazeux.com/saas-dashboard-design-best-practices/) · [Dashboard design examples](https://muz.li/blog/best-dashboard-design-examples-inspirations-for-2026/)
- [Tremor](https://www.shadcn.io/awesome/item/tremor) · [Tremor review 2026](https://makerstack.co/reviews/tremor-review/) · [NextCRM](https://github.com/pdovhomilja/nextcrm-app)
