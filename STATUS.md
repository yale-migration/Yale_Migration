# STATUS — single source of "where are we"

**Updated:** 2026-08-14 · Read this FIRST every session, then **`CLIENT-ASKS.md`** (`PROCESS.md` ritual).

---

## The one-line truth

**Four deliverables are built and proven against data — M3, M4a, M5a and the DASHBOARD.
Everything that does not depend on the client is finished. ONE link is blocking everything that does.**

## ✅ A-14 CLOSED 14 Aug — WE HAVE THEIR REAL CLIENT DATABASE (D-300)

The team sent **`REYWARD JAKE M GAMOL-2026.xlsx`** — 25 tabs, **~460 client records** — plus
**`DATA SHEET.xlsx`**, ~200 rows of cold-call log. Full audit: `DATA-AUDIT-their-real-tracker.md`.
Both files live in `SOP'S/` root, **outside this repo. Keep them there.**

**The finding that reframes the project:** they file clients by the **month they arrived, not by
status**. A March client stays on MARCH forever. That is why nobody at Yale can answer *"how many
active files do you have"* — and their own `SUMMARY OF CLIENTS` tab (47 rows against ~460 records) is
a hand-built attempt to solve it. **Their own data is the argument for MASTER.**

🔴 **The `JRP` tab holds 73 clients' portal passwords in plaintext, one password reused.** Advise
rotation. **Never import, copy or echo columns D/E.**

### 🔴 The blocker is now A-16 — staff emails + branch
Row-level security filters on email. Their tracker has names (`priyanka`/`RJ`/`inder`), no emails
anywhere. **Nothing manager-level ships without it.** Dashboard workstream: `DASHBOARD-TRACKER.md`.

## ✅ A-01 IS NO LONGER A BLOCKER (D-291, 13 Aug)

Verified in the live Make UI: the Free plan offers `Daily`, **`Weekdays (Mon-Fri)`**, `Weekly`,
`Specified dates` and **Advanced scheduling → add more schedules**. The 15-minute floor applies only
to *At regular intervals*, and it is a **minimum**.

| Schedule | Runs/mo each | M3+M4 baseline | +20 clients | Total | vs 1,000 |
|---|---|---|---|---|---|
| Every 15 min *(the assumption we costed for 8 days)* | 2,880 | 5,760 | +260 | 6,020 | ❌ 6× over |
| **Weekdays 09:00 · 13:00 · 17:00** | 66 | 132 | +260 | **~392** | ✅ ~600 spare |

**M3 and M4 can go live on Free.** The paid plan is still needed for M6/M9 — Free caps *active
scenarios* at 2 and M3+M4 is exactly two — so raise it then, with both already running as the evidence.

## What the client can see working right now

Type a name in MASTER → a client code is issued → a correctly-routed folder with the right sub-folder set
appears in their live OneDrive → the folder link is written back → **the right checklist is selected and
filed into that folder** → **anyone who goes quiet is flagged each morning**.
**The demo has been sent.** Both Make scenarios run on the client's own Google account; both Apps Script
triggers are owned by `project1@` (D-262/D-264).

## What is genuinely done (real work, not padding)

| Area | State | Evidence |
|---|---|---|
| Requirements gathering | ✅ **Complete** | 3 SOP batches + access folder + WhatsApp answers + 2 real S56 email threads, all audited |
| Access & credentials | ✅ **100%** | Sheets · OneDrive **read+write proven** · Make Admin · Meta BM · Claude key. ✅ `visa.lodgement@` authorized 31 Jul — only our own Run-once check remains |
| Discovery of their real system | ✅ **Complete** | ~1,436 client folders mapped · folders are FLAT · tracker = 49 active rows · naming chaotic · S56 routing chain found |
| Design / specs | ✅ Written | MASTER sheet v2 · M3 folder scenario · M6 auto-reply · M9 email AI · M9 connection runbook |
| Code written | ✅ Verified | `setup_master_sheet.gs` (23 headers, 9 dropdowns) · `master_codes.gs` (YM code engine) |
| Decision record | ✅ complete, with a SUPERSEDED INDEX | `DECISIONS.md` — nothing lost across chats or devices |
| **M3** intake → folders | ✅ **Complete** | 3 folder sets · both teams · sanitization · error handlers · idempotent |
| **M4a** checklist select + file | ✅ **Complete** | 485/482/820-801 proven · real files 422 KB & 97.9 KB · recovery path works |
| **M5a** dormant detection | ✅ **Complete** | 4 runs · granted files excluded · **ran itself 6:15am 10 Aug** |
| **DASHBOARD** (P2-01 preview) | ✅ **Complete & proven** | 6 views + 6 KPIs · **all 6 headline numbers matched prediction exactly** (D-295) · 0 Make ops |
| **Shipped to the client** | ✅ **Demo video sent** | first client-visible delivery |

