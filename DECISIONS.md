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
D-152 | ✅ PREFLIGHT RESULT (3 Aug) — safe to run `setupEverything`, one cleanup needed first | Output:
`MASTER: 3 rows, data to col 10, 26 columns allocated` · `ENQUIRIES: 1 rows, data to col 8, 26 columns`.
Reading it against the two destructive risks D-145 was written to catch:
  · **Column-delete risk: GONE.** MASTER data reaches only col 10 (J) — nothing at or beyond col 24, so the
    empty-tail check passes and X:Z delete safely. ENQUIRIES has data only to col 8 of 11, so L:Z (15 columns)
    are provably empty. **Neither tab triggered the "DATA beyond the N headers" warning.**
  · **Formula-flattening risk: GONE.** The preflight scans every data cell with `getFormulas()` and the
    `🔴 FORMULAS present at:` line **did not appear** — so the v1 "YM-2026 code formula" feared in D-145 is
    NOT in this sheet. `master_codes.gs` cannot flatten anything.
  · **Remaining item: MASTER holds 2 legacy data rows** from the 25 Jul v1 build, where the NAME sat in column
    **B**; v2 expects it in **C**. They are KEPT by the script, so they must be inspected and cleared/migrated
    before the codes are trusted. ENQUIRIES has only a header row — nothing to clean.
