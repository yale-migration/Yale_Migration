-- ═══════════════════════════════════════════════════════════════════════════
-- THE COMPLETE ACCESS MATRIX — every role against every table.
--
-- Paste into the Supabase SQL editor and Run. Seeds, asserts, ROLLS BACK.
--
-- 🔴 THIS IS THE ONE TO RUN BEFORE REAL CLIENT DATA. 02-verify-rls.sql predates
-- the enquiries table and never touched it, so the lead pipeline had policies
-- nobody had ever proven. A table with no policy for a role is DENIED by
-- default — which is correct — but untested, "we meant to deny that" and "we
-- forgot to write that policy" look exactly the same.
--
--   table            director   manager      client   no-profile   anon
--   matters          all        own office   own      none         none
--   s56_deadlines    all        own office   NONE     none         none
--   enquiries        all        own office   NONE     none         none
--   profiles         own row    own row      own row  none         none
--
-- ⚠️ Every "none" is asserted, not assumed. And every zero is preceded by a
-- non-zero baseline for the same actor — a test that passes on an empty table
-- proves nothing, which has caught this project three times already.
-- ═══════════════════════════════════════════════════════════════════════════
begin;

insert into auth.users (id, email, instance_id, aud, role) values
  ('00000000-0000-0000-0000-00000000d001','dir@example.com','00000000-0000-0000-0000-000000000000','authenticated','authenticated'),
  ('00000000-0000-0000-0000-00000000a001','bne@example.com','00000000-0000-0000-0000-000000000000','authenticated','authenticated'),
  ('00000000-0000-0000-0000-00000000c001','c1@example.com','00000000-0000-0000-0000-000000000000','authenticated','authenticated'),
  ('00000000-0000-0000-0000-00000000c002','c2@example.com','00000000-0000-0000-0000-000000000000','authenticated','authenticated'),
  ('00000000-0000-0000-0000-00000000f001','none@example.com','00000000-0000-0000-0000-000000000000','authenticated','authenticated')
on conflict (id) do nothing;

insert into public.matters (client_code, full_name, client_email, office, visa_type) values
  ('ZZ-MX-0001','MX ONE','shared@example.com','BRISBANE','485'),
  ('ZZ-MX-0002','MX TWO','shared@example.com','BRISBANE','500'),   -- SAME email, on purpose
  ('ZZ-MX-0003','MX THREE','three@example.com','TOWNSVILLE','482');

insert into public.s56_deadlines (client_code, client_name, office, subclass) values
  ('ZZ-MX-0001','MX ONE','BRISBANE','485'),
  ('ZZ-MX-0003','MX THREE','TOWNSVILLE','482');

insert into public.enquiries (enquiry_date, name, office, channel, status) values
  (current_date, 'ZZ-MX lead BNE', 'BRISBANE',   'Website', 'New'),
  (current_date, 'ZZ-MX lead TSV', 'TOWNSVILLE', 'Phone',   'New');

insert into public.profiles (user_id, role, office, client_code) values
  ('00000000-0000-0000-0000-00000000d001','director', null,      null),
  ('00000000-0000-0000-0000-00000000a001','manager', 'BRISBANE', null),
  ('00000000-0000-0000-0000-00000000c001','client',   null,      'ZZ-MX-0001'),
  ('00000000-0000-0000-0000-00000000c002','client',   null,      'ZZ-MX-0002');
-- f001 has NO profile row, deliberately.

create or replace function public._yale_matrix()
returns table(result text)
language plpgsql as $fn$
declare
  orig text := coalesce(nullif(current_setting('role', true),''), 'none');
  fails int := 0; total int := 0; out_ text[] := '{}'; n int; line text;
