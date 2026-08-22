# ACCESS INVENTORY — status only. ⚠️ NO passwords, NO API keys, NO tokens in this file, ever.

## ✅ GOOGLE SHEET IDs — verified live 18 Aug via Make `rpcSpreadsheet` on conn 9501125 (D-337)

| Sheet | ID | `project1@` read access |
|---|---|---|
| YALE BRISBANE OFFICE WORK | `1NbaxgzHIiUM1yas1B3lt21ycNKyufPxXTxZPP0wamLI` | ✅ proven — 31 tabs listed |
| REYWARD JAKE M GAMOL-2026 | `1_YDeb7iwHQr0c3MGKp0jp8MMyqBzqlr7sz36u8Qn4pc` | ✅ visible |
| STUDENTS | `1XlnqEi42ZJNu3_vwNN8WgKcCk4zlzWyCyRQ9We_V9_A` | ✅ visible — **shared without being asked** |
| Yale Migration — MASTER DATABASE | `1ZE1OoTjgO5UyZI4dDxfGoGLy5ojHQibqHpMb3RTQc6k` | ✅ ours |

🔴 **THE LIVE TAB IS `LODGEMENT: JULY TO PRESENT` — WITH A COLON.** Every script and document we
wrote says `LODGEMENT JULY TO PRESENT`, because Excel forbids `:` in a sheet name and the `.xlsx`
export silently renamed it. **Use the colon form for anything touching the live sheet.** Getting it
wrong returns no rows and no error.

## ⚠️ ROSTER CHANGES — 18 Aug 2026 (D-330, from `ANSWERED.docx`)

