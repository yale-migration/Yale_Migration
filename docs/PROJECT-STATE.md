# PROJECT STATE — Yale Migration Workflow Automation
> **Purpose of this file:** living context document. Any AI session (Claude Code / Cowork / claude.ai),
> on any device, should read this file FIRST and resume from "Current Status & Next Actions".
> **Rule: update this file after every significant client message, decision, or deliverable.**
> Last updated: 2026-07-08

## 1. Who's who
- **Consultant:** Muhammad Sharjeel Saleem — sharry00010@gmail.com | +92 332 5760344 |
  linkedin.com/in/msharjeelsaleem | muhammad-sharjeel-portfolio.netlify.app
  ⚠️ NEVER brand deliverables as "Apex AI" or "RoarGlobal" — personal brand only.
- **Client:** Yale Migration and Education Consultants, Level 12, 241 Adelaide St, Brisbane.
  Migration agency, Philippines-focused clientele, 7 visa service lines
  (Student 500, Graduate 485, Partner 820/801, 482, 407, GSM 189/190/491, skills assessments).
  Team: Registered Migration Agent + consultants; owner does all email delegation manually.

## 2. Confirmed client facts (from their own answers, 2026-07-06/08)
- Client engagement log + deadline tracking: **Google Sheets**
- Cloud storage: **OneDrive** | Invoicing: **Xero** | Email: **Gmail** (project1@yalemigration.com.au, creds shared over WhatsApp — replace with delegated access + 2FA)
- Enquiries: **60–70/week** via Facebook / Instagram / WhatsApp / walk-in
- Emails: **20–50/day**, owner delegates manually
- Volume: **100–150 active files**, mostly student/graduate/work visas
- Priorities: 1 client folders, 2 requesting documents, 3 answering enquiries,
  4 follow-up leads, 5 quotes, 6 deadline tracking, + NEW: email replies & team delegation
- More SOPs coming — client says current ones are "not final versions" (spec-evolution risk, priced in contingency)

## 3. Source material (this folder)
- `01 INTERNAL SOPs - STAFF PROCESS MANUALS/` — 6 SOPs (500/485/820-801/482/407/GSM), all follow one
  8-section template; client-file convention: YM-code (YM-2026-00125) + 10 fixed sub-folders.
- `02 CLIENT-FACING - CHECKLISTS FEES & GUIDES/` — ~15 checklists + fee tables
  (500 VAC $2,500, show-money $29,710; 407 quote total $4,060).
- `99 ARCHIVE.../` — duplicates/junk, safe to delete. `00 READ ME - FOLDER GUIDE.md` — folder guide + 8 known SOP defects.
- `sample format for plan/` — format reference for proposals (structure only; ignore its Apex AI branding).
- Full audit finding: zero marketing/Meta-ads content in SOPs; "Meta" relevance = their lead channels.

## 4. The agreed plan (calibrated 2026-07-08 against Hilltop Auto1/Auto2 benchmark, ~18h for 2 prod automations)
**FULL BUILD: 63 h** | **MVP: 44 h** | **PHASE 2: 21 h** (MVP+P2 = 65; 2h split premium, disclosed)

| # | Module | Hrs |
|---|---|---|
| 1 | Discovery, access setup & spec confirmation | 3 |
| 2 | Master data layer — Sheet restructure + YM-code engine + migration | 3 |
| 3 | Intake form → auto OneDrive folder + 10 sub-folders (Google→Graph API, pays infra cost) | 4 |
| 4 | Checklist selector & document request (decision matrix → template → upload link) | 3 |
| 5 | Document tracking & auto-chase (folder poll → sheet status → day-3/7 reminders) | 4 |
| 6 | Enquiry capture hub — FB/IG/WhatsApp auto-replies + logging + dedupe (4 ingress channels) | 8 |
| 7 | Lead follow-up sequences | 2 |
| 8 | Gmail triage & team delegation — Claude classification, auto-assign, s56 flagging, reply drafts | 7 |
| 9 | Quote generator + Xero draft invoices | 4 |
| 10 | Deadline engine (s56 / expiry / 2-yr 801 → alerts 14/7/1 days) | 2 |
| 11 | Pre-lodgement QC gate | 2 |
| 12 | Operations dashboard (Looker Studio) | 2 |
| 13 | End-to-end testing with live files | 3 |
| 14 | Training, documentation & handover | 3 |
| 15 | Client communication & iteration allowance (~15%) | 8 |
| 16 | Contingency reserve (evolving SOPs / undiscovered complexity; released if unused) | 5 |
| | **TOTAL** | **63** |

