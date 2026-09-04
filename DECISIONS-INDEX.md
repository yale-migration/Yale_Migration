# DECISIONS INDEX — one line per decision

`DECISIONS.md` is 708K /     9026 lines. **Do not read it whole — it will eat the session.**
Find the D-number here, then `grep -A 25 "^D-NNN" DECISIONS.md` (or `^## D-NNN`) for that entry only.

Regenerate: `bash scripts/gen_decisions_index.sh`  ·  Generated 2026-09-04 09:38

| # | Decision |
|---|---|
| **D-01** | Google Sheet = database (not SQL/Airtable)  |
| **D-02** | Personal OneDrive handled via Make connection (client OAuth'd once)  |
| **D-03** | SMS channel mapped to WhatsApp  |
| **D-04** | Client codes start YM-2026-00001  |
| **D-05** | Claude API on CLIENT's key/billing  |
| **D-06** | AI drafts NEVER auto-send; only RMA gives migration advice  |
| **D-07** | Everything built inside client-owned accounts, we hold invited access  |
| **D-08** | Automation Google account (the empty one client gave) = the automation workspace  |
| **D-09** | Build order M2→M3→M4/M5→M6→M9  |
| **D-10** | Workspace tracking: this repo + PROJECT-STATE.md + auto-memory  |
| **D-11** | MASTER grain = one row per MATTER, not per person  |
| **D-12** | Existing client folders NEVER renamed/moved  |
| **D-13** | Automated sending via Make↔Gmail connection (client OAuths project1@ once)  |
| **D-14** | Every scenario ships: dry-run → 5 real cases → client 👍 → live  |
| **D-15** | Make paid plan (Core) required at go-live  |
| **D-16** | Routing matrix = TEAM (Indian/Filipino) × VISA TYPE × OFFICE (BNE/TSV/PH)  |
| **D-17** | MASTER import source = OneDrive folder inventory (via Make), cross-checked with ops workbook |
| **D-18** | Existing folder tree is deep: ONE SYSTEM → OFFICE → CLIENT FILES → ENGAGED CLIENTS → TEAM → |
| **D-19** | OneDrive access requires DIRECT share to sharry00010@gmail.com (not a link)  |
| **D-20** | Build order adjusted: M2 structure + code engine BEFORE folder automation  |
| **D-21** | OneDrive UNBLOCKED 2026-07-29 — direct share worked (confirms D-19)  |
| **D-22** | CREDIT BUDGET is a first-class design constraint  |
| **D-23** | DEMO-FIRST sequencing: M3 folder creation is the first shipped deliverable, not M2-D inventory  |
| **D-24** | WRITE access must be proven before any M3 work  |
| **D-25** | WRITE access test FAILED 2026-07-29: POST create folder → [403] Access denied  |
| **D-26** | M3 split into 3A (no-write) and 3B (needs write) so a client-side permission never idles the build |
| **D-27** | ROOT CAUSE of write 403 is CONNECTION IDENTITY, not permission  |
| **D-28** | Code engine uses onEdit AND a 5-minute time trigger  |
| **D-29** | CORRECTS D-27 — the real root cause of write 403 is READ-ONLY OAUTH SCOPES  |
| **D-30** | Use Make "Credential requests" to get the client-authenticated connection  |
| **D-31** | ✅ WRITE ACCESS ACHIEVED 2026-07-29 07:28Z — confirms D-29 (scopes were the fault, not identity) |
| **D-32** | 🚨 S56 DETECTION MUST NOT KEY ON "Section 56"/"s56"  |
| **D-33** | S56 deadline must be COMPUTED, not read  |
| **D-34** | Dormancy — not reply speed — is the real pain  |
| **D-35** | Classification must be attachment-driven and quote-stripped  |
| **D-36** | Language policy: mixed Taglish/Tagalog/Ilocano is NORMAL, do not normalise  |
| **D-37** | ⚠️ COMPLIANCE FLAG raised: no MARN in any outbound email  |
| **D-38** | Client-supplied "EMAIL TEMPLATE FOR S56 REQUEST AND FOLLOW UP.docx" is MISLABELLED/EMPTY  |
| **D-39** | M3 folder scenario design decisions  |
| **D-40** | Roadmap rewritten v6 with TASK IDs + expected outputs  |
| **D-41** | The FOLDER TREE encodes the client lifecycle — Stage must map to folder location  |
| **D-42** | "Engaged Client Tracker.xlsx" is a live client register (208 revisions) — candidate source of |
| **D-43** | Team branches are ASYMMETRIC: "CLIENT FILES" (main, rev 239, legacy short id !529) + |
| **D-44** | SCALE REALITY: ~1,436 client folders in ENGAGED CLIENTS (698 main + 738 Filipino), not the |
| **D-45** | Existing folder naming is CHAOTIC → the tracker file becomes the primary import source  |
| **D-46** | Team routing CONFIRMED by evidence  |
| **D-47** | 🚨 T1.4c: CLIENT FOLDERS ARE FLAT — no sub-folders exist in practice  |
| **D-48** | T1.5: "Engaged Client Tracker.xlsx" is readable via the Graph workbook API — 2 worksheets  |
| **D-49** | 🎯 M2 IMPORT SCOPE RESOLVED: the tracker is the ACTIVE work list (49 rows), the folder tree is the |
| **D-50** | Tracker structure: rows 1–3 are TITLE rows, headers start at row 4/5  |
| **D-51** | Keep BOTH ids: our `YM-2026-#####` (canonical) AND their `CL-###` (cross-reference column B)  |
| **D-52** | ADD the `Location` (Onshore/Offshore) column — we had missed it  |
| **D-53** | Split their free-text Visa Type into `Visa Type` + `Visa Variant`  |
| **D-54** | Email — not phone — is the identity/dedupe key  |
| **D-55** | Their `48hr Alert` column contains a #REF! error — the alerting they wanted is BROKEN  |
| **D-56** | Import policy: FLAG contradictions, never silently fix them  |
| **D-57** | `Admissions Tracker ` = 15 cols × 50 rows (their enrolment pipeline)  |
| **D-58** | ✅ CLIENT ANSWERED — S56 TIMING RULES (authoritative)  |
| **D-59** | ✅ CLIENT ANSWERED — no S56 email template exists  |
| **D-60** | ✅ CLIENT ANSWERED — MARN: Robinder Pal Singh is the supervising RMA and **the MARN SHOULD appear** |
| **D-61** | ✅ CLIENT ANSWERED — all ~1,400 folders are LIVE clients, retained deliberately  |
| **D-62** | ✅ CLIENT ANSWERED — 5 SUB-FOLDERS, not 10  |
| **D-63** | 🚨 CORRECTS/REFINES D-32 — the EMAIL SUBJECT *does* say "s56"  |
| **D-64** | 🚨 NEW MAILBOX DISCOVERED: Department S56 emails arrive at `visa.lodgement@yalemigration.com.au`  |
| **D-65** | Department sender addresses are VISA-LINE SPECIFIC  |
| **D-66** | Machine-parseable metadata footer in Department emails — use it for routing  |
| **D-67** | Internal routing chain is 3 hops — the classifier must handle forwarded chains  |
| **D-68** | Identifier regexes CORRECTED  |
| **D-69** | NEVER auto-reply to Department emails  |
| **D-70** | Their real S56 client-email wording captured (3 examples) — template can now be drafted (closes D-59) |
| **D-71** | Department letter attachments follow ImmiAccount naming: `application - YYYY-MM-DDTHHMMSS.mmm.pdf`  |
| **D-72** | 🚨 THIRD mislabelling instance: "CoE Certificate (10F566341).pdf" is actually blank **Form 80**  |
| **D-73** | Their S56 workflow ATTACHES standard blank forms to the client — and they already own the library  |
| **D-74** | Attachment→email attribution (per Sharjeel's note "3 from 1 mail, 1 from another")  |
| **D-75** | Two newly-identified M9 unknowns are DEFERRED, not asked now — logged as an M9 START GATE  |
| **D-76** | `yalemigration.com.au` mail = **GOOGLE WORKSPACE** — resolved by public DNS, not by asking the client  |
| **D-77** | ROOT CAUSE of "I can't find the delegation step"  |
| **D-78** | ⚠️ CORRECTS D-77's Part 2 — Gmail delegation to an EXTERNAL personal Gmail is NOT POSSIBLE  |
| **D-79** | Delegation would NOT have unblocked M9 even if it were possible — the Gmail API ignores delegated |
| **D-80** | ✅ FINAL, VERIFIED, FROZEN: the M9 mailbox requirement is ONE action — and we already knew the owner  |
| **D-81** | PROCESS RULE (self-imposed, from the D-77→D-80 churn)  |
| **D-82** | Method CONFIRMED after second deep audit — plus a favourable finding and 5 pre-loaded contingencies  |
| **D-83** | CORRECTION to the runbook steps + Robinder's Make login is already in place  |
| **D-84** | ✅ CONFIRMED by screenshot: the Connections page has NO "Add" button  |
| **D-85** | 🔴 GOVERNANCE DISCREPANCY — the Make org may be OURS, not the client's  |
| **D-86** | Client authorizes on HIS OWN machine — our screen-share proposal was wrong  |
| **D-87** | Make **Credential requests** is the ideal feature but NOT available on our plan  |
| **D-88** | Therefore Robinder needs a Make LOGIN — this is the real prerequisite, not delegation  |
| **D-89** | ✅ RESOLVED — D-85 ownership worry was UNFOUNDED; no Make invite is needed  |
| **D-90** | ✅ ESTABLISHED WORKING METHOD WITH THIS CLIENT: screen-share where ROBINDER shares HIS screen and types  |
| **D-91** | Verification step corrected against Make's Gmail module docs — plus the "Choose where to start" trap  |
| **D-92** | PROCESS OVERHAUL — 5 mandatory gates, a focus lock, and STATUS.md  |
| **D-93** | Root-cause of the 31 Jul failures: the setup was WRITE-optimised, not READ-optimised  |
| **D-94** | ✅ ROSTER GAP CLOSED from a document we already held: `workvisa.bne@` = **Robinder Singh**  |
| **D-95** | SBS / employer-sponsorship pipeline observed end-to-end — feeds M4/M5  |
| **D-96** | Internal workflow: approvals are forwarded `info@` → `manali@` with the body "for posting"  |
| **D-97** | Gmail connection created OK but returns `[403] insufficient authentication scopes` — SAME failure class |
| **D-98** | Contents mapping for the 5 sub-folders — validated against REAL client files (D-47)  |
| **D-99** | Folder NAMING for employer/sponsorship matters — the convention had a gap  |
| **D-100** | ✅ ONE folder set for ALL visa types — folders = WHERE documents go, checklists = WHAT is required  |
| **D-101** | ❌ DROP both proposed client questions (partner folder · sponsor naming) — audited, neither qualifies  |
| **D-102** | "02 Education & Employment" for NON-students — holds up; empty folders are acceptable by design  |
| **D-103** | ⚠️ SUPERSEDED by D-132 — file DELETED 2 Aug as a conflicting duplicate (G6). Folder-contents chart written per visa type — `docs/FOLDER-CONTENTS-CHART.md`  |
| **D-105** | ⚠️ SUPERSEDES D-100 AND D-102 — client is RIGHT; folders vary by VISA CATEGORY (5 categories, not 20 |
| **D-106** | 🚨 DEEP AUDIT OF THEIR OWN CHECKLISTS — the document world is MULTI-DIMENSIONAL; my folder designs were |
| **D-107** | Folder structure DRAFTED as 3 sets — `docs/FOLDER-STRUCTURE-BY-VISA-CATEGORY.md`  |
| **D-108** | Nisha — what we actually know, and it is NOT a blocker  |
| **D-117** | ✅ S56 CLIENT-NOTIFICATION TEMPLATE RECEIVED — closes open ask #3 (was pending since 30 Jul)  |
| **D-118** | 🚨 THE EVIDENCE FILE — full 482 Sevial s56 thread (25 messages, 2 Jun → 30 Jul 2026)  |
| **D-119** | Technical constraints discovered in the Sevial thread — affect M9 attachment handling  |
| **D-120** | Recurring client questions that the request email should pre-empt  |
| **D-121** | 485 Ronaya thread — ONE s56 can cover MULTIPLE APPLICANTS  |
| **D-122** | 🔴 RELATIONSHIP EVIDENCE IS NOT PARTNER-VISA-ONLY  |
| **D-123** | Department→consultant hop-1 latency measured: 3 days  |
| **D-124** | ✅ ROSTER FULLY CLOSED — "Nisha" is a former employee  |
| **D-125** | ⚠️ QUALITY ISSUE: Yale is sending the mislabelled Form 80 to clients  |
| **D-126** | ✅ CLIENT APPROVED THE FOLDER STRUCTURE — three instructions, all adopted  |
| **D-127** | Relationship-evidence folder is now JUSTIFIED, not optional (resolves D-101's deferred question)  |
| **D-129** | 🔴 ARCHITECTURE.md was STALE v1 — rewritten to v2 before it caused a wrong build  |
| **D-130** | Folder-set question CLOSED — no outstanding item with Sharjeel  |
| **D-131** | 🔴 DECISION-NUMBER COLLISION — 7 duplicate IDs found and repaired  |
| **D-132** | 🔴 MY RECONSTRUCTED FOLDER SETS WERE WRONG — replaced with the real checklist-derived sets  |
| **D-133** | ✅ FULL ALIGNMENT AUDIT PASSED (2 Aug) — plus three more defects found and fixed  |
| **D-134** | ✅ CLIENT SIDE IS COMPLETE — nothing is blocked on Robinder  |
| **D-135** | 🐛 REAL DEFECT FIXED IN `master_codes.gs` — duplicate-code race condition  |
| **D-136** | 🔴 TWO T3 PLACEMENT GAPS — could misfile folders in the client's LIVE drive  |
| **D-137** | ✅ SECOND-PASS DEEP AUDIT COMPLETE — cleared to build  |
| **D-138** | 🔴 T2 BLOCKER FIXED — `SBS` and `Nomination` routed to folder SET 2 but were REJECTED by the dropdown  |
| **D-139** | 🔴 SHIP-LADDER ACCEPTANCE CRITERIA CONTRADICTED THE BUILD  |
| **D-140** | Op-count and authority-chain contradictions cleaned up  |
| **D-141** | Renumber collateral repaired — `D-128` never existed  |
| **D-142** | ✅ EIGHT CLIENT ANSWERS existed only in `docs/PROJECT-STATE.md` — now decisions of record  |
| **D-143** | 🔴 SECURITY — three client-PII files were tracked and pushed to GitHub  |
| **D-144** | Tracking granularity: 143 client files on disk, 17 mapped file-by-file — recorded, not hidden  |
| **D-145** | 🔴 T2 WAS UNSAFE TO RUN — the target tabs are NOT empty. Scripts hardened, not just documented  |
| **D-146** | Verification pass caught FIVE defects introduced BY the previous fixes  |
| **D-147** | 🐛 STALE REGEX in `docs/M9-EMAIL-AI-SPEC.md` — D-68's correction was never applied to the spec  |
| **D-148** | Stop hard-coding counts in prose — they drift every single time  |
| **D-149** | ✅ M9 MAILBOX VERIFIED END-TO-END (3 Aug) — the s56 pipeline's foundation is proven  |
| **D-150** | ⚠️ SCHEDULE vs ON/OFF are DIFFERENT THINGS in Make — verified safe  |
| **D-151** | Sequencing correction: `preflightCheck` lives in `setup_master_sheet.gs`, which was not yet pasted  |
| **D-152** | ✅ PREFLIGHT RESULT (3 Aug) — safe to run `setupEverything`, one cleanup needed first  |
| **D-153** | Operator identity: script runs as `sharry00010@gmail.com`, sheet is client-owned — fine now, matters |
| **D-154** | Housekeeping found in the Make + Apps Script screenshots — cosmetic, fix before handover  |
| **D-155** | 🐛 SHIPPED BUG — `setupEverything` crashed on the live sheet: validation cleared AFTER the header write  |
| **D-156** | ✅ The 2 legacy MASTER rows were confirmed FAKE test data  |
| **D-157** | ✅ T2.1 + T2.2 COMPLETE — MASTER and ENQUIRIES built successfully on the live sheet (3 Aug, 02:00)  |
| **D-158** | ⚠️ TRIGGER SETUP — the dialog defaults are WRONG for our case, and one trap must be avoided  |
| **D-159** | ✅✅ T2 COMPLETE — the client-code engine is LIVE and working (3 Aug)  |
| **D-160** | Three T2 tail items still open — small but two of them are client-visible  |
| **D-161** | ✅ T2 FULLY CLOSED — all three tail items verified (3 Aug)  |
| **D-162** | 🔴 TIMEZONE MISMATCH FOUND — will corrupt s56 deadline maths if not fixed before M5/M9  |
| **D-163** | ✅ TIMEZONE FIXED AND PROVEN — all three clocks now Australia/Brisbane (3 Aug)  |
| **D-164** | Make org region is EU + org still named "My Organization" — handover items, not blockers  |
| **D-165** | 🔴 M3 REDESIGNED BEFORE BUILD — the Router approach was wrong for Make  |
| **D-166** | ⚠️ The demo needs FOUR fields typed, not one — fix the demo script now  |
| **D-167** | Make↔Google Sheets connection: authorize as **`project1@`**, not `sharry00010@`  |
| **D-168** | 🔴 OPEN QUESTION SURFACED — who actually OWNS the MASTER DATABASE sheet?  |
| **D-169** | Two corrections to my own Module-1 instructions  |
| **D-170** | 🐛 SPEC BUG CAUGHT BY THE DRY RUN — Make's Sheets field names carry the column letter  |
| **D-171** | ✅ MODULE 1 VERIFIED — filter and idempotency both proven  |
| **D-172** | ✅ MODULE 1 FULLY VERIFIED — routing fields confirmed with exact casing (3 Aug)  |
| **D-173** | Module 2 built as ONE "Set multiple variables" module — two variables, no Router (confirms D-165)  |
| **D-174** | 🐛 MY FORMULA FORMAT WAS WRONG — `{{ }}` must wrap the WHOLE expression, not each field  |
| **D-175** | 🐛 `&` IS NOT A STRING-CONCATENATION OPERATOR IN MAKE — both Module-2 formulas failed silently  |
| **D-176** | 🔴🔴 ROOT CAUSE FOUND — in Make, typed field references DO NOT BIND. Click them, always  |
| **D-177** | 🎉 FIRST REAL ARTIFACT CREATED — folder written to the client's live OneDrive (3 Aug, 17:33Z)  |
| **D-178** | 🔴 CLEANUP DEBT — a test folder now exists in the client's LIVE OneDrive  |
| **D-179** | 🔑 MAKE'S REAL FIELD SYNTAX FOUND — ZERO-BASED NUMERIC INDEX, not name or column letter  |
| **D-180** | ✅ SECOND 201 — dynamic name confirmed working  |
| **D-181** | ⚠️ UNVERIFIED — which scenario the last run executed in  |
| **D-182** | 🎉🎉 T3 CORE WORKING — full client folder + all 6 sub-folders created automatically (3 Aug 19:20Z)  |
| **D-183** | 🔴 CLEANUP DEBT — FIVE test folders now in the client's live OneDrive  |
| **D-184** | ✅ SUB-FOLDER CHAIN RE-CONFIRMED on a second full run (3 Aug 19:37Z)  |
| **D-185** | 🔴 WRITE-BACK MODULE (15) IS BROKEN IN TWO WAYS — must be fixed before any schedule  |
| **D-186** | FIX for the 6× execution: Array aggregator between the Iterator and the write-back  |
| **D-187** | 🎉🎉🎉 T3 COMPLETE — `YM-M3-folder-create` works end to end (3 Aug 19:54Z)  |
| **D-188** | ✅ `12. body: webUrl` chip CONFIRMED CORRECT — do not touch  |
| **D-189** | 🔴🔴 CRITICAL AUDIT FINDING — the built scenario is DEMO-READY but NOT PRODUCTION-READY  |
| **D-190** | 🔴 PRODUCTION-READINESS AUDIT — 5 blockers, 4 high-severity gaps. Full report: `PRODUCTION-READINESS.md` |
| **D-191** | STRATEGY DECIDED — Demo first, then harden M3 into the REFERENCE IMPLEMENTATION, then M4+  |
| **D-192** | `DEFINITION-OF-DONE.md` created — 12-point gate every scenario must pass before being switched on  |
| **D-193** | 🔴 OneDrive 12 Body mapping LOST ITS BINDING — and it proves blocker B2 is real  |
| **D-194** | Idempotency test (T3.1) NOT yet run — the input was changed  |
| **D-195** | ✅✅✅ M3 WORKING END-TO-END WITH LIVE SHEET DATA (4 Aug 19:38Z)  |
| **D-196** | Cosmetic: separator is `-` not ` – ` (space en-dash space)  |
| **D-197** | ⭐ TRUE ROOT CAUSE OF THE `" – "` / `-` FOLDER BUG — the Search Rows filter matched BLANK rows |
| **D-198** | Array aggregator 19 REMOVED; write-back moved BEFORE the iterator  |
| **D-199** | `trim()` added to both name components  |
| **D-200** | Module 2 column range narrowed `A1:ZZZ1` → `A1:Z1`  |
| **D-201** | Modules renamed to intent (DoD item 1)  |
| **D-202** | Blueprint editing via the Make MCP is now the primary repair tool  |
| **D-203** | ⚠️ TRAP: Make's "Run once" executes the BROWSER'S UNSAVED state, not the saved blueprint  |
| **D-204** | B4 failure mode CHANGED (not closed) by moving the write-back before the iterator  |
| **D-205** | Measured cost is now 10 ops/client, not 11  |
| **D-206** | ✅ M3 medium item CLOSED — the 7 `TEST DEMO` folders are gone from the live Filipino team folder  |
| **D-207** | ✅ H1 IDEMPOTENCY PROVEN (5 Aug)  |
| **D-208** | ✅ B1 CLOSED — routing built, WITHOUT a Set-variables module  |
| **D-209** | Unroutable rows are BLOCKED, not misfiled  |
| **D-210** | ✅ B2 CLOSED — whitelist sanitization, not blacklist  |
| **D-211** | ✅ SET 3 nesting built — 820 / 801 as sub-folders (client's 2 Aug instruction)  |
| **D-212** | Measured cost per client, as built  |
| **D-213** | ✅ FULL TEST MATRIX PASSED — the client's "5 real cases" acceptance bar (5 Aug, exec |
| **D-214** | ⭐ `A0BABA3C2640082C!529` CONFIRMED = the INDIAN team's client folder  |
| **D-215** | ✅ B3 CLOSED — error handlers on all three OneDrive calls  |
| **D-216** | ⬜ ONLY REMAINING M3 GAP: SET 2 is unproven  |
| **D-217** | ✅ SET 2 PROVEN — D-216 CLOSED. **All three folder sets and both teams now verified in the live |
| **D-218** | Not a bug: `Date Added` for row 7 reads **2026-08-06** while rows 2–6 read 2026-08-05  |
| **D-219** | 🟢 M3 VERDICT: PRODUCTION-READY FOR BRISBANE — three named conditions, none of them code  |
| **D-220** | 🟠 CONCURRENCY FINDING — the write-back is POSITIONAL, so a row deleted mid-run could write the link |
| **D-221** | Trigger limit of 5 rows/run is deliberate and adequate  |
| **D-222** | Concurrency verified SAFE at the three other layers  |
| **D-223** | ❌ THREE OF MY OWN M4 FINDINGS WERE WRONG — withdrawn before they reached the client  |
| **D-224** | 🔴🔴 REAL AND SERIOUS — every GSM checklist filename points at the WRONG document. Systematic |
| **D-225** | ✅ Both 485 defects CONFIRMED from primary source (previously only asserted in our own READ ME)  |
| **D-226** | M4 selector needs ONE new MASTER column, and one derivation confirmed  |
| **D-227** | "Adam" is NOT a Yale contact — do not address any Yale message to him  |
| **D-228** | M4 question list FINALISED after a second full-tree audit — 3 asks, not 9  |
| **D-229** | 🔴 COMPLIANCE QUESTION only the RMA can answer — must be asked before M4b sends anything  |
| **D-230** | ✅ CLOSED BY CLIENT — TOWNSVILLE and PHILIPPINES are OUT OF MVP SCOPE  |
| **D-231** | Unroutable rows: keep the silent block, make it visible in the SHEET not in Make  |
| **D-232** | 🔴 EDGE CASE FIXED — module 15 had no error handler, which could loop a row forever  |
| **D-233** | Edge cases audited and ACCEPTED (documented, not fixed)  |
| **D-234** | ✅ ALL FIVE CLIENT QUESTIONS ANSWERED — `New-docs/ANSWER.docx`, 6 Aug  |
| **D-235** | ✅ FIVE OF SIX DOCUMENT DEFECTS FIXED — verified by extracting each new file's own heading  |
| **D-236** | 🔴 STILL OPEN — the new "190" file is the 491 checklist again  |
| **D-237** | Skills Authority column = FIVE options, not four  |
| **D-238** | `LISTS OF COURSES FOR PR.docx` does NOT solve skills-authority derivation — checked, not assumed  |
| **D-239** | Minor, logged not raised: two identical-titled points calculators  |
| **D-240** | Scope guard on *"if we can make better checklists that would be fine"*  |
| **D-241** | ⭐ The client's "updated documents" were RENAMES, not rewrites — and that CONFIRMS the audit  |
| **D-242** | Canonical checklist set established: **67 files on disk, 47 unique documents, 20 duplicated across |
| **D-243** | 485 selector matrix RESOLVED — 8 variants, both ambiguities closed without asking the client  |
| **D-244** | ✅ Connection ownership better than recorded — only TWO handover risks, not three  |
| **D-245** | ✅ MASTER column X `Skills Authority` LIVE (7 Aug)  |
| **D-246** | ❌ ASSUMPTION WRONG — `BNE → APPLICATION FORMS` is the COLLEGES folder, not visa templates  |
| **D-247** | ✅ CHECKLIST LIBRARY HOME CONFIRMED — `INFORMATION HUB → CLIENT DOCUMENT CHECKLISTS`  |
| **D-248** | ✅ Folder LIVE — `INFORMATION HUB → CLIENT DOCUMENT CHECKLISTS`  |
| **D-249** | 🔴 PRE-UPLOAD SAFETY SCAN — two checklists are also FEE QUOTES. Never auto-send either  |
| **D-250** | Storage: the 25 MB upload lands on the CLIENT's quota, not ours  |
| **D-251** | ✅ M4 SETUP LIVE — MASTER is now 25 columns (A–Y) + a `CHECKLIST MAP` tab  |
| **D-252** | ✅ `YM-M4-checklist-file` BUILT (id 6867537, 7 Aug 21:59Z, `isinvalid: false`)  |
| **D-253** | 🔒 M4 SECURITY REVIEW — five checks, all pass  |
| **D-254** | 🟠 OPERATIONS BUDGET IS THE NEXT REAL DEADLINE  |
| **D-255** | 🔴 `text:contains` / `text:notcontains` ARE NOT VALID MAKE FILTER OPERATORS — they fail SILENTLY  |
| **D-256** | Diagnostic rule re-proven, and it worked in ONE message this time  |
| **D-257** | ✅ M4a WORKING — all three routes correct on one run (7 Aug)  |
| **D-258** | ✅✅ M4a COMPLETE — all three verifications passed (7–8 Aug)  |
| **D-259** | 🟠 NO DUPLICATE-CLIENT DETECTION — surfaced by the client's own question  |
| **D-260** | ✅ M5a BUILT — dormant-file detector in APPS SCRIPT, deliberately not Make  |
| **D-261** | ✅ M5a PROVEN — four runs, all correct (8 Aug)  |
| **D-262** | ⭐ HANDOVER RISK SMALLER THAN RECORDED — Apps Script is ALREADY client-owned  |
| **D-263** | 🔴 D-262 PARTIALLY WRONG — one trigger IS still personally owned, and now we can see it  |
| **D-264** | 🟡 Trigger ownership HALF fixed — safe, but not finished  |
| **D-265** | Housekeeping found in the tab bar: an orphan `Sheet4`  |
| **D-266** | ✅ `48hr Alert` question ANSWERED — and it validates M5a  |
| **D-267** | ❌ OUR OWN VAGUENESS BLOCKED TWO OF THREE TEAM QUESTIONS  |
| **D-268** | `CLIENT-ASKS.md` created — the outstanding balance, separate from the chronological log  |
| **D-269** | 🔴 ROSTER IS INCOMPLETE — `Mershe Ventura` answered our team questions and is on NO list we hold  |
| **D-270** | Batch 5 file relocated out of the repo root  |
| **D-271** | ⭐⭐ CORRECTION — THE GMAIL CONNECTION ALREADY EXISTS AND CAN SEND. A-03 was a false blocker  |
| **D-272** | The real M4b question is much smaller: WHICH MAILBOX should drafts appear in?  |
| **D-273** | Make paid plan removed from the outgoing message on Sharjeel's instruction  |
| **D-274** | 🔴 DOCUMENTATION DRIFT AUDIT — the control files had fallen 6 days behind reality  |
| **D-275** | ✅ FULL-SYSTEM VERIFICATION, 11 Aug — everything reconciles  |
| **D-276** | 🔴 NEAR-MISS — draft message implied M3/M4 run automatically. THEY DO NOT  |
| **D-277** | Confirmed: the dashboard and CRM questions are STILL unanswered  |
| **D-278** | 🔴 CAUGHT PRE-SEND — the dashboard proposal promised a view we cannot build  |
| **D-279** | Dated claims rot — never put "this morning" in a message that may not send today  |
| **D-280** | ✅ A-02 CLOSED — the correct Subclass 190 checklist arrived and is verified  |
| **D-281** | Mershe Ventura authored the 190 checklist as well as the tracker answers — she is not admin support  |
| **D-282** | 🔴 UNVERIFIED DEPENDENCY — nobody has confirmed Looker Studio is available on their Workspace  |
| **D-283** | Likely reason Robinder never answered the dashboard questions — our own message deferred it  |
| **D-284** | Dashboard dependency check — no hard blockers, three things to line up  |
| **D-285** | 🔴 MY OMISSION — adding a checklist needs THREE steps, not two. I gave two  |
| **D-286** | ⭐ Mershe's answer partially resolves A-04 — use it instead of re-asking  |
| **D-287** | Read of the client's silence — it is sequencing, not frustration  |
| **D-288** | 🔴 NEVER PRE-ENCODE A URL FOR MAKE'S `makeApiCall` — Make encodes it again  |
| **D-289** | 🔴 THE TRACKER WE SPENT TWO WEEKS ANALYSING IS ABANDONED — they moved to Google Sheets |
| **D-290** | ⚠️ PARTIAL REVERSAL OF D-271 — Make's Gmail draft module needs a WIDER scope than we have |
| **D-291** | ✅ A-01 DOWNGRADED — the Make paid plan is NO LONGER what blocks M3 and M4 going live |
| **D-292** | Strict dropdowns make `setValues()` all-or-nothing — and the error names the wrong column |
| **D-293** | `setValues()` is LAZY — validation fires at `flush()`, so a try/catch around the write is useless |
| **D-294** | 🔴 REAL DEFECT — column Y silently inherited column X's dropdown, and a failed write burned real client codes |
| **D-295** | ✅ DASHBOARD PROVEN AGAINST DATA — and the data found two more defects |
| **D-296** | 🔴 The `DEMO-` prefix guard never worked — `master_codes.gs` overwrites it within 5 minutes |
| **D-297** | ✅ A-15 WAS A FALSE BLOCKER — M4b and M5b are buildable today, no client involvement |
| **D-298** | 🔴 A-04 ANSWERED — role-based access ends the spreadsheet dashboard, and A-14 was chasing the wrong file |
| **D-299** | 🔒 THE DATABASE QUESTION, SETTLED — Google Sheet now, Postgres at the portal, Microsoft NEVER |
| **D-300** | 🔑 THEIR REAL CLIENT DATABASE FOUND — and it explains everything we could not explain |
| **D-301** | 🔴 The M365 purchase has an email-killing step in it — and he may not need to buy at all |
| **D-302** | Competitor research — where we already win, and the one gap that matters |
| **D-303** | 🔴 Their tracker has NO consultant and NO branch column — two dashboard views have no source |
| **D-304** | 🔴 We have static exports, not live data — the two Google Sheets are still not shared with us |
| **D-305** | 🔑 `YALE BRISBANE OFFICE WORK.xlsx` IS THE REAL OPERATIONAL SYSTEM — and we had it all along |
| **D-306** | 🔴🔴 CRITICAL — ~1,200 credential records in plaintext, including government portal logins |
| **D-307** | 🔑 TWELVE PROCESS-FLOW DIAGRAMS, NEVER OPENED — and one of them explains the Microsoft request |
| **D-308** | 🔑 `STUDENTS.xlsx` — and the answer to "who handles each client": IT IS THE TAB NAME |
| **D-309** | Two last checks before declaring the audit complete — one useful, one a warning |
| **D-310** | 🔴🔴 WE HAD THE STAFF EMAIL ROSTER SINCE 26 JULY — and five of our own files said we did not |
| **D-311** | 🔴 THREE-AGENT AUDIT, 15 Aug — the consolidated correction |
| **D-312** | ⚠️ I TRIAGED TWO ITEMS AS "LOW PRIORITY". BOTH WERE WRONG. Checked 15 Aug. |
| **D-313** | ✅ "Hardiek Patel" identified — closes the last unknown from the audit |
| **D-314** | ✅ ALL 12 WORKFLOW SOPs READ — gap closed. Full analysis in `CLIENT-SOP-WORKFLOWS.md` |
| **D-315** | 🔧 E1 AND E2 FIXED IN PRODUCTION — plus four findings the fix work turned up |
| **D-316** | 📊 CENSUS OF ALL 66 TABS — the email/office/team question, answered properly |
| **D-317** | 🧹 A HYGIENE GATE — because I put a client's name in the repo while writing about client PII |
| **D-318** | 🔑 The OneDrive account swap — files do not move, and the blueprints do not change |
| **D-319** | 🔴 COMPLETENESS AUDIT — four MASTER columns the build reads and no question asked for |
| **D-320** | 🔴 The staleness check I built verified nothing — because I put the answer in the prompt |
| **D-321** | 🔧 M4b groundwork — every identifier verified, and a validator that lies |
| **D-322** | M5b routes through M4, not a third scenario — and needs an exact-match flag column |
| **D-323** | Ownership audit, 17 Aug — four defects the module-by-module work never would have found |
| **D-324** | The teardown path audit — three defects in the thing that removes the demo data |
| **D-325** | ⛔ RETRACTING the 186 finding, and the real bug it was hiding |
| **D-326** | The run log caught a global-scope collision, and view 4 disagreed with its own KPI |
| **D-327** | ENQUIRIES import — and 47% of their enquiry dates are wrong in the source file |
| **D-328** | M6 enquiry follow-up built — and the baseline lesson applied BEFORE it bit |
| **D-329** | Enforcing our own rules, and the hole that testing the enforcement exposed |
| **D-330** | The team's answers — 12 of 19 closed, the import unblocked, and two premises overturned |
| **D-331** | Requirements audit — two inputs never asked for, and a module shipped under the wrong number |
| **D-332** | Second-pass audit — we audited against our own transcription, not the contract |
| **D-333** | Forensic pass on the two returned files — six data issues, and what is actually unanswered |
| **D-334** | I leaked two client names into the repo, the gate caught it, and I committed anyway |
| **D-335** | Final pre-send reconciliation — six items were missing from my own email |
| **D-336** | "Did they ask anything from us?" — yes, and I had missed the biggest one twice |
| **D-337** | Access IS granted — verified, and the verification handed us three things we did not have |
| **D-338** | Their live intake sheet has none of the fields the automation needs — and that IS the cutover |
| **D-339** | M8 finished — stop-on-reply, and being honest about what "automatic" means |
| **D-340** | The Anthropic key existed all along — and the module can read PDFs, which changes M9 |
| **D-341** | Friday call runbook — and the OneDrive instruction we have been carrying is impossible |
| **D-342** | M9 built the safe way — and four Make/API facts learned by probing, not reading |
| **D-343** | "We already asked them, right?" — yes, but the record could not prove it |
| **D-344** | Rey asked for a user guide — which is M11, and it unlocks the blockers |
| **D-345** | Auditing the guide before it went out — three defects, one of them a false claim to the client |
| **D-346** | Second guide audit — the layout fix moved the content the prose pointed at |
| **D-347** | "No new login if avoidable" was honoured for nobody because it could not be honoured for everybody |
| **D-348** | Two of his four dashboard views read ✅ for six days while being wrong |
| **D-349** | A cron that silently succeeds without syncing is worse than one that fails loudly |
| **D-350** | The checklist confirmation we had been chasing for two weeks was a confirmation of a NUMBER |
| **D-351** | We addressed the client by a colleague's name for two weeks, and nobody corrected us |
| **D-352** | Their answer dissolved three of our own open questions, and we nearly missed it |
| **D-353** | 🔴 `Citizenship` is not in MASTER's dropdown, and the import contains two of them |
| **D-354** | The coverage check verifies our repo, not the folder M4 actually reads from |
| **D-355** | Gopi joined and left in four days. A hardcoded roster is a design that is permanently stale |
| **D-356** | Yale's client contact details are not in Yale's systems |
| **D-357** | We asked for something they had already given us — inside a three-part ask, and the whole ask was ignored |
| **D-358** | I-14 was ticked on the form's QUESTIONS. Its ANSWERS were never asked for |
| **D-359** | Three design refusals in C-1, each one a defect we have already paid for |
| **D-360** | The 190 checklist WAS uploaded. Only the record of it was missing — again |
| **D-361** | The fix is in the repo; the project is running the old copy |
| **D-362** | D-353 closed end to end — and the verifier tested the right thing |
| **D-363** | M7's second half built — and the change surfaced three hardcoded positions, two of which fail silently |
| **D-364** | The derived constant I wrote to prevent a silent bug would have broken the entire project |
| **D-365** | 600 and Citizenship received. CR-013 is down to ART, which has no path |
| **D-366** | Our import source is frozen at 18 August. Every correction the client has made since is invisible to it |
| **D-367** | The response sheet was shared, and reading it may close the Brisbane form question too |
| **D-368** | Apps Script has been emailing failure summaries since 12 August and nobody opened one |
| **D-369** | My load-order bug reached production and broke a live 5-minute trigger |
| **D-370** | The enquiry data is ~7× larger than the source we built the import from |
| **D-371** | Confirmed by stack trace, and closed. Two failures, ten minutes, four clean runs since |
| **D-372** | Two screenshots that look like alarming evidence and are evidence of nothing |
| **D-373** | The daily triggers are real, correct and owned by the right account |
| **D-374** | Go-live gate item 2 verified still open, and the correct schedule shape found by validation |
| **D-375** | Go-live gate item 2 CLOSED — and the deletion is not being done, for a reason found by checking |
| **D-376** | The Aug 12 and Aug 14 failures were Google's, not ours. D-368 fully closed |
| **D-377** | C-1 built against the real sheet, and M9's Apps Script half scheduled |
| **D-378** | The 911 duplicates are the dedupe working — and they overturn my A-46 conclusion |
| **D-379** | The blueprint import created a SECOND scenario, not an update — and it arrived unscheduled |
| **D-380** | M6's decision layer built — the channel was never the module |
| **D-381** | The two response tabs are ONE form's data, copied and continued — not two forms |
| **D-382** | D-354 fully closed — all 23 checklists are in OneDrive, and the sets match exactly |
| **D-383** | "0.0 hours are ours" was true of the hours table and false of the project |
| **D-384** | The runbook was rebuilt and A-43's templates written — and both jobs found a defect the register did not know about |
| **D-385** | The documents got a gate, and writing it proved the point four more times |
| **D-386** | The import-day checklist did not set the baselines, and the plan is the only place that matters |
| **D-387** | The quote contradicted itself by $105, in the half a reader says out loud |
| **D-388** | The unbilled position had five owners and no reader, so it never got said |
| **D-389** | The dashboard mapped ENQUIRIES `Location` to `office`, and RLS would have denied in silence |
| **D-390** | Dark mode had no test, and the brand wordmark was invisible in it |
| **D-391** | /api/sync could be called by anyone with a spoofed header, and it holds the service-role key |
| **D-392** | The s56 and enquiry sync paths were recorded as done. Only the allowlists existed |
| **D-394** | The auth gate failed open, and any URL ending in .png skipped it entirely |
| **D-395** | `-(daysBetween(x) ?? 0)` is `-0`, and -0 passes every guard |
| **D-396** | The s56 sync would have deleted the deadline table and failed to refill it |
| **D-397** | Every day-count on the board was a day wrong for the whole Brisbane working day |
| **D-398** | Empty states that assert safety, and a skip link that skipped nothing |
| **D-399** | The tests that could not fail — including the one guarding 1,200 credentials |
| **D-400** | The second pass: fourteen more defects, and the ones I chose not to fix |
| **D-401** | The Sheets reader — and proving, structurally, that nothing can destroy their data |
| **D-402** | RJ's annotated reply — one file, not two, and it closes the last team blocker |
| **D-403** | The second file was real, and the locked-column gate had a blind spot |
| **D-404** | Repointing the import at the newer file exposed a defect that would have hit on go-live morning |
| **D-405** | C-1's live capture had no trigger — the forward path was a function nobody called |
| **D-406** | `create table if not exists` is not a migration, and free Vercel would fail the deploy outright |
| **D-407** | The same half-applied edit, one layer down — and the SQL now has a compiler |
| **D-408** | "7 demo enquiries" from a file that inserts 6 — a NULL that no cleanup could match |
| **D-409** | RJ volunteered the staff list, and the roster is defined in four places |
| **D-410** | Robinder is ready to buy M365 — and one thing he proposed must not be done |
| **D-411** | Auditing my own M365 message found advice that contradicted the warning beside it |
| **D-412** | The OneDrive holding 1,436 client folders is OUR consultant's personal account, not a staff member's |
| **D-413** | Do not add the domain to Microsoft at all — the dangerous screen can be skipped, not navigated |
| **D-414** | The purchase guide never said whose account should buy it |
| **D-415** | The shared sheet landed, and RJ's Microsoft request is about a form we have never seen |
| **D-416** | "10 contact numbers arrived" was 6 — and I nearly told the client the wrong column |
| **D-417** | Buying the licence will NOT unblock their existing form — it has to be rebuilt |
| **D-418** | I marked a step "not done" that Sharjeel had shown me completed |
| **D-419** | Supabase can stay on Free — the database holds nothing that cannot be rebuilt |
| **D-420** | The Microsoft form is real, and it is missing the one question 53% of their clients need |
| **D-421** | Full input audit against RJ's free day — and two "never asked" items that should stay unasked |
| **D-422** | Correction to D-421 — M9 DOES draft client emails, so the s56 wording IS needed |
| **D-423** | Final team-side sweep — one more form gap, deliberately NOT chased today |
| **D-424** | Netlify Free is legitimately an option — Vercel Hobby never was |
| **D-425** | The full free-hosting picture, and a recommendation that is not "pay the $20" |
| **D-426** | RJ's delivery of 31 Aug — five artefacts, and two findings that reopen closed items |
| **D-427** | Final sweep — the website form was answered on 25 July and we overwrote it on 21 August |
| **D-428** | Fifth pass — the clients with live legal deadlines are NOT in the system we are about to launch |
| **D-429** | The hosting decision, settled — and the constraint that forced it, removed |
| **D-430** | RJ's 1–3 Sep replies — four attachments with nothing new, and three findings that are |
| **D-431** | The fresh export made the import look WORSE, and the reason is their data model |
| **D-432** | They already have an s56 tracker. It has ~2,200 rows and the ladder columns are empty. |
| **D-433** | Their s56 sheet suggests a column we should NOT add yet |
| **D-434** | M9 watches one mailbox. Half their s56 letters arrive at a different one. |
| **D-435** | Auditing my own draft to RJ found four errors, two of them promises we cannot keep |
| **D-436** | 22 live s56 matters — and a Python truthiness trap that hid them |
| **D-437** | RJ's 4 Sep answers — the mailbox fix moves to Robinder, and a helpful guess became data |
| **D-438** | Verifying my own draft again — "reminders go to that person" is not true |
