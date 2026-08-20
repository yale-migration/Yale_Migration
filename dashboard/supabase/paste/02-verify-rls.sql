-- ═══════════════════════════════════════════════════════════════════════════
-- RLS VERIFICATION — paste into the Supabase SQL editor and Run.
--
-- 🔴 RUN THIS BEFORE ANY REAL CLIENT DATA GOES IN. A policy that leaks a row is
-- the only defect in this build that cannot be walked back: one client seeing
-- another client's matter is a notifiable breach, not a bug report.
--
-- ⚠️ Seeds fake rows, checks, and ROLLS BACK. Nothing survives. It cannot touch
-- real data even if real data is already present.
--
-- ═══════════ WHY THIS IS ONE FUNCTION AND NOT A SCRIPT ═══════════
-- Two earlier versions collected results in a TEMP TABLE and both failed in the
-- Supabase SQL editor — first "permission denied for table _r", then "relation
-- _r does not exist" even fully qualified. Chasing each error was the wrong
-- move: a temp table has to survive role switches AND whatever connection
-- handling the editor does, and neither is something this script controls.
--
-- So there is no temp table. Everything happens inside ONE plpgsql function
-- that holds its results in a local variable — no cross-role table access, no
-- reliance on session state outliving a statement. The failure mode is designed
-- out rather than worked around.
-- ═══════════════════════════════════════════════════════════════════════════
begin;

-- ── seed, as the editor's own role ────────────────────────────────────────
insert into auth.users (id, email, instance_id, aud, role)
values ('00000000-0000-0000-0000-00000000d001','dir@example.com','00000000-0000-0000-0000-000000000000','authenticated','authenticated'),
       ('00000000-0000-0000-0000-00000000a001','bne@example.com','00000000-0000-0000-0000-000000000000','authenticated','authenticated'),
       ('00000000-0000-0000-0000-00000000c001','c1@example.com','00000000-0000-0000-0000-000000000000','authenticated','authenticated'),
       ('00000000-0000-0000-0000-00000000c002','c2@example.com','00000000-0000-0000-0000-000000000000','authenticated','authenticated'),
       ('00000000-0000-0000-0000-00000000f001','none@example.com','00000000-0000-0000-0000-000000000000','authenticated','authenticated')
on conflict (id) do nothing;

insert into public.matters (client_code, full_name, client_email, office, visa_type) values
  ('ZZ-TEST-0001','TEST ONE','shared@example.com','BRISBANE','485'),
  ('ZZ-TEST-0002','TEST TWO','shared@example.com','BRISBANE','500'),   -- SAME email, on purpose
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

-- ── one function, one local variable, no shared state ─────────────────────
create or replace function public._yale_verify_rls()
returns table(result text)
language plpgsql
as $fn$
declare
  orig  text := current_setting('role', true);
  fails int  := 0;
  total int  := 0;
  out_  text[] := '{}';
  n     int;
  line  text;
