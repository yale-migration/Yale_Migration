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

**Known and NOT fixed — say these out loud rather than let them be discovered:**
- **s56 and enquiries have no sync path.** The allowlist maps MASTER → `matters` only. Both surfaces
  are real UI over data nobody feeds yet.
- **Hourly refresh does not exist.** `sync.ts` has no caller and no schedule.
- **"No new login if avoidable" is reversed** — magic link for everyone. True of the Looker plan,
  not this build.
- **View 2 "ongoing" is not distinct from View 1**; **View 3** is built backwards as dormancy rather
  than a forward 1–2 week due list.
- ~21h of this was never quoted. `QUOTE-P3-DASHBOARD.md`.
