-- ═══════════════════════════════════════════════════════════════════════════
-- Row-level security. THIS FILE IS THE ACCESS CONTROL.
--
-- Everything the web app does is a convenience on top of this. If a route is
-- wrong, a key leaks, or a future developer forgets a filter, these policies
-- are what still refuses.
--
-- 🔴 WHY THESE ARE FUNCTIONS AND NOT INLINE EXISTS() CLAUSES
-- The obvious policy is the slow one. Supabase's guidance is explicit: an
-- inline `exists (select 1 from profiles where user_id = auth.uid() …)` is
-- re-evaluated FOR EVERY ROW. Moving it into a `security definer` function and
-- wrapping the call in `(select …)` makes the planner treat it as an initPlan
-- and evaluate it ONCE per query — a documented 100×+ difference on real tables.
--
-- ⛔ `security definer` means these functions read `profiles` with the
-- OWNER's rights, bypassing profiles' own RLS. That is deliberate and it is why
-- each one is deliberately tiny: they answer one question about the CALLER and
-- return a scalar. They never take row data as an argument — a function that
-- did could not be wrapped, and would leak the row it was asked about.
-- `search_path = ''` and fully-qualified names stop a shadowed table being
-- resolved instead of ours.
-- ═══════════════════════════════════════════════════════════════════════════

create or replace function app.current_role_name()
returns text language sql stable security definer set search_path = '' as $$
  select p.role from public.profiles p where p.user_id = (select auth.uid())
$$;

create or replace function app.current_office()
returns text language sql stable security definer set search_path = '' as $$
  select p.office from public.profiles p where p.user_id = (select auth.uid())
$$;

create or replace function app.current_client_code()
returns text language sql stable security definer set search_path = '' as $$
  select p.client_code from public.profiles p where p.user_id = (select auth.uid())
$$;

revoke execute on function app.current_role_name()   from public, anon;
revoke execute on function app.current_office()      from public, anon;
revoke execute on function app.current_client_code() from public, anon;
grant  execute on function app.current_role_name()   to authenticated;
grant  execute on function app.current_office()      to authenticated;
grant  execute on function app.current_client_code() to authenticated;

alter table public.matters        enable row level security;
alter table public.s56_deadlines  enable row level security;
alter table public.profiles       enable row level security;

-- ⛔ FORCE, so even the table owner is subject to these. Without it a future
-- job running as owner silently reads everything.
alter table public.matters        force row level security;
alter table public.s56_deadlines  force row level security;
alter table public.profiles       force row level security;

-- ── matters ────────────────────────────────────────────────────────────────
-- Three policies, SELECT only, `to authenticated` only. There is deliberately
-- no insert/update/delete policy anywhere: RLS denies by default, so the app is
-- read-only against these tables as a structural fact, not as a promise. The
-- sync uses the service role, which bypasses RLS by design.

create policy matters_director_all on public.matters
  for select to authenticated
  using ( (select app.current_role_name()) = 'director' );

create policy matters_manager_own_office on public.matters
  for select to authenticated
  using ( (select app.current_role_name()) = 'manager'
          and office = (select app.current_office()) );

-- 🔴 Bound to client_code, NOT to auth.email(). Matching on email looks simpler
-- and is worse: two rows in their own list already share one address (a 482 and
-- a 500), so an email policy would show one client the other's matter.
create policy matters_client_own on public.matters
  for select to authenticated
  using ( (select app.current_role_name()) = 'client'
          and client_code = (select app.current_client_code()) );

-- ── s56 deadlines ──────────────────────────────────────────────────────────
-- ⚠️ Staff only. A client is NOT shown a Section 56 deadline here: it is a
-- legal instrument that must be explained by the RMA, in context, with the
-- letter in hand. A date appearing unannounced on a portal is how a client
-- panics, or worse, acts on it themselves.
create policy s56_director_all on public.s56_deadlines
  for select to authenticated
  using ( (select app.current_role_name()) = 'director' );

create policy s56_manager_own_office on public.s56_deadlines
  for select to authenticated
  using ( (select app.current_role_name()) = 'manager'
          and office = (select app.current_office()) );

-- ── profiles ───────────────────────────────────────────────────────────────
-- You may read your own row and nobody else's. Not even the director: the
-- dashboard never needs to enumerate profiles, and a policy that lets it would
-- expose the whole client↔login mapping to one compromised session.
create policy profiles_own_row on public.profiles
  for select to authenticated
  using ( user_id = (select auth.uid()) );
