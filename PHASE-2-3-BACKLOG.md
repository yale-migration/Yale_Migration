# PHASE 2 / 3 BACKLOG — billable work beyond the signed MVP
**Created 6 Aug 2026.** Companion to `CHANGE-REQUESTS.md` (which records *what was asked and when*).
This file is the **commercial register**: what it is, why it is out of MVP scope, what it costs, what it
depends on, and what has to be true before it can start.

> **Rule:** nothing here is built or promised until it is quoted and accepted in writing.
> Anything discussed with the client gets logged here the same day, with an estimate.
> **Never absorb Phase 2/3 work into the MVP** — it dilutes both and it is unpaid.

---

## The signed MVP (for contrast — this is what IS paid for)
M1–M11, ~40 build-hours, 48h engagement. Discovery · master data layer · folder automation · checklist
delivery · document chasing · enquiry capture · phone intake · follow-up · email triage · testing · handover.
**50% received ($840). Final 50% on go-live.**

---

## 🔴 THE ONE THING TO UNDERSTAND ABOUT PHASE 2/3

Robinder has now asked for the same thing **three times, in three shapes**:

| Date | What he asked for | His stated reason |
|---|---|---|
| 19 Jul | A CRM (CR-001) | "Google friendly" client management |
| 3 Aug | Run the CRM demo in parallel (CR-007) | *"so our other branches will start working on it"* |
| 6 Aug | A dashboard (CR-009) | *"he wants to run multiple branches"* |

**These are one need: he is opening branches and needs oversight across them.**
That is a real business driver, not a nice-to-have, and it will keep resurfacing until it is answered.

**The engineering consequence:** all three read from the SAME data layer (MASTER). Build the data layer
once, correctly, and the dashboard is hours and the CRM is a face over it. Build any of them before the
schema has met real data and **it gets built twice** — that is the entire argument for sequencing, and it
is an engineering argument, not a stalling one.

**The commercial consequence:** this is the largest revenue opportunity in the account. It should be
quoted properly, not leaked out in free increments.

---

## PHASE 2 — quoted in Proposal v3 (~49h), quote refreshed after MVP go-live

| # | Item | Est. | Depends on | Notes |
|---|---|---|---|---|
| P2-01 | **Operations dashboard** (CR-009) | ~~6–10h~~ → 🔴 **~21h ALREADY BUILT AND UNQUOTED** | ~48-row tracker import | ⚠️ **This estimate is history.** The Phase-3 web app was built 13–20 Aug, RLS proven 22/22 live. `QUOTE-P3-DASHBOARD.md` is written and **has never been sent** — the largest unbilled item in the account. See detail below |
| P2-02 | Deadline engine (s56 7/14/21/26) | 8h | M9 | Blueprint already exists: their "YALE BRISBANE OFFICE WORK" S56 tabs |
| P2-03 | Quotes + Xero | 8h | fee master ready | `FEES AND INVOICE REFERENCE.xlsx` + `BREAKDOWN OF FEES` supplied |
| P2-04 | QC gate — content-vs-label check | 4h | M4 | **Directly justified by the 6 Aug audit**: 5 files whose names did not match their contents |
| P2-05 | Advanced AI — document classify + auto-rename | 8h | M4/M5 | Their real filenames are chaotic (D-47) |
| P2-06 | Enrolment tracker | 4h | — | `Admissions Tracker ` sheet, never read (T1c) |
| P2-07 | Refund workflow | 2h | — | `REFUND FORM.docx` supplied |
| P2-08 | Extended visa lines | 3h | — | 186 · 191 · 600 · Skills Assessment · EOI · ART |
| P2-09 | Appointment booking | 3h | — | |
| P2-10 | EOI points calculator (client-facing) | 2h | — | Content already exists — `REF_EOI-POINTS-CALCULATOR.docx` |
| P2-11 | Role routing + service agreements | 3h | roster | |
| P2-12 | **Checklist content rewrite** (CR-008) | 6h | client authors | **We do form, client does content.** Only the RMA decides what a visa requires |
| P2-13 | 482 sponsor-matter grain + stage set (CR-004) | 4h | — | Sponsorship is a 3-stage chain; MASTER models a single-visa flow. Includes an `awaiting payment` blocker so M5 never chases documents when the real blocker is an unpaid invoice |
| P2-14 | Approval → marketing post (CR-005) | 3h | — | Approvals are forwarded "for posting". Cheap, high goodwill. Touches public comms → needs its own approval rules |
| P2-15 | **Townsville + Philippines offices** | 1h | client supplies folder IDs | Client 6 Aug: *"we will do in future, in couples of months"*. Two switch cases + two filter branches |
| P2-16 | Storage / governance recommendation (CR-003) | 2h | — | ~150 clients' passports sit under one personal Microsoft account. Advisory, not technical |

