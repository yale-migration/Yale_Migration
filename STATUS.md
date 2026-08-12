# STATUS — single source of "where are we"

**Updated:** 2026-08-11 · Read this FIRST every session, then **`CLIENT-ASKS.md`** (`PROCESS.md` ritual).

---

## The one-line truth

**Three modules are built, proven against live client data, and running on the client's own account.
The demo has been sent. The system is not yet switched on.**

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
| **Shipped to the client** | ✅ **Demo video sent** | first client-visible delivery |

**Honest read:** ~17 of 40 build-hours ≈ **43%**. The foundation is finished and every remaining module
reads from a data layer that now works. What is done is genuinely done — proven from execution output, not
assumed.

## What is actually left — named plainly

**Nothing in the build is blocked by us.** Both scenarios sit INACTIVE because switching on a 15-minute
schedule costs ~2,880 operations/month EACH against a 1,000 free allowance — that is the Make Core plan
(A-01), and Sharjeel has chosen to hold that ask until the tracker import and dashboard make the value
self-evident (D-273).
**Operations used this month: 477 of 1,000** (M3 dev 399 · M4 27 · leftovers 43 · misc 8).
**Next build: the ~48-row tracker import** — needs nobody's permission and unlocks the real dormant list
plus the dashboard.

---

## 📍 PHASE PLAN — ✅ phases 1 and 2 complete

| Phase | Contents | State |
|---|---|---|
| ~~1 — SHIP THE DEMO~~ | idempotency proof · delete test folders · record + send | ✅ done 5 Aug |
| ~~2 — HARDEN M3~~ | error handlers · sanitization · routing · full test matrix | ✅ done 5 Aug (D-207…D-217) |
| **3 — M4 / M5 onward** 🎯 | M4a ✅ · M5a ✅ · **next: tracker import**, then M4b/M5b | in progress |

M3's patterns became the standard — M4 and M5 reused them and were built in a fraction of the time.

## 🎯 THE ONLY ACTIVE THING

> ### ✅ 5 Aug — M3 IS COMPLETE AND PROVEN (D-197 … D-219)
> Every branch has executed against the client's live drive: **SET 1 · SET 2 · SET 3 + 820/801 nesting ·
> Filipino team · Indian team · hostile characters · 4 rows in one run · unroutable safely blocked ·
> idempotent re-run = 0 bundles.** Routing, sanitization and error handling are all built and verified.
> Cost measured: **10 ops/client** (SET 1/2), **13** (SET 3).
> **Blocking go-live: only the Make Core plan (B5).** Both schedules stay OFF until it's bought.

> ### 🎯 NEXT: IMPORT THE ~48 REAL CLIENT MATTERS
> Needs nobody's permission. Turns M5a's dormant list from `0` into the real 16-day and 71-day gaps, and is
> the hard dependency for the dashboard Robinder asked for. **~2 Make operations** using Bulk Add Rows.
> ⛔ Do NOT let M3/M4 create 48 folders yet — that is ~670 operations against 523 remaining.


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
Today: nothing. Until that changes, it is the only priority.
