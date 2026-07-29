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
