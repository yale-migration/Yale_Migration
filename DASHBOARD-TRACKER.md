# DASHBOARD TRACKER — the single source for this workstream

**Updated 14 Aug 2026.** Everything dashboard lives here: what he asked for, what is built, what is
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
- **Laptop primary, responsive on mobile** ✅
- **Hourly refresh** ✅ Looker handles it natively
- **No new login if avoidable** ✅ Google-native throughout

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
| **A-16** | **Staff emails + branch mapping** | Row-level security filters on email. Their tracker has names (`priyanka`/`RJ`/`inder`), **no emails anywhere**. Nothing manager-level ships without this |
| **A-17** | Which of ~460 records are still active | Determines what the numbers actually mean |
| — | **`STAFF` tab does not exist yet** | Ours to build. `email · name · branch · role`, blended with MASTER on Office. Also finally gives the consultant dropdown a single source (A-13) |

---

## ⏭ NEXT ACTIONS, IN ORDER

| # | Action | Owner | Blocked? |
|---|---|---|---|
| 1 | Import `SUMMARY OF CLIENTS` — 47 clean, curated rows | us | no ✅ |
| 2 | Re-run `buildDashboard` with the date + visa-mix fixes | Sharjeel | no ✅ |
| 3 | `removeDemoRows()` before any real data lands | Sharjeel | no ✅ |
| 4 | Add the 5 missing MASTER columns (D-300) | us | no ✅ |
| 5 | Add `Visa Expiry` deadline view — source exists | us | no ✅ |
| 6 | Wire `DATA SHEET.xlsx` → ENQUIRIES → "new enquiries this week" | us | no ✅ |
| 7 | Build `STAFF` tab | us | needs A-16 |
| 8 | Looker Studio + row-level security | us | needs A-16 |
| 9 | Client portal | — | Phase 3, unscoped |

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
