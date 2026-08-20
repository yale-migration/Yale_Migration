-- ═══════════════════════════════════════════════════════════════════════════
-- DEMO DATA — invented people, so the live app has something to render.
--
-- ⚠️ THIS ONE COMMITS. The verification script rolled back; this does not.
-- Every row is prefixed `YM-DEMO-` so it can be removed in one statement, and
-- 04-remove-demo-data.sql does exactly that.
--
-- ⛔ NOT REAL CLIENTS. Invented names, example.com addresses. Real client data
-- goes in only after the company hosting question is settled.
--
-- Shapes chosen to mirror the awkward cases, not a happy path:
--   · two matters sharing one email address (as two rows in Yale's own list do)
--   · a matter with NO consultant — the files nobody owns are the ones that go quiet
--   · a Section 56 allowing 14 days, not 28, so no screen can assume 28
--   · a Section 56 with NO due date — nothing is watching it, worse than a near one
--   · an already-expired visa, which is its own state and not merely "soon"
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.matters
  (client_code, full_name, client_email, office, team, consultant, visa_type,
   processing_stage, visa_outcome, visa_expiry, last_contact, next_due, docs_outstanding)
values
  ('YM-DEMO-0001','A. NGUYEN','a.nguyen@example.com','BRISBANE','Filipino','Rey','485',
   'Documents Pending','Pending', current_date + 5,  current_date - 7,  current_date - 1,
   'Bank statements — last 3 months, Health insurance certificate'),
  ('YM-DEMO-0002','B. SHARMA','shared@example.com','BRISBANE','Indian','RJ','482',
   'Documents Pending','Pending', current_date + 22, current_date - 23, current_date - 16,
   'Employment contract'),
  ('YM-DEMO-0003','C. REYES','shared@example.com','BRISBANE','Indian','Priyanka','500',
   'Lodged','Pending', current_date + 96, current_date - 2, null, null),
  ('YM-DEMO-0004','D. SINGH','d.singh@example.com','TOWNSVILLE','Filipino','Star','189',
   'Awaiting Outcome','Pending', current_date + 140, current_date - 1, null, null),
  -- no consultant on purpose
  ('YM-DEMO-0005','E. TAN','e.tan@example.com','TOWNSVILLE','Filipino', null,'491',
   'Documents Pending','Pending', current_date + 60, current_date - 33, current_date - 26,
   'Skills assessment, Police check'),
  -- already expired
  ('YM-DEMO-0006','F. OKAFOR','f.okafor@example.com','BRISBANE','Filipino','Rey','500',
   'Documents Complete','Pending', current_date - 3, current_date - 4, null, null),
  ('YM-DEMO-0007','G. KAUR','g.kaur@example.com','BRISBANE','Indian','Inder','820/801',
   'Closed','Granted', null, current_date - 20, null, null)
on conflict (client_code) do nothing;

insert into public.s56_deadlines
  (client_code, client_name, office, subclass, letter_date, days_allowed,
   due_date_legal, due_date_internal, deadline_sentence, needs_review)
values
  ('YM-DEMO-0001','A. NGUYEN','BRISBANE','485', current_date - 7, 28,
   current_date + 22, current_date + 20,
   'You have 28 days starting on the day after we emailed this request to give us the information we have asked for.', false),
  -- 14 days, NOT 28 — the number is parsed from the letter, never assumed
  ('YM-DEMO-0005','E. TAN','TOWNSVILLE','491', current_date - 9, 14,
   current_date + 5, current_date + 3,
   'You have 14 days starting on the day after we emailed this request.', true),
  -- 🔴 no dates at all: the deadline was never extracted, so NOTHING is watching
  -- it. This must render as critical, not as a calm grey row.
  ('YM-DEMO-0002','B. SHARMA','BRISBANE','482', current_date - 2, null,
   null, null, null, true);

select 'Seeded ' || count(*) || ' demo matters. Now sign in, then run the profile block below.'
from public.matters where client_code like 'YM-DEMO-%';

-- ═══════════════════════════════════════════════════════════════════════════
-- AFTER YOU HAVE SIGNED IN ONCE at /login, run ONE of these.
--
-- Nothing is visible until a profile row exists — signup is disabled and a
-- logged-in user with no profile sees nothing at all. That is the correct
-- default and it is covered by a test, not an accident.
-- ═══════════════════════════════════════════════════════════════════════════

-- DIRECTOR — sees every branch. Put YOUR sign-in address here.
-- insert into public.profiles (user_id, role, full_name)
-- select id, 'director', 'Robinder Pal Singh' from auth.users
-- where email = 'CHANGE-ME@yalemigration.com.au'
-- on conflict (user_id) do update set role = excluded.role;

-- BRANCH MANAGER — Brisbane only.
-- insert into public.profiles (user_id, role, office, full_name)
-- select id, 'manager', 'BRISBANE', 'Brisbane manager' from auth.users
-- where email = 'CHANGE-ME@yalemigration.com.au'
-- on conflict (user_id) do update set role = excluded.role, office = excluded.office;

-- CLIENT — one matter, nothing else. Good for showing the access model live.
-- insert into public.profiles (user_id, role, client_code, full_name)
-- select id, 'client', 'YM-DEMO-0001', 'A. Nguyen' from auth.users
-- where email = 'CHANGE-ME@example.com'
-- on conflict (user_id) do update set role = excluded.role, client_code = excluded.client_code;
