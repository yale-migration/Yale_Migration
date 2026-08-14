# CHANGE REQUESTS — anything the client asks that is NOT in the signed MVP scope.
Rule: log it, reply "Phase 2/3 list mein daal diya 👍", keep building. Never absorb silently.
Format: CR-### | date | request | status | disposition

CR-001 | 2026-07-19 | Custom CRM "Google friendly" (sent links: Migration Manager, Agentcis,
CRM4Agencies) | PARKED | Phase 3 candidate — AppSheet face over our data layer (~30–50h, scope after
MVP live; client to rank features: screens / client portal / VEVO). Never promise eLodge or trust
accounting (regulated).
CR-002 | 2026-07-25 | "Move to GoHighLevel instead?" | DEFLECTED (client accepted) | GHL = rented
platform, contradicts his own "Google friendly" + privacy commitments (passports on 3rd-party servers,
$100–300/mo forever). Evaluate GHL vs AppSheet at Phase 3 only.
CR-003 | 2026-07-25 | (internal note) Client documents on a PERSONAL Microsoft account | PARKED |
CORRECTED 2026-07-29: capacity is NOT a risk — BRISBANE OFFICE alone is 68.2 GB, so they are on a paid
Microsoft plan (1TB+). The remaining issue is governance/ownership: ~150 clients' passports and police
checks sit under one individual's personal account. Phase 2/3 recommendation only, not a blocker.

## Phase 2 backlog (already scoped in Proposal v3 — 49h, quote after MVP)
Quotes+Xero (fee master ready) · deadline engine (blueprint = "YALE BRISBANE OFFICE WORK" S56 tabs) ·
QC gate w/ content-vs-label check · Looker dashboard · advanced AI (doc classify+rename) · enrolment
tracker · refund workflow · extended visa lines · appointment booking · EOI points calculator · role
routing/agreements. Plus open client items: fee-conflict review call, genuine Subclass 190 checklist.

CR-004 | 2026-07-31 | (discovered, not client-requested) **Employer-sponsorship matters need their own stage
vocabulary** | PARKED → Phase 2 | The SBS thread (D-95) shows sponsorship is a **3-stage chain: SBS → employee
nomination → visa**, each with its own lodgement and outcome. Our MASTER `Processing Stage` dropdown models a
single-visa flow only, so a 482 sponsor matter cannot be tracked truthfully today. Also observed: **payment
gates progress** ("once we receive the payment, we will begin finalizing") — so a document-chase must not chase
documents when the real blocker is an unpaid invoice. Phase 2 work: sponsor-matter grain + stage set + an
`awaiting payment` blocker state feeding M5. MVP impact: none — record 482 sponsor matters as single rows and
note the stage in Notes.
CR-005 | 2026-07-31 | (discovered) **Approval → marketing post automation** | PARKED → Phase 2/3 | Approvals
are forwarded `info@` → `manali@` with the body "for posting" (D-96): a visa/sponsorship win triggers a
MARKETING action, not only a client action. Cheap, high-goodwill automation — detect approval → draft a
social post (no client names/PII) → Manali reviews and publishes. Deliberately NOT MVP: it touches public
comms, which needs its own approval rules.
CR-006 | 2026-07-31 | (internal capability, not client scope) **Make partner status for "Credential requests"**
| PARKED | Make's Credential-requests feature is the correct way to collect client credentials — secure link,
client authorizes in their own browser, we never see the password. Restricted to Make **partners/enterprise**
(D-87), so unavailable on the client's Free plan. Would remove the whole screen-share/reauthorize dance seen
on 31 Jul (D-90/D-97) and improve every future client onboarding. Ours to pursue, not billable to Yale.

CR-007 | 2026-08-03 | **Client asks to run the CRM demo IN PARALLEL with MVP-1** — "we can work side by side
on CRM demo along with MVP 1 … so our other branches will start working on it, and we'll have a demo on what
we are working on" | POSITION: **SEQUENCE IT, DON'T PARALLELISE — and say yes to the goal, not the timing.**
Reasoning (engineering, not stalling):
  1. **The CRM is a FACE over the MASTER data layer** (CR-001: AppSheet over our data). That data layer is
     being built and validated RIGHT NOW, and has not yet met real data — the ~48-row tracker import is still
     to come and will surface schema issues (their Visa Type free-text mixes variants, contradictory
     stage/outcome combinations — D-53/D-56). **Build the CRM face before the schema settles and it gets
     built twice.** That is real rework, paid or unpaid.
  2. **Nothing is shipped yet.** Zero client-visible output. Opening a second workstream before the first
     proves itself is precisely the focus failure that cost 31 Jul (G4).
  3. **The good news is genuine, not a consolation:** once MASTER holds real clients, an AppSheet view over
     it is **hours, not weeks** — it reads the sheet directly. Finishing the data layer first makes the CRM
     demo cheap; doing it first makes it expensive.
  4. Commercially: CRM is Phase 3 (~30–50h, CR-001). Starting unbilled Phase-3 work while MVP-1 is
     half-delivered dilutes both. **Robinder's underlying need — something to show his other branches — is
     legitimate and is better served by the MVP demo plus a populated CRM view than by an empty CRM shell.**
