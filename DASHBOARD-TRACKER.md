# DASHBOARD TRACKER — the single source for this workstream

**Updated 20 Aug 2026.** Everything dashboard lives here: what he asked for, what is built, what is
blocked, and what it costs. Other files own other things — see `STATUS.md` for the whole project.

---

## 🎯 What he actually wants — his words, four times

| Date | Ask | Ref |
|---|---|---|
| 19 Jul | a CRM, "Google friendly" | CR-001 |
| 3 Aug | run the CRM demo in parallel *"so our other branches will start working on it"* | CR-007 |
| 6 Aug | a dashboard, *"he wants to run multiple branches"* | CR-009 |
| 14 Aug | role-based access: clients / managers / him | CR-012 |

> **One need, four shapes: he is opening branches and cannot see what his staff are doing.**
> Largest revenue opportunity in the account. Treat it as a headline, never a favour.

---

## 📋 THE SPEC — confirmed 14 Aug

### Who sees what
| Role | Sees |
|---|---|
| Client | their own matter only |
| Branch manager | their own branch only |
| Robinder | every branch |

### Views he asked for
| # | View | Status |
|---|---|---|
| 1 | Active matters | ✅ built |
| 2 | Ongoing | ✅ built |
| 3 | 1–2 week chase list | ✅ built |
| 4 | Granted vs refused | ✅ built |
| 5 | Who is stuck at which stage | ✅ built |
| 6 | **Deadlines** | 🟡 **visa expiry buildable now** (D-300) · s56 needs M9 |
| 7 | **New enquiries this week** | 🟡 **source found** — `DATA SHEET.xlsx` (D-300) · needs ENQUIRIES wired |

### Non-functional
| Ask | Sheet / Looker layer | **Phase-3 web app** |
|---|---|---|
| Laptop primary, responsive on mobile | ✅ | ✅ **tested at 390px, 41 layout assertions** |
| Hourly refresh | ✅ Looker native | ✅ `vercel.json` cron `0 * * * *` → `/api/sync` |
| No new login if avoidable | ✅ Google-native | ✅ **staff: Google · clients: magic link** — see below |

🔑 **"No new login if avoidable" cannot be satisfied the same way on both sides.** The ~10 staff all
have Yale-domain Google accounts, so for them there is genuinely no new login. The ~150 clients have
none — which is exactly *why* Looker could not serve them and why the web app exists at all. Giving
staff Google and clients a magic link honours the ask on the half where it is possible; treating the
impossible half as licence to ignore both was the state this sat in until 20 Aug.

---

## 🏗 ARCHITECTURE — three layers, decided (D-299)

```
LAYER 1 · DATA          MASTER + ENQUIRIES (Google Sheets)
  ✅ built              everything reads this. Stays on Sheets ~12 months.
  🟡 nearly empty       ⛔ Microsoft is storage + email, NEVER the database

LAYER 2 · STAFF VIEW    Looker Studio · row-level security by viewer email
  📐 designed           Robinder = all branches · manager = own branch
  FREE · ~1–2 weeks     verified: unauthorised rows are never returned to the report

LAYER 3 · CLIENT PORTAL Next.js App Router + Supabase (Postgres RLS)
  📐 approach only      company Vercel + company Supabase — never personal/free-tier
  Phase 3 · 40–80h      not scoped, not priced, not promised
```

**Why Looker cannot serve clients:** it filters email-by-email, does not work with Workspace groups,
and every viewer needs a Google login. Fine for ~10 staff. Unworkable for ~150 clients.

---

## 🔗 LIVE DESIGN PROTOTYPE
**https://claude.ai/code/artifact/e21c10b5-4de1-4b41-8ac2-62102e6838ec**
Working role switcher — Director / Brisbane manager / Townsville manager / **Client**. Opens on a
phone, no login. Sample data, footnoted as such. Built to answer the question he could not picture:
*what does each person actually see?* Competitive reasoning in `COMPETITOR-ANALYSIS-dashboards.md`.