D-153 | Operator identity: script runs as `sharry00010@gmail.com`, sheet is client-owned — fine now, matters
at handover | The OAuth consent named the app developer as `project1@yalemigration.com.au` while the
authorizing user is `sharry00010@gmail.com`. Correct reading: the spreadsheet (and therefore its
container-bound Apps Script) lives in the **client's** automation Google account, and Sharjeel is an editor
running it under his own login. That satisfies the "build in client-owned accounts" rule (D-07).
⚠️ **BUT Apps Script triggers are owned by the user who creates them.** The 5-minute `assignMissingCodes`
trigger will run as Sharjeel. If his access is removed at handover, **the trigger silently stops and client
codes quietly stop being issued** — a failure with no error message. **HANDOVER TASK (M11): the client
re-creates the time-driven trigger under their own account, then Sharjeel deletes his.** Added to the
handover checklist rather than fixed now.
D-154 | Housekeeping found in the Make + Apps Script screenshots — cosmetic, fix before handover | (a) Seven
leftover **"Integration OneDrive"** scenarios (25–29 Jul discovery runs) still sit in the client's Make org,
all correctly OFF. They cost nothing (inactive scenarios do not count against the Free plan's 2-active limit)
but they are clutter in the client's account — delete before handover. (b) The Apps Script project is named
**"Untitled project"** and one file is saved as **`etup_master_sheet.gs`** (leading `s` lost in the paste).
Neither affects execution — Apps Script resolves functions across files regardless of filename — but both
should be renamed for a professional handover: project → `YM MASTER automation`, file → `setup_master_sheet`.
D-155 | 🐛 SHIPPED BUG — `setupEverything` crashed on the live sheet: validation cleared AFTER the header write |
Real failure 3 Aug, first run: `Exception: The data you entered in cell F1 violates the data validation rules
set on this cell. Please enter one of the following values: Stage, Enquiry, Engaged, Documents, Ready to
Lodge, Lodged, Outcome, Closed.` at `buildSheet_` → the `setValues([headers])` line.
**Root cause (mine):** the 25 Jul v1 build left a **list-restricted dropdown on ROW 1 itself** (cell F1 held
the old "Stage" header WITH its validation attached). My `buildSheet_` wrote the new headers at step 1 and only
cleared stale validation at step 2b — **too late**. Google rejects any `setValues` into a validated cell whose
value is not in the list, so the very first write threw and `setupEverything` aborted.
**What I got wrong conceptually:** D-145 correctly identified that stale v1 validation had to be cleared, but I
assumed it sat only on DATA rows. It was on the HEADER row too — and that is the first thing the script writes.
**Fix:** `clearDataValidations()` over the whole sheet moved to **step 0**, before any write; the duplicate
step-2b call removed. Verified by character position that the clear now precedes the header write, and only one
clear call remains. `node --check` passes.
**No damage:** the exception aborted at the first write, so nothing was modified — Apps Script had not yet
touched headers, dropdowns, formats or columns. The sheet is exactly as it was before the run.
**Lesson: an ordering bug is invisible to syntax checks, spec review and even a line-by-line read that isn't
simulating the target's actual state.** The readiness audit found five real defects in these scripts and still
missed this one, because it reasoned about an empty sheet and a sheet with legacy DATA — not a sheet with
legacy VALIDATION ON THE HEADER ROW. Only running it against the real sheet surfaced it. This is the argument
for the preflight-then-run sequence, and for running on a backed-up sheet first.
D-156 | ✅ The 2 legacy MASTER rows were confirmed FAKE test data | Sharjeel: they were the placeholder client
names set up in an earlier session for testing. Safe to delete, no migration needed. ENQUIRIES had only a
header row. Live v1 header layout observed before the rebuild: `Client Code · Their Client ID · Full Name ·
Party 2 Name · Contact Number · Stage · Assigned Consultant · Data Added · Sources · Notes` (10 columns,
orange header, dropdowns on F and I) — superseded by the 23-column v2 layout.
D-157 | ✅ T2.1 + T2.2 COMPLETE — MASTER and ENQUIRIES built successfully on the live sheet (3 Aug, 02:00) |
`setupEverything` ran clean after the D-155 ordering fix: `Execution started 1:59:57 → Execution completed
2:00:01`, no exception. Verified against the spec from the screenshots:
  · **MASTER — 23 headers A–W** in exact spec order (Client Code → Notes), dark charcoal header row, row 1
    frozen, columns terminate at **W** (so the empty-tail delete of X:Z ran and was safe), dropdown carets
    visible on **G · H · I · J · K · L · M · N · U** = the 9 specified columns.
  · **ENQUIRIES — 11 headers A–K**, dark header, dropdowns on **E Channel · G Location · H Assigned To ·
    I Status** = the 4 specified.
  · **FOLDER INVENTORY untouched** — still `Folder Name · Office · Team · Folder ID · Link` across 26
    allocated columns, exactly as the script promises.
  · Both v1 legacy test rows gone; the old orange v1 header and its F1 dropdown fully replaced.
**The D-155 fix is confirmed working against the real sheet — not just in theory.**
D-158 | ⚠️ TRIGGER SETUP — the dialog defaults are WRONG for our case, and one trap must be avoided |
Sharjeel opened Add Trigger and it defaulted to `onEdit` / `From spreadsheet` / `On open`. Correct values:
**function `assignMissingCodes` · event source `Time-driven` · type `Minutes timer` · `Every 5 minutes` ·
failure notifications `Notify me immediately`.**
🔴 **TRAP — do NOT create a trigger for `onEdit`.** `onEdit` is a **simple** trigger: Apps Script runs it
automatically because of its reserved name, with no registration. Adding an *installable* onEdit trigger on
top makes `assignMissingCodes` fire **twice per edit** — harmless thanks to the D-135 lock (the second run
finds the lock held and returns) but it doubles executions for nothing. **Exactly ONE trigger is needed.**
Failure notification changed from the default "Notify me daily" to **immediately**: a silently dead trigger
means client codes quietly stop being issued (the same silent-failure class as D-153), and daily is too slow
to catch that during a live build.
D-159 | ✅✅ T2 COMPLETE — the client-code engine is LIVE and working (3 Aug) | Verified from screenshots:
  · **Trigger correct on every field**: function `assignMissingCodes` · deployment `Head` · event source
    `Time-driven` · type `Minutes timer` · interval `Every 5 minutes` · failure notifications
    **`Notify me immediately`** (D-158's recommendation applied). Exactly ONE trigger — no installable
    `onEdit` was added, so no double-firing.
  · **End-to-end test PASSED**: `TEST CLIENT ONE` typed into **C2** produced **`YM-2026-00001` in A2**.
    The full chain works: human types → simple onEdit fires → LockService acquired → strict CODE_RE finds no
    existing code → cell-by-cell write → code appears. Every hardening from D-135 and D-145 is exercised by
    this single test and none of it broke the happy path.
**M2 (Master data layer) is now functionally complete** apart from importing their ~48 active tracker rows,
which is scheduled AFTER the demo (D-23 demo-first sequencing).
D-160 | Three T2 tail items still open — small but two of them are client-visible | (a) **Verify `T2` (Date
Added) actually stamped** — the screenshot is cropped at column H so the date column was never seen. The code
writes it in the same loop as the code, so it is near-certain, but "near-certain" is not verified.
(b) **Run `auditDuplicateCodes`** — expect `No duplicate codes ✅`. This is the safety net written in D-135;
running it once now establishes the baseline. (c) 🔴 **DELETE the test row AND its code.** If `YM-2026-00001`
is left consumed, the client's genuinely-first client becomes `YM-2026-00002` — permanent, visible, and
exactly the kind of detail Robinder notices. `nextNumber_` takes max+1 and never reuses, so clearing the cell
is what frees the number.
D-161 | ✅ T2 FULLY CLOSED — all three tail items verified (3 Aug) | (a) `Date Added` (col T) stamped
**`2026-08-02`** in `yyyy-mm-dd` — the date write and the number format both work. (b) `auditDuplicateCodes`
logged **`No duplicate codes ✅`** — the D-135 safety net runs clean and the baseline is established.
(c) Test row deleted; MASTER is empty from row 2 with all 23 headers, dropdown carets on the 9 specified
columns, and `YM-2026-00001` freed for the client's genuinely-first client.
**M2 (Master data layer) is DONE** except the ~48-row tracker import, deliberately scheduled after the demo.
D-162 | 🔴 TIMEZONE MISMATCH FOUND — will corrupt s56 deadline maths if not fixed before M5/M9 | The code was
written at ~02:00 on **3 Aug** (per the Apps Script execution log) but `new Date()` stamped **2026-08-02**.
That is a full calendar day out, and the cause is that the **Apps Script project timezone is not
Australia/Brisbane** — it defaults to the creator's locale (Sharjeel is UTC+05:00; Brisbane is UTC+10:00), so
02:00 Brisbane is still the previous day where the script thinks it lives.
**Harmless for `Date Added`. NOT harmless for anything that computes a deadline.** D-33 requires
`due = letter_date + 1 day + parsed days`, and D-58 sets the s56 ladder at 7/14/21/26 days with a **legal
28-day** limit. A one-day error on a statutory deadline is the single worst failure this system could produce
— it is exactly the risk the client is paying us to remove.
**FIX (2 minutes, do before T3):**
  1. Apps Script → ⚙️ **Project Settings** → **Time zone** → `(GMT+10:00) Brisbane` → Save
  2. Google Sheet → **File → Settings** → **Time zone** → `(GMT+10:00) Brisbane` → Save & refresh
  3. Make scenarios also run on the ORGANISATION timezone — check Make → Organization settings and set
     Brisbane there too, so scheduling and any date formulas agree with the sheet.
Then re-test: type a name, confirm `Date Added` shows the correct Brisbane date.
**All three clocks (Apps Script · Sheet · Make) must read Australia/Brisbane. Verify at M5/M9 build time too.**
D-163 | ✅ TIMEZONE FIXED AND PROVEN — all three clocks now Australia/Brisbane (3 Aug) | Verified from
screenshots: **Apps Script** Project Settings = `(GMT+10:00) Australian Eastern Standard Time – Brisbane` ·
**Make** Organization settings = `(GMT+10:00) Australia/Brisbane` with Country `Australia` (changed FROM
Australia/Sydney) · **Google Sheet** File→Settings = Locale `Australia`, Time zone `(GMT+10:00) Eastern
Time – Brisbane`.
**Proof it worked:** the re-test stamped `Date Added` = **`2026-08-03`** — the correct Brisbane date. The
earlier run stamped 2026-08-02 for the same real-world moment. The one-day error is eliminated at source.
**Why Brisbane and not Sydney (the trap that was live):** Queensland does NOT observe daylight saving, so
Brisbane is GMT+10:00 year-round; Sydney/Melbourne shift to GMT+11:00 from October to April. Make had
defaulted to **Australia/Sydney**, which would have run an hour ahead of the sheet for six months of every
year — enough to move an s56 deadline across a date boundary. Caught before any deadline logic was built.
**Standing rule: Apps Script · Google Sheet · Make must all read Australia/Brisbane. Re-verify at M5 and M9
build time, and never accept Sydney as "close enough".**
D-164 | Make org region is EU + org still named "My Organization" — handover items, not blockers | The Make
organization's **Region is `EU`** (greyed out, fixed at signup), so Australian client data is processed on EU
servers. Not a compliance failure and not changeable without recreating the org — but Robinder should be told
where his data physically lives, at handover. Also the org is still called **"My Organization"** — rename to
`Yale Migration` so the client's own account reads professionally. Both added to M11.
D-165 | 🔴 M3 REDESIGNED BEFORE BUILD — the Router approach was wrong for Make | Caught by re-reading the spec
before issuing build steps rather than trusting it. **In Make, a Router splits flow into routes that never
reconverge.** The v2 spec put a Router at Module 2 to pick the parent folder, which would have forced Modules
3–6 (create folder · iterator · sub-folders · write-back · error handling) to be **duplicated on all four
routes — 16 modules**, with every future fix applied four times and four times the chance of drift.
**v3 is linear, 7 modules:** Search Rows → **Set multiple variables** (`parentId` via `switch()` on
Office+Team, `subfolders` via nested `if(contains(...))` on Visa Type) → **filter "parentId is not empty"** →
create folder → iterator → sub-folders → write link back. One place to edit each mapping.
Two details that matter: (a) the Visa Type test wraps both the list and the value in commas
(`",482,407,…," contains "," & VisaType & ","`) so `300` cannot match inside another value; (b) the default
branch is SET 1 STANDARD, correct for every remaining type including `Other`.
**The filter replaces the Router's Fallback and is the real safety gate:** Townsville, Philippines and
blank-Office rows produce an empty `parentId` and stop dead. The unmapped-branch risk (D-136) is now
structurally impossible to trigger rather than merely documented.
D-166 | ⚠️ The demo needs FOUR fields typed, not one — fix the demo script now | The M3 trigger filters on
Client Code present + Folder URL empty, but Module 2 resolves `parentId` from **Office + Team** and
`subfolders` from **Visa Type**. A row with only a Full Name yields an empty `parentId` and correctly stops at
the filter. So the demo capture line "type a name → folder appears" is **not accurate**: the operator types
**Full Name · Office · Team · Visa Type** (4 fields, ~10 seconds). Still a strong demo — code auto-appears
from the name alone, then the folder tree builds itself — but the script must show what is actually typed.
Do not record a demo that implies less input than the system needs; the client will try it and it will fail.
D-167 | Make↔Google Sheets connection: authorize as **`project1@`**, not `sharry00010@` | Both work today —
Sharjeel has edit rights on the sheet, so his own account would connect fine. Choosing project1@ for three
reasons:
  1. **Handover durability.** A Make connection is bound to the account that authorized it. Authorized as
     Sharjeel, the scenario **breaks silently** the moment his access is removed at handover — the same
     silent-failure class as the Apps Script trigger (D-153). Authorized as project1@ (client-owned), it
     survives. We already carry one handover re-auth task; do not create a second.
  2. **D-07** — everything is built in client-owned accounts.
  3. **OAuth survives password rotation.** We have recommended the client rotate project1@'s password and add
     2FA. A rotation does NOT invalidate an existing OAuth grant — only explicitly revoking the app's access
     does. So project1@ is safe even after they harden it.
Sharjeel holds the project1@ password (ACCESS.md #9), so this needs no client involvement.
**Noted mixed-ownership, deliberately accepted:** the Apps Script still runs as `sharry00010@` (D-153) and the
OneDrive connection is also his (D-31, accepted because `Files.ReadWrite.All` on a consumer account covers the
shared folder). Those two remain handover tasks in M11. The Sheets connection does not need to join them.
**Naming:** `YM Sheets — project1` (convention `YM <service> — <account>`, D-140).
D-168 | 🔴 OPEN QUESTION SURFACED — who actually OWNS the MASTER DATABASE sheet? | Sharjeel's Module-1
screenshot shows the Google Sheets connection as **"Muhammad's Google connection"** (= `sharry00010@`), with
Search Method **"Select from My Drive"** — and the spreadsheet **was found**. That is ambiguous evidence:
Make lists files the account can *access*, not only files it owns, so this does not prove ownership either way.
**Why it matters more than the connection question (D-167):** if the sheet is owned by `sharry00010@`, then
the client's entire client database lives in **our personal Google account**, which breaks D-07 ("everything
in client-owned accounts") and would need an ownership TRANSFER at handover — a much bigger item than
re-authorizing a connection. Contradicting signals on file: `ACCESS.md` #1 says the MASTER DATABASE lives in
the "automation Google account" supplied by the client, and the Apps Script consent screen named the app
developer as `project1@yalemigration.com.au` (container-bound scripts inherit the spreadsheet's owner) —
both point to project1@. Unverified.
**RESOLVE IT IN 30 SECONDS:** open the sheet → **Share** → read the Owner line. Then:
  · Owner = `project1@` (or another client account) → ✅ correct already; only the Make connection account is
    in question, and switching it is a 2-click change on the module.
  · Owner = `sharry00010@` → 🔴 transfer ownership to the client account BEFORE go-live, and note it as a
    handover blocker, not a nicety.
**Do NOT block T3 on this.** The existing connection works and the dry run is a test; swapping the connection
later costs two clicks. Verify ownership in parallel.
D-169 | Two corrections to my own Module-1 instructions | (a) I wrote Search Method = **"Select a
Spreadsheet"** — that option does not exist. Make's real options are **"Select from My Drive"** / "Enter
manually" / "Search by path". Sharjeel picked the right one despite the wrong label. (b) I specified Column
range **A–W**; Make offers only preset ranges (A-Z, A-AZ, … A-ZZZ) with **no A-W**. **A-ZZZ is acceptable** —
with "Table contains headers = Yes" Make maps by header NAME, so the extra empty columns simply produce empty
fields. `A-Z` is tidier but not worth redoing. Neither error affects behaviour; both are logged because
G1 requires UI paths to be verified, and these were written from assumption.
D-170 | 🐛 SPEC BUG CAUGHT BY THE DRY RUN — Make's Sheets field names carry the column letter | Real Run-once
output (3 Aug) shows every field named **`Header (ColumnLetter)`**: `Client Code (A)`, `Full Name (C)`,
`Visa Type (H)`, `Office (J)`, `Team (K)`, plus a bare `Row number`. The M3 spec used `1.Office`,
`1.Visa Type`, `1.Client Code` and `{{1.__ROW_NUMBER__}}` — **none of those resolve.** Consequences had we
built it: `parentId` would always be empty (every row stopping at the Module-2b filter, so nothing created),
`subfolders` would always fall through to SET 1 STANDARD even for 482/partner matters, and Module 5 could not
find the row to write back to. Names contain a space and brackets so they **must be backtick-wrapped**:
`` {{1.`Office (J)`}} ``. Spec corrected with a verified reference table.
**Also verified from the same run:** ⚠️ **columns U, V and W are ABSENT from the output bundle** — Make trims
trailing empty columns. Harmless here: the filter `V notexist` is evaluated server-side and still works
(proven — it matched the row), we never need to READ Folder URL, and Module 5 writes to V by column. But
`{{1.Folder URL (V)}}` must never be mapped; it does not exist.
**Spreadsheet ID recorded:** `1ZE1OoTjgO5UyZI4dDxfGoGLy5ojHQibqHpMb3RTQc6k`.
D-171 | ✅ MODULE 1 VERIFIED — filter and idempotency both proven | Run A (with a coded row present) returned
**1 bundle**: `Client Code (A) = YM-2026-00001`, `Full Name (C) = TZ TEST`, `Date Added (T) = 2026-08-03`,
`Row number = 2`. Run B (row deleted) returned **0 bundles**. That pair proves: (a) the filter
`A exist AND V notexist` selects exactly the rows we want; (b) **idempotency works** — once Folder URL is
populated a row can never be picked up again (D-14 safety); (c) the Brisbane timezone fix holds
(`Date Added = 2026-08-03`); (d) cost is 1 operation per poll regardless of result.
⚠️ **NOT yet proven: the routing fields.** `Visa Type (H)`, `Office (J)` and `Team (K)` were all EMPTY in
Run A because TZ TEST had only a name. Module 2's switch cannot be validated until a row carries those three
values — that is the next test row.
D-172 | ✅ MODULE 1 FULLY VERIFIED — routing fields confirmed with exact casing (3 Aug) | Third run returned
`Visa Type (H) = 485` · `Office (J) = BRISBANE` · `Team (K) = FILIPINO` · `Client Code (A) = YM-2026-00001` ·
`Full Name (C) = TEST DEMO ONE` · `Row number = 2`. **Casing matches the switch key exactly** — the sheet
returns UPPERCASE from the dropdowns, so `"BRISBANE|FILIPINO"` will match. No trailing whitespace observed.
Confirms the dropdowns (`setAllowInvalid(false)`) are doing their real job: they guarantee the routing key can
only ever be one of the values the formula knows about. **That is why the Visa Type dropdown had to include
`SBS`/`Nomination` (D-138) — an unlisted value would be unroutable AND unenterable.**
Module 1 status: DONE. 3 runs, 3 credits, filter + idempotency + field names + casing all proven.
D-173 | Module 2 built as ONE "Set multiple variables" module — two variables, no Router (confirms D-165) |
`parentId` via `switch()` on the concatenated `Office|Team` key (2 known routes + empty default), and
`subfolders` via nested `if(contains(...))` on Visa Type with SET 1 as the default. Comma-wrapping both sides
of the membership test (`","& value &","` against `",482,407,..,"`) prevents substring collisions — without it
`300` would match inside a hypothetical `1300`, and `82` inside `820/801`. Empty `parentId` is the deliberate
safety signal consumed by the Module-2b filter (D-136): unmapped offices stop dead rather than misfile.
D-174 | 🐛 MY FORMULA FORMAT WAS WRONG — `{{ }}` must wrap the WHOLE expression, not each field | Module 2's
first run output the formula as literal text with empty gaps where the field references should have been:
`switch( & "|" & ; "BRISBANE|FILIPINO"; …)`. Two faults, both mine:
  1. **Inner braces.** I wrote `switch({{2.`Office (J)`}} & …)`. In Make a mapping is either a plain
     `{{field}}` OR a function expression wrapped ONCE: `` {{switch(2.`Office (J)` & …)}} ``. Nesting `{{ }}`
     inside a function call makes Make strip the inner braces and keep the remainder as **plain text** — the
     expression is never evaluated.
  2. **Module number.** Earlier formulas said `1.` and Make errored `[ID 3] references non-existing module
     [module ID 1]`. Confirmed from the canvas badge: **Search Rows is module `2`**. Make does not
     necessarily number from 1 — always read the badge.
**Detection signal to remember:** if a Set-variable module's OUTPUT shows the formula source rather than a
result, the expression was treated as text — check the `{{ }}` placement first, before suspecting the logic.
Cost: 2 wasted operations and one build cycle. Spec corrected with the rule stated explicitly so the next
module (and M5/M9 later) does not repeat it.
D-175 | 🐛 `&` IS NOT A STRING-CONCATENATION OPERATOR IN MAKE — both Module-2 formulas failed silently |
Run 2 of the Set-variables module: `parentId = empty`, `subfolders = SET 1 STANDARD`. That looks like a
partial success. It is not — **both formulas failed identically and each returned its DEFAULT branch.**
`switch()`'s default is `""` → empty parentId. The nested `if(contains(…))` default is SET 1 → which happens
to be the correct answer for visa type 485, so it *looked* right. **Feed it a 482 and it would still have
returned SET 1** — wrong folders, silently, in the client's live drive.
Root cause: every failing expression used `&` to join strings (`2.\`Office (J)\` & "|" & 2.\`Team (K)\``, and
`"," & 2.\`Visa Type (H)\` & ","`). Make does not evaluate `&` as concatenation, so the comparison and the
`contains()` test both received malformed input and fell through.
**FIX — remove concatenation entirely rather than guess the correct operator:**
  · `parentId` → nested `if()` comparing the two fields **separately**, no joining of Office and Team.
  · `subfolders` → `contains("482,407,SBS,Nomination"; 2.\`Visa Type (H)\`)` with **no comma-wrapping**.
    Safe for THIS value set: no dropdown value is a substring of another list entry (checked all 23).
    An **empty-Visa-Type guard is added first**, because `contains(list; "")` returns TRUE and would have
    misrouted blank rows to SET 2.
**LESSON — the dangerous shape of this bug:** a formula that falls through to its default produces a
plausible-looking value, not an error. **Never accept a default-branch result as proof a formula works.**
Validation must use an input that forces a NON-default branch — which is why the 482 and 820/801 test rows in
the ship ladder are mandatory, not optional.
D-176 | 🔴🔴 ROOT CAUSE FOUND — in Make, typed field references DO NOT BIND. Click them, always | Controlled
one-credit diagnostic, 3 Aug, same module and same run:
  · `testOffice` built by **CLICKING** `Office (J)` in the panel → renders `2. Office (J)` → resolves **BRISBANE** ✅
  · every reference in my formulas, **TYPED** as `` 2.`Office (J)` `` → renders `` 2.`Office (J)` `` → resolves **empty** ❌
**Both display as green chips.** A typed reference is visually almost identical to a working one — the only
tell is the retained **backticks**. Make raises no error; the dead reference simply evaluates to `""`.
This single fault explains every Module-2 failure and cost ~6 credits and three build cycles:
  · `Office` → `""` so `= "BRISBANE"` was false → `parentId` empty
  · `Visa Type` → `""` so my empty-guard fired → `subfolders` returned SET 1 — the RIGHT answer for 485, by
    coincidence, which masked the bug for a full cycle (D-175).
**RULE, now at the top of the M3 spec and applying to M4/M5/M6/M9:** type only literal text — functions,
quotes, semicolons, brackets — and **insert every field by clicking it in the right-hand panel.** Pre-save
check: every green chip must read `2. Field Name (X)` with **no backticks**.
**Process note:** I wrote Make formula syntax from memory across three attempts instead of verifying it. The
one-credit diagnostic that finally isolated it should have been the FIRST move after the first empty result,
not the fourth. G1 says verify before instructing; the corollary is **diagnose before re-guessing** — when a
fix fails once, stop fixing and start isolating.
D-177 | 🎉 FIRST REAL ARTIFACT CREATED — folder written to the client's live OneDrive (3 Aug, 17:33Z) |
`POST /v1.0/drives/A0BABA3C2640082C/items/…!sbc920268…/children` returned **201** and created
`YM-2026-00001 – TEST DEMO ONE`. **The returned `path` is the proof that matters:**
`/YALE MIGRATION - ONE SYSTEM/BRISBANE OFFICE/CLIENT FILES/ENGAGED CLIENTS/CLIENT FILES- FILIPINO TEAM`
— confirming the parent itemId carried since T1.3 really is the Filipino team folder. Placement verified
against live data, not against our notes.
Captured from the response: new folder id `A0BABA3C2640082C!se00524ce73c1435cb023d73de27c65ab` ·
`webUrl` pattern `https://onedrive.live.com?cid=<driveId>&id=<itemId>` (this is what Module 5 writes to
column V) · `folder.childCount = 0` · `driveType = personal` (re-confirms CR-003) · created-by
`sharry00010@gmail.com` (re-confirms the OneDrive connection is ours — M11 handover item, D-31).
**Method that finally worked, after eight failed formula attempts: a fully literal JSON body with no field
references at all.** Sequence proven: Sheets trigger → OneDrive API call → folder in the right branch.
D-178 | 🔴 CLEANUP DEBT — a test folder now exists in the client's LIVE OneDrive | `YM-2026-00001 – TEST DEMO
ONE` sits in the Filipino team folder alongside 738 real client folders. **Must be deleted before the client
ever browses that folder**, and definitely before the T4 demo recording:
`DELETE /v1.0/drives/A0BABA3C2640082C/items/A0BABA3C2640082C!se00524ce73c1435cb023d73de27c65ab`
Also note `conflictBehavior: "fail"` means re-running with the same hardcoded name will now ERROR (409) —
which is the safety working as designed (D-12: never silently duplicate or rename), but it means the next
test needs either a dynamic name or the folder deleted first.
D-179 | 🔑 MAKE'S REAL FIELD SYNTAX FOUND — ZERO-BASED NUMERIC INDEX, not name or column letter | The user's
raw Body text finally exposed it: `{{2.`0`}}` = Client Code (A), `{{2.`2`}}` = Full Name (C). Make's Google
Sheets module keys its output by **zero-based column position wrapped in backticks** — so every reference I
wrote across eight attempts was wrong: `` `Office (J)` `` (header name) ❌, `2.J` (column letter) ❌,
`` 2.`9` `` ✅. Index map for MASTER: Client Code **0** · Their Client ID 1 · Full Name **2** · Party 2 Name 3 ·
Contact 4 · Email 5 · Location 6 · Visa Type **7** · Visa Variant 8 · Office **9** · Team **10** ·
Consultant 11 · Stage **12** · Outcome 13 · Grant 14 · Expiry 15 · Refusal 16 · Last Contact 17 ·
Next Follow-up 18 · Date Added 19 · Source 20 · **Folder URL 21** · Notes 22.
**This makes formulas paste-able again** — the Tools module can now be written as
`` {{if(2.`9` = "BRISBANE"; …)}} `` and copied in, no clicking required. Retry the Set-variables module with
numeric indices when routing is added back.
*Root cause of the whole episode: I never obtained ground truth for the reference syntax and guessed three
different formats instead. The user's own paste of the raw field settled it in one message.*
D-180 | ✅ SECOND 201 — dynamic name confirmed working | `YM-2026-00001 – TEST DEMO TWO` created at
`…/CLIENT FILES- FILIPINO TEAM`, id `A0BABA3C2640082C!s87e7ae6d69a640bb87bf0e09d5291e8a`, 17:45:03Z. The
resolved request Body shows real values, so the two chips read live from the sheet. Trailing-space defect
caught in review before the run (would have produced a folder name ending in a space — OneDrive trims or
rejects those, and our sanitizer rule forbids them).
🔴 **CLEANUP DEBT NOW TWO FOLDERS** in the client's live Filipino team folder:
  · `…!se00524ce73c1435cb023d73de27c65ab` — TEST DEMO ONE
  · `…!s87e7ae6d69a640bb87bf0e09d5291e8a` — TEST DEMO TWO
`DELETE /v1.0/drives/A0BABA3C2640082C/items/<id>` for each, before the T4 demo recording.
D-181 | ⚠️ UNVERIFIED — which scenario the last run executed in | The run output header read **"New scenario"**
with only a OneDrive module visible, not `YM-M3-folder-create` with Sheets + OneDrive. Two readings: (a) UI
label artefact and the real scenario is intact, or (b) the module was rebuilt in a stray scenario, in which
case the Sheets trigger is not connected and the "dynamic" name may actually be hardcoded text that merely
looks resolved. **Do not build further modules until this is confirmed** — attaching sub-folder logic to the
wrong scenario wastes the work. Check: scenario name top-left, and whether the Body still shows two GREEN
chips rather than plain text.
D-182 | 🎉🎉 T3 CORE WORKING — full client folder + all 6 sub-folders created automatically (3 Aug 19:20Z) |
End-to-end run, scenario `YM-M3-folder-create`: Google Sheets (2) → OneDrive (12) → Iterator (13) →
OneDrive (14). Result: `YM-2026-00001 – TEST DEMO FIVE` created at
`…/CLIENT FILES- FILIPINO TEAM/`, then **6 sub-folders all returning 201**: `01 Identity & Personal` ·
`02 Education & Employment` · `03 Financial` · `04 Dependents & Relationship` · `05 Forms & Lodgement` ·
`06 Correspondence & Outcome` — the exact SET 1 STANDARD structure the client approved on 2 Aug (D-126).
**Cost: 9 operations per client** (1 trigger + 1 folder + 1 iterator + 6 sub-folders) — matches the ≈9
estimate in the spec (D-140). At 1,000 ops/month free that is ~110 clients; the paid plan is still required
at go-live for the other modules (D-15).
Working reference forms now PROVEN in production: `` {{2.`0`}} `` Sheets column by zero-based index ·
`{{13.value}}` iterator value · `{{12.Body.id}}` parent folder id (resolved correctly once inserted by
clicking, visible in module 14's URL as `A0BABA3C2640082C!s1674b4ae…`).
**M3 is functionally proven. Remaining for T3: write the folder URL back to column V (this is what makes the
scenario idempotent), error handling, then delete the five test folders.**
D-183 | 🔴 CLEANUP DEBT — FIVE test folders now in the client's live OneDrive | All in
`CLIENT FILES- FILIPINO TEAM` alongside 738 real client folders. TEST DEMO FIVE also contains 6 sub-folders.
`DELETE /v1.0/drives/A0BABA3C2640082C/items/<id>` — deleting a parent removes its children:
  · TEST DEMO ONE   `!se00524ce73c1435cb023d73de27c65ab`
  · TEST DEMO TWO   `!s87e7ae6d69a640bb87bf0e09d5291e8a`
  · TEST DEMO THREE / FOUR — ids not captured; find via
    `GET /v1.0/drives/A0BABA3C2640082C/items/!sbc920268db9044bdb12dd6072bf26d0f/children?$select=name,id`
  · TEST DEMO FIVE  `!s1674b4aed2cc4b5a9af5e111ccc97292`
**Must all be gone before the T4 demo recording** — a demo video showing five stray TEST folders in their
production drive would undo the credibility the demo is meant to build.
D-184 | ✅ SUB-FOLDER CHAIN RE-CONFIRMED on a second full run (3 Aug 19:37Z) | `YM-2026-00001 – TEST DEMO SIX`
created, then all 6 sub-folders 201 inside it. Reference `{{12.Body.id}}` resolved correctly in module 14's
URL (`…!s638f25b9f63645ce8b3f78ae874b73c9`). The create-and-populate half of M3 is reliable and repeatable —
two consecutive clean runs.
D-185 | 🔴 WRITE-BACK MODULE (15) IS BROKEN IN TWO WAYS — must be fixed before any schedule | Run output:
  1. **`Values in columns: empty`** — the `Folder URL (V)` mapping did NOT bind. `{{12.Body.webUrl}}` was
     pasted and rendered as a chip but resolved to nothing at runtime (the same dead-typed-reference class as
     D-176). **The Folder URL was never written, so the row is still eligible for the trigger — idempotency
     is NOT yet achieved.** On a 15-minute schedule this row would be reprocessed ~96×/day, each attempt
     erroring at 409 once the folder exists.
  2. **Module 15 executed 6 TIMES** (6 operations, 6 credits) because it sits DOWNSTREAM of the Iterator and
     inherits its 6 bundles. Every one reported `Updated range: MASTER!A2`. Correct behaviour is ONE update
     per client row.
  🔴 **POSSIBLE DATA LOSS TO VERIFY IMMEDIATELY:** the module reports updating `MASTER!A2` — the **Client
  Code** cell — with an empty value set. If A2 was cleared, `YM-2026-00001` is gone and `assignMissingCodes`
  will issue a NEW code on its next 5-minute tick, orphaning the folder that was already named with the old
  one. **Check A2 before doing anything else.**
D-186 | FIX for the 6× execution: Array aggregator between the Iterator and the write-back | In Make,
everything downstream of an Iterator runs once per bundle. The standard pattern to collapse back to a single
bundle is **Flow Control → Array aggregator**, with Source Module = the Iterator. Insert it between
OneDrive (14) and Google Sheets (15); module 15 then fires exactly once per client.
Cost effect: per-client operations drop from 14 to **9** (1 trigger + 1 folder + 1 iterator + 6 sub-folders +
1 aggregator + 1 update = 10, still within the ≈9–10 estimate of D-140). Without it, every client costs 5
wasted Sheets operations — at 60–70 enquiries/week that alone is ~1,400 wasted ops/month, more than the entire
free tier (D-22).
D-187 | 🎉🎉🎉 T3 COMPLETE — `YM-M3-folder-create` works end to end (3 Aug 19:54Z) | Six modules, one clean run:
`Google Sheets 2 (Search Rows) → OneDrive 12 (create client folder) → Iterator 13 → OneDrive 14 (6 sub-folders)
→ Array aggregator 19 → Google Sheets 15 (Update a Row)`.
Verified from the run output:
  · Client folder `YM-2026-00001 – TEST DEMO SEVEN` created at `…/CLIENT FILES- FILIPINO TEAM/` — 201
  · All **6 sub-folders 201** inside it (SET 1 STANDARD, client-approved D-126)
  · **Array aggregator fixed the 6× write-back** — Sheets 15 now runs **1 operation**, not 6 (D-186 resolved)
  · **`Folder URL (V)` WROTE SUCCESSFULLY**: `https://onedrive.live.com?cid=A0BABA3C2640082C&id=…!s7a4618da…`
    — the mapping bound only when **clicked**, never when pasted (fourth confirmation of D-176)
  · `Updated range MASTER!A2:V2` · **`Updated cells: 1`** — proof only column V was written and no other
    client data was touched. This was the destructive risk flagged in D-185; it is now disproven.
**Actual cost: 11 operations per client** (1 trigger + 1 folder + 1 iterator + 6 sub-folders + 1 aggregator +
1 update) — higher than the ≈9 estimate (D-140). At 1,000 free ops/month that is ~90 clients; at their real
volume (60–70 enquiries/week) the paid plan is confirmed necessary at go-live (D-15). **Spec cost figure
corrected from ≈9 to 11.**
**M3 is functionally COMPLETE. Remaining before T4: (1) idempotency re-run must return 0 bundles;
(2) delete the seven test folders; (3) error handlers on the two OneDrive modules.**
D-188 | ✅ `12. body: webUrl` chip CONFIRMED CORRECT — do not touch | Sharjeel queried whether the existing
chip needed replacing. It does not. The clicked form renders **`12. body: webUrl`** (lowercase `body`, colon
separator); the dead pasted form rendered `12.Body.webUrl` (capital B, dot separator). His run wrote the real
URL to column V and reported `Updated cells: 1`, so the chip is bound and working. **Visual tell for the
future: a live OneDrive chip uses `module. body: field`; a dead pasted one uses `module.Body.field`.**
D-189 | 🔴🔴 CRITICAL AUDIT FINDING — the built scenario is DEMO-READY but NOT PRODUCTION-READY | The routing
layer was abandoned when the Set-variables formulas failed (D-174/D-175/D-176), and **the values it was meant
to compute are now HARDCODED**:
  · **OneDrive 12 URL** is hardcoded to `…!sbc920268db9044bdb12dd6072bf26d0f` = the **FILIPINO team folder**.
    Every client goes there **regardless of Office or Team**. An INDIAN-team client would be misfiled into the
    Filipino team's folder, in live data, silently.
  · **Iterator 13 array** is hardcoded to the **SET 1 STANDARD** six-folder list. Every client gets those
    folders **regardless of Visa Type**. A 482/407 matter would NOT get the step-based structure the client
    specifically asked for (D-126), and an 820/801 partner matter would not get Applicant/Sponsor/Relationship
    with the 820/801 sub-folders.
**This is safe for the T4 demo** — the demo row is BRISBANE + FILIPINO + 485, which is exactly what the
hardcoded values produce. **It is NOT safe to schedule or to run on real clients.**
**REQUIRED BEFORE GO-LIVE — restore routing.** Two viable approaches, decide after the demo:
  (a) **Retry Set-variables with CLICKED chips inside the formula.** Never actually attempted — every failed
      attempt used typed references. Formulas themselves parse correctly (the `if(`/`contains(` tokens
      rendered), and clicked chips are proven to bind (D-176). Cheapest if it works: 2 variables, 5 chips.
  (b) **Router with dropdown filter conditions** — no formula syntax at all, conditions built in Make's filter
      UI. Costs duplicated downstream modules per route (D-165's original objection), but carries zero syntax
      risk. Fall back to this if (a) fails once.
**Do not enable the 15-minute schedule until routing is restored.** Currently the only protection is that the
scenario is switched OFF.
D-190 | 🔴 PRODUCTION-READINESS AUDIT — 5 blockers, 4 high-severity gaps. Full report: `PRODUCTION-READINESS.md`
Audited the built scenario as an unattended system against 1,436 live client folders. **Verdict: demo-ready,
NOT production-ready.** Two findings were not previously known:
  **B2 — NAME SANITIZATION WAS SPECIFIED BUT NEVER BUILT.** Module 12's body is raw string interpolation:
  `{"name":"<code> – <Full Name>"}`. A Full Name containing `"` produces **invalid JSON** (400); `\` breaks
  escaping; `/ \ : * ? < > |` are rejected by OneDrive. Across 1,436 clients with demonstrably messy data
  (D-47), a name like `MARIA/JOSE` is entirely plausible. The sanitizer is in ARCHITECTURE and D-18 and was
  simply never implemented — a spec-to-build gap, the same class as D-147.
  **B5 — POLLING ALONE EXCEEDS THE FREE PLAN.** A 15-minute schedule is **96 executions/day ≈ 2,880 ops/month
  before any client is processed**, against a 1,000/month allowance. The scenario would die mid-month,
  silently. **This upgrades the Make Core plan from "recommended at go-live" (D-15) to a hard prerequisite**,
  and gives us a concrete number to put to the client. Mitigations: business-hours-only schedule
  (≈1,056 polls/month) and/or 30-minute polling.
  **B4 — partial failure creates a permanently stuck row.** If sub-folder 3 of 6 fails, the run aborts before
  the write-back; `Folder URL` stays empty; the trigger re-picks the row; OneDrive 12 now returns 409 because
  the client folder already exists; abort again — **forever, with no alert.** This is the most dangerous
  failure mode in the current build because it is silent and self-perpetuating.
Also confirmed genuinely production-grade: `conflictBehavior: "fail"` (cannot overwrite a real client folder),
write-back touching exactly 1 cell, timezone correctness, LockService on the code engine, and placement
verified against live data rather than notes.
**Remediation order fixed: idempotency proof → delete test folders → RECORD DEMO → error handling →
sanitization → routing → full-matrix testing → paid plan → re-authorize connections.**
D-191 | STRATEGY DECIDED — Demo first, then harden M3 into the REFERENCE IMPLEMENTATION, then M4+ | Sharjeel
asked whether to perfect everything before moving on. Three options were weighed:
  (a) **Perfect M3 fully, then M4** — bulletproof module, but the client sees nothing for another half-day
      while 8 modules remain unbuilt.
  (b) **Build all modules roughly, harden at the end** — compounds the same defect in eight places and
      establishes no standard. Rejected outright.
  (c) ✅ **CHOSEN: demo first (~30 min), then harden M3 as the reference implementation (~2.5h), then M4+.**
**The strategic insight that decides it: the five M3 blockers are NOT M3-specific — they are PATTERNS every
module needs.** Error handling, sanitization, idempotency proof, routing, ops budgeting — M4, M5, M6 and M9
each require all five. Fixing them once, properly, on M3 converts "2.5 hours of fixing" into "building the
standard for the whole system." M3 becomes the shape every later module copies.
**Demo goes first because:** the client has paid 50% and seen ZERO working output; he has asked for something
to show his other branches (CR-007); the demo path is precisely the one that already works; and it costs 30
minutes. If he asks "can we turn it on now?", the honest answer — *"one safety pass first, about half a day"* —
is a good answer, not a defensive one.
D-192 | `DEFINITION-OF-DONE.md` created — 12-point gate every scenario must pass before being switched on |
Written because M3 ran successfully **four times** and still had five production blockers. **Working ≠
production-ready**, and nothing in the process previously encoded that distinction. The checklist captures
every expensive lesson from the M3 build so M4–M9 do not repeat them: click-never-type mappings · a
default-branch result is not proof · verify `Updated cells` · sanitize before JSON/URL/filename · error
handler on every external call · trace partial-failure state · test every branch with a forcing input ·
**measure** ops cost including polling · client-owned connections · scenario stays OFF until all pass.
Referenced from `CLAUDE.md` so it loads every session.
D-193 | 🔴 OneDrive 12 Body mapping LOST ITS BINDING — and it proves blocker B2 is real | Run 4 Aug: the
resolved body was `{"name":" – ", …}` — **both chips (`Client Code`, `Full Name`) resolved to EMPTY**, leaving
only the separator. OneDrive rejected it: *"The name field included leading or trailing spaces."*
The Sheets module still returned 1 bundle with data, so the row is fine; **the mapping in module 12 is what
broke.** Cause not yet established — candidates: the module was re-edited, or a change elsewhere (e.g.
switching module 15's "Use column headers as IDs" to Yes) re-keyed the Sheets output so index `0`/`2` no
longer resolve.
**This is B2 (missing sanitization) demonstrating itself.** With no trim/validation, an empty or
whitespace-only name produces a malformed folder name and a hard failure. A real client row with a blank
Full Name would do exactly the same thing in production. **B2 moves from "theoretical" to "observed".**
Also worth noting: with no error handler (B3), this single bad row **aborted the entire run** — rows 2–5 of
any batch would never have processed. B3 observed too.
D-194 | Idempotency test (T3.1) NOT yet run — the input was changed | Sharjeel entered `TEST DEMO Eight` into
C2, which left `Folder URL` empty, so the trigger correctly picked the row up. **1 bundle was the right answer
to that input, not a failure.** The test requires the row to be left EXACTLY as the previous successful run
left it — V2 populated — and then re-run. Restating the test so it is unambiguous:
  1. Ensure row 2 has `Folder URL (V)` FILLED (from a successful run)
  2. Change NOTHING
  3. Run once → **expect `Total number of bundles: 0`**
D-195 | ✅✅✅ M3 WORKING END-TO-END WITH LIVE SHEET DATA (4 Aug 19:38Z) | Full chain verified from a single run:
`Sheets 2` returned `Client Code (A)=YM-2026-00001 · Full Name (C)=DEMO CLIENTS · Visa Type=485 ·
Office=BRISBANE · Team=FILIPINO · Row number=2` → `OneDrive 12` posted
`{"name":"YM-2026-00001-DEMO CLIENTS"}` and got **201** → `Iterator 13` split 6 → `OneDrive 14` created **all
six sub-folders, every one 201**. Folder confirmed in the live drive with the six children.
**ROOT CAUSE OF THE ~8-HOUR OUTAGE, finally established:** the trigger row simply had no data / had a stale
`Folder URL` for most of that period, so Search Rows either returned 0 bundles or an empty row — and with no
sanitization (B2) an empty row produced a folder literally named `-`. **The mappings, the chips, the module
order and the connections were never broken.** Every "fix" applied to chips, operators, `{{ }}` placement and
module order was chasing a symptom.
**PROCESS LESSON — the expensive one:** I asked for the trigger module's OUTPUT panel six times and worked
from config screenshots instead when it did not arrive. That one panel resolved the whole thing in one
message. **Rule: when a downstream module receives wrong data, the FIRST artefact to obtain is the upstream
module's OUTPUT — not its configuration, not the canvas, not the logs.** Nothing else is diagnostic.
D-196 | Cosmetic: separator is `-` not ` – ` (space en-dash space) | Created name is
`YM-2026-00001-DEMO CLIENTS`; the client-approved convention (D-18) is `YM-2026-##### – FULL NAME`. Purely
the literal text between the two chips in module 12's Body. Fix before the demo recording — the folder name
is visible in the video and the convention was approved by the client.

D-197 | ⭐ TRUE ROOT CAUSE OF THE `" – "` / `-` FOLDER BUG — the Search Rows filter matched BLANK rows
(5 Aug, established from the saved blueprint + a run with an empty sheet) | Module 2's filter was
`[[{"a":"A","o":"exist"},{"a":"V","o":"notexist"}]]`. In the **Google Sheets search filter**, `exist` tests
whether the KEY is present in the row object, **not whether the cell has a value**. The MASTER sheet carries
data-validation dropdowns down to ~row 1000, so Google returns padded rows and column A "exists" as `""` on
every one of them. Result: with a **completely empty sheet**, module 2 still returned **1 bundle**, and
module 12 posted `{"name":" – "}` → `[400] name cannot contain leading, or trailing, spaces`.
This is the same defect that earlier produced the folder literally named `-`. D-195 blamed "the row had no
data"; that was the symptom. The defect is that an empty row was ever allowed through.
**FIX (applied via Make MCP, blueprint pushed 5 Aug 07:26Z):** a **module-level filter on module 12** —
`Row has a code and a name`: `{{2.`0`}} Exists AND {{2.`2`}} Exists`. In a *scenario* filter (the wrench),
`Exists` DOES mean non-empty — unlike the Sheets search filter. Blank rows can no longer reach OneDrive.
Supersedes the advice given earlier the same day to swap the Sheets filter to `text:contains "YM-"`; the
module filter is the safer fix because it does not depend on Make's Sheets-filter operator ids.

D-198 | Array aggregator 19 REMOVED; write-back moved BEFORE the iterator | Saved blueprint was
`2 → 12 → 13 → 14 → 19(agg) → 15(updateRow)`. Successful runs consumed **9 operations**
(1 trigger + 1 folder + 1 iterator + 6 sub-folders) — proving module 15 **never executed**, which is why
`Folder URL (V)` was never written and every subsequent run re-selected the same row and hit
`[409] Name already exists`. The aggregator resets bundle context, so `{{2.`__ROW_NUMBER__`}}` in module 15
failed validation ("Validation failed for 1 parameter(s)", 20:34 / 20:50 / 21:00).
**New order: `2 → 12 → 15 → 13 → 14`.** Module 15 now sits between the folder creation and the iterator,
where `2.` is still in scope. No aggregator. Expected cost: **10 ops/client** (was 9 with no write-back).
Known accepted gap: if a sub-folder fails after V is written, the row reads as done — tracked as B4.

D-199 | `trim()` added to both name components | Module 12 body is now
`{"name":"{{trim(2.`0`)}} – {{trim(2.`2`)}}", ...}`. Defends against trailing spaces pasted into the sheet,
which OneDrive rejects with a 400. Also restores the client-approved ` – ` (space en-dash space) separator
required by D-18 and flagged in D-196 — **D-196 is now closed**.

D-200 | Module 2 column range narrowed `A1:ZZZ1` → `A1:Z1` | The ZZZ range made Make generate an output
interface with **18,283 entries (957 KB)**, which alone made the blueprint 1.6 MB and unreadable via the API.
The real table is 23 columns (A–W). `A1:Z1` is the smallest value in the field's allowed enum. Blueprint is
now 11 KB and can be read, diffed and patched programmatically — which is how D-197 and D-198 were finally
found. **Rule for M4–M9: never leave a Sheets trigger on a ZZZ column range.**

D-201 | Modules renamed to intent (DoD item 1) | `Find new clients` · `Create client folder` ·
`Write folder link back` · `Six sub-folders` · `Create sub-folder`. The client will open this scenario one
day and must be able to read it without us.

D-202 | Blueprint editing via the Make MCP is now the primary repair tool | Reading the saved blueprint
settled in minutes what six hours of screenshots could not: which modules actually exist, the exact filter
operators, and the exact mapping syntax Make itself stores (`{{2.`0`}}`, `{{2.`__ROW_NUMBER__`}}`,
`{{12.body.webUrl}}`). **Process rule added: when a Make scenario misbehaves, fetch the blueprint FIRST.**
Caveat: `scenarios_get` output can exceed the tool limit — it is written to a file; parse it with a script
rather than reading it into context. Activating a live client scenario remains a human click.

D-203 | ⚠️ TRAP: Make's "Run once" executes the BROWSER'S UNSAVED state, not the saved blueprint | 5 Aug.
The blueprint pushed via MCP at 07:26:48Z saved correctly (verified by re-fetch: module 15, blank-row filter,
`trim()`, `A1:Z1`, renamed modules). But the open browser tab still held an older local edit containing a
manually-added module **23** and the default module names — and the 15:21 "Run once" executed **that** copy.
Result: two divergent versions of the same scenario, and a green successful run that did **not** exercise the
hardening. **Rule: after any API-side blueprint change, RELOAD the Make tab before running, and never press
Save from a tab opened before the push — Save would overwrite the API version.**
Diagnostic tell: the canvas shows module ids/names that do not match `scenarios_get`.

D-204 | B4 failure mode CHANGED (not closed) by moving the write-back before the iterator | Old behaviour:
sub-folder failure → `Folder URL` never written → row retried forever → permanent 409 loop (the bug that cost
4 Aug). New behaviour: `Folder URL` is written immediately after the client folder is created, so a
sub-folder failure leaves the row **marked done with an incomplete structure** — silent, but no longer a loop
and no longer blocking other rows. **This is a deliberate trade, not a fix.** Proper close still requires B3
(error handler → Resume + write the failure into `Notes`). Recorded so nobody later reads "write-back moved"
as "B4 resolved".

D-205 | Measured cost is now 10 ops/client, not 11 | 1 trigger + 1 client folder + 1 write-back + 1 iterator
+ 6 sub-folders. The aggregator's op is gone (D-198). Supersedes the 11-op figure in
`scenarios/M3-folder-create.md` and `PRODUCTION-READINESS.md`. SET 3 (820/801) will add 2.

D-206 | ✅ M3 medium item CLOSED — the 7 `TEST DEMO` folders are gone from the live Filipino team folder |
Confirmed 5 Aug from the client's live OneDrive listing: `CLIENT FILES- FILIPINO TEAM` now shows only
`YM-2026-00001 – ANNA REYES` (ours, 6 items) alongside genuine client folders. Closes M3 in
`PRODUCTION-READINESS.md`. **The drive is clean enough to record the T4 demo.**

D-207 | ✅ H1 IDEMPOTENCY PROVEN (5 Aug) | Run once with row 2 complete: `Find new clients 2` returned ✓1,
the module-12 filter returned **⊘0**, nothing downstream executed. **Two defences proved in one run** — the
Sheets filter excluded the finished row on `Folder URL`, and the new blank-row guard caught the padded empty
row that the Sheets `exist` operator still lets through (D-197). Safe to schedule. Closes H1.

D-208 | ✅ B1 CLOSED — routing built, WITHOUT a Set-variables module | Both switches live inline in the
modules that consume them, using the exact reference form already proven in production (`2.`0``, `2.`2``):
- **Parent folder** — module 12 URL: `{{switch(2.`10`; "FILIPINO"; <filipino id>; "INDIAN"; "…!529")}}`
- **Folder set** — module 13 array: `{{split(switch(2.`7`; "482"/"407"/"SBS"/"Nomination" → SET 2;
  "820/801"/"300"/"101"/"802" → SET 3; default → SET 1); ";")}}`
Rejected the Set-variables module (v3 spec) and the Router (v2 spec): both add modules and neither adds
safety. Two fields, zero extra operations, one place each to edit. Note `820/801` is a SINGLE dropdown value
in MASTER col H — not two — verified in `scripts/setup_master_sheet.gs`.

D-209 | Unroutable rows are BLOCKED, not misfiled | Module 12's filter is two OR-groups, each requiring
code + name + `Office = BRISBANE` + a known Team. **TOWNSVILLE and PHILIPPINES client-folder itemIds do not
exist in `ONEDRIVE-IDS.md`** — only the office roots — so those rows are skipped rather than dropped into the
wrong drive. Accepted risk: the skip is currently **silent**; B3's Notes write-back is what makes it visible.
⚠️ **Also unverified: `A0BABA3C2640082C!529` is recorded as "CLIENT FILES (main/Indian?)".** The `?` is real.
INDIAN routing must be confirmed against the live drive before a real Indian-team client is entered.

D-210 | ✅ B2 CLOSED — whitelist sanitization, not blacklist | Module 12 body:
`{{trim(replace(2.`0`; "/[^A-Za-z0-9-]/g"; ""))}} – {{trim(replace(replace(2.`2`;
"/[^A-Za-z0-9À-ÖØ-öø-ÿ '.,()-]/g"; " "); "/  +/g"; " "))}}`
**Why a whitelist:** a blacklist pattern must itself contain `"` and `\`, which then need escaping inside an
IML string inside a JSON blueprint — three nesting levels, and a mistake there breaks the payload silently.
The whitelist pattern contains no quote and no backslash, so it is provably safe to embed. Accented letters
are preserved via the `À-ÖØ-öø-ÿ` ranges (Filipino/Spanish surnames). Double spaces collapse via `/  +/g` —
`{2,}` was deliberately avoided because braces collide with Make's `{{ }}` parser.

D-211 | ✅ SET 3 nesting built — 820 / 801 as sub-folders (client's 2 Aug instruction) | Modules 16 (iterator
`820;801`) + 17 (create) run after module 14, gated by a **filter** `{{13.value}} = "03 Relationship Evidence"`.
⚠️ **The filter placement is the whole point.** Putting the condition inside the iterator's array
(`if(...; split(...); emptyarray)`) was written first and rejected on review: an iterator executes **once per
incoming bundle**, so it would have burned **+6 operations for every client**, partner or not — 10 → 16 ops.
As a filter it costs **zero** for non-partner clients. **Rule for M4–M9: a condition that can live in a filter
must never live in an iterator's array.**

D-212 | Measured cost per client, as built | SET 1 / SET 2 → **10 ops**. SET 3 → **13 ops**
(1 trigger + 1 folder + 1 write-back + 1 iterator + 5 sub-folders + 1 iterator + 2 nested). Supersedes D-205
for partner matters.

D-213 | ✅ FULL TEST MATRIX PASSED — the client's "5 real cases" acceptance bar (5 Aug, exec
`a43caf1a…`, 30 ops, status 1) | Four rows in ONE execution. Op count reconciles exactly:
1 trigger + 3 folders + 3 write-backs + 3 folder-sets + 17 sub-folders + 1 nested-iterator + 2 nested = **30**.
- **INDIAN routing** → `items/A0BABA3C2640082C!529/` → `YM-2026-00002 – RAJVEER SINGH`, **201**
- **SET 3** → `820/801` produced the 5 party-based folders, and modules 16/17 fired **once and twice** —
  `820` + `801` created inside `03 Relationship Evidence` only
- **Sanitizer** → `JOSE/CRUZ "TEST"` → `YM-2026-00004 – JOSE CRUZ TEST`, **201**; `MARIA O'BRIEN-SANTOS`
  kept its apostrophe. The whitelist strips the dangerous and preserves the legitimate (D-210 validated)
- **Unroutable** → PRIYA SHARMA / TOWNSVILLE created nothing, `Folder URL` left empty
- **Multi-row** → 4 rows, no interference; write-backs touched `Updated cells: 1` each
- **Filter economy** → 0 extra ops for the two non-partner clients (D-211 validated)

D-214 | ⭐ `A0BABA3C2640082C!529` CONFIRMED = the INDIAN team's client folder | The `?` in
`ONEDRIVE-IDS.md` ("CLIENT FILES (main/Indian?)") is resolved. `YM-2026-00002 – RAJVEER SINGH` landed
alongside `Komal Student Visa Extension`, `Baljeet Tourist visa parents`, `GURJOT 485 DEPENDANT`,
`Savita 485` — Indian-team matters. Update `ONEDRIVE-IDS.md` to drop the question mark. Closes the open
risk flagged in D-209.

D-215 | ✅ B3 CLOSED — error handlers on all three OneDrive calls | Each of modules 12, 14 and 17 now carries
`onerror: [google-sheets:updateRow → Notes, builtin:Ignore]`. A failure writes
`AUTO: <what failed> — <error message>` into the row's **Notes (W)** column, where staff actually work, then
skips **that bundle only** — the rest of the batch continues. Costs zero operations unless something fails.
⚠️ **Blueprint schema gotcha:** `onerror` is a **flat array of modules**, NOT `[{"flow":[…]}]` like `routes`.
The first push failed with *"should NOT have additional properties, additionalProperty: 'flow'"* — a safe
failure (nothing was written). Recorded so M4–M9 get it right first time.

D-216 | ⬜ ONLY REMAINING M3 GAP: SET 2 is unproven | The test row for RAJVEER SINGH was entered with Visa
Type **`485`**, not `482`, so he correctly received SET 1 — meaning the **Work/Employer branch
(482 · 407 · SBS · Nomination → Step 1/2/3 folders) has never executed.** A typo in test data, not a defect,
but the branch is untested and must not be called done. One row with `482` closes it.

D-217 | ✅ SET 2 PROVEN — D-216 CLOSED. **All three folder sets and both teams now verified in the live
drive** | `YM-2026-00006 – TEST SPONSOR PTY LTD` (Visa Type `482`, BRISBANE, INDIAN) created at
`ENGAGED CLIENTS → CLIENT FILES` with exactly the six client-approved Step folders:
`01 Identity & Personal · 02 Step 1 – Sponsorship · 03 Step 2 – Nomination · 04 Step 3 – Visa Lodgement ·
05 Dependents · 06 Correspondence & Outcome`. **10 operations**, matching the D-212 prediction exactly.
Module 16 correctly returned **⊘0** — SET 2 has no `03 Relationship Evidence`, so the 820/801 branch stayed
shut and cost nothing. This is the structure Robinder asked for on 2 Aug so an empty `03 Step 2` reads as
"nomination not started" (D-126).
**Every branch of M3 has now executed against live client data:** SET 1 · SET 2 · SET 3 + nesting ·
Filipino team · Indian team · hostile characters · multi-row · unroutable-blocked · idempotent re-run.

D-218 | Not a bug: `Date Added` for row 7 reads **2026-08-06** while rows 2–6 read 2026-08-05 | The sheet
stamps **Australia/Brisbane** (GMT+10, no DST — D-163). The row was entered late on 5 Aug Pakistan time,
which is already 6 Aug in Brisbane. **The client's clock is the correct clock** — Yale operates in Brisbane.
Recorded because it looks like an off-by-one and will be queried again.

D-219 | 🟢 M3 VERDICT: PRODUCTION-READY FOR BRISBANE — three named conditions, none of them code |
All 12 points of `DEFINITION-OF-DONE.md` pass for the Brisbane/Filipino + Brisbane/Indian paths.
Remaining conditions are commercial or client-dependent, not defects:
1. **B5 — Make Core plan.** 15-min polling ≈ 2,880 ops/mo vs the free 1,000. **The schedule must stay OFF
   until this is bought**, otherwise it dies mid-month silently.
2. **TOWNSVILLE / PHILIPPINES** client-folder itemIds unknown — asked Robinder 5 Aug. Those rows are safely
   blocked and leave `Folder URL` empty, which is visible in the sheet. Two-line change once answered.
3. **H3 — connections are ours, not the client's.** Re-authorize at handover (M11) or the whole thing stops
   silently when our access ends.
**M3 is the reference implementation. M4–M9 copy its shape** (DoD closing line).

D-220 | 🟠 CONCURRENCY FINDING — the write-back is POSITIONAL, so a row deleted mid-run could write the link
to the WRONG client | Module 15 targets `rowNumber: {{2.`__ROW_NUMBER__`}}`. Google Sheets row numbers are
positions, not identities. Sequence that breaks it: Make reads row 5 → a staff member deletes row 3 → every
row below shifts up → Make writes the folder link to what is now row 5, i.e. a **different client**.
**Window:** the seconds between the trigger read and the write-back (measured runs: 9–33 s for a full batch).
**Likelihood:** low — it needs a deletion inside that window. **Impact if it happens:** a client's Folder URL
points at another client's folder, and the real row looks unprocessed. Silent.
**Fix (M4-era, not urgent):** replace `Update a Row` with **Search Rows on `Client Code` → Update** so the
write is keyed to identity rather than position. Costs +1 op per client (10 → 11).
**Interim mitigation, zero cost:** tell staff to ARCHIVE rather than delete rows — which they should do
anyway for audit. Add to the M11 training guide.

D-221 | Trigger limit of 5 rows/run is deliberate and adequate | With the 15-minute schedule that is
**20 clients/hour**, against a real intake of roughly 15 new matters per MONTH (D-49: 49 active matters).
A bulk paste of 10 rows processes 5 now and 5 in the next cycle — no loss, just a delay. Keeping the limit
low bounds the blast radius of any future defect. Revisit only at the ~48-row tracker import, where a
one-off raise to 25 is appropriate.

D-222 | Concurrency verified SAFE at the three other layers | (a) **Code assignment** — `LockService`
document lock prevents two staff generating the same code (D-135), plus `auditDuplicateCodes` as a net.
(b) **Make executions** — Make refuses to run the same scenario twice concurrently, so overlapping
15-minute cycles cannot double-process a row. (c) **Duplicate client names** — codes are unique, so
`YM-2026-00007 – JOHN SMITH` and `YM-2026-00008 – JOHN SMITH` are distinct folders; `conflictBehavior: fail`
can never overwrite an existing one.

D-223 | ❌ THREE OF MY OWN M4 FINDINGS WERE WRONG — withdrawn before they reached the client | I audited only
`docs/02-client-facing/` (curated from SOP batch 1) and declared three gaps. All three were false; the files
exist in **SOP batch 2** at `docs/03-sops-batch-2/CHECKLISTS GENERAL/001UPDATED CHECKLISTS/` and in
`docs/04-additional-docs/`:
- ❌ "No 482 client checklist" → **EXISTS**: `Skills in Demand visa (subclass 482).docx` — a full
  STEP 1 / STEP 2 / STEP 3 document checklist that maps 1:1 onto folder SET 2.
- ❌ "485 WITH DEPENDENT – VETASSESS missing" → **EXISTS** (both .docx and .pdf).
- ❌ "500 WITH DEPENDENT – OFFSHORE missing" → **EXISTS**:
  `STUDENT VISA CHECKLISTS WITH DEPENDENT-OFFSHORE.pdf`.
**Root cause:** I treated a CURATED folder as the whole library. `02-client-facing` was organised from
batch 1 on 5 Jul; batch 2 arrived later and was never merged into it.
**Gate added — G8 SEARCH THE WHOLE TREE:** before asserting a client document does not exist, `find` across
**every** docs subfolder, not the tidy one. Curation hides things. Caught by re-audit before sending (G1/G5).

D-224 | 🔴🔴 REAL AND SERIOUS — every GSM checklist filename points at the WRONG document. Systematic
off-by-one | Verified by extracting each file's own page-1 title, not by trusting filenames:
| Filename | Document actually inside |
|---|---|
| `Subclass 189 Skilled Nominated visa.docx` | **491** checklist |
| `Subclass 190 Skilled Nominated visa.docx` | **189** checklist |
| `Subclass 491.docx` | **494** checklist |
| `Subclass 494.docx` | **802 Child Visa** checklist |
| `Subclass 802-CHILD VISA.docx` | **EOI Points Calculator** |
**Consequence today, before any automation:** a consultant picking a file by name sends a 491 applicant the
wrong checklist. **Consequence for M4:** a filename-keyed selector would industrialise the error across
every GSM client. **M4's selector must key on verified content, never on filename.**
⚠️ **`190` has NO checklist anywhere** — a full-tree content search found no Subclass 190 document. That gap
is real; the earlier 482/485/500 gaps were not.

D-225 | ✅ Both 485 defects CONFIRMED from primary source (previously only asserted in our own READ ME) |
(a) `485 VISA CHECKLISTS-INDIVIDUAL-VETASSESS.pdf` page 1 header reads **"485 VISA APPLICATIONS WITH
DEPENDENT"** — wrong. The other three INDIVIDUAL files correctly read "485 VISA APPLICATIONS".
(b) `485 VISA CHECKLISTS WITH DEPENDENT- MASTERS_BACHELORS_CDR.pdf` contains **zero** occurrences of "CDR"
or "Engineers Australia" — the filename promises a section the document does not have.

D-226 | M4 selector needs ONE new MASTER column, and one derivation confirmed | Checklist choice needs four
dimensions. MASTER supplies three:
- **Visa Type** → col H ✅ · **Onshore/Offshore** → `Location` col G ✅
- **Individual vs With Dependent** → 🟡 derivable from `Party 2 Name` (col D) being filled — **confirm with
  the client**, do not assume. `Visa Variant` (col I) is Main/Dependent/Sponsor/Employer — the applicant's
  ROLE, not whether they have dependents. Wrong field for this.
- **Skills authority** (ACECQA / TRA / VETASSESS / Masters-Bachelors) → 🔴 **no column exists.** 485 alone
  has 7 variants keyed on it. Add **column X `Skills Authority`** to MASTER before building the selector.

D-227 | "Adam" is NOT a Yale contact — do not address any Yale message to him | The only "Adam" in this
workspace appears in `sample format for plan/Zap It - BigQuery…` — a DIFFERENT client engagement. Yale's
sole contact is **Robinder Pal Singh** (Director, MARN 1573959). Recorded because the name surfaced in
dictation and a cross-client mix-up in a client-facing message would be unrecoverable.

D-228 | M4 question list FINALISED after a second full-tree audit — 3 asks, not 9 | Most candidate questions
were answerable from our own records (G2/G8). Converted to decisions we state rather than ask:
- **"With dependent" detection** → `Party 2 Name` (col D) is already specced as "dependent / employer /
  sponsor". Rule: **D filled ⇒ WITH-DEPENDENT checklist, else INDIVIDUAL.** Asymmetric-risk choice: an extra
  document list is an annoyance, a missing one costs the client documents.
- **How clients return documents** → they already reply with email attachments; **~45% of thread messages
  are attachment-only with zero body text** (D-35). No upload portal for MVP. The `upload link` in ROADMAP's
  M4 line was our invention, not their practice — dropped.
- **Onshore/Offshore** → `Location` col G already exists and was added precisely because it drives checklist
  choice (D-52). Nothing to ask.
- **Fees** → stay on email only, never chat (their own rule). 407 and 500 already bundle fees into the
  checklist document, so no separate fee logic is needed.
- **Blank Email Address** → skip the send, write the reason to `Notes`. Our call, no client input needed.
**Genuinely unanswerable without Robinder — the only three asks:**
1. **Skills Authority** (ACECQA / TRA / VETASSESS / Masters-Bachelors) — 485 has 7 variants keyed on it;
   it is in NEITHER their live tracker (D-51..D-56 column list) NOR MASTER. Needs new column X.
2. **Subclass 190 checklist** — a full-tree content search found none. 189/491/494/802 all exist.
3. **Auto-send vs draft-for-review** — see D-229.

D-229 | 🔴 COMPLIANCE QUESTION only the RMA can answer — must be asked before M4b sends anything |
`CLAUDE.md` hard rule: *AI never auto-sends migration advice; only the Registered Migration Agent advises.*
A document checklist is arguably standard information rather than advice — but it goes out under Yale's name
into a regulated relationship, and D-37 already found consultants giving procedural direction in emails with
**no MARN shown**. That is Robinder's professional exposure, not ours to assume away.
**Recommendation to put to him: DRAFT-FOR-REVIEW first** (system prepares the email, consultant clicks send),
switching to auto-send later once he has seen the output. Costs one click, removes the risk entirely.
**Do not build auto-send until he answers.**

D-230 | ✅ CLOSED BY CLIENT — TOWNSVILLE and PHILIPPINES are OUT OF MVP SCOPE | Robinder, 5/6 Aug:
*"we will do in future, in couples of months."* The blocked-row behaviour built in D-209 is therefore the
**correct permanent design for the MVP**, not a gap awaiting an answer. **Do not ask again (G2).**
When those offices arrive: add two cases to module 12's URL switch + two OR-groups to its filter. ~10 min.
**Consequence to manage now:** MASTER's `Office` dropdown still offers TOWNSVILLE and PHILIPPINES, and it
should — they must still be able to TRACK those clients even though folders aren't automated. So a staff
member can create a row that will never get a folder. See D-231.

D-231 | Unroutable rows: keep the silent block, make it visible in the SHEET not in Make | Three options
weighed for surfacing a blocked row:
- ❌ **Remove TOWNSVILLE/PHILIPPINES from the dropdown** — would stop them tracking those clients at all.
- ❌ **Let the row through to a 404 and log via the error handler** — visible, but burns 1 op per row per
  poll (**96/day**) and rewrites `Notes` forever, because `Folder URL` never fills. Over two months that is
  ~5,760 wasted operations for zero benefit.
- ✅ **Conditional formatting in MASTER** — highlight any row where `Office ≠ BRISBANE` **and**
  `Folder URL` is empty. **Zero Make operations, zero structural change to a proven scenario, and visible
  exactly where staff work.** Add to the M11 training note: *"orange row = create this folder by hand."*

D-232 | 🔴 EDGE CASE FIXED — module 15 had no error handler, which could loop a row forever | Modules 12, 14
and 17 all carry `onerror`; **module 15 (Write folder link back) did not.** Failure mode: a transient Google
Sheets error kills the whole execution, so the remaining rows in that batch are never processed AND the
current row keeps its folder with an empty `Folder URL` — the exact 409 loop that cost 4 Aug.
**Fix: `onerror: [builtin:Ignore]` on module 15.** Deliberately NO Notes-writer on this one — if the Sheets
API is failing, a second Sheets call to write Notes would fail too. Skip, let the next poll retry.
**Rule for M4–M9: an error handler on every external call means EVERY one — including the boring ones.**

D-233 | Edge cases audited and ACCEPTED (documented, not fixed) | Deliberate calls, so nobody "discovers"
them later and treats them as defects:
- **Name that sanitizes to empty** (e.g. `///`) → produces `YM-2026-#####– ` → OneDrive 400 → error handler
  writes Notes → row skipped. Ugly but safe and visible. Real client names are never pure punctuation.
- **No 100-character cap** on folder names (DoD item 5 asked for one). OneDrive's real limit is 255 per path
  segment; their longest existing folder name is ~45. Deferred, not forgotten.
- **Blank Visa Type** → falls to SET 1 (Standard). Correct default: 6 general folders beat no folder.
- **Blank Office or Team** → blocked, same as an unsupported office. Covered by D-231's highlighting.
- **>5 new rows in one cycle** → 5 now, rest 15 minutes later. No loss (D-221).
- **OneDrive 429/500** → error handler → Notes → skip; `Folder URL` stays empty so the next poll retries.
  Self-healing.
- **Two clients, identical name** → different codes ⇒ different folder names; `conflictBehavior: fail`
  cannot overwrite.
- **Sub-folder fails on `03 Relationship Evidence`** → that bundle is skipped, so 820/801 are not created.
  Notes records it. Accepted.
- **Positional write-back** (D-220) → unchanged; fix folded into M4.

D-234 | ✅ ALL FIVE CLIENT QUESTIONS ANSWERED — `New-docs/ANSWER.docx`, 6 Aug | Robinder's replies:
1. **GSM filenames** → *"Updated Documents sent"* + *"These checklists are not fully implemented yet.
   If we can make better checklists that would be fine."*
2. **485 VETASSESS header** → new file supplied.
3. **CDR** → *"For applicants with a Bachelor's or Master's degree, a skills assessment is generally not
   required. However, for occupations that require a CDR (such as some engineering and IT occupations),
   the applicant must apply for a skills assessment through **Engineers Australia**."*
4. **190 checklist** → *"New Checklists sent"*.
5. **Skills Authority column** → ✅ **APPROVED**: *"You can add a column on that one so that it will be
   easier to identify."* Explanation: *"There are 7 different checklists for 485 because of the courses
   the client have. For each course there is a specific skills assessment they need to apply."*
   Their current practice: **TRA** = a tracker with login details + current step · **ACECQA** = portal only ·
   **VETASSESS** = portal only, no tracker. He offered to send the TRA tracker.
6. **Auto-send vs review** → ✅ **DRAFT-FOR-REVIEW CONFIRMED**: *"I think it would be better if we can
   prepare and check first before sending it to the client."* **M4b must NOT auto-send.** Closes D-229.

D-235 | ✅ FIVE OF SIX DOCUMENT DEFECTS FIXED — verified by extracting each new file's own heading |
| New file | Heading inside | |
|---|---|---|
| `Subclass 189 Skilled Independent Visa.docx` | Subclass **189** | ✅ |
| `Subclass 491 Skilled Work Regional…docx` | Subclass **491** | ✅ |
| `Subclass 494 Skilled Employer Sponsored…docx` | Subclass **494** | ✅ |
| `SUBCLASS 802-CHILD VISA.docx` | Subclass **802** | ✅ |
| `AUSTRALIA PR VISA-EOI POINTS CALCULATOR (2026).docx` | EOI Points Calculator | ✅ correctly renamed — hash `3eb32d41ca0b` proves it is the same file previously mis-named `Subclass 802-CHILD VISA.docx` |
| `485 VISA CHECKLISTS-INDIVIDUAL-VETASSESS.docx` | `485 VISA APPLICATION-INDIVIDUAL` — "WITH DEPENDENT" gone | ✅ |

D-236 | 🔴 STILL OPEN — the new "190" file is the 491 checklist again | `Subclass 190 State Nomination
Visa.docx` opens with **"Skilled Work Regional (Provisional) Visa (Subclass 491) – Document Checklist"**.
Content search: **"190" appears 0 times**, "491" twice, and the body carries the regional-living commitment
and family-sponsorship clauses that belong to 491, not 190.
**These are materially different visas** — 190 is permanent with state nomination (+5 points, no regional
residence condition); 491 is provisional for 5 years (+15 points, must live/work/study in a designated
regional area). Sending 491 to a 190 applicant misstates their obligations.
Not byte-identical to the 491 file, so it was edited — the heading and body simply were not switched.
**This is the ONLY item still outstanding from the whole document review.**

D-237 | Skills Authority column = FIVE options, not four | The four I inferred from filenames were
incomplete. Robinder's own CDR answer adds a fifth authority. Final dropdown for **MASTER column X**:
`ACECQA · TRA · VETASSESS · Engineers Australia · Not required (Bachelor/Masters)`
- **Engineers Australia** — from his answer: CDR occupations (engineering/IT) assess through them.
- **Not required (Bachelor/Masters)** — his words: *"a skills assessment is generally not required."*
Decided rather than asked: both values come verbatim from his own reply, so re-asking would be a G2 breach.
State it to him, don't question it.

D-238 | `LISTS OF COURSES FOR PR.docx` does NOT solve skills-authority derivation — checked, not assumed |
Hoped it might map course → assessing authority, which would have removed the need for column X. It does
not: it maps **course → occupation → demand level** only. Zero mentions of VETASSESS, ACECQA, TRA, ANMAC,
AITSL, ACS or Engineers Australia. It is a marketing/pathway guide — **valuable for M6 enquiry replies
(Phase 2), useless for M4 selection.** Column X remains required.

D-239 | Minor, logged not raised: two identical-titled points calculators | `POINTS COMPUTATION
REFERENCE.docx` and `AUSTRALIA PR VISA-EOI POINTS CALCULATOR (2026).docx` both open
"Australia PR Visa – EOI Points Calculator (2026)" with different hashes. Neither is a checklist, so M4
never sends them and nothing is blocked. Resolve at the Phase-2 content pass — not worth a client message
now (G5: one ask, and the 190 file is the one that matters).

D-240 | Scope guard on *"if we can make better checklists that would be fine"* | A genuine invitation, and
tempting. **We do not author migration content.** Only the RMA advises (CLAUDE.md hard rule) — a checklist
that omits a required document is a client's refused application. What we CAN offer, and should: consistent
structure, one file per variant, correct naming, and a single source of truth so the automation always picks
the right one. Log the content rewrite in `CHANGE-REQUESTS.md` as Phase 2, with Robinder authoring and us
formatting. Do not absorb it into the MVP.

D-241 | ⭐ The client's "updated documents" were RENAMES, not rewrites — and that CONFIRMS the audit |
SHA-256 proves each corrected file is byte-identical to a previously mis-named one:
`f1c1482c46` was `Subclass 190…` → now correctly `Subclass 189 Skilled Independent Visa.docx` ·
`04a845538d` was `Subclass 491.docx` → now `…494…` · `bb69ad25f1` was `Subclass 494.docx` → now
`SUBCLASS 802-CHILD VISA.docx` · `3eb32d41ca` was `Subclass 802-CHILD VISA.docx` → now
`AUSTRALIA PR VISA-EOI POINTS CALCULATOR (2026).docx`.
**The CONTENT was always right; only the NAMES were wrong** — exactly what the audit claimed. Renaming was
the correct minimal fix. The one exception is the 190 file, where the rename happened but the body was
never swapped (D-236).

D-242 | Canonical checklist set established: **67 files on disk, 47 unique documents, 20 duplicated across
batches** | Same document lives in up to four places (`02 CLIENT-FACING`, `SOP'S 2/CHECKLISTS GENERAL`,
`SOP'S 2/GRADUATE VISA SOP/CHECKLISTS`, `additionaldocsforsop`), often under different names. This is the
same structural trap that caused the G8 failure.
🔴 **M4 MUST select from ONE canonical folder keyed by content hash — never by scanning the tree.**
Build `docs/05-canonical-checklists/` before the selector: one file per (visa × variant × authority), named
to a fixed convention, each entry recorded with its SHA-256 so a swapped file is detectable.

D-243 | 485 selector matrix RESOLVED — 8 variants, both ambiguities closed without asking the client |
| Variant | Canonical (SHA-256 prefix) |
|---|---|
| Individual · ACECQA | `aa24527213` |
| Individual · Masters/Bachelors | `84f61ffdda` |
| Individual · TRA | `66b177cab6` |
| Individual · VETASSESS | **`e6c9fc5230`** ← the NEW 6-Aug file |
| With dependent · ACECQA | `0da6883893` |
| With dependent · Masters/Bachelors | `5168a67212` |
| With dependent · TRA | `5e74aec606` |
| With dependent · VETASSESS | `4b6529aa11` (PDF) |
**Ambiguity 1 — two "WITH DEPENDENT TRA" files.** Diffed: 186 lines / 536 words each, differing by ONE
character — `Prepared by: REYWARD JAKE M GANMOL` vs `GAMOL`. A staff-name typo, not a content difference.
Took `(2)` as the later export. **Not worth a client question** (G5).
**Ambiguity 2 — VETASSESS with-dependent exists as .docx and .pdf.** Same document, source vs export. PDF is
canonical, consistent with every other checklist. Resolved.
🔴 **QUARANTINE `1c7a663480`** — the OLD broken Individual-VETASSESS (heading reads "WITH DEPENDENT"). It
still sits in THREE folders and would be picked by any filename-based selector. Superseded by `e6c9fc5230`.

D-244 | ✅ Connection ownership better than recorded — only TWO handover risks, not three | Audited from the
live blueprint: the **Google Sheets connection is already authenticated as `project1@yalemigration.com.au`
— the CLIENT's account**, despite being labelled "Muhammad's Google connection". Only the **OneDrive
connection** (`sharry00010@gmail.com`) and the **Apps Script 5-minute trigger** (Sharjeel's account) are
ours. Both are silent-failure risks at handover: folders stop being created / codes stop being issued, with
no error. Corrects H3 in `PRODUCTION-READINESS.md`, which assumed all three were ours.

D-245 | ✅ MASTER column X `Skills Authority` LIVE (7 Aug) | Options: `ACECQA · TRA · VETASSESS ·
Engineers Australia · Not required (Bachelor/Masters)`. Approved by the client 6 Aug (D-234). Added by
`scripts/add_skills_authority_column.gs`, standalone and idempotent — A–W untouched. MASTER is now
**24 columns (A–X)**; update any spec that still says 23.
⚠️ **Apps Script gotcha, cost ~10 min:** `SpreadsheetApp.getUi().alert()` **HANGS** when a function is run
from the Apps Script editor — the dialog opens in the *spreadsheet* tab, which the user is not looking at,
and the execution waits forever on a click that never comes. It does not error; it just sits on
"Execution started". **Rule for every future script: use `Logger.log()`, never `getUi()`, in anything meant
to be run from the editor.** Reserve `getUi()` for custom-menu functions only.

D-246 | ❌ ASSUMPTION WRONG — `BNE → APPLICATION FORMS` is the COLLEGES folder, not visa templates |
Listed it via the API rather than trusting the name (G8's twin rule). It holds **42 education-provider
folders**: ACUMEN COLLEGE · BRITTS INTERNATIONAL · CHARLTON BROWN · CTI · ECA · EXCELSIA · FEDERATION
ACADEMY · GOLD COAST INTERNATIONAL · HOSPITALITY TRAINING ACADEMY · IKON · IMAGINE EDUCATION · KAPLAN ·
LEADERS INSTITUTE · MACALLAN · MASTERY · MELBOURNE CITY · OCEANIA · PEACH · QUEENSFORD · QAT · REACH ·
RIVERDALE · SITS · SKILLS INSTITUTE · SOUTHERN CROSS EDUCATION INSTITUTE · SOUTHERN CROSS UNIVERSITY ·
SPENCER (14 items) · SPRING HILL · VIBE · VICTORIA UNIVERSITY … plus **`COLLEGES FORMS AND FEES` (97 items)**.
**"Application forms" means COLLEGE applications — the enrolment side — not visa applications.**
`ONEDRIVE-IDS.md` called it "199 MB (templates, not clients)", which was true but misleading.
**Uploading the visa checklist library here would have been a misfiling** — the same class of error we spent
this week finding in their documents. Target changed to `INFORMATION HUB`, which the client themselves
described as *"info about skills assessment & visa applications"* — verify before uploading.
🎁 **Bonus value:** this is the partner-school inventory (42 providers + a 97-item forms/fees folder) —
direct input for the **Phase 2 enrolment tracker (P2-06)** and the untouched `Admissions Tracker ` sheet.

D-247 | ✅ CHECKLIST LIBRARY HOME CONFIRMED — `INFORMATION HUB → CLIENT DOCUMENT CHECKLISTS` | Listed
INFORMATION HUB (`!sabeb092f5aa947ce96e89bfef41e2459`) rather than assuming again. It holds exactly two
folders — **`ENGLISH SCORE REQUIREMENTS`** and **`TEACHING REGISTRATION TO AITSL`** — both pure reference
material about visa and skills-assessment requirements, no client files. That matches the client's own
description of the folder verbatim (*"info about skills assessment & visa applications"*, ONEDRIVE-IDS)
and matches what a checklist library is.
**Naming follows their convention** — the two existing folders are uppercase and descriptive, so
`CLIENT DOCUMENT CHECKLISTS` sits naturally beside them rather than looking like something we bolted on.
Rejected `BNE → APPLICATION FORMS` (D-246, colleges) and the drive root (client files live there).
**The folder is created BY the scenario, not by hand** — a POST returns the new itemId directly in the run
output, which removes a manual copy-the-URL step and eliminates a typo risk in the id that M4 depends on.

D-248 | ✅ Folder LIVE — `INFORMATION HUB → CLIENT DOCUMENT CHECKLISTS` | Created 7 Aug 20:50Z, **201**.
**itemId `A0BABA3C2640082C!s78266e65226d4b9ebed382720c437f2c`**
path `/YALE MIGRATION - ONE SYSTEM/INFORMATION HUB/CLIENT DOCUMENT CHECKLISTS`. This is M4's source folder.

D-249 | 🔴 PRE-UPLOAD SAFETY SCAN — two checklists are also FEE QUOTES. Never auto-send either |
Scanned all 27 canonical files for banking/PII markers before publishing them to the client's live drive.
One hit: `500_ADDING-DEPENDENT.pdf`.
- **The bank details are Yale's OWN** — "Yale Migration and Education Consultants", ANZ, BSB 014286,
  Sunnybank branch. It is their receiving account on an invoice. **Intentional, not a leak.**
- **The real risk is a hardcoded amount: `Total Amount Due $2,028.00`.** This document is a checklist AND a
  filled quote. Auto-sending it would bill every adding-a-dependent client the same figure regardless of
  their actual fee.
- **Known inconsistency, still unresolved:** $2,000 visa fee in this quote vs **$2,500 VAC** in
  `500 FEES AND CHARGES - APPENDIX A` (flagged in the 5 Jul document audit, never answered).
- `407_TRAINING.docx` is the same shape — checklist + fee quote, total $4,060.
**Mitigation already in place:** the client chose **prepare-and-check, never auto-send** (D-234). A human
sees every checklist email before it leaves. A decision made for COMPLIANCE reasons now also covers this
COMMERCIAL one.
**Additional control for M4:** both files are tagged `REVIEW-FEES` in the manifest. When either is selected,
M4 writes `⚠️ CONTAINS FEE QUOTE — CHECK AMOUNT` into `Notes` so the reviewer cannot miss it.
**Raise with the client at the next natural point** (not a separate message — G5): are these fixed prices,
or should the quote be stripped out and fees handled separately?

D-250 | Storage: the 25 MB upload lands on the CLIENT's quota, not ours | The OneDrive banner showing
"3.1 GB used of 5 GB" is **Sharjeel's personal OneDrive**, unrelated to this project. Files uploaded into a
folder shared BY someone else count against the **owner's** quota. Robinder's drive holds 68.2 GB in
BRISBANE OFFICE alone, so he is on a paid plan and 25 MB is immaterial. No action.

D-251 | ✅ M4 SETUP LIVE — MASTER is now 25 columns (A–Y) + a `CHECKLIST MAP` tab | Column **Y
`Checklist Filed`** is M4's done-marker, exactly the role `Folder URL` plays for M3 — idempotency designed
in from the start rather than retrofitted after a 409 loop. `CHECKLIST MAP` holds **36 rows**
(`Visa Type · Dependent · Authority/Location · Checklist File`), verified readable through Make's own
connection at fields `0–3`.
**Config lives in a SHEET, not in a Make formula** — this closes M1 in `PRODUCTION-READINESS.md`
(*"folder names live inside the Iterator's formula; renaming means editing a scenario"*). When Robinder
sends the correct 190 checklist, someone adds two spreadsheet rows. No scenario edit, no developer.

D-252 | ✅ `YM-M4-checklist-file` BUILT (id 6867537, 7 Aug 21:59Z, `isinvalid: false`) | 10 modules, INACTIVE.
```
1  Sheets   rows where Folder URL filled AND Checklist Filed empty      (idempotent trigger)
2  Router
   ├─ A  visa type IS mapped  AND  Folder URL contains "&id="
   │   3  Sheets   look up CHECKLIST MAP  (visa × dependent × authority/location)
   │   4  OneDrive copy the file into the client's folder
   │   5  Sheets   write the filename into Checklist Filed
   └─ B  visa type NOT mapped (13 × text:notequal)
       6  Sheets   Checklist Filed = "NO CHECKLIST — review" + Notes explains why
```
**Cost ≈ 4 ops/client.** Error handler on every external call (D-232 rule).
**Design notes:**
- **Dependent test:** `{{if(1.`3` = emptystring; "N"; "Y")}}` — Party 2 Name filled ⇒ dependent variant.
- **Third key:** `{{switch(1.`7`; "485"; 1.`23`; "500"; 1.`6`; emptystring)}}` — Skills Authority for 485,
  Location for 500, blank for everything else. No string concatenation anywhere (D-175).
- **Target folder** parsed from the Folder URL M3 already wrote:
  `{{substring(1.`21`; indexOf(1.`21`; "&id=") + 4)}}`. Route A also requires the URL to contain `&id=`,
  so a hand-edited or malformed cell can never reach the copy call.
- **Copy is anchored to the library's itemId**, `/items/<libId>:/<filename>:/copy` — not a long text path.
  Immune to anyone renaming a parent folder.
- **Route B is the important half.** A Sheets lookup returning 0 bundles silently ends the flow, which would
  leave unmapped rows retried forever with no explanation. The router catches them BEFORE the lookup and
  writes a reason into the sheet. **No silent skips, no infinite retry.**

D-253 | 🔒 M4 SECURITY REVIEW — five checks, all pass | Reviewed before switching anything on:
1. **Path traversal** — the filename comes from `CHECKLIST MAP`, an internal tab whose header row is
   protected. Our 27 names are `[A-Za-z0-9_.-]` only. A hostile value like `../../` would need staff edit
   access, and the copy is anchored to the library itemId. **Residual risk accepted; noted for M11 training.**
2. **Wrong-client copy** — the destination is parsed from the same row's `Folder URL`, which M3 wrote from
   OneDrive's own response. Not user-entered. Route A rejects anything without `&id=`.
3. **PII exposure** — 27 templates only. Pre-upload scan found the one file with bank details; they are
   **Yale's own receiving account** (D-249), not client data.
4. **Overwrite risk** — copy only ever WRITES a new file into a client folder. It cannot modify or delete
   anything that exists.
5. **Credentials** — nothing new. Reuses the two existing connections; no secrets in the blueprint.
⚠️ **Known, accepted:** the Graph copy endpoint returns **202 Accepted** and completes asynchronously, so a
2xx does not strictly prove the file landed. The first test run verifies visually. If it ever proves
unreliable, add a follow-up existence check — not worth the extra operation today.

D-254 | 🟠 OPERATIONS BUDGET IS THE NEXT REAL DEADLINE | Org total this month: **437 of 1,000 free**
(M3 development 389 · seven leftover "Integration OneDrive" scenarios 43 · M9 stub + temp 5).
**~563 remain.** M4 build + test will use 60–100. Both M3 and M4 remain **INACTIVE** — correct: once the
15-minute schedules are switched on, polling alone is **~2,880/month per scenario** before any work is done.
**Make Core is now the gating item for the whole MVP, not just M3.**

D-255 | 🔴 `text:contains` / `text:notcontains` ARE NOT VALID MAKE FILTER OPERATORS — they fail SILENTLY |
M4's first run: trigger returned **3 perfect bundles** (482, 820/801, 485+TRA, every Folder URL containing
`&id=`) and **BOTH router routes returned ⊘0** — logically impossible, since Route B was built as a
catch-all. Cause: every Route A group carried a second condition
`{"a":"{{1.`21`}}","o":"text:contains","b":"&id="}`, and Route B's fourth group used `text:notcontains`.
**Make does not raise an error for an unknown operator — the condition simply evaluates FALSE.** So every
Route A group failed on its second condition, Route B's group 4 failed, and nothing matched.
**The only filter operators PROVEN in this project are `exist`, `notexist`, `text:equal`, `text:notequal`**
(D-197 blank-row guard; D-213 BRISBANE/FILIPINO routing). I reached for one I had never verified.
**FIX:** dropped both `contains` conditions entirely rather than guessing at the correct spelling. A
malformed `Folder URL` now falls through to module 4, fails the copy, and the error handler writes
`Checklist Filed = "COPY FAILED — review"` + the reason into `Notes`. **Still visible, one less unverified
operator.**
**RULE for M5–M9: use only the four proven operators. Any new operator must be proven on a throwaway run
BEFORE it goes into a scenario** — an unknown operator is indistinguishable from a legitimate non-match.

D-256 | Diagnostic rule re-proven, and it worked in ONE message this time | The canvas showed
`✓1 → ⊘0 / ⊘0` and I could not tell whether the trigger was wrong, the routes were wrong, or the data was
wrong. Asked for the **trigger's OUTPUT panel** and nothing else. It showed 3 correct bundles, which
immediately eliminated the trigger and the data and left only the filters.
**Cost: one message. On 4 Aug the same class of problem cost six hours because I worked from canvas
screenshots and module configs instead.** (D-195/D-202). The `✓1` badge is the OPERATION count, never the
bundle count — that misreading has now caused confusion three separate times; **read `__IMTLENGTH__` in the
Output, never the bubble.**

D-257 | ✅ M4a WORKING — all three routes correct on one run (7 Aug) | MASTER column Y after the run:
| Row | Input | Result | Route |
|---|---|---|---|
| 2 | 485, Skills Authority **blank** | `NEEDS REVIEW` + Notes explaining what to fix | B ✅ |
| 3 | 482 | `482_SKILLS-IN-DEMAND.docx` | A ✅ |
| 4 | 820/801 | `820-801_PARTNER.docx` | A ✅ |
| 5 | 485 + TRA | `485_INDIVIDUAL_TRA.pdf` | A ✅ |
Three distinct visa types selecting three distinct checklists from a 36-row lookup table, plus the
incomplete row flagged rather than dropped. The dependent test (`Party 2 Name` empty ⇒ INDIVIDUAL) and the
authority switch (485 ⇒ col X, 500 ⇒ col G) both resolved correctly with **no string concatenation**.
Remaining before M4a is closed: (a) confirm the copied files physically exist in the client folders — the
Graph copy returns **202 Accepted** and completes asynchronously (D-253), so a green run is not proof;
(b) idempotency re-run must return 0 bundles; (c) clear row 2's marker after filling Skills Authority to
prove `NEEDS REVIEW` is recoverable, not a dead end.

D-258 | ✅✅ M4a COMPLETE — all three verifications passed (7–8 Aug) |
1. **Files are real.** `485_INDIVIDUAL_TRA.pdf` **422 KB** in `YM-2026-00004`; `482_SKILLS-IN-DEMAND.docx`
   **97.9 KB** in `YM-2026-00002`, which also carries the SET-2 Step 1/2/3 folders. Not stubs — the async
   Graph copy (202 Accepted, D-253) completes properly. That risk is now retired.
2. **Idempotency.** Re-run with nothing changed → `__IMTLENGTH__ = 0`.
3. **Recovery.** Row 2 was flagged `NEEDS REVIEW` for a missing Skills Authority; filling `TRA` and clearing
   the marker made the next run file `485_INDIVIDUAL_TRA.pdf` correctly. **A flag is a to-do, not a dead end**
   — this is the operating model staff will actually use.
**M4a is production-ready on the same terms as M3** (paid plan before the schedule goes on). Only **M4b**
(emailing the checklist, needs the Gmail OAuth) remains in M4.

D-259 | 🟠 NO DUPLICATE-CLIENT DETECTION — surfaced by the client's own question | Two rows both named
`MARIA SANTOS CRUZ` (`YM-2026-00001` 6 Aug, `YM-2026-00004` 8 Aug) produced two codes and two folders,
silently. **The system behaved correctly** — but nothing warns a user who enters the same client twice, and
their documents would then split across two folders with nobody noticing.
**Why this is NOT a simple block:** the grain is **one row = one MATTER** (D-11). The same person legitimately
gets a second row for a second application — a 485 today, a partner visa in two years. Blocking duplicate
names would break the data model.
**Correct fix — a WARNING keyed on EMAIL, not name** (D-54: email is the reliable identity field; names
repeat, and Contact Number is blank in ~half their live rows):
- Conditional formatting or an Apps Script check on `Email Address` (col F)
- Writes to `Notes`: *"possible duplicate of YM-2026-#####"* — visible, never blocking
- ⚠️ Their live data has **trailing spaces in emails** (D-54) — the check must TRIM before comparing
**Sequencing:** do it as part of the ~48-row tracker import, where real duplicates will actually surface.
Logged, not built now.

D-260 | ✅ M5a BUILT — dormant-file detector in APPS SCRIPT, deliberately not Make |
`scripts/m5_dormant_detector.gs`. **Zero Make operations.** The same logic as a Make scenario on a 15-minute
schedule would cost ~2,880 ops/month forever; this is pure date arithmetic on a sheet, so it belongs in Apps
Script on a daily trigger. With 437 of the free 1,000 ops already consumed (D-254), that is not a
micro-optimisation.
**Logic, per open matter:**
- last touch = `Last Contact` (R), or `Date Added` (T) when never contacted
- never contacted → `Next Follow-up Due` = last touch **+3 days** (their day-3 chase)
- contacted before → last touch **+7 days** (their day-7 chase)
- overdue → prepends `DORMANT: no contact for N days` to `Notes`
**Closed matters are skipped and their due date CLEARED** — `Processing Stage = Closed`, or
`Visa Outcome` in Granted/Refused/Withdrawn. Never chase a granted file; that is the fastest way to lose
trust in an automation.
**Idempotent:** `stripDormant_()` removes any previous DORMANT prefix before recomputing, so repeated runs
converge instead of stacking text. Dates are stamped in **Australia/Brisbane** (D-163).
**This replaces their broken `48hr Alert` column** (`#REF!`, D-55) — the alerting they wanted and lost.
`addDormantHighlight()` adds conditional formatting so overdue rows turn orange without anyone reading a
column. Excludes rows where `Visa Outcome` is set, so granted files never light up.
**M5b (the actual chase emails) still needs the Gmail OAuth** — same dependency as M4b, still not asked for.

D-261 | ✅ M5a PROVEN — four runs, all correct (8 Aug) |
| Run | Log | Meaning |
|---|---|---|
| `addDormantHighlight` | "Dormant highlight added" | conditional formatting installed, run once only |
| normal client | `Open matters: 1 \| DORMANT: 0` | due date set to intake +3 |
| forced old date | `Open matters: 1 \| DORMANT: 1` | flagged + row turns orange |
| `Visa Outcome = Granted` | `Open matters: 0 \| DORMANT: 0 \| closed or skipped: 1` | due date CLEARED, flag removed |
**The fourth run is the important one.** A system that chases a client whose visa has already been granted
loses staff trust permanently — one bad email is enough. Closed matters are provably excluded.
This replaces their `48hr Alert` column (`#REF!` since before we arrived, D-55) and directly targets the
16-day and 71-day silent gaps found in discovery (D-34).

D-262 | ⭐ HANDOVER RISK SMALLER THAN RECORDED — Apps Script is ALREADY client-owned | The editor shows
**"You're currently signed in as project1@yalemigration.com.au"**. All scripts and any trigger created from
this session belong to the **client's** account, not Sharjeel's.
**Corrects D-153 and H3 in `PRODUCTION-READINESS.md`**, which assumed the trigger would have to be re-created
by the client at handover. It does not.
**Only ONE silent-failure risk remains: the OneDrive Make connection**, authenticated as
`sharry00010@gmail.com`. If that access ends, folder creation stops with no error.
⚠️ **Consequence for every future trigger: create it while signed in as `project1@`.** A trigger created
from a personal account would silently die at handover — the exact failure D-153 warned about.

D-263 | 🔴 D-262 PARTIALLY WRONG — one trigger IS still personally owned, and now we can see it |
The Triggers screen shows two time-based triggers on `YM MASTER automation`:
| Function | Owner | Status |
|---|---|---|
| `updateFollowUps` (M5a, daily) | **Me** = `project1@` ✅ | created 8 Aug from the client's session |
| `assignMissingCodes` (M2, every 5 min) | **Other user** 🔴 | last run 9 Aug 19:56, error rate 0% |
"Other user" is Sharjeel's personal Google account. **D-262 over-generalised** from the editor's
"signed in as project1@" banner: scripts created in that session are client-owned, but the M2 trigger was
created earlier from a personal account and did NOT move.
**Live risk, exactly as D-153 predicted:** if that access ends, `assignMissingCodes` stops firing **silently**
— no error, no alert — and client codes stop being issued until someone notices a blank column A.
**FIX (2 min, must be done while signed in as `project1@`):** add a second `assignMissingCodes` trigger —
Time-driven · Minutes timer · every 5 minutes · notify immediately — then sign in personally and delete the
old one. **Two triggers running briefly is SAFE**: `master_codes.gs` holds a `LockService` document lock
(D-135) precisely so concurrent runs cannot issue duplicate codes.
**Standing rule, now visible on one screen: check the Triggers page's "Owned by" column at every handover
checkpoint.** It is the only place this failure mode is observable before it happens.

D-264 | 🟡 Trigger ownership HALF fixed — safe, but not finished | Triggers page now shows three:
`updateFollowUps` (Me ✅) · `assignMissingCodes` (**Other user** 🔴, last run 9 Aug 23:41) ·
`assignMissingCodes` (Me ✅). The client-owned duplicate exists, so `assignMissingCodes` currently fires
**twice every 5 minutes**. **Safe** — `master_codes.gs` holds a `LockService` document lock (D-135) so
concurrent runs cannot issue duplicate codes — but it is duplicated work and must not be left.
**Remaining step can ONLY be done from the personal account:** Google does not permit one account to delete
another's trigger. Sign in personally → same script → Triggers → delete the `assignMissingCodes` shown as
"Me" there. End state: **2 triggers, both owned by `project1@`**.
⚠️ Also observed in the dialog: failure notification set to **"Notify me daily"**. For a 5-minute function
that issues client codes that means up to 24 hours of silent failure — change to **"Notify me immediately"**.

D-265 | Housekeeping found in the tab bar: an orphan `Sheet4` | Spreadsheet tabs are now
`MASTER · CHECKLIST MAP · Sheet4 · FOLDER INVENTORY · ENQUIRIES`. **`Sheet4` is not part of the design** —
`setup_master_sheet.gs` creates MASTER + ENQUIRIES; FOLDER INVENTORY and CHECKLIST MAP are deliberate.
Verify it is empty, then delete. Logged rather than deleted blind: this is the client's live workbook and a
stray tab could be something a staff member started.

D-266 | ✅ `48hr Alert` question ANSWERED — and it validates M5a | Team reply, `answer_new.docx` 10 Aug:
*"we are not currently following it but if we can work that out **both the manager and consultant should be
notified**."*
Two things settled:
1. **They had already given up on it.** The `#REF!` (D-55) was not a fresh break — the alerting has been dead
   long enough that nobody relies on it. So M5a restores a capability they wanted and lost, rather than
   adding a new burden. Worth saying exactly that when it is demoed.
2. **Notification target confirmed: MANAGER + CONSULTANT, both.** That is the M5b recipient rule — do not
   design it as consultant-only. `Assigned Consultant` (col L) gives the consultant; the manager needs a
   configurable address, most likely `info@` or Robinder. **Confirm the manager address when asking for the
   Gmail OAuth (A-03) — one message, two answers.**

D-267 | ❌ OUR OWN VAGUENESS BLOCKED TWO OF THREE TEAM QUESTIONS | Both non-answers were the same:
*"Which sheet you are referring to?"* and *"I need to know the tracker we are referring."*
**Cause:** the message said *"the summary section in columns P and Q"* and *"anything else in the tracker"*
without ever naming the file. We know it precisely — `Engaged Client Tracker.xlsx`,
`BRISBANE OFFICE → CLIENT FILES`, tab `Client Tracker`, itemId
`A0BABA3C2640082C!s991d8bd1da0b40b0a4e477e47864ebbc`, 49 rows, 208 revisions — and used none of it.
They have **many** spreadsheets; column letters mean nothing without a filename.
**Gate G5 extended — CLIENT-MESSAGE GATE now also requires: name the exact FILE, TAB and PATH whenever a
question refers to a document.** A screenshot beats a description. Cost here: one wasted round trip with
their team, ~2 days.

D-268 | `CLIENT-ASKS.md` created — the outstanding balance, separate from the chronological log |
`CLIENT-LOG.md` records what happened; it does not answer *"what are we still waiting on?"* at a glance.
Twelve open asks now tracked with severity, date asked, and blocking impact — 1 blocking go-live (Make Core),
4 blocking a module, 3 team questions, 4 not yet blocking. **Read alongside `STATUS.md` at session start.**

D-269 | 🔴 ROSTER IS INCOMPLETE — `Mershe Ventura` answered our team questions and is on NO list we hold |
Document metadata of `answer_new.docx`: `dc:creator` and `cp:lastModifiedBy` = **Mershe Ventura**,
created 6 Aug 00:16, last modified 11 Aug 03:21.
**Searched every record: she appears NOWHERE.** Not in `access/Team roster.docx` (Robinder · Inder ·
Gayatri · Priyanka · Fiza · RJ · Star · Rey · Cristelle), not in DECISIONS, not in any of the 143 client
files, not in the `Assigned Consultant` dropdown built into MASTER.
**D-124 declared the roster "fully closed" on 2 Aug. That was wrong** — it closed the question we asked
(*is Nisha still here?*) and we treated it as closing the roster itself.
**Why it matters beyond tidiness:**
- `Assigned Consultant` (col L) has a `setAllowInvalid(false)` dropdown — **if Mershe handles matters, her
  name cannot be entered at all.** Same class of dead end as SBS/Nomination missing from Visa Type (D-138).
- M6 and M9 auto-assignment route by roster. Anyone missing is invisible to routing.
- She is the person who answers tracker questions — i.e. **the operational owner of the very sheet the
  dashboard will read.** Addressing the re-ask to "Hi team" wasted the natural route to her.
**Action:** address the tracker re-ask to Mershe BY NAME, and ask Robinder to confirm the current full staff
list rather than assuming the 26 Jul roster is still accurate. **Lesson: verify document authorship — the
metadata of a client file can reveal an org fact no one thought to tell us.**

D-270 | Batch 5 file relocated out of the repo root | `answer_new.docx` was sitting loose in
`SOP'S/`. Moved to `New-docs/ANSWER-2 dashboard and tracker (Mershe Ventura, 11 Aug).docx` — alongside
`ANSWER.docx`, so all client replies live in one place — and recorded in `ACCESS.md`'s batch-5 table.
Filename now carries **who** and **when**, because both turned out to matter (D-269).

D-271 | ⭐⭐ CORRECTION — THE GMAIL CONNECTION ALREADY EXISTS AND CAN SEND. A-03 was a false blocker |
Sharjeel challenged the claim that we needed a Gmail OAuth. He was right. Verified from Make's connection
API, not memory:
```
Yale's Gmail connection   id 9452213   type google-email (the Gmail connector)
  mailbox   visa.lodgement@yalemigration.com.au
  authorId  8767171  =  info@yalemigration.com.au  → CREATED BY THE CLIENT
  expires   2027-01-29
  scopes    openid · userinfo.profile · userinfo.email
            https://www.googleapis.com/auth/gmail.modify
            https://www.googleapis.com/auth/gmail.readonly
```
**`gmail.modify` is sufficient for `users.messages.send` AND `users.drafts.create`** (Google's Gmail API
scope table: modify grants all read/write except permanent deletion). So **M4b and M5b can be built today** —
no new authorisation, no call, nothing from Robinder.
**Root cause of the error:** D-13 recorded "OAuth project1@ needed at M4 time" back in July and it was carried
forward for three weeks without ever being re-checked against the live connection list. The client had
already authorised Gmail on 1 Aug for M9 (D-149) — the same connection covers sending.
**This is a G1 failure of the most expensive kind: an ask that would have made us look like we do not know
our own system.** Sharjeel caught it before it was sent.
**Gate reinforced — before ANY access request, run `connections_list` and read the actual scopes.**

D-272 | The real M4b question is much smaller: WHICH MAILBOX should drafts appear in? |
The existing Gmail connection is on **`visa.lodgement@`** — the inbound mailbox that receives Department
s56 emails (D-64/D-80). D-13 had assumed **`project1@`** for outbound.
Since the client chose **prepare-and-review, never auto-send** (D-234), M4b creates a **draft** that a
consultant opens and sends. So the question is where that draft should land:
- **(a) `visa.lodgement@`** — works today, zero client action, but it is the lodgement inbox
- **(b) `project1@`** — matches the original design; needs one 2-minute Gmail OAuth
**Decision: BUILD ON (a) NOW.** Swapping the connection later is a one-field change in one module. Ask
Robinder as a preference, not a prerequisite — a question that does not block is worth a fraction of one
that does.
**`Muhammad's Google connection` (9501125, project1@) is type `google`, NOT `google-email`** — it drives
Sheets only and cannot send mail. Option (b) would require a genuinely new connection.

D-273 | Make paid plan removed from the outgoing message on Sharjeel's instruction | Commercially his call
— he judged it too early to push. **Nothing changes technically: both scenarios stay OFF.** The constraint
(~2,880 ops/month per scenario vs 1,000 free) is unchanged and stays recorded in `CLIENT-ASKS.md` A-01.
Raise it when the tracker import and dashboard make the value obvious.

D-274 | 🔴 DOCUMENTATION DRIFT AUDIT — the control files had fallen 6 days behind reality | Prompted by a
"check everything one more time" request. Verified live systems first (Make connections + scenario list),
then swept every control doc. **Nothing in the BUILD was wrong; the DOCS were.** Found and fixed:
| File | Was claiming | Reality |
|---|---|---|
| `STATUS.md` | *"Client-visible output is still ZERO"* · *"Anything shipped ❌ Zero"* · *"Robinder has not been shown it"* · 🎯 = record the demo | Demo sent; M3 + M4a + M5a all complete and proven |
| `STATUS.md` | "PARKED: M4/M5 build work · tracker import" | Both built; the import is now the ACTIVE task |
| `CLAUDE.md` | "PROCESS.md — its **5** gates" | **8** gates (G6/G7 added 2 Aug, G8 added 10 Aug) |
| `CLAUDE.md` | "M3 has **5 open blockers**" | All five closed 5 Aug (D-207…D-217) |
| `CLAUDE.md` | Stack: "project1@ outbound" implying an OAuth is still needed | Gmail connection already exists (D-271) |
| `CLAUDE.md` | File map missing `STATUS`, `CLIENT-ASKS`, `PROCESS`, `PHASE-2-3-BACKLOG`, canonical checklists | added |
| `ROADMAP.md` | `M4 — ⬜` and `M5 — ⬜` | M4a and M5a complete |
| `ROADMAP.md` / `ARCHITECTURE.md` | "23 columns A–W" | **25 columns A–Y** since D-245/D-251 |
**Why this matters more than it looks:** `CLAUDE.md` and `STATUS.md` are loaded at the start of every
session. A stale `ARCHITECTURE.md` nearly caused ten wrong folders to be created in the client's live drive
on 2 Aug (the reason G6 exists). Stale control files do not stay harmless — they become instructions.
**Rule added to the session-END ritual: when a module completes, update `STATUS.md`, `ROADMAP.md` AND
`CLAUDE.md`'s blocker section in the same commit as the code. Not "later".**

D-275 | ✅ FULL-SYSTEM VERIFICATION, 11 Aug — everything reconciles | Checked against live APIs, not memory:
- **Connections (4):** Google Sheets `project1@` ✅ client-owned · **Gmail `visa.lodgement@` ✅ client-created,
  `gmail.modify`** · Microsoft `sharry00010@` ⚠️ **the only remaining handover item** · Make AI provider.
- **Scenarios:** `YM-M3-folder-create` 63 execs / 399 ops / `isinvalid:false` / **INACTIVE** ·
  `YM-M4-checklist-file` 8 execs / 27 ops / **0 errors** / `isinvalid:false` / **INACTIVE** ·
  M9 stub · TMP · 7 leftover "Integration OneDrive" (43 ops, all inactive, delete at M11).
- **Apps Script:** 2 triggers, **both owned by `project1@`**, 0% error rate, both fired on schedule.
- **Operations: 477 of 1,000 this month · 523 remaining.**
- **Canonical library:** 27 files, hash-verified on disk AND in the client's OneDrive.
**M4's development produced ZERO errors across 8 executions** — against M3's 22 during development. The
patterns learned on M3 (D-255 operator discipline, blueprint-first debugging, error handler on every
external call) are demonstrably paying off.

D-276 | 🔴 NEAR-MISS — draft message implied M3/M4 run automatically. THEY DO NOT | Sharjeel challenged
"the system files the checklist automatically" against the fact that Make was never switched on. He was
right. Precise state, verified:
| Capability | Automatic? | Evidence |
|---|---|---|
| Client codes (`assignMissingCodes`) | ✅ **YES** — Apps Script, every 5 min | ran 10 Aug 09:17, 0% error, owner `project1@` |
| Dormant flagging (`updateFollowUps`) | ✅ **YES** — Apps Script, daily ~6am | ran 10 Aug 06:15, 0% error, owner `project1@` |
| Folder creation (M3) | ❌ **NO** — Make scenario `isActive:false`, manual Run once |
| Checklist filing (M4) | ❌ **NO** — Make scenario `isActive:false`, manual Run once |
**The Google half is genuinely live; the Make half is built but switched off.** Conflating the two in a
client message is the worst kind of overclaim: Robinder would add a test client, nothing would happen, and
the whole system would look broken — after a demo that showed it working.
**Approved wording, which does not require raising the paid plan (D-273):** *"built and tested — I run them
manually at the moment; they'll run on their own once we switch the schedule on."*
**Rule added: before writing "automatic" in any client message, check `isActive` on the scenario and the
Triggers page for the script. "Built" and "running" are different words and must stay different.**

D-277 | Confirmed: the dashboard and CRM questions are STILL unanswered | `ANSWER-2 … (Mershe Ventura,
11 Aug).docx` contains **only the TEAM message** (P/Q summary · 48hr Alert · tracker) — all 18 paragraphs
extracted and checked. It contains **nothing** on: who opens the dashboard · top-3 views · phone vs laptop ·
refresh frequency · CRM4Agencies/Migration Manager/Agentcis.
Two separate threads had blurred into one: the **dashboard + CRM** message went to Robinder (no reply), the
**tracker** message went to the team (Mershe replied, 1 of 11 bullets). A-04 and A-05 remain open in
`CLIENT-ASKS.md`.

D-278 | 🔴 CAUGHT PRE-SEND — the dashboard proposal promised a view we cannot build | Checked each proposed
view against MASTER's 25 columns before the message went out:
| View | Source | |
|---|---|---|
| Active matters per branch | `J Office` | ✅ |
| What's stuck, and at which stage | `M Processing Stage` | ✅ |
| Clients not contacted in 2 weeks | `R Last Contact` + `S Next Follow-up Due` | ✅ |
| **s56 deadlines coming up** | **no column exists** | 🔴 |
| Granted vs refused | `N Visa Outcome` | ✅ |
| Files per consultant | `L Assigned Consultant` | ✅ |
**There is no s56 deadline field in A–Y**, and the s56 urgent flag + deadline write-back is unbuilt M9 work
(ROADMAP still `⬜`). Promising it would mean delivering five of six promised views and explaining the gap.
**Fix: keep it in the message but explicitly as LATER** — *"once the email side is reading the Department
letters"*. It is a genuine roadmap item and worth signalling; it is not a Phase-1 dashboard view.
**Rule: before proposing any dashboard/report view to a client, trace every metric to a COLUMN THAT EXISTS.
A view with no data source is a promise, not a plan.**

D-279 | Dated claims rot — never put "this morning" in a message that may not send today |
Draft said *"it ran at 6:15 this morning"* — true on 10 Aug, false on 11 Aug. Client messages sit in drafts,
get rewritten, and go out a day late. **Use the recurring fact, not the instance: "it runs at 6am every
morning."** Same credibility, no expiry.

D-280 | ✅ A-02 CLOSED — the correct Subclass 190 checklist arrived and is verified | Third attempt, and this
one is right. Checked by content, never by filename (G8):
```
Heading   "Skilled Nominated Visa (Subclass 190) – Document Checklists"
"190" ×1  ·  "491" ×0  ·  "189" ×0  ·  "regional" ×0
"Minimum 65 points ... including 5 points for state/territory nomination"   ← correct: 190 = +5, 491 = +15
"State or Territory nomination required" ×3
SHA-256 070af10ee5c817ce  ·  author Mershe Ventura  ·  11 Aug 02:55
```
**"regional" appearing ZERO times is the decisive check** — its presence is exactly what exposed both
earlier wrong versions (D-236). The 491 file carries the regional-residence commitment; a genuine 190 file
cannot.
Filed as `190_SKILLED-NOMINATED.docx` in the canonical library (now **23 client checklists + 5 reference**),
hash recorded in `MANIFEST.json`, README selector matrix updated from 🔴 MISSING to ✅.
**Two manual steps remain before M4 can use it:** upload the file to OneDrive
`INFORMATION HUB → CLIENT DOCUMENT CHECKLISTS`, and add two rows to the `CHECKLIST MAP` tab
(`190 · N · (blank) · 190_SKILLED-NOMINATED.docx` and the same with `Y`).
**That second step is the design paying off** — adding a new checklist is two spreadsheet rows, no scenario
edit and no developer (D-251).

D-281 | Mershe Ventura authored the 190 checklist as well as the tracker answers — she is not admin support |
Both `ANSWER-2 …docx` and the corrected 190 checklist carry her as `dc:creator`. She is producing
**client-facing migration documents**, not just answering process questions. That materially strengthens
A-13: she almost certainly belongs in `Assigned Consultant`, which is a locked dropdown she cannot currently
be selected in. Keep the staff-list ask in the Robinder message.

D-282 | 🔴 UNVERIFIED DEPENDENCY — nobody has confirmed Looker Studio is available on their Workspace |
The dashboard has been assumed to be Looker Studio since Proposal v3, and in three weeks **nobody has opened
it as `project1@yalemigration.com.au`**. Google Workspace admins can disable Looker Studio per-org. If it is
off, we discover that the weekend before delivery.
**Check before promising a date: sign in as `project1@` → `lookerstudio.google.com` → confirm a blank report
can be created.** 60 seconds. This is exactly the class of assumption that produced D-246 (APPLICATION FORMS
was the colleges folder) and D-271 (the Gmail OAuth we already had).
**FALLBACK, and arguably the better default anyway — a `DASHBOARD` tab inside MASTER:**
| | Sheet tab | Looker Studio |
|---|---|---|
| Extra tool / login | none | new tool |
| Works on phone | ✅ Sheets app | ✅ |
| Access control | inherits the sheet they already share | per-report |
| **Per-branch visibility (option b)** | ❌ cannot hide rows per viewer | ✅ row-level security |
| Risk of Workspace policy blocking it | **zero** | real, unverified |
**Decision: if Robinder answers (a) or (c), build the sheet tab — faster, zero dependency, lives where they
already work. Only option (b) genuinely requires Looker Studio.** That also means his one answer selects the
tool, not just the permissions.

D-283 | Likely reason Robinder never answered the dashboard questions — our own message deferred it |
The 8 Aug message said *"Should have it working in the next day or two, **then the dashboard is next**"*,
then asked six open-ended questions with no deadline. **We told him it was not yet time.** A busy director
reads that as "he will come back to me". The non-reply may be our sequencing, not his silence.
**Fix applied: open the new message by closing that loop — "M4 is done, as promised, so now the dashboard."**
That is the trigger he is waiting for and it evidences the previous commitment was met.
**Rule: never pair "this is next, not now" with a question you actually need answered now.**

D-284 | Dashboard dependency check — no hard blockers, three things to line up | Traced end to end:
| Dependency | State |
|---|---|
| Data source (MASTER) | 🟠 empty — needs the ~48-row import. **Ours, ~1h, needs the tracker read run first** |
| Tracker readable via workbook API | ✅ proven T1.5 / D-48 |
| Every proposed view has a column | ✅ verified D-278 (s56 removed — no column exists) |
| Tool available | 🔴 **unverified — D-282** |
| Who may see it | 🟠 Robinder (a/b/c) — also selects the tool |
| Manager email addresses for sharing | 🟠 needs the staff list (A-13) |
**No blocker we cannot clear ourselves except his one answer.** Critical path is: run the tracker read →
import → build. The import does not wait on him.

D-285 | 🔴 MY OMISSION — adding a checklist needs THREE steps, not two. I gave two | When the 190 file
arrived I told Sharjeel: (1) upload to OneDrive, (2) add two `CHECKLIST MAP` rows. **I forgot the third:
`190` also has to be added to M4's ROUTER filters.**
Route A enumerates 13 accepted visa types; Route B rejects those same 13. `190` was in neither, so a 190
client would have fallen through to **Route B → `NEEDS REVIEW`** — the map rows and the uploaded file would
have had no effect, and it would have looked like the new checklist "didn't work".
**Fixed 11 Aug 19:51Z** — `190` added to Route A (14 groups) and to Route B's exclusion list (14 conditions).
**This contradicts what I told the client in D-251/D-280** — that adding a checklist is "two spreadsheet
rows, no scenario edit". **It is only true for a visa type ALREADY in the router.** A brand-new visa type
needs a one-line scenario change too.
**Correct statement for the client, and for M11 training:** *"a new checklist for an existing visa type is
two spreadsheet rows; a brand-new visa type also needs one line added to the scenario."*
**Root cause: I described the design as I intended it, not as I built it.** The router's hardcoded visa list
is the gap between the two. Worth revisiting at M11 — the list could read from the CHECKLIST MAP tab instead
of being enumerated in filters, which would make the original claim true.

D-286 | ⭐ Mershe's answer partially resolves A-04 — use it instead of re-asking | Her `48hr Alert` reply
says alerts should reach *"both the manager and consultant"*. That is an operational statement about **who
needs visibility into quiet clients** — which is dashboard question 1 in different words. It rules out
option (a) *only you*, and points at **(c) everyone sees everything**.
**Decision: state (c) as the assumption rather than re-ask.** For a client who has not replied to six
open questions, "tell me if this is wrong" is a far cheaper reply than "choose a, b or c". It also honours
G2 — we already have a partial answer in our records; asking again would ignore it.
**Bonus: (c) also selects the cheaper build** — a `DASHBOARD` tab inside MASTER, no Looker Studio dependency
(D-282). Only option (b) needed row-level security.

D-287 | Read of the client's silence — it is sequencing, not frustration | Evidence against frustration:
he answered our checklist questions 6 Aug · the corrected 190 file arrived 11 Aug via Mershe · Mershe
answered the team message. **He is actioning requests and delegating them.**
Evidence for why the dashboard questions specifically went unanswered: (1) six open-ended questions is
homework, not a reply; (2) our own 8 Aug message said *"then the dashboard is next"* — we told him it was
not his turn yet (D-283).
**Therefore the next message must contain no homework and no apology.** Progress, a date, and a stated
assumption. Apologising for a delay he has not complained about would invent a problem.

D-288 | 🔴 NEVER PRE-ENCODE A URL FOR MAKE'S `makeApiCall` — Make encodes it again | The tracker read
failed with *"Couldn't find the workbook range... the URL points to a worksheet or file that doesn't exist"*.
I wrote `worksheets('Client%20Tracker')`; Make encoded the `%` to `%25`, so Graph searched for a sheet
literally named `Client%20Tracker`.
**Rule: put RAW characters in the URL field — spaces, braces, apostrophes — and let Make encode.**
**Also switched from name-based to ID-based addressing:**
`/workbook/worksheets/{00000000-0001-0000-0000-000000000000}/range(address='A1:R12')`
`Client Tracker` = `{00000000-0001-0000-0000-000000000000}` · `Admissions Tracker ` =
`{03EB648D-4D8D-45EC-9A2D-89DF01C493FB}` (note the **trailing space** in that second name — exactly why
names are the wrong key here).
**Diagnostic pattern that worked again:** rather than guessing at three encodings and burning an operation
each, ONE call to `/workbook/worksheets` returned both names and IDs and ended the question. Same discipline
as fetching the blueprint instead of reading screenshots (D-202).

## D-289 | 🔴 THE TRACKER WE SPENT TWO WEEKS ANALYSING IS ABANDONED — they moved to Google Sheets
**Team reply, 12 Aug (answering our 11 Aug message that named the file explicitly):**
> *"with regards to that file. we are not using it but if we can create a new one that has an accurate
> columns for each client application that would be better. we are using the google sheets for our
> monitoring as of the moment"*

**What this kills:**
- `Engaged Client Tracker.xlsx` (`A0BABA3C2640082C!s991d8bd1da0b40b0a4e477e47864ebbc`) is **dead data**.
  The 49 rows read on 29 Jul were a snapshot of a system they have since left. Importing it would have
  put stale matters into MASTER and made the dashboard confidently wrong — the worst possible failure
  for a first client-visible deliverable.
- **A-06 and A-08 are moot, not unanswered.** Both asked about the P/Q manual summary and annoyances in a
  file nobody opens. Re-asking them (which the 11 Aug message did) was wasted, and asking a THIRD time
  would be the credibility damage G2 exists to prevent. **Both close as ⛔ WITHDRAWN.**
- The Microsoft Graph workbook-read work (D-287/D-288 — worksheet IDs, `$select`, the `%2520` encoding
  trap) is no longer on the critical path. Keep the findings; they still apply to the Admissions Tracker
  (P2-06) which lives in the same workbook.

**What this unlocks:**
1. **The import gets much easier.** Google Sheets → Google Sheets is native in Make (connection 9501125,
   `project1@`). No workbook API, no worksheet GUIDs, no URL-encoding traps, no 202-async copies.
2. **`executions_get-detail` returns no module bundles on the Free plan** (verified 12 Aug — it returns
   only `{"status":"SUCCESS"}`). That blocked reading the xlsx through the API entirely. A Google Sheet
   can simply be opened in a browser and read directly, which removes the whole blind-import problem.
3. **"create a new one that has accurate columns" IS MASTER.** They are asking for the thing already
   built: 25 columns A–Y, their vocabulary, their `CL-###` ids preserved (D-51), dropdowns, auto codes.
   This is not a change request and must not be logged as one — it is signed M2 scope, already delivered.
   **Show it; do not ask permission to build it.**

**Cost of the miss:** ~0 build hours. Nothing was built against the xlsx — the import was still specced.
The discovery work (their column vocabulary, Processing Stage values, the CL-### convention, the broken
`48hr Alert`) all remains valid, because MASTER v2 was reconciled to their *concepts*, not to that file.

**Rule added:** before importing from any client data source, confirm it is the one they actually use
TODAY. "It exists and has data in it" is not evidence that it is live. Ask "is this what you open every
morning?" — a snapshot with 208 revisions can still be abandoned.

**New ask A-14:** the link to the Google Sheet they use now. Until we have it, the import source is
unknown and the dashboard has nothing real to sit on.

## D-290 | ⚠️ PARTIAL REVERSAL OF D-271 — Make's Gmail draft module needs a WIDER scope than we have
**Verified 13 Aug against the live API, before building anything:**

`connections_get(9452213)` returns exactly 5 scopes on `Yale's Gmail connection` (`visa.lodgement@`):
`userinfo.profile` · `userinfo.email` · `openid` · **`gmail.modify`** · **`gmail.readonly`**

`app-module_get(google-email, ActionCreateDraft)` — checked on **both v1 and v2** — declares:
```
"parameters":[{"name":"account","type":"account:google",
               "options":{"scope":["https://mail.google.com/"]}}]
```
**`https://mail.google.com/` is not among our five.** Make filters the connection picker by declared
scope, so the existing connection will not be selectable in a Create-a-Draft module.

**What D-271 got right, and must not be re-litigated:** the connection exists, the client created it, it
is valid to 29 Jan 2027, and asking for a *brand-new* Gmail OAuth would have been a repeat ask. That
still holds.

**What D-271 got wrong:** *"`gmail.modify` permits both send and draft, so no further authorisation is
needed for M4b/M5b."* True of the **Gmail API**. False of **Make's module**, which hard-requires the
full-mailbox scope regardless of what the underlying API would accept. **A capability check on the
vendor API is not a capability check on the connector.** G1 now covers both layers.

**Consequence:** M4b and M5b are NOT buildable today. They need one client click — a *reauthorize* on
the existing connection with the extra scope ticked, exactly the flow completed on 31 Jul (D-97). This
is a scope extension, not a new connection, and must be framed that way so it does not read as asking
twice.

**Transparency note for the client conversation:** `https://mail.google.com/` also permits *sending*.
We only ever create drafts (D-234: *"prepare and check first before sending"*), and the AI-never-sends
rule is unchanged. Say so plainly rather than letting them discover a send permission we never use.

**Alternative considered and rejected for now — Apps Script `GmailApp.createDraft()`:** zero Make
operations, zero scenario slots against the Free plan's cap of 2. But a bound script runs as its
authoriser, so drafts would land in `project1@` rather than `visa.lodgement@` where the team actually
works. Installing it under `visa.lodgement@` needs a client click too — same friction, worse mailbox.
Revisit only if the scope extension is refused.

**Sequencing decision:** do NOT send a separate ask. A-14 (their live Google Sheet link) is already
outstanding with the team, and the cutover conversation with Robinder is coming regardless. Bundle the
reauthorize into that one session — two clicks, one interruption (G5).

## D-291 | ✅ A-01 DOWNGRADED — the Make paid plan is NO LONGER what blocks M3 and M4 going live
**Verified in the live Make UI, 13 Aug** (screenshots from Sharjeel, `YM-M3-folder-create` → Schedule
settings). The "Run scenario" dropdown on this **Free** org offers:

`At regular intervals` · `Once` · **`Daily`** · **`Weekdays (Mon - Fri)`** · `Weekly` · `Monthly` ·
`Specified dates` · `On demand`

…plus **`Advanced scheduling → + Add more schedules`**, which allows several fixed times per day.
The 15-minute limit applies only to `At regular intervals` ("Must be higher than or equal to 15") —
it is a **minimum**, and every other scheduling type is unrestricted on Free.

**Chosen configuration (set on cutover day, not before):**
> `Weekdays (Mon - Fri)` · **09:00 · 13:00 · 17:00** Australia/Brisbane, via Add more schedules.

**Operations, recomputed against the real limits:**

| Schedule | Runs/mo each | M3+M4 baseline | +20 new clients | Total | Free = 1,000 |
|---|---|---|---|---|---|
| Every 15 min (the old assumption) | 2,880 | 5,760 | +260 | **6,020** | ❌ 6× over |
| **Weekdays, 3×/day** | 66 | 132 | +260 | **~392** | ✅ ~600 spare |

**Why the old number was so wrong:** we costed a 15-minute poll because that is Make's default, and
never questioned whether a visa practice onboarding a handful of clients a day needs 15-minute latency.
It does not. A folder appearing within four working hours is indistinguishable from instant to the
person waiting for it. **We treated a default as a requirement for eight days.**

**What A-01 still covers — do not delete it:** the Free plan caps **active scenarios at 2**
(`license.scenarios: 2`, verified via `organizations_list`). M3 + M4 is exactly two. **M6 (enquiry
auto-reply) and M9 (email triage) cannot run at all on Free**, regardless of operations. So the paid
plan is still required to finish the MVP — it just stopped being the thing standing between us and
switching the first two modules on. Raise it when M6/M9 are ready, with M3/M4 already running as the
evidence, exactly as D-273 intended.

**Status change:** A-01 🔴 blocking go-live → 🟢 needed for M6/M9 later.

## D-292 | Strict dropdowns make `setValues()` all-or-nothing — and the error names the wrong column
`seedDemoRows` v1 failed with a bare `Exception: 485 only. Blank for every other visa type.`
That help text belongs to **column X (Skills Authority)**. X was not the problem.

**Actual cause:** `'REY'`. Column L's list is
`['Robinder','Inder','Gayatri','Priyanka','Fiza','RJ','Star','Rey','Cristelle','Unassigned']` —
**`'Rey'`, not `'REY'`.** Dropdown matching is case-sensitive.

**Two things worth keeping:**
1. **`setAllowInvalid(false)` DOES block Apps Script writes**, not only typing. One illegal value in a
   14×25 block rejects **all 350 cells** — the write is atomic. (Nothing was written, so MASTER stayed
   clean; the failure was safe, just opaque.)
2. **Sheets reports whichever rule's help text it reaches first, not the rule that failed.** X was the
   only one of the ten dropdowns with `setHelpText`, so its message surfaced for a violation two
   columns away. Chasing that message would have wasted the session.

**Fix, and the general pattern:** `seedDemoRows` v2 pre-flights every value against the sheet's own
live validation lists (`getDataValidation().getCriteriaValues()`) and prints *row · column · value ·
allowed* for each violation **before writing anything**. A block write into validated columns should
always be preceded by a validation read — never trust the exception to tell you where the fault is.

**Second defect, found only because demo data existed — the reason for seeding at all:**
the DASHBOARD's `Going quiet`, `Folder missing` and `Checklist missing` tiles counted rows where
`Visa Outcome` was **blank**. But the dropdown offers `Pending`, and real rows use it — so every one of
those three tiles would have read **0 against real client data** while looking perfectly healthy.
The QUERY blocks were already correct (`N is null or N = 'Pending'`); only the KPI formulas were wrong.
Now fixed, and the two coverage tiles are scoped to open matters so closed files cannot inflate them.

**This is exactly what an empty dashboard hides:** a broken formula and a correct one both render 0.

## D-293 | `setValues()` is LAZY — validation fires at `flush()`, so a try/catch around the write is useless
Follow-on from D-292. The v2 seeder logged **"Pre-flight passed"** and then threw anyway, at the line
*after* the guarded write. Two separate defects, both worth keeping:

**1 · The pre-flight was a false pass.** `allowedFor_()` handled `VALUE_IN_LIST` and `VALUE_IN_RANGE`
and returned `null` for anything else — and `null` meant *"no rule, skip this column"*. Any rule of a
different kind was therefore **silently exempted from checking**. A validator that cannot read a rule
must report *"cannot verify"*, never *"passed"*. Treating unknown as clean is how a check becomes
theatre.

**2 · `setValues()` does not write when you call it.** Apps Script batches; the write — and with it
the data-validation check — happens at **`SpreadsheetApp.flush()`**. Our `flush()` sat *outside* the
`try`, so the exception bypassed the catch entirely, the row-by-row fallback never ran, and some rows
had already landed. **The result was the partial write we had explicitly designed against.**
> **Rule: any `try` guarding a Sheets write must contain the `flush()`.** Otherwise the guard is
> attached to the wrong statement and the failure surfaces somewhere you are not looking.

**v3 fix:** one row per iteration, `setValues()` + `flush()` both inside the try. A rejected row is
skipped and named; every other row still lands, so the dashboard gets data even when something is off.
Added `inspectValidation()`, which dumps criteria type, values, `allowInvalid` and help text for all
25 columns — a rejection can never be a guessing game again.

**Column X dropped from the demo data.** It is the only column whose rule we cannot fully read, and
**no dashboard view references it.** Fighting a constraint that buys us nothing is not engineering.
X remains fully in play for M4's real checklist selection — this is a demo-data decision only.

**Cost of the whole detour: three runs and no client impact.** Worth it — it surfaced the KPI defect
in D-292 that would otherwise have reached Robinder as three tiles permanently reading zero.

## D-294 | 🔴 REAL DEFECT — column Y silently inherited column X's dropdown, and a failed write burned real client codes
Two production findings, both surfaced only because we insisted on putting data in front of the
dashboard before the client did.

### 1 · `Checklist Filed` (Y) is carrying `Skills Authority` (X)'s validation rule
**Evidence, unambiguous:** the v3 seeder writes row by row. Exactly seven rows were rejected —
DEMO-001…006 and 013 — and **those are precisely the seven with a value in column Y.** Every accepted
row has Y blank. The rejection message was X's help text (*"485 only. Blank for every other visa
type."*), which is why two earlier sessions chased the wrong column.

**Cause:** `setup_m4_checklist_map.gs` creates Y with `insertColumnsAfter()`. **Google Sheets copies
formatting *and data validation* from the column to the left** — which was X. So Y has been carrying a
5-value dropdown (`ACECQA | TRA | VETASSESS | Engineers Australia | Not required…`) that rejects every
checklist filename M4 is designed to write there.

**Why M4's 8 runs never errored:** writes through the **Sheets API** (Make) do not enforce data
validation; only the UI and Apps Script do. So the automation path was never affected — but **manual
entry and any Apps Script write to that column have been silently refused all along**, and the cells
carry invalid-data flags. Fixed by `clearChecklistFiledValidation()`.

> **General rule: `insertColumnsAfter()` inherits the left neighbour's validation.** Any script that
> adds a column must explicitly `clearDataValidations()` on it unless a rule is intended.

### 2 · The v2 partial write burned real `YM-2026-#####` codes
The dashboard read **16 clients** after the v3 run added only 7 — so nine orphan rows existed.
`removeDemoRows()` could not see them because their column A does **not** start with `DEMO-`.

**Chain:** v2's block write committed partially (D-293) → those rows had a name in C but a blank code
in A → `master_codes.gs` runs every 5 minutes and issues a code to any row with a name and no valid
code → **nine real sequence numbers were consumed by wreckage.** The `DEMO-` prefix was designed to
prevent exactly this, and a partial write defeated it by leaving column A empty.

**Lesson:** a guard that depends on a value being present fails open when the write that would have
placed it dies halfway. Prefer guards that fail closed. Cleanup added as `resetMasterRows()`, which
logs every row it deletes before deleting it.

**Impact of the burned codes: cosmetic only.** `YM-2026-#####` is a sequence, not a count; gaps are
invisible to the client and nothing references the missing numbers. Not worth resetting the counter.

## D-295 | ✅ DASHBOARD PROVEN AGAINST DATA — and the data found two more defects
`repairAndReseed` ran clean: column Y's inherited rule confirmed as `VALUE_IN_LIST` with X's help text
and stripped (D-294 hypothesis correct), 16 orphan rows removed — **`YM-2026-00001` … `00016`, i.e.
sixteen real codes burned, not nine** — and 14 of 14 demo rows written.

**Every headline number matched the prediction exactly: `14 · 12 · 4 · 1 · 4 · 6`.**
All three grouped views cross-check to 12 open matters independently:
Brisbane/Filipino 5 + Brisbane/Indian 5 + Townsville/Filipino 1 + Townsville/Indian 1 · Documents
Pending 6 + Lodged 3 + Documents Complete 2 + Ready for Lodgement 1 · Rey 5 + RJ 4 + Star 3.
The four intended rows — DEMO-007/008/009/010 — shade red and sort to the top.

**Two defects only visible with data in the sheet:**

**1 · `Last contact` rendered as `46216`.** QUERY output carries **no number format**, so dates arrive
as serials. The single most human column on the dashboard read as a five-digit number. Fixed by
setting `d mmm yyyy` on that output column.

**2 · 🔴 `820/801` vanished — shown as a blank row with a count beside it.** `Visa Type` is a
**mixed-type column**: `485`, `189`, `500` parse as numbers while `820/801`, `SBS`, `Nomination`,
`Skills Assessment`, `EOI`, `ART`, `Bridging` are text. **Google QUERY coerces a column to one type
and nulls the minority.** With their real spread this would have silently erased whole visa lines from
the mix — and partner and employer-sponsored matters are exactly the categories Robinder cares about
for branch performance. Fixed by querying a virtual range built with `ARRAYFORMULA(TO_TEXT(...))`.

**The general lesson, and the reason the seed was worth three failed runs:**
> An empty dashboard renders a broken formula and a correct one identically. Three separate defects —
> the Pending/blank KPI miss (D-292), the unformatted dates, and the type-coerced visa column — were
> all invisible at zero rows and all obvious at fourteen. **Never show a client a report that has not
> been run against data.**

## D-296 | 🔴 The `DEMO-` prefix guard never worked — `master_codes.gs` overwrites it within 5 minutes
Visible in the 13 Aug 19:32 dashboard screenshot: view 4 lists **`YM-2026-00009` · SIMRAN KAUR** and
**`YM-2026-00007` · RAJESH KUMAR** — rows seeded as `DEMO-009` and `DEMO-007`.

**Cause — I misread the code engine.** I wrote (D-293, and in the seeder's own header) that
`master_codes.gs` "only fills a code where column A is blank". It does not. The real test is:

```js
var hasCode = CODE_RE.test(String(codes[i][0]).trim());   // /^YM-\d{4}-\d{5}$/
if (!hasName || hasCode) continue;                        // → anything NOT a valid code gets one
```

`DEMO-001` fails that regex, so the 5-minute trigger treats the row as uncoded and **overwrites the
prefix with a real sequence number**. The guard was inverted from the day it was written.

**Two consequences:**
1. **`removeDemoRows()` silently stopped working** — it matched on a prefix that no longer exists. It
   would have reported "0 demo rows removed" while 14 fake clients sat in MASTER, and
   `CUTOVER-PLAN.md` step 2 depends on that function. **This would have put demo clients into the
   client's live dashboard on cutover day.**
2. More real codes consumed. Cosmetic — a sequence, not a count — but the count is now ~30, not 16.

**Fix:** match on the **email**, not the code. `@example.com` is reserved for documentation and
testing by RFC 2606, no script writes to column F, and no real client will ever have one. The prefix
check is kept as a second condition for the first five minutes after a seed.

**The wider lesson, and it is the same one as D-294:**
> **A guard is only as good as the reading of the code it guards against.** I asserted the code
> engine's behaviour twice — in D-293 and in the script header — without opening `master_codes.gs`.
> Three lines of it would have shown the regex. Verify the mechanism, do not restate the assumption.

**Also fixed this pass:** `setNumberFormat` on a QUERY spill range does not survive — the spilled
result carries its own formatting. `Last contact` was still rendering as `46216` after the previous
"fix". The reliable answer is QUERY's own **`format R 'd mmm yyyy'`** clause inside the query string.

## D-297 | ✅ A-15 WAS A FALSE BLOCKER — M4b and M5b are buildable today, no client involvement
I recorded (D-290) that Make's *Create a Draft* module needs `https://mail.google.com/` and that our
connection only holds `gmail.modify`, so M4b/M5b were blocked pending a reauthorize click. **Verified
from primary sources today. That was wrong.**

**Evidence, three independent confirmations:**

1. **`connections_get(9452213)` — the actual scope strings**, not a count:
   `gmail.modify` · `gmail.readonly` · `userinfo.profile` · `userinfo.email` · `openid`
   Valid to **29 Jan 2027**, created by the client (`authorId 8767171`), on `visa.lodgement@`.
2. **Google's own requirement:** `users.drafts.create` accepts `gmail.modify`. It does **not** require
   the full-access `https://mail.google.com/` scope.
3. **The decisive one — Make's module schemas.** `ActionCreateDraft` declares
   `"x-fetch": {"type":"google-restricted"}`. So does **`TriggerNewEmail`** — and TriggerNewEmail
   **already runs on connection 9452213** (M9, 1 execution, 0 errors, returned a real inbox message
   with full body, D-149). Identical connection requirement, already proven in production.
   `google-restricted` is Make's internal type name for the Gmail connection we hold.

**A-15 is closed. Nothing is needed from the client for the email modules.**

**This is D-271 repeating, and that is the part worth recording.** In July I nearly asked Robinder to
authorise a Gmail connection he had already authorised, because a stale note was carried forward for
three weeks without re-checking. The gate added then was: *run `connections_list` and read the actual
scopes before any access request.* **I ran `connections_list` — and stopped at `scopesCnt: 5`.**

> **`connections_list` returns a scope COUNT. `connections_get` returns the scope STRINGS.**
> A count is not a verification. The gate has to name the call that actually answers the question,
> or it gets satisfied by the call that merely looks like it does.

**Cost of the error:** M4b/M5b sat marked "blocked" for two days, and A-15 was queued to be asked of
the client on the cutover call — a request for permission he had already granted in January.

## D-298 | 🔴 A-04 ANSWERED — role-based access ends the spreadsheet dashboard, and A-14 was chasing the wrong file
Robinder answered the dashboard questions on 14 Aug, six days after we asked. Three things landed at once
and two of them change the plan.

### 1 · Their Google Sheet is a COLD-CALLING LIST — phone numbers, not clients
Two weeks of A-14 chasing was aimed at a file that was never the client database. Combined with D-289
(`Engaged Client Tracker.xlsx` abandoned), the honest conclusion is:
> **They may have no live client database at all.** Files live in ~1,436 OneDrive folders; status lives in
> people's heads and inboxes.

**This is good news, not bad.** It removes the entire cutover risk from `CUTOVER-PLAN.md` — there is no
running system to migrate off, no two-sheets-diverging problem, no freeze date to negotiate. **MASTER
becomes their first real client database.** That is a stronger position to sell and a simpler one to build.
🔴 **Must confirm before relying on it:** *"Where is a client recorded today, from first contact to grant?"*

### 2 · Role-based access — the requirement the Sheet cannot meet
- clients see **their own matter**
- branch managers see **their own branch only**
- Robinder sees **all branches**

**Google Sheets cannot do per-row, per-viewer access.** Permissions are per-file or per-protected-range.
Every workaround (per-branch tabs, IMPORTRANGE into split files) leaks the moment someone gets a link, and
none of it extends to clients at all. **The DASHBOARD tab stays — but it is a director-only artefact.**

Verified alternatives, cheapest first:
| Option | RBAC | Client portal | Cost | Verdict |
|---|---|---|---|---|
| **Looker Studio** | ✅ real — *"Filter by viewer's email"*, unauthorised rows are never returned to the report | ❌ email-by-email, no Workspace groups, every viewer needs a Google login | free | ✅ **staff layer** |
| **AppSheet** | ✅ `USEREMAIL()` security filters | ⚠️ per-user licensing | $$ per user | fallback |
| **Custom app** | ✅ Postgres row-level security — precisely what RLS exists for | ✅ | build cost | ✅ **client layer** |

**Decision: stage it.** Sheet tab (done, director) → Looker Studio (staff, ~1–2 wks, free) → custom portal
(clients, Phase 3). Per org policy the custom app is Next.js App Router + Supabase, and because it holds
real client data it deploys to a **company Vercel team account and company Supabase — never a personal or
free-tier host.**

### 3 · Views + refresh, now specified
active matters · ongoing · 1–2 week chase · deadlines · granted vs refused · **new enquiries this week** ·
who is stuck at which stage. **Laptop primary, responsive on mobile. Hourly refresh.**
Our built tab already covers stage, consultant, branch, dormancy, outcomes and visa mix. **Two genuine
gaps: "new enquiries this week" (needs ENQUIRIES wired in) and "deadlines" (needs M9 — unbuilt).**
🔴 Do not promise deadlines on the demo. It has no column and no source yet.

**Also:** he wants to buy **Microsoft 365** and asked us to guide the purchase — logged as CR-011. Encourage
it: it closes CR-003, where ~150 clients' passports sit on one personal Microsoft account.
