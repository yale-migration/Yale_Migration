# MASTER sheet spec (tab `MASTER`) — v2, RECONCILED with the client's real tracker (T1b.3, 29 Jul)

Grain: **one row per MATTER** (D-11). Rows 1 = headers (bold, frozen, protected); data from row 2.

## Why v2 exists
T1b.3 read their live `Client Tracker` (49 rows, "SOP Compliant"). Their columns are:
`Client ID · Full Name · Contact Number · Email Address · Location · Visa Type · Assigned Consultant ·
Processing Stage · Visa Outcome · Grant Date · Visa Expiry · Refusal Reason · Last Contact · 48hr Alert`
plus a manual dashboard block in columns P–Q. **We adopt their fields and their vocabulary**, then add
what automation needs. Adopting their language is what makes the sheet feel familiar instead of imposed.

## Column layout (23 columns, A–W)
| Col | Header | Source | Notes |
|---|---|---|---|
| A | Client Code | ours | `YM-2026-#####`, auto (client explicitly approved this format) |
| B | Their Client ID | **theirs** | `CL-001` style — cross-reference so nothing they know breaks (D-51) |
| C | Full Name | theirs | UPPERCASE as they do it |
| D | Party 2 Name | ours | dependent / employer / sponsor (482, Partner, dependents) |
| E | Contact Number | theirs | ⚠️ often blank in their data → do NOT use as the dedupe key (D-54) |
| F | Email Address | theirs | **the reliable identity key**; TRIM — their data has trailing spaces |
| G | Location | **theirs** | `Onshore` / `Offshore` ← we had missed this; it drives checklist choice (D-52) |
| H | Visa Type | theirs | dropdown, base subclass only |
| I | Visa Variant | ours | `Main · Dependent · Subsequent Entrant · Sponsor · Employer` — their Visa Type field mixes these in free text ("485 visa dependent", "500-Subsequent Entrant") (D-53) |
| J | Office | ours | BRISBANE · TOWNSVILLE · PHILIPPINES (routing, D-16) |
| K | Team | ours | INDIAN · FILIPINO (routing, D-46) |
| L | Assigned Consultant | theirs | their values are `RJ`, `REY`, `Star` — normalise case, keep their short names |
| M | Processing Stage | **theirs** | use THEIR vocabulary (below), not ours |
| N | Visa Outcome | theirs | `Pending · Granted · Refused · Withdrawn` |
| O | Grant Date | theirs | |
| P | Visa Expiry | theirs | feeds renewal alerts (Phase 2 deadline engine) |
| Q | Refusal Reason | theirs | |
| R | Last Contact | theirs | feeds the dormancy detector (D-34) |
| S | Next Follow-up Due | ours | **replaces their broken `48hr Alert` column** (D-55) |
| T | Date Added | ours | auto-stamped with the code |
| U | Source | ours | Facebook · Instagram · WhatsApp · Phone · Walk-in · Email · Website · Referral |
| V | Folder URL | ours | written back by the M3 folder scenario |
| W | Notes | both | free text; error messages land here too |

## Dropdown values
**Processing Stage** (THEIR words, extended minimally):
`Enquiry · Engaged · Documents Pending · Documents Complete · Ready for Lodgement · Lodged ·
Awaiting Outcome · Closed`
*(Their live values are Documents Pending / Documents Complete / Ready for Lodgement / Lodged, and their
dashboard also counts "Awaiting Outcome" and "Granted". Enquiry/Engaged/Closed are our additions to cover
the front and back of the pipeline.)*

**Visa Outcome:** `Pending · Granted · Refused · Withdrawn`
**Location:** `Onshore · Offshore`
**Visa Type:** `500 · 485 · 820/801 · 300 · 482 · 407 · 186 · 494 · 189 · 190 · 191 · 491 · 600 · 101 ·
802 · 417 · **SBS** · **Nomination** · Skills Assessment · EOI · ART · Bridging · Other`
*(SBS and Nomination added 2 Aug — employer-side matters route to folder SET 2 and must be selectable, D-138.)*
**Visa Variant:** `Main · Dependent · Subsequent Entrant · Sponsor · Employer`
**Office:** `BRISBANE · TOWNSVILLE · PHILIPPINES`
**Team:** `INDIAN · FILIPINO`
**Assigned Consultant:** `Robinder · Inder · Gayatri · Priyanka · Fiza · RJ · Star · Rey · Cristelle · Unassigned`
**Source:** `Facebook · Instagram · WhatsApp · Phone · Walk-in · Email · Website · Referral`

## Import rules (from their tracker, ~48 active rows — D-49)
1. Read `'Client Tracker'!A5:N49` — **skip rows 1–4** (title band + header row, D-50).
2. Ignore columns P+ (their manual dashboard block) — never write there.
3. Map `Client ID` → column B, keep it forever; generate our `YM-2026-#####` in column A.
4. Split their `Visa Type` free text → Visa Type (H) + Visa Variant (I):
   `"485 visa dependent"` → `485` + `Dependent`; `"500-Subsequent Entrant"` → `500` + `Subsequent Entrant`.
5. TRIM every text value (their emails carry trailing spaces).
6. Derive Team/Office from the consultant (RJ/Rey/Star → FILIPINO; Robinder/Inder/Gayatri/Priyanka/Fiza →
   INDIAN; Cristelle → TOWNSVILLE) — then have the client confirm.
7. **Flag, don't fix, contradictions.** Real example: CL-002 shows Stage `Documents Pending` with Outcome
   `Granted` — impossible combination. Write a note in column W and let a human decide (D-56).
8. Never overwrite their tracker. The import is one-way (theirs → MASTER) until they approve otherwise.

## Setup checklist
- [ ] 23 headers in row 1 · bold · View → Freeze → 1 row
- [ ] Dropdowns on G, H, I, J, K, L, M, N, U (apply rows 2:1000)
- [ ] `scripts/master_codes.gs` installed + 5-minute trigger (note: column positions updated for v2)
- [ ] Protect row 1
- [ ] Test: type a name in C2 → code appears in A2, date in T2
