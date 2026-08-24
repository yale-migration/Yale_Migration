-- ═══════════════════════════════════════════════════════════════════════════
-- 08 · s56_deadlines.office must be NULLABLE, and the table must be revoked
--
-- Run AFTER 01 and 06. Idempotent. (D-396)
--
-- 🔴 WHY. `01-schema-and-rls.sql` declares `s56_deadlines.office text not null`.
-- The S56 TRACKER tab has **no office column** — its 19 headers are Received ·
-- Client Name · Subclass · DUE DATE (legal) · INTERNAL DUE · Days Allowed ·
-- Letter Date · Deadline Sentence · TRN · Application ID · File Number ·
-- Category · Confidence · Needs Review · Subject · Gmail Link · Assigned To ·
-- Status · Raw Classification. There is nowhere for an office to come from.
--
-- ⛔ THE FAILURE THAT WOULD HAVE CAUSED. `syncS56` has no stable key, so it
-- replaces the table: DELETE, then INSERT. The delete commits; the insert then
-- violates NOT NULL and throws. **The Section 56 table would be left EMPTY** —
-- and the board renders that as *"No Section 56 requests have been recorded
-- here yet"*, which is the reassuring sentence, over the statutory deadlines
-- that carry the highest consequence of anything on this system.
--
-- 🔑 Null is the honest value and it FAILS CLOSED: the manager policy compares
-- `office = app.current_office()`, and NULL = anything is NULL, so managers see
-- none and the director sees all. That costs nothing today — A-16: Robinder is
-- the only manager, and he is the director. Deriving an office by guessing from
-- the client name would put a legal deadline on the wrong branch's board.
-- ═══════════════════════════════════════════════════════════════════════════

alter table public.s56_deadlines alter column office drop not null;

-- ── the same for matters.full_name? NO. ────────────────────────────────────
-- `matters.full_name` and `matters.office` stay NOT NULL deliberately: MASTER
-- HAS both columns, so a missing value there is a data error to fix in the
-- sheet, not a shape the system should accept. `buildRecords` now skips and
-- NAMES those rows rather than letting one abort the batch (D-393).

-- ═══════════════════════════════════════════════════════════════════════════
-- 🔴 REVOKE THE DEFAULT WRITE GRANTS.
--
-- `01-schema-and-rls.sql` calls this app "read-only against these tables as a
-- structural fact". It was not a structural fact — it rested entirely on RLS
-- default-deny, because Supabase grants INSERT/UPDATE/DELETE on every table in
-- `public` to `anon` and `authenticated` by default and nothing ever revoked
-- them. One `for all` policy, or one `disable row level security`, and the
-- claim becomes false. Now it is two layers: no grant AND no policy.
-- ═══════════════════════════════════════════════════════════════════════════

revoke insert, update, delete, truncate on
  public.matters, public.s56_deadlines, public.profiles, public.enquiries
  from anon, authenticated;

-- ⛔ The service role is intentionally untouched — the sync needs it, and it
-- bypasses RLS by design. That key is why `app/api/sync/guard.ts` exists.

-- ── verify (read the output; do not assume) ────────────────────────────────
select 'office is nullable' as check,
       case when is_nullable = 'YES' then 'PASS' else 'FAIL' end as result
from information_schema.columns
where table_schema = 'public' and table_name = 's56_deadlines' and column_name = 'office'
union all
select 'no write grants remain for anon/authenticated',
       case when count(*) = 0 then 'PASS' else 'FAIL — ' || count(*)::text end
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in ('matters','s56_deadlines','profiles','enquiries')
  and grantee in ('anon','authenticated')
  and privilege_type in ('INSERT','UPDATE','DELETE','TRUNCATE');
