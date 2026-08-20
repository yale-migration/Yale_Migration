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
| **16–19 Aug** | **M4b · M5b (M4 v4 route C) · M8 + stop-on-reply · dashboard 6→9 views · ENQUIRIES + MASTER importers · four audit rounds (D-323…D-326, D-331…D-338) · hook + skills infrastructure · 20 decision entries** | **~20** |
| 19 Aug | **M9** tracker + parser + independent deadline verifier (58 tests) · **M11** user guide (client-requested) | **~5** |
| 20 Aug | **M7** CALL LOG tab + in-row lookup formula + one-way promotion (63 tests) · trigger installer · M5a/M8 flood guards | **~4** |
| **20 Aug** | 🔴 **PHASE 3 WEB DASHBOARD — OUT OF SCOPE, UNQUOTED.** Next.js + Supabase, RLS proven 22/22 live, two specialist UI/UX reviews, four requirements gaps closed, 100 unit + 82 e2e tests | **~21** |
| | **BUILD SUBTOTAL** | **~91** |
| | Client communication (messages, briefs, scripts, the 19-question document + follow-ups) | **~9** |
| | **TOTAL** | **~100** |

## 🔴 WHERE THIS ACTUALLY STANDS — updated 20 Aug 2026

**~100 hours spent against a firm 48-hour cap.** But the headline number is the wrong one to read:
**~37 of those hours are out of scope and unquoted** (~16h absorbed Phase 2/3 + **~21h Phase-3 web
dashboard, built 20 Aug**). Contracted delivery sits at **~25 of 40 build-hours — under, not over.**

🔴 **The dashboard is the single largest unbilled item in the account, and it happened in one day.**
Our own rule — *"never absorb Phase 2/3 into the MVP"* — was written 6 Aug and has now been broken
twice by the same workstream. `QUOTE-P3-DASHBOARD.md` exists; **quote it before any further hour.**

⛔ **The cap is the contract's central term:** *"Firm 48-hour cap; anything beyond is quoted as a
written change order **before any additional hours are used**."* No change order has been raised.
Every hour past 48 has been absorbed, unbilled and unauthorised.

### And the calendar term, which nobody had checked until today

Proposal v3: *"**MVP (48 hours): 3 to 4 weeks from kick-off**, assuming access items below are
provided in the first week."*

| | |
|---|---|
| Kick-off | **Sat 25 Jul** (`CLIENT-LOG`) |
| Today | **Wed 19 Aug** — 25 days, **3.6 weeks** |
| 🔴 Outer edge of the committed window | **Sat 22 Aug — three days away** |

🔑 **The condition attached to that timeline was never met.** *"Assuming access items are provided in
the first week"* — **7 of the 14 access-checklist items have never been provided at all** (D-332),
and two of them were never even chased. The clock ran; the inputs did not arrive.

**Both terms are now live at once:** we are over the hour cap and at the edge of the week window.
This is a change-order conversation, and it should happen before more hours go in — not after.

### The old note, kept for the record
**As at 15 Aug: at or past the 48-hour cap, roughly 26% of contracted outcomes delivered.**

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
| **Phase-3 web dashboard (Next.js + Supabase + RLS), 20 Aug** | **~21** | 🔴 **never in scope, never quoted, largest single item** |
| | **~37 h** | |

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
