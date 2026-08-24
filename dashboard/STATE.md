# Dashboard — state of play
**One file a fresh session can read instead of the whole history.** Updated 24 Aug 2026.

## Live and working
Supabase `rmvvlvjjebsskbhjxnap` (client Google account, Sydney, Pro). `.env.local` holds the keys.
7 matters · 3 s56 · 6 enquiries · 1 profile (`sharry00010@gmail.com` = director).
**Access matrix proven 22/22 live** — every role, every table. `npm run check` green: 100 unit checks,
typecheck, production build, 82 e2e.

## Architecture, decided — do not relitigate
- **RLS in Postgres is the access control.** `lib/data/matters.ts` runs unfiltered `select *` ON
  PURPOSE. Adding `.eq('office')` would make the app *look* like it enforces access.
- **One-way.** Sheets is the system of record; the app never writes. Write actions = quote option B.
- Client bound to `client_code`, never `auth.email()` — two rows in Yale's list share an address.
- `getClaims()`, never `getSession()`. **Google for staff, magic link for clients** — no
  passwords anywhere (A-18: ~1,200 already sit in plaintext in their workbooks).
- Accent **navy `#1c3a5e`** (their brand). Semantic good/warn/crit unchanged — they carry meaning.

## Layout
```
lib/data/derive.ts   PURE logic, no I/O — 45 tests. goingQuiet, dueWithin, isActive/isAwaiting,
                     expiringSoon, outcomes, ladderFor
lib/data/matters.ts  queries only; re-exports derive
lib/viewer.ts        the ONE authorisation lookup. Ignores ?as= when live
components/          primitives · staff-view · client-view · s56-card · s56-ladder · client-search
app/(app)/dashboard  board · clients · enquiries · matter/[code] · branch/[office] · consultant/[name]
supabase/paste/      SQL to paste. Order: 01 → 06 → 07 → 03 → 05
```

## Rules that cost something to rediscover
- ⛔ Never print a raw DB error to the user — column and policy names leak.
- ⛔ Client sees no s56 date and no enquiries. Not restricted — **no policy at all**.
- ⛔ Matter page title is the CODE, never the name (PII in tabs/screenshots).
- ⛔ Grant rate is `null`, never `0`, when nothing is decided.
- ⛔ One message for "not found" and "not yours" — otherwise it enumerates clients.
- ⛔ The s56 ladder (7/14/21/26) assumes 28 days. Shorter letters drop rungs; say so.
- Brand navy/gold are **eyeballed** — get hexes from Robinder's logo.
- `npm run check` before any commit. Brace-balance is not compilation; tsc has caught 2 real bugs
  that reading did not.

## Open
Quote (`QUOTE-P3-DASHBOARD.md`, option A = 34h / USD 1,190) · brand hexes (needs Robinder's logo) ·
company-vs-client hosting decision · **an office source for ENQUIRIES** (see below).
~~mobile at 390px unseen~~ — the mobile project has been testing at 390×844 all along.
~~dark mode unseen~~ — closed 24 Aug, D-390.

## 24 Aug — schema sync after a week of MVP changes (D-389, D-390)

🔴 **`ENQUIRIES` column G was mapped to `office`. It is `Location` — Onshore/Offshore.** The RLS
policy compares `office` to BRISBANE/TOWNSVILLE, so the first live sync would have shown every
manager an empty list, and **RLS denying looks exactly like there being nothing there.** Green
through 100 unit checks, 82 e2e and a production build, because the sync has never run live and the
fixtures hardcode `office:'BRISBANE'`.
- G → `location`; column, type, query, fixtures and the enquiries row all follow it.
- ⛔ **`office` stays NULL — do not derive it from `assigned_to`.** An unassigned lead would vanish
  from the manager who needs it most. Null denies; denying is correct until a real source exists.
  Costs nothing today (A-16: Robinder is the only manager and he is the director).

🔴 **Dark mode had no test, and `Yale Migration` in the header rendered at 1.2:1 — invisible.**
`--navy` correctly does not invert (it paints the fixed panel); the wordmark is navy text on the
THEMED surface and needed a token that does. → `--brand-ink`.

**New guards — both negative-tested, because a gate that has never failed is not a gate:**
| | |
|---|---|
| `sync/columns.test.mjs` | Parses `MASTER_HEADERS` **out of `setup_master_sheet.gs`** and asserts the header at each mapped letter. One inserted column → **15 failures**. Also asserts G≠office and that S56's TRN/App ID/File Number are absent. **70 → 97** |
| `e2e/contrast.spec.ts` + `dark` project | Real computed luminance, no text or control below **1.6:1**. Reverting the wordmark → fails at 1.2:1. The dark project re-runs every layout and crawl spec too. **82 → 153** |

⚠️ **The contrast spec's first run gave 13 failures and 9 were false positives** (every active nav
pill — distinguished by bold accent text, not by fill). The fill assertion was removed. **A noisy
gate is the same failure as a blind one**: nine phantoms would have deleted the file inside a week
and taken the real defect with it. Same reason the bar is 1.6:1 and not WCAG's 4.5:1.

