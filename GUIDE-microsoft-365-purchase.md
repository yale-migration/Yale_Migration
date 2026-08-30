# MICROSOFT 365 — PURCHASE GUIDE FOR YALE MIGRATION
**Prepared 14 Aug 2026.** Every price and every step verified against Microsoft's own pages today.
Sources at the bottom. Not legal or tax advice — GST and deductibility are for his accountant.

---

# 🔴 READ THIS FIRST — the one thing that can break their email

**Yale's email runs on Google Workspace.** We confirmed this from public DNS — `yalemigration.com.au`
points at `aspmx.l.google.com`.

> **A domain's MX record can only point at ONE mail system.**
> If the Microsoft setup wizard is allowed to change the MX record, **every Yale email address stops
> receiving mail immediately** — including `visa.lodgement@`, which is where the Department sends s56
> letters.

Microsoft's own setup walkthrough ends with *"set your domain as the primary email for your users."*
**That step is the one that kills their email.** It is presented as a normal part of setup.

## ✅ The safe path — three rules

| Rule | Why |
|---|---|
| **1. Verify the domain with a TXT record ONLY** | proves ownership, changes nothing |
| **2. NEVER change the MX record** | this is the switch that breaks email |
| **3. NEVER "set as primary email" for a user** | same switch, different button |

Follow those three and Google keeps delivering mail exactly as it does today, while Microsoft handles
files, Teams and desktop Office. **This combination is supported and common.** It just is not what
the wizard nudges you toward.

**Tell Robinder in one sentence:** *"When Microsoft asks to change your MX records, say no. That's the
one step that would stop your email."*

---

# 🤔 BEFORE HE SPENDS ANYTHING — one question worth asking

**He may already own the fix.**

The real problem we are solving is that ~150 clients' passports sit on **one person's personal
Microsoft account** with no company control, no admin oversight, and no way to remove access when
someone leaves (CR-003).

**Google Workspace Business Standard and above already include Shared Drives** — company-owned
storage where files belong to the business, not a person. If Yale is already on Standard or Plus,
that problem can be solved for **$0 extra**.

### So the honest comparison

| | **Buy Microsoft 365** | **Use Google Shared Drives** |
|---|---|---|
| Extra cost | ~$18.70/user/month | **$0** if already on Business Standard+ |
| Vendors | 2 (Google mail + Microsoft files) | **1** |
| Moving the ~1,436 folders | personal OneDrive → OneDrive for Business — **same vendor, straightforward** | OneDrive → Google Drive — **cross-vendor, harder** |
| Our automation | Make keeps its OneDrive modules, just re-authorised | **M3 and M4 storage layer rebuilt** (a few hours) |
| Desktop Word / Excel / Outlook | ✅ included | ❌ Google Docs only |
| Risk to email | manageable, see rules above | none |

**My recommendation: buy Microsoft 365 Business Standard.** The migration is far simpler when the
files stay within Microsoft, our automation survives with a re-authorisation instead of a rebuild, and
a document-heavy migration practice genuinely wants desktop Word.

**But he should know the alternative exists.** If cost matters more than convenience, Google Shared
Drives is cheaper and tidier long-term. **Question to ask: which Google Workspace plan are you on?**

---

# 💰 WHAT IT COSTS — Australian pricing, verified today

**Per user, per month, excluding GST, on an annual commitment.** These reflect the 1 July 2026 increase.

| Plan | AUD | Email | Desktop Office | 1TB OneDrive | Teams | Device management |
|---|---|---|---|---|---|---|
| Business Basic | **~$9.00** | ✅ | ❌ web only | ✅ | ✅ | ❌ |
| ⭐ **Business Standard** | **~$18.70** | ✅ | ✅ | ✅ | ✅ | ❌ |
| Business Premium | **~$32.90** | ✅ | ✅ | ✅ | ✅ | ✅ |

### ⭐ Recommended: **Business Standard**

- **Basic is a false economy.** No desktop Word or Excel. A practice that produces checklists, forms
  and statutory declarations all day will resent it within a week.
