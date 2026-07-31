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

## Steps (screen-share, ~2 minutes)

Sharjeel drives Make; **Robinder types the password himself** — credentials are never shared, which also
keeps us clean on the no-shared-credentials rule.

1. Sharjeel: open the client's **Make** account → left nav **Credentials → Connections → + Add**
2. Search **Gmail** → select it
3. Name it exactly: **`YM Gmail — visa.lodgement`** (naming convention: `YM <service> — <account>`)
4. Click **Sign in with Google** → a Google window opens
5. **Robinder** enters `visa.lodgement@yalemigration.com.au` + password, approves 2FA on his phone
6. On the consent screen: **tick every requested permission**, then **Continue / Allow**
   - Partial ticks are the #1 cause of a connection that saves but then fails at runtime.
7. Connection shows as verified in the Connections list → **done, permanently**

### Verify immediately (do not skip — proves it before the client leaves the call)
8. New scenario → module **Gmail → Watch emails** → pick the new connection
9. Folder `INBOX`, **Mark as read: NO**, Maximum results `1`
10. **Run once** → confirm a real recent email is returned
11. Delete the throwaway scenario. Connection stays.

**Expected output:** a Gmail connection named `YM Gmail — visa.lodgement` that returns live messages.
That single artifact unblocks all of M9.

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
