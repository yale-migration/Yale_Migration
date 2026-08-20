# SQL scripts — what to run, in what order

All of these paste into the **Supabase SQL editor**. No CLI, no login, no personal access token.

| # | File | Does | Safe to re-run |
|---|---|---|---|
| **1** | `01-schema-and-rls.sql` | tables, indexes, policies | ✅ yes — nothing is dropped |
| **2** | `06-enquiries.sql` | enquiries table, policies, 6 demo leads | ✅ yes |
| **3** | `07-verify-full-matrix.sql` | 🔴 **proves every role against every table** | ✅ seeds, asserts, **rolls back** |
| **4** | `03-seed-demo-data.sql` | 7 demo matters + 3 deadlines | ⚠️ **commits** — prefixed `YM-DEMO-` |
| **5** | `05-grant-access.sql` | links a signed-in email to a role | ✅ yes |
| — | `04-remove-demo-data.sql` | deletes every `YM-DEMO-` row | run before real data |
| — | `02-verify-rls.sql` | superseded by **07** | keep for history |

🔴 **06 before 07.** I had these the wrong way round on first writing: 07 *tests* the enquiries
table, so 06 has to create it. 07 now refuses with an instruction rather than a raw
`relation does not exist`.

⚠️ **Run 07, not 02.** `02` was written before the enquiries table existed and never touches it —
it would pass while the lead pipeline sat unproven.

---

## The access matrix 07 proves

| table | director | manager | client | signed in, no profile | anon |
|---|---|---|---|---|---|
| `matters` | all | own office | **own matter only** | none | none |
| `s56_deadlines` | all | own office | **none** | none | none |
| `enquiries` | all | own office | **none** | none | none |
| `profiles` | own row | own row | own row | none | none |

**22 assertions, 14 of them denials.** Every "none" is asserted, never assumed — a table with no
policy for a role is denied by default, which is correct, but untested *"we meant to deny that"* and
*"we forgot to write that policy"* look identical.

Three worth knowing about:

- **A client cannot see the matter sharing their email address.** Two seeded rows share one, exactly
  as two rows in Yale's own list do. A policy written against `auth.email()` instead of
  `client_code` passes everything else and fails only this.
- **Even the director reads only their own `profiles` row.** Nothing needs to enumerate profiles,
  and a policy allowing it would expose the whole client↔login mapping to one compromised session.
- **A client sees no Section 56 deadline.** It is a legal instrument the RMA explains with the
  letter in hand; a date appearing unannounced on a portal is how a client panics, or acts alone.

---

## Before real client data

- [ ] `07` returns **ALL 22 CHECKS PASSED**
- [ ] `04-remove-demo-data.sql` has been run
- [ ] `site_url` in `supabase/config.toml` moved off `localhost` — otherwise every magic link is dead
- [ ] Deployed to the **company** Vercel team
- [ ] Brand hexes taken from Robinder's logo, replacing the eyeballed navy and gold
- [ ] The company-owned vs client-owned hosting question answered by someone senior
