-- ═══════════════════════════════════════════════════════════════════════════
-- GRANT ACCESS — link a signed-in account to a role.
--
-- ⚠️ The person must SIGN IN ONCE FIRST. There is no row in auth.users until
-- they do, so this finds nobody and reports it rather than failing silently.
--
-- ⛔ This is the ONLY way anyone gains visibility. Signup is disabled and a
-- logged-in user with no profile row sees nothing — that is the designed
-- default, covered by a test, and the reason the screen said "not linked yet".
-- ═══════════════════════════════════════════════════════════════════════════

-- ── DIRECTOR — sees every branch ──────────────────────────────────────────
insert into public.profiles (user_id, role, full_name)
select id, 'director', 'Sharjeel — Director (demo)'
from auth.users
where lower(email) = lower('sharry00010@gmail.com')
on conflict (user_id) do update
  set role = 'director', office = null, client_code = null,
      full_name = excluded.full_name;

-- Did it work? This tells you WHY if it did not, instead of returning nothing.
select case
  when not exists (select 1 from auth.users where lower(email) = lower('sharry00010@gmail.com'))
    then '🔴 That address has never signed in. Open /login, request a link, click it, then run this again.'
  when exists (select 1 from public.profiles p join auth.users u on u.id = p.user_id
               where lower(u.email) = lower('sharry00010@gmail.com'))
    then '✅ Linked as director. Refresh the dashboard — you should see 7 matters across both offices.'
  else '🔴 The user exists but no profile was created. Check the insert above for an error.'
end as result;


-- ═══════════════════════════════════════════════════════════════════════════
-- THE DEMO MOVE — a SECOND login as a client.
--
-- 🔑 This is the pitch. Same app, same URL, two accounts: one sees the whole
-- practice, the other sees one file and no totals at all. Robinder watching
-- that switch is worth more than any explanation of row-level security.
--
-- Sign in with a second address (a personal one is fine — the data is
-- invented), then uncomment and run:
-- ═══════════════════════════════════════════════════════════════════════════

-- insert into public.profiles (user_id, role, client_code, full_name)
-- select id, 'client', 'YM-DEMO-0001', 'A. Nguyen'
-- from auth.users where lower(email) = lower('SECOND-ADDRESS@example.com')
-- on conflict (user_id) do update
--   set role = 'client', office = null, client_code = 'YM-DEMO-0001',
--       full_name = excluded.full_name;

-- ── BRANCH MANAGER — Brisbane only, for the middle of the three ────────────
-- insert into public.profiles (user_id, role, office, full_name)
-- select id, 'manager', 'BRISBANE', 'Brisbane manager'
-- from auth.users where lower(email) = lower('THIRD-ADDRESS@example.com')
-- on conflict (user_id) do update
--   set role = 'manager', office = 'BRISBANE', client_code = null,
--       full_name = excluded.full_name;


-- ── who currently has access? ─────────────────────────────────────────────
-- ⚠️ Run this as the SQL editor (service role). The app itself cannot list
-- profiles — no policy permits it, deliberately, so one compromised session
-- cannot enumerate the whole client-to-login mapping.
select u.email, p.role, coalesce(p.office, p.client_code, 'all branches') as scope
from public.profiles p join auth.users u on u.id = p.user_id
order by p.role, u.email;
