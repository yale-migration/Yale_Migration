-- Removes every demo row. Run this before any real client data goes in —
-- a real practice with seven invented clients in it is a practice nobody trusts.
--
-- ⛔ Deletes ONLY the YM-DEMO- prefix. It cannot touch a real client code,
-- because no real code carries that prefix (they are YM-2026-#####).

delete from public.s56_deadlines where client_code like 'YM-DEMO-%';
delete from public.matters       where client_code like 'YM-DEMO-%';

-- Profiles pointing at a deleted matter are left in place deliberately: the FK
-- is `on delete set null`, so the row survives with client_code NULL. That
-- login then sees nothing — visible and safe. Silently deleting someone's
-- profile would look like their access was revoked for a reason.
select 'Demo data removed. ' ||
       (select count(*) from public.matters) || ' matters remain.' as result;
