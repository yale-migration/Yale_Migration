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
