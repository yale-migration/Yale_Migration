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