- **Premium is only worth it if he issues company laptops or phones.** It adds Intune device
  management — which becomes relevant only if the phone-monitoring conversation (CR-010) ever
  proceeds. Not today.

### How the billing options actually work — this catches people

| Option | Price | Locked in? |
|---|---|---|
| **Annual commitment, paid yearly** | base price — **cheapest** | 12 months |
| Annual commitment, paid monthly | base **+5%** | 12 months |
| Monthly commitment | base **+20%** | cancel any time |

**There is a 7-day cancellation window** on a new subscription for a prorated refund. After that, an
annual commitment runs its term.

**Advice:** start on **monthly commitment** for the first month even at +20%. It costs a few dollars
more and it means that if the folder migration turns up a surprise, he is not locked in for a year.
Switch to annual once it is settled.

### 🔑 BETTER ADVICE — start with 3 licences, not 11

**Is buying this compulsory? No.** Nothing breaks if he does nothing. The system works today. This is
a **governance** problem, not a functional one.

**But the exposure is real, and it is sharper than this guide first said.** ⛔ **Verified from Make
28 Aug (D-412): connection 9279810, labelled "Yale's Microsoft connection", is
`sharry00010@gmail.com` — SHARJEEL'S OWN personal Microsoft account.** Not Robinder's, not a staff
member's. Ours.

So ~1,436 client folders — passports, police checks — sit on **the consultant's personal account**,
with `Files.ReadWrite.All` granted to it. That is not Yale's internal governance problem to get
around to. **It is a live exposure this engagement created**, and it must not survive handover: the
day our access ends, Yale loses the route to its own client files.

🔑 **Say it that way.** "Your files are on someone's personal account" is a lecture. "Your clients'
files are on MY personal account and that has to change" is true, and it is the version that gets
acted on.

**So: buy it, but small.** The problem is *ownership*, and ownership is fixed by the tenant existing —
not by how many people are licensed.

> 🔴 **PRICING RE-VERIFIED 28 Aug 2026** at microsoft.com/en-au — **the plan line-up changed and the
> old figures in this guide were wrong.** Business Standard is now sold bundled with Copilot at
> **AU$35.20/user/month**, nearly double the ~$18.70 this guide assumed. Do not quote the old number.
>
> | Plan (annual commitment, ex GST) | AUD/user/month | OneDrive |
> |---|---|---|
> | **Business Basic** | **$10.50** | **1 TB** |
> | Business Standard *with Copilot* | $35.20 | 1 TB |
> | Business Premium *with Copilot* | $47.90 | 1 TB |

### ⭐ REVISED RECOMMENDATION — 3 × **Basic**, not Standard (D-410)

**Basic includes the 1 TB of OneDrive per user, and OneDrive is the entire reason we are here.**
The problem is that ~1,436 client folders sit on one person's personal account; that is fixed by a
company-owned tenant with company-owned storage. **Desktop Word does not fix it, and desktop Word is
the only thing Basic leaves out.**

| | Licences | Plan | Cost/month | Fixes ownership? |
|---|---|---|---|---|
| **Start here** | **3** | **Basic** | **~AU$31.50 + GST** | ✅ yes |
| If someone truly needs desktop Office | +1 | Standard | +$35.20 | — |
| Everyone, later | 11 | Basic | ~$115.50 + GST | ✅ |

⚠️ Staff keep whatever they use for documents today — buying this takes nothing away. Upgrade an
individual from Basic to Standard later if they actually want the desktop apps; **that is a one-click
change, not a repurchase.**

Three licences — Robinder plus whoever manages the files — creates a company-owned tenant with
company-owned storage. **Staff get added when they actually want desktop Word, not before.**
This also de-risks the migration: prove it on a small tenant before committing eleven seats.

### How many licences

Roughly **11 people** appear across their roster and tracker: Robinder, Priyanka, RJ, Inder, Star,
Rey, Gayatri, Fiza, Cristelle, Mershe, Manali. **Confirm the real number with him.**

