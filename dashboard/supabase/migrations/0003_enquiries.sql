-- ═══════════════════════════════════════════════════════════════════════════
-- ENQUIRIES — view 7 of the seven Robinder named, "new enquiries this week".
--
-- Mirrors the ENQUIRIES tab, which M8 already runs the 7/30 nurture cadence
-- over. Read-only here like everything else: M8 owns the cadence and the sheet
-- owns the truth.
--
-- ⚠️ An enquiry is NOT a matter. It is a lead who may never become a client, so
-- it gets its own table rather than a status on `matters` — a lead sitting in
-- the client register is how a practice starts counting people who never signed.
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists public.enquiries (
  id              bigint generated always as identity primary key,
  enquiry_date    date,
  name            text,
  phone           text,
  email           text,
  channel         text,          -- Facebook · Instagram · WhatsApp · Phone · Walk-in · Email · Website · Referral
  visa_interest   text,
  -- 🔴 `office` HAS NO SOURCE. The ENQUIRIES tab has no office column; sheet
  -- column G is LOCATION (Onshore/Offshore) and was wrongly mapped here until
  -- 24 Aug 2026 (D-389). Left null: the manager policy below then denies, which
  -- is the correct answer until a real source exists.
  office          text,          -- 🔑 denormalised so RLS never needs a join
  location        text,          -- Onshore / Offshore — where the PERSON is
  assigned_to     text,
  status          text,          -- THEIR vocabulary (SOP-CI-001 10B)
  follow_up_due   date,
  last_contact    date,          -- set by a human; M8 stops chasing once it is filled
  synced_at       timestamptz not null default now()
);

create index if not exists enquiries_office_idx on public.enquiries (office);
create index if not exists enquiries_date_idx   on public.enquiries (enquiry_date desc);

alter table public.enquiries enable row level security;
alter table public.enquiries force  row level security;

drop policy if exists enquiries_director_all       on public.enquiries;
drop policy if exists enquiries_manager_own_office on public.enquiries;

-- ⛔ NO CLIENT POLICY, deliberately. A client has no business seeing the
-- practice's lead pipeline — not their own enquiry record, and certainly not
-- anyone else's. RLS denies by default, so the absence of a policy IS the rule.
create policy enquiries_director_all on public.enquiries
  for select to authenticated
  using ( (select app.current_role_name()) = 'director' );

create policy enquiries_manager_own_office on public.enquiries
  for select to authenticated
  using ( (select app.current_role_name()) = 'manager'
          and office = (select app.current_office()) );
