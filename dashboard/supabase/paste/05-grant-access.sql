-- ═══════════════════════════════════════════════════════════════════════════
-- GRANT ACCESS — link a signed-in account to a role.
--
-- ⚠️ THE PERSON MUST SIGN IN ONCE FIRST. There is no row in auth.users until
-- they do, so this finds nobody and tells you so rather than failing silently.
--
-- ⛔ This is the ONLY way anyone gains visibility. Signup is disabled, and a
-- logged-in user with no profile row sees nothing. That is the designed
-- default, it is covered by a test, and it is why the screen says
-- "Your account is not connected to a file yet."
--
-- 🔑 THE ADDRESS APPEARS IN EXACTLY ONE PLACE — the line below. It used to be
-- repeated four times per grant, which is four chances to update three of them
-- and then debug a result that is telling the truth about the wrong person.
-- ═══════════════════════════════════════════════════════════════════════════

-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │  EDIT THIS ONE LINE, THEN RUN.                                          │
-- └─────────────────────────────────────────────────────────────────────────┘
create or replace view app_grant_target as select 'CHANGE-ME@yalemigration.com.au'::text as email;


-- ── DIRECTOR — sees every branch, every matter, every deadline ─────────────
-- Robinder. ⛔ Give this to as few people as the practice can tolerate: it is
-- the only role with no scope restriction at all.
insert into public.profiles (user_id, role, full_name)
select u.id, 'director', 'Robinder Pal Singh'
from auth.users u, app_grant_target t
where lower(u.email) = lower(t.email)
on conflict (user_id) do update
  set role = 'director', office = null, client_code = null,
      full_name = excluded.full_name;


-- ── Did it work? Says WHY if it did not, rather than returning nothing. ────
select case
  when not exists (select 1 from auth.users u, app_grant_target t
                   where lower(u.email) = lower(t.email))
    then '🔴 That address has never signed in. Open /login, sign in once, then run this again.'
  when exists (select 1 from public.profiles p
               join auth.users u on u.id = p.user_id, app_grant_target t
               where lower(u.email) = lower(t.email))
    then '✅ Linked. Refresh the dashboard.'
  else '🔴 The user exists but no profile was created — check the insert above for an error.'
end as result;


-- ═══════════════════════════════════════════════════════════════════════════
-- THE OTHER TWO ROLES — change the address above, uncomment one, run again.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── BRANCH MANAGER — one office only ───────────────────────────────────────
-- 🔴 `office` IS UPPERCASE: 'BRISBANE' / 'TOWNSVILLE'. That is what the MASTER
-- sheet contains (all 38 real rows read BRISBANE) and what the RLS policy
-- compares with `=`, which is case-SENSITIVE.
--
-- ⛔ 'Brisbane' matches NOTHING. It does not error. The manager simply sees an
-- empty board that looks like a quiet week — and this file shipped with exactly
-- that mistake in its own example until it was caught reading the seed data.
-- Run the "valid offices" query at the bottom before typing a value.
--
-- insert into public.profiles (user_id, role, office, full_name)
-- select u.id, 'manager', 'BRISBANE', 'Name Here'
-- from auth.users u, app_grant_target t
-- where lower(u.email) = lower(t.email)
-- on conflict (user_id) do update
--   set role = 'manager', office = excluded.office, client_code = null,
--       full_name = excluded.full_name;


-- ── CLIENT — exactly one file ──────────────────────────────────────────────
-- 🔴 Bound to `client_code`, NOT to the email address. Two people share one
-- family matter, addresses change, and a typo'd email would otherwise hand
-- someone another person's visa file.
--
-- insert into public.profiles (user_id, role, client_code, full_name)
-- select u.id, 'client', 'YM-DEMO-0001', 'Name Here'
-- from auth.users u, app_grant_target t
-- where lower(u.email) = lower(t.email)
-- on conflict (user_id) do update
--   set role = 'client', office = null, client_code = excluded.client_code,
--       full_name = excluded.full_name;


-- ── Who has access right now? Run this any time. ───────────────────────────
select u.email, p.role, p.office, p.client_code, p.full_name
from public.profiles p join auth.users u on u.id = p.user_id
order by p.role, u.email;


-- ═══════════════════════════════════════════════════════════════════════════
-- ⛔ BEFORE GRANTING A MANAGER: what offices actually exist, and would they
-- see anything? A role that matches no rows is the failure mode here, and it
-- is invisible from the profiles table alone.
-- ═══════════════════════════════════════════════════════════════════════════
select office, count(*) as matters
from public.matters
group by office
order by matters desc;

-- Every manager, and how many matters their office scope actually returns.
-- 🔴 A zero here means a case or spelling mismatch, not a quiet branch.
select u.email, p.office, count(m.client_code) as visible_matters
from public.profiles p
join auth.users u on u.id = p.user_id
left join public.matters m on m.office = p.office
where p.role = 'manager'
group by u.email, p.office
order by visible_matters;