begin
  if orig is null or orig = '' then orig := 'none'; end if;

  -- DIRECTOR ---------------------------------------------------------------
  perform set_config('role','authenticated', true);
  perform set_config('request.jwt.claims',
    '{"sub":"00000000-0000-0000-0000-00000000d001","role":"authenticated"}', true);

  select count(*) into n from public.matters where client_code like 'ZZ-TEST-%';
  total := total+1; if n <> 3 then fails := fails+1; end if;
  out_ := out_ || format('%s  director sees every office (got %s, want 3)',
                         case when n=3 then 'PASS' else 'FAIL' end, n);

  select count(*) into n from public.s56_deadlines where client_code like 'ZZ-TEST-%';
  total := total+1; if n <> 2 then fails := fails+1; end if;
  out_ := out_ || format('%s  director sees every s56 (got %s, want 2)',
                         case when n=2 then 'PASS' else 'FAIL' end, n);

  select count(*) into n from public.profiles;
  total := total+1; if n <> 1 then fails := fails+1; end if;
  out_ := out_ || format('%s  even the director reads only their OWN profile row (got %s, want 1)',
                         case when n=1 then 'PASS' else 'FAIL' end, n);

  -- BRISBANE MANAGER -------------------------------------------------------
  perform set_config('request.jwt.claims',
    '{"sub":"00000000-0000-0000-0000-00000000a001","role":"authenticated"}', true);

  -- baseline FIRST, so the zeros that follow mean something
  select count(*) into n from public.matters where client_code like 'ZZ-TEST-%';
  total := total+1; if n <> 2 then fails := fails+1; end if;
  out_ := out_ || format('%s  BASELINE: manager can read at all (got %s, want 2)',
                         case when n=2 then 'PASS' else 'FAIL' end, n);

  select count(*) into n from public.matters where office = 'TOWNSVILLE';
  total := total+1; if n <> 0 then fails := fails+1; end if;
  out_ := out_ || format('%s  *** manager gets ZERO rows from the other branch (got %s, want 0)',
                         case when n=0 then 'PASS' else 'FAIL' end, n);

  select count(*) into n from public.s56_deadlines where office = 'TOWNSVILLE';
  total := total+1; if n <> 0 then fails := fails+1; end if;
  out_ := out_ || format('%s  *** manager gets ZERO s56 from the other branch (got %s, want 0)',
                         case when n=0 then 'PASS' else 'FAIL' end, n);

  -- CLIENT -----------------------------------------------------------------
  perform set_config('request.jwt.claims',
    '{"sub":"00000000-0000-0000-0000-00000000c001","role":"authenticated"}', true);

  select count(*) into n from public.matters where client_code = 'ZZ-TEST-0001';
  total := total+1; if n <> 1 then fails := fails+1; end if;
  out_ := out_ || format('%s  BASELINE: client sees their own matter (got %s, want 1)',
                         case when n=1 then 'PASS' else 'FAIL' end, n);

  -- 🔴 THE EMAIL TRAP. Rows 1 and 2 share an address, exactly as two rows in
  -- Yale's own list do. A policy written against auth.email() instead of
  -- client_code passes everything else here and fails THIS — by showing one
  -- client the other's file.
  select count(*) into n from public.matters where client_code = 'ZZ-TEST-0002';
  total := total+1; if n <> 0 then fails := fails+1; end if;
  out_ := out_ || format('%s  *** client CANNOT see the matter sharing their email (got %s, want 0)',
                         case when n=0 then 'PASS' else 'FAIL' end, n);

  select count(*) into n from public.s56_deadlines;
  total := total+1; if n <> 0 then fails := fails+1; end if;
  out_ := out_ || format('%s  *** a client sees NO s56 deadlines at all (got %s, want 0)',
                         case when n=0 then 'PASS' else 'FAIL' end, n);

  -- AUTHENTICATED, NO PROFILE ----------------------------------------------
  perform set_config('request.jwt.claims',
    '{"sub":"00000000-0000-0000-0000-00000000f001","role":"authenticated"}', true);
  select count(*) into n from public.matters;
  total := total+1; if n <> 0 then fails := fails+1; end if;
  out_ := out_ || format('%s  *** logged in with no profile sees NOTHING (got %s, want 0)',
                         case when n=0 then 'PASS' else 'FAIL' end, n);

  -- ANON -------------------------------------------------------------------
  perform set_config('role','anon', true);
  perform set_config('request.jwt.claims', '', true);
  select count(*) into n from public.matters;
  total := total+1; if n <> 0 then fails := fails+1; end if;
  out_ := out_ || format('%s  *** anon sees nothing (got %s, want 0)',
                         case when n=0 then 'PASS' else 'FAIL' end, n);

  -- back to where we started, before returning anything
  perform set_config('role', orig, true);
  perform set_config('request.jwt.claims', '', true);

  result := case when fails = 0
    then format('✅ ALL %s CHECKS PASSED — the policies hold', total)
    else format('🔴 %s of %s FAILED — DO NOT PUT REAL DATA IN', fails, total) end;
  return next;

  result := '────────────────────────────────────────────'; return next;
  foreach line in array out_ loop
    result := line; return next;
  end loop;
end
$fn$;

select * from public._yale_verify_rls();

drop function public._yale_verify_rls();

rollback;   -- ⛔ nothing above is kept
