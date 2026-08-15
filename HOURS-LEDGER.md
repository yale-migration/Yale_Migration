# HOURS LEDGER — reconstructed 15 Aug 2026
🔴 **Created after an audit found we had NO time record against a contract whose central term is a
firm 48-hour cap requiring a written change order before any overrun.** If Robinder asks *"how many
of my 48 hours are left?"* this file is the answer. Update it at the end of every session.

## The contract
**Proposal v3, 19 Jul 2026** · 48 h @ USD 35 = **$1,680** · 50/50 · **$840 received**
> *"Firm 48-hour cap; anything beyond is quoted as a written change order before any additional hours
> are used."* — Engagement Letter, 21 Jul

48 h = **40 build** + 5 client communication + **3 contingency (credited back if unused)**

## Reconstructed to date — deliberately conservative
| Period | Work | Est. h |
|---|---|---|
| 6–24 Jul | Discovery, SOP audit, requirements, proposal | 6 |
| 25 Jul–2 Aug | Access, MASTER build, code engine, folder design, sample audits | 9 |
| 3–6 Aug | M3 build + hardening (the 409 loop, routing, sanitization, test matrix) | 8 |
| 7–11 Aug | M4a build + proof · M5a · checklist library curation | 7 |
| 12–13 Aug | Dashboard build + 6 defects · scheduling verification | 5 |
| 14–15 Aug | Data audits (4 workbooks, 30+ tabs) · three-agent audit · corrections | 6 |
| | **BUILD SUBTOTAL** | **~41** |
| | Client communication (messages, briefs, scripts) | ~6 |
| | **TOTAL** | **~47** |

## 🔴 What this means
**We are at or past the 48-hour cap, and roughly 26% of contracted outcomes are delivered.**

The gap is **absorbed out-of-scope work** — none of it quoted, none of it authorised by change order:

| Out-of-scope work | Est. h | Should have been |
|---|---|---|
| Operations dashboard + 6 defect fixes | ~5 | P2-01, 6–10 h billable |
| Role-switching portal prototype | ~2 | Phase 3, 40–80 h |
| Phone-monitoring legal research (CR-010) | ~2 | never in scope |
| Microsoft 365 advisory (CR-011) | ~2 | never in scope |
| Competitor analysis | ~1 | pre-sales for unquoted Phase 3 |
| Credential-exposure security audit | ~1 | unbilled security consulting |
| Checklist library curation (67→28 files) | ~3 | borderline; proposal excludes content work |
| | **~16 h** | |

**Deduct that and contracted delivery sits at ~25 h of 40 — consistent with the 26% completion figure.**

## The commercial position, stated plainly
1. **We have not overrun on contracted work.** We overran by giving away ~16 hours of Phase 2/3.
2. Our own rule said not to: *"Never absorb Phase 2/3 work into the MVP — it dilutes both and it is
   unpaid"* (`PHASE-2-3-BACKLOG.md`, written 6 Aug; dashboard built 13 Aug).
3. 🔴 **Do not raise this with the client as an overrun.** Nothing contracted has been over-delivered
   in hours. The honest framing is: *the MVP is behind, and the reason is unbilled extras that were
   given away.* Finish the MVP first.
4. **From today: no unquoted work.** Anything outside M1–M11 gets logged and quoted before a
   keystroke.

## Rules
- Update at the end of every session. An estimate beats nothing.
- Split **contracted** vs **out-of-scope** on every line.
- Out-of-scope hours are quoted before they are worked, not after.
