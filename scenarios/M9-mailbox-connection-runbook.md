# Runbook: connect `visa.lodgement@yalemigration.com.au` to Make (M9 prerequisite)

**Method: FROZEN (D-80/D-82).** OAuth the mailbox into Make's Gmail connection. Verified against Google
Workspace Admin Help, Gmail API docs and Make's own docs. **This never changes.** What follows is only the
*logistics* — who sits at which keyboard.

---

## Why this method and no other

| Option | Verdict | Why |
|---|---|---|
| Gmail **delegation** | ❌ impossible | Web-UI only. The Gmail API — so every Make module — cannot see a delegated mailbox. Cannot target an external personal Gmail either. |
| **Service account + domain-wide delegation** | ❌ unavailable | Google supports it; Make's Gmail app has no service-account connection type. Would need a custom Google Cloud project + JWT via HTTP module. |
| **IMAP + app password** | ⚠️ Plan C | Basic auth died May 2025; needs 2SV + admin-enabled IMAP + app password. Fragile. |
| **Make "Credential requests"** | ❌ not on our plan | The purpose-built feature for this, BUT sending requires Make **partner/enterprise** + an approval form (`f.make.com/r/credential-requests`). We are on **Free**. Revisit if we ever go partner. |
| ✅ **OAuth the mailbox into Make's Gmail connection** | **CORRECT** | Make's documented requirement: authorized by signing in as the mailbox owner. One action, revocable by the client anytime. |

**Favourable finding:** Make's Gmail connection needs Google *restricted* scopes (message bodies). Google
blocks restricted scopes on **personal @gmail.com** accounts — but `visa.lodgement@` is **Google Workspace**
(MX `aspmx.l.google.com`, D-76), so the standard connection works with **no custom Google Cloud OAuth client**.
Had it been a personal Gmail, one would have been mandatory.

**Make is already in place** — nothing new bought or installed. The only thing Make cannot supply is the
mailbox's own sign-in; Google requires that once, from the mailbox.

---

## 🔴 Who sits where — and why NOT a screen-share from our side

**Robinder works on HIS OWN machine, on HIS OWN screen.** We do not share our screen for him to type into.

Reason: if he typed the mailbox password into *our* browser, the password would pass through our machine and
could be stored by our browser. That breaks the no-shared-credentials principle just as much as him sending
it over WhatsApp. It also gives him no way to verify what he authorized.

So: **he drives, on his device.** We are available on a call to talk him through it if he wants, but the
keyboard and the browser are his.

## 🔴 Two DIFFERENT logins — never conflate them

| | Which account | Purpose |
|---|---|---|
| **Login 1 — into Make** | the Make org that holds our scenarios | so the connection lands in the right workspace |
| **Login 2 — into Google, inside Make** | `visa.lodgement@yalemigration.com.au` | this IS the connection |

**Never say "log into Make with visa.lodgement@".** Signing up to Make with that address creates a NEW EMPTY
Make account with none of our scenarios — a confusing dead end.

---

## PREREQUISITE — Robinder needs a Make login (do this first)

