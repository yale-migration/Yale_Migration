# DECISIONS — append-only. Why things are the way they are (so we never relitigate).

D-01 | Google Sheet = database (not SQL/Airtable) | Client already lives in Sheets; zero learning curve;
full client visibility; AppSheet-ready for Phase 3 CRM face.
D-02 | Personal OneDrive handled via Make connection (client OAuth'd once) | No M365 tenant exists; no
admin center; connection tested OK ("My Drive"). Risk logged as CR-003.
D-03 | SMS channel mapped to WhatsApp | Client's SOP names SMS templates, but WhatsApp is where clients
are; Twilio = extra cost/complexity. Revisit only if client insists.
D-04 | Client codes start YM-2026-00001 | Client: "koi bhi set kar do" (2026-07-24/25).
D-05 | Claude API on CLIENT's key/billing | Engagement Letter promise ("API usage runs on Yale's own
keys"); Haiku for classification (volume 20–50/day ≈ dollars/month), Sonnet for drafting.
D-06 | AI drafts NEVER auto-send; only RMA gives migration advice | Legal/compliance rule encoded in
every SOP + our proposal. Conservative routing with Needs-Review path.
D-07 | Everything built inside client-owned accounts, we hold invited access | Ownership promise in
Proposal + Engagement Letter; makes handover trivial.
D-08 | Automation Google account (the empty one client gave) = the automation workspace | Repurposed
2026-07-24; MASTER DATABASE lives there; scripts deploy under it → client ownership preserved.
D-09 | Build order M2→M3→M4/M5→M6→M9 | Data layer first (everything reads it); folders = fastest
visible win (client priority #1); WhatsApp channel deferred inside M6 until Meta verification.
D-10 | Workspace tracking: this repo + PROJECT-STATE.md + auto-memory | Session ritual in CLAUDE.md;
survives long chats/device switches; git history = audit trail.
D-11 | MASTER grain = one row per MATTER, not per person | Real clients run multiple visas over time
(485→190); 482/Partner have two parties. Returning client = new row + new code; old row Closed.
D-12 | Existing client folders NEVER renamed/moved | 150 live folders their team navigates daily;
we link URLs in MASTER; new convention for new matters only.
D-13 | Automated sending via Make↔Gmail connection (client OAuths project1@ once) | Delegation covers
human access only; Make needs its own OAuth to send as project1@. Same pattern as OneDrive connection.
D-14 | Every scenario ships: dry-run → 5 real cases → client 👍 → live | Client files hold passports;
no scenario touches production data without the ladder.
D-15 | Make paid plan (Core) required at go-live | Free tier 1,000 ops/mo < live volume; pass-through
cost, flag to client before launch.
D-16 | Routing matrix = TEAM (Indian/Filipino) × VISA TYPE × OFFICE (BNE/TSV/PH) | Team roster
(2026-07-26) revealed nationality-based teams; MASTER gets Office + Team columns; auto-assignment
resolves against the roster table. Roster gaps to confirm: Nisha (has a tab in ops workbook, not in
roster), workvisa.bne@ (in email CCs, not in roster).
D-17 | MASTER import source = OneDrive folder inventory (via Make), cross-checked with ops workbook
tabs | No single client-list sheet exists; the real client register is the ENGAGED CLIENTS folder
tree (naming "NAME-VISATYPE") + per-process workbook tabs. One-time Make scenario exports the tree
into a FOLDER INVENTORY tab; matters + YM codes generated from it.
D-18 | Existing folder tree is deep: ONE SYSTEM → OFFICE → CLIENT FILES → ENGAGED CLIENTS → TEAM →
client | New folders created INSIDE the matching office+team branch; naming for NEW: "YM-2026-#####
– FULL NAME" (old folders untouched per D-12).
D-19 | OneDrive access requires DIRECT share to sharry00010@gmail.com (not a link) | Diagnosed
2026-07-29 by API: (a) Make's "Yale's Microsoft connection" is actually authenticated as
sharry00010@gmail.com / drive A6A69145EC56CDEC (client's OAuth reused our browser session in the
kick-off meeting — connection label is misleading, rename it); (b) /shares/u!<link> → 403; (c)
/drives/A0BABA3C2640082C/root/children → 200 but EMPTY = item-level permission only, no folder
listing. Link-based shares are unusable by API tokens. Proof it works when done right: "Yale
Migration - Client Inquiry Form.xlsx" (drive 25A20422A9E0CB73) and "Service Agreement 189 and 190"
were shared TO the account and appear in /me/drive/sharedWithMe.
D-20 | Build order adjusted: M2 structure + code engine BEFORE folder automation | OneDrive blocked
on client action; nothing else depends on it. Never let a client-side blocker idle the build (D-09
sequencing principle).
D-21 | OneDrive UNBLOCKED 2026-07-29 — direct share worked (confirms D-19) | Anchor IDs for all
scenarios: driveId = A0BABA3C2640082C · "YALE MIGRATION - ONE SYSTEM" itemId =
A0BABA3C2640082C!sb56138531b714289a454795636c629f5. Traversal pattern:
/v1.0/drives/A0BABA3C2640082C/items/<itemId>/children  (Make module route also works now:
location = "Shared with me" + Item Type = folder). Keep these IDs in the scenario, never the picker.
D-22 | CREDIT BUDGET is a first-class design constraint | Make FREE = 1,000 ops/month; every API call
and every single Sheets row = 1 op. Full folder inventory (hundreds of clients × 4 offices) would burn
the entire month for zero client-visible value. Therefore: (a) always use ?$select=name,id&$top=999
(one call per branch); (b) write rows in BULK or fan out via Apps Script (free/unmetered); (c) DEFER
full inventory — it is internal convenience, not a feature. Folder-creation flow ≈12 ops/client (~75
clients/month on free) which is acceptable until the paid plan at go-live (D-15).
D-23 | DEMO-FIRST sequencing: M3 folder creation is the first shipped deliverable, not M2-D inventory |
Client has seen zero working output after heavy access-gathering. Folder auto-creation is their stated
priority #1, visually dramatic, cheap in credits. Deliverable = 90-second screen recording. Inventory
and existing-client import happen after the demo lands.
D-24 | WRITE access must be proven before any M3 work | Read is proven (200s); "can edit" share implies
write but is unverified. Gate: POST create ZZZ-AUTOMATION-TEST at ONE SYSTEM root → expect 201 → DELETE.
D-25 | WRITE access test FAILED 2026-07-29: POST create folder → [403] Access denied | Config verified
correct (POST, Content-Type: application/json, valid body, valid parent itemId). Conclusion: folder was
shared as "Can view". Client asked to change to "Can edit" (Manage access → sharry00010@gmail.com).
PREFERRED long-term alternative if fragility persists: re-authorize Make's OneDrive connection as the
OWNER (robin_multani007@hotmail.com) — full rights, no share dependency, and matches the proposal's
"runs inside your own accounts" promise. Read access is unaffected (all GETs 200).
D-26 | M3 split into 3A (no-write) and 3B (needs write) so a client-side permission never idles the build
| 3A = MASTER structure + YM code Apps Script + intake field map (buildable now). 3B = folder-creation
scenario + demo video (unblocks the moment "Can edit" lands).
D-27 | ROOT CAUSE of write 403 is CONNECTION IDENTITY, not permission | Evidence 2026-07-29: Manage
Access shows sharry00010@gmail.com = "Can edit" (plus Cristelle = Can edit, YALE MIGRATION = Owner),
yet POST create-folder still 403. On consumer OneDrive an app token can READ shared items but cannot
WRITE into another user's personal drive regardless of share role — the token's write scope covers only
its own drive. FIX (also better architecture, matches proposal's "runs inside your own accounts"):
reauthorize Make's OneDrive connection as the OWNER robin_multani007@hotmail.com.
⚠️ MUST be done in a private/incognito window — during kick-off the OAuth silently reused Sharjeel's
Microsoft session, which is how the wrong identity got attached in the first place (D-19).
Verification after reconnect: GET /v1.0/me must return robin_multani007@hotmail.com, then POST test → 201.
D-28 | Code engine uses onEdit AND a 5-minute time trigger | Apps Script onEdit does not fire for rows
written via API (Make/Sheets API). The timer catches automation-created rows so every matter always gets
a code. Codes never reuse numbers (max+1), so deletions can't cause collisions.
D-29 | CORRECTS D-27 — the real root cause of write 403 is READ-ONLY OAUTH SCOPES | Make's connection
"Yale's Microsoft connection" (Outlook icon = generic Microsoft app, not the OneDrive app) was granted:
User.Read, Files.Read.All, Offline access, Group.Read.All, Sites.Read.All — NO Files.ReadWrite.All.
The token cannot create anything in ANY drive, so identity was only half the story. FIX: create a new
connection using Make's **OneDrive** app (which requests read+write scopes) AND authenticate it as the
owner (robin_multani007@hotmail.com).
D-30 | Use Make "Credential requests" to get the client-authenticated connection | Credentials →
Credential requests → new request for the OneDrive app → send the generated link to the client. He signs
in with his Microsoft account on HIS machine (no Make login, no incognito trap, no screen share). The
connection then exists in the client's Make org, owner-authenticated, with write scopes. Verify after:
GET /v1.0/me → robin_multani007@hotmail.com, then POST folder test → 201.
D-31 | ✅ WRITE ACCESS ACHIEVED 2026-07-29 07:28Z — confirms D-29 (scopes were the fault, not identity)
| Fix applied: Make connection "Yale's Microsoft connection" scopes edited to User.Read +
**Files.ReadWrite.All** + Group.Read.All + offline_access, then Reauthorize + Accept. POST create-folder
returned the new item (ZZZ-AUTOMATION-TEST, id A0BABA3C2640082C!sa0345ef0e3774f79ba4c15337e31d509).
NOTE: the connection stays authenticated as sharry00010@gmail.com — that is FINE because
Files.ReadWrite.All on a consumer account covers all files the user has access to, including the
"Can edit" shared folder. No owner re-auth needed (D-27/D-30 no longer required).
LESSON for future modules: any new Graph call needs its scope added here first (Make hint says exactly
this) — e.g. Mail.Send would be needed if we ever send via Outlook.
D-32 | 🚨 S56 DETECTION MUST NOT KEY ON "Section 56"/"s56" | The Department's real letter never uses the
term (verified against SAMPLE-S56 LETTER.pdf). It says "Request for more information for a <visa>
(subclass NNN) visa application" and "We need more information to help us assess your application."
Only Act cited is Privacy Act 1988. "Section 56" is YALE's internal shorthand (their SOPs). A classifier
built on the obvious keyword would have missed 100% of real requests. Full phrase set + regexes in
docs/M9-EMAIL-AI-SPEC.md. Keep "s56" only as a signal for STAFF-written internal email.
D-33 | S56 deadline must be COMPUTED, not read | Letters print no due date: "You have 28 days starting
on the day after we emailed this request". Rule: due = letter_date + 1 day + parsed days_allowed; always
store the verbatim sentence + letter_date for human verification; never hardcode 28; attachment carries a
second differently-anchored 28-day line (letter is authoritative); deadlines are extendable so a passed
date must never auto-close a matter.
D-34 | Dormancy — not reply speed — is the real pain | Measured: replies 4–58 min when engaged, but file
gaps of 16 days (student) and 71 days (485) with NO chase; only Mailsuite read-receipts were watching.
Therefore the dormant-file detector + templated nudge is the highest-value item in M5/M9, ranked above
draft-reply polish.
D-35 | Classification must be attachment-driven and quote-stripped | ~45% of thread messages are
attachment-only with ZERO body text; every reply carries [Quoted text hidden] (9 in one thread) so an
unstripped body classifies the PREVIOUS message. Also: suppress Mailsuite/system notifications from the
reply path entirely; subject lines are unreliable after msg 1 (one sample misspells the client's own name).
D-36 | Language policy: mixed Taglish/Tagalog/Ilocano is NORMAL, do not normalise | Real message mixes
three languages in one sentence; "ate"/"po" are honorifics, not typos ("Received ate." is correct).
Auto-replies: English default, light-"po" variant only when the thread is already Taglish (one enquirer
had a Swedish number). Never quote fees on chat channels — money lives on email only (their own split).
D-37 | ⚠️ COMPLIANCE FLAG raised: no MARN in any outbound email | Both sample threads are signed
"Reyward Jake Gamol, Consultant" with no MARN, while Robinder is the RMA (MARN 1573959). Before any
AI-assisted drafting goes live, confirm with the client: who is the supervising registered agent for
drafts, and should the MARN appear in the signature? AI must never produce advice-shaped content (D-06).
D-38 | Client-supplied "EMAIL TEMPLATE FOR S56 REQUEST AND FOLLOW UP.docx" is MISLABELLED/EMPTY | Body
text is only "WhatsApp Inquiry screenshots" + 5 images (duplicate of the WhatsApp PDF); 11 words total,
assembled 18 min before handover. Yale's actual S56 client-email wording and reminder cadence are still
outstanding. Treat like the earlier empty-docx case: flag, don't guess.
D-39 | M3 folder scenario design decisions | (a) Trigger = scheduled Sheets "Search Rows" (Client Code
present + Folder URL empty) rather than onEdit — catches automation-created rows too and is inherently
idempotent; (b) conflictBehavior "fail" not "rename" — a name clash must alert, never silently duplicate
(existing folders untouched, D-12); (c) Router resolves the target branch from Office+Team per the roster
matrix (D-16); (d) each API module gets an error handler set to Resume + alert + a Notes write-back so
failures are visible where staff actually work; (e) the 10 sub-folder names come from the SOPs and MUST be
verified against one real client folder before go-live — live structure wins over SOP if they differ.
D-40 | Roadmap rewritten v6 with TASK IDs + expected outputs | v5 had accumulated drift: duplicated M2/M3
lines, a stale M2 header ("blocked on client share" after the share had landed), a contradiction about the
walk-in sheet, and my outdated "5GB" storage note (corrected in CR-003 — Brisbane alone is 68.2 GB, so
they're on a paid plan; the real issue is governance not capacity). New structure: an ACTIVE TASKS block
(T1 tree-walk, T2 sheet, T3 scenario, T4 demo) each with owner, duration and expected output, then module
status, go-live gates, open client asks, and issues to raise at the demo. Rule going forward: every task
assigned to Sharjeel states purpose, numbered steps, expected output, and the decision rule for surprises.
D-41 | The FOLDER TREE encodes the client lifecycle — Stage must map to folder location | T1.2 found
CLIENT FILES → {ENGAGED CLIENTS, GRANTED, REFUSED OR WITHDRAWN}. Staff physically MOVE a client folder
when the outcome lands. Consequences: (a) the folder inventory must scan ALL THREE branches, not just
ENGAGED — otherwise granted/refused clients look "missing"; (b) MASTER's Stage column and the folder's
parent must stay consistent; (c) Phase 2 opportunity: auto-move the folder when Stage flips to
Granted/Refused (do NOT build in MVP — moving live client folders is high-risk, needs explicit 👍).
D-42 | "Engaged Client Tracker.xlsx" is a live client register (208 revisions) — candidate source of
truth for the M2 import | Found in CLIENT FILES at T1.2. Read via Graph workbook API (worksheets, then
header row, then usedRange) before deciding the import path. If it holds a maintained client list, prefer
it over parsing folder names (folder names are inconsistent: "Aaron Jean Desepida-SVEA" vs "ADRIENNE JANN
PEPITO-485 DEPENDENT"). Cross-check both, reconcile differences, never silently overwrite their data.
D-43 | Team branches are ASYMMETRIC: "CLIENT FILES" (main, rev 239, legacy short id !529) +
"CLIENT FILES- FILIPINO TEAM" (rev 1) | Only two branches exist under ENGAGED CLIENTS — there is no
folder literally named for the Indian team. Router rule: Team = FILIPINO → Filipino folder; anything else
→ the main CLIENT FILES folder. MUST verify by inspecting client names in each branch (Indian-market
surnames vs Filipino) before wiring the router — assumption, not fact, until checked.
D-44 | SCALE REALITY: ~1,436 client folders in ENGAGED CLIENTS (698 main + 738 Filipino), not the
"100–150 active files" the client stated | Plus GRANTED and REFUSED OR WITHDRAWN branches on top.
ENGAGED CLIENTS is evidently an accumulation of everything ever engaged, not a live-work list.
Consequences: (a) full folder inventory would consume the entire free-tier credit budget for zero
client-visible value → deferral (D-22/D-23) confirmed correct; (b) M2 import scope must be agreed with
the client: all 1,436 or only genuinely active matters?; (c) any future inventory must use bulk writes.
D-45 | Existing folder naming is CHAOTIC → the tracker file becomes the primary import source | Evidence
from 698 real names: Title Case 282 / ALL CAPS 138 / " - " 77 / "-" 59; visa number present in only 248
(36%); duplicates ("485 Dixit (1)"), non-client folders ("Yhardlyn docs"), family entries ("Winsley's
Wife"), mixed prefixes ("001 Rey (SOP)", "wanero 407"). Therefore: parse-from-folder-name is unreliable;
prefer "Engaged Client Tracker.xlsx" (D-42) as the client register and use folder names only for
reconciliation. Reinforces D-12 (never auto-rename existing folders) — the mess is theirs to keep until
they ask otherwise, and our new convention will visibly stand apart.
D-46 | Team routing CONFIRMED by evidence | Surname markers in the main CLIENT FILES branch: 150
Indian-market vs 15 Filipino → CLIENT FILES = Indian/Brisbane team, CLIENT FILES- FILIPINO TEAM =
Filipino team. D-43's assumption is now verified. Volume by visa line (folder-name tokens): 485=165,
500=17, 491=15, 482=13, 191=9, 407=8, 189=8 — 485 is their dominant service, consistent with the email
samples.
D-47 | 🚨 T1.4c: CLIENT FOLDERS ARE FLAT — no sub-folders exist in practice | Real folder "485 Akshay"
contains 10 LOOSE FILES and zero sub-folders: Aadhar front and back.PDF · AFP.pdf · AFP_repaired (10).pdf
· AKSHAY_KUMAR_520852388.pdf · client Info sheet.pdf · Completion letter (1).PDF · detail form.pdf ·
Passport front and back.PDF · Policy_Statement (16).pdf · Trascript.PDF (sic).
So the SOP's "10 sub-folders (01 Enquiry … 10 Visa Outcome)" is ASPIRATIONAL, never implemented.
Consequences: (a) our sub-folder creation is a genuine IMPROVEMENT, not a replication — frame it that way
to the client, never claim we're copying their structure; (b) ADOPTION RISK: staff currently dump files
flat; creating 10 folders they ignore is worse than useless → require explicit client 👍 on the structure
and offer a lighter variant (e.g. 4–5 folders) if they prefer; (c) their file-naming SOP
("JUAN DELA CRUZ - PASSPORT") is also not followed — real names are ad hoc with download cruft
("(10)", "(16)", "(1)"), mixed-case extensions (.PDF/.pdf) and typos ("Trascript") → justifies the
Phase 2 auto-rename feature with real evidence.
D-48 | T1.5: "Engaged Client Tracker.xlsx" is readable via the Graph workbook API — 2 worksheets |
`Client Tracker` (id {00000000-0001-0000-0000-000000000000}) and `Admissions Tracker ` (id
{03EB648D-4D8D-45EC-9A2D-89DF01C493FB}) — note the TRAILING SPACE in "Admissions Tracker " (automation
trap: address the sheet by ID, never by name). Next: read usedRange dimensions WITHOUT values (cheap) to
size the register, then the header rows, before deciding the M2 import path (D-42/D-45).
D-49 | 🎯 M2 IMPORT SCOPE RESOLVED: the tracker is the ACTIVE work list (49 rows), the folder tree is the
ARCHIVE (~1,436) | T1b.1: 'Client Tracker'!A1:R49 = 18 columns, 49 rows (≤48 data rows). So the tracker is
NOT a full register — it tracks current cases only. Import plan: MVP imports the ~48 ACTIVE matters from
the tracker (cheap, high-value, matches how staff actually work); the 1,436 historical folders remain
archived and untouched (D-12/D-45); the full folder inventory stays deferred (D-22/D-23). This also
partially answers the question sent to the client — but still confirm which set they consider "active".
D-50 | Tracker structure: rows 1–3 are TITLE rows, headers start at row 4/5 | Row 1 "CLIENT PROCESSING &
ENGAGEMENT TRACKER" + "Last Updated:" + Excel serial 46232.2069 (≈28 Jul 2026); Row 2 "Visa Case
Processing, Client Communications & Status Tracking (SOP Compliant)" + "Press F9 to update timestamp";
Row 3 blank. Implications: (a) any import must skip the title band — never assume row 1 = headers;
(b) the "Last Updated" timestamp is MANUAL (F9) — our automation makes it live for free, a nice small win
to show the client; (c) "(SOP Compliant)" in the subtitle means they built it to match their SOPs, so our
MASTER columns should reconcile with theirs rather than replace them.
D-51 | Keep BOTH ids: our `YM-2026-#####` (canonical) AND their `CL-###` (cross-reference column B) |
Their live tracker already uses CL-001, CL-002… while the client explicitly instructed "you can assign
code with ym-2026". Dropping their id would break every mental/paper reference their staff already has;
dropping ours would ignore an explicit client instruction. So we carry both — ours drives automation,
theirs stays searchable.
D-52 | ADD the `Location` (Onshore/Offshore) column — we had missed it | Their tracker tracks it and it is
the axis that decides which checklist to send (M4). Our earlier design only had Office+Team, which is a
different dimension entirely.
D-53 | Split their free-text Visa Type into `Visa Type` + `Visa Variant` | Their real values mix subclass
with role: "485 visa dependent", "500-Subsequent Entrant". Two clean columns make the checklist selector
and reporting possible without losing their meaning.
D-54 | Email — not phone — is the identity/dedupe key | Contact Number is blank in ~half their live rows.
M6's dedupe and any client matching must key on email (trimmed), with phone as a secondary signal only.
D-55 | Their `48hr Alert` column contains a #REF! error — the alerting they wanted is BROKEN | Replaced in
MASTER by `Next Follow-up Due` driven by automation (D-34 dormancy detector). This is the strongest single
demo line available: they already tried to build alerting, the formula broke, and nobody noticed. Frame it
as "the alert you already wanted, working" — never as criticism.
D-56 | Import policy: FLAG contradictions, never silently fix them | Real example CL-002: Processing Stage
"Documents Pending" while Visa Outcome "Granted" (impossible). The importer writes a note in Notes (col W)
and leaves the data as-is for a human. Also: import is ONE-WAY (their tracker → MASTER) until they approve
write-back; never touch their columns P+ manual dashboard.
D-57 | `Admissions Tracker ` = 15 cols × 50 rows (their enrolment pipeline) | Phase 2 material for the
enrolment tracker (LOO → deposit → CoE). Note the TRAILING SPACE in the sheet name — always address by ID
`{03EB648D-4D8D-45EC-9A2D-89DF01C493FB}`.
D-58 | ✅ CLIENT ANSWERED — S56 TIMING RULES (authoritative) | Department gives 28 days; **Yale works to a
26-day internal deadline** (2-day buffer to finish uploading). Their current practice: one follow-up at
day 10 if the client hasn't confirmed receipt. **Client then UPGRADED the request (WhatsApp 30 Jul):
follow up at DAY 7, 14, 21 and 26.** So the S56 escalation ladder = 7 / 14 / 21 / 26 days, with the
internal due date at 26 (not 28), and only the Department's 28-day date recorded as the hard legal limit.
Stop-on-reply applies: the ladder halts as soon as the client confirms receipt / sends documents.
Post-receipt flow: documents → Migration Agent checks → MA uploads to ImmiAccount (never the consultant).
D-59 | ✅ CLIENT ANSWERED — no S56 email template exists | They write it ad hoc. Two REAL examples now in
hand (from the forwarded threads): "Please find attached s56 request for your application. The request
concerns your skills assessment and completion letter…" and "Please find the attached s56 request for your
compliance. Form 80 is also attached, kindly fill it out." → We DRAFT a template from their real wording
and get 👍 rather than asking them to invent one. They will also send a screenshot of their common email.
D-60 | ✅ CLIENT ANSWERED — MARN: Robinder Pal Singh is the supervising RMA and **the MARN SHOULD appear**
in the signature | Resolves the D-37 compliance flag. Implication for M9: AI-drafted replies carry the
consultant's name + the supervising RMA context; any content that constitutes migration advice must be
attributable to MARN 1573959 and reviewed by Robinder before sending. Draft-only remains mandatory.
D-61 | ✅ CLIENT ANSWERED — all ~1,400 folders are LIVE clients, retained deliberately | "Those clients are
still active and have already been provided with our services. We retain their files because they may
apply for another visa in the future (e.g. a Student visa client later applying for 485)." → This VALIDATES
the matter-grain design (D-11): one person, multiple visas over time. It also means the archive is a
returning-client asset, not dead weight → Phase 2 opportunity: renewal/next-visa prompts off Visa Expiry.
MVP import scope stays the ~48 ACTIVE matters from their tracker (D-49); the 1,436 stay linked, untouched.
D-62 | ✅ CLIENT ANSWERED — 5 SUB-FOLDERS, not 10 | "If there is a chance we can compress it into 5
sub-folders then it is better." + "We can do it in 5 sub-folders sir." → M3 builds 5 sub-folders. Proposed
set (needs 👍 on the names): `01 Identity & Personal · 02 Education & Employment · 03 Financial &
Sponsorship · 04 Forms & Lodgement · 05 Correspondence & Outcome`. Reduces per-client ops from ~13 to ~8
(credit saving) and matches how staff actually work (flat today → 5 is adoptable, 10 was not).
D-63 | 🚨 CORRECTS/REFINES D-32 — the EMAIL SUBJECT *does* say "s56" | The letter PDF never says Section 56
(D-32 still true), BUT the Department's email subject literally begins with it:
`s56 Request for More Information - BCC2026/1472133 - 365718045 - RONAYA, IANBER TEOGALBO
[SEC=OFFICIAL:Sensitive, ACCESS=Personal-Privacy]`
Pattern: `s56 Request for More Information - <FileNo> - <ApplicationID> - <SURNAME, FIRSTNAMES>
[SEC=OFFICIAL:Sensitive, ACCESS=Personal-Privacy]`
→ Detection is FAR more reliable than feared: subject-line match is now the PRIMARY signal, with the
PDF phrase set (D-32) as the secondary/confirming layer. Both are needed: the subject catches the email,
the letter yields the deadline.
D-64 | 🚨 NEW MAILBOX DISCOVERED: Department S56 emails arrive at `visa.lodgement@yalemigration.com.au` |
Sender: `noreply.temporary.graduate@homeaffairs.gov.au` → To: `ROBINDER PAL SINGH
<visa.lodgement@yalemigration.com.au>`. NOT info@, NOT project1@. If M9 monitors only project1@ we would
MISS EVERY S56 — the single highest-risk feature would silently never fire. MUST get access/delegation to
visa.lodgement@ before M9 build. Added to open client asks as BLOCKING for M9.
D-65 | Department sender addresses are VISA-LINE SPECIFIC | `noreply.temporary.graduate@homeaffairs.gov.au`
(= subclass 485 Temporary Graduate). Expect siblings such as noreply.skilled@ / noreply.partner@ /
noreply.employer@. Detection rule: match on the domain `@homeaffairs.gov.au` + subject pattern, NOT on one
exact address, otherwise other visa lines slip through.
D-66 | Machine-parseable metadata footer in Department emails — use it for routing | Verbatim:
`Subclass:485; Stream:Post-Vocational Education Work; Citizenship:PHILIPPINES; State:QLD`
Gives subclass, stream, citizenship and state in one line → auto-populates Visa Type, and citizenship
implies the likely team (PHILIPPINES → Filipino team). Cheapest, most reliable routing signal available.
D-67 | Internal routing chain is 3 hops — the classifier must handle forwarded chains | Department →
visa.lodgement@ (Robinder, authorised recipient) → forwarded to philippines@ (RJ, consultant) → forwarded
to the client. Consequences: (a) the same S56 appears in several mailboxes — dedupe by File number +
Application ID, never by message id; (b) quote-stripping must survive nested `---------- Forwarded message
---------` blocks; (c) "who owns this" = the consultant on the 2nd hop, not the recipient of hop 1.
D-68 | Identifier regexes CORRECTED | File number: `BCC<YYYY>/<7 digits>` (BCC2026/1472133, BCC2025/7294045)
✓ as before. **Application ID is 9–10 digits, not always 10** (365718045 = 9, 1540713558 = 10) → earlier
`\b\d{10}\b` was too strict; use `\b\d{9,11}\b` with label context. Position Number varies per officer
(60093715, 60168462) → not an identifier for matching, ignore.
D-69 | NEVER auto-reply to Department emails | Verbatim: "This email is automatically generated. As this
email is an automated notification we are unable to receive replies. Do not respond to this email address."
Hard rule in the classifier: category = Department correspondence → create task + draft to CLIENT, never a
reply to the sender.
D-70 | Their real S56 client-email wording captured (3 examples) — template can now be drafted (closes D-59)
| (a) "Please find attached s56 request for your application. The request concerns your skills assessment
and completion letter. Once you receive the outcome of your skills assessment, Just forward it to me asap.
**But for now nothing to worry about.**" (b) "Please find the attached s56 request for your compliance.
Form 80 is also attached, kindly fill it out." (c) follow-up asking for more evidence: "As part of your s56
request can you also share the following 1. Updated Photos together 2. Updated Joint Bank Account
statement 3. Statutory declaration stating that you are living together — signed by the house owner or
registered tenant (form attached) 4. Updated conversation and call logs 5. Relationship statement from your
parent and friend (1 each) with ID'S attached."
Tone notes: salutation is `Sir,` for male clients (vs `Hi Ma'am,` seen earlier) → gender-aware salutation;
reassurance line "nothing to worry about" is their empathy signature — keep it; CC `info@` on client-facing
S56 emails.
D-71 | Department letter attachments follow ImmiAccount naming: `application - YYYY-MM-DDTHHMMSS.mmm.pdf` |
Verified: "application - 2026-06-02T111103.903.pdf" IS the S56 covering letter (Date 01 June 2026, TRN
EGP9XF6H64, App ID 1540713558 — the Lester Sevial 482 case). The checklist attachment instead carries the
subject text in its filename ("s56 Request for More Information - BCC2025_7294045 - 1540713558 -Request
Checklist and Details.pdf"). → Two usable attachment-name signals for the classifier; note the letter's
generic name means we must open it, not trust the name.
D-72 | 🚨 THIRD mislabelling instance: "CoE Certificate (10F566341).pdf" is actually blank **Form 80** |
Previous instances: "Subclass 190" file containing 191 content; "EMAIL TEMPLATE FOR S56" containing
WhatsApp screenshots. Pattern is now established and evidence-backed: **this client's filenames are
unreliable ~consistently**. Consequences: (a) the document classifier must read CONTENT, never trust the
filename (already in the QC gate design); (b) any import/mapping keyed on filenames needs a verification
pass; (c) worth raising gently at the demo as a problem the automation solves for them.
D-73 | Their S56 workflow ATTACHES standard blank forms to the client — and they already own the library |
Evidence: Form 80 (character assessment) attached to the 482 S56; Queensland Statutory Declaration (Oaths
Act 1867) attached for 485 relationship evidence. Their `APPLICATION FORMS` folder (BRISBANE OFFICE, 199 MB,
id A0BABA3C2640082C!sc9b3012895a745e0a295c9967ba32c1f) is that library. → HIGH-VALUE, LOW-COST feature:
when the S56 checklist requests an item, the automation attaches the matching form from their own folder
(Form 80 → character/Form 80 items; QLD stat dec → cohabitation evidence; Form 1229 → child consent).
Map requested-item → form file once, reuse forever. Note the stat dec is QLD-specific (they are Brisbane).
D-74 | Attachment→email attribution (per Sharjeel's note "3 from 1 mail, 1 from another") | **482 Sevial
S56 email** (Fwd: s56 request, 2 Jun 2026, CC info@) carried 3 attachments: the covering letter
("application - 2026-06-02T111103.903.pdf"), the Request Checklist and Details, and blank **Form 80**
(saved under the wrong name "CoE Certificate (10F566341).pdf", D-72). **485 Ronaya S56 email** (Fwd: s56
Request for More Information - BCC2026/1472133, 17 Apr → 7 May 2026) carried 1 attachment: the **Queensland
Statutory Declaration** template, used for the cohabitation evidence RJ requested. Confirms D-73: the form
attached is chosen per requested item (Form 80 → character; QLD stat dec → living-together evidence).
D-75 | Two newly-identified M9 unknowns are DEFERRED, not asked now — logged as an M9 START GATE |
Raised 31 Jul while confirming which mailbox the 30 Jul delegation request referred to. Answer: it referred
to `visa.lodgement@yalemigration.com.au` — a COMPANY-DOMAIN mailbox, distinct from both `project1@` (the
shared Gmail we already hold, delegation is Sharjeel's own task) and the personal Microsoft account that
holds OneDrive documents. Two gaps surfaced that the sent message does NOT cover:
  (1) **Platform unknown** — is `yalemigration.com.au` mail on Google Workspace or Microsoft 365? This
      decides the entire M9 connector path (Gmail modules vs Outlook/Graph). It CANNOT be inferred from the
      OneDrive account: that is a separate personal Microsoft account and says nothing about their mail.
  (2) **Owner unknown** — whose mailbox is `visa.lodgement@`? Delegation must be granted by the owner.
      Same class of gap as `workvisa.bne@` (roster gap #4).
Plus a third point the sent message omits: per D-13, human delegation does NOT let Make read a mailbox —
Make needs its own OAuth. Ask all of it in one breath so it is one approval, not two round-trips.
**DECISION: do not send a fourth ask now.** Rationale: (a) the client already has three unanswered items
from 30 Jul, and a fourth dilutes all of them; (b) none of it blocks the current build — T2 (MASTER sheet),
T3 (folder scenario) and T4 (demo) are Sheets + OneDrive only. **CONDITION: these are a hard gate on M9,
answered BEFORE the first M9 module is built, never during.** Building a Gmail-based classifier and then
discovering the mailbox is Microsoft-hosted would waste hours of the 48h budget. Recorded in ROADMAP under
M9 as the "M9 START GATE".
