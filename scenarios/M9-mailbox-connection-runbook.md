# Runbook: connect `visa.lodgement@yalemigration.com.au` to Make (M9 prerequisite)

**Status:** FROZEN method (D-80/D-82). Verified against Google Workspace Admin Help, Gmail API docs and
Make's own docs. **Do not substitute another method.** If something fails, use the contingencies below —
they are part of THIS method, not a change of method.

---

## Why this method and no other

| Option | Verdict | Why |
|---|---|---|
| Gmail **delegation** | ❌ impossible | Web-UI only. The Gmail API — and therefore every Make module — cannot see a delegated mailbox. Also cannot target an external personal Gmail at all. |
| **Service account + domain-wide delegation** | ❌ not available | Google supports it, but Make's Gmail app offers no service-account connection type. Would require a custom Google Cloud project + JWT via the HTTP module — far more moving parts, more to break at handover. |
| **IMAP + app password** | ⚠️ Plan C only | Basic auth died May 2025; needs 2SV **and** admin-enabled IMAP **and** an app password. Degraded and fragile. |
| ✅ **OAuth the mailbox into Make's Gmail connection** | **CORRECT** | Make's documented requirement: the connection is authorized by signing in as the mailbox owner. One action, no ongoing maintenance, revocable by the client at any time. |

**Favourable finding:** Make's Gmail connection needs Google *restricted* scopes (reading message bodies).
Google blocks restricted scopes for **personal @gmail.com** accounts — but `visa.lodgement@` is a **Google
Workspace** account (MX = `aspmx.l.google.com`, D-76), so the standard connection works with no custom
Google Cloud OAuth client required. Had this mailbox been a personal Gmail, we would have needed one.

**Make itself is already in place** (we hold Admin on the client's Make account). Nothing new is bought,
installed or configured at the account level. The only thing Make cannot supply is the mailbox's own
sign-in — Google requires that to come from the mailbox once.

---

## 🔴 Two DIFFERENT logins — never conflate them

| | Which account | Purpose |
|---|---|---|
| **Login 1 — into Make** | the **existing client Make account** we already build in | so the connection lands in OUR workspace |
| **Login 2 — into Google, inside Make** | `visa.lodgement@yalemigration.com.au` | this IS the connection |

**Never tell the client to "log into Make with visa.lodgement@".** Signing up to Make with that address
creates a NEW EMPTY Make account containing none of our scenarios — a confusing dead end. Login 1 uses the
Make account credentials; Login 2 happens in the Google popup afterwards.

## Steps — CORRECTED per Make's own docs

⚠️ **Connections are created from INSIDE a module, not from the Credentials area.** Make's documentation:
*"connections are created at the module level during scenario building, not as a standalone action in the
Credentials menu"* — `Credentials → Connections` only *manages* existing ones. An earlier version of this
runbook started there; that was wrong.

### Prep — Sharjeel does this FIRST, alone (2 min, before involving the client)
1. In the client's Make account, create a scenario named **`YM-M9 SETUP — connect mailbox`**
2. Add one module: **Gmail → Watch emails**
3. Leave it unconfigured and save. **Do not** create the connection yet.

This reduces the client's job to five clicks inside a screen he cannot get lost in.

### How Robinder logs into Make — he already has this
Per `ACCESS.md` #6: **the client is the OWNER of the Make account**; we are a Team member with Admin. So
Robinder needs no invite and no new credentials.
- Go to **make.com → Sign in** → his own email address + his password
- Forgot it? **Forgot password** on that screen → reset link to his own inbox. He is the Owner, so this
  always works and needs nobody's help.
- After signing in, confirm the org name at top-left is the Yale workspace (the one with our scenarios).
  If it shows an empty workspace, he is in the wrong account — sign out and use his owner email.

### Client step — Robinder (~2 min)
4. Robinder logs into **Make** (the existing account — Login 1 above)
5. Opens the scenario **`YM-M9 SETUP — connect mailbox`** → clicks the Gmail module
6. At the Connection field clicks **Create a connection**
7. Connection name: **`YM Gmail — visa.lodgement`** (convention `YM <service> — <account>`) → **Save**
8. A Google window opens → he signs in as **`visa.lodgement@yalemigration.com.au`** + 2FA
9. Consent screen → **tick EVERY requested permission** → **Continue / Allow**
   - Partial ticks are the #1 cause of a connection that saves but then fails at runtime.

Either do 4–9 on a 2-minute screen-share (Sharjeel navigates, Robinder types the password — nothing shared),
or send him steps 4–9 to do alone. Screen-share has the higher success rate; solo is fine if he prefers.

### Verify immediately — do not skip
10. Same module: Folder `INBOX`, **Mark as read: NO**, Maximum results `1`
11. **Run once** → a real recent email must come back
12. Connection now appears under **Credentials → Connections** as verified
13. Keep the scenario (rename to `YM-M9-email-triage`) — it becomes the M9 scenario, so nothing is wasted

**Expected output:** a verified Gmail connection named `YM Gmail — visa.lodgement` that returns live
messages. That single artifact unblocks all of M9.

---

## Contingencies — pre-identified, still the same method

**C1 — "Access blocked" / admin policy error on the consent screen.**
Their Workspace has third-party API access restricted (not the default, but possible). Robinder, as admin:
**Security → Access and data control → API controls → Manage App Access** → find **Make** → set **Trusted**
→ Save. Then retry step 4. *(Verified path, Google Workspace Admin Help.)*

**C2 — 2FA code needed.** Expected. Robinder approves on his phone. Not an error.

**C3 — Robinder doesn't hold that mailbox's password.** He is the Workspace admin and the address is his own
per the D-64 header — he can reset it in the admin console, or sign in from a session that already has it.

**C4 — the mailbox is an ALIAS on his primary account, not a separate account.** Then the Department mail is
already landing in his primary mailbox: authorize **that** account instead. Same steps, same method. Watch
filter then keys on the `To:` address, not the mailbox.

**C5 — he refuses to authorize that mailbox at all.** Fall back to a Gmail forwarding rule
`visa.lodgement@` → `project1@` and read it through project1@'s connection. Cost: the `From` header becomes
the forwarder, so sender rules must key on the ORIGINAL sender inside the forwarded body (D-67 quote-
stripping already handles nested forwards). Only if C1–C4 are exhausted.

---

## After the connection exists

- M9 build proceeds per `docs/M9-EMAIL-AI-SPEC.md`
- Watch filter: `from:@homeaffairs.gov.au` (domain, not one address — D-65) + subject pattern
- Dedupe by File number + Application ID, never message id (D-67)
- Separately, `project1@` still needs its own OAuth for **sending** (D-13, M4) — different mailbox,
  different purpose. Ask at M4 time, not now.
