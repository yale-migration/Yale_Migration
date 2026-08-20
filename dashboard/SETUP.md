# Supabase setup — step by step

Do this on **Robinder's own machine, signed into the Yale Google account**
(`project1@yalemigration.com.au`). Same principle as every other system in this build:
**client-owned account, we hold invited access.** ⛔ Never a personal account of ours.

⚠️ One thing to raise with him, not to decide for him: the paid plan needs a card, and it will be
**his** card. Say the number out loud before he clicks — **USD $25/month**.

---

## What I need from you, and what I deliberately do not want

| | |
|---|---|
| ✅ **Project URL** | public, safe to paste |
| ✅ **anon key** | public by design — RLS is what constrains it, not secrecy |
| ⚠️ **service-role key** | bypasses RLS entirely. Needed only by the sync job |
| ⛔ **Personal access token** | **I would rather not have this.** It controls the whole account, not one project — every project, billing, members |

🔑 **My recommendation: you run the three CLI commands, I read the output.** That is exactly how we
did Apps Script all week and it worked — you keep the credentials, I keep the reasoning, and nothing
account-wide ever sits in a file on this machine.

If you would rather I ran them, put `SUPABASE_ACCESS_TOKEN` and `SUPABASE_PROJECT_REF` in
`.env.local`, tell me, and **revoke the token as soon as we are done**. It is your call — I just
will not pretend the two options carry the same risk.

---

## Step 1 · Create the project — 3 minutes

1. **supabase.com** → *Sign in with Google* → the **Yale** account, not a personal one
2. **New project**
   - Name `yale-dashboard`
   - **Region: Sydney (ap-southeast-2)** — the data is Australian, the users are in Brisbane, and
     the latency difference to a US region is felt on every page
   - Generate the database password and **save it in his password manager**. ⛔ Not in a sheet,
     not in a chat, not in this repo.
3. **Plan: Pro, $25/month.** Free pauses a project after a week of inactivity — a client portal
   that sleeps is not a portal.

## Step 2 · Send me two values

From **Project Settings → API**:

- Project URL — `https://xxxxx.supabase.co`
- **anon / public** key

Both are safe to paste. The anon key is designed to be in a browser; RLS is what makes that safe.

⛔ **Do not paste the `service_role` key into chat.** Put it straight into `.env.local`. If it ever
does land in a message, rotate it — assume anything pasted anywhere is exposed.

## Step 3 · Apply the schema

```bash
cd dashboard
npx supabase login            # opens a browser, no token stored in the repo
npx supabase link --project-ref <ref>    # the xxxxx from your project URL
npx supabase db push                     # 0001_schema.sql then 0002_rls.sql
```

## Step 4 · 🔴 Run the policy tests and read every line

```bash
npx supabase test db
```

**Do not skip to the UI.** A policy that leaks a row is the only defect in this build that cannot be
walked back — one client seeing another client's matter is a notifiable breach, not a bug report.

You are looking for **18/18**. The assertions that matter are the zeros: a manager gets no rows from
the other branch, and a client cannot see the matter that shares their email address.

## Step 5 · Point the app at it

```bash
cp .env.local.template .env.local     # fill in URL + anon key
npm install && npm run dev
```

The role switcher disappears the moment a real project is connected — in the live system your role
comes from your account, and a control the viewer can toggle is not a control.

## Step 6 · Create the first profiles

There is no self-registration (`enable_signup = false`) — **staff invite people, deliberately.**
Anyone who signs in without a profile row sees nothing at all, which is the correct default and is
covered by a test.

In the SQL editor, after Robinder has signed in once:

```sql
insert into public.profiles (user_id, role, full_name)
select id, 'director', 'Robinder Pal Singh'
from auth.users where email = 'robinder@yalemigration.com.au';
```

⚠️ **Set his real address** — that one is a placeholder and I have not verified it.

---

## Before it is ever pointed at real client data

- [ ] `supabase test db` passes **18/18**
- [ ] `site_url` in `config.toml` changed off `localhost` — otherwise every magic link is dead
- [ ] Deployed to the **company Vercel team**, not a personal account
- [ ] Confirmed with the company that a **client-owned** Supabase project is acceptable for this
      data. Policy names *company* Supabase; this build's own rule is *client-owned* accounts
      throughout (Make, Google, OneDrive). They point different ways and somebody senior should say
      which wins — before the data moves, not after.