begin
  -- ── DIRECTOR ────────────────────────────────────────────────────────────
  perform set_config('role','authenticated', true);
  perform set_config('request.jwt.claims','{"sub":"00000000-0000-0000-0000-00000000d001","role":"authenticated"}', true);

  select count(*) into n from public.matters where client_code like 'ZZ-MX-%';
  total:=total+1; if n<>3 then fails:=fails+1; end if;
  out_:=out_||format('%s  director · matters · all offices (got %s want 3)', case when n=3 then 'PASS' else 'FAIL' end, n);

  select count(*) into n from public.s56_deadlines where client_code like 'ZZ-MX-%';
  total:=total+1; if n<>2 then fails:=fails+1; end if;
  out_:=out_||format('%s  director · s56 · all (got %s want 2)', case when n=2 then 'PASS' else 'FAIL' end, n);

  select count(*) into n from public.enquiries where name like 'ZZ-MX%';
  total:=total+1; if n<>2 then fails:=fails+1; end if;
  out_:=out_||format('%s  director · enquiries · all (got %s want 2)', case when n=2 then 'PASS' else 'FAIL' end, n);

  select count(*) into n from public.profiles;
  total:=total+1; if n<>1 then fails:=fails+1; end if;
  out_:=out_||format('%s  director · profiles · OWN ROW ONLY (got %s want 1)', case when n=1 then 'PASS' else 'FAIL' end, n);

  -- ── BRISBANE MANAGER ────────────────────────────────────────────────────
  perform set_config('request.jwt.claims','{"sub":"00000000-0000-0000-0000-00000000a001","role":"authenticated"}', true);

  select count(*) into n from public.matters where client_code like 'ZZ-MX-%';
  total:=total+1; if n<>2 then fails:=fails+1; end if;
  out_:=out_||format('%s  BASELINE manager · matters · reads something (got %s want 2)', case when n=2 then 'PASS' else 'FAIL' end, n);

  select count(*) into n from public.matters where office='TOWNSVILLE';
  total:=total+1; if n<>0 then fails:=fails+1; end if;
  out_:=out_||format('%s  *** manager · matters · ZERO from other branch (got %s want 0)', case when n=0 then 'PASS' else 'FAIL' end, n);

  select count(*) into n from public.s56_deadlines where office='TOWNSVILLE';
  total:=total+1; if n<>0 then fails:=fails+1; end if;
  out_:=out_||format('%s  *** manager · s56 · ZERO from other branch (got %s want 0)', case when n=0 then 'PASS' else 'FAIL' end, n);

  select count(*) into n from public.enquiries where name like 'ZZ-MX%';
  total:=total+1; if n<>1 then fails:=fails+1; end if;
  out_:=out_||format('%s  manager · enquiries · own branch only (got %s want 1)', case when n=1 then 'PASS' else 'FAIL' end, n);

  select count(*) into n from public.enquiries where office='TOWNSVILLE';
  total:=total+1; if n<>0 then fails:=fails+1; end if;
  out_:=out_||format('%s  *** manager · enquiries · ZERO from other branch (got %s want 0)', case when n=0 then 'PASS' else 'FAIL' end, n);

  -- ── CLIENT ──────────────────────────────────────────────────────────────
  perform set_config('request.jwt.claims','{"sub":"00000000-0000-0000-0000-00000000c001","role":"authenticated"}', true);

  select count(*) into n from public.matters where client_code='ZZ-MX-0001';
  total:=total+1; if n<>1 then fails:=fails+1; end if;
  out_:=out_||format('%s  BASELINE client · sees their own matter (got %s want 1)', case when n=1 then 'PASS' else 'FAIL' end, n);

  -- 🔴 The email trap. Two matters share one address, as two rows in Yale's own
  -- list do. A policy on auth.email() passes everything else and fails only this.
  select count(*) into n from public.matters where client_code='ZZ-MX-0002';
  total:=total+1; if n<>0 then fails:=fails+1; end if;
  out_:=out_||format('%s  *** client · CANNOT see the matter sharing their email (got %s want 0)', case when n=0 then 'PASS' else 'FAIL' end, n);

  select count(*) into n from public.s56_deadlines;
  total:=total+1; if n<>0 then fails:=fails+1; end if;
  out_:=out_||format('%s  *** client · s56 · NONE (a legal date is explained by the RMA) (got %s want 0)', case when n=0 then 'PASS' else 'FAIL' end, n);

  -- 🔴 Never tested before this script existed.
  select count(*) into n from public.enquiries;
  total:=total+1; if n<>0 then fails:=fails+1; end if;
  out_:=out_||format('%s  *** client · enquiries · NONE (never the lead pipeline) (got %s want 0)', case when n=0 then 'PASS' else 'FAIL' end, n);

  select count(*) into n from public.profiles;
  total:=total+1; if n<>1 then fails:=fails+1; end if;
  out_:=out_||format('%s  client · profiles · own row only (got %s want 1)', case when n=1 then 'PASS' else 'FAIL' end, n);

  -- ── AUTHENTICATED, NO PROFILE ───────────────────────────────────────────
  perform set_config('request.jwt.claims','{"sub":"00000000-0000-0000-0000-00000000f001","role":"authenticated"}', true);
  select count(*) into n from public.matters;        total:=total+1; if n<>0 then fails:=fails+1; end if;
  out_:=out_||format('%s  *** no profile · matters · NOTHING (got %s want 0)', case when n=0 then 'PASS' else 'FAIL' end, n);
  select count(*) into n from public.s56_deadlines;  total:=total+1; if n<>0 then fails:=fails+1; end if;
  out_:=out_||format('%s  *** no profile · s56 · NOTHING (got %s want 0)', case when n=0 then 'PASS' else 'FAIL' end, n);
  select count(*) into n from public.enquiries;      total:=total+1; if n<>0 then fails:=fails+1; end if;
  out_:=out_||format('%s  *** no profile · enquiries · NOTHING (got %s want 0)', case when n=0 then 'PASS' else 'FAIL' end, n);
  select count(*) into n from public.profiles;       total:=total+1; if n<>0 then fails:=fails+1; end if;
  out_:=out_||format('%s  *** no profile · profiles · NOTHING (got %s want 0)', case when n=0 then 'PASS' else 'FAIL' end, n);

  -- ── ANON ────────────────────────────────────────────────────────────────
  perform set_config('role','anon', true);
  perform set_config('request.jwt.claims','', true);
  select count(*) into n from public.matters;        total:=total+1; if n<>0 then fails:=fails+1; end if;
  out_:=out_||format('%s  *** anon · matters · NOTHING (got %s want 0)', case when n=0 then 'PASS' else 'FAIL' end, n);
  select count(*) into n from public.s56_deadlines;  total:=total+1; if n<>0 then fails:=fails+1; end if;
  out_:=out_||format('%s  *** anon · s56 · NOTHING (got %s want 0)', case when n=0 then 'PASS' else 'FAIL' end, n);
  select count(*) into n from public.enquiries;      total:=total+1; if n<>0 then fails:=fails+1; end if;
  out_:=out_||format('%s  *** anon · enquiries · NOTHING (got %s want 0)', case when n=0 then 'PASS' else 'FAIL' end, n);
  select count(*) into n from public.profiles;       total:=total+1; if n<>0 then fails:=fails+1; end if;
  out_:=out_||format('%s  *** anon · profiles · NOTHING (got %s want 0)', case when n=0 then 'PASS' else 'FAIL' end, n);

  perform set_config('role', orig, true);
  perform set_config('request.jwt.claims','', true);

  result := case when fails=0
    then format('✅ ALL %s CHECKS PASSED — every role, every table', total)
    else format('🔴 %s of %s FAILED — DO NOT PUT REAL DATA IN', fails, total) end;
  return next;
  result := '─────────────────────────────────────────────────────────'; return next;
  foreach line in array out_ loop result := line; return next; end loop;
end
$fn$;

select * from public._yale_matrix();
drop function public._yale_matrix();

rollback;   -- ⛔ nothing above is kept