DISPOSITION: reply yes-to-the-goal, sequence after the tracker import; offer the CRM view as the immediate
next thing once real data is in. Do NOT commit a date for the CRM until MVP-1 core is demoed.

## CR-008 — Checklist content rewrite (Phase 2) — raised by client 6 Aug
**Robinder, `New-docs/ANSWER.docx`:** *"These checklists are not fully implemented yet. If we can make a
better checklists that would be fine."* and, on the CDR issue, *"if you can suggest a better way for this,
we are willing to update it."*
**Position:** accept the FORM, decline the CONTENT.
- ✅ **We do:** consistent structure across all visa lines, one file per variant, correct and predictable
  naming, a single source of truth so automation always selects the right file, and a template Robinder
  fills in.
- ❌ **We do not:** decide which documents a visa requires. Only the Registered Migration Agent advises
  (CLAUDE.md hard rule, D-240). A checklist missing a required document is a refused application.
**Sequence:** after MVP go-live. Do not absorb into M4 — M4 selects and delivers whatever files exist.

## CR-009 — Dashboard (raised by client 6 Aug, via Sharjeel)
**Ask:** Robinder wants "a dashboard of the things that are possible."
**🔑 DRIVER CLARIFIED 6 Aug (via Sharjeel): he wants to RUN MULTIPLE BRANCHES and see how they are working.**
That resolves the ambiguity — it is an **operations dashboard with Office/Team as the primary dimension**,
not a capability slide.
**⚠️ Same underlying need as CR-001 and CR-007** — three asks, one driver: multi-branch oversight.
CR-007 recorded his words on 3 Aug: *"so our other branches will start working on it."* All three read from
the SAME data layer. Full commercial detail + estimates now live in **`PHASE-2-3-BACKLOG.md` (P2-01)**.
**Original ambiguity, retained for the record:**
- **(a) An operations dashboard** — live counts off MASTER: matters by stage, by consultant, by visa type,
  dormant files, upcoming s56 deadlines. Looker Studio on the MASTER sheet. **~2h once the ~48 tracker rows
  are imported.** Note their existing tracker already has a manual dashboard block in columns P–Q, and its
  `48hr Alert` column is broken with a `#REF!` (D-55) — so this replaces something they already wanted.
- **(b) A capability overview** — a one-page summary of what the system can and will do. **~1h, no data.**
**Scope position:** Looker Studio is listed as **Phase 2** in the stack (`CLAUDE.md`). It is NOT in the
signed MVP (M1–M11). CLAUDE.md standing rule: new client requests get logged and parked, not absorbed.
**Recommendation:** reading **(a)** confirmed by the driver. Log, quote, and finish M4 + M5 first.
**Hard dependency: the ~48-row tracker import.** A dashboard over 5 test rows shows nothing and would
undo the impression the demo just built. Est. **6–10h**, billable — see `PHASE-2-3-BACKLOG.md` P2-01.
**Dependency:** meaningful only once the ~48 active matters are imported (M2 deferred item).

## CR-010 — Phone monitoring software (raised by client 13 Aug, WhatsApp)
**His words:** *"I want some advice on having some softwares for phones which can monitor activity /
calls / msgs and if they can be integrated on the dashboard."*