**MVP (44h)** = modules 1–8 core (32) + testing 2 + handover 2 + comms 5 + contingency 3.
Gmail in MVP = core rules/labels/assignment (5h); advanced AI reply drafting → Phase 2.
**Phase 2 (21h)** = Xero quotes 4, deadline engine 2, QC gate 2, dashboard 2,
advanced AI (tuned reply drafting + document auto-classification & auto-RENAMING of uploads —
covers their "JUAN DELA CRUZ - PASSPORT" naming convention) 4, final QA/deploy/training 3,
comms 2, contingency 2.

**Rate mechanism:** quote honest hours; price AI leverage into the RATE, never inflate hours.
Pitch anchor: a traditional build of this scope = 120–150 agency hours.

## 5. Audit decisions log (why numbers are what they are)
- 120h original estimate → 55h after AI-assisted calibration → **63h after deep audit** because:
  M6 7→8 (4 ingress channels, +30–50% rule), M8 5→7 (Auto 1 took 10–11h fresh; Gmail API ≠ Graph,
  only patterns reuse, -20–40% not -50%), +5h contingency (client's SOPs explicitly "not final" =
  evolving-spec risk +30–60% in the benchmark framework).
- Testing/training/comms hours are NEVER compressed (benchmark rule).
- WhatsApp Business API must be kicked off FIRST (days of Meta approval elapsed time).
- Build entirely inside client's own accounts (their Workspace/OneDrive/Make/Xero); privacy: files
  contain passports/police checks → no third-party storage beyond tools they already use.

## 6. Current status & next actions
**Status:** Proposal stage. SOP folder audited & reorganized ✅. Client answered discovery Qs ✅.
Client asked for email/delegation help ✅ (added as M8). Hours calibrated & audited ✅.
Cowork prompt for the proposal document delivered to Sharjeel ✅ (63/44/21 numbers).
**Waiting on client:** additional SOPs; engagement-log Sheet access; email platform answers were
given (Gmail); team-member list for delegation rules; 5–10 sample replies.
**2026-07-08 (later):** Proposal PDF generated via Cowork (`project documents/Yale-Migration-Workflow-
Automation-Proposal.pdf`, 10 pp). Deep audit PASSED on math (63/44/21 all verified) and structure, but
5 fixes required before sending: (1) p4 calibration note overstates track record — claim only AI email
classification + cloud document-filing production automations; (2) soften absolute promises ("never
missed"/"every email") to "logged automatically"/"auto-routed with uncertain items flagged"; (3) AI
privacy wording → "not used to train models"; (4) fix split table rows / orphaned Total rows (pp 3-4,
5-6) and half-empty pages 6+9; (5) verify "OneDrive" spelling on cover. Fix prompt delivered to
Sharjeel. Client message drafted asking for any remaining requirements + outstanding SOPs.
**2026-07-08 (final):** All fixes applied and verified — proposal PDF (8 pp) passed final audit: math
63/44/21 ✓, truthful calibration claim ✓, no absolutes ✓, OneDrive typo fixed ✓. **CLEARED TO SEND.**
Awaiting Robinder's sign-off before sending to Yale with the drafted client message (asks for remaining
requirements + outstanding SOPs).
**Next actions:** 1) Robinder sign-off → send proposal + client message. 2) On approval: kick off
WhatsApp Business API application immediately, then M1 discovery. 3) Replace shared Gmail password with
delegated access + 2FA.

