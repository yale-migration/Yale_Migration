-- Enquiries table + RLS. Paste into the SQL editor and Run. Re-runnable.
-- Adds view 7 of the seven Robinder named: "new enquiries this week".

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
  office          text,          -- 🔑 denormalised so RLS never needs a join
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

-- ── demo rows, so the view has something to show ──────────────────────
delete from public.enquiries where name like 'DEMO %';
insert into public.enquiries
  (enquiry_date, name, phone, email, channel, visa_interest, office, assigned_to, status, follow_up_due, last_contact)
values
  (current_date - 1, 'DEMO Priya R.',  '0400 111 222', 'priya@example.com',  'Facebook',  '500', 'BRISBANE',   'Rey',      'New',            current_date + 6, null),
  (current_date - 2, 'DEMO Chen W.',   '0400 333 444', 'chen@example.com',   'Website',   '485', 'BRISBANE',   'RJ',       'Contacted',      current_date + 5, current_date - 1),
  (current_date - 4, 'DEMO Amara O.',  '0400 555 666', null,                 'WhatsApp',  '482', 'TOWNSVILLE', 'Star',     'New',            current_date + 3, null),
  -- 🔴 a number and no name. 82 rows in their own enquiry log look exactly like
  -- this, and any view that quietly drops them under-reports the pipeline.
  (current_date - 5, null,             '0400 777 888', null,                 'Phone',     null,  'BRISBANE',   null,       'New',            current_date + 2, null),
  (current_date - 9, 'DEMO Sofia M.',  '0400 999 000', 'sofia@example.com',  'Referral',  '189', 'BRISBANE',   'Priyanka', 'Pending Decision', current_date - 2, current_date - 8),
  (current_date - 34,'DEMO Ken T.',    '0401 222 333', 'ken@example.com',    'Instagram', '600', 'TOWNSVILLE', 'Cristelle','Not Proceeding', null, current_date - 30);

select 'Enquiries table ready. ' || count(*) || ' demo enquiries.' as result from public.enquiries;
