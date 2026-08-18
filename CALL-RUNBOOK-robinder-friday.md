# 📞 CALL RUNBOOK — Robinder, Friday 21 Aug 2026

**Purpose:** three setup items, done live while Robinder screen-shares. **You read, he clicks.**
Budget **25 minutes**. Researched and verified 19 Aug — sources at the bottom.

> ⚠️ **He drives, always.** Robinder shares HIS screen and types on HIS machine. You never ask him
> to type a password into your browser, and you never take control (established working method).

**Order matters.** Item 1 is quick and gives an early win. Item 2 is a *question* before it is a
task. Item 3 is the one with a genuine unknown, so it goes last with time to spare.

---

# ① META BUSINESS MANAGER — add Sharjeel, assign Page + Instagram

**Why:** M6 (enquiry capture) reads new enquiries from Facebook and Instagram. Their own SOP-CI-001
names both as enquiry channels, and discovery found **2 of 3 paid-ad enquiries were never answered**.

### Before he starts — one thing that silently breaks this
🔴 **The email you give him must be the email attached to YOUR Facebook account.** If it is not,
the invite either never arrives or lands on the wrong profile. **Check which email your Facebook
login uses BEFORE the call** and read that one out.

### Steps — read these aloud

1. Go to **`business.facebook.com/settings`**
   *(If it opens Meta Business Suite instead, click the ⚙️ **Settings** icon, then* **Business settings***.)*
2. Left menu → under **Users** → click **People**
3. Top right → **Invite people**
4. Enter your email address
5. **Business portfolio access: choose _Partial access_** — ⛔ **not** *Full control*
   > *Full control gives admin of the whole portfolio. We only need two assets. Asking for less
   > is both correct and reassuring to say out loud: "I only need the page and Instagram, nothing else."*
6. On the next screen, **assign the assets** — this is the step people skip:
   - Under **Pages** → select the Yale Migration Facebook Page → turn on **Full control**
   - Under **Instagram accounts** → select the Yale Instagram → turn on **Full control**
   > ⚠️ **Asset-level Full control is different from portfolio-level Full control.** Partial access
   > at the portfolio, full control on the two assets, is exactly right.
   > ⛔ **If you skip this, the invite still sends and you will see nothing.**
7. Click **Invite**
8. **You then check your email and ACCEPT.** It is not live until you do.

### If it goes wrong on the call
| Symptom | Cause | Fix |
|---|---|---|
| Instagram not in the asset list | IG is not a **Professional** account, or is not linked to the Page | Link it: Page → Settings → **Linked accounts** → Instagram |
| "Invite people" greyed out | He is not a **Full control** admin of the portfolio | Whoever set up the portfolio must do it |
| Invite never arrives | Wrong email, or already used on another portfolio | Re-send; check spam; confirm the FB-linked email |
| Assigned but nothing visible | Permission propagation | Can take a while — re-check later, do not re-invite |

✅ **Done when:** you accept the invite and can see the Page and the Instagram account under your
own Business settings.

---

# ② WHATSAPP — this is a QUESTION first, not a task

🔑 **The single most useful thing to understand:** "WhatsApp verification" is really **two** things,
and the second cannot start until the first finishes.

```
  Meta BUSINESS verification  ──►  WhatsApp DISPLAY NAME review  ──►  number registered
  (verify the company itself)      (only STARTS once business is        (OTP + 6-digit PIN)
                                    verified)
```

**So the only question that matters on Friday is: has the BUSINESS been verified?** Everything
downstream is blocked behind it, and it is the part that takes days.

### Step A — CHECK the status (do this first, takes 60 seconds)

1. **`business.facebook.com`** → ⚙️ **Settings** → **Business settings**
2. Left sidebar → **Business Info**
   *(in some accounts this is under* **Security Centre** *— both show the same thing)*
3. Look for **Business Verification Status**

| What he sees | What it means | What you do |
|---|---|---|
| **Verified** | ✅ Done. | Move straight to Step C |
| **Pending / In review** | Submitted, Meta is reviewing | Nothing to do. Note the date. Usually a few days |
| **Not verified** / **Get started** button | ⛔ **Never submitted** | Do Step B on the call |
| **Failed / More info needed** | Rejected or documents queried | Read the reason aloud, note it, redo Step B |

### Step B — only if it is NOT verified

