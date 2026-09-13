# Sign-in email — Resend + the Yale domain

**Why this file exists.** Supabase's built-in mailer sends **2 messages per hour** and only to
pre-authorised team addresses. That is a development convenience, not a product. Until it is
replaced, **no client and no staff member can sign in** — the third person to try in an hour gets
nothing, and nothing on screen says why. This was I-30, the last go-live blocker on our side.

🔑 **Agreed with Robinder, 12 Sep 2026:** use **Resend**, sending from the Yale domain, so the
sign-in email arrives from Yale rather than from a Supabase address.

---

## Verified facts (checked against vendor docs 13 Sep 2026)

| | |
|---|---|
| Resend SMTP host | `smtp.resend.com` |
| Resend SMTP port | **587** (STARTTLS). 465 also works, implicit TLS |
| Resend SMTP username | the literal string **`resend`** — not an email address |
| Resend SMTP password | **a Resend API key** |
| Supabase default limit | **2 messages/hour**, team addresses only |
| Supabase WITH custom SMTP | **starts at 30 messages/hour**, raisable on the Rate Limits page |
| Resend free tier | 3,000 emails/month, 100/day |

⚠️ **30/hour is a starting point, not the end state.** After switching SMTP on, raise it on
**Authentication → Rate Limits**. At 38 clients a 30/hour ceiling is fine for staff, and fine for
inviting clients in batches — it is NOT fine for inviting all 38 at once.

---

## STEP 1 — Create the Resend account  ·  Yale's, not ours

⛔ **Sign up with a Yale address**, not a personal one. Every account in this project is
client-owned; this one holds their sending reputation and must be no different.

1. `resend.com` → **Sign up** → use a `@yalemigration.com.au` address
2. Verify the address from the confirmation email

---

## STEP 2 — Add the domain

1. In Resend → **Domains** → **Add Domain**
2. Enter **`yalemigration.com.au`**
3. Resend shows **DNS records to add** — typically:
   - a **TXT** record for DKIM (a long key)
   - a **TXT** record for SPF
   - optionally an **MX** record for bounce handling

### 🔴 The one that can break their email

⛔ **Do NOT replace their existing MX records.** Yale's mail runs on **Google Workspace** (verified
— D-301). Their MX records point at Google. If Resend's bounce MX is added on the **root domain**
and the Google records are removed, **all Yale email stops arriving.**

✅ **Two safe ways, in order of preference:**

1. **Use a subdomain** — set the domain up as **`send.yalemigration.com.au`** instead. Resend's
   records then live on a subdomain that carries no mail of its own, and the root domain's MX is
   never touched. Sign-in email still visibly comes from Yale.
2. If the root domain is used anyway: **add** the TXT records and **skip the MX record entirely**.
   Bounce tracking is lost; mail delivery is not.

**Recommend option 1.** It removes the failure mode rather than asking someone to be careful.

---

## STEP 3 — Add the DNS records

Wherever `yalemigration.com.au` is registered (the registrar, or Cloudflare if it is in front):

1. Add each TXT record exactly as Resend shows it — **name, type and value, copied, not retyped**
2. Back in Resend → **Verify**
3. Wait for **Verified** ✅ — usually minutes, occasionally up to 48 hours

⛔ Do not move on until the domain reads **Verified**. Sending from an unverified domain either
fails outright or lands in spam, and "the login email never arrived" looks identical to a bug in
our code.

---

## STEP 4 — Create the API key

1. Resend → **API Keys** → **Create API Key**
2. Name it `supabase-auth`
3. Permission: **Sending access** only — it never needs to read anything
4. Copy it once. It is shown once.

⛔ **This key is a credential.** It does not go in the repo, in a message, or in this file. It goes
straight from the Resend screen into the Supabase field in STEP 5. If it is ever pasted anywhere
else, rotate it.

---

## STEP 5 — Point Supabase at it

Supabase dashboard → the project → **Authentication** → **Emails** → **SMTP Settings**

| Field | Value |
|---|---|
| Enable Custom SMTP | **on** |
| Sender email | `no-reply@send.yalemigration.com.au` *(match the verified domain from STEP 2)* |
| Sender name | `Yale Migration` |
| Host | `smtp.resend.com` |
| Port | `587` |
| Username | `resend` |
| Password | the Resend API key from STEP 4 |

**Save.**

⚠️ The sender email **must be on the domain verified in Resend.** A mismatch is rejected at send
time, not at save time — so it looks like it worked and then no email arrives.

---

## STEP 6 — Raise the rate limit

Supabase → **Authentication** → **Rate Limits** → raise the email limit above the default 30/hour.

Set it to whatever the biggest planned batch is. Inviting 38 clients in one sitting needs more
than 38/hour.

---

## STEP 7 — Prove it, don't assume it

⛔ **A saved setting is not a delivered email.** Three checks, in this order:

1. **Send one** — open `/login`, enter a real address, submit
2. **Confirm it arrived** — and that the sender reads **Yale Migration**, not Supabase
3. **Send four more inside one hour** — this is the check that matters. It is the one that failed
   before, and it is the only way to prove the 2/hour ceiling is actually gone

Then look at **Resend → Logs**. Every attempt appears there with its outcome, which is where to
look first for anything that does not arrive.

---

## What this does NOT do

- It does not change how staff sign in. Staff use **Google**, and always did — no email involved.
- It does not send any migration advice. This carries **sign-in links only**.
- It does not affect the automation's email. That is Gmail via Make, a separate path.
