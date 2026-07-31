# STATUS — single source of "where are we"

**Updated:** 2026-07-31 · Read this FIRST every session (`PROCESS.md` session ritual).

---

## The one-line truth

**Discovery and design are genuinely well advanced. Client-visible output is still ZERO.**
Both halves of that sentence are true and both matter.

## What the client can see working right now

**Nothing.** No automation has shipped. This is the only number that matters to Robinder.

## What is genuinely done (real work, not padding)

| Area | State | Evidence |
|---|---|---|
| Requirements gathering | ✅ **Complete** | 3 SOP batches + access folder + WhatsApp answers + 2 real S56 email threads, all audited |
| Access & credentials | ✅ ~95% | Sheets · OneDrive **read+write proven** · Make Admin · Meta BM · Claude key. Open: `visa.lodgement@` |
| Discovery of their real system | ✅ **Complete** | ~1,436 client folders mapped · folders are FLAT · tracker = 49 active rows · naming chaotic · S56 routing chain found |
| Design / specs | ✅ Written | MASTER sheet v2 · M3 folder scenario · M6 auto-reply · M9 email AI · M9 connection runbook |
| Code written | ✅ Verified | `setup_master_sheet.gs` (23 headers, 9 dropdowns) · `master_codes.gs` (YM code engine) |
| Decision record | ✅ 91 entries | `DECISIONS.md` — nothing lost across chats or devices |
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

**T2 — build the MASTER sheet.** Both scripts are written and verified. Needs ~10 minutes of Sharjeel
pasting and running them. Nothing blocks it. No client dependency.

Then, in strict order, nothing else in between:

| Step | What | Who | Time | Produces |
|---|---|---|---|---|
| **T2** | Run the 2 Apps Scripts | Sharjeel | 10 min | Working MASTER sheet + auto client codes |
| **T3** | Build `YM-M3-folder-create` | Sharjeel + me | ~90 min | Name typed → OneDrive folder + 5 sub-folders + link back |
| **T4** | Record 60–90s demo, send | Sharjeel | 20 min | **First thing the client can SEE working** |

**T4 is the target.** Everything else waits.

## Explicitly PARKED (do not touch until T4 has shipped)

- M9 mailbox connection — runbook is complete and frozen; execute it when M9 starts, not now
- The video for Robinder about the Gmail connection — same reason
- M4/M5/M6/M7/M8 build work
- Tracker import of the ~48 active rows (after T3, not before)

## Client-side pending (none of it blocks T2/T3/T4)

- `visa.lodgement@` connection (M9 only)
- 👍 on the 5 sub-folder names — building against proposed names meanwhile
- S56 email screenshot — drafting from their real wording instead of waiting

## Commercial

- ✅ 50% received ($840)
- ⬜ Final 50% on MVP go-live
- Make **paid plan** required at go-live (Free = 1,000 ops/month) — raise at the demo, while the client is
  happy about seeing it work

---

## The question to answer every session

**"What can the client actually see working?"**
Today: nothing. Until that changes, it is the only priority.
