# DECISIONS — append-only. Why things are the way they are (so we never relitigate).

## ⚠️ SUPERSEDED INDEX — read this BEFORE trusting any single entry
Append-only means corrections sit BELOW the things they correct. A future session reading an old entry in
isolation can follow withdrawn advice. **These entries are no longer current — always read the superseding
entry instead.** Update this index whenever a decision is corrected or withdrawn.

| Superseded | Status | Read instead | What actually changed |
|---|---|---|---|
| D-27, D-29 | ❌ wrong diagnosis | **D-31** | OneDrive write-403 was read-only OAuth **scopes**, not connection identity |
| D-32 | ⚠️ partly wrong | **D-63** | The S56 letter PDF never says "s56", but the email **subject does** — subject match is the primary signal |
| D-68 (earlier regex) | ❌ too strict | **D-68 final** | Application ID is **9–11 digits**, not exactly 10 |
| D-77 (Part 2) | ❌ unworkable | **D-78** | Gmail delegation cannot target an external personal Gmail at all |
| D-78 (option b) | ❌ doesn't work | **D-79** | The Gmail **API cannot read delegated mailboxes** — a Workspace seat + delegation does not help M9 |
| D-85 | ✅ withdrawn | **D-89** | Make org ownership was fine; "My Organization/My Team" is just Make's default naming |
| D-88 (invite branch) | ❌ unnecessary | **D-89, D-90** | Robinder already holds the `info@` Make login — he set it up himself |
| D-89 (password-reset caveat) | ❌ unnecessary | **D-90** | He typed that password himself during the joint setup; no reset needed |
| D-39 (item e) | ❌ obsolete | **D-47, D-132** | "the 10 sub-folder names … MUST be verified" — the SOP's 10-folder tree was never implemented and is replaced by the three approved SETS |
| D-75 (item b) | ✅ resolved | **D-76** | Mail platform answered by public DNS/MX — no client round-trip needed |
| D-100, D-102 | ❌ overturned | **D-132** + `docs/FOLDER-STRUCTURE-BY-VISA-CATEGORY.md` | Folders are NOT one set for all visas — THREE checklist-derived sets (Standard / Work / Partner) |
| D-103 | ❌ file deleted | **D-132** | `FOLDER-CONTENTS-CHART.md` duplicated the folder authority and held the superseded single-set structure |
| D-126 (its reconstructed sets) | ⚠️ partly wrong | **D-132** | The client's three INSTRUCTIONS in D-126 are correct; the folder sets I reconstructed there were not |
| D-101 | ⚠️ superseded | **D-132** | "Do not ask" still right, but the partner folder IS justified. *(An earlier index row said "D-128" — a corruption from the 2 Aug renumber; D-128 has never existed, D-141.)* |
| D-104–D-108, D-113 (my 2 Aug versions) | 🔢 renumbered | **D-117–D-127, D-129, D-130** | Duplicate IDs repaired (D-131). The earlier session keeps the original numbers. ⚠️ Numbering has HOLES at D-104, D-109–D-116 and D-128 — these are artefacts of the renumber, **not deleted decisions** (verified: no content lost, D-141) |

**Current truth on the M9 mailbox (the most-churned topic):** see **D-80** (frozen requirement), **D-82**
(alternatives ruled out), **D-83/D-84** (correct UI path), **D-90** (client works by sharing HIS screen),
**D-91** (verification field labels + the "Choose where to start" zero-bundle trap).
Do not reconstruct this from earlier entries.

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
D-76 | `yalemigration.com.au` mail = **GOOGLE WORKSPACE** — resolved by public DNS, not by asking the client |
Question (1) of D-75 is CLOSED without spending a client round-trip. `dig MX yalemigration.com.au` returns
`aspmx.l.google.com` + alt1-4 — the canonical Google Workspace MX set. Consequences: M9 uses Make's **Gmail**
connector (not Outlook/Graph); Gmail delegation is the correct sharing mechanism; the M9 spec needs no
rework. Confirms that the personal Microsoft account holding OneDrive documents is unrelated to their mail —
files on Microsoft, mail on Google. **Method worth reusing: check public DNS before asking a client what
platform they are on.**
D-77 | ROOT CAUSE of "I can't find the delegation step" | On Google Workspace, Gmail delegation is
**disabled by default at the domain level**. The "Grant access to your account" block does not render in
Gmail → Settings → Accounts until an admin enables Apps → Google Workspace → Gmail → User settings → **Mail
delegation**. Robinder was not overlooking the option — it was absent from his screen. He is the Director
and can enable it himself. Delegation also propagates slowly (up to ~24h, usually minutes), so a "still not
there" report right after enabling is expected, not a failure. NOTE: delegation lets a HUMAN read/send; Make
still needs its own one-time OAuth on the mailbox to draft automatically (D-13).
D-78 | ⚠️ CORRECTS D-77's Part 2 — Gmail delegation to an EXTERNAL personal Gmail is NOT POSSIBLE |
Surfaced 31 Jul when Sharjeel hit the admin.google.com account chooser with only `sharry00010@gmail.com`
listed and clicking it went nowhere (expected: a consumer Gmail is not a Workspace account, so
admin.google.com has nothing to render — Part 1 is ROBINDER's step, not ours). Re-checking the delegation
path revealed the real constraint: **Google Workspace Gmail delegation only works between accounts in the
SAME Workspace domain** (or an admin-configured trusted domain). `visa.lodgement@yalemigration.com.au`
therefore CANNOT be delegated to `sharry00010@gmail.com` — the address is rejected regardless of the admin
Mail-delegation switch. The instructions issued earlier that day would have dead-ended and, worse, looked
like client error. Logged openly.
**REVISED PATH — M9 does not need delegation at all.** What the automation actually requires is D-13's
Make↔Gmail OAuth on the mailbox. Delegation was only ever for human inspection while building. Options,
best first:
  a) **Make OAuth only** (minimum viable): Robinder signs Make's Gmail connection in once as
     `visa.lodgement@` (or any Workspace user with access to it). Unblocks M9 completely. ONE action.
  b) **+ a Workspace account for us** if we also need to read real emails during the build:
     `automation@yalemigration.com.au` — then delegation to THAT works (same domain), and it doubles as the
     account the client keeps after handover. Costs them one Workspace seat.
  c) Sharing `visa.lodgement@` credentials directly — REJECTED: no per-user audit trail, breaks the
     client-owns-access principle, and forces a password rotation at handover.
