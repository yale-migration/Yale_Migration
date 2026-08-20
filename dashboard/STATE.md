# Dashboard — state of play
**One file a fresh session can read instead of the whole history.** Updated 20 Aug 2026.

## Live and working
Supabase `rmvvlvjjebsskbhjxnap` (client Google account, Sydney, Pro). `.env.local` holds the keys.
7 matters · 3 s56 · 6 enquiries · 1 profile (`sharry00010@gmail.com` = director).
**Access matrix proven 22/22 live** — every role, every table. `npm run check` green: 36 + 55 tests,
typecheck, production build.

## Architecture, decided — do not relitigate
- **RLS in Postgres is the access control.** `lib/data/matters.ts` runs unfiltered `select *` ON
  PURPOSE. Adding `.eq('office')` would make the app *look* like it enforces access.
- **One-way.** Sheets is the system of record; the app never writes. Write actions = quote option B.
- Client bound to `client_code`, never `auth.email()` — two rows in Yale's list share an address.
- `getClaims()`, never `getSession()`. Magic link only, no passwords (A-18).
- Accent **navy `#1c3a5e`** (their brand). Semantic good/warn/crit unchanged — they carry meaning.

## Layout
```
lib/data/derive.ts   PURE logic, no I/O — 36 tests. goingQuiet, expiringSoon, outcomes, ladderFor
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
Quote (`QUOTE-P3-DASHBOARD.md`, option A = 34h / USD 1,190) · mobile at 390px unseen · dark mode
unseen · brand hexes · company-vs-client hosting decision.