---

## 🎯 P2-01 — OPERATIONS DASHBOARD (the live ask, 6 Aug)

**Driver:** multi-branch oversight. Robinder is opening branches and needs to see all of them in one place.

**Why it is genuinely valuable, in his own data:**
- Their current tracker has a **manual** dashboard block in columns P–Q that someone maintains by hand
- Its `48hr Alert` column is **broken — it contains a `#REF!` error** (D-55). The alerting they already
  wanted has not worked for some time
- Discovery found real client files dormant for **16 and 71 days** with no chase (D-34)

**So this is not a new feature — it is fixing something they already tried to build and could not keep alive.**

**Proposed views (confirm with client):**
| View | Answers |
|---|---|
| Matters by Office × Team | *"How is each branch performing?"* ← **the multi-branch driver** |
| Matters by Processing Stage | *"Where is everything stuck?"* |
| Matters by Assigned Consultant | *"Who is overloaded?"* |
| Dormant files (no contact > 14 days) | *"Who is being ignored?"* — replaces the broken `48hr Alert` |
| s56 deadlines approaching | *"What is legally urgent?"* |
| Visa mix + outcomes | *"What are we actually good at?"* |

**Build:** Looker Studio connected directly to the MASTER sheet. Free, Google-native, opens on a phone,
no new platform, no new login. Consistent with his "Google friendly" requirement (CR-001).

**Estimate:** 6–10h depending on the number of views and whether branch-level access control is needed.

**🔴 HARD DEPENDENCY — do not start before this:** the **~48 active tracker rows must be imported**.
A dashboard over 5 test rows shows nothing and would undo the impression the demo just created.
The import is a deferred MVP item (M2) and comes first.

---

## PHASE 3 — CRM (CR-001 / CR-002 / CR-007)

| # | Item | Est. | Notes |
|---|---|---|---|
| P3-01 | CRM face over the MASTER data layer | **30–50h** | AppSheet recommended over GoHighLevel (CR-002): GHL is a rented platform at $100–300/mo forever, and puts passports on third-party servers — which contradicts his own privacy position |
| P3-02 | Client portal | scope TBD | Client to rank: screens / portal / VEVO |
| P3-03 | VEVO integration | scope TBD | |

**⛔ Never promise:** eLodge integration or trust accounting. Both are regulated and outside what we can
responsibly deliver.

**Sequencing (CR-007, unchanged):** the CRM is a *face* over MASTER. MASTER has not yet met real data —
the tracker import will surface schema issues (their Visa Type free-text mixes subclass with variant;
contradictory stage/outcome combinations — D-53/D-56). **Build the face before the schema settles and it
gets built twice.** Once real data is in, an AppSheet view over it is hours, not weeks.

---

## 💰 COMMERCIAL POSITION

1. **Everything in this file is billable.** It is logged, estimated, and quoted — never absorbed.
2. **Quote after MVP go-live**, as one package with options, not item by item. Piecemeal quoting invites
   piecemeal scope.
3. **The multi-branch need (P2-01 + P3-01) is the largest opportunity in this account.** Treat it as the
   Phase 2/3 headline, not as a favour.
4. **Free increments are the risk.** A "quick dashboard" today makes the quoted dashboard harder to sell
   tomorrow and delays the work that is already paid for.

---

## STATUS LEGEND
`LOGGED` — recorded, not quoted · `QUOTED` — priced, awaiting acceptance ·
`ACCEPTED` — in writing, schedulable · `IN PROGRESS` · `DELIVERED`

**Every item above is currently `LOGGED`.** Nothing is quoted, nothing is promised, nothing is started.

---

## P2-09 — SMS follow-up channel (from CR-015, raised by RJ 21 Aug)
Their Inquiry SOP assumes SMS follow-up; no templates and **no send capability** exist. Needs a paid
gateway, sender-ID registration, opt-out handling, and a per-message cost they carry. **`LOGGED`.**
⛔ The `SMS` value in the `Source` and `Channel` dropdowns (C-5) records where a lead *came from*.
It is not a send path, and it must never be cited as evidence the feature is nearly there.

## P2-10 — A consultant's private client list is invisible to the director (surfaced 21 Aug)
RJ confirmed `REYWARD JAKE M GAMOL-2026` is **live and personal** — ~247 people who exist nowhere the
director can see until the consultant chooses to move them across. Correct to leave out of MASTER
(they are pre-engagement, and every row creates a folder and a client record) — but **this IS the
multi-branch oversight problem** Robinder has now asked for five times, CR-001 → 007 → 009 → 010 →
012, arriving from the other direction. ⛔ **Not raised with RJ** — it reads as criticism of how he
works, and it is Robinder's conversation. **`LOGGED`.** Strongest live evidence for the Phase-3 quote.
