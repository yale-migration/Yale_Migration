-- ═══════════════════════════════════════════════════════════════════════════
-- ONE USER AT EACH ROLE — the three-account setup for the demo.
--
-- 🔑 WHY THIS FILE EXISTS. Showing Robinder the same URL signed in as three
-- different people is worth more than any explanation of row-level security.
-- One sees the whole practice, one sees a single branch, one sees a single
-- file — and none of it is the app being clever, it is the database refusing.
--
-- ⚠️ ALL THREE MUST SIGN IN ONCE FIRST. There is no row in auth.users until
-- they do. Sign in, get "Your account is not connected to a file yet", THEN
-- run this. The report at the bottom names anyone who has not.
--
-- ⛔ Safe to re-run. Every insert is an upsert on user_id.
-- ═══════════════════════════════════════════════════════════════════════════

-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │  EDIT THESE THREE LINES ONLY.                                           │
-- └─────────────────────────────────────────────────────────────────────────┘
create or replace view app_grant_people as
select
  'CHANGE-ME-director@yalemigration.com.au'::text as director_email,
  'CHANGE-ME-manager@yalemigration.com.au'::text  as manager_email,
  'CHANGE-ME-client@example.com'::text            as client_email,
  -- 🔴 UPPERCASE. The RLS policy compares office with `=`, which is
  -- case-sensitive, and the sheet contains BRISBANE / TOWNSVILLE.
  -- 'Brisbane' silently matches nothing and looks like a quiet branch.
  'BRISBANE'::text                                as manager_office,
  -- Must be a client_code that exists in `matters`, or the client signs in
  -- to an empty file. The demo seed provides YM-DEMO-0001 … YM-DEMO-0007.
  'YM-DEMO-0001'::text                            as client_code;


-- ── 1 · DIRECTOR — every branch, every matter, no scope at all ─────────────
insert into public.profiles (user_id, role, full_name)
select u.id, 'director', 'Director'
from auth.users u, app_grant_people p
where lower(u.email) = lower(p.director_email)
on conflict (user_id) do update
  set role = 'director', office = null, client_code = null,
      full_name = excluded.full_name;


-- ── 2 · BRANCH MANAGER — one office ────────────────────────────────────────
insert into public.profiles (user_id, role, office, full_name)
select u.id, 'manager', p.manager_office, 'Branch Manager'
from auth.users u, app_grant_people p
where lower(u.email) = lower(p.manager_email)
on conflict (user_id) do update
  set role = 'manager', office = excluded.office, client_code = null,
      full_name = excluded.full_name;


-- ── 3 · CLIENT — exactly one file ──────────────────────────────────────────
insert into public.profiles (user_id, role, client_code, full_name)
select u.id, 'client', p.client_code, 'Client'
from auth.users u, app_grant_people p
where lower(u.email) = lower(p.client_email)
on conflict (user_id) do update
  set role = 'client', office = null, client_code = excluded.client_code,
      full_name = excluded.full_name;


-- ═══════════════════════════════════════════════════════════════════════════
-- THE REPORT — what each person will actually SEE, not merely what role they
-- hold. 🔴 A role row proves nothing; a scope that matches zero rows is the
-- failure this project keeps hitting, and it is invisible from `profiles`.
-- ═══════════════════════════════════════════════════════════════════════════
with people as (
  select 'director' as want, director_email as email, null::text as scope from app_grant_people
  union all
  select 'manager',  manager_email, manager_office from app_grant_people
  union all
  select 'client',   client_email,  client_code    from app_grant_people
)
select
  pe.want                                            as intended_role,
  pe.email,
  case when u.id is null then '🔴 has never signed in'
       when pr.user_id is null then '🔴 signed in, but NOT granted'
       when pr.role <> pe.want then '🔴 granted a different role: ' || pr.role
       else '✅ ' || pr.role end                     as status,
  pe.scope,
  case
    when pe.want = 'director' then (select count(*) from public.matters)
    when pe.want = 'manager'  then (select count(*) from public.matters m where m.office = pe.scope)
    when pe.want = 'client'   then (select count(*) from public.matters m where m.client_code = pe.scope)
  end                                                as matters_they_will_see
from people pe
left join auth.users u    on lower(u.email) = lower(pe.email)
left join public.profiles pr on pr.user_id = u.id
order by 1;

-- 🔑 READ THE LAST COLUMN. A director seeing 0 means the database is empty.
-- A manager seeing 0 almost always means the office string is wrong — check
-- it against `select distinct office from matters`.
