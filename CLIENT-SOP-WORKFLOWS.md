# THEIR OWN SOP WORKFLOWS — all 12 read, 15 Aug 2026
Source: `SOP'S 2/WORK FLOWS/*.png`, delivered 16 Jul. **Unopened until 14–15 Aug.**
These are formal SOPs with numbered steps, named roles, decision gates and QC checklists.
**They are the client's specification of the modules we have not built.**

| Diagram | Steps | Read |
|---|---|---|
| INQUIRY WORK FLOW (SOP-CI-001) | 15 | ✅ |
| ANSWERING PHONE CALL | 13 + 15-pt QC | ✅ |
| 485 GRADUATE VISA | 16 | ✅ |
| SKILLS ASSESSMENT | 19 | ✅ |
| 482 SKILLS IN DEMAND | 22 | ✅ |
| STUDENT VISA 500 | 17 | ✅ |
| PARTNER VISA 820/801 | 20 | ✅ |
| GSM 189/190/491 | 19 | ✅ |
| 407 TRAINING (SOP-TV-001) | 14 | ✅ |
| DEPENDENT VISA | 16 | ✅ |
| ENROLLMENT | 14 + QC | ✅ |
| TOURIST VISA 600 | 18 | ✅ |

---

# 🔑 THE UNIVERSAL PATTERN — identical across all 12

```
1  Receive enquiry        8 channels: walk-in · phone · email · WhatsApp · SMS ·
                          Facebook · website/online form · referral
2  Initial assessment     Consultant collects prelim info + documents
3  Eligibility            🔴 REGISTERED MIGRATION AGENT — the compliance gate
4  Client engagement      🔑 "Register client, generate UNIQUE CLIENT CODE, create
                          electronic folder, send QUOTATION + SERVICE AGREEMENT + CHECKLIST"
5  Service agreement      signed + initial payment BEFORE work begins
6  Document collection    against the checklist
7  Verification & storage upload to the client's electronic folder
8  Application prep       Consultant drafts
9  Client review          written confirmation that information is true
10 RMA final QA           never the consultant
11 Lodgement              via ImmiAccount — RMA only
12 Post-lodgement         acknowledgement · BVA · HAP ID · medical instructions
13 Monitoring             🔴 s56 DECISION GATE → respond within timeframe
14 Outcome → notify → close file & archive
```

**Step 4 is M3 + M4 as contracted.** Their own words, in every workflow.

---

# 🔴 WHAT THIS CHANGES

## 1 · The intake form has a name — **"Client Enquiry Form"**
Named as a standing template in SKILLS ASSESSMENT and DEPENDENT VISA. It is the first noun of the
contracted M3 flow (*"Intake form → sheet row → client code → OneDrive folder"*), it was **missing from
all our tracking** (D-311), and **they already have the form.** We do not need to design it — we need
to ask for it.

## 2 · Six roles, not two
`Consultant` · `Registered Migration Agent` · **`Skills Assessment Point Person`** (owns skills
assessment end to end) · **`Processing Officer`** (Tourist — uploads, maintains systems) ·
**`Education Provider`** (Enrolment) · **`Client`** (Dependent/Partner — they have client-action steps).
**MASTER has one `Assigned Consultant` field.** The RBAC model in `DASHBOARD-TRACKER.md` assumes
three roles; there are six.

## 3 · Payment gates the folder — confirmed from their side
DEPENDENT VISA: step 2 quotation → **step 3 client pays** → step 4 register + create folder.
Independently confirms D-95. **M5 must never chase documents when the blocker is an unpaid invoice.**

## 4 · s56 is in EVERY workflow, not just 485
A decision gate in all 12. **M9 is universal infrastructure, not a 485 feature.** Their
`S56S57ART NEW SHEET` (191 rows, 7/14/28-day ladder, already lapsing) is the operational proof.

## 5 · 🔑 Partner 801 — a two-year deadline nobody has modelled
PARTNER step 18: *"Contact client prior to the 2-year anniversary, provide document checklist and
prepare Subclass 801."* **A deadline two years out**, on a matter that looks closed. Nothing in MASTER
can hold it. Their own data has 820/801 clients today.

## 6 · "Client Engagement Log" is their word for MASTER
*"Every client must be registered in the Client Engagement Log to generate a Unique Client Code."*
Appears in all 12. **Use their term when talking to them.**

## 7 · Microsoft vs Google — settled, and it corrects D-307
Every SOP's tools panel reads **"Microsoft Office / Google Workspace"** — *both*. Only the phone SOP
lists Outlook/Teams alone. **They are platform-agnostic.** ⛔ Do not tell Robinder his SOPs say
Microsoft. Ask A-22 neutrally.

## 8 · The enrolment chain is a separate business
ENROLLMENT: 14 steps, Education Provider as a role, LOO → deposit → CoE/VoE, an **Enrolment Log
Sheet**. Feeds STUDENT VISA step 8. **Matches the ~3,600 records in `STUDENTS.xlsx` (D-308).**
Entirely outside M1–M11. This is P2-06 at a scale never estimated.

---

# 📋 TEMPLATES THEY NAME AND WE DO NOT HOLD

🔴 **Core, in nearly every workflow:**
`Client Enquiry Form` · `Client Information Sheet` · `Service Agreement Template` ·
`Client Quotation Template` · `Client Consent Form` · `Document Request Checklist`

**Per-line:** Financial Documents · Genuine Student Statement · English Language · Health & Character ·
Employer · Employee · SBS · LMT · Nomination · Visa Application · Sponsorship · Relationship Evidence ·
Relationship Statement · Form 888 · Travel History · Cover Letter · Invitation Letter ·
Occupation Identification Guide · Points Test Assessment Worksheet · Enrolment Application Form

**Internal:** Internal Document Checklist · Internal Quality Control Checklist · Enrolment Log Sheet

> **We hold 28 visa checklists. Their SOPs name ~25 further templates.** The contracted "checklist
> selector & document request" (M4) was specced against a document set we have only a third of.
> **This is a client ask, not a build task — they already have them.**

---

# 🖥 SYSTEMS THEY NAME
ImmiAccount · **Client Management System (CMS)** · **Client Engagement Log** · Secure Cloud Document
Storage · Email · **Microsoft Office / Google Workspace** · Assessing Authority Portals ·
Internal Case Tracking System · VEVO · Department of Home Affairs portals · Enrolment Log Sheet

**Their SOPs assume a CMS exists.** CR-001 is not a new idea Robinder had — it is a documented gap in
his own process, written before he ever contacted us.

---

# ⛔ THE PROCESS LESSON — third time
These sat unread for a month. They were `.png`, so they were assumed to be decoration.
Then they were assumed to be Phase-2 reading. **Both assumptions were made without opening a file,
and both were wrong.**

> **"Not relevant" is a conclusion that requires opening the file. Never a starting assumption.**
> Same as D-305 (a 1 MB workbook known by name, never opened) and D-312 (the fee master).
