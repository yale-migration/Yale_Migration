# Yale client & staff dashboard — architecture
**Phase 3, Layer 3.** Written 20 Aug 2026. Status: **design agreed, not yet quoted.**

---

## ⛔ Read this before writing code

**1. Commercial.** `DASHBOARD-TRACKER.md` records this as *"Phase 3 · 40–80h · not scoped, not
priced, not promised."* ~26 unbilled hours have already been absorbed, ~7 of them dashboard work.
This is 5–10× that. **It should carry a change order before it ships**, whatever we build now.

**2. 🔴 Deployment — company-controlled only.** This holds **visa applicant PII**: names, contact
details, visa status, refusal reasons, expiry dates. Company Vercel team account + company Supabase.
⛔ Never a personal Vercel/Netlify/Replit account, never a free tier, never `sharry00010@gmail.com`.
Until that access exists we build **locally against synthetic data only.**

**3. ⛔ Credentials never cross the boundary.** Their workbooks carry ~1,200 plaintext passwords
including ImmiAccount logins (A-18). MASTER itself has none — but the sync uses an **explicit column
allowlist, never a denylist**, so a column added upstream can never silently start flowing into a web
app. A denylist fails open; an allowlist fails closed.

---

## The requirement, in their words (confirmed 14 Aug, CR-012)

| Role | Sees |
|---|---|
| **Client** | their own matter only |
| **Branch manager** | their own branch only |
| **Robinder** | every branch |

Non-functional: laptop primary, responsive on mobile · hourly refresh · *"no new login if avoidable."*

---

## 🔑 Why this cannot be Looker, and why Sheets cannot enforce it

**Google Sheets has no row-level security.** Sharing a tab shares every row in it. Every "role-based"
view built on Sheets is a *filter* — and a filter is a display choice, not an access control. Anyone
who can open the file can remove it.

**Looker Studio** does support row-level security by viewer email, and it is the right answer for
**staff** — ~10 people who already have Google accounts. It is the wrong answer for **clients**:
it filters email-by-email, ignores Workspace groups, and demands a Google login per viewer.
Unworkable at ~150 clients.

So: **Looker for staff (Layer 2, cheap), this app for clients (Layer 3).** They are not competitors.

⚠️ *"No new login if avoidable"* cannot be honoured literally for clients — they have no Workspace
account. **Magic-link email auth** is the closest true answer: no password to create, no password to
forget, no password to leak. Given A-18, adding 150 new passwords to this practice's estate would be
actively irresponsible.

---

## Data flow — one direction, always

```
   Google Sheets  ────────────►  Supabase Postgres  ────────────►  Next.js
   MASTER · ENQUIRIES            row-level security               App Router
   SYSTEM OF RECORD              the ENFORCEMENT layer            the view

   staff keep working here       hourly, one-way, allowlisted     read-only
```

⛔ **The web app never writes back to Sheets.** Staff own the sheet; the app is a window.
Two writers on one row is the defect shape this project has hit repeatedly — and here it would be
a client and a consultant editing the same matter.

🔑 **RLS is enforced in Postgres, not in the app.** A policy the database refuses is a control; a
`WHERE` clause in a React component is a suggestion. If the API layer is ever bypassed — a leaked
anon key, a bad route, a future developer — the database still says no.

---

## Schema (sync target, not the source of truth)

```sql
matters            -- one row per MATTER, mirroring MASTER's grain (D-11)
  client_code       text primary key        -- YM-2026-#####
  full_name         text
  client_email      text                    -- MASTER F, the reliable identity key (D-52/54)
  office            text                    -- BRISBANE | TOWNSVILLE | PHILIPPINES
  team              text
  consultant        text
  visa_type         text
  processing_stage  text                    -- THEIR vocabulary (D-51..56)
  visa_outcome      text
  visa_expiry       date
  next_due          date
  last_contact      date
  docs_outstanding  text
  updated_at        timestamptz

profiles           -- who is allowed to see what
  user_id     uuid primary key references auth.users
  role        text check (role in ('client','manager','director'))
  office      text        -- managers only
  client_code text        -- clients only

-- ⛔ NOT SYNCED, EVER: anything named password / username / OTP / PIN /
-- security question. Enforced by allowlist in the sync, not by omission here.
```

### The three policies

```sql
alter table matters enable row level security;

create policy director_all on matters for select
  using (exists (select 1 from profiles p
                 where p.user_id = auth.uid() and p.role = 'director'));

create policy manager_own_office on matters for select
  using (exists (select 1 from profiles p
                 where p.user_id = auth.uid() and p.role = 'manager'
                   and p.office = matters.office));

create policy client_own_matter on matters for select
  using (exists (select 1 from profiles p
                 where p.user_id = auth.uid() and p.role = 'client'
                   and p.client_code = matters.client_code));
```

⚠️ **A client is bound to `client_code`, not to `auth.email()`.** Matching on email looks simpler and
is worse: two of their rows already share one email address (rows 22 and 23 — a 482 and a 500), so an
email match would show one client the other's matter. The profile row is created deliberately by
staff, once, and is the only link.

🔴 **27 of 41 active clients have no email on file.** Those people cannot be invited until one exists.
That is a data problem, not a build problem, and it must not be discovered at launch.

---

## What each role opens on

Research finding D-302, and it holds here: competitor dashboards open on charts; a practice owner
opens one to find out **what needs them today**. So every role opens on "needs you", not on a graph.

| Role | Opens on |
|---|---|
| **Client** | where my application is · what I still owe you · what happens next |
| **Manager** | my branch's overdue chases · files gone quiet · documents outstanding |
| **Director** | all branches side by side · where matters are stuck · outcomes |

---

## Build order

1. **Schema + RLS + policy tests** — the tests come first. An RLS policy that lets the wrong row
   through is the only defect in this build that cannot be walked back.
2. Sync: Sheets → Postgres, hourly, allowlisted, idempotent on `client_code`
3. Auth + profile provisioning
4. The three role views
5. Deploy to **company** Vercel + Supabase

⬜ Blocked on nothing technical. Blocked on a quote, and on company hosting access.
