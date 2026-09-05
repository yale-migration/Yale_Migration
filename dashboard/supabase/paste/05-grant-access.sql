-- ═══════════════════════════════════════════════════════════════════════════
-- GRANT ACCESS — give a signed-in account a role.
--
-- HOW TO USE: pick ONE block below, change the email, select just that block,
-- press Run. That is all.
--
-- ⚠️ THE PERSON MUST SIGN IN ONCE FIRST. There is no account until they do, so
-- running this beforehand quietly does nothing. Sign in → you will see
-- "Your account is not connected to a file yet" → then run this.
--
-- ⛔ This is the ONLY way anyone gains visibility. Signup is disabled, and a
-- signed-in user with no row here sees nothing at all. That is by design.
--
-- 🔑 Re-running is safe. Each block overwrites that person's existing role, so
-- it is also how you CHANGE someone's role or move a manager to another office.
-- ═══════════════════════════════════════════════════════════════════════════


-- ══ 1 · DIRECTOR — sees every branch, every matter ═════════════════════════
-- Robinder. ⛔ Give this to as few people as the practice can tolerate: it is
-- the only role with no limit on what it can see.

insert into public.profiles (user_id, role, office, client_code, full_name)
select id, 'director', null, null, 'Robinder Pal Singh'
from auth.users
where email = 'CHANGE-ME@yalemigration.com.au'      -- ← EDIT THIS
on conflict (user_id) do update
  set role = 'director', office = null, client_code = null,
      full_name = excluded.full_name;


-- ══ 2 · BRANCH MANAGER — one office only ═══════════════════════════════════
-- 🔴 THE OFFICE MUST BE UPPERCASE: 'BRISBANE' or 'TOWNSVILLE'.
-- The security rule compares it exactly, so 'Brisbane' matches NOTHING. It does
-- not show an error — the manager just sees an empty board that looks like a
-- quiet week. This file shipped with that exact mistake in its own example.

insert into public.profiles (user_id, role, office, client_code, full_name)
select id, 'manager', 'BRISBANE', null, 'Branch Manager'
from auth.users
where email = 'CHANGE-ME@yalemigration.com.au'      -- ← EDIT THIS
on conflict (user_id) do update
  set role = 'manager', office = excluded.office, client_code = null,
      full_name = excluded.full_name;


-- ══ 3 · CLIENT — exactly one file ══════════════════════════════════════════
-- 🔴 Tied to the CLIENT CODE, not the email. Families share an address, people
-- change addresses, and a mistyped email would otherwise hand someone another
-- person's visa file. Demo codes are YM-DEMO-0001 … YM-DEMO-0007.

insert into public.profiles (user_id, role, office, client_code, full_name)
select id, 'client', null, 'YM-DEMO-0001', 'Client'
from auth.users
where email = 'CHANGE-ME@example.com'               -- ← EDIT THIS
on conflict (user_id) do update
  set role = 'client', office = null, client_code = excluded.client_code,
      full_name = excluded.full_name;


-- ═══════════════════════════════════════════════════════════════════════════
-- ══ CHECK IT WORKED — run this on its own, any time ════════════════════════
-- Shows every account, its role, and HOW MANY FILES IT WILL ACTUALLY SEE.
-- 🔴 Read the last column. A role row proves nothing; a scope that matches zero
-- rows is the failure this project keeps hitting, and it is invisible from the
-- role alone.
-- ═══════════════════════════════════════════════════════════════════════════
select
  u.email,
  coalesce(p.role, '🔴 no role — sees nothing') as role,
  p.office,
  p.client_code,
  case
    when p.role = 'director' then (select count(*) from public.matters)
    when p.role = 'manager'  then (select count(*) from public.matters m where m.office = p.office)
    when p.role = 'client'   then (select count(*) from public.matters m where m.client_code = p.client_code)
    else 0
  end as files_they_can_see
from auth.users u
left join public.profiles p on p.user_id = u.id
order by p.role nulls last, u.email;


-- ══ Valid values, if you need to check ═════════════════════════════════════
-- select distinct office from public.matters;              -- offices that exist
-- select client_code, full_name from public.matters;       -- codes that exist
