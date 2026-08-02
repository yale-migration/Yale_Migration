# Client folder structure — by visa category

**Status:** proposal for Robinder's 👍 (D-105/D-106). **Derived from Yale's own client checklists**, not from
generic practice — every grouping below traces to a heading in their documents. Supersedes the single 5-folder
set (D-100/D-104 overturned).

## The principle
- **Folders** hold the *coarse, stable* shape — party and broad category. They rarely change.
- **Checklists** hold the *detail* — which documents, which variant (onshore/offshore, individual/dependent,
  ACECQA/TRA/VETASSESS). That lives in the tracker + M4, **never in folder names**. 485 alone has 7 checklist
  variants; encoding those as folders would be unusable.
- **Positions stay stable:** the last two folders are always Forms & Lodgement, then Correspondence & Outcome.
  Whatever the case type, staff know where signed documents and Department letters go.

**Universal rule for staff:** *from the Department → Correspondence & Outcome. Sent to the Department →
Forms & Lodgement.*

---

## SET 1 — STANDARD
**Applies to:** 500 Student · 485 Graduate · 189 / 190 / 191 / 491 / 494 / 186 Skilled · 600 Visitor ·
417 · Skills Assessment · EOI · Bridging · ART · Other

| Folder | What goes inside |
|---|---|
| `01 Identity & Personal` | Passport (bio page) · national ID · birth certificate · passport photos · **address history form** · **current visa copy** · marriage certificate · change of name · **+ MERGED 2 Aug:** **AFP National Police Check** · **NBI Clearance** (Philippines) · overseas police checks · medicals / HAP ID · **OSHC / OVHC insurance** · **AFP application bundle** |
| `02 Education & Employment` | **CoE / all CoEs** · offer letter · **transcripts & completion letter** · testamur · degree/diploma certificates · **PTE / IELTS results** · **skills assessment** (ACECQA / TRA / VETASSESS) · **JRP / PSA documents** · employment references · payslips · CV |
| `03 Financial` | Bank statements · financial capacity evidence · tuition / fee receipts · sponsor or parent income & affidavit · tax returns · state nomination financial requirement (190/491) |
| `04 Dependents & Relationship` | Dependent passports, visas, insurance, address history, AFP · **marriage certificate · superannuation beneficiary letter · joint bank account · joint lease · shared expenses · call logs · relationship story · statement from friend/family · photos together** · children: passport, birth certificate, **Form 1229** |
| `05 Forms & Lodgement` | **Detail Form · Client Information Sheet** · **Form 80** · Form 1221 · **GTE / GS statement** · signed application forms · Form 956 · statutory declarations · ImmiAccount receipt · TRN / Application ID · s56 response bundle |
| `06 Correspondence & Outcome` | Department letters · **s56 requests** · EOI invitation · state nomination approval · IMMI acknowledgement · grant notice · refusal letter · withdrawal |

> **Why `05` exists:** their **485 WITH DEPENDENT** checklist requires full relationship evidence (marriage
> certificate, superannuation beneficiary, joint bank account, joint lease, shared expenses, call logs,
> relationship story, statement from a friend, photos). Relationship evidence is **not** partner-only.
> **Health & Character was originally separate** (their 407 checklist lists `6. Health` and `7. Character
> (MANDATORY)` as their own sections, and the AFP check is its own sub-application with a points-based bundle:
> passport 70 · driver licence 40 · bank statement 25 · bank card 25 · tax notice 25 · utility bills 20 +
> 10-year residence history form). **The client chose to merge it into `01` on 2 Aug** — his call, applied.

---

## SET 2 — WORK / EMPLOYER
**Applies to:** 482 Skills in Demand · 407 Training · SBS (Standard Business Sponsorship) · Nomination
**Folder name for employer-side matters:** `YM-2026-##### – COMPANY NAME (SPONSOR)` (D-99)

| Folder | What goes inside |
|---|---|
| `01 Identity & Personal` | Applicant passport · national ID · birth certificate · photos · current visa · director IDs (employer matters) · **+ MERGED 2 Aug:** AFP / NBI / overseas police checks (all countries) · medicals · health insurance |
| `02 Step 1 – Sponsorship` | **Company profit & loss / financial statements** · **industry licences & registrations** · **ABN / ACN / ASIC registration** · **Trust Deed** · business profile · lease / proof of premises · payroll summary · **menu / offerings** · **SAF levy receipt** · invoices & payment receipts · signed sponsorship forms · **SBS approval** |
| `03 Step 2 – Nomination` | **Position description** · employment contract · **organisational chart** · **LMT / advertising evidence** · **training plan** (407) · **trainer/supervisor details** · nomination forms · nomination ID · **nomination approval** |
| `04 Step 3 – Visa Lodgement` | Applicant **skills assessment** · qualifications & transcripts · CV · payslips · **Form 80** · Form 1221 · support letter · signed visa forms · ImmiAccount receipt · TRN |
| `05 Dependents` | Dependent passports, police checks, medicals, insurance · marriage certificate · children: birth certificate, **Form 1229** |
| `06 Correspondence & Outcome` | Department letters · s56 requests · **IMMI Acknowledgement** · grant / refusal · correspondence for all three steps |

