-- ═══════════════════════════════════════════════════════════════════════
-- Yale dashboard — schema + RLS, combined for the Supabase SQL editor.
--
-- Paste this WHOLE file into the SQL editor and Run. It replaces the CLI:
-- no install, no login, no personal access token.
--
-- Safe to run more than once: every object is created IF NOT EXISTS or
-- replaced, and the policies are dropped before being recreated. Re-running
-- never touches data.
--
-- Generated from 0001_schema.sql + 0002_rls.sql — edit those, not this.
-- ═══════════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════════════
-- Yale dashboard — schema.
--
-- ⛔ This mirrors Google Sheets. Sheets is the SYSTEM OF RECORD; this is a
--    read replica the web app can enforce row-level security over, which a
--    spreadsheet fundamentally cannot. Nothing here writes back.
--
-- ⛔ NO CREDENTIAL COLUMNS, EVER. Their workbooks hold ~1,200 plaintext
--    passwords including ImmiAccount logins (A-18). The sync carries an
--    explicit allowlist; this table has nowhere to put one even by accident.
-- ═══════════════════════════════════════════════════════════════════════════

create schema if not exists app;

-- ── matters ────────────────────────────────────────────────────────────────
-- GRAIN: one row per MATTER, not per person (D-11). A returning client is a
-- new row with a new code; the old row is closed.
create table if not exists public.matters (
  client_code       text primary key,               -- YM-2026-#####
  full_name         text not null,
  client_email      text,                           -- MASTER F, the reliable identity key (D-52/54)
  office            text not null,                  -- BRISBANE | TOWNSVILLE | PHILIPPINES
  team              text,
  consultant        text,
  visa_type         text,
  visa_variant      text,
  processing_stage  text,                           -- THEIR vocabulary (D-51..56)
  visa_outcome      text,
  grant_date        date,
  visa_expiry       date,
  last_contact      date,
  next_due          date,
  docs_outstanding  text,
  folder_url        text,
  synced_at         timestamptz not null default now()
);

-- ── section 56 deadlines ───────────────────────────────────────────────────
-- Kept separate for the same reason the sheet keeps a separate tab: matching an
-- inbound Department letter to a client row means guessing, and a wrong guess
-- writes a legal deadline onto the wrong client. The link is nullable and set
-- by a human.
create table if not exists public.s56_deadlines (
  id                bigint generated always as identity primary key,
  client_code       text references public.matters(client_code) on delete set null,
  client_name       text,
  office            text not null,                  -- denormalised so RLS never needs a join
  subclass          text,
  letter_date       date,
  days_allowed      int,
  due_date_legal    date,
  due_date_internal date,                           -- legal − 2 (D-58)
  deadline_sentence text,                           -- verbatim. The human check on the dates.
  status            text,
  needs_review      boolean not null default false,
  synced_at         timestamptz not null default now()
);

-- ── profiles ───────────────────────────────────────────────────────────────
-- The ONLY link between a login and what it may see. Created deliberately by
-- staff — never inferred, never self-served.
create table if not exists public.profiles (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  role        text not null check (role in ('client','manager','director')),
  office      text,                                 -- managers
  client_code text references public.matters(client_code) on delete set null,
  full_name   text,
  created_at  timestamptz not null default now(),

  -- 🔴 A role without its scope is the dangerous state: a manager with a NULL
  -- office would fall through to "matches nothing" today, but one careless
  -- policy edit later it becomes "matches everything". Refuse it at the door.
  constraint manager_needs_office
    check (role <> 'manager' or office is not null),
  constraint client_needs_code
    check (role <> 'client'  or client_code is not null)
);

-- ═════════════════════════════════════════════════════════════════════════
-- 🔴 SELF-HEAL — same reason as 06. (D-406)
--
-- `create table if not exists` does NOTHING to a table that already exists,
-- including nothing about a column added to the definition later. On 26 Aug
-- that exact gap made 06 fail on the live project: `location` had been added
-- to the enquiries definition and never to the database.
--
-- ⛔ Add a column above and you MUST add it here too, or the next re-run on a
-- real database silently keeps the old shape and fails somewhere else.
-- ═════════════════════════════════════════════════════════════════════════

alter table public.matters add column if not exists client_code        text;
alter table public.matters add column if not exists full_name          text;
alter table public.matters add column if not exists client_email       text;
alter table public.matters add column if not exists office             text;
alter table public.matters add column if not exists team               text;
alter table public.matters add column if not exists consultant         text;
alter table public.matters add column if not exists visa_type          text;
alter table public.matters add column if not exists visa_variant       text;
alter table public.matters add column if not exists processing_stage   text;
alter table public.matters add column if not exists visa_outcome       text;
alter table public.matters add column if not exists grant_date         date;
alter table public.matters add column if not exists visa_expiry        date;
alter table public.matters add column if not exists last_contact       date;
alter table public.matters add column if not exists next_due           date;
alter table public.matters add column if not exists docs_outstanding   text;
alter table public.matters add column if not exists folder_url         text;
alter table public.matters add column if not exists synced_at          timestamptz;

alter table public.s56_deadlines add column if not exists client_code        text;
alter table public.s56_deadlines add column if not exists client_name        text;
alter table public.s56_deadlines add column if not exists office             text;
alter table public.s56_deadlines add column if not exists subclass           text;
alter table public.s56_deadlines add column if not exists letter_date        date;
alter table public.s56_deadlines add column if not exists days_allowed       int;
alter table public.s56_deadlines add column if not exists due_date_legal     date;
alter table public.s56_deadlines add column if not exists due_date_internal  date;
alter table public.s56_deadlines add column if not exists deadline_sentence  text;
alter table public.s56_deadlines add column if not exists status             text;
alter table public.s56_deadlines add column if not exists needs_review       text;
alter table public.s56_deadlines add column if not exists synced_at          timestamptz;

alter table public.profiles add column if not exists role               text;
alter table public.profiles add column if not exists office             text;
alter table public.profiles add column if not exists client_code        text;
alter table public.profiles add column if not exists full_name          text;
alter table public.profiles add column if not exists created_at         timestamptz;

-- ── indexes ────────────────────────────────────────────────────────────────
-- 🔴 NOT optional. Supabase's own guidance: wrapping the auth call in (select …)
-- is a large win, but indexing the column the POLICY FILTERS ON is the bigger
-- one. Every column named in a policy below is indexed here.
create index if not exists matters_office_idx        on public.matters   (office);
create index if not exists matters_client_email_idx  on public.matters   (lower(client_email));
create index if not exists s56_office_idx            on public.s56_deadlines (office);
create index if not exists s56_client_code_idx       on public.s56_deadlines (client_code);
create index if not exists profiles_role_idx         on public.profiles  (role);

-- ── policies are dropped first so this file is re-runnable ──────────────
drop policy if exists matters_director_all        on public.matters;
drop policy if exists matters_manager_own_office  on public.matters;
drop policy if exists matters_client_own          on public.matters;
drop policy if exists s56_director_all            on public.s56_deadlines;
drop policy if exists s56_manager_own_office      on public.s56_deadlines;
drop policy if exists profiles_own_row            on public.profiles;

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