⛔ **STRUCK 28 Aug (D-411) — DO NOT USE THIS ARGUMENT WITH YALE.** ~~Shared addresses like `info@`
can be free shared mailboxes.~~ True of Microsoft 365 in general (50 GB, no licence) and **moot here**:
Yale's mail is delivered by **Google Workspace**, and this same guide tells them never to change the
MX record. A Microsoft shared mailbox on that domain would receive nothing. 🔴 Offering the saving
points them at the one switch that stops `visa.lodgement@` receiving Department letters.

✅ **Use this instead, from Microsoft's own shared-mailbox docs — it supports the no-shared-login
rule:** *"A shared mailbox isn't intended for direct sign-in… Always block sign-in for the shared
mailbox account and keep it blocked."* Even Microsoft's way of sharing an inbox has each person sign
in as themselves.

At 11 licences on Business Standard: **≈ AUD $206/month + GST ≈ $2,470/year.**

---

# 🛒 HOW TO BUY — step by step

## Step 1 · Decide the number
Count only people, not shared addresses. Licences can be added later at any time.

## Step 1b · 🔴 WHO SIGNS UP — the step that decides whether any of this works (D-414)

⛔ **This guide never said it, and it is the most important line in the whole document.**

The entire purpose of buying Microsoft 365 is to move ~1,436 client folders **off a personal account**
— currently Sharjeel's (D-412). **If Robinder signs up using a personal Gmail and pays with a personal
card, the new tenant is owned by a personal account too, and we have moved the problem rather than
fixed it.** The files would be safer, and Yale would still not own the container.

| | Use | Not |
|---|---|---|
| **Sign-up / billing email** | a Yale address — `info@` or `robinder@yalemigration.com.au` | any `@gmail.com` |
| **Payment card** | the company card (ACN 607674859) | a personal card |
| **Who holds the admin password** | Robinder | us |

⚠️ **Using a Yale address at signup does NOT connect the domain.** Microsoft only asks for a contact
address for receipts and account recovery — that is a completely separate thing from adding
`yalemigration.com.au` to the tenant, which we are deliberately skipping (D-413). Two different
screens; only one of them touches DNS.

🔑 **Test the outcome, not the intention:** *if Robinder and Sharjeel both disappeared tomorrow, could
Yale still reach its client files?* Signed up on a Yale address and paid on the company card, yes.
Signed up on someone's Gmail, no — and that is the situation we are being paid to end.

## Step 2 · Buy direct from Microsoft
Go to **microsoft.com/en-au/microsoft-365/business** → Business Standard → *Buy now*.

**Buy direct, not through a reseller.** A CSP partner adds a middle layer for support Yale does not
need at this size, and it complicates who owns the tenant.

## Step 3 · Create the tenant
He will be asked for a company name and a temporary address like `yalemigration.onmicrosoft.com`.

🔴 **This account must be created by ROBINDER, on his own machine, with his own details.**
It becomes the owner of every client file the business holds. **It must never be created under a
staff member's personal account** — that is exactly the problem we are fixing.

## Step 4 · ⛔ DO NOT ADD THE DOMAIN AT ALL — REVISED 28 Aug (D-413)

**Skip this step entirely.** Microsoft gives every tenant a free `something.onmicrosoft.com` domain
*"in case you don't own a domain, or don't want to connect it to Microsoft 365"* — their words.
OneDrive and SharePoint work fully on it.

🔴 **Their registrar is GoDaddy, which supports Domain Connect** — so the domain wizard offers to add
Microsoft's DNS records *automatically*, in one authorise click, MX included. There may be no clear
"no" to click. **Never opening that wizard is the only reliable protection.**

⚠️ **At signup, the name typed into the tenant-name box becomes the permanent OneDrive/SharePoint URL
and can never be deleted.** Type `yalemigration`.

~~## Step 4 · Add the domain — ⚠️ THE CAREFUL BIT~~ *(kept below for the day they deliberately move
email to Microsoft — not now)*
Admin centre → **Settings → Domains → Add domain** → `yalemigration.com.au`.

**Choose "Add a TXT record to verify ownership."**

- ✅ Add **only** the TXT record to DNS
- ⛔ **Decline every prompt to add or change MX records**
- ⛔ **Skip "set as primary email"** for every user
- ⛔ If it offers to "set up email," **say no**