⚠️ Per D-85 the org shows as **"My Organization / My Team"** (Make's default personal naming) and the only
real connection is authorized by `sharry00010@gmail.com` — so `ACCESS.md` #6 ("client = Owner") is in doubt.
**Verify first:** Make → **Org** → **Team / Users**.

- **If Robinder is already listed** → skip to Step 1; he signs in at make.com with his own email
  (Forgot-password self-serves).
- **If only Sharjeel is listed** → invite him: Make → **Org → Team → Invite a new user** → his email →
  role **Admin** (he is the client; Member also works) → he accepts by email and sets his own password.
  - If the invite screen shows an upgrade prompt, the Free plan is blocking extra users. Then either bring
    the paid plan forward (D-15 requires it at go-live anyway) or fall back to CONTINGENCY C6 below.
  - Log the outcome — it also settles the D-85 ownership question either way.

---

## Steps

⚠️ **Connections are created from INSIDE a module.** Make's docs: *"connections are created at the module
level during scenario building, not as a standalone action in the Credentials menu."* Confirmed by screenshot
(D-84): the `Credentials → Connections` page has **no Add button at all** — only Search, Reauthorize, Verify.

### Prep — Sharjeel, alone, before involving the client (~3 min, exact clicks)
1. Left sidebar → **Scenarios** → button top-right **+ Create scenario**
2. On the blank canvas click the big **+** circle
3. In the app search box type **Gmail** → click the **Gmail** app
4. In the module list choose the trigger **Watch emails** (has a clock/lightning icon — it is a trigger, so
   it takes the first position automatically)
5. The module settings panel opens showing a **Connection** field with **Create a connection**.
   **DO NOT click it** — that click belongs to Robinder. Close the panel with the **X** / click outside.
   The module will show a warning triangle. That is expected and correct.
6. Rename the scenario: click the scenario name at the **top-left** (default "New scenario") → type exactly
   **`YM-M9 SETUP — connect mailbox`** → Enter
7. **Save** — the floppy-disk icon at the bottom-left of the canvas (or Cmd+S)
8. **Leave the scenario OFF** (the toggle stays inactive). An inactive scenario does not count toward the
   Free plan's 2-active-scenario limit, so this costs nothing.
9. Confirm it is listed under **Scenarios** by that exact name — Robinder must be able to find it by name.

This reduces his job to four clicks plus a Google sign-in, in a screen he cannot get lost in.

### Robinder — on his own machine (~2 min)
4. **make.com → Sign in** with his own email. Confirm the workspace at top-left is the one with our scenarios.
5. Open scenario **`YM-M9 SETUP — connect mailbox`** → click the **Gmail** module
6. At the **Connection** field → **Create a connection**
7. Name: **`YM Gmail — visa.lodgement`** (convention `YM <service> — <account>`) → **Save**
8. Google window opens → sign in as **`visa.lodgement@yalemigration.com.au`** + 2FA on his phone
9. Consent screen → **tick EVERY requested permission** → **Continue / Allow**
   - Partial ticks are the #1 cause of a connection that saves but fails at runtime.

### Verify — do not skip
10. Same module: Folder `INBOX`, **Mark as read: NO**, Maximum results `1`
11. **Run once** → a real recent email must come back
12. Connection now appears under **Credentials → Connections** as verified
13. Rename the scenario **`YM-M9-email-triage`** — it becomes the M9 scenario. Nothing wasted.

**Expected output:** a verified Gmail connection `YM Gmail — visa.lodgement` returning live messages. That
single artifact unblocks all of M9.

---

## Contingencies — all inside this method, none is a method change

**C1 — "Access blocked" / admin policy on the consent screen.** Their Workspace restricts third-party API
access (not the default). Robinder as admin: **Security → Access and data control → API controls → Manage App
Access** → find **Make** → **Trusted** → Save → retry step 8. *(Verified path, Google Workspace Admin Help.)*

**C2 — 2FA code prompt.** Expected, not an error. He approves on his phone.

**C3 — He doesn't hold the mailbox password.** He is Workspace admin and the address is his own (D-64 header)
— he can reset it in the admin console.

**C4 — It's an ALIAS on his primary account, not a separate account.** Then Department mail already lands in
his primary mailbox: authorize **that** account instead. Same method; the watch filter then keys on the `To:`
address.

**C5 — He refuses to authorize that mailbox.** Gmail forwarding rule `visa.lodgement@` → `project1@`, read via
project1@'s connection. Cost: `From` becomes the forwarder, so sender rules must key on the ORIGINAL sender
inside the forwarded body (D-67 quote-stripping already handles nested forwards). Last resort.

**C6 — Free plan blocks adding him as a Make user AND we don't want to upgrade yet.** Then he authorizes from
his own machine using a Make login we create for the client's own email (owner-invite path), or — least
preferred — a live call where he types into his own browser after we hand over control via remote-control in
Google Meet. Never our browser, never a password sent to us.

---

## After the connection exists
- M9 build proceeds per `docs/M9-EMAIL-AI-SPEC.md`
- Watch filter: `from:@homeaffairs.gov.au` (domain, not one address — D-65) + subject pattern
- Dedupe by File number + Application ID, never message id (D-67)
- `project1@` separately needs its own OAuth for **sending** (D-13, M4) — different mailbox, ask at M4 time