**Design decision from the research (D-302):** the page opens with **"Needs you today"** — expiring
visas, files gone quiet, the document queue — above every chart. Competitor dashboards open on
charts; a practice owner opens one to find out what needs them.

## ✅ BUILT AND PROVEN

**`scripts/setup_dashboard_tab.gs`** — DASHBOARD tab inside MASTER. 6 views + 6 KPI tiles.
**Zero Make operations.** Reads MASTER live; stores nothing; never writes to MASTER.

Proven against 14 seeded rows on 13 Aug — **all six headline numbers matched prediction exactly**
(`14 · 12 · 4 · 1 · 4 · 6`), and all three grouped views cross-checked independently to 12 open matters.

### 🔴 Six defects the seeding found — all invisible at zero rows

| # | Defect | Ref |
|---|---|---|
| 1 | KPI tiles counted only blank outcomes, not `Pending` — **three tiles would have read 0 forever** against real data while looking healthy | D-292 |
| 2 | `setValues()` is lazy; validation fires at `flush()`. A flush outside the try/catch let a partial write through | D-293 |
| 3 | `Checklist Filed` (Y) had **silently inherited** `Skills Authority` (X)'s dropdown via `insertColumnsAfter()`, blocking every manual and script write since creation | D-294 |
| 4 | Dates rendered as serials (`46216`) — QUERY output carries no number format; `setNumberFormat` on a spill range does not survive. Fixed with QUERY's own `format` clause | D-295 |
| 5 | 🔴 **`820/801` silently vanished** — QUERY coerces a mixed-type column to one type and nulls the rest. Partner and employer lines would have disappeared | D-295 |
| 6 | The `DEMO-` guard never worked — `master_codes.gs` overwrites any value that is not a valid `YM-2026-#####`, so `removeDemoRows()` had **silently stopped working** | D-296 |

> **The rule this workstream earned: never show a client a report that has not been run against data.**
> An empty dashboard renders a broken formula and a correct one identically.

---

## 🔴 BLOCKED ON

| # | Blocker | Impact |
|---|---|---|
| **A-16** | **Manager roles only** | 🔑 **Emails already held** — `access/Team roster.docx` 26 Jul → `ACCESS.md` (D-310). The roster has team and visa line but **no role column**, so we still cannot tell who is a manager. That, plus Mershe's email, is all that blocks the manager view |
| **A-17** | Which of ~460 records are still active | Determines what the numbers actually mean |
| — | **`STAFF` tab does not exist yet** | Ours to build. `email · name · branch · role`, blended with MASTER on Office. Also finally gives the consultant dropdown a single source (A-13) |

---

## ⏭ NEXT ACTIONS, IN ORDER

| # | Action | Owner | Blocked? |
|---|---|---|---|
| 1 | ~~Import `SUMMARY OF CLIENTS` — 47 clean, curated rows~~ 🔴 **WRONG — CORRECTED 15 Aug (D-315).** That tab is **47 names**; only 11 carry a visa type. Import source is **`LODGEMENT JULY TO PRESENT` (42 rows)** via `scripts/build_pilot_import.py` | us | 🔴 **yes — A-25.** `Office`/`Team` exist in no file they have sent |
| 2 | Re-run `buildDashboard` with the date + visa-mix fixes | Sharjeel | no ✅ |
| 3 | `removeDemoRows()` before any real data lands | Sharjeel | no ✅ |
| 4 | Add the 5 missing MASTER columns (D-300) | us | no ✅ |
| 5 | Add `Visa Expiry` deadline view — source exists | us | no ✅ |
| 6 | Wire `DATA SHEET.xlsx` → ENQUIRIES → "new enquiries this week" | us | no ✅ |
| 7 | Build `STAFF` tab | us | needs A-16 |
| 8 | Looker Studio + row-level security | us | needs A-16 |
| 9 | Client portal | — | Phase 3, unscoped |

---

## 🟢 PHASE 3 — THE WEB DASHBOARD, as at 20 Aug 2026

Lives in **`yale-build/dashboard/`**. Its own compaction handoff is **`dashboard/STATE.md`** — read
that before touching code; this section is the commercial and requirements view.