**Honest read:** ~21 of 40 build-hours ≈ **53%**. The foundation is finished and every remaining module
reads from a data layer that now works. What is done is genuinely done — proven from execution output, not
assumed.

### The dashboard was proven the hard way, and it mattered
`seed_demo_rows.gs` puts 14 removable `DEMO-###` matters into MASTER so the views can be checked against
data. **Four separate defects were invisible at zero rows and obvious at fourteen:**
1. **KPI tiles counted only blank outcomes**, not `Pending` — three tiles would have read 0 forever
   against real data while looking healthy (D-292)
2. **`Checklist Filed` (Y) had silently inherited `Skills Authority` (X)'s dropdown** via
   `insertColumnsAfter()` — blocking every manual and Apps Script write to that column since it was
   created. Make was unaffected (the Sheets API ignores validation), which is why 8 clean M4 runs never
   surfaced it (D-294)
3. **Dates rendered as serials** (`46216`) — QUERY output carries no number format (D-295)
4. 🔴 **`820/801` silently vanished** — QUERY coerces a mixed-type column to one type and nulls the rest,
   so partner and employer-sponsored lines would have disappeared from the visa mix (D-295)

> **Never show a client a report that has not been run against data.** An empty dashboard renders a
> broken formula and a correct one identically.

⚠️ **The 14 demo rows are still in MASTER.** `removeDemoRows()` takes them out — that is step 2 of
`CUTOVER-PLAN.md` and must happen before the real import.

## What is actually left — named plainly

**Nothing in the build is blocked by us.** Both scenarios sit INACTIVE by choice, not by constraint —
they go on at cutover with the `Weekdays (Mon-Fri)` 3×/day schedule proven above (D-291). Switching them
on before the real client list is in would only create folders for demo rows.
**Operations used this month: 481 of 1,000** (M3 dev 399 · M4 27 · leftovers 43 · M9 1 · TMP reads 11).
**Next build: the import — but from their LIVE Google Sheet, not the abandoned `.xlsx` (D-289).**
Blocked on A-14 only. Native Sheets→Sheets, ~2 operations, and a **cutover**, not an import.

---

## 📍 PHASE PLAN — ✅ phases 1 and 2 complete

| Phase | Contents | State |
|---|---|---|
| ~~1 — SHIP THE DEMO~~ | idempotency proof · delete test folders · record + send | ✅ done 5 Aug |
| ~~2 — HARDEN M3~~ | error handlers · sanitization · routing · full test matrix | ✅ done 5 Aug (D-207…D-217) |
| ~~3 — M4 / M5~~ | M4a ✅ · M5a ✅ | ✅ done 11 Aug |
| **4 — DASHBOARD + CUTOVER** 🎯 | dashboard ✅ · **next: A-14 → schema reconcile → import → cutover** | blocked on A-14 |

M3's patterns became the standard — M4 and M5 reused them and were built in a fraction of the time.

## 🎯 THE ONLY ACTIVE THING

> ### 🔴 13 Aug — WAITING ON ONE LINK (A-14)
> Their live Google Sheet. It gates **all four** of: schema reconciliation (do they have a column MASTER
> lacks?), the import, real dashboard numbers, and the cutover date. Chased twice with the team.
> ⛔ **Do NOT import from `Engaged Client Tracker.xlsx`** — abandoned, dead data (D-289).
> ⛔ **Do NOT let M3/M4 run over the 14 demo rows** — `removeDemoRows()` first.
> **Read `CUTOVER-PLAN.md` before writing a line of M2.** This is a migration of a running system, and
> the failure mode is two sheets being edited at once, not data loss.

> ### UNBLOCKED, buildable the moment A-15 lands
> **M4b / M5b** — checklist and chase emails drafted into `visa.lodgement@`. Needs one reauthorize
> click: Make's Create-a-Draft module requires `https://mail.google.com/` and the connection holds only
> `gmail.modify` (D-290). Bundle it with the cutover call — do not send it as a separate ask.


~~T3.1 idempotency proof~~ ✅ **PASSED 5 Aug** (D-207) — second run returned 0 bundles.

**How M3 was finished (D-197 → D-219):** reading the saved blueprint through the Make API — instead of
working from screenshots — exposed three defects in minutes that six hours of canvas screenshots had not:
the Sheets filter `exist` matched **blank rows** (the `-` / `" – "` folder bug), the array aggregator blocked
the write-back so `Folder URL` was never written (the 409 loop), and a `ZZZ` column range had bloated the
blueprint to 1.6 MB. Routing, sanitization, SET 3 nesting and error handling were then pushed the same way.
**Standing rule (D-202): when a Make scenario misbehaves, fetch the blueprint FIRST.**

Remaining order, nothing else in between:

