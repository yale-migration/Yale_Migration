# ACCESS INVENTORY — status only. ⚠️ NO passwords, NO API keys, NO tokens in this file, ever.
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
| 10 | Claude API (Anthropic) | Client's key, in Make connection | ✅ | Client's billing per Engagement Letter |
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
154 client files exist on disk, 17 are individually mapped. Nothing is lost; the granularity differs.

| Batch | Source folder | Files | Curated copy | Per-file record |
|---|---|---|---|---|
| 1a | `01 INTERNAL SOPs - STAFF PROCESS MANUALS/` | 15 *(incl. 3 `- INFOGRAPHIC.png`)* | `docs/01-internal-sops/` | ❌ batch only |
| 1b | `02 CLIENT-FACING - CHECKLISTS FEES & GUIDES/` | 17 | `docs/02-client-facing/` | ❌ batch only |
| 2 | `SOP'S 2/` | 86 *(incl. 12 workflow PNGs)* | `docs/03-sops-batch-2/` (85) | ⚠️ batch line, CLIENT-LOG 16 Jul |
| 3 | `additionaldocsforsop/` | 8 | `docs/04-additional-docs/` | ⚠️ batch line, CLIENT-LOG 20 Jul |
| 4 | `access/` | 17 | `assets/samples/` (17, hash-verified identical) | ✅ every file mapped |

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

## Established working method with this client (D-90)
**Robinder shares HIS screen and types his own passwords, on his own machine.** This is how the Make account
was set up and it is the pattern for every credential step. Never ask him to type a password into our
browser, and never ask us to hold his passwords. Also record, the same day: who set up what, on whose
machine, and who holds which credential.

Revocation map (client can cut us off anytime): unshare sheets · remove Make member · remove Meta
person · remove Gmail delegate · rotate Claude key. This is by design — say it proudly if asked.
