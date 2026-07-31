# CLIENT LOG — append-only. Every decision/message that matters, newest at bottom.
Format: `YYYY-MM-DD | channel | what was said/decided | action`

2026-07-06 | WhatsApp | Stack answers: Google Sheets log, OneDrive storage, Xero, 60–70 enquiries/wk
(FB/IG/WA/walk-in), 100–150 active files, priorities 1-folders 2-documents 3-enquiries 4-follow-ups
5-quotes 6-deadlines | Shaped proposal
2026-07-08 | WhatsApp | Gmail = platform, 20–50 emails/day, owner delegates manually; shared project1@
password (⚠️) | Email module scoped; security fix promised
2026-07-16 | folder | SOP'S 2 delivered (12 workflow diagrams, Inquiry/Phone/Enrolment/Skills SOPs, new
visa lines) | Scope recalculated
2026-07-19 | folder | additionaldocsforsop (fee workbook = fee master; filenames scrambled; 190 checklist
still missing) | Proposal v3 95/48/49
2026-07-20 | WhatsApp | "Yes these are the services we need for now. Please send the proposal." |
SCOPE LOCKED — written confirmation
2026-07-21 | call+WhatsApp | Verbal GO on call; chose MVP; Engagement Letter sent (USD 35/h × 48 =
$1,680, 50/50) | Commercials locked
2026-07-2x | WhatsApp | Payment confirmation sent by client (SWIFT in transit) | Access checklist released
2026-07-24 | WhatsApp | "Kam shuru ho gya bhai? You can assign code with ym-2026. We haven't started
coding yet. For existing client" | Code format confirmed; existing clients need codes
2026-07-25 | meeting | Kick-off: Make+OneDrive connected (personal drive), Meta access, Claude key,
sheets shared. Client floated GoHighLevel → deflected to Phase 3 (see CR-001). Answers: walk-ins on a
separate sheet (shared); consultant on leave → office mobile handed to another member; checklists
confirmed CURRENT; client codes "koi bhi set kar do" → start YM-2026-00001 | M1 nearly done
2026-07-25 | WhatsApp | Website forms land in the client's Microsoft/OneDrive email | M6 input
2026-07-25 | WhatsApp | Asked client for: team roster, samples bundle (emails+S56+forms+screenshots),
model folder, walk-in sheet, Make invite | Make invite arrived same day (Admin); ops workbook "YALE
BRISBANE OFFICE WORK" shared (S56 7/14/28-day tracking, EOI/JRP/lodgement tabs)
2026-07-26 | WhatsApp | OneDrive share email never arrived → asked client for link-share of client
folders + walk-in sheet | WAITING

## WAITING ON CLIENT (live list — tick when received)
- [ ] OneDrive link-share (client folders + walk-in sheet)
- [ ] Team roster (name, email, visa types per member)
- [ ] Samples bundle: 5–10 sent emails (incl. document-request), 3–5 received (incl. ONE Section 56,
      names redacted), Inquiry/Detail/Consultation forms, follow-up templates, 2–3 WhatsApp screenshots