> **Reorganised by STEP on the client's 2 Aug instruction** — *"This will be easier for checking for the
> application progress."* The folder tree now doubles as a progress indicator: an empty `03 Step 2` means the
> nomination has not started. Confirmed independently by their 407 checklist (`STEP 1 / STEP 2 / STEP 3`) and
> by their real SBS email thread (D-95). The company documents Robinder asked for — **profit & loss**,
> **licensing**, **Trust Deed** — live in `02 Step 1`, never in a generic "Financial" folder.

---

## SET 3 — PARTNER / FAMILY
**Applies to:** 820 / 801 Onshore Partner · 300 Prospective Marriage · 101 / 802 Child
**Organised by PARTY** — mirroring their own 820/801 checklist headings exactly.

| Folder | What goes inside |
|---|---|
| `01 Applicant Documents` | Certified passport bio page · **AFP National Police Check** · **NBI Clearance** (Philippines) · birth certificate · photos · current visa · **tax returns** · **superannuation beneficiary letter** · medicals |
| `02 Sponsor Documents` | Sponsor passport or **PR card** (certified) · AFP check (if requested) · **tax returns** · **superannuation beneficiary letter** · proof of Australian status · sponsor's income / employment evidence |
| `03 Relationship Evidence` **→ sub-folders `820` and `801`** | **Relationship Statement** (how you met, how it developed, commitment, future plans) · **joint bank account statements** · **money transfers between partners** · **joint lease / rental agreement** · joint utility bills · **shared assets** (car, home, insurance) · **joint travel** (tickets, hotel bookings) · **social photographs together** · **call & chat records** · civil registry / affidavit of cohabitation (de facto) |
| `04 Forms & Lodgement` | **Form 47SP** (applicant) · **Form 40SP** (sponsor) · **Form 888** + **ID copies of the friends/family completing it** · Form 80 · Form 1229 (children) · signed forms · ImmiAccount receipt · TRN |
| `05 Correspondence & Outcome` | Department letters · s56 requests · grant notice (820) · **801 stage correspondence** · refusal / withdrawal |

> **Why party-based:** their checklist splits `DOCUMENTS REQUIRED FROM APPLICANT` and `DOCUMENTS REQUIRED FROM
> SPONSOR`, and the two lists are nearly identical — both submit passport, police check, tax returns,
> superannuation letter, joint lease, shared assets, travel, photos. Filing by document type would place two
> passports and two sets of tax returns together **with no way to tell whose is whose.**
> **No employment folder is created** — a partner applicant submits no employment documents (Robinder's point).
> ✅ **RESOLVED 2 Aug — 820/801 are SUB-FOLDERS, not separate matter rows.** Client: *"we can put subfolder as
> 801 and 820."* The 801 is lodged ~2 years after the 820 with **updated** relationship documents, so
> `03 Relationship Evidence` holds `820/` and `801/` side by side. One matter row, two evidence bundles —
> the MASTER matter grain (D-11) is unchanged.

---

## Visa type → folder set

| Visa Type (MASTER col H) | Set |
|---|---|
| 500 · 485 · 189 · 190 · 191 · 491 · 494 · 186 · 600 · 417 · Skills Assessment · EOI · Bridging · ART · Other | **SET 1 Standard** |
| 482 · 407 · SBS · Nomination | **SET 2 Work / Employer** |
| 820/801 · 300 · 101 · 802 | **SET 3 Partner / Family** |

## Implementation
One **Set variable** module in `YM-M3-folder-create` maps Visa Type → set → folder list. **Not** a 20-branch
router: three cases in one switch, ~1 extra Make operation (credit budget safe, D-22). Renaming any folder is
a one-line change in that variable.

## ✅ All open questions answered (2 Aug) — nothing outstanding on folders
1. **👍 on the three sets and names** — approved, with the three changes applied above.
2. **820 → 801 second evidence round** — sub-folders inside `03`, not a separate matter row.
3. **Are 7 folders acceptable, or compress further?** — compress: Health & Character merged into Identity.
   Sets 1 and 2 are now **6** folders; Set 3 is **5** (+2 sub-folders).

## Implementation status
`ARCHITECTURE.md` v2 and `scenarios/M3-folder-create.md` v2 both build from THIS file. One Switch module maps
Visa Type → set (three cases, ~1 extra Make op). Renaming any folder is a one-line change to that variable.