## 6b. SOP'S 2 audit (2026-07-16) — client's FINAL requirements folder (`SOP'S 2/`, ~85 files)
All 4 parallel audits complete. **Genuinely new material:**
- **INQUIRY SOP (SOP-CI-001)**: 8 enquiry channels (adds Email/SMS/Website/Referral to our 4); 7-day
  pending-enquiry follow-up SLA; lost-lead statuses (Not Proceeding/Pending Decision/Lost Lead) with
  7-day + 30-day nurture cadence; consultant auto-assignment; Consultant↔RMA endorsement workflow;
  re-open loop; Follow-up SMS Template exists (SMS channel decision needed).
- **ANSWERING PHONE SOP**: 3-ring SLA; call-log fields (new/existing, AU/overseas, best callback time);
  name+DOB identity check; mid-call lookup of outstanding docs + follow-ups; callback task queue;
  names Microsoft Outlook/Teams/Excel (stack conflict with Gmail plan — MUST confirm with client).
- **12 WORKFLOW DIAGRAMS** (`WORK FLOWS/`) = ground truth: universal case skeleton (enquiry→eligibility
  gate→engagement w/ code+folder+quote+SA→payment gate→docs→visa-specific→written approval→RMA QA→
  lodgement→post-lodgement pack→monitoring→s56 loop→outcome→closure); dual-party matters (482 employer+
  employee, 407 sponsor+applicant, Partner dual client codes); rework loops (amendments, LMT re-ads,
  EOI-improvement, school-chase); third roles (Skills Assessment Point Person, Processing Officer);
  Partner 801 two-year anniversary trigger; only-RMA-gives-advice compliance gate everywhere.
- **NEW SERVICE LINES**: Tourist 600, Dependent visa, Enrollment (education-provider leg: LOO→deposit→
  CoE/VoE, CoE-before-visa-draft gate, Enrolment Log Sheet), Skills Assessment SOP, WHV 417 2nd, Child
  101, 191 (file mislabelled "190"), EOI service ($500 PF), ART review, Refund workflow (REFUND FORM).
- **FEE WORKBOOK** `BREAKDOWN OF FEES_YALE MIGRATION.xlsx`: 6 sheets (485/ART/AFP/JRP/500/Tourist+BVB),
  1.4% card surcharge, show-money calc (29,710, offshore halving), ANZ payment block. Gaps: no sheets
  for 482/407/190-191/child/partner/WHV/EOI; JRP PF conflicts vs JRP guide; broken BVB #VALUE! formula.
  482 client doc has richest fees (SAF levy by turnover/years; employer 3,390+SAF; applicant 6,400).
- **CIS (Customer Information Sheet)** = intake-form field map (applicant+spouse, 10-yr employment/
  education/travel history).
- **Checklists**: mostly MD5 duplicates of old set; NEW: 500 offshore-with-dependent, updated
  adding-dependent (OVHC, sponsor financials), 485 VETASSESS-with-dependent, rebuilt TRA-with-dependent,
  dependent-only checklists (new selector branch). "CDR" rename is byte-identical to old file — CDR
  content STILL missing.
- **DATA-QUALITY ISSUES for client**: 190/191 mislabel; WHV docx≠pdf; empty WITH-DEPENDENT docx; real
  client invoice PII in shared folder (APPLICATION FEES.docx); 482 SOP 2 = duplicate resave; SOP-CI-001
  doc-number collision (Inquiry + Skills Assessment); Google vs Microsoft stack inconsistency across SOPs.
**Scope impact**: core plan covers the skeleton; genuinely new scope ≈ 25h (phone intake+callback queue,
appointment booking, refund workflow, enrollment leg, quote-engine expansion + fee data consolidation,
new visa lines in selector, third-role routing, SA/consent e-sign; SMS mapped to WhatsApp = 0h).
**IMPORTANT CORRECTION 2026-07-16: the proposal was NEVER sent to the client.** Therefore NO addendum —
the new scope is folded into ONE integrated proposal v2: **FULL 91h / MVP 48h (adds phone intake — phone
is an official enquiry channel per INQUIRY SOP and client priority #3) / PHASE 2 45h** (93 split, 2h
premium disclosed). Breakdown: build 75 (50 original + 25 new) + comms 11 (~15%) + contingency 5.
Self-resolved decisions (no client questions needed): Gmail/Sheets/OneDrive stack (owner's written
answer wins over SOP boilerplate); SMS→WhatsApp; Tourist payment gate included; duplicates/empty/PII
files handled by us. Remaining clarifications: (1) consolidated fee-master sign-off (covers JRP/485 PF
conflicts + broken BVB formula), (2) does a real subclass-190 checklist exist (file is 191), (3)
Robinder review of proposal v2 before sending.

