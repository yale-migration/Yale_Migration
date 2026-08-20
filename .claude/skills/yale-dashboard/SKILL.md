---
name: yale-dashboard
description: Standards for the Yale Phase-3 dashboard (Next.js App Router + Supabase RLS). Load before writing or reviewing any file under dashboard/ — auth, RLS, data access, components, or tests.
---

# Yale dashboard — build standards

Verified against Supabase and Next.js docs on **20 Aug 2026**. Where this contradicts memory,
this wins; where the docs have since moved, the docs win — re-check before assuming.

---

## 🔴 The three rules that outrank everything

**1. RLS is the access control. The app is not.**
Every table carrying client data has `enable row level security` and policies. A `WHERE` clause in a
Server Component is a convenience, never a control. If the API layer is bypassed — a leaked anon key,
a mistaken route, a future developer — the database must still refuse.

**2. Never trust `getSession()` on the server.**
It reads the cookie without revalidating. **Use `getClaims()`** — it validates the token, directly or
by calling `getUser()`. `getUser()` is for when you need a fresh user record; `getSession()` only when
you need the raw token, and never for an authorisation decision.

**3. Nothing that looks like a credential is ever synced, logged, or rendered.**
Their workbooks hold ~1,200 plaintext credentials including ImmiAccount logins (A-18). The sync uses
an **explicit column allowlist**. ⛔ Never a denylist — a denylist fails open the moment someone adds
a column upstream.

---

## Auth

```ts
// middleware — refresh the token and hand it forward
const { data } = await supabase.auth.getClaims()
```

- `@supabase/ssr` only. ⛔ `@supabase/auth-helpers-*` is superseded — do not install it.
- Two clients, never shared: `lib/supabase/client.ts` (browser) and `lib/supabase/server.ts`
  (Server Components / Route Handlers, cookie-aware, created **per request** — never module-scope).
- Middleware refreshes the token and passes it on via `request.cookies.set` so Server Components
  do not each try to refresh the same token.
- **Magic link only.** No passwords. Given A-18, adding ~150 new passwords to this practice's estate
  would be actively irresponsible — and a client who never sets one cannot leak one.

## RLS

🔴 **The obvious policy is the slow one.** Supabase's own guidance:

```sql
-- ⛔ SLOW — re-evaluated per row
create policy p on matters for select
  using (exists (select 1 from profiles where user_id = auth.uid() and ...));

-- ✅ security definer function, wrapped in (select …) so the planner caches it as an initPlan
create policy p on matters for select using ( (select app.is_director()) );
```

- Wrap **every** `auth.uid()` / `auth.jwt()` / helper call in `(select …)`. Documented 100×+ effect.
- Prefer `col in (select … where user_id = auth.uid())` over
  `auth.uid() in (select … where team = table.col)` — the first is dramatically faster.
- **Index every column a policy filters on** (`office`, `client_code`). The wrap alone is not enough;
  the index is the bigger win.
- A `security definer` function must set `search_path = ''` and be schema-qualified throughout.
- One policy per role per action, named for what it permits. `to authenticated` explicitly —
  never leave a policy open to `anon`.

## Data access

- Server Components read data. Client Components take it as props.
- ⛔ **The service-role key never appears in anything the browser can reach.** It exists only in the
  sync job. It bypasses RLS entirely — that is its purpose and its danger.
- The app is **read-only** against `matters`. Sheets is the system of record; two writers on one row
  is the defect shape this project keeps hitting, and here it would be a client and a consultant.
- Every query is typed from generated DB types. No `any`, no hand-written row shapes that can drift.

## Components

- Server Component by default. `'use client'` only for actual interactivity, as deep in the tree as
  possible.
- shadcn/ui + Tailwind. **Design tokens come from the published canvas** — `--paper #f4f6f4`,
  `--accent #0d5c63`, Georgia headings, `--r 10px`, the `good/warn/crit` trio. Do not invent colours.
- No emoji as icons. Inline SVG, stroke-based, on a 20/24px grid.
- Tap targets ≥ 44px. Clients are on phones.
- Every list has a designed **empty state** that says what it means — "nobody has gone quiet" is
  information; a blank box is a bug the user has to diagnose.

## Language rules — this is a regulated practice

- ⛔ **Never a predicted decision date.** On an agent's own portal it reads as a commitment, and
  nobody at Yale controls Department processing times.
- ⛔ **The dashboard never advises.** It reports status. Only the RMA advises (MARN 1573959).
- Deadlines: show the **internal** date (legal − 2, D-58) with the legal date beside it. A screen
  showing only the legal date invites working to the wire.
- Use **their** vocabulary for stages and outcomes (D-51…56), not ours.

## Tests — what must be tested, and what need not be

🔴 **RLS policy tests come before any UI.** A policy that leaks a row is the only defect in this
build that cannot be walked back — a client seeing another client's matter is a notifiable breach,
not a bug report.

Every policy needs a test that a **wrong** actor gets **zero rows** — not "the right actor sees their
row". Those are different assertions and only the first one is the control. Test:

- client A cannot read client B's matter
- a Brisbane manager gets **no** Townsville rows
- an authenticated user with **no** profile row gets nothing
- `anon` gets nothing
- the director sees all offices

⚠️ A test that passes because the table is empty proves nothing. Seed first, assert counts, and
assert a **non-zero** baseline before asserting a zero.
