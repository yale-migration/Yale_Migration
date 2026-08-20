# Yale dashboard — Phase 3

Role-based client and staff dashboard. Next.js App Router · Supabase (Postgres RLS + Auth) · Tailwind.

⚠️ **Status: not quoted, not deployed.** `DASHBOARD-TRACKER.md` records this as Phase 3, 40–80 h,
*"not scoped, not priced, not promised."* Treat it as a working prototype until a change order exists.

---

## Run it locally — no database needed

```bash
npm install
npm run dev        # http://localhost:3000
```

With no Supabase URL configured the app serves **synthetic fixtures** and shows a role switcher.
That is the only supported way to run it on a laptop: the live schema holds visa applicant PII, and
that stays inside company-controlled systems.

Click through **Director → Brisbane manager → Townsville manager → Client** to see the access model.

## Going live

1. Create the project in the **company** Supabase account. ⛔ Not a personal account. ⛔ Not the free
   tier — free projects pause after a week of inactivity, and a portal that sleeps is not a portal.
2. `supabase db push` — applies `0001_schema.sql` then `0002_rls.sql`.
3. **`npm run test:rls` and read every line.** Do not skip to the UI.
4. Copy `.env.example` to `.env.local` and fill in the URL and anon key.
5. Deploy to the **company Vercel team**.

## 🔴 The five things not to undo

**RLS is the access control.** `lib/data/matters.ts` runs `select *` with no office filter on
purpose. Adding `.eq('office', …)` there would make the app *look* like it enforces access, so the
next person assumes the filtering lives in TypeScript — and a route that forgets it returns
everything. A control that can be forgotten is not a control.

**`getClaims()`, never `getSession()`** on the server. `getSession()` reads the cookie without
revalidating, so an authorisation decision made on it can rest on a dead token.

**The service-role key bypasses RLS entirely.** It belongs to the sync job alone. It must never
appear in a `NEXT_PUBLIC_` variable or any file the browser can reach.

**A client is bound to `client_code`, never `auth.email()`.** Two rows in Yale's own list share an
email address — an email policy would show one client the other's matter. There is a test for
exactly this.

**No predicted decision dates, and no Section 56 dates in the client view.** The first reads as a
commitment on a registered agent's own portal; the second is a legal instrument the RMA explains
with the letter in hand.

## Layout

```
app/(app)/dashboard  the board — role decides which component renders
app/(auth)/login     magic link. No passwords, deliberately (A-18)
app/auth/callback    code → session, with an open-redirect guard
lib/supabase         per-request server client · browser client · live-vs-demo switch
lib/data             types · synthetic fixtures · queries and derived views
components           primitives, then one component per card
supabase/migrations  schema, then RLS
supabase/tests       18 pgTAP assertions. The ones that matter are the zeros.
```

Standards live in `.claude/skills/yale-dashboard`. Design tokens come from the published canvas —
do not invent colours in code.