Prefer (a) now, offer (b) as the tidy long-term option at the demo. Do NOT ask for both permissions in one
message (D-75 rationale: two asks = neither gets done).
D-79 | Delegation would NOT have unblocked M9 even if it were possible — the Gmail API ignores delegated
mailboxes | Important follow-on to D-78. Gmail delegation is a **web-UI feature only**: the Gmail API (and
therefore Make's Gmail modules) can only access the mailbox of the account that actually authorized the
connection. A delegate's OAuth token does NOT expose the mailboxes delegated to it. Consequences:
  - Option (b) of D-78 (a `automation@yalemigration.com.au` seat + delegation of visa.lodgement@ to it)
    **does not work for M9** — Make would authorize as automation@ and see only automation@'s own mail.
    Downgrade (b) to "convenient human access + handover account", never the automation path.
  - **The only reliable path is D-78 option (a): Make's Gmail connection authorized AS
    `visa.lodgement@yalemigration.com.au` itself.** This is now the single blocking ask for M9.
  - Fallback if the client resists (or nobody can sign in as that mailbox): a Gmail **forwarding rule**
    `visa.lodgement@` → `project1@`, and M9 reads it through project1@'s existing OAuth. Acceptable for
    classification (subject + body + attachments survive forwarding) and they already forward these
    manually today (D-64/D-65 chain). Cost: the original envelope sender becomes the forwarder, so
    sender-based rules must key on the ORIGINAL sender inside the forwarded body, not the From header.
    Keep as Plan B — do not lead with it, it adds a moving part they must not later delete.
D-80 | ✅ FINAL, VERIFIED, FROZEN: the M9 mailbox requirement is ONE action — and we already knew the owner |
Full audit 31 Jul against primary sources (Google Workspace Admin Help, Gmail API developer docs, Make apps
docs) after the ask shifted three times in one day. Verified findings:
  1. **External Gmail cannot be a Gmail delegate.** Delegates must be in the SAME Workspace organization;
     an outside consumer Gmail is rejected. (support.google.com/a/answer/7223765) → visa.lodgement@ could
     never have been delegated to sharry00010@gmail.com. CONFIRMS D-78.
  2. **Delegation is web-UI only — invisible to the Gmail API and to mail apps.** A delegate's OAuth token
     does NOT expose mailboxes delegated to it; the API only ever reaches the authenticated account's own
     mailbox. (support.google.com/mail/answer/138350, developers.google.com Gmail API delegate_settings)
     → delegation was NEVER a viable automation path, only a human-viewing convenience. CONFIRMS D-79.
  3. **Make's Gmail connection must be authorized by signing in AS the mailbox owner.** (apps.make.com/gmail-modules)
     No service-account or impersonation option exists in Make's Gmail app. → OAuth as visa.lodgement@ is
     the only first-class path.
  4. **Basic auth (plain password) for IMAP died May 2025**; app passwords survive but need 2SV + admin
     IMAP enabled. → IMAP is a degraded Plan C, not an alternative worth offering.
  5. 🔴 **WE ALREADY KNEW THE OWNER.** D-64 records the header verbatim: `To: ROBINDER PAL SINGH
     <visa.lodgement@yalemigration.com.au>`. It is ROBINDER'S OWN address — no third party to chase, no
     roster gap. Asking "whose mailbox is it?" was asking the client something our own evidence answered.
     It may be a separate account OR an alias on his primary account; if an alias, mail lands in his primary
     mailbox and authorizing THAT catches it. Robinder knows which — he does not need to be asked, he just
     signs in to the one that receives the Department emails. Either way: ONE person, ONE action.
  6. Catching S56 at hop 1 remains correct: D-67's forward chain (visa.lodgement@ → philippines@ → client)
     depends on a human forwarding, which is the very delay we are removing. Do not build on hop 2.
**FROZEN ASK — do not restate, reopen or re-scope this again:** *Robinder authorizes Make's Gmail connection
once, signed in as the mailbox that receives the Department emails.* Nothing else. No admin switch, no
delegation, no credentials shared, no new Workspace seat, no forwarding rule.
D-81 | PROCESS RULE (self-imposed, from the D-77→D-80 churn) | The ask to the client changed three times in
one day (delegate→admin switch+delegate→OAuth→final) because platform constraints were asserted from memory
and verified only afterwards. **Rule: verify every platform capability against primary vendor documentation
BEFORE it reaches a client-facing message, never after.** A wrong instruction costs far more than a day's
delay — it burns client patience and makes correct instructions look unreliable too. Cheap pre-checks that
would have caught all of this: public DNS/MX for the platform (D-76), vendor docs for the permission model,
the connector's own docs for what it supports. Also: **re-read our OWN evidence before asking the client
anything** — finding #5 above was sitting in D-64 the whole time.
D-82 | Method CONFIRMED after second deep audit — plus a favourable finding and 5 pre-loaded contingencies |
Second audit round (31 Jul) checked the two alternatives that could have justified another change, so that
none is ever proposed again:
  1. **Service account + domain-wide delegation** — Google supports it, but **Make's Gmail app exposes no
     service-account connection type**; it would need a custom Google Cloud project + JWT through the HTTP
     module. More moving parts, worse handover story. REJECTED on complexity, not capability.
  2. **IMAP + app password** — basic auth was permanently disabled May 2025; app passwords survive but need
     2SV + admin-enabled IMAP. Plan C at best.
  → OAuth-the-mailbox-into-Make remains the only correct method. NO further alternatives exist to evaluate.
**FAVOURABLE FINDING:** Make's Gmail connection requires Google **restricted** scopes (message bodies).
Google blocks restricted scopes for personal @gmail.com accounts — but visa.lodgement@ is a **Workspace**
account (D-76), so Make's standard connection works with NO custom Google Cloud OAuth client. Had the target
been a personal Gmail, a custom OAuth client would have been mandatory. Our path is the simple one.
**"We already have Make" — answered:** yes, and that is why this is a 2-minute job. The connection is created
inside the client's existing Make account; nothing new is bought or installed. The one thing Make cannot
supply is the mailbox's own sign-in — Google requires that once, from the mailbox.
**Contingencies C1–C5 pre-documented in `scenarios/M9-mailbox-connection-runbook.md`** so that a failure at
any step is handled INSIDE this method rather than triggering a fourth requirement change: C1 admin App
Access Control → mark Make **Trusted** (Security → Access and data control → API controls → Manage App
Access; verified path) · C2 2FA prompt is expected · C3 admin can reset the password · C4 if it is an ALIAS,
authorize his primary account instead (same method) · C5 forwarding rule to project1@ as last resort.
Runbook includes an immediate in-call verification (Watch emails, max 1, mark-as-read OFF) so the connection
is PROVEN before the client leaves the call — no "it saved but doesn't work" follow-up.
D-83 | CORRECTION to the runbook steps + Robinder's Make login is already in place |
Verified against help.make.com/connect-an-application: **connections are created from INSIDE a module**
("Create a connection" at the module's Connection field), and `Credentials → Connections` only MANAGES
existing connections. The first version of the runbook started at Credentials → Connections → Add — wrong
starting point, corrected. Prep step added: Sharjeel pre-builds a scenario `YM-M9 SETUP — connect mailbox`
containing one Gmail → Watch emails module, so the client's job is five clicks in a screen he cannot get
lost in. That scenario is then RENAMED to `YM-M9-email-triage` and becomes the real M9 scenario — no waste.
**Robinder needs no new Make credentials:** ACCESS.md #6 records **client = Owner** of the Make account, we
are Team member/Admin. He signs in at make.com with his own email; Forgot-password self-serves because he is
the Owner. No invite required.
🔴 **NAMING TRAP to avoid in client comms:** never say "log into Make with visa.lodgement@". Signing up to
Make with that address creates a NEW EMPTY Make account holding none of our scenarios — a confusing dead end.
There are TWO logins: (1) into Make = the existing account, his own owner email; (2) into Google as
visa.lodgement@ = inside Make, in the popup. The runbook now states this as a table before the steps.
D-84 | ✅ CONFIRMED by screenshot: the Connections page has NO "Add" button | Client screenshot 31 Jul of
Credentials → Connections shows only Search, "All connections", Reauthorize and Verify. No create/add
control exists on that page. Independently confirms D-83: connections are created ONLY from inside a module
("Create a connection" at the module's Connection field). The original runbook step was unusable, not merely
sub-optimal. Two connections currently exist: "Make's AI Provider (default)" and "Yale's Microsoft
connection" (authorized by Muhammad Sharjeel <sharry00010@gmail.com>, 5 shares / 6 scenarios).
D-85 | 🔴 GOVERNANCE DISCREPANCY — the Make org may be OURS, not the client's | The same screenshot shows the
org/team as **"My Organization / My Team"** — Make's DEFAULT naming for a personal account — and the only
real connection is authorized by `sharry00010@gmail.com`. This contradicts `ACCESS.md` #6 which records
"Make.com | Team member, Admin | Client = Owner", and contradicts the CLAUDE.md hard rule "Everything is
built in CLIENT-owned accounts". Consequences if the org is in fact ours:
  (a) **Robinder has NO login to this Make account**, so the runbook's "Robinder logs into Make" step is
      impossible as written — the connection must instead be created by us with him typing only the Google
      password (screen-share), or he must first be invited as a user;
  (b) handover requires migrating every scenario + connection out of our org — expensive and error-prone;
  (c) the client's ability to revoke us (ACCESS.md revocation map) does not actually hold for Make.
**ACTION: verify before any further client instruction** — Make → Org → Team/Users. If it lists only
Sharjeel → ACCESS.md #6 is WRONG and must be corrected, and the handover/ownership question goes to
CHANGE-REQUESTS.md alongside CR-003 (personal-account governance). If it lists Robinder as Owner → the org
is merely default-named and ACCESS.md stands. Do NOT send the "log into Make" instruction until resolved:
telling the Director to log into an account he has no access to is precisely the kind of avoidable error
D-81 exists to prevent.
D-86 | Client authorizes on HIS OWN machine — our screen-share proposal was wrong | Sharjeel challenged the
"I share my screen, you type the password" instruction. He is right and it is withdrawn. If the client types
the mailbox password into OUR browser, the credential passes through our machine and may be stored by our
browser — that breaks the no-shared-credentials principle as badly as sending it over WhatsApp, and gives him
no way to see what he authorized. **Correct arrangement: Robinder drives, on his own device, in his own
browser.** We stay on a call to guide verbally if he wants; the keyboard is his.
D-87 | Make **Credential requests** is the ideal feature but NOT available on our plan | Visible in the
sidebar of the client screenshot, so worth ruling out explicitly. Purpose-built for this exact case: send a
secure link, the third party authorizes in their own browser, the requester never sees the credential, the
connection lands in our org. BUT **creating** requests is limited to Make **partners and enterprise
customers** and requires an approval form (`f.make.com/r/credential-requests`); receiving/authorizing is open
to all. We are on the **FREE** plan → cannot send. Consequences: (a) do not build the flow around it now;
(b) it is a genuine argument for Make partner status later, and would make every future client onboarding
cleaner — parked in CHANGE-REQUESTS as an internal capability item, not client scope.
D-88 | Therefore Robinder needs a Make LOGIN — this is the real prerequisite, not delegation | Every viable
arrangement has him authorizing on his own machine, which requires him signed into the Make org that holds
our scenarios. Order of operations now: (1) verify Make → Org → Team/Users (also settles D-85 ownership);
(2) if he is absent, invite him (Org → Team → Invite a new user, role Admin); (3) then the 5-click connection
steps. If the Free plan blocks extra users, either bring the paid plan forward (D-15 needs it at go-live
regardless) or use contingency C6. **The METHOD is unchanged and frozen — this is logistics, not a re-scope.**
D-89 | ✅ RESOLVED — D-85 ownership worry was UNFOUNDED; no Make invite is needed | Users screenshot 31 Jul
shows exactly 2 users: **"Yale Migration" <info@yalemigration.com.au>** (no "Leave" action → the OWNER) and
"Muhammad Sharjeel" <sharry00010@gmail.com> (has "Leave" → member). `ACCESS.md` #6 is CORRECT: client = Owner,
we are Team member/Admin. The "My Organization / My Team" label is merely Make's DEFAULT org/team naming and
is NOT evidence of a personal account — D-85's concern is withdrawn, and the handover/governance worry it
raised does not apply to Make. Plan confirmed **Free** in the sidebar (consistent with D-15: paid at go-live).
**CONSEQUENCES — final, no further variants:**
  - **Do NOT invite anyone.** Close the Invite-user dialog. D-88's "invite him" branch is dead.
  - Robinder's Make login is **`info@yalemigration.com.au`** — it already exists. If he lacks the password,
    Forgot-password sends a reset to that inbox, which he controls.
  - The TWO logins for the client message are now concrete: (1) Make = `info@yalemigration.com.au`;
    (2) Google, inside Make = `visa.lodgement@yalemigration.com.au`. State both addresses explicitly so
    there is no ambiguity to guess at.
D-90 | ✅ ESTABLISHED WORKING METHOD WITH THIS CLIENT: screen-share where ROBINDER shares HIS screen and types |
Confirmed by Sharjeel 31 Jul: the Make organization was created by the two of them together on a screen-share
where **Robinder shared his screen** and the setup was done on **his machine** — which is why the Owner is
`info@yalemigration.com.au`. Direct consequences:
  - **Robinder HAS the info@ Make login and knows its password — he typed it himself.** No invite, no reset,
    no "he may not have access" caveat. D-88's invite branch and D-89's password-reset caveat are both dead.
  - Sharjeel has the **Make access only** — not the info@ inbox, not the info@ password. So Sharjeel cannot
    and should not attempt the client-side login himself.
  - **This is the proven pattern for every future client-credential step: Robinder shares HIS screen, works
    on HIS machine, types his own passwords.** It satisfies the no-shared-credentials rule automatically and
    the client is already comfortable with it. Do not propose "I share my screen" again (D-86).
  - It also fully explains the "My Organization / My Team" default naming — nobody renamed the org.
**PROCESS FAILURE TO NOT REPEAT:** this was already project history and was never written down, so the
mailbox-access plan got re-derived from scratch three times and the client's own established working method
was queried back to him. **Rule: operational facts (who set up what, on whose machine, who holds which
credential) go into `ACCESS.md` the day they happen — not just the technical decision.** Extends D-81.
D-91 | Verification step corrected against Make's Gmail module docs — plus the "Choose where to start" trap |
Field labels I had used were wrong and would have caused confusion on a live client call. Actual labels
(apps.make.com/gmail-modules): **Filter type** (Simple filter / Gmail filter) · **Folder** · **Label** ·
**Criteria** (All emails / Only read / Only unread) · **Mark email message(s) as read when fetched** ·
**Limit** (max 500 — NOT "Maximum results") · Sender email address · Subject · Has the words · Doesn't have ·
Email size · Only emails with attachments/media · **Content format** (full / raw / metadata / minimal).
🔴 **THE REAL TRAP: Make polling triggers show a "Choose where to start" dialog on first Run once.** If
"From now on" is selected the run returns **ZERO bundles** — which on a client call reads as "the connection
is broken" when it is fine. Must choose **All emails** (or pick one manually) for the verification run.
Also fixed: **Criteria = All emails** (not unread — a read mailbox would return nothing) and **Mark as read =
NO** (never mutate the client's live mailbox during a test). **Content format = Full content** because M9
needs message bodies, so the test should prove bodies are actually readable, not just headers.
D-92 | PROCESS OVERHAUL — 5 mandatory gates, a focus lock, and STATUS.md | Raised by Sharjeel 31 Jul: the
build has strong architecture and memory continuity, yet the same classes of mistake recurred and nothing has
shipped. Root-caused all five failures of 31 Jul in `PROCESS.md` — **none was a hard technical problem, all
five were process gaps**: (1) capabilities asserted from memory before verification; (2) asking the client
what our own D-64 evidence already answered; (3) operational facts (screen-share history, who holds which
credential) never written down; (4) **no focus lock — a day spent on an M9 permission that is days off the
critical path while T2/T3/T4, the client's first visible demo, sat untouched**; (5) no pre-send check, so
instructions that dead-ended reached the client. Gates G1–G5 created and wired into `CLAUDE.md` so they load
every session. New `STATUS.md` is now the single source of "where are we" and separates **shipped** from
**specced** — because the honest answer to "what can the client see working?" is currently *nothing*, and
that framing is what keeps priorities straight. Standing rule added: **a spec is not a deliverable.**
Correcting one thing for the record: we are NOT at step 0 — requirements gathering, access, discovery of
their real system, five specs and two verified scripts are done, roughly the front half of the MVP. But they
are all inputs. The gate that matters is T4.
D-93 | Root-cause of the 31 Jul failures: the setup was WRITE-optimised, not READ-optimised | Sharjeel asked
whether the earlier Claude setup was flawed or whether memory/CLAUDE.md simply were not being updated. Honest
answer, recorded so it is not re-argued: **the setup was good but incomplete.** It solved *"never lose what we
learn"* — 92 decisions preserved across chats and devices, which genuinely worked. It did NOT solve two other
things, and the failures split cleanly into two types:
  - **Type A — facts we HAD but did not retrieve** (mailbox owner sat in D-64; the screen-share history was
    never logged). This IS a setup gap: everything was built to WRITE, nothing forced a READ before asking.
    Storage is not retrieval. Fixed by **G2** (grep before asking) and **G3** (log operational facts too).
  - **Type B — facts we NEVER had and I asserted anyway** (Gmail delegation limits, Make UI paths). Memory
    and CLAUDE.md could NOT have prevented these — nothing was recorded either way. The failure was filling a
    gap with confident recall instead of a lookup. Fixed ONLY by **G1** (verify against a primary source this
    session). Evidence it is cheap: every search run on 31 Jul found the answer in one query.
  - **Structural weakness found and fixed:** append-only means corrections sit BELOW what they correct, so a
    future session reading an old entry in isolation follows withdrawn advice (D-77's Part 2, D-78's option b,
    D-85, D-88's invite branch). Added a **SUPERSEDED INDEX at the top of this file** listing every withdrawn
    entry and what to read instead, plus a "current truth" pointer for the most-churned topic. Maintain it
    whenever a decision is corrected — it is now part of the END-of-session ritual.
  - **Also:** ROADMAP drift (a stale T2 block still describing the superseded v1 sheet spec) survived because
    updates were appended rather than reconciled. Append-only is right for DECISIONS; ROADMAP needs
    RECONCILING. Caught by the new gates before it caused a wrong build.
D-94 | ✅ ROSTER GAP CLOSED from a document we already held: `workvisa.bne@` = **Robinder Singh** | Found
31 Jul by re-auditing `Yale MIgration Mail - email.pdf` (= the "SBS (482) email thread" logged 26 Jul). Every
message in the thread CCs `Robinder Singh <workvisa.bne@yalemigration.com.au>` with his name attached. This
was listed as an OPEN CLIENT ASK for five days while the answer sat in our own samples folder — a third
instance of the G2 failure class (D-93 Type A). **Removed from OPEN CLIENT ASKS; only "who is Nisha" remains.**
Also confirms Robinder runs multiple addresses: `info@` (general), `workvisa.bne@` (work-visa line, CC'd on
482/SBS), `visa.lodgement@` (Department correspondence, D-64). M9 must treat all three as HIM, not as three
different people, when assigning ownership.
D-95 | SBS / employer-sponsorship pipeline observed end-to-end — feeds M4/M5 | Same thread, Jun 24 → Jul 24
2026 (≈1 month): consultant requests outstanding docs (Trust Deed, updated menu) + issues invoice → sponsor
pays → consultant confirms "ready for processing" → lodgement → **IMMI Acknowledgement of Application
Received** PDF → **SBS-APPROVAL** → consultant advises the NEXT stage is the **employee nomination
application**, required before the visa application can proceed. Consequences:
  (a) sponsorship is a **3-stage chain** (SBS → nomination → visa) — the MASTER `Processing Stage` dropdown
      covers single-visa flow only; sponsor matters need their own stage vocabulary (Phase 2, log as CR).
  (b) **payment gates progress** ("once we receive the payment, we will begin finalizing") — a document-chase
      automation must not chase docs when the real blocker is an unpaid invoice. Relevant to M5.
  (c) Multiple third parties are CC'd on one matter (sponsor contact, a second payer, an adviser) — supports
      the M5 **responsible-party** field: chase the right person, not always "the client".
  (d) IMMI acknowledgement + approval PDFs are the machine-readable milestones to detect in M9.
D-96 | Internal workflow: approvals are forwarded `info@` → `manali@` with the body "for posting" | Same
thread, 27 Jul. Marketing (Manali, already known from the 26 Jul roster audit) posts wins to social media.
So an approval email triggers a MARKETING action, not only a client action — a cheap, high-goodwill Phase 2
automation (approval detected → draft post → Manali reviews). Log as a change request, not MVP scope.
D-97 | Gmail connection created OK but returns `[403] insufficient authentication scopes` — SAME failure class
as D-29/D-31 | Client screenshot 31 Jul: connection `Yale's Gmail connection (visa.l…)` EXISTS (so Robinder
completed the sign-in as visa.lodgement@ — his part is done), but every field errors with 403 insufficient
scopes and Folder/Label show "Failed to load data!". **Folder/Label failures are downstream symptoms, not
separate faults** — Make cannot enumerate folders without read scope; they self-resolve once scopes are right.
This is the third scope-related 403 on this project (OneDrive twice, D-29/D-31) — **scopes, not identity, are
this project's recurring failure mode. Check scopes FIRST on any 403.**
Cause ranking + fix:
  1. **Consent checkboxes not all ticked** (most likely — Google shows per-scope checkboxes and Continue is
     clickable with them unticked). FIX: Credentials → Connections → the Gmail connection → **Reauthorize** →
     sign in as visa.lodgement@ → **tick EVERY box** → Allow → **Verify** (expect green). Robinder must do
     this — he holds the password (D-90).
  2. **Workspace App Access Control restricting Make** (contingency C1 firing for real). Gmail read scopes are
     Google-"restricted", and an admin policy can grant a SUBSET silently, producing exactly this error even
     when the user ticks everything. FIX: admin → Security → Access and data control → API controls → Manage
     App Access → **Make** → **Trusted** → Save → then redo (1).
Distinguishing test: if he confirms he ticked every box and it still 403s, it is cause 2.
Scope requirement for M9: read message bodies **and** create drafts → `gmail.modify` class access, not
`gmail.readonly` alone. A readonly-only grant would pass the folder test later but fail at draft creation —
so verify with a real Run once (D-91), never by the connection turning green alone.
D-98 | Contents mapping for the 5 sub-folders — validated against REAL client files (D-47) | Every one of the
10 loose files in "485 Akshay" maps cleanly, which is the proof the 5-folder set is sufficient:
  **01 Identity & Personal** — passport · national ID (Aadhar) · birth/marriage certificates · photos ·
     **AFP/police checks** · medicals · **health insurance/OSHC policy** · change-of-name.
     (Akshay: Passport front and back · Aadhar front and back · AFP.pdf · AFP_repaired · Policy_Statement)
  **02 Education & Employment** — transcripts · completion letters · degree certificates · **CoE/enrolment** ·
     English test (IELTS/PTE) · skills assessment · employment references · payslips · CV · contracts.
     (Akshay: Trascript.PDF · Completion letter)
  **03 Financial & Sponsorship** — bank statements · financial-capacity evidence · **employer/sponsor docs
     (Trust Deed, business registration, financials, menu/offerings)** · SAF levy · invoices & payment
     receipts · nomination documents. (SBS thread: Trust Deed, updated menu, INVOICE-SBS, PaymentSubmission)
  **04 Forms & Lodgement** — **Form 80** · Form 1229 · statutory declarations (e.g. QLD stat dec) · signed
     application forms · ImmiAccount receipts · TRN/Application ID confirmations · s56 response bundles.
     (Akshay: client Info sheet · detail form · AKSHAY_KUMAR_520852388.pdf)
  **05 Correspondence & Outcome** — Department letters incl. **s56 requests** · email threads · **IMMI
     Acknowledgement** · grant notice · refusal letter · withdrawal. (SBS thread: IMMI Acknowledgement,
     SBS-APPROVAL)
**All 10 real files map with none left over → 5 folders are sufficient; no 6th needed.**
D-99 | Folder NAMING for employer/sponsorship matters — the convention had a gap | D-18 defines
`YM-2026-##### – FULL NAME`, which assumes the matter belongs to a PERSON. An SBS/nomination matter belongs to
the **employer** (e.g. a Pty Ltd trust), not the worker. Rule added:
  - Person matters (500/485/482 visa stage/189/190/…): `YM-2026-##### – FULL NAME`
  - **Employer/sponsorship matters (SBS, nomination):** `YM-2026-##### – COMPANY NAME (SPONSOR)`
Already supported by the data model with no schema change: MASTER col **I Visa Variant** has `Sponsor` /
`Employer`, and col **D Party 2 Name** holds the counterparty. So for a sponsor matter, **C Full Name = the
company**, Variant = Sponsor, Party 2 = the sponsored worker.
⚠️ **Known limitation, Phase 2 (feeds CR-004):** employer documents (Trust Deed, business registration,
financials) belong to the EMPLOYER, who may sponsor several workers — filing them inside each worker's folder
duplicates them. MVP accepts the duplication (simple, one structure, no staff decisions); Phase 2 should give
employers their own folder with worker matters linked to it. Do NOT solve this in MVP.
D-100 | ✅ ONE folder set for ALL visa types — folders = WHERE documents go, checklists = WHAT is required |
Question raised 31 Jul: do partner / skilled / work visas each need their own sub-folder set? **No — same 5
for every matter type.** Reasoning:
  1. **Adoption is the binding constraint.** Staff dump files flat today (D-47). One structure learned once
     is adoptable; a per-visa-type structure forces a decision before every save and will be ignored — and
     folders staff ignore are worse than no folders (D-47c).
  2. **The categories are functional, not visa-specific.** Every matter has identity, forms and
     correspondence regardless of subclass.
  3. **Automation cost.** Per-type structures mean a router with N branches, more Make ops, more failure
     modes, more to maintain — for zero user benefit.
  4. **Evidence:** two maximally different matter types both map with nothing left over — a 485 (10 real
     loose files, D-47) and an employer SBS (Trust Deed, menu, invoice, payment, IMMI ack, approval, D-95).
**The thing that DOES vary per visa type is the CHECKLIST — which documents are required.** That lives in the
sheet and in M4 (checklist selector: visa × onshore/offshore × dependents), never in the folder tree. Keeping
these two concepts separate is what allows one folder set to serve every subclass.
Spot-checks: **Skilled (189/190/491)** — skills assessment → 02, EOI/forms → 04, state nomination
correspondence → 05. ✅ **Work/482** — employer docs → 03, nomination → 03, LMT evidence → 03. ✅
⚠️ **PARTNER (820/801/300) IS THE ONE GENUINE STRAIN.** The Department assesses relationship evidence under
four pillars (financial, social, household, commitment), and that bundle splits across our folders: Form 888
stat decs → 04, joint accounts/bills/lease → 03, photos/travel/communication → 01. Staff assembling a partner
case think in terms of ONE relationship-evidence bundle, so the split may annoy them. Options: (a) keep 5 and
accept the split; (b) rename 01 → "01 Identity & Relationship"; (c) allow a 6th folder for partner matters
only. **Do not decide for the client — ask Robinder, it is a workflow-preference call, and he is the RMA who
assembles these.** Default if he has no preference: (a), for consistency.
**LINKED LIMITATION (same root cause, D-99/CR-004):** both the partner strain and the employer-document
duplication come from ONE thing — a person-centric flat folder set does not model MULTI-PARTY matters
(employer + workers; two partners). Disclose both together to the client; both are Phase 2 territory, and
neither justifies complicating the MVP.
D-101 | ❌ DROP both proposed client questions (partner folder · sponsor naming) — audited, neither qualifies |
Applying G5 ("one ask") and G4 ("park anything non-blocking") to the two questions I had drafted for Robinder.
Audit result: **do not ask either.**
  **Q2 sponsor folder naming — SELF-RESOLVING, no question exists.** M3 names the folder from whatever is in
  MASTER col C (Full Name). If a sponsorship matter is entered with the company as Full Name, the folder is
  automatically `YM-2026-##### – THE NINES TRUST PTY LTD`. The automation needs no configuration and no client
  decision — it is data-entry guidance for whoever types the row, which belongs in the M11 training doc, not
  in a client message. Asking would have been asking permission for something that already works.
  **Q1 partner relationship folder — LOW IMPACT + CHEAPLY REVERSIBLE.** Partner (820/801/300) is a minority
  line for them (dominant volume is 500/485/482). The relationship-evidence split across 01/03/04 is a mild
  workflow annoyance, not a blocker, and adding a 6th folder later is a **~2-minute change** (the folder list
  is a single variable in the scenario, D-62). Better decided from real use than in the abstract — revisit at
  M10/M11 once staff have actually filed a partner case.
  **Employer-document duplication (D-99/CR-004): disclose LATER, not now.** It is a Phase 2 improvement, not
  a defect, and it only becomes visible when they run a sponsorship matter. Raise it at the demo or when the
  first sponsor matter appears. Logged, not hidden.
**Net effect: the message to Robinder carries ONE ask — 👍 on the 5 folder names.** He already has 3 items
pending (Gmail reauthorize, folder names, s56 screenshot); adding two more would dilute all of them, which is
exactly the 30 Jul failure. Restraint here is the process working, not detail being lost.
D-102 | "02 Education & Employment" for NON-students — holds up; empty folders are acceptable by design |
Question 31 Jul: does that folder make sense for someone not studying? Yes — it is two halves, and non-students
use the EMPLOYMENT half: 482 (employment references, contracts, qualifications, skills assessment) · 189/190/491
(skills assessment, degrees, references, English test) · 186/494 (work history) · 407 (qualifications). Across
their 20 dropdown visa types, only ~4–5 would leave it empty or near-empty: 600 visitor, 101/802 child, and
sometimes 820/801 partner and 300. **The majority of their non-student book actively uses it.**
**Empty folders are an accepted trade-off, not a flaw.** The alternative — conditional folder sets per visa
type — reintroduces exactly what D-100 rejected: staff must decide which structure applies before every save,
which is what drives them back to dumping files flat (D-47). An unused folder costs nothing; an inconsistent
structure costs adoption. No change to the 5-folder set.
D-103 | ⚠️ SUPERSEDED by D-132 — file DELETED 2 Aug as a conflicting duplicate (G6). Folder-contents chart written per visa type — `docs/FOLDER-CONTENTS-CHART.md` | Covers 500 · 485 · 482 ·
SBS/nomination (employer) · 189/190/491 · 820/801 & 300 · 600 · 101/802 · 407, plus a fallback rule for
unlisted subclasses. Purpose: answers "the education folder feels study-oriented — what about other visas?"
by showing each folder's contents CHANGE per visa while the folder NAMES stay fixed (D-100/D-102). The 485 row
is validated against the real "485 Akshay" folder (D-47) and the SBS row against their real SBS email thread
(D-95), so the chart is grounded in their own files rather than generic advice.
Doubles as **M11 staff training material** — the one-line disambiguation rule at the end is the operational
takeaway: **"if it came FROM the Department it is 05; if we sent it TO the Department it is 04."**
Send the chart to the client only if he asks for detail — the folder-names message needs one ask (👍), and a
9-table chart would bury it (G5).
D-105 | ⚠️ SUPERSEDES D-100 AND D-102 — client is RIGHT; folders vary by VISA CATEGORY (5 categories, not 20
subclasses) | Robinder's counter-argument, 31 Jul: (a) a **work visa** carries company details, **profit &
loss, licensing** — business documents with no home in our set; (b) a **partner visa** (Australian PR/citizen
sponsoring a spouse from India/Pakistan) needs **no employment documents at all**, it needs relationship
evidence. He is the RMA and he is correct on the substance. Note we had ALREADY identified the partner strain
ourselves (D-100) and then resolved it the wrong way — preferring tidiness over how the work is actually done.
His independent identification of the same weak point confirms it was real.
**BUT the adoption risk from D-100 is also real** — 20 subclass-specific structures would be unlearnable.
**DESIGN THAT SATISFIES BOTH: 3 fixed folders + 2 that vary, across 5 visa CATEGORIES.**
Folders **01, 04, 05 are IDENTICAL for every matter** (identity/character/health · anything signed or lodged ·
anything received from the Department). Only **02 and 03** change:

| Category | Visa types | 02 | 03 |
|---|---|---|---|
| **A Study** | 500 | `02 Education & Enrolment` | `03 Financial Capacity` |
| **B Skilled / Graduate** | 485, 189, 190, 191, 491, 494, 186, Skills Assessment, EOI | `02 Education & Skills Assessment` | `03 Financial & Employment` |
| **C Work / Employer** | 482, 407, SBS, Nomination | `02 Employment & Position` | `03 Business & Sponsorship` |
| **D Partner / Family** | 820/801, 300, 101, 802 | `02 Relationship Evidence` | `03 Sponsor & Financial` |
| **E Visitor / Other** | 600, 417, Bridging, ART, Other | `02 Ties to Home Country` | `03 Financial & Invitation` |

Rationale per category:
- **C** directly answers Robinder: company details, **P&L, licensing**, ASIC, trust deed, SAF levy all sit in
  `03 Business & Sponsorship` — a named home instead of being smuggled into "Financial".
- **D** keeps the Department's four relationship pillars in ONE bundle (`02 Relationship Evidence`, including
  joint finances), fixing the 01/03/04 split that D-100 flagged and could not solve. The sponsor's own
  eligibility and income go to `03 Sponsor & Financial`. No employment folder is created at all.
- Staff learn **one shape** (01/04/05 always identical, 02/03 named for the case type) — the muscle memory
  D-100 wanted is preserved, because the POSITIONS never move.
**Implementation cost is trivial:** the sub-folder list is already a single variable in `M3-folder-create.md`.
Add ONE "Set variable" module mapping MASTER col **H Visa Type** → category → folder list. Not a 20-branch
router: 5 cases in one switch, ~1 extra Make op (credit budget safe, D-22). Sponsor matters additionally use
the company-name convention (D-99).
**Process note (G1/G5):** this is a case where the client's domain expertise beat our design reasoning. When an
RMA objects on substance, treat it as evidence, not preference — but still engineer the answer rather than
accepting "different folders for everything" literally.
D-106 | 🚨 DEEP AUDIT OF THEIR OWN CHECKLISTS — the document world is MULTI-DIMENSIONAL; my folder designs were
built from principle instead of from their source documents | ROOT CAUSE of the D-100/D-104/D-105 churn: the
per-visa checklists in `docs/02-client-facing/` state exactly which documents each visa needs, and I never
opened them before designing the folder structure. Same G2 failure class as the mailbox owner (D-93 Type A) —
the source of truth was in our own repo. Read 31 Jul; findings:
**1. PARTNER 820/801 is organised by PARTY, not by document type.** Their headings: `FORMS REQUIRED` ·
`DOCUMENTS REQUIRED FROM APPLICANT (PARTNER)` · `DOCUMENTS REQUIRED FROM SPONSOR (AUSTRALIAN PR/CITIZEN)` ·
`ADDITIONAL SUPPORTING EVIDENCE`. The applicant and sponsor lists are NEARLY IDENTICAL (passport, police
check, tax returns, superannuation beneficiary letter, joint lease, shared assets, joint travel, photos).
**Filing by document type would put two passports in 01 and two sets of tax returns in 03 with no way to tell
whose is whose.** This is a correctness problem, not an aesthetic one.
**2. 820/801 is TWO STAGES.** 801 is lodged ~2 years after the 820 with UPDATED relationship documents.
Structure must accommodate a second evidence round years later — and it questions D-11's grain (is 820+801 one
matter or two?). **Flag for the data model, do not assume.**
**3. RELATIONSHIP EVIDENCE IS NOT PARTNER-ONLY.** The `485 WITH DEPENDENT` checklist requires married/de-facto
evidence identical to a partner case: marriage certificate, superannuation beneficiary, joint bank account,
joint lease, shared expenses, call logs, relationship story, statement from a friend, photos. So a 485 needs
relationship documents too — which breaks any design that assigns relationship evidence to one category.
**4. THEY SEPARATE HEALTH AND CHARACTER FROM IDENTITY.** 407 headings: `1. Identity` · `2. Qualification` ·
`3. Employment/Background` · `4. GTE/Statement` · `5. English Language` · `6. Health` · `7. Character
(MANDATORY)` · `8. Family/Dependent`. I had merged identity+health+character into one folder.
**5. AFP CHECK IS ITS OWN SUB-APPLICATION** with a POINTS-BASED document set (passport 70 · driver licence 40 ·
bank statement 25 · bank card 25 · tax notice 25 · utility bills 20 + a 10-year residence history form).
Not one document — a mini-process with its own bundle.
**6. JRP / PSA (Provisional Skills Assessment) is a separate pathway** with its own checklist, upstream of a
485-TRA. Also 407 and SBS are 3-STEP (sponsorship → nomination → visa), matching D-95.
**7. CHECKLIST VARIANTS ARE THE M4 DIMENSIONS, CONFIRMED FROM SOURCE:** 485 alone has 7 variants —
individual vs with-dependent × skills authority (ACECQA / TRA / VETASSESS / Masters-Bachelors). 500 has
onshore / offshore / with-dependent / adding-a-dependent.
**CONSEQUENCE: the folder axis and the checklist axis are DIFFERENT AXES.** Folders must hold the coarse,
stable structure (party + broad category); the fine detail (which documents, which variant) belongs to the M4
checklist layer and to file naming. **Do not encode 7 checklist variants into folder names.**
**STATUS: folder structure is now an OPEN DESIGN QUESTION to settle WITH Robinder using this evidence — not to
be decided unilaterally a fourth time.** D-105's 5-category model is the starting proposal but must be
adjusted for findings 1, 3 and 4 before it goes to him.
D-107 | Folder structure DRAFTED as 3 sets — `docs/FOLDER-STRUCTURE-BY-VISA-CATEGORY.md` | SET 1 Standard
(500/485/skilled/visitor, 7 folders) · SET 2 Work-Employer (482/407/SBS/Nomination, 7 folders, incl. the
`04 Business & Sponsorship` folder Robinder asked for — P&L, licensing, ABN/ACN, Trust Deed) · SET 3
Partner-Family (820/801/300/101/802, **5 folders, PARTY-based**: Applicant / Sponsor / Relationship Evidence /
Forms / Correspondence, mirroring their own checklist headings). Every folder's contents trace to a heading or
line item in Yale's own checklists. Last two folder positions are identical in all three sets so staff muscle
memory survives. Implementation = one Set-variable lookup, 3 cases, ~1 extra Make op.
Three genuine open questions for the client (and only three): 👍 on names · how the 801 second evidence round
is stored (sub-folder vs new matter row) · whether 7 folders is acceptable or he wants Health & Character
merged back into Identity to compress.
D-108 | Nisha — what we actually know, and it is NOT a blocker | Evidence: the ops workbook "YALE BRISBANE
OFFICE WORK" contains a tab named **"Nisha's TASKS"** (seen in the 26 Jul tab audit, ~27 tabs), but **Nisha
does not appear in the 12-person team roster** the client supplied. So she is someone with an assigned task
list who is not on the roster — likely admin/support staff, a former staff member, or a contractor. **Impact:
M9/M6 auto-assignment resolves against the roster table; an unknown name cannot receive an assignment.** If
she is active, she needs a roster row (name + team + visa lines + office). If she is not, her tab is stale
Phase-2 material. **Not a blocker** — assignment falls back to Unassigned, and it affects no MVP build step.
Ask casually at the demo, not as a standalone message.
⚠️ Related finding from the same tab audit, still unactioned: the workbook has an **"eca password" tab holding
credentials in a spreadsheet**, plus a hidden "withdrawal" tab. The password tab is a real security issue to
raise gently at handover (M11) — logged here so it is not lost again.

## ===== 2026-08-02 NEW ACCESS BATCH (3 files) — full audit =====
D-117 | ✅ S56 CLIENT-NOTIFICATION TEMPLATE RECEIVED — closes open ask #3 (was pending since 30 Jul) |
Client sent their actual wording via WhatsApp screenshot + "Please use this as template / With instructions on
the required documents and date to comply". Verbatim structure:
```
[CLIENT NAME]'s file has opened the case officer has requested:
  • [requested item 1]
  • [requested item 2]
  • ...
We need to submit the documents before [DATE]. thank you
```
Characteristics to preserve: very short · no letterhead · possessive client name · "file has opened" = case
officer allocated · requested items listed VERBATIM from the Department letter · explicit deadline date ·
lower-case "thank you". **Template variables: {{client_name}}, {{requested_items[]}}, {{due_date}}.**
🔴 **DESIGN CALL (no new client question needed):** the date shown to the client = our **INTERNAL day-26**
date, never the legal day-28 (D-58). Their sample shows a bare date, so we simply populate the earlier one —
otherwise documents land on the legal deadline with zero time to review and lodge.
D-118 | 🚨 THE EVIDENCE FILE — full 482 Sevial s56 thread (25 messages, 2 Jun → 30 Jul 2026) | Previously we
held only a forwarded fragment. The complete client-facing chase is now visible and it is the single best
justification for this entire project:
  · **2 Jun** s56 + Form 80 sent to client → **18 Jun first follow-up = 16-DAY SILENCE** (independently
    matches the dormancy gap in D-34 — this is not a one-off)
  · documents then trickle in across **8 separate emails** over 3 weeks
  · **9 Jul** final document (NBI clearance) — **37 days after the s56 was forwarded**
  · **30 Jul** the CLIENT has to ask "just wondering what's the status of my application?" → reply: "wala pa
    pong update" (no update yet). Nearly two months, client chasing us.
  Every one of those failures is what M5 (dormancy detector + auto-chase) and M9 exist to remove.
D-119 | Technical constraints discovered in the Sevial thread — affect M9 attachment handling | (a) Clients
send **.rar and .zip archives** (Payslips.rar, Payslips.zip, TaxStatement.zip, Payslip_COLES.zip,
Payslip_NYCbagel.zip) — the classifier CANNOT read inside archives; it must detect the archive, log
"compressed bundle received", and route to a human rather than guess contents. (b) The **same document
arrives twice in different formats** (NBI clearance as a phone photo on 2 Jul, then as PDF on 9 Jul) — dedupe
must be by document TYPE + client, not by filename or hash. (c) Attachment names are ad hoc
(`CamScanner 23-6-2026 10.49.pdf`, `CV_LES.docx`, `BBCO. Contract .pdf`) — reinforces the Phase 2 auto-rename
case (D-47c). (d) Third-party blockers dominate: **NBI clearance quoted at 3–4 weeks**, employer evidence
pending — supports M5's responsible-party field (chase the employer, not the client).
D-120 | Recurring client questions that the request email should pre-empt | From the same thread: "How many
payslips should I send?" → "latest 3 months would be fine sir." · "Just let me know sir if may kulang pa po
ako :)" (is anything still missing?) · "what's the status of my application?". **All three are answerable in
advance** — M4's document-request email should state quantities up front, and M5's checklist view answers
"what's outstanding" without anyone asking. Cheap, high-perceived-value wins for the demo.
D-121 | 485 Ronaya thread — ONE s56 can cover MULTIPLE APPLICANTS | Department email 17 Apr 2026 lists a
table of **two** applicants (main + de facto partner) with names and dates of birth under one file number
BCC2026/1472133. Consequences: (a) the M9 parser must handle a multi-row applicant table, not assume one
person; (b) confirms MASTER's `Party 2 Name` column (D-11 matter grain); (c) the s56 deadline applies to the
MATTER, so both applicants' documents feed one deadline.
D-122 | 🔴 RELATIONSHIP EVIDENCE IS NOT PARTNER-VISA-ONLY | The 485 Ronaya s56 escalated on 7 May into a full
de-facto evidence request: updated photos together · updated joint bank statement · **statutory declaration of
cohabitation** (QLD form attached) · conversation and call logs · relationship statements from a parent and a
friend. The Department's own four-pillar guidance (financial · household · social · commitment) was pasted
into the email. **This materially strengthens the partner-folder question (D-101):** relationship bundles
appear in 485 dependent cases too, not just 820/801 — so a dedicated relationship folder has broader value
than first assessed. Also: the Department's four pillars are a ready-made CHECKLIST for M4.
D-123 | Department→consultant hop-1 latency measured: 3 days | Department sent **Fri 17 Apr 4:53 PM** →
forwarded from `visa.lodgement@` to the consultant **Mon 20 Apr 9:18 AM** (weekend). The consultant then
emailed the client **9 minutes later**. So the bottleneck is NOT the consultant — it is the unattended
`visa.lodgement@` mailbox over weekends. **Quantified value of M9: recovers ~3 days of a 28-day clock.** Use
this number at the demo; it is from their own file.
D-124 | ✅ ROSTER FULLY CLOSED — "Nisha" is a former employee | Client 2 Aug: "No need to assign any work to
Nisha. Previous employee." The ops-workbook tab is historical. **Remove Nisha from all assignment dropdowns
and routing; retain the name only for reading old records.** The roster now has NO open gaps (workvisa.bne@
closed in D-94).
D-125 | ⚠️ QUALITY ISSUE: Yale is sending the mislabelled Form 80 to clients | The Sevial thread shows
`CoE Certificate (10F566341) (1).pdf` attached **by Yale, to the client**, alongside the s56 request — and we
established it is actually a blank Form 80 (D-72). The client then returned the same wrongly-named file. So
the mislabelling propagates outward to clients, not just internally. Already flagged to the client politely;
this is additional evidence for the Phase 2 QC/auto-rename feature, and worth one gentle mention at the demo.
D-126 | ✅ CLIENT APPROVED THE FOLDER STRUCTURE — three instructions, all adopted | Client answers 2 Aug:
  1. **Work/employer visas → organise by STEPS, not document type.** Verbatim: "for 407 and 482 steps are:
     1. Sponsorship registration (SBS-482, TAS-407). Step 2. Nomination, step 3 visa lodgement. This will be
     easier for checking for the application progress." **Excellent instruction — the folder tree becomes a
     progress indicator**, and it independently confirms CR-004 (sponsorship is a 3-stage chain, D-95). Adopt.
  2. **Partner 820/801 → sub-folders for each stage.** "we can make it in both file for partner visa then we
     can put subfolder as 801 and 820." Rationale from the client: the updated relationship documents arrive
     ~2 years later at the 801 stage, so the two bundles must not mix. Adopt as sub-folders inside the
     relationship folder — one matter, two stages (does NOT change the MASTER matter grain, D-11).
  3. **Health & character folds into Personal.** "we can just put the insurance or health character in
     personal folder because there not much document on it." Adopt — fewer folders wins on adoption (D-47c).
⚠️ **ASSUMPTION FLAGGED (G1):** the client answered against a **7-folder** proposal ("Standard and Work have
seven") that Sharjeel sent directly — that exact list is NOT in this repo, so the structures below are
RECONSTRUCTED from the client's three instructions plus D-98/D-100. **Sharjeel must confirm they match what he
actually sent before this goes to build.** Recording the gap rather than silently guessing.
RECONSTRUCTED FINAL SETS (pending Sharjeel's confirmation):
  **STANDARD** (500 · 485 · 189/190/491 · 600 · 101/802): `01 Identity & Personal` (now includes health,
  insurance, medicals, police checks) · `02 Education & Employment` · `03 Financial` · `04 Forms & Lodgement` ·
  `05 Correspondence & Outcome`
  **WORK / EMPLOYER** (482 · 407 · 186 · 494): `01 Identity & Personal` · `02 Education & Employment` ·
  `03 Step 1 – Sponsorship (SBS / TAS)` · `04 Step 2 – Nomination` · `05 Step 3 – Visa Lodgement` ·
  `06 Correspondence & Outcome`
  **PARTNER** (820/801 · 300): `01 Identity & Personal` · `02 Relationship Evidence` → sub-folders
  `820` and `801` · `03 Financial` · `04 Forms & Lodgement` · `05 Correspondence & Outcome`
**Build impact:** M3 now needs a ROUTER on visa type to pick one of three folder sets, and the partner set
needs one nested level. Cost: ~+3 Make operations per partner matter, and a variable per set — small. This
supersedes the single-set assumption in D-100; the ADOPTION reasoning in D-100 still holds because staff never
choose the set — the automation picks it from the Visa Type already in the sheet.
D-127 | Relationship-evidence folder is now JUSTIFIED, not optional (resolves D-101's deferred question) |
D-101 deferred the partner-relationship-folder question as low impact. Two new facts overturn that: (a) the
client has explicitly asked for 820/801 relationship sub-folders (D-126); (b) relationship bundles also appear
inside **485** matters with a de-facto second applicant (D-122). The question is therefore answered by
evidence rather than by asking — no client question needed. D-101's "do not ask" verdict stands; its
"low impact" assessment does not.
D-129 | 🔴 ARCHITECTURE.md was STALE v1 — rewritten to v2 before it caused a wrong build | Audit 2 Aug found
the file CLAUDE.md points every session to as the conventions source had never been updated. Six live errors:
(1) **10-folder tree** (`01 Enquiry … 10 Visa Outcome`) — superseded by the client's 5/6-folder sets (D-62,
D-126); (2) **10-column data contract** — actual spec is 23 columns (D-51..D-56); (3) Stage dropdown used OUR
vocabulary, not theirs; (4) **Gmail DELEGATION described as the access model** — impossible and irrelevant
(D-78/D-79/D-80); (5) `visa.lodgement@` not mentioned at all despite being the s56 mailbox (D-64); (6) script
names wrong (`code_assign.gs`/`master_validate.gs` vs the real `master_codes.gs`/`setup_master_sheet.gs`).
**Building T3 from this would have created 10 wrong folders in the client's live OneDrive.** Caught by the
G1 pre-build audit, which is exactly what the gate exists for.
v2 adds: the three client-approved folder sets with router logic · the three-mailbox table with roles and
access models · the s56 template + day-26 rule · attachment constraints (.zip/.rar unreadable, dedupe by
type) · multi-applicant parsing · Nisha exclusion · correct naming conventions. Data contract now POINTS to
`docs/MASTER-SHEET-SPEC.md` instead of duplicating it — duplication is what let the two drift apart.
**Rule added to PROCESS: docs must reference the single source, never restate it.**
D-130 | Folder-set question CLOSED — no outstanding item with Sharjeel | Sharjeel confirmed 2 Aug that
everything the client sent has been shared: two PDFs, one screenshot, and the typed answers. The "7-folder
proposal" text existed only inside the question he sent, not as a separate document. **Stop asking.** The
three sets in ARCHITECTURE v2 are final: they satisfy all three client instructions (fewer folders than 7 ·
health & character merged into Personal · work by step · partner 820/801 sub-folders) and are validated
against real client files (D-98). Proceed to build on them.
D-131 | 🔴 DECISION-NUMBER COLLISION — 7 duplicate IDs found and repaired | Audit 2 Aug: `DECISIONS.md`
contained duplicate headers for D-101, D-105, D-106, D-107, D-108, D-113 (and a false-positive on D-81).
Cause: I derived the next number from `grep -c "^D-"` — a **COUNT**, not the **MAX**. Counts diverge from max
whenever numbering is non-contiguous or a parallel session has appended. Cross-references like "see D-105"
were therefore ambiguous — pointing at two different decisions. **Repair:** my entire 2 Aug block renumbered
to D-117…D-130 (the earlier session's entries keep their numbers, since they were first in file order), and
every cross-reference updated across ARCHITECTURE.md · PROCESS.md · CLIENT-LOG.md · ROADMAP.md · ACCESS.md ·
scenarios/M3-folder-create.md. Verified: **120 headers, 120 unique, zero duplicates.** A dangling `D-104`
reference in `docs/FOLDER-STRUCTURE-BY-VISA-CATEGORY.md` was also corrected to D-100/D-102.
**RULE (now G7): next decision number = `MAX existing + 1`, never the count.**
`grep -oE '^D-[0-9]+' DECISIONS.md | sort -t- -k2 -n | tail -1`
D-132 | 🔴 MY RECONSTRUCTED FOLDER SETS WERE WRONG — replaced with the real checklist-derived sets | D-126
recorded the client's three instructions but reconstructed the folder sets from memory, because I had not
found `docs/FOLDER-STRUCTURE-BY-VISA-CATEGORY.md` — which already contained the actual 7-folder proposal the
client was answering, **derived from Yale's own client checklists**. My reconstruction dropped two folders the
client's own documents require: **`Dependents & Relationship`** (their "485 WITH DEPENDENT" checklist demands
full relationship evidence — marriage certificate, joint account, joint lease, call logs, photos) and the
party-based split for partner matters. It also invented a generic "Financial" folder for work matters instead
of the **Business & Sponsorship** grouping Robinder specifically asked for (P&L, licences, ABN/ACN, Trust Deed).
**Corrected sets now in ARCHITECTURE v2 and the M3 spec** — the real three sets with the client's 2 Aug changes
applied: Health & Character merged into Identity (his request) · Work reorganised by STEP (his request) ·
Relationship Evidence gains `820` / `801` sub-folders (his request).
**This is another G2 failure — the answer was in our own repo and I did not search for it before reconstructing.
The file was found only because a routine `ls` of docs/ surfaced it.** Reinforces G6: before writing a
structure, locate and read the authoritative document, do not rebuild it from conversation memory.
D-133 | ✅ FULL ALIGNMENT AUDIT PASSED (2 Aug) — plus three more defects found and fixed | Systematic scan of
every document, script and cross-reference after the folder-set correction. **Found and fixed:**
  1. `docs/FOLDER-CONTENTS-CHART.md` still asserted "**same 5 folders for every matter**" — directly
     contradicting the client-approved three sets, and it duplicated the folder authority. **DELETED** (G6);
     `docs/FOLDER-STRUCTURE-BY-VISA-CATEGORY.md` is now the single folder authority, updated to APPROVED
     status with the client's three changes applied and all its open questions closed.
  2. My blanket D-number remap had **corrupted two references inside the earlier session's 31 Jul CLIENT-LOG
     entry** (it referenced that session's numbers, not mine). Rewritten with the correct supersession note.
     *Lesson: a global find-replace across shared history files is unsafe — scope remaps to the block you
     authored.*
  3. `D-103` pointed at the now-deleted chart → marked SUPERSEDED and added to the index, together with
     D-100/D-102 (single-set overturned), D-126's reconstructed sets, and the D-117–D-130 renumber.
**Verification results — all green:** scripts vs spec **23 headers = 23 spec rows**, 9 dropdowns,
`COL_CODE=1 / COL_NAME=3 / COL_DATE=20` ✅ · all three folder sets **identical across ARCHITECTURE.md,
scenarios/M3-folder-create.md and the authority doc** ✅ · zero stale structure strings (`01 Enquiry`,
`10 Visa Outcome`, `06 Enrolment`, the old `02 Health & Character`, `04 Business & Sponsorship`) ✅ ·
DECISIONS **122 headers, 122 unique** ✅ · **17/17 client files mapped**, now in BOTH `access/` and
`assets/samples/` ✅ · git clean, everything pushed ✅ · 3 memory files indexed ✅.
D-134 | ✅ CLIENT SIDE IS COMPLETE — nothing is blocked on Robinder | Confirmed from the 31 Jul log entry:
the `visa.lodgement@` Gmail connection was **authorized after the reauthorize (D-97)**. The only thing left on
that item is **our own Run-once verification**, which is our task, not his. Combined with the 2 Aug delivery
(s56 template · folder approval · roster closed · both full s56 threads), **every input needed to build the
MVP is now in hand.** Remaining client items are all future-dated, not blocking: test files (M10) · M6 wording
👍 (before M6 goes live) · walk-in sheet location · **Make paid plan (go-live gate)** · final 50% on go-live.
D-135 | 🐛 REAL DEFECT FIXED IN `master_codes.gs` — duplicate-code race condition | Found by auditing the
script logic itself (not the docs) before T2 runs. `onEdit` and the 5-minute timer can fire simultaneously,
and two quick edits fire two `onEdit` runs. Each run independently reads "highest existing number" and adds 1
— so **two different clients could be issued the SAME `YM-2026-#####` code.** Impact if it had shipped: the
folder URL, the tracker cross-reference and every downstream scenario key off that code, so a collision
silently corrupts the record and is near-invisible until someone notices two clients sharing an ID.
**Fix:** `LockService.getDocumentLock()` with `tryLock(20000)`, work moved into `assignMissingCodes_()`,
`releaseLock()` in a `finally`, and `SpreadsheetApp.flush()` before release so the write commits inside the
lock. If the lock is unavailable the run simply returns — the holder covers those rows anyway.
**Also added `auditDuplicateCodes()`** — a manual safety net that scans column A and logs any duplicate.
Expected output: `No duplicate codes ✅`. Verified: braces/parens balanced, column constants unchanged
(A=1 · C=3 · T=20), onEdit still guards on column C.
D-136 | 🔴 TWO T3 PLACEMENT GAPS — could misfile folders in the client's LIVE drive | Audit of
`ONEDRIVE-IDS.md` against the M3 router found the spec still said "walk the tree and record the itemIds" when
we already hold most of them, and that two routes point at branch ROOTS rather than verified client-folder
parents:
  1. **TOWNSVILLE and PHILIPPINES internals were never mapped.** Brisbane nests
     `CLIENT FILES → ENGAGED CLIENTS → <team>`. If those branches nest similarly, creating a client folder at
     the branch root drops it in the wrong place in live data. **Mitigation adopted:** the live schedule is
     restricted to the two verified Brisbane routes; Townsville/Philippines rows fall to the Fallback route
     and only raise an alert. Two API calls close it properly.
  2. **`Work visa BNE AND TSV` (82 MB) may be where 482/407 matters actually live**, separate from ENGAGED
     CLIENTS — in which case SET 2 folders belong there. Unverified; one API call or one question at the demo.
M3 spec Module 2 now carries the **real itemIds** for the verified routes and flags both gaps inline, so the
build cannot silently assume a parent. Neither gap blocks the Brisbane demo path.
D-137 | ✅ SECOND-PASS DEEP AUDIT COMPLETE — cleared to build | Rather than repeat the first pass, this one
audited what had never been checked: **script logic**, **OneDrive parent IDs**, and **silent edit failures**.
Three findings, all fixed:
  1. **D-135 — duplicate-code race condition in `master_codes.gs`** (real defect, would have shipped). Fixed
     with LockService + flush-inside-lock + a manual `auditDuplicateCodes()` safety net.
  2. **D-136 — two folder-placement gaps.** TOWNSVILLE/PHILIPPINES internals unmapped (routes pointed at
     branch ROOTS — would have misfiled in live data); `Work visa BNE AND TSV` may be the true home for
     482/407. Mitigated by restricting the live schedule to the two verified Brisbane routes.
  3. **A silent no-match edit.** The folder authority doc still read "proposal for Robinder's 👍" after an
     earlier `.replace()` failed to match and returned quietly. **Caught only because the verification script
     asserted on content rather than trusting the edit.** LESSON: `str.replace()` that no-matches is
     indistinguishable from success — always assert the resulting content.
**Full sweep result — all green:** decisions unique (124) · builder 23 headers = spec 23 rows · lock + auditor
present · authority doc CLIENT-APPROVED with zero open questions · all six folder-set names identical across
ARCHITECTURE / M3 spec / authority · 820/801 sub-folders documented · M3 carries real parent itemIds and flags
both gaps · Nisha excluded everywhere · git clean and pushed.
**Verdict: the build is aligned and safe to proceed. T2 and T3 are cleared to run.**

## ===== 2026-08-02 THREE-AGENT PARALLEL AUDIT — findings + repairs =====
D-138 | 🔴 T2 BLOCKER FIXED — `SBS` and `Nomination` routed to folder SET 2 but were REJECTED by the dropdown |
All three folder documents route employer-side matters (`482 · 407 · SBS · Nomination`) to SET 2, but the
Visa Type dropdown in `docs/MASTER-SHEET-SPEC.md` and `scripts/setup_master_sheet.gs` contained **neither
`SBS` nor `Nomination`** — and `setAllowInvalid(false)` actively rejects unlisted values. **Every employer-side
matter (`COMPANY NAME (SPONSOR)`, D-99) was a hard dead end at data entry.** This would have surfaced only when
staff tried to log their first sponsorship matter. Both values added to the script and the spec (Visa Type now
23 options). Caught by the parallel consistency audit; T2 writes this dropdown, so it had to be fixed first.
D-139 | 🔴 SHIP-LADDER ACCEPTANCE CRITERIA CONTRADICTED THE BUILD | `scenarios/M3-folder-create.md` defined
SET 1 as **6** folders at line 85 and then, in the dry-run gate at line 124, told the tester to *"verify the
**5** STANDARD sub-folders"*. `STATUS.md` and `ROADMAP.md` repeated the 5. **The folder DEFINITIONS were fixed
everywhere on 2 Aug; the VERIFICATION CRITERIA were not** — so a correct 6-folder build would have been checked
against a gate expecting 5, in the client's live drive, immediately before the demo. Fixed: the gate now states
**SET 1 = 6 · SET 2 = 6 · SET 3 = 5 (+2 nested)** and instructs checking against the set the row routes to,
never a fixed number. *Lesson: when a definition changes, grep for its ACCEPTANCE TEST too.*
D-140 | Op-count and authority-chain contradictions cleaned up | Three different per-matter op counts existed
(≈8 in ARCHITECTURE, ~13 and ≈9/9/10 both inside M3). Unified to **≈9 (SET 3 ≈10)**. Also a three-way circular
authority claim (ARCHITECTURE said the folder doc was authoritative; M3 said ARCHITECTURE was; the folder doc
said both build from it). Resolved per G6: **`docs/FOLDER-STRUCTURE-BY-VISA-CATEGORY.md` is the single folder
authority**; ARCHITECTURE's copy is explicitly labelled a convenience copy that loses any conflict. Also fixed:
the staff disambiguation rule was stated with SET-3-only numbers (05/04) — now stated **by folder NAME**, since
numbers differ per set and SET 2 has no `Forms & Lodgement` folder at all; `Other` restored to SET 1's list;
the authority doc's own "last two folders are always…" principle corrected (SET 2 breaks it).
D-141 | Renumber collateral repaired — `D-128` never existed | The 2 Aug blanket find-replace (D-131) also
rewrote the EARLIER session's `D-101` into `D-128` in three places, creating an index row and two body
references pointing at a decision that has never existed. All corrected back to D-101. Numbering holes at
**D-104, D-109–D-116 and D-128** are renumber artefacts — verified **no decision content was lost** (header
count held at 120 across the renumber commit; all thirteen 2 Aug entries map 1:1). The dangling `D-104`
reference inside D-105's body also fixed. **Reinforces D-133's lesson: never run a global find-replace across
files containing another session's history — scope it to the block you authored.**
D-142 | ✅ EIGHT CLIENT ANSWERS existed only in `docs/PROJECT-STATE.md` — now decisions of record | None were
lost, but none were greppable from `DECISIONS.md`, which CLAUDE.md designates as THE decision record — so a G2
search returned nothing for any of them. Captured here:
  (a) **20 Jul — SCOPE LOCKED.** "Yes these are the services we need for now. Please send the proposal."
  (b) **21 Jul — verbal GO: MVP, $1,680, 50/50.** Commencement 50% received; final 50% at go-live.
  (c) **25 Jul — walk-ins live on a SEPARATE sheet** (shared). Feeds M6; location still to be located.
  (d) **25 Jul — consultant on leave ⇒ the office mobile is handed to another team member.** A real backup /
      re-assignment rule the M6/M7 routing must respect — an out-of-office consultant must not silently own
      new enquiries.
  (e) **25 Jul — their checklists are CURRENT.** This is the validity basis for the entire M4 checklist
      selector; without it the checklist map rests on undated documents.
  (f) **25 Jul — website form submissions land in the client's Microsoft mailbox**, not Gmail. M6 capture must
      read that mailbox, not project1@.
  (g) **29 Jul — `INFORMATION HUB` is a reference library** (skills-assessment / visa info), client said KEEP.
      **Excluded from client-file automation** — M3 must never create client folders there.
  (h) **24 Jul — EXISTING clients also get YM codes**, not just new matters ("…For existing client"). D-04
      fixed only the start number; this instruction was never recorded as a decision. Affects the tracker
      import (D-49): the ~48 active matters all receive codes.
D-143 | 🔴 SECURITY — three client-PII files were tracked and pushed to GitHub | Found by the artifact audit.
`docs/04-additional-docs/Team roster.docx` (12 staff names + emails) · `docs/04-additional-docs/Model
folder.docx` (real client folder names) · `docs/Answer to the questions..docx` were all committed, directly
contradicting the CLAUDE.md hard rule *"docs/ is CURATED — never add client PII"* and ACCESS.md's *"local
only … git-ignored"*. `.gitignore` covered `assets/samples/*` but nothing under `docs/`.
**Action taken:** `git rm --cached` on all three (files remain on disk) + `.gitignore` hardened with explicit
`docs/**` rules. **Residual risk, for Sharjeel to decide:** they remain in COMMIT HISTORY. The repo is
**private**, so this is not public exposure — but it sits on a **personal** GitHub account, which is not an
approved location for client data. Options: (1) accept, given private + limited sensitivity (no passports or
identity documents — staff contacts and folder names); (2) rewrite history with `git filter-repo`, which fully
removes them but rewrites every commit hash. **Not actioned unilaterally — history rewriting is destructive.**
Recommendation: (1) now, and move the repo to a company org at handover.
D-144 | Tracking granularity: 143 client files on disk, 17 mapped file-by-file — recorded, not hidden |
The artifact audit confirmed **nothing is lost**: all 143 client files exist, and `access/` ↔ `assets/samples/`
match on all 17 with identical SHA-256 hashes. But 126 files across batches 1–3 have only BATCH-level records,
and the batch-1 SOP library (32 files incl. **3 unique infographic PNGs**, hash-verified as not duplicates)
appeared in **no** tracking record at all — it lived only in `PROJECT-STATE.md` and a folder README, neither
referenced from inside `yale-build/`. A **BATCH-LEVEL TRACKING** table is now in `ACCESS.md` stating the
granularity per batch honestly, plus the images inventory and the deliberate exclusion of
`APPLICATION FEES.docx` (real-client PII invoice). **Decision: batches 1–3 stay at batch granularity** — they
are reference SOPs already reorganised and audited, per-file mapping would cost hours and unlock nothing.
Batch 4 (`access/`) and all future deliveries stay file-by-file, because those drive build decisions.
ALSO FIXED: the s56 screenshot's map row contained a plain space where the real filename has a **narrow
no-break space (U+202F)** — so grepping the true filename returned nothing, the exact failure the map exists to
prevent. Row is now byte-exact from disk.
D-145 | 🔴 T2 WAS UNSAFE TO RUN — the target tabs are NOT empty. Scripts hardened, not just documented |
Independent readiness review before execution. `MASTER`/`ENQUIRIES` were **hand-built 25 Jul under the
superseded v1 layout**, including a YM-2026 code formula (PROJECT-STATE), but both scripts were written
assuming blank tabs. Five real defects, all FIXED IN CODE rather than papered over with a warning:
  1. **`deleteColumns` ran unconditionally** — would have deleted MASTER col X+ and ENQUIRIES col **L+
     (fifteen columns)** in the client's live database, with no undo (a script-side delete is not in the
     user's Ctrl+Z stack). → now deletes ONLY when the trailing block is provably empty; otherwise it stops
     and toasts.
  2. **Whole-column `setValues()` on A and T** — `getValues()` returns formula RESULTS, so writing them back
     **flattens any formula into a static value** and clobbers concurrent human/Make edits between read and
     write. → now writes **cell by cell**, only the rows that actually change.
  3. **`hasCode = cell not empty`** — a legacy v1 formula output in A2 would have suppressed the new code
     forever, silently failing the T2 acceptance test. → now a strict `/^YM-\d{4}-\d{5}$/` test, applied in
     `nextNumber_()` too so junk values cannot poison the max.
  4. **Stale v1 data-validation survived** — old list-restricted dropdowns sitting on different v2 columns
     would REJECT valid entry. → `clearDataValidations()` across the sheet before applying the new rules.
  5. **`getRange(2, col, 999, 1)` threw** on a tab trimmed below 1000 rows, aborting setup half-done with no
     rollback. → clamped to `getMaxRows() - 1`. Protection removal also wrapped in try/catch (throws when the
     protection was created by a different Google account).
Plus **`preflightCheck()`** — read-only; reports existing rows, formulas in A/T, and data beyond the headers
BEFORE anything is written. ROADMAP T2 now opens with **T2.0**: back up the sheet, open Apps Script
**container-bound**, run preflight, clear legacy v1 content — and closes with T2.5 `auditDuplicateCodes` and
**T2.6 delete the test row AND its code** (otherwise the client's first real client becomes `YM-2026-00002`,
permanent and visible). Lock reduced 20s → **10s** to stay inside a simple trigger's 30-second budget.
Both files pass `node --check`.
D-146 | Verification pass caught FIVE defects introduced BY the previous fixes | Independent re-audit of the
12 repairs: 10 verified, 2 partial, and five NEW problems created by my own edits — the important lesson of
this session. (1) I asserted **"154 client files"** without counting; the real total is **143** (15+17+86+8+17),
and the wrong number had already propagated to four files. (2) `ARCHITECTURE.md` still flagged the s56 mailbox
as *"🔴 currently 403"* — the very belief D-134 exists to kill, sitting in the file CLAUDE.md sends every
session to for conventions. (3) `STATUS.md` listed `visa.lodgement@` as "Open" 45 lines above "NOTHING BLOCKED
ON THE CLIENT". (4) Decision counts stale in three files after appending D-138..D-144. (5) Delegation survived
in `ACCESS.md`'s revocation map and the `M9 — Gmail triage & delegation` module title. All six fixed.
**LESSON: a fix applied to the two places an audit named is not a fix — grep the whole repo for the CLAIM, not
the location.** Combined with D-133's silent-no-match lesson: assert on resulting CONTENT, repo-wide.
D-147 | 🐛 STALE REGEX in `docs/M9-EMAIL-AI-SPEC.md` — D-68's correction was never applied to the spec |
D-68 (30 Jul) corrected the Application ID pattern from `\b\d{10}\b` to `\b\d{9,11}\b` after finding a real
**9-digit** ID (`365718045`, the 485 Ronaya case) alongside a 10-digit one (`1540713558`). **The decision was
recorded; the spec was never updated** — so the M9 build would have silently missed every 9-digit Application
ID, and a missed identifier means the s56 cannot be matched to a MASTER row. Also corrected Position number
(`\d{8}` → `\d{6,10}`, label-anchored) since D-68 notes the length varies per officer; we hold `60093715`.
Found only because a grep for the wrong file-count number happened to hit `1540713558`. **Same class as
D-115 and D-146: a decision recorded but never propagated to the document that implements it.** The
countermeasure is G6 (single source) plus: when a decision CORRECTS a value, grep for the OLD value repo-wide
and fix every occurrence in the same commit.
D-148 | Stop hard-coding counts in prose — they drift every single time | The decision-count figure went stale
four times in one day (90+ → 127 → 134 → 137), and the client-file count was asserted as 154 when it is 143
(D-146). Every restatement of a number that changes is a future contradiction. **Rule: never write a live
count into prose.** Say "the full decision history" / "every client file is mapped in the table below" and let
the table or the file itself be the count. Where a number genuinely matters, compute it:
`grep -cE '^D-[0-9]+ \|' DECISIONS.md`. Hardcoded counts removed from CLAUDE.md, PROCESS.md and STATUS.md.
This is the same root cause as G6 (single source, never restate) — extended to numbers, not just structures.
D-149 | ✅ M9 MAILBOX VERIFIED END-TO-END (3 Aug) — the s56 pipeline's foundation is proven | Run-once on the
`Gmail → Watch emails` module returned **Bundle 1** containing a real message addressed to
`Yale Migration <visa.lodgement@yalemigration.com.au>`, with **full text body, HTML body, headers, System
folder = INBOX, Message ID and Thread ID**. Cost: **1 operation, 1 credit**. What this proves, in order:
(a) the OAuth connection is valid; (b) the **restricted scopes really were granted** — message BODIES are
readable, not just headers, which is what M9's classifier needs (D-97 closed for good); (c) we are reading the
**correct mailbox** — the `To:` confirms visa.lodgement@, not project1@ or info@; (d) `Mark as read = No` left
the client's mailbox untouched; (e) folder/label metadata is exposed, so the s56 filter can key on INBOX +
sender domain (D-65). **M9 is now unblocked at the infrastructure layer.**
Observation for later: the oldest message in that mailbox is a Gmail welcome dated **3 Jul 2025**, so the
mailbox was created around then — useful when sizing an s56 backfill.
D-150 | ⚠️ SCHEDULE vs ON/OFF are DIFFERENT THINGS in Make — verified safe | Sharjeel set Schedule settings to
"At regular intervals / 15 minutes" and asked whether that makes it auto-run. **It does not, by itself.** In
Make the schedule only says WHEN a scenario runs *if it is switched ON*; the ON/OFF toggle is separate.
Confirmed from the org dashboard screenshot: **Active scenarios 0 / 2** — nothing is running. Also captured:
**956 / 1,000 credits left** (~44 used, 4%), resets 25 Aug, data transfer 311.5 KB / 512 MB. **Rule for the
build: leave every scenario OFF until its ship ladder passes (D-14).** A 15-minute schedule switched on
against a live inbox would consume ~2,880 operations/month — nearly 3× the entire free tier (D-22).
D-151 | Sequencing correction: `preflightCheck` lives in `setup_master_sheet.gs`, which was not yet pasted |
Sharjeel pasted `master_codes.gs` into `Code.gs` first and could not find `preflightCheck` in the function
dropdown — correctly, because that function is defined in the OTHER script file. No harm done: nothing was
run, and the two files are independent. Resolution: add `setup_master_sheet.gs` as a SECOND script file
(**+ → Script**, do NOT overwrite `Code.gs`), then the dropdown lists `preflightCheck`, `setupEverything`,
`buildSheet_` alongside `onEdit`, `assignMissingCodes`, `auditDuplicateCodes`. **ROADMAP T2.0 now names the
file each function comes from** — the step said "paste setup_master_sheet.gs → run preflightCheck" without
making clear those are one file and `master_codes.gs` is a separate one.
