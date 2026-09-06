-- ═══════════════════════════════════════════════════════════════════════════
-- LINK SECTION 56 DEADLINES TO CLIENT FILES.  (D-459)
--
-- 🔴 THE DEFECT THIS FIXES. `s56_deadlines.client_code` exists in the schema,
-- is indexed, and is what the client file reads:
--
--     getMatterS56 →  all.filter((d) => d.client_code === code)
--
-- ...but **the sync never sets it.** The S56 TRACKER tab has no Client Code
-- column, so every synced deadline arrives with `client_code = NULL` and that
-- filter matches nothing. The result is not an error — it is a client file with
-- a live statutory deadline showing **no deadline at all**, silently, for staff
-- as well as clients.
--
-- The deadline still appears on the practice board, which lists by name. So the
-- board looks correct while every individual file is wrong. That combination is
-- the worst case: it looks like the feature works.
--
-- ═══════════════════════════════════════════════════════════════════════════
-- HOW THIS LINKS THEM, AND WHY IT REFUSES TO GUESS
--
-- By an EXACT, case- and whitespace-insensitive name match against `matters`,
-- and ⛔ **only when exactly one client matches.**
--
-- Two clients sharing a name, or none matching, leaves `client_code` NULL. That
-- is deliberate. Attaching a legal deadline to the wrong person's file in an
-- immigration practice is a worse outcome than showing no deadline — so where
-- there is any doubt this does nothing and the row stays visible on the board.
--
-- ⚠️ THIS IS A BRIDGE, NOT THE ANSWER. The real fix is a **Client Code column
-- in the S56 TRACKER tab** — already asked of Robinder. Once that exists the
-- sync populates the field directly and this trigger simply never fires,
-- because it only acts when the value is already NULL.
-- ═══════════════════════════════════════════════════════════════════════════

create or replace function app.s56_link_client_code()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  hits  int;
  found text;
begin
  -- ⛔ Never overwrite a real value. When the sheet gains its Client Code
  -- column, the synced value wins and this function becomes a no-op.
  if new.client_code is not null then
    return new;
  end if;

  if new.client_name is null or btrim(new.client_name) = '' then
    return new;
  end if;

  select count(*), min(m.client_code)
    into hits, found
    from public.matters m
   where lower(btrim(m.full_name)) = lower(btrim(new.client_name));

  -- 🔑 EXACTLY ONE. Zero means we do not know them; two or more means we cannot
  -- tell which. Both leave it NULL rather than picking.
  if hits = 1 then
    new.client_code := found;
  end if;

  return new;
end
$$;

drop trigger if exists s56_link_client_code_trg on public.s56_deadlines;
create trigger s56_link_client_code_trg
  before insert or update on public.s56_deadlines
  for each row execute function app.s56_link_client_code();


-- ── Backfill anything already in the table ────────────────────────────────
-- ⚠️ The trigger only fires on write. Rows synced before this file was run
-- still hold NULL, so link them once here with the same one-match rule.
update public.s56_deadlines d
   set client_code = m.client_code
  from public.matters m
 where d.client_code is null
   and lower(btrim(m.full_name)) = lower(btrim(d.client_name))
   and (select count(*) from public.matters m2
         where lower(btrim(m2.full_name)) = lower(btrim(d.client_name))) = 1;


-- ═══════════════════════════════════════════════════════════════════════════
-- ⛔ VERIFY — do not trust the update count. Read what is still unlinked.
-- ═══════════════════════════════════════════════════════════════════════════
select
  count(*)                                        as total_deadlines,
  count(client_code)                              as linked_to_a_file,
  count(*) - count(client_code)                   as still_unlinked
from public.s56_deadlines;

-- Which ones could not be linked, and why. 🔴 An unlinked deadline is NOT
-- broken — it still shows on the board — but it will never appear on that
-- client's own file until the name matches or the sheet gains a Client Code.
select
  d.client_name,
  d.subclass,
  d.due_date_legal,
  (select count(*) from public.matters m
    where lower(btrim(m.full_name)) = lower(btrim(d.client_name))) as name_matches,
  case
    when (select count(*) from public.matters m
           where lower(btrim(m.full_name)) = lower(btrim(d.client_name))) = 0
      then 'no client of that name in MASTER'
    else 'more than one client shares this name — refusing to guess'
  end as reason
from public.s56_deadlines d
where d.client_code is null
order by d.due_date_legal nulls last;
