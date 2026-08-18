---
name: yale-ship
description: The Yale session-end ritual — hygiene gate, WHERE-WE-STAND, DECISIONS + index, CLIENT-LOG, commit. Use whenever finishing a piece of work on the Yale Migration build, or when asked to wrap up, record, or commit.
---

# Session end — every time, no exceptions

Run in this order. Each step exists because skipping it cost something dated.

## 1 · Hygiene
```bash
python3 scripts/repo_hygiene.py          # on its own line — read the whole output
```
⛔ **NEVER pipe it into `tail`, `grep` or `head` inside an `&&` chain.** A pipeline's exit status is
the LAST command's, so `repo_hygiene.py | tail -1 && git commit` **commits even when the gate
fails** — that is exactly how two client names reached this repo on 18 Aug (D-334). The gate printed
`LEAKED` six times and the commit went through.
If the output is long: `python3 scripts/repo_hygiene.py > /tmp/hyg.txt 2>&1; echo $?`

The commit hook enforces this too (D-329), so a failure here will block the commit
anyway. Run it first so the failure is a sentence rather than a rejected tool call.
It checks tracked **and untracked-not-ignored** files — the set `git add -A` stages.

## 2 · `WHERE-WE-STAND.md`
The one file a fresh session reads. Update:
- §1 one-line position
- §2 module table — mark what changed state
- §4 resume table — strike what is done, renumber what is left
- §5 risks — close what closed, add what appeared

⛔ Strike completed rows (`~~—~~ ✅`) rather than deleting them. The trail of what was
done and when is what makes the file trustworthy after a context reset.

## 3 · `DECISIONS.md`
Append only. Header **must** be `## D-NNN | Title` on ONE line or the index skips it
silently. **Take NNN from the current maximum, never from a count** (G7).

Write the *why*, the evidence, and what would have happened otherwise. A decision
entry that only records the outcome is worth very little six weeks later.

Then: `bash scripts/gen_decisions_index.sh`

## 4 · `CLIENT-LOG.md`
Same day, every day, even on days with no client contact (G3). A 13-day gap caused
D-310 — we asked the client for a staff roster we had held for three weeks.

## 5 · Commit
```
git add -A && git commit -m "<module>: <what changed>"
```
⛔ **COMMIT ONLY — never `git push`.** `origin` is a personal GitHub account and this
repo documents a client's data. Company orgs are BrandRadar-AI · Roar-AI-Labs ·
Apex-AI-Clients. Ask Sharjeel every time (D-317). The hook will warn; the warning is
not permission.

## Before claiming anything works
Run whichever apply and quote the counts:
- `python3 scripts/verify_blueprints.py` — M3/M4 route partition
- `node scripts/test_m5_dormancy.js` — M5a
- `node scripts/test_m6_enquiries.js` — M6

🔑 **A build log is not verification.** Three of the four audit rounds on this project
found defects that every review had passed and a *run log* exposed. If a view, a route
or a rule has never been seen producing the output it exists to produce, it is not done.