- [ ] Model client folder pointer
- [ ] WhatsApp verification → check ourselves in Meta Security Centre
- [ ] (non-blocking) 2FA + password rotation on project1@
- [ ] Confirm commencement payment landed in bank
2026-07-26 | files | RECEIVED: Team roster (routing = Indian/Filipino team × visa × office; 12 staff
emails incl. Townsville Cristelle + marketing Manali) · Model folder pointer (BRISBANE OFFICE/CLIENT
FILES/ENGAGED CLIENTS/CLIENT FILES- FILIPINO TEAM; examples "Aaron Jean Desepida-SVEA", "ADRIENNE JANN
PEPITO-485 DEPENDENT") · ONE full email sample (SBS thread: request→invoice→payment→ack→approval→
"for posting" to marketing; tone + CC conventions visible; Robinder = Director MARN 1573959) |
Roster/model → repo docs; email PDF → local samples (PII, git-ignored)
2026-07-26 | link | OneDrive share received: "YALE MIGRATION - ONE SYSTEM" = BRISBANE OFFICE (63.5GB!),
PHILIPPINES, TOWNSVILLE, Work visa BNE AND TSV — multi-office confirmed | Audit via Make inventory,
not manual browsing
2026-07-26 | ss | Ops workbook full tab list seen (~27 tabs) incl. "eca password" tab (⚠️ credentials
in sheet — raise gently later), "Nisha's TASKS", hidden "withdrawal" | Phase-2 blueprint material
2026-07-29 | Make/API | OneDrive access diagnosed (see D-19): link share unusable; asked Robinder to
share "YALE MIGRATION - ONE SYSTEM" DIRECTLY to sharry00010@gmail.com with Can edit | WAITING
2026-07-29 | discovery | Already shared to us (usable now): "Yale Migration - Client Inquiry Form.xlsx"
(= one of the internal forms we requested!) + "Service Agreement 189 and 190" folder | Use Inquiry Form
for intake-field design (M2/M6)
2026-07-29 | Make/API | ✅ Client completed the direct share — "YALE MIGRATION - ONE SYSTEM" now visible
via sharedWithMe with item ID captured (D-21). OneDrive fully unblocked for M2-D + M3.
2026-07-29 | WhatsApp | New team member confirmed INFORMATION HUB = skills-assessment/visa reference
info; told them to KEEP it (treated as reference library, excluded from client-file automation).
2026-07-29 | ask | Write test 403 → asked client to change share from "Can view" to "Can edit" (D-25).
Build continues on M3-A (sheet + code engine) meanwhile (D-26).
2026-07-29 | ss | Client confirmed share = "Can edit" for sharry00010@gmail.com (also Cristelle Dumlao
= Can edit, YALE MIGRATION = Owner, 1 link). Write still 403 → root cause is connection identity (D-27).
Asked client for a 2-min screen share to reauthorize Make's OneDrive connection as owner (incognito).
2026-07-29 | Make | Discovered existing Microsoft connection has READ-ONLY scopes (no Files.ReadWrite.All)
— corrects earlier identity-only diagnosis (D-29). Sending client a Make "Credential request" link for a
proper OneDrive connection under his own account (D-30).
2026-07-29 | ✅ | WRITE ACCESS SOLVED entirely on our side (scope fix, D-31). Told client: "edit access was
fine, issue was our permission settings, now resolved." No further access asks outstanding for M3.
STILL PENDING (non-blocking): S56 letter sample, follow-up templates, WhatsApp screenshots, student/485
email thread; Nisha + workvisa.bne@ roster gaps; Gmail delegation; WhatsApp Business verification status.
2026-07-29 | files | ✅ CLIENT DELIVERED THE FULL SAMPLES BUNDLE (6 docs): SAMPLE-S56 LETTER.pdf,
SAMPLE-S56 REQUESTS.pdf, EMAIL TEMPLATE FOR S56 REQUEST AND FOLLOW UP.docx, SAMPLE-STUDENT VISA EMAIL
THREAD.pdf, SAMPLE-485 VISA EMAIL THREAD.pdf, SAMPLE-WhatsAPP inquiry Screenshot.pdf. Staged in
assets/samples/ (git-ignored, PII). M9 (AI email triage) + M6 (auto-reply wording) now have real
training material — no longer blocked on samples. Deep audits of each document in progress.
2026-07-29 | audit | ALL 6 SAMPLES AUDITED. Key outcomes: S56 detection redesigned (D-32 — Department
never writes "Section 56"), deadline computation rule set (D-33), dormancy identified as the real pain
(D-34, gaps of 16 and 71 days with no chase), attachment-driven + quote-stripped classification (D-35),
Taglish language policy (D-36), MARN/compliance flag raised (D-37), and the "S56 email template" file is
actually WhatsApp screenshots (D-38 — wording still owed). Specs written: docs/M9-EMAIL-AI-SPEC.md and
docs/M6-AUTOREPLY-SPEC.md.
TO ASK CLIENT (batched, low-friction): (1) real S56 client-email + follow-up wording + reminder cadence;
(2) 2–3 raw .eml S56 emails with headers (all samples are image-only scans — no sender/subject available);
(3) who is the supervising RMA/MARN for AI-assisted drafts; (4) optional: S56 samples for 500/485/820.
2026-07-29 | WhatsApp (sent) | Asked client whether the ~1,400 folders in ENGAGED CLIENTS are all active
matters or historical with only ~150 live — determines M2 import scope (D-44). AWAITING REPLY.
2026-07-29 | discovery | T1.4c: client folders are FLAT (10 loose files, no sub-folders) — the SOP's
10-sub-folder structure was never implemented (D-47). T1.5: the client tracker is readable via workbook
API, 2 sheets: "Client Tracker" + "Admissions Tracker " (D-48).
NEW ASK TO BATCH: confirm they want the 10 sub-folders for NEW clients (their SOP says so, but current
practice is flat) — or a lighter 4–5 folder structure. Needs 👍 before T3 build.
2026-07-29 | WhatsApp (sent) | Second message sent to Robinder (10-sub-folder vs lighter structure +
active-vs-historical folders question). AWAITING REPLY on both.
2026-07-29 | discovery | T1b: tracker = 49 rows × 18 cols = ACTIVE case list, not the full register
(D-49). Title band occupies rows 1-3; headers at row 4/5 (D-50). Last updated manually via F9, 28 Jul.
2026-07-29 | discovery (major) | Read their live Client Tracker: 14 real columns incl. Location
(Onshore/Offshore), Processing Stage vocabulary (Documents Pending / Documents Complete / Ready for
Lodgement / Lodged), Visa Outcome, Grant Date, Visa Expiry, Refusal Reason, Last Contact, and a BROKEN
"48hr Alert" (#REF!). Their client ids are CL-###. Manual dashboard block in cols P–Q counts by stage.
MASTER spec rewritten to v2 adopting their fields + vocabulary (D-51..D-56). Admissions Tracker = 15×50,
Phase 2 enrolment material (D-57).
2026-07-30 | docx + WhatsApp | ✅ CLIENT ANSWERED ALL FOUR OPEN QUESTIONS ("Answer to the questions..docx"
+ WhatsApp): (1) no S56 template exists → we draft from their real emails (D-59); (2) S56 timing = 28-day
legal / 26-day internal, follow-ups upgraded by client to 7/14/21/26 days (D-58); (3) supervising RMA =
Robinder Pal Singh, MARN SHOULD appear (D-60 — resolves the compliance gate); (4) all ~1,400 folders are
live retained clients for future visas (D-61); (5) 5 sub-folders not 10 (D-62).
2026-07-30 | email | Client forwarded 2 REAL s56 email threads (485 Ronaya + 482 Sevial) with attachments
→ gives us the Department ENVELOPE we were missing (sender, subject format, routing mailbox). 4 new PDFs
staged in assets/samples/ (git-ignored, PII).
2026-07-30 | files | 4 new PDFs audited: S56 covering letter (ImmiAccount naming, D-71) · S56 checklist
(same 482 case) · "CoE Certificate" that is actually blank Form 80 (D-72 — third mislabelling) · QLD
Statutory Declaration template. New feature identified: auto-attach the right blank form from their own
APPLICATION FORMS folder when an S56 requests it (D-73).
2026-07-30 | WhatsApp (SENT) | Consolidated message sent to client covering: (a) confirmation back of the
s56 rules we implemented (28-day legal / 26-day internal / follow-ups at 7-14-21-26, stop-on-reply);
(b) 🔴 REQUEST: delegated access to visa.lodgement@yalemigration.com.au (blocks M9 s56 detection, D-64);
(c) confirm the 5 sub-folder names (D-62); (d) the s56 email screenshot they offered — we will draft the
template from their real wording (D-59/D-70); (e) flagged that "CoE Certificate (10F566341)" is actually
blank Form 80 (D-72). AWAITING REPLY on (b), (c), (d).
2026-07-31 | internal | Clarified which mailbox the 30 Jul delegation ask covered: `visa.lodgement@
yalemigration.com.au` (company domain) — NOT project1@, NOT the personal Microsoft account holding OneDrive.
Two further M9 unknowns identified (mail platform Google vs Microsoft; mailbox owner) plus the Make-OAuth
point from D-13. DECIDED NOT to ask now — client already has 3 items pending from 30 Jul and none of this
blocks T2/T3/T4. Deferred to a single "M9 start gate" message sent the day M9 begins (D-75).
2026-07-31 | WhatsApp (IN) | Robinder: cannot find the delegation step. Diagnosed: Gmail delegation is
disabled by default on Google Workspace, so the option was absent from his screen, not overlooked (D-77).
Also confirmed by public DNS that their mail is Google Workspace (MX aspmx.l.google.com, D-76) — closes one
of the two D-75 unknowns without a client round-trip. Step-by-step delegation instructions prepared (admin
switch first, then grant access), plus reminder of the 2 small pending items and the owner question.
2026-07-31 | internal (CORRECTION) | The delegation steps issued earlier today were partly wrong. Part 1
(admin Mail-delegation switch) is valid but is ROBINDER's step — admin.google.com cannot open for
sharry00010@gmail.com (a personal Gmail is not a Workspace account). Part 2 was unworkable: Gmail delegation
only functions between accounts in the SAME Workspace domain, so visa.lodgement@ can never be delegated to
an external personal Gmail (D-78). Revised ask is SIMPLER: M9 needs only the Make↔Gmail OAuth (D-13), which
requires no delegation at all. Optional tidy alternative to offer at the demo: a
automation@yalemigration.com.au Workspace seat. Nothing incorrect was sent to the client beyond the
delegation steps; corrected message prepared before any further client contact.
