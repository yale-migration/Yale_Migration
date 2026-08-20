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
create table public.matters (
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
create table public.s56_deadlines (
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
create table public.profiles (
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

-- ── indexes ────────────────────────────────────────────────────────────────
-- 🔴 NOT optional. Supabase's own guidance: wrapping the auth call in (select …)
-- is a large win, but indexing the column the POLICY FILTERS ON is the bigger
-- one. Every column named in a policy below is indexed here.
create index matters_office_idx        on public.matters   (office);
create index matters_client_email_idx  on public.matters   (lower(client_email));
create index s56_office_idx            on public.s56_deadlines (office);
create index s56_client_code_idx       on public.s56_deadlines (client_code);
create index profiles_role_idx         on public.profiles  (role);
