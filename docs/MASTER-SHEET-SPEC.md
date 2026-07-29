# MASTER sheet spec (tab name: `MASTER`) — one row per MATTER (D-11)

Row 1 = headers (bold, frozen, protected). Data starts row 2.

| Col | Header | Type | Notes |
|---|---|---|---|
| A | Client Code | auto | `YM-2026-#####`, set by `scripts/master_codes.gs` |
| B | Full Name | text | UPPERCASE preferred (matches file-naming convention) |
| C | Party 2 Name | text | employer (482), sponsor (Partner) — blank otherwise |
| D | Phone | text | dedupe key for enquiries |
| E | Email | text | checklist/chase target |
| F | Visa Type | dropdown | see list below |
| G | Office | dropdown | BRISBANE · TOWNSVILLE · PHILIPPINES |
| H | Team | dropdown | INDIAN · FILIPINO |
| I | Stage | dropdown | Enquiry · Engaged · Documents · Ready to Lodge · Lodged · Outcome · Closed |
| J | Assigned Consultant | dropdown | from team roster (below) |
| K | Date Added | auto | stamped with the code |
| L | Source | dropdown | Facebook · Instagram · WhatsApp · Phone · Walk-in · Email · Website · Referral |
| M | Folder URL | auto | written back by the M3 folder scenario |
| N | Notes | text | free text |

## Dropdown values (Data → Data validation → List of items)

**Visa Type:** `500, 485, 820/801, 300, 482, 407, 186, 494, 189, 190, 191, 491, 600, 101, 802, 417, Skills Assessment, EOI, ART, Bridging, Other`

**Office:** `BRISBANE, TOWNSVILLE, PHILIPPINES`

**Team:** `INDIAN, FILIPINO`

**Stage:** `Enquiry, Engaged, Documents, Ready to Lodge, Lodged, Outcome, Closed`

**Source:** `Facebook, Instagram, WhatsApp, Phone, Walk-in, Email, Website, Referral`

**Assigned Consultant** (from the roster, D-16): `Robinder, Inder, Gayatri, Priyanka, Fiza, RJ, Star, Rey, Cristelle, Unassigned`

## Routing reference (roster → who owns what)
- **Indian team:** Robinder / Inder → 189, 190, 491, 482, 494, 186 · Gayatri, Priyanka → Student 500 ·
  Fiza → Partner, Graduate 485, Visitor 600
- **Filipino team:** RJ → skilled + work · Star, Rey, RJ → student, graduate, partner
- **Townsville:** Cristelle
- Open questions for client: Nisha's role; owner of workvisa.bne@

## Setup checklist
- [ ] Headers in row 1 exactly as above · bold · View → Freeze → 1 row
- [ ] Dropdowns applied to F, G, H, I, J, L (apply to rows 2:1000)
- [ ] `scripts/master_codes.gs` pasted in Apps Script + 5-minute trigger created
- [ ] Protect row 1 (Data → Protect sheets and ranges → row 1)
- [ ] Test: type a name in B2 → code appears in A2 within seconds