## 6c. additionaldocsforsop audit (2026-07-19) — client's answers to our questions (`additionaldocsforsop/`, 8 files; identical copy in ~/Downloads)
- **FEES AND INVOICE REFERENCE.xlsx = the consolidated FEE MASTER (source of truth for quotes).**
  Sheets: VISA AND PF FEE (18 visa rows, EF/PF/IMMI split — e.g. 189/190 PF 3,300 + IMMI 6,135;
  482 2,200+4,015; 500 primary EF 750+PF 1,000+IMMI 2,500 w/ ASEAN 2,050; 820/801 2,500+11,710;
  802/101 1,800+4,040), SKIILS ASSESSMENT FEE (JRP **flat $1,000 resolved**, stages 130/490/2845/75;
  VETASSESS/ACECQA/AITSL; **EOI $500**), INVOICE TEMPLATE (two sections: govt fees vs PF/SA fees w/
  subtotals, 1.4% surcharge manual line, ANZ block, ABN). Dependent rule: 18+ ≈50%, <18 ≈25%.
  SAF levy noted as range 1,200–1,800 only. NO formula errors.
- **REMAINING fee conflicts to confirm on kickoff/fee-review call:** Bridging PF 50(old)vs100(new);
  500 IMMI 2,000(old)vs2,500(new); 485 PF by-assessor(old: JRP 550/others 750) vs by-stream(new:
  GradWork 750/PostStudy 550); 600 Sponsored Family IMMI 250 (looks like sponsorship fee); 101 VAC
  3,055(doc) vs 4,040(xlsx); missing rows: 191, WHV 417, ART (was 3,580+1,000+1,000), AFP standalone
  ($56, now only in template text); show-money calc (29,710 etc.) exists ONLY in old workbook.
- **FILENAMES SCRAMBLED (shifted by one):** "189"→491 content, "190"→189, "491"→494, "494"→**802
  Child (fills the gap; note its 40CH/47CH labels are swapped vs Home Affairs)**, "802-CHILD VISA"→
  **EOI Points Calculator 2026** (189/190/491, 65-pt tables — NEW artifact → new build item).
  **A genuine 190 checklist STILL does not exist — still owed by client.**
- STUDENT VISA CHECKLISTS WITH DEPENDENT.docx = re-sent WITH content ✓ (matches offshore PDF;
  flag: "Insurance for 485"+AFP rows copy-pasted from 485 into a 500 checklist).
  DEPENDEN-STUDENT checklist = genuinely UPDATED (OSHC→OVHC, sponsor-source-of-income wording).