Verification usually completes in minutes; DNS can take up to 48 hours.

## Step 5 · Create the users
Add each staff member. Their Microsoft sign-in can be their normal work address — **that does not
move their mail**, as long as steps in 4 were followed.

## Step 6 · Turn on OneDrive for Business
Each licensed user gets 1TB. This is the company-owned storage that replaces the personal account.

## Step 7 · ⛔ STOP — do not move any files yet
**Talk to us first.** Moving the folders is the actual project, and it breaks our automation for the
duration. See below.

---

# 🔧 WHAT WE NEED AFTER HE BUYS

## From him

| # | What | Why |
|---|---|---|
| 1 | Confirmation the tenant is created **in the company's name** | it owns all client files |
| 2 | The list of licensed users + their new sign-ins | feeds the `STAFF` tab and the dashboard's access control — **this also answers A-16** |
| 3 | An admin invite for us, or a screen-share slot | to connect Make to the new storage |
| 4 | A date for the folder migration | it needs a quiet window |

## What we do

| # | Task | Effort | Impact |
|---|---|---|---|
| 1 | Re-point Make's OneDrive connection at the company tenant | 30 min | 🔴 **folder automation stops until this is done** |
| 2 | Update every folder ID in M3 and M4 | 1–2 h | new drive means new IDs everywhere |
| 3 | Re-mirror the 28 canonical checklists | 30 min | M4 copies from this library |
| 4 | Re-test M3 and M4 end to end | 1 h | non-negotiable before going live again |
| 5 | Migrate ~1,436 client folders | **half to full day** | the real work |

## 🔴 The honest warning to give him

> **"Buying the licences takes ten minutes. Moving your fourteen hundred client folders is a proper
> job, and while we move them the folder automation has to be switched off. Let's plan a day for it
> rather than doing it piecemeal."**

## And the disclosure that goes with it

The Make connection to their OneDrive currently authenticates as **`sharry00010@gmail.com` — our
account, not theirs.** This is the last thing we hold that should be his.

**Say it now, while he is already buying M365.** It turns a handover problem into a natural next step.
If he discovers it later, it looks like it was hidden.

---

# ✅ THE ORDER TO DO IT IN

```
1. Check which Google Workspace plan they are on   ← may make this unnecessary
2. Confirm the licence count (people only)
3. Buy Business Standard, monthly commitment to start
4. Create the tenant — ROBINDER's own account
5. Add the domain with TXT ONLY  ⛔ never touch MX
6. Create users, turn on OneDrive for Business
7. ⛔ STOP — book the migration day with us
8. We re-point Make, update IDs, re-test
9. Migrate the folders
10. Switch the automation back on
```

**Steps 1–6 he can do alone. Step 7 onward is ours.**

---

# 📌 THE FIVE THINGS TO SAY, IF NOTHING ELSE

1. **"When Microsoft asks to change your MX records, say no."** ← the email-breaking step
2. **"Business Standard, about $18.70 per person plus GST."** Basic has no desktop Word.
3. **"Shared addresses like info@ don't need a paid licence — they're free."**
4. **"Create it in the company's name, on your own account."**
5. **"Don't move any files until we've planned the day."**

---

## Sources — all checked 14 Aug 2026

- [Microsoft 365 Business plans and pricing](https://www.microsoft.com/en-us/microsoft-365/business/microsoft-365-plans-and-pricing)
- [Add your Google Workspace domain — Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-365/admin/moveto-microsoft-365/add-google-domain?view=o365-worldwide)
- [Connect your domain to Microsoft 365 — Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-365/admin/moveto-microsoft-365/connect-domain-tom365?view=o365-worldwide)
- [Microsoft 365 pricing Australia 2026 in AUD](https://frontrowtech.com.au/insights/microsoft-365-pricing-australia-2026)
- [Australian pricing changes from 1 July 2026](https://www.ottoit.com.au/blog/microsoft-365-pricing-changes-australia-july-2026/)
- [Google Workspace plan comparison — Shared Drives](https://workspace.google.com/pricing)
