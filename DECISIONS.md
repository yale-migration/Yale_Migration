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