**Green at 24 Aug: typecheck · 142 unit (45 derive + 97 sync) · production build · 153 e2e.**

## Deep audit, 20 Aug — what two specialist reviews found

**Demo-critical, fixed:**
- 🔴 With `.env.local` populated the role switcher DISAPPEARS (`isLive()` ignores `?as=`), and only
  one profile exists — so the client portal and manager view could not be shown at all. The RBAC
  story *is* the demo. → `npm run dev:demo` runs the real app on fixtures with the full switcher.
  ⛔ Deliberately NOT a live-mode role preview: rows come from RLS bound to the real JWT, so a
  preview would paint client chrome over director data and lie.
- 🔴 Header read "Live from the client register" over seven invented people.
- 🔴 Dark mode inverted `--navy`, so the login hero was white-on-white — invisible text and an
  invisible submit button on the first screen a client sees.
- 🔴 `signInWithOtp` had no `shouldCreateUser: false`, so any address got a working account.
  `config.toml`'s signup setting does not govern OTP.
- 🔴 Three empty states asserted checks that had no data source. Worst: *"Every open file has been
  contacted in the last 14 days"* — `goingQuiet` skips null `last_contact`, and that is 0 of 38
  populated in the real import. The same defect fixed once in the Sheet version.

**Consistency, fixed:** one date format (four were rendering, incl. raw ISO) · one h1 size (21/24/26)
· one bar colour · one `Owner` component (Unassigned was red on three surfaces, grey on three —
including Going quiet) · stat grids reflow identically · past-deadline is solid-filled so it cannot
read as "soon" · nav backdrop full-bleed · select focus ring · pill hover · dead filter branch and
unused import removed · print rule narrowed from every `div` to cards.

**Was "known and NOT fixed" — all four now closed, 20 Aug:**

1. ✅ **s56 and enquiries sync path.** `sync/columns.ts` gained `S56_ALLOWLIST` and
   `ENQUIRY_ALLOWLIST`. ⛔ TRN · Application ID · File Number are **deliberately excluded** — they
   identify a person to the Department, the dashboard never needs them to show a deadline, and a
   web-facing copy buys nothing and risks a lot.
2. ✅ **Hourly refresh.** `app/api/sync/route.ts` + `vercel.json` cron `0 * * * *`, guarded by
   `SYNC_SECRET` or Vercel's `x-vercel-cron` header. 🔑 With no Sheets credentials it returns
   **503 `not_configured`, not 200** — a cron that silently succeeds without syncing is worse than
   one that fails loudly, and this is the exact shape of failure that produced D-292…D-296.
3. ✅ **"No new login if avoidable"** — honoured for the half where it *can* be. Staff get
   **Continue with Google** (they all have Yale-domain Google accounts, so no new login at all);
   the ~150 clients keep the magic link, because having no Google account is precisely why Looker
   could not serve them. ⚠️ **Needs Google enabled as a provider in Supabase Auth** — see below.
4. ✅ **View 2 was not distinct from View 1, View 3 was built backwards.**
   - `isActive` / `isAwaiting` split the caseload on their own stage vocabulary: being **worked**,
     versus **lodged and waiting on the Department** where there is nothing to do. Two tiles that
     reconcile, instead of one number wearing two names.
   - `dueWithin(matters, today, 14)` + the **"Due to chase"** card is the forward half he asked for.
     Overdue sorts to the TOP rather than being filtered out — a follow-up that has already slipped
     belongs at the top of a chase list. `goingQuiet` stays: the backward half was added to, not
     replaced.

**Still open, say it out loud:**
- ⚠️ **Google sign-in needs a provider switched on before it works.** Supabase → Authentication →
  Providers → Google, with a Google Cloud OAuth client on the client's account and
  `https://rmvvlvjjebsskbhjxnap.supabase.co/auth/v1/callback` as the redirect URI. Until then the
  button renders and fails. **Do not demo the Google path before switching it on** (G1).
- ⚠️ **`/api/sync` returns 503 by design** until Sheets credentials are connected. Real; not a bug.
- Fixtures carry fixed dates around late Aug 2026, so the demo's "in 1d" drifts as real dates move.
  Fine for the demo; re-date them or seed relative if the fixtures outlive the week.
- ~21h of this was never quoted. `QUOTE-P3-DASHBOARD.md`.

## Verified green, 20 Aug
`npm run check` — typecheck 0 errors · **100 unit checks** (45 derive + 55 columns) ·
production build · **82 e2e** across desktop and 390px. Rendered board checked live under
`npm run dev:demo`: Active 3 / Awaiting 2 reconcile against 5 open, chase list shows
25d overdue → 15d overdue → in 1d in that order, login shows both sign-in paths.