| Change | Detail | Action |
|---|---|---|
| 🔴 **Mershe Ventura has LEFT** | *"not part of the company already but the email address `student@yalemigration.com.au` is still on her name"* | ⛔ **A live mailbox attributed to a former employee**, at a firm holding ImmiAccount credentials. Raise with Robinder on the same call as A-18 — verbally, not in writing |
| ✅ **GOPI has joined** | no email, team or visa line given yet | Not in MASTER's `Assigned Consultant` dropdown. Add when we have the email — one more question, not urgent |
| ✅ **Manager = Robinder, ALONE** | *"Sir Robin is currently doing all those things"* | 🔑 The dashboard needs **two** access levels, not three. Simplifies Looker row-level security (P2-01) |
| Nisha | still recorded as former staff — not contradicted | no change |
Secrets live only in: Make connections (client's org) · password manager · client's own consoles.

| # | System | Access method | Status | Notes |
|---|---|---|---|---|
| 1 | Automation Google account | Credentials from client | ✅ | Empty acct → our workspace; MASTER DATABASE here |
| 2 | Client Engagement Log sheet | Shared to automation acct | ✅ | Real client list source |
| 3 | "YALE BRISBANE OFFICE WORK" workbook | Shared | ✅ | S56 7/14/28-day tabs, EOI/JRP/lodgements — Phase 2 blueprint |
| 4 | Walk-in sheet | Via OneDrive share | 🟡 | OneDrive share COMPLETE 29 Jul (D-21) — remaining step is finding the sheet: one API call on `BNE → INQUIRY` |
| 5 | OneDrive (client folders) | Make connection (client OAuth) | ✅ | Read **+ WRITE proven** 29 Jul (D-21/D-31); full tree mapped, itemIds in `ONEDRIVE-IDS.md` |
| 6 | Make.com | Team member, Admin | ✅ | **VERIFIED 31 Jul (D-89/D-90):** Owner = `info@yalemigration.com.au` ("Yale Migration") — created JOINTLY on a screen-share with **Robinder sharing his screen, on his machine**, so HE holds and knows this login. Us = member/Admin, Make access ONLY (no info@ inbox, no info@ password). 2 users. Plan = FREE → paid at go-live |
| 7 | Meta Business Manager | Employee access + assets | ✅ | Page + IG + WhatsApp assigned |
| 8 | WhatsApp Business API | Meta verification | 🟡 | CHECK status in Security Centre ourselves |
| 9 | project1@ Gmail | Password held | 🟡 | ⛔ **Delegation DROPPED** (D-78/D-79/D-80 — impossible to an external Gmail, invisible to the API). Needs a Make↔Gmail **OAuth** at M4 time (D-13). Client should still rotate password + add 2FA |
| 10 | Claude API (Anthropic) | Make connection **9948850** | ✅ **LIVE 19 Aug — PROVEN, not just saved.** A real call returned `claude-haiku-4-5-20251001`, `end_turn`, 20 in / 3 out, 1 op. ⚠️ **Rename it** — it currently reads *"Muhammad's Anthropic Claude connection"*; should be **"Yale's Anthropic connection"** to match the Gmail/Microsoft naming and to read correctly at handover. Key arrived via WhatsApp → **ask Robinder to rotate it**. ~~NOT HELD~~ | ⛔ **This row said ✅ for weeks and it was false (D-331).** `connections_list` on team 2210317 returns FOUR connections — Google, Gmail, Microsoft, and Make's own default AI provider. **There is no Anthropic connection.** It has never been asked for: no `CLIENT-ASKS` row, no `CLIENT-LOG` entry. **M9 (5 contracted hours) cannot start without it.** Client's billing per the Engagement Letter — so it is also the first running cost they will see |
| 11 | Microsoft account for browsing | MSA on sharry00010@gmail.com | 🟡 | Created new outlook_ acct by mistake — redo with Gmail as MSA, or use link |
| 12 | Xero | — | ⛔ deferred | Phase 2 only — do not request yet |

## Client-supplied MATERIALS (local only — `assets/samples/`, git-ignored: contains client PII)
| Received | Item | Unlocks |
|---|---|---|
| 26 Jul | Team roster (12 staff, team×visa×office) | M6/M9 auto-assignment routing |
| 26 Jul | Model folder pointer (BNE/CLIENT FILES/ENGAGED CLIENTS/FILIPINO TEAM) | M3 folder pattern |
| 26 Jul | SBS (482) email thread | M9 tone + CC conventions |
| 26 Jul | Client Inquiry Form.xlsx (via OneDrive) | M2/M6 intake fields |
| **29 Jul** | **SAMPLE-S56 LETTER.pdf** | M9 S56 urgent-flag detection |
| **29 Jul** | **SAMPLE-S56 REQUESTS.pdf** | M9 detection signals + deadline parsing |
| **29 Jul** | **EMAIL TEMPLATE FOR S56 REQUEST AND FOLLOW UP.docx** | M5/M9 draft-reply + chase wording |
| **29 Jul** | **SAMPLE-STUDENT VISA EMAIL THREAD.pdf** | M9 classifier (highest-volume line) |
| **29 Jul** | **SAMPLE-485 VISA EMAIL THREAD.pdf** | M9 classifier (2nd-highest line) |
| **29 Jul** | **SAMPLE-WhatsAPP inquiry Screenshot.pdf** | M6 auto-reply + qualifying questions |

**Materials still open:** Inquiry/Detail/Consultation forms beyond the CIS · 2–3 test client files for M10.
**✅ ROSTER FULLY CLOSED 2 Aug** — `workvisa.bne@` = Robinder (D-94); **Nisha = former employee, exclude from
all dropdowns and routing** (D-124).

## 📁 FILENAME → RECORD MAP (added 31 Jul — required, G2)
The table above names materials **descriptively**; the client's folder uses **filenames**. Without this map a
grep by filename returns nothing and the file looks un-audited (this happened 31 Jul: I declared
`Yale MIgration Mail - email.pdf` never audited when it was logged as "SBS (482) email thread"). All 17 files
from `access/` are staged in `assets/samples/` (git-ignored, PII). **Add a row whenever a file arrives.**

| Actual filename (in `access/` + `assets/samples/`) | Recorded as | Audited |
|---|---|---|
| `Yale MIgration Mail - email.pdf` | SBS (482) email thread → D-94/D-95/D-96 | ✅ 26 Jul, re-audited 31 Jul |
| `Team roster.docx` | Team roster (12 staff) → D-16 | ✅ 26 Jul |
| `Model folder.docx` | Model folder pointer → D-18 | ✅ 26 Jul |
| `SAMPLE-S56 LETTER.pdf` | S56 letter → D-32/D-33/D-63 | ✅ 29 Jul |
| `SAMPLE-S56 REQUESTS.pdf` | S56 requests → D-58/D-68 | ✅ 29 Jul |
| `EMAIL TEMPLATE FOR S56 REQUEST AND FOLLOW UP.docx` | S56 reply/chase wording → D-59/D-70 | ✅ 29 Jul |
| `SAMPLE-STUDENT VISA EMAIL THREAD.pdf` | Student (500) thread → M9 classifier | ✅ 29 Jul |
| `SAMPLE-485 VISA EMAIL THREAD.pdf` | 485 thread → M9 classifier | ✅ 29 Jul |
| `SAMPLE-WhatsAPP inquiry Screenshot.pdf` | WhatsApp enquiry → M6 spec | ✅ 29 Jul |
| `Answer to the questions..docx` | Client's answers to our 4 questions → D-58..D-62 | ✅ 30 Jul |
| `application - 2026-06-02T111103.903.pdf` | S56 covering letter (482 case) → D-71 | ✅ 30 Jul |
| `s56 Request for More Information - BCC2025_7294045 …Request Checklist and Details.pdf (1).pdf` | S56 checklist, same 482 case → D-68 | ✅ 30 Jul |
| `CoE Certificate (10F566341) (1).pdf` | ⚠️ MISLABELLED — actually a blank **Form 80** → D-72 | ✅ 30 Jul |
| `form-1-version-3-statutory-declaration-form-pdf-version (6).pdf` | QLD Statutory Declaration template → D-73/D-74 | ✅ 30 Jul |
| `Screenshot 2026-08-02 at 7.27.19 PM.png` | **s56 CLIENT-NOTIFICATION TEMPLATE** (their own wording) → D-117 | ✅ 2 Aug |
| `Yale MIgration Mail - s56 request.pdf` | **FULL 482 Sevial s56 chase, 25 messages** 2 Jun–30 Jul → D-118/D-119/D-120/D-125 | ✅ 2 Aug |
| `Yale MIgration Mail - Fwd_ s56 Request … RONAYA, IANBER TEOGALBO ….pdf` | **Full 485 Ronaya s56 thread, 11 messages** — multi-applicant + de-facto evidence → D-121/D-122/D-123 | ✅ 2 Aug |

## 📦 BATCH-LEVEL TRACKING — batches 1–3 (audited 2 Aug)
`access/` (batch 4) is mapped file-by-file above. **The three earlier batches are tracked at BATCH level only** —
143 client files exist on disk, 17 are individually mapped. Nothing is lost; the granularity differs.

| Batch | Source folder | Files | Curated copy | Per-file record |
|---|---|---|---|---|
| 1a | `01 INTERNAL SOPs - STAFF PROCESS MANUALS/` | 15 *(incl. 3 `- INFOGRAPHIC.png`)* | `docs/01-internal-sops/` | ❌ batch only |
| 1b | `02 CLIENT-FACING - CHECKLISTS FEES & GUIDES/` | 17 | `docs/02-client-facing/` | ❌ batch only |
| 2 | `SOP'S 2/` | 86 *(incl. 12 workflow PNGs)* | `docs/03-sops-batch-2/` (85) | ⚠️ batch line, CLIENT-LOG 16 Jul |
| 3 | `additionaldocsforsop/` | 8 | `docs/04-additional-docs/` | ⚠️ batch line, CLIENT-LOG 20 Jul |
| 4 | `access/` | 17 | `assets/samples/` (17, hash-verified identical) | ✅ every file mapped |
| **5** | **`New-docs/`** (6 Aug) | **14** | not yet copied | ✅ **every file opened + hash-verified, D-234/D-235/D-236** |

### Batch 5 — `New-docs/`, received 6 Aug (Robinder's answers + corrected checklists)
| File | What it is | Verdict |
|---|---|---|
| `ANSWER.docx` (+ `ANSWER copy.docx`, byte-identical) | Answers to all 5 of our questions | ✅ D-234 |
| `Subclass 189 Skilled Independent Visa.docx` | 189 checklist — hash `f1c1482c46`, **the same file previously mis-named `Subclass 190…`** | ✅ renamed correctly |
| `Subclass 491 Skilled Work Regional…docx` | 491 checklist | ✅ |
| `Subclass 494 Skilled Employer Sponsored…docx` | 494 checklist — hash `04a845538d`, was `Subclass 491.docx` | ✅ renamed correctly |
| `SUBCLASS 802-CHILD VISA.docx` | 802 checklist — hash `bb69ad25f1`, was `Subclass 494.docx` | ✅ renamed correctly |
| `AUSTRALIA PR VISA-EOI POINTS CALCULATOR (2026).docx` | Points calculator — hash `3eb32d41ca`, was `Subclass 802-CHILD VISA.docx` | ✅ renamed correctly |
| `Subclass 190 State Nomination Visa.docx` | **contains the 491 checklist, "190" appears 0×** | 🔴 **STILL WRONG — D-236** |
| `485 VISA CHECKLISTS-INDIVIDUAL-VETASSESS.docx` | NEW file, hash `e6c9fc5230`, heading `485 VISA APPLICATION-INDIVIDUAL` | ✅ fixes the old `1c7a663480` |
| `POINTS COMPUTATION REFERENCE.docx` | Second copy of the points calculator, different hash | ⚠️ D-239, not blocking |
| `LISTS OF COURSES FOR PR.docx` | Course → occupation → demand guide. **No skills-authority mapping** | 🟢 Phase-2 / M6 asset, D-238 |
| `STUDENT VISA CHECKLISTS WITH DEPENDENT.docx` | The source file the 5 Jul audit listed as MISSING | ✅ gap closed |
| `EOI CALCULATOR.xlsx` · `FEES AND INVOICE REFERENCE.xlsx` | Reference workbooks | 🟢 not used by M4 |
| **`ANSWER-2 dashboard and tracker (Mershe Ventura, 11 Aug).docx`** | Replies to the TEAM message — `48hr Alert` answered, two questions bounced back as "which sheet?" | ✅ D-266/D-267. **Author = Mershe Ventura, NOT on our roster — see D-269.** Moved out of the repo root 11 Aug |

**⚠️ The "fixes" were RENAMES, not rewrites** — hashes prove each corrected file is the identical document
under its correct name. That is exactly the right fix, and it independently confirms the original audit:
the CONTENT was always correct, only the NAMES were wrong.

**Deliberate exclusion, recorded here so it never looks like a loss:**
`SOP'S 2/CHECKLISTS GENERAL/001UPDATED CHECKLISTS/APPLICATION FEES.docx` is the ONE batch-2 file not copied to
`docs/` — it is a **real-client PII invoice** and must stay excluded (per PROJECT-STATE). It remains on disk in
its original folder.

**Images/screenshots inventory (16 client-supplied):** 12 workflow PNGs (`SOP'S 2/WORK FLOWS/`, copied ✅) ·
**3 infographic PNGs** in batch 1a — hash-checked as unique artifacts, not duplicates of the workflow set ·
1 s56-template screenshot in `access/` (mapped above).

⚠️ **Filename gotcha:** the s56 screenshot contains a **narrow no-break space (U+202F)** before "PM", not a
plain space — macOS writes these. The map row above is now byte-exact. **When grepping for a filename and
getting no hit, suspect an invisible Unicode space before assuming the file is untracked.**

## 🔑 CONNECTION-OWNERSHIP AUDIT (6 Aug) — the silent-failure map for M11
Every automation depends on an authenticated identity. If that identity's access ends, the automation stops
**with no error and no alert.** Audited from the live Make blueprint, not from memory:

| Connection | Authenticated as | Owner | Risk at handover |
|---|---|---|---|
| Google Sheets (`__IMTCONN__ 9501125`) | **`project1@yalemigration.com.au`** | ✅ **CLIENT** | 🟢 none — already client-owned |
| OneDrive (`__IMTCONN__ 9279810`) | `sharry00010@gmail.com` | ❌ **US** | 🔴 folders stop being created |
| Apps Script 5-min trigger | Sharjeel's Google account | ❌ **US** | 🔴 client codes stop being issued (D-153) |
| Make org membership | `info@yalemigration.com.au` owns the org; we are Admin members | ✅ CLIENT | 🟢 |
| Claude API key | Client's key, client's billing | 🔴 **NOT HELD — never requested** | 🔴 blocks M9 (D-331) |

**Two items to transfer at M11, both silent-failure risks. The Sheets connection is already correct** —
better than previously recorded, which assumed all three were ours.

## Established working method with this client (D-90)
**Robinder shares HIS screen and types his own passwords, on his own machine.** This is how the Make account
was set up and it is the pattern for every credential step. Never ask him to type a password into our
browser, and never ask us to hold his passwords. Also record, the same day: who set up what, on whose
machine, and who holds which credential.

Revocation map (client can cut us off anytime): unshare sheets · remove Make member · remove Meta
person · revoke the Make↔Gmail connection · rotate Claude key. This is by design — say it proudly if asked.

## 🔑 STAFF EMAIL ROSTER — supplied by the client 26 Jul 2026
**Source: `access/Team roster.docx`.** Recorded here 15 Aug after an audit found it had never been
transcribed into any tracking file — while five of our own files simultaneously claimed *"no email
anywhere"* (D-310). **This is the authority. Do not ask the client for it again.**

| Team | Visa lines | Person | Email |
|---|---|---|---|
| **Indian** | 189 · 190 · 491 · 482 · 494 · 186 | Robinder | `info@yalemigration.com.au` |
| | | Inder | `skilled.visa@yalemigration.com.au` |
| | | **Robinder** ✅ 21 Aug | `Bne.skilled@yalemigration.com.au` |
| | | **Robinder** ✅ 21 Aug | `migrate@yalemigration.com.au` |
| | Student | Gayatri | `student2@yalemigration.com.au` |
| | Student | Priyanka | `admissions@yalemigration.com.au` |
| | Partner · graduate · visitor | Fiza | `office@yalemigration.com.au` |
| **Filipino** | 189 · 190 · 491 · 482 · 494 · 186 | **RJ = Reyward Jake Gamol** ✅ 21 Aug | `philippines@yalemigration.com.au` |
| | Student · graduate · partner | Star | `star@yalemigration.com.au` |
| | Student · graduate · partner | **Rey = Reynaldo Sombilon** ✅ 21 Aug | `reynaldo@yalemigration.com.au` |
| **Townsville** | all | Cristelle | `info.tsv@yalemigration.com.au` |
| **Marketing** | — | Manali | `manali@yalemigration.com.au` |

**What the roster does NOT give us — the genuine residual of A-16:**
1. **No role column.** It shows team and visa line, never who is a *manager*. The manager view needs that.
2. **Mershe Ventura is absent** — she has been answering our questions since 11 Aug (D-269).
3. ~~**Two unattributed mailboxes**~~ ✅ **CLOSED 21 Aug — both are Robinder's.** Asked plainly, answered
   in one word. The D-94 trap (five days spent treating `workvisa.bne@` as an open ask when the answer
   was in a document we held) was avoided here only because the question was actually sent.

🔴 **THE ROSTER IS VOLATILE — three changes in two weeks. Treat any copy of it as a SNAPSHOT.**
| Date | Change | Source |
|---|---|---|
| ~11 Aug | **Mershe Ventura LEFT** — `student@yalemigration.com.au` is still under her name ⚠️ | D-269 |
| 18 Aug | **GOPI joined** — no email, team or visa line ever supplied | `ANSWERED.docx` |
| **22 Aug** | **GOPI LEFT** — RJ: *"She will no longer continue with us."* Four days. ⛔ **Do NOT add her to any dropdown, and do not ask Robinder for her details** | D-355 |
| **22 Aug** | ❓ **"There is also a new update on the staff list"** — RJ asked whether Robinder had already told us. **We do not know what it is.** Ask on the call | D-355 |

🔑 **The consultant dropdown is a hardcoded array in `setup_master_sheet.gs`, so every staff change is
a code change made by us.** On a ten-person team changing this often, the sheet is wrong the week
after anyone joins or leaves — and wrong in the way that silently refuses a valid name
(`setAllowInvalid(false)`). Same shape as D-285. **It should read from a roster tab they maintain.**

🔴 **RJ AND REY ARE TWO DIFFERENT PEOPLE — confirmed by RJ, 21 Aug.** `RJ` = **Reyward Jake Gamol**,
`philippines@`, Filipino skilled. `Rey` = **Reynaldo Sombilon**, `reynaldo@`, student/graduate/partner.
Both are correct in MASTER's `Assigned Consultant` dropdown; nothing to change. ⚠️ **We addressed RJ as
"Rey" in every message from ~14 Aug to 21 Aug** and he never corrected it — D-351. The consultant name
is a foreign key into the dashboard, so getting it wrong is a data defect, not a courtesy one.

*(historical note)* Two unattributed mailboxes: `Bne.skilled@` and `migrate@`. Aliases, shared mailboxes, or former
   staff — unknown. ⚠️ Note we spent five days in July treating `workvisa.bne@` as an open client ask
   when the answer was in a document we already held (D-94). **These two are the same trap, sitting in
   the same document.**
4. Three weeks old — worth confirming it is current, not re-requesting.