1. Click **Get started** / **Start verification** next to Business Verification Status
2. **Country:** Australia. Then legal business name, address, phone — ⚠️ **these must match the
   official record exactly.** A trading name that differs from the registered name is the single
   most common rejection.
3. Meta first searches public registers automatically. If it cannot find them, upload **one** of:
   - Certificate of incorporation / **ASIC company extract**
   - **Business licence or ABN / tax registration**
   - Business **bank statement**
   - Utility bill in the business name
4. Choose a contact method — **email, phone call or SMS** — and enter the code Meta sends
5. Submit. **Typically a few business days.**

### Step C — only once the business is Verified

Display name review starts **automatically** once verification completes.

1. Open **WhatsApp Manager** (from Business settings → **WhatsApp accounts** / **WhatsApp Manager**)
2. Find the phone number → check the **display name status**. It must read **Approved**.
3. **The phone number itself must:**
   - have **no existing WhatsApp account** on it (personal WhatsApp on that number blocks it)
   - be able to receive an **OTP by SMS or voice call**
   - get a **6-digit two-step verification PIN** set during registration

### 🔴 What to say if it was never started
> "Ye chaar hafte pehle shuru ho jaana chahiye tha — engagement letter mein bhi likha tha ke Meta ki
> approval sab se lambi hoti hai. Ab shuru karte hain, lekin sach ye hai ke WhatsApp channel is
> phase mein shayad na aa sake. Facebook aur Instagram mein ye delay nahi hai, wo chal jayenge."

⛔ **Say it on the call.** Do not let it be discovered in week seven.

---

# ③ ONEDRIVE — read this section before the call, it is not what we assumed

## 🔴 The actual situation

The client folders are **not** on a Yale business account. They are on
**`robin_multani007@hotmail.com`** — Robinder's **personal Microsoft account** (drive
`A0BABA3C2640082C`). There is **no Microsoft 365 business tenant** (that is why
`GUIDE-microsoft-365-purchase.md` exists).

So *"create an `automation@yalemigration.com.au` user"* — access-checklist item 2 — **is not
possible without first buying Microsoft 365.** That instruction was written before we knew whose
drive it was.

### Two honest options

| | **Option A — free, can be done Friday** | **Option B — the proper fix** |
|---|---|---|
| What | A Yale-owned **Microsoft account** created against `project1@yalemigration.com.au`, and Robinder shares the folder with it | Buy **M365 Business Standard** (~AUD 18.70/user/mo), create a real `automation@` user, move the folders into the tenant |
| Cost | $0 | ~$18.70/user/month + a migration project |
| Fixes | The automation stops depending on my personal login | That **and** CR-003 — ~150 clients' passports living under one person's personal account |
| Risk | ⚠️ one unverified technical step, below | None, but it is Phase 2 work |

**Recommend Option A on Friday**, and put Option B to him as the Phase 2 conversation — do not try
to do both in one call.

### Option A — the steps

1. **Create the Microsoft account** *(verified: Microsoft accepts any existing email address)*
   - `signup.live.com` → choose **Use your email instead** / *use existing email address*
   - Enter **`project1@yalemigration.com.au`** → set a password → confirm the code sent to that inbox
   - ⛔ **Do NOT create a new @outlook.com mailbox.** Use the existing address.
2. **Robinder shares the folder**
   - Open OneDrive → right-click **`YALE MIGRATION - ONE SYSTEM`** → **Share**
   - Enter `project1@yalemigration.com.au` → set to **Can edit** → **Send**
3. **In Make — ADD, do not touch the existing one**
   - Connections → add a **new** Microsoft/OneDrive connection, signed in as the new account
   - ⛔ **Leave connection `9279810` (`sharry00010@`) exactly as it is.**
4. **STOP. Tell me it is done, and I test it before anything switches.**

### ⚠️ The one thing genuinely unverified — and why we test before switching

M3 and M4 reach the folders by **absolute drive ID**:
`/v1.0/drives/A0BABA3C2640082C/items/…`

For **personal** OneDrive, a folder shared with someone else appears in their account as a
**`remoteItem`** — it may or may not be reachable at the owner's original drive path. Microsoft's
own documentation describes the remoteItem behaviour but does not promise the direct path works for
a guest.

**So:** I will test the new connection against the real path **while both connections still work**.
If it resolves, we switch M3/M4 over and only then remove mine. If it does not, the blueprints need
a small change first — a change we can make calmly, not mid-outage.

🔴 **NEVER let him remove my access first.** Folder creation stops that minute, silently.

---

