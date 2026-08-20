-- ═══════════════════════════════════════════════════════════════════════════
-- RLS VERIFICATION — paste into the Supabase SQL editor and Run.
--
-- The pgTAP suite in supabase/tests needs the CLI. This does the same job with
-- plain SQL so the policies can be proven with nothing installed.
--
-- 🔴 RUN THIS BEFORE ANY REAL CLIENT DATA GOES IN. A policy that leaks a row is
-- the only defect in this build that cannot be walked back: one client seeing
-- another client's matter is a notifiable breach, not a bug report.
--
-- ⚠️ It seeds fake rows, checks, and ROLLS BACK. Nothing survives. It cannot
-- touch real data even if real data is already present.
--
-- ⚠️ Every zero-assertion is paired with a NON-ZERO baseline. A test that
-- passes because the table is empty proves nothing — that exact trap has bitten
-- this project three times already in Apps Script.
-- ═══════════════════════════════════════════════════════════════════════════
begin;

create temporary table _r(ok boolean, label text);

insert into auth.users (id, email, instance_id, aud, role)
values ('00000000-0000-0000-0000-00000000d001','dir@example.com','00000000-0000-0000-0000-000000000000','authenticated','authenticated'),
       ('00000000-0000-0000-0000-00000000a001','bne@example.com','00000000-0000-0000-0000-000000000000','authenticated','authenticated'),
       ('00000000-0000-0000-0000-00000000c001','c1@example.com','00000000-0000-0000-0000-000000000000','authenticated','authenticated'),
       ('00000000-0000-0000-0000-00000000c002','c2@example.com','00000000-0000-0000-0000-000000000000','authenticated','authenticated'),
       ('00000000-0000-0000-0000-00000000f001','none@example.com','00000000-0000-0000-0000-000000000000','authenticated','authenticated')
on conflict (id) do nothing;

insert into public.matters (client_code, full_name, client_email, office, visa_type) values
  ('ZZ-TEST-0001','TEST ONE','shared@example.com','BRISBANE','485'),
  ('ZZ-TEST-0002','TEST TWO','shared@example.com','BRISBANE','500'),   -- SAME email as above
  ('ZZ-TEST-0003','TEST THREE','three@example.com','TOWNSVILLE','482');

insert into public.s56_deadlines (client_code, client_name, office, subclass)
values ('ZZ-TEST-0001','TEST ONE','BRISBANE','485'),
       ('ZZ-TEST-0003','TEST THREE','TOWNSVILLE','482');

insert into public.profiles (user_id, role, office, client_code) values
  ('00000000-0000-0000-0000-00000000d001','director', null,      null),
  ('00000000-0000-0000-0000-00000000a001','manager', 'BRISBANE', null),
  ('00000000-0000-0000-0000-00000000c001','client',   null,      'ZZ-TEST-0001'),
  ('00000000-0000-0000-0000-00000000c002','client',   null,      'ZZ-TEST-0002');
-- f001 deliberately has NO profile row.

create or replace function pg_temp.act(uid text) returns void language plpgsql as $$
begin
  perform set_config('role','authenticated', true);
  perform set_config('request.jwt.claims',
    json_build_object('sub', uid, 'role','authenticated')::text, true);
end $$;

create or replace function pg_temp.chk(label text, got int, want int) returns void
language plpgsql as $$
begin insert into _r values (got = want, label || '  (got ' || got || ', want ' || want || ')'); end $$;

-- ── DIRECTOR ──────────────────────────────────────────────────────────────
select pg_temp.act('00000000-0000-0000-0000-00000000d001');
select pg_temp.chk('director sees every office',
  (select count(*)::int from public.matters where client_code like 'ZZ-TEST-%'), 3);
select pg_temp.chk('director sees every s56',
  (select count(*)::int from public.s56_deadlines where client_code like 'ZZ-TEST-%'), 2);
select pg_temp.chk('even the director reads only their OWN profile row',
  (select count(*)::int from public.profiles), 1);

-- ── BRISBANE MANAGER ──────────────────────────────────────────────────────
select pg_temp.act('00000000-0000-0000-0000-00000000a001');
-- baseline FIRST — prove it reads anything, so the next zero means something
select pg_temp.chk('BASELINE: manager can read at all',
  (select count(*)::int from public.matters where client_code like 'ZZ-TEST-%'), 2);
select pg_temp.chk('*** manager gets ZERO rows from the other branch',
  (select count(*)::int from public.matters where office = 'TOWNSVILLE'), 0);
select pg_temp.chk('*** manager gets ZERO s56 from the other branch',
  (select count(*)::int from public.s56_deadlines where office = 'TOWNSVILLE'), 0);

-- ── CLIENT ────────────────────────────────────────────────────────────────
select pg_temp.act('00000000-0000-0000-0000-00000000c001');
select pg_temp.chk('BASELINE: client sees their own matter',
  (select count(*)::int from public.matters where client_code = 'ZZ-TEST-0001'), 1);
-- 🔴 THE EMAIL TRAP. Rows 1 and 2 share an address, exactly as two rows in
-- Yale's own list do. A policy written against auth.email() passes everything
-- else here and fails this — by showing one client the other's file.
select pg_temp.chk('*** client CANNOT see the matter sharing their email',
  (select count(*)::int from public.matters where client_code = 'ZZ-TEST-0002'), 0);
select pg_temp.chk('*** a client sees NO s56 deadlines at all',
  (select count(*)::int from public.s56_deadlines), 0);

-- ── AUTHENTICATED, NO PROFILE ─────────────────────────────────────────────
select pg_temp.act('00000000-0000-0000-0000-00000000f001');
select pg_temp.chk('*** logged in with no profile sees NOTHING',
  (select count(*)::int from public.matters), 0);

-- ── ANON ──────────────────────────────────────────────────────────────────
select set_config('role','anon', true);
select set_config('request.jwt.claims', null, true);
select pg_temp.chk('*** anon sees nothing',
  (select count(*)::int from public.matters), 0);

-- ── RESULTS ───────────────────────────────────────────────────────────────
select set_config('role','postgres', true);
select
  case when bool_and(ok) then '✅ ALL ' || count(*) || ' CHECKS PASSED — the policies hold'
       else '🔴 ' || count(*) filter (where not ok) || ' FAILED — DO NOT PUT REAL DATA IN'
  end as verdict
from _r;

select case when ok then '  PASS  ' else '  FAIL  ' end || label as detail from _r order by ok, label;

rollback;   -- ⛔ nothing above is kept