### Live
Supabase **`rmvvlvjjebsskbhjxnap`** — client-owned Google account, Sydney region, Pro plan.
7 matters · 3 s56 · 6 enquiries · 1 profile (`sharry00010@gmail.com` = director).
**Access matrix proven 22/22 against the live database**, every role against every table.

### His four views, and what happened to two of them
| # | View | State 20 Aug |
|---|---|---|
| 1 | Active matters | ✅ **now genuinely distinct** — matters being *worked* |
| 2 | Ongoing | ✅ **"Awaiting outcome"** — lodged, sitting with the Department, nothing to do |
| 3 | 1–2 week chase list | ✅ **"Due to chase"**, forward-looking, overdue sorted to the top |
| 4 | Granted vs refused | ✅ rate renders `—`, never `0`, when nothing is decided |
| 5 | Who is stuck at which stage | ✅ by stage, by consultant, by branch |
| 6 | Deadlines | ✅ visa expiry + s56 ladder (7/14/21/26, rungs dropped past a short deadline) |
| 7 | New enquiries this week | ✅ built · ⬜ no sync feeding it yet |

🔴 **Views 1 and 2 were one number wearing two names**, and **view 3 was built backwards** — dormancy
(what has already been neglected) in place of the forward chase list he actually described. Both had
read ✅ in this table since 14 Aug. A row marked built is a claim about a name, not about behaviour;
these were caught by a specialist review, not by the tracker.

### Access control — the thing that ends the spreadsheet approach
**RLS in Postgres is the access control, not the app.** `lib/data/matters.ts` runs an unfiltered
`select *` **on purpose** — adding `.eq('office')` would make the app *look* like it enforces access
and hide whether the database actually does.
- Client is bound to **`client_code`, never `auth.email()`** — two rows in Yale's own list share an
  address, and a policy written on email hands one client the other's file.
- Client sees **no s56 date and no enquiries** — not restricted, **no policy at all**, so RLS denies
  by default. Absence is the rule.
- One message for "not found" and "not yours", or the error text enumerates their client list.

### Verified green, 20 Aug
`npm run check` — typecheck 0 · **100 unit checks** · production build · **82 e2e** on desktop and
390px, including link-crawl, tap-target, contrast and "no page renders undefined/NaN".

### Open before this is a product
- ⚠️ **Google sign-in needs the provider switched on** in Supabase Auth before the button works.
- ⚠️ `/api/sync` deliberately returns **503 `not_configured`** until Sheets credentials are connected.
- ⬜ Brand navy/gold are **eyeballed** — get the hexes off Robinder's logo.
- ⬜ **Unquoted.** ~21h already built. `QUOTE-P3-DASHBOARD.md` — option A = 34h / USD 1,190.
- ⬜ **Hosting undecided**: company Vercel + company Supabase is required the moment real client data
  lands. The demo runs on fixtures, which is what makes the shareable link permissible today.

---

## 💰 COMMERCIAL POSITION

| | |
|---|---|
| **Sheet tab (built)** | Preview. Delivered inside MVP goodwill. **Director-only** |
| **Looker Studio staff layer** | **P2-01, 6–10h, billable.** Quote after go-live |
| **Client portal** | **P3, 40–80h, billable.** Do not price verbally |

**Anchor:** CRM4Agencies is ~AUD 3,500 setup + $600/month ≈ **$25,100 over three years.**

⛔ **Never quote a dashboard number on a call.** *"Let me put it in writing."*

---

## 🗣 WHAT TO SAY, AND WHAT NOT TO

**Say:**
- *"Every client is one row. The dashboard counts the rows. Nobody maintains it."*
- *"You already tried this — the summary in P and Q, and the 48-hour alert. The formula broke and nobody noticed for months. This can't break, because nobody has to keep it alive."*
- *"Built and tested, switching on when you're ready."*

**Never say:**
- ❌ that s56 deadlines are on the dashboard — **they are not**
- ❌ "folders are running" — both scenarios are deliberately off
- ❌ any price
- ❌ a date for the client portal