| Step | What | Who | Time | Produces |
|---|---|---|---|---|
| ~~T2~~ | ~~Run the 2 Apps Scripts~~ | ✅ **DONE 3 Aug** | — | MASTER + ENQUIRIES live, `YM-2026-00001` issued |
| ~~T3~~ | ~~Build `YM-M3-folder-create`~~ | ✅ **DONE 3 Aug** | — | Name typed → folder + 6 sub-folders + link written back to column V. **PROVEN in the live drive.** |
| ~~T3.1–T3.4~~ | ~~Idempotency · routing · sanitization · error handlers · full test matrix~~ | ✅ **DONE 5 Aug** | — | All 3 folder sets + both teams proven live (D-207 … D-217) |
| **T4** | Record 60–90s demo, send | Sharjeel | 20 min | **First thing the client can SEE working** |

~~**T4 is the target.**~~ ✅ **Demo sent.** The target is now the tracker import — see the 🎯 block above.

## Explicitly PARKED

- **Dashboard (CR-009 / P2-01)** — Phase 2, billable, and blocked on the tracker import anyway
- **CRM (CR-001/007 / P3-01)** — Phase 3. Same underlying need as the dashboard: multi-branch oversight
- **Checklist content rewrite (CR-008)** — Phase 2; we do form, the RMA does content
- M6 / M7 / M8 build work — after M4b/M5b
- ⛔ **Switching either scenario ON** — until the Make Core plan exists

## Client-side pending — 2 Aug: almost everything closed

✅ **CLOSED 2 Aug:** s56 client template received · folder structure APPROVED (with 3 client improvements) ·
roster fully closed (Nisha = former employee) · full 482 + 485 s56 threads supplied.
✅ **M9 MAILBOX VERIFIED END-TO-END 3 Aug (D-149)** — Run-once returned a real inbox message with full body.
Connection, scopes and read access all proven. Nothing outstanding on this item.
⬜ Non-blocking: test files for M10 · M6 wording 👍 · walk-in sheet location · Make paid plan at go-live.
**➡️ The live outstanding balance now lives in `CLIENT-ASKS.md` — read it, not this section.**
✅ **Gmail OAuth was NEVER needed** (D-271): `Yale's Gmail connection` already exists on `visa.lodgement@`
with `gmail.modify`, client-created, valid to Jan 2027. **M4b and M5b are buildable today.**

## ✅ THREE-AGENT PARALLEL AUDIT — 2 Aug (artifacts · client record · document consistency)
**Headline: nothing the client sent is lost.** All 143 client files exist; `access/` ↔ `assets/samples/` match
on all 17 with identical SHA-256 hashes; CLIENT-LOG covers 6 Jul → 2 Aug with 42 entries and no unexplained gap.
**But 12 real defects were found and fixed**, the three worst being:
1. **T2 BLOCKER** — `SBS`/`Nomination` routed to folder SET 2 but were rejected by the Visa Type dropdown
   (`setAllowInvalid(false)`), making every employer-side matter a dead end at data entry (D-138).
2. **Ship-ladder gate contradicted the build** — it told the tester to verify **5** SET-1 folders when the
   build creates **6**. Definitions were fixed 2 Aug; the acceptance test was not (D-139).
3. **We were still telling ourselves the client was blocking us** — the `visa.lodgement@` reauthorize was
   completed by Robinder on **31 Jul**; ROADMAP, STATUS and memory all still said he had to do it (D-134).
   Re-asking him would have been the most credibility-damaging thing available.
Also fixed: renumber corruption (`D-128` never existed), 8 client answers that lived only in PROJECT-STATE,
3 client-PII files tracked in git, a U+202F filename mismatch, op-count and authority-chain contradictions.

## 🔴 Earlier pre-build audit 2 Aug — caught a wrong build before it happened
`ARCHITECTURE.md` was still **v1**: 10-folder tree, 10-column data contract, obsolete Gmail-delegation model,
wrong script names. It is the file CLAUDE.md points to for conventions, so **T3 would have created 10 wrong
folders in the client's live OneDrive.** Rewritten to v2; `scenarios/M3-folder-create.md` rewritten to v2 with
the three approved folder sets. New gate **G6 (single source, never restate)** added — the drift existed
because the column list and folder tree were duplicated across files.

## Commercial

- ✅ 50% received ($840)
- ⬜ Final 50% on MVP go-live
- Make **paid plan** required at go-live (Free = 1,000 ops/month) — raise at the demo, while the client is
  happy about seeing it work

---

## The question to answer every session

**"What can the client actually see working?"**

Today, 13 Aug: **a demo video of folders being created; a checklist library that selects itself; a
dormancy alert running unattended every morning; and an operations dashboard with six live views.**
That is a real answer for the first time.

**What they cannot see yet: their own clients in it.** That is A-14, and it is the only thing left
worth chasing.
