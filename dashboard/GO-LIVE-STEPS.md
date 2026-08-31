# GO-LIVE STEPS — everything left, who does it, and exactly how
**Written 24 Aug 2026.** The build is finished. This is the list of things that
cannot be done in code, in the order they have to happen.

⛔ **Nothing here is guesswork about the app.** Every step below has been made
possible by code that is already written and tested — the sync reader exists, the
SQL exists, the guards exist. What is missing is access and decisions.

---

## 📊 STATUS — updated 31 Aug 2026

⚠️ **Two different Google Sheets are involved. Do not confuse them.**
| Sheet | Used for | Needs sharing with the service account? |
|---|---|---|
| **YALE BRISBANE OFFICE WORK** (`1ZE1OoTj…`) — MASTER · ENQUIRIES · S56 TRACKER | **the dashboard sync** | ✅ **YES — this is the one** |
| **CLIENT LIST TO UPDATE** (`1pqRhsEZ…`) — shared by RJ 30 Aug | the 38-row MASTER import | ❌ no — read by `project1@` already |

| # | Step | Who | Status |
|---|---|---|---|
| 0 | 🔴 **Rotate the Supabase service-role key** | Sharjeel | ⬜ **NOT DONE** — still sitting in `dashboard/.env.local` |
| — | SQL `01-schema-and-rls.sql` | Sharjeel | ✅ ran |
| — | SQL `06-enquiries.sql` | Sharjeel | 🔶 **RE-RUN NEEDED** — it ran, but the old version leaked a demo row (reported *7 demo enquiries*, should be 6). The fixed file cleans up and asserts the count |
| — | SQL `07-verify-full-matrix.sql` | Sharjeel | ✅ **ALL 22 CHECKS PASSED** |
| — | SQL `08-s56-nullable-office.sql` | Sharjeel | ✅ both checks PASS |
| 1a | Google Cloud project | Sharjeel | ✅ **DONE** — created under **`project1@yalemigration.com.au`**, a Yale account, not a personal one |
| 1b | Service account created | Sharjeel | ✅ **DONE** — `yale-dashboard-sync@yale-dashboard-sync.iam.gserviceaccount.com` |
| 1c | JSON key downloaded | Sharjeel | ✅ **DONE** — ⛔ open it once, copy `client_email` + `private_key`, then **delete the file** |
| 1d | 🔶 **Google Sheets API enabled?** | Sharjeel | ❓ **UNCONFIRMED — check this before anything else.** Without it the sync fails with a 403 that looks like a permissions problem and is not. APIs & Services → Library → "Google Sheets API" → it should say **Manage**, not **Enable** |
| 2 | Vercel env vars (6) | Sharjeel | ⬜ **← YOU ARE HERE.** Locally only 3 of 7 are set; `SYNC_SECRET`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` are missing |
| 3 | Share **YALE BRISBANE OFFICE WORK** as **Viewer** with `yale-dashboard-sync@yale-dashboard-sync.iam.gserviceaccount.com` | Robinder | ⬜ |
| 6 | Deploy + prove `/api/sync` with curl | Sharjeel | ⬜ |
| 5 | `Client Code` column in S56 TRACKER | Robinder | ⬜ — until then Section 56 cannot appear on a client's file |
| 7 | Current staff list → `profiles` rows | Robinder | ⬜ |
| 8 | Import the 38 real clients | both, on the day | ⬜ — needs a go-live date |

🔑 **Steps 0, 1, 2 and the `06` re-run need nobody but Sharjeel.** Step 6's curl returns a clean `403`
until Robinder does step 3 — which is itself a useful test that everything else is right.

---

## Who owns what

| | Steps | Roughly |
|---|---|---|
| **Sharjeel** | 1 · 2 · 4 · 6 | 1–2 hours total |
| **Robinder** | 3 · 5 · 7 | 20 minutes on a call |
| **Nobody yet** | 8 — needs a decision first | — |

---

# STEP 1 · Create the Google service account · Sharjeel · ~10 min

This is the identity that reads the register. It is **not** a person's login, so
it does not break when someone changes their password, and Yale can revoke it
from their own Drive without touching anyone's account.

1. Go to **console.cloud.google.com** → sign in with the Google account that will
   own the automation. ⚠️ Use a **Yale** account if one exists; otherwise create
   it under yours and hand it over at handover (this is the same ownership
   problem as the OneDrive connection — do not repeat it silently).
2. Top bar → project dropdown → **New Project** → name it `yale-dashboard-sync`
   → **Create**. Wait for it to switch to the new project.
3. Left menu → **APIs & Services** → **Library** → search **Google Sheets API**
   → open it → **Enable**. 🔴 If you skip this the sync fails with a 403 that
   looks like a permissions problem and is not.
4. Left menu → **APIs & Services** → **Credentials** → **+ Create Credentials**
   → **Service account**.
   - Name: `yale-dashboard-sync`
   - **Create and continue** → skip the optional role → **Done**.
   - ⛔ **Grant it no project roles.** It needs nothing in Google Cloud; its only
     permission comes from the sheet being shared with it in step 3.
5. Click the new service account → **Keys** tab → **Add key** → **Create new key**
   → **JSON** → **Create**. A `.json` file downloads.

🔴 **That file is a credential.** Treat it exactly like a password:
- Do **not** put it in the repo, in Slack, in email, or in WhatsApp.
- Open it once, copy the two values you need, then **delete the file**.
- The two values are `client_email` and `private_key`.

---

# STEP 2 · Give the credentials to the app · Sharjeel · ~5 min

⛔ **Company Vercel team account only** — never a personal Vercel, never a free
tier. This project holds real client data.

Vercel → the project → **Settings** → **Environment Variables**. Add:

| Name | Value | Notes |
|---|---|---|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | the `client_email` from the JSON | ends `.iam.gserviceaccount.com` |
| `GOOGLE_PRIVATE_KEY` | the `private_key` from the JSON | **paste the whole value**, including its BEGIN and END banner lines. Newlines are handled either way — tested. *(The banner text is deliberately not reproduced here: the repo's own secret scanner treats it as a credential, and it is right to.)* |
| `SYNC_SECRET` | a long random string | generate with `openssl rand -hex 32` |
| `SUPABASE_SERVICE_ROLE_KEY` | from Supabase → Settings → API | 🔴 see the rotation note below |
| `NEXT_PUBLIC_SUPABASE_URL` | from the same page | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | from the same page | |

🔴 **Rotate the Supabase service-role key first.** The current one has been
sitting in plaintext in `dashboard/.env.local` on a personal laptop. It is not in
git — verified — but treat it as exposed: Supabase → **Settings** → **API** →
**service_role** → reset, then use the new one everywhere.

⚠️ **`NEXT_PUBLIC_*` values are baked in at BUILD time.** Changing them without
redeploying does nothing. Always redeploy after editing them.

---

# STEP 3 · Share the sheet with the service account · Robinder · 2 min

On the call, with him sharing his screen:

1. Open **YALE BRISBANE OFFICE WORK** (the workbook holding `MASTER`,
   `ENQUIRIES` and `S56 TRACKER`).
2. **Share** → paste the `client_email` from step 1.
3. 🔴 Set the role to **Viewer**. Not Editor. Not Commenter.
4. **Untick "Notify people"** — it is a robot.
5. **Share**.

> *"Sir, ye ek robot account hai jo sirf sheet PARH sakta hai — likh nahi sakta.
> Viewer rakhna zaroori hai."*

🔑 **Viewer is the third of three independent locks.** The token is minted
read-only, the code only ever issues a GET, and the account has no write
permission. Any one of those alone would be a promise; three is a property.

---

# STEP 4 · Run the database migrations · Sharjeel · ~5 min

Supabase → **SQL Editor** → paste and run **in this order**. Each is idempotent.

```
supabase/paste/01-schema-and-rls.sql
supabase/paste/06-enquiries.sql
supabase/paste/08-s56-nullable-office.sql   ← run this even on an existing DB
supabase/paste/07-verify-full-matrix.sql    ← read the output, do not assume
```

**08 does two things that matter:**
- makes `s56_deadlines.office` nullable — without it the first sync **deletes the
  deadline table and cannot refill it**, and the board then reads *"no Section 56
  requests recorded"*;
- **revokes** INSERT/UPDATE/DELETE from `anon` and `authenticated`, so read-only
  is enforced by grants as well as by policy.

🔴 **07 prints a pass/fail table. Read it.** It exists because a policy that was
never written and a policy that denies look identical from outside.

---

# STEP 5 · The Section 56 decision · Robinder · 2 min on the call

**Right now, Section 56 deadlines cannot appear on an individual client's file.**
The S56 TRACKER tab has 19 columns and none of them is a client code, so there is
nothing to join on. The board shows the deadlines; the client's own page does not.

⛔ We will not guess the link by matching names. Their own schema note says it:
a wrong guess writes a legal deadline onto the wrong client.

**The fix is one column.** Ask him:

> *"S56 TRACKER mein ek column add kar dein — `Client Code`. Jab aap koi deadline
> log karein, us client ka code likh dein. Us ke baghair deadline client ki apni
> file par nahi dikh sakti."*

If he agrees, I write the Apps Script that adds the column safely (the same
pattern as the CALL LOG intake block) and add `client_code` to the sync
allowlist. **Until then this stays a known, stated gap — not a silent one.**

---

# STEP 6 · Deploy and prove the sync · Sharjeel · ~15 min

1. Deploy to the **company Vercel team**.
2. Test the sync by hand before trusting the cron:
   ```
   curl -i -H "Authorization: Bearer $SYNC_SECRET" https://<domain>/api/sync
   ```
3. **Read the response body**, do not just look at the status:
   - `200 {"status":"ok", ...}` — every tab synced. Check the `read`/`written`/
     `skipped` counts against what you expect.
   - `503 not_configured` — step 2 is incomplete.
   - `401` — wrong or missing secret.
   - `500 {"status":"partial"}` — some tabs synced. **The body names which failed
     and why.** A renamed tab is the most likely cause.
4. ⚠️ **Check `warnings` in the response.** Rows skipped for a missing office or
   a missing name are listed there by client code. They did not sync and they
   need fixing in the sheet.
5. The hourly cron is already configured in `vercel.json`. It authenticates the
   same way.

🔴 **A 200 with `"skipped"` higher than you expect is a failure, not a success.**

---

# STEP 7 · Who gets access · Robinder · 5 min

For each staff member, one row in `profiles` linking their Google login to a role
and an office. For clients, a magic-link invitation.

Blocked on **the current staff list** (A-45) — RJ said there is an update and
nobody has told us what changed. ⛔ Ask Robinder, and **do not mention Gopi**:
she joined 18 Aug and left 22 Aug.

---

# STEP 8 · Import the 38 real clients

Not a dashboard step — it is the MVP cutover, and it has its own runbook.
▶ **`../CUTOVER-PLAN.md`**, and do not skip step (e), the two baselines.

---

## What is already done and needs nothing from anyone

| | |
|---|---|
| The application | 7 views, 3 roles, client portal |
| Access control | RLS proven for every table × role, writes revoked |
| The sync | reader, transformer, credential allowlist, all three tabs |
| Safety | nothing in the app can write; the one delete cannot run on a failed read |
| Tests | **260 unit checks + 156 end-to-end**, every guard negative-tested |
