# STATUS — single source of "where are we"

**Updated:** 2026-08-03 · Read this FIRST every session (`PROCESS.md` session ritual).

---

## The one-line truth

**Discovery and design are genuinely well advanced. Client-visible output is still ZERO.**
Both halves of that sentence are true and both matter.

## What the client can see working right now

**The MASTER database is live and issuing client codes** (T2 complete, 3 Aug) — but Robinder has not been
shown it yet. **Client-visible SHIPPED output is still zero until the T4 demo.** T3 (folder automation) is the
piece that makes the demo worth watching.

## What is genuinely done (real work, not padding)

| Area | State | Evidence |
|---|---|---|
| Requirements gathering | ✅ **Complete** | 3 SOP batches + access folder + WhatsApp answers + 2 real S56 email threads, all audited |
| Access & credentials | ✅ **100%** | Sheets · OneDrive **read+write proven** · Make Admin · Meta BM · Claude key. ✅ `visa.lodgement@` authorized 31 Jul — only our own Run-once check remains |
| Discovery of their real system | ✅ **Complete** | ~1,436 client folders mapped · folders are FLAT · tracker = 49 active rows · naming chaotic · S56 routing chain found |
| Design / specs | ✅ Written | MASTER sheet v2 · M3 folder scenario · M6 auto-reply · M9 email AI · M9 connection runbook |
| Code written | ✅ Verified | `setup_master_sheet.gs` (23 headers, 9 dropdowns) · `master_codes.gs` (YM code engine) |
| Decision record | ✅ complete, with a SUPERSEDED INDEX | `DECISIONS.md` — nothing lost across chats or devices |
| **Anything shipped** | ❌ **Zero** | — |

**Honest read:** roughly the front half of the MVP is done, but it is all *inputs*. A spec is not a
deliverable (`PROCESS.md` standing rule). We are not at step 0 — we are at the point where the build must
start producing visible output, and it hasn't yet.

## Why nothing has shipped yet — named plainly

31 Jul went into an M9 mailbox permission — a module that is **days away and not on the critical path** —
while T2/T3/T4, which produce the client's first working demo, sat untouched. Depth on the wrong thing looks
identical to progress. Gate **G4 ONE-FOCUS LOCK** in `PROCESS.md` exists to stop this recurring.

---

## 🎯 THE ONLY ACTIVE THING

**T3 — build `YM-M3-folder-create`.** Spec is v3 (linear, 7 modules). No client dependency; the demo path
(BRISBANE + FILIPINO) uses the one fully-verified parent folder. T2 finished 3 Aug.

Then, in strict order, nothing else in between:

| Step | What | Who | Time | Produces |
|---|---|---|---|---|
| ~~T2~~ | ~~Run the 2 Apps Scripts~~ | ✅ **DONE 3 Aug** | — | MASTER + ENQUIRIES live, `YM-2026-00001` issued |
| **T3** | Build `YM-M3-folder-create` | Sharjeel + me | ~90 min | Name typed → OneDrive folder + the correct folder SET (6/6/5 by visa type) + link back |
| **T4** | Record 60–90s demo, send | Sharjeel | 20 min | **First thing the client can SEE working** |

**T4 is the target.** Everything else waits.

## Explicitly PARKED (do not touch until T4 has shipped)

- M9 mailbox connection — runbook is complete and frozen; execute it when M9 starts, not now
- The video for Robinder about the Gmail connection — same reason
- M4/M5/M6/M7/M8 build work
- Tracker import of the ~48 active rows (after T3, not before)

## Client-side pending — 2 Aug: almost everything closed

✅ **CLOSED 2 Aug:** s56 client template received · folder structure APPROVED (with 3 client improvements) ·
roster fully closed (Nisha = former employee) · full 482 + 485 s56 threads supplied.
✅ **M9 MAILBOX VERIFIED END-TO-END 3 Aug (D-149)** — Run-once returned a real inbox message with full body.
Connection, scopes and read access all proven. Nothing outstanding on this item.
⬜ Non-blocking: test files for M10 · M6 wording 👍 · walk-in sheet location · Make paid plan at go-live.

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