**🔑 SAME DRIVER, FOURTH TIME.** CR-001 (CRM, 19 Jul) → CR-007 (CRM demo in parallel, *"so our other
branches will start working on it"*, 3 Aug) → CR-009 (dashboard for multiple branches, 6 Aug) →
CR-010. He is opening branches and cannot see what his staff are doing. Every one of these reads from
the same data layer.

**POSITION: decline device monitoring, offer channel capture.** Full research, law, tools, costs,
timeframes and 12 edge cases in **`CALL-BRIEF-phone-monitoring.md`**. Headlines:
- **QLD IPA 1971 s43** permits a party to record their own conversation, but **s45 makes *sharing* it
  a separate offence** without consent — and a dashboard is sharing. The liability is in exactly the
  feature he asked for.
- **Statutory tort of serious invasion of privacy, in force 10 June 2025** — staff can sue directly,
  and it is **independent of the Privacy Act, so the small-business exemption is no shield**.
- **Philippines RA 4200 is all-party consent and binds participants** (*Ramirez v CA*), up to 6 years.
  With a Philippines office coming (D-230), one monitoring policy cannot cover both countries.
- **MARA Code** — call recordings are client PII; vendor and data location are a professional-conduct
  question. Consumer spy vendors (mSpy breach) are unacceptable for a firm holding ~150 passports.

**What we offer instead — move client conversations into business channels, so oversight is a
by-product rather than surveillance:** (A) WhatsApp Business Cloud API ⭐, (B) VoIP with recorded
lines and a consent announcement, (C) company-owned handsets + MDM (note: MDM gives device control,
**not** call content).

**Est. — prices verified against vendor pages 13 Aug 2026:**
- A · WhatsApp Business Cloud API — 2–4 wks (Meta verification is most of it). ⚠️ **No public Australia
  rate**; needs a BSP quote. 🔴 **Correction to earlier note:** the free 24-hour service window is
  ending — Meta split *service* into its own category on 1 Jul 2026 and **starts charging from
  1 Oct 2026** at utility/auth rates. Still small at their volume, but no longer free.
- B · VoIP — 3–5 wks incl. number porting. **Aircall Essentials USD $30/user/mo, 3-user minimum;
  RingCentral Core USD $20/user/mo annual or $30 monthly** (both ✅ vendor pages, USD not AUD).
  ~USD $120–180/mo for 6 seats. ⚠️ **Aircall's "unlimited" is US/Canada — Australian calls may be
  charged on top.** Confirm before signing.
- C · MDM — 1 wk, free on their existing Google Workspace.
- Dashboard integration +3–5 days each · policy pack 1–2 days **plus his lawyer's review**.
- Make Core (needed later for M6/M9, not this): **USD $9/mo annual, $12/mo monthly** ✅ vendor page.

**DISPOSITION: Phase 2. Logged, not quoted, not started.** ⛔ Do not begin before the MVP cutover —
all of it reads from a data layer that has not yet met their real client list. If he proceeds against
the advice, that is his call: put the advice in writing, log it, and require his lawyer's sign-off.

## CR-011 — Microsoft 365 purchase guidance (client asked 14 Aug)
Robinder wants to buy Microsoft 365 and asked us to advise on which plan and how.

**Say yes, and treat it as a win, not a distraction.** It closes **CR-003** — the governance problem we
logged on 25 Jul, where ~150 clients' passports and police checks sit under **one individual's personal
Microsoft account**. Business licences move that to company-owned OneDrive for Business with admin
control, retention, and offboarding. That is worth more to him than any dashboard.

**Australian pricing, per user per month ex GST, annual commitment, after the 1 July 2026 increase:**
| Plan | AUD/user/mo | Gets him |
|---|---|---|
| Business Basic | ~$9.00 | web/mobile Office, business email, Teams, 1TB OneDrive |
| **Business Standard** | **~$18.70** | + full desktop Office apps ← **recommended** |
| Business Premium | ~$32.90 | + device management and advanced security |

**Recommend Business Standard.** Basic has no desktop Word/Excel, which a document-heavy migration
practice will resent within a week. Premium is only worth it if he issues company laptops/phones — which
becomes relevant if CR-010 (phone monitoring) ever proceeds, since Premium includes Intune.

⚠️ **Migration is the real work, not the purchase.** Moving ~1,436 folders off a personal account onto
tenant-owned storage needs planning: our Make OneDrive connection (id 9279810) is bound to the personal
account and **will break at the migration**. Scope it before he clicks buy.
**DISPOSITION: advise free (30 minutes, goodwill, closes CR-003). The migration itself is Phase 2, quoted.**

## CR-012 — Role-based dashboard + client portal (client answered 14 Aug — see D-298)
Supersedes CR-009 in scope. Clients see their own matter · managers see their branch · Robinder sees all.
**This is CR-001 (the CRM) arriving in full, with the access model finally specified.**
🔴 **Not deliverable in a Google Sheet.** Staged: Sheet tab (done) → Looker Studio for staff (~1–2 wks,
free, real row-level security) → custom Next.js + Supabase portal for clients (Phase 3, 40–80h).
**Log, quote after MVP go-live. Do not absorb.**
