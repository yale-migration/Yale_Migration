-- ═══════════════════════════════════════════════════════════════════════════
-- RLS policy tests.  Run:  supabase test db
--
-- 🔴 THESE COME BEFORE ANY UI. A policy that leaks a row is the only defect in
-- this build that cannot be walked back: one client seeing another client's
-- matter is a notifiable breach, not a bug report.
--
-- ⚠️ THE ASSERTION THAT MATTERS IS THE ZERO. "The right person sees their row"
-- and "the wrong person sees nothing" are different claims, and only the second
-- is the control. Both are here — and every zero-assertion is preceded by a
-- NON-ZERO baseline for the same query, because a test that passes because the
-- table is empty proves nothing at all. That exact trap has bitten this project
-- three times in Apps Script; it is not going to bite it in Postgres.
-- ═══════════════════════════════════════════════════════════════════════════
begin;
select plan(18);

-- ── fixtures ───────────────────────────────────────────────────────────────
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000d001','director@yalemigration.com.au'),
  ('00000000-0000-0000-0000-00000000a001','bne.manager@yalemigration.com.au'),
  ('00000000-0000-0000-0000-00000000c001','client.one@example.com'),
  ('00000000-0000-0000-0000-00000000c002','client.two@example.com'),
  ('00000000-0000-0000-0000-00000000f001','nobody@example.com');

insert into public.matters (client_code, full_name, client_email, office, visa_type) values
  ('YM-2026-00001','CLIENT ONE','shared@example.com','BRISBANE','485'),
  ('YM-2026-00002','CLIENT TWO','shared@example.com','BRISBANE','500'),
  ('YM-2026-00003','CLIENT THREE','three@example.com','TOWNSVILLE','482');

insert into public.s56_deadlines (client_code, client_name, office, subclass, due_date_legal)
values ('YM-2026-00001','CLIENT ONE','BRISBANE','485','2026-09-12'),
       ('YM-2026-00003','CLIENT THREE','TOWNSVILLE','482','2026-09-20');

insert into public.profiles (user_id, role, office, client_code) values
  ('00000000-0000-0000-0000-00000000d001','director', null,      null),
  ('00000000-0000-0000-0000-00000000a001','manager', 'BRISBANE', null),
  ('00000000-0000-0000-0000-00000000c001','client',   null,      'YM-2026-00001'),
  ('00000000-0000-0000-0000-00000000c002','client',   null,      'YM-2026-00002');
-- n1 deliberately has NO profile row.

-- ── helper ────────────────────────────────────────────────────────────────
create or replace function tests.act_as(uid uuid) returns void language plpgsql as $$
begin
  perform set_config('role','authenticated', true);
  perform set_config('request.jwt.claims', json_build_object('sub', uid, 'role','authenticated')::text, true);
end $$;

-- ── DIRECTOR ──────────────────────────────────────────────────────────────
select tests.act_as('00000000-0000-0000-0000-00000000d001');
select is( (select count(*) from public.matters)::int, 3,
  'director sees every office' );
select is( (select count(distinct office) from public.matters)::int, 2,
  'director sees both offices, not one repeated' );
select is( (select count(*) from public.s56_deadlines)::int, 2,
  'director sees every s56 deadline' );

-- ── BRISBANE MANAGER ──────────────────────────────────────────────────────
select tests.act_as('00000000-0000-0000-0000-00000000a001');
-- baseline FIRST: prove the query returns something before proving it withholds.
select isnt( (select count(*) from public.matters)::int, 0,
  'baseline — the manager can read at all (so the next zero means something)' );
select is( (select count(*) from public.matters)::int, 2,
  'manager sees only their own office' );
select is( (select count(*) from public.matters where office = 'TOWNSVILLE')::int, 0,
  '🔴 manager receives ZERO rows from the other branch' );
select is( (select count(*) from public.s56_deadlines where office = 'TOWNSVILLE')::int, 0,
  '🔴 manager receives ZERO s56 deadlines from the other branch' );

-- ── CLIENT ────────────────────────────────────────────────────────────────
select tests.act_as('00000000-0000-0000-0000-00000000c001');
select is( (select count(*) from public.matters)::int, 1,
  'client sees exactly one matter' );
select is( (select client_code from public.matters), 'YM-2026-00001',
  'client sees THEIR matter' );
-- 🔴 The email trap. Matters 1 and 2 deliberately SHARE an email address,
-- exactly as two rows in Yale's own list do. A policy written against
-- auth.email() instead of client_code passes every other test here and fails
-- this one — by showing one client the other's file.
select is( (select count(*) from public.matters where client_code = 'YM-2026-00002')::int, 0,
  '🔴 client CANNOT see another client who shares their email address' );
select is( (select count(*) from public.s56_deadlines)::int, 0,
  '🔴 a client sees NO s56 deadlines — the RMA explains those, not a portal' );

select tests.act_as('00000000-0000-0000-0000-00000000c002');
select is( (select client_code from public.matters), 'YM-2026-00002',
  'the other client sees only their own, confirming it is not a fixed filter' );

-- ── AUTHENTICATED BUT NO PROFILE ──────────────────────────────────────────
-- The state a newly-invited user is in for the seconds before staff link them.
select tests.act_as('00000000-0000-0000-0000-00000000f001');
select is( (select count(*) from public.matters)::int, 0,
  '🔴 a logged-in user with no profile sees NOTHING' );
select is( (select count(*) from public.s56_deadlines)::int, 0,
  '🔴 ...and no deadlines either' );

-- ── ANON ──────────────────────────────────────────────────────────────────
select set_config('role','anon', true);
select set_config('request.jwt.claims', null, true);
select is( (select count(*) from public.matters)::int, 0,
  '🔴 anon sees nothing' );
select is( (select count(*) from public.s56_deadlines)::int, 0,
  '🔴 anon sees no deadlines' );

-- ── PROFILES ARE NOT ENUMERABLE ───────────────────────────────────────────
select tests.act_as('00000000-0000-0000-0000-00000000d001');
select is( (select count(*) from public.profiles)::int, 1,
  '🔴 even the DIRECTOR reads only their own profile row' );

-- ── WRITES ARE STRUCTURALLY IMPOSSIBLE ────────────────────────────────────
-- No insert/update/delete policy exists, so RLS denies by default. This proves
-- the app is read-only as a property of the database, not as a promise in a doc.
select tests.act_as('00000000-0000-0000-0000-00000000d001');
select throws_ok(
  $$ update public.matters set full_name = 'CHANGED' where client_code = 'YM-2026-00001' $$,
  null,
  '🔴 even the director cannot WRITE — Sheets is the system of record' );

select * from finish();
rollback;