# ④ EVERYTHING ELSE — only if the call is going well

Keep the three above sacred. These are extras, in priority order.

| | Ask | Why now |
|---|---|---|
| 1 | **Rotate the Anthropic key** — new one from `console.anthropic.com`, revoke the old | It came via WhatsApp, so treat it as exposed. 2 minutes, and it models good practice before the harder credentials conversation |
| 2 | **A go-live date** | Everything is built and waiting. Give him a date to work back from |
| 3 | **2–3 real client files** for end-to-end testing (M10) | A mix — one 500, one 485, one 482 |
| 4 | **CR-013 — the six visa lines.** Tell him you are sending a plan and cost this week | **His team asked for it.** Say the number is coming; do not quote on the call |
| 5 | **Dashboard access list** — his team said *"need to ask sir Robin"* | Who sees what. He is the only manager, so it is two levels not three |
| 6 | **Is JRP in or out of scope?** (A-19, open since 14 Aug) | 73 candidates, four steps each — a whole pipeline we have never scoped |
| 7 | ⚠️ **`student@yalemigration.com.au` is still under Mershe's name** and she has left | A live mailbox attributed to a former employee, at a firm holding ImmiAccount logins |

---

# ⑤ 🔴 A-18 — THE CREDENTIALS. VERBAL ONLY.

**Not in the runbook to send. Not in a message. Not in an email.** Say it only if the call is
relaxed and you are one-to-one.

> "Ek baat jo main likh kar nahi bhejna chahta tha. Aapki kuch sheets mein clients ke portal
> passwords plain text mein pade hain — ImmiAccount logins bhi — aur ek list mein taqreeban sab par
> ek hi password lag raha hai. Wo files email par ghoomti rehti hain. Main kahunga ke wo passwords
> change kar lein aur unhein kisi proper jagah rakhein. Main dikha doon ga kaise — ghante bhar ka kaam hai."

**Why verbal:** in writing, addressed to a Registered Migration Agent, it is discoverable, it names
the exact tabs, and it reads as an accusation. Spoken, it reads as help. Follow up in writing with
**the solution only** — never the inventory of where the passwords are.

---

# ⑥ AFTER THE CALL — tell me immediately

I can verify all three over MCP at **zero operations cost**:

- **Meta** — you will see the assets in your own Business settings once you accept
- **WhatsApp** — tell me the exact status word he read out, and the date if pending
- **OneDrive** — the moment the new connection exists, I test the drive path before anything switches

Then I update `INPUTS-REGISTER.md`, close what closes, and start M6.

---

# Sources — checked 19 Aug 2026

- [Add People to a Business Portfolio and Assign a Business Asset — Meta Business Help Center](https://www.facebook.com/business/help/2169003770027706)
- [How to Give & Request Access to a Meta Business Portfolio — Leadsie](https://www.leadsie.com/blog/give-request-access-to-meta-business-portfolio)
- [Granting Full Access to Instagram and Facebook Assets via Meta Business Manager (Revised 2026) — Inventiva](https://www.inventiva.global/granting-full-access-to-instagram-and-facebook-assets-via-meta-business-manager/)
- [How To Verify Facebook Business in 4 Steps (2026) — Chatimize](https://chatimize.com/verify-facebook-business/)
- [Verify Your Business in Meta Business Suite — Meta Business Help Center](https://www.facebook.com/business/help/2058515294227817)
- [About WhatsApp Business Display Name — Meta Business Help Center](https://www.facebook.com/business/help/338047025165344)
- [Register a business phone number — Meta for Developers](https://developers.facebook.com/documentation/business-messaging/whatsapp/business-phone-numbers/registration)
- [Working with files in Microsoft Graph — Microsoft Learn](https://learn.microsoft.com/en-us/graph/api/resources/onedrive?view=graph-rest-1.0)
- [Access shared items (shares API) — Microsoft Learn](https://learn.microsoft.com/en-us/graph/api/shares-get?view=graph-rest-1.0)
- [How to create a Microsoft account with an existing email — Microsoft Q&A](https://learn.microsoft.com/en-us/answers/questions/5873848/how-to-create-the-microsoft-account)

⚠️ **Meta's own help pages are JavaScript-rendered and could not be read directly.** The Meta steps
above come from third-party guides that transcribe the current UI and **agree with each other**;
the Microsoft and Meta-for-Developers pages were read directly. Expect small label differences —
the menu *structure* is right even if a button reads slightly differently.