- **PLAN FINAL (v3, folds original + SOP'S 2 + additionaldocs): FULL 95h / MVP 48h / PHASE 2 49h**
  (build 78 = v2's 75 + EOI points calculator 2 + QC content-vs-label validation +1; comms 12;
  contingency 5; split 97 = 2h premium). MVP unchanged at 48. Cowork revision prompt (v3) delivered
  to Sharjeel — NOTE: the earlier v2 prompt (91/48/45) was NEVER run; v3 supersedes it entirely,
  revising directly from the still-current 63/44/21 PDF.

## 6d. Proposal v3 audit (2026-07-19)
v3 PDF generated (9 pp, dated 19 Jul). Full audit PASSED: totals 95/48/49 all verified by hand, TOC ✓,
safety wording ✓, all requirements from all 3 client folders traced to line items ✓. THREE wording fixes
required before sending (fix prompt delivered): (1) "15 templates" → "checklist library" (outdated
count), (2) MVP enquiry bullet → mention all 8 channels, (3) DELETE "remaining draft SOPs" bullet from
What We Need (contradicts scope-lock clause — document set is complete). After fixes: final, ready for
Robinder (the fee-conflict questions + 190 checklist + filename confirmation are embedded in the
proposal's "What We Need From You to Start", so one client reply settles everything).
**2026-07-19 (final): all 3 fixes verified in the re-issued v3 PDF — full audit PASSED (95/48/49 ✓,
coverage ✓, no over-promises, all protective clauses intact). PROPOSAL v3 IS FINAL — CLEARED TO SEND
to Robinder.** Next: send proposal → await path choice (95 full vs 48 MVP) + access items → on
approval, start WhatsApp Business API application first (longest approval lead time), then Module 1.

## 6e. NEW client request (2026-07-19 evening, WhatsApp): custom CRM
Client sent links to crm4agencies.com.au, migrationmanager.com.au, agentcis.com and said: "i also need
to create similar crm with google friendly environment. Please look into it." (Also tagged Hardiek Patel.)
Research: Migration Manager = 20+yr Australian migration practice-management SaaS (matters, MM Portal,
eLodge, batch VEVO, trust accounting, ISO27001); CRM4Agencies = AU migration/education CRM, **AUD 3,500
setup + $600/month support, 2–6 wk implementation**; Agentcis = education/migration agency CRM (leads,
client lifecycle, applications, invoicing, partner commissions — site blocked fetch, known from industry).
**Position taken: do NOT change proposal v3.** The 95h build's master data layer + pipeline + deadlines +
dashboard + Xero ALREADY IS a lightweight Google-native CRM foundation; a full CRM interface (recommend
**Google AppSheet** on top of the same Sheets data — no-code, Google-native, mobile app, client portal
possible) is a SEPARATE Phase 3 scoped after its own short discovery (which CRM features matter: portal /
forms / VEVO / trust accounting; user count). Buy-vs-build comparison to give client: commercial =
subscription forever + not Google-native; custom on AppSheet = owned, Google-native, but not a
Migration-Manager clone (eLodge/trust accounting are regulated/deep features — flag honestly).
Reply drafted for client. CRM ask also validates the proposal: same data layer is the CRM backbone.

## 6f. FINAL GATE (2026-07-20)
Robinder confirmed IN WRITING: "Yes these are the services we need for now… Please send the proposal."
(scope-lock evidence secured). Pre-send scan of the disk file (project documents/…-v3.pdf) PASSED:
zero foreign company names, zero pricing/hourly rates (only the client's own fee conflicts on p9 —
intentional evidence trail), no over-promises. NO signature block exists — acceptance is via email per
Next Steps (valid); optional Acceptance/dual-signature section prompt offered to Sharjeel (recommended
given client's document track record). ACTION: send v3 (with or without signature block) + the CRM
reply. Then: await path choice (95 full vs 48 MVP) + access items → WhatsApp Business API application
first → Module 1.

## 6f. Verbal GO received (2026-07-21 call) — commercial stage
Client said "start it" on a call but no payment discussed. Playbook in motion: (1) message sent asking
path choice (A: 95h full / B: 48h MVP) + announcing Engagement Letter; client told to start WhatsApp
Business API application NOW (free, longest lead time). (2) Engagement Letter PDF being generated via
Cowork — contains PRICE (AUD, rate TBD by Sharjeel — anchor: agency equivalent 120–150h @ AUD 90–150),
payment schedule (MVP: 50/50 sign→go-live; Full: 40/30/30), 7-day invoices, work-commences-on-payment
clause, dual signature blocks (this is the signing doc — proposal has none by design), 7-day mutual
exit. (3) RULE: NO access requests / NO build work until commencement payment lands. Then: access
items → kick-off call → build.

## 6g. BUILD PHASE LIVE — kick-off meeting done (2026-07-25)
**Commercials:** MVP chosen (48h @ USD35 = $1,680, 50/50). Engagement Letter confirmed; payment sent by
client (SWIFT in transit). Access Checklist (14 items) delivered.
**ACCESS OBTAINED ✅:** Google account for automation (was EMPTY — repurposed as the Automation
workspace; MASTER DATABASE sheet built there: MASTER + ENQUIRIES tabs, YM-2026 code formula, Stage/
Source dropdowns). Client's real Sheets access ✓. **Client folders access ✓.** Make.com created +
**OneDrive connection LIVE (personal account, "My Drive", List Drives test passed)**. Meta Business
Manager access ✓. Claude API key ✓. project1@ password held → user converting to delegation himself.
2FA skipped for now (revisit).
**CLIENT ANSWERS ✅:** (1) Walk-ins recorded on a SEPARATE SHEET → must get that sheet shared + fold
into enquiry hub. (2) Consultant on leave → office mobile handed to another member (assignment rule:
reassign via roster; no fixed backup person). (3) Checklists confirmed CURRENT versions. (4) Client
codes: start anywhere → begin YM-2026-00001.
**KEY FACT:** client has PERSONAL OneDrive (no M365 tenant) → folder automation runs via Make's
OneDrive connection; noted for later: 5GB limit + passports on personal account → Phase 2/3
recommendation: business storage (or move to Google Drive).
**Client also floated GoHighLevel instead of custom build → deflected correctly: foundation first,
GHL evaluable at Phase 3; GHL contradicts his "Google friendly" + privacy requirements.**
**STILL PENDING FROM CLIENT:** walk-in sheet share · team roster · samples bundle (sent+received
emails incl. one Section 56, Inquiry/Detail/Consultation forms, follow-up templates, WhatsApp chat
screenshots) · website-form destination email · WhatsApp Business verification status + chosen number
(check ourselves: business.facebook.com → Security Centre) · Make team invite for sharry00010 ·
model client folder pointer · later: 2FA + password rotation.
**NEXT BUILD STEPS:** import real client list into MASTER + assign codes from YM-2026-00001 → Make
scenario: auto folder creation (10 sub-folders per SOP) → checklist selector → enquiry hub (waits on
WhatsApp verification) → Gmail triage.

**Update 2026-07-25 (later):** Make team invite DONE (sharry00010 = Admin, client Owner; FREE plan —
paid plan needed at go-live, pass-through). Client shared **"YALE BRISBANE OFFICE WORK"** Google Sheet =
their REAL ops workbook: S56/S57 tracking with 7/14/28-day columns, EOI tabs by state, Lodgements, JRP
lists, 485/Tourist/ART tabs → blueprint for Phase 2 deadline engine + real data. Walk-in sheet +
client folders shared via OneDrive; user creating Microsoft account (sharry00010@gmail.com as MSA) to
open the shares. Website forms → land in the OneDrive/Microsoft email. Remaining from client: team
roster, samples bundle (emails+S56+forms+screenshots), model-folder pointer. User's own tasks: finish
Gmail delegation, check WhatsApp verification in Meta Security Centre.

## 6h. BUILD WORKSPACE CREATED (2026-07-26) — `yale-build/` (git repo)
Base architecture set up before product work: `CLAUDE.md` (rules + session ritual), `ROADMAP.md`
(11 modules w/ live statuses — THE "where are we" file), `CLIENT-LOG.md` (append-only client
decisions + waiting-on list), `CHANGE-REQUESTS.md` (CR-001 CRM/AppSheet, CR-002 GoHighLevel deflected,
CR-003 personal-OneDrive risk), `DECISIONS.md` (D-01…D-10), `ARCHITECTURE.md` (system map, MASTER data
contract, folder convention, AI rules, error standard), `ACCESS.md` (inventory, no secrets).
**For BUILD work: open sessions in `yale-build/` and follow its CLAUDE.md ritual. ROADMAP.md supersedes
this file for module status; this file remains the commercial/history record.**

## 7. Standing instructions for any AI session picking this up
- Read this file + `00 READ ME - FOLDER GUIDE.md` before acting. Update §6 after every move.
- Match the client's plain-English level (owner is non-technical; messages often via WhatsApp).
- All docs follow the sample-format structure (cover block, TOC, hours tables, MVP option,
  commercials, "what we need from you", next steps) with Sharjeel's personal branding.
- Currency AUD context, dates DD/MM/YYYY (Australian client).
