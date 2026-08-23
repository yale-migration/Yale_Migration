# Checklists received from Yale — HELD, not live

Three document checklists Yale supplied on **21–22 Aug 2026**, unprompted, after RJ offered to write
the lines we had no coverage for.

| File | Received | Scanned (D-249 markers) |
|---|---|---|
| `YM-186-EMPLOYER-NOMINATION.pdf` | 21 Aug | single variant · **carries a fee table** · no bank details · no PII |
| `YM-CITIZENSHIP.docx` | 22 Aug | single variant · no fees · no bank details · no PII |
| `YM-SUBCLASS 600 (TOURIST VISA).docx` | 22 Aug | single variant · no fees · no bank details · no PII ⚠️ opens `3AUSTRALIAN VISITOR VISA` — stray leading `3`, theirs to fix |

## ⛔ Why these are NOT in `05-canonical-checklists/`

That folder is **the only set M4 may select from**, hash-recorded in `MANIFEST.json` and cross-checked
by `verify_blueprints.py`. Putting a file there is a statement that the system can file it. These
three cannot be filed yet — none has a `CHECKLIST MAP` row and none is in M4's router, so moving them
across without the rest of the work would make the library claim coverage it does not have.

**That is not a technicality.** D-325: the 190 checklist sat in the canonical folder for a week with
no MAP row, every 190 client was stamped `NO CHECKLIST MAPPED — review`, and the document we had
chased three times was never filed. **A file in the library that the router cannot reach is worse
than a file that is openly missing**, because the library looks complete.

## What moving one across actually takes — CR-013, quoted, unstarted

Per line: upload to OneDrive `INFORMATION HUB → CLIENT DOCUMENT CHECKLISTS` · add its `CHECKLIST MAP`
rows · **add the visa type to M4's router** (D-285 — this is the step that was missed for 190) ·
extend the partition proof in `verify_blueprints.py` · end-to-end test on a real row.

**5.0 h / USD 175 for all three** (`QUOTE-P3-DASHBOARD.md`'s sibling, `QUOTE-CR-013-visa-lines.md`).
⛔ Billable, and **not started**. The documents arriving does not make the plumbing free.

✅ `Citizenship` is already a valid MASTER visa type as of 22 Aug (D-353/D-362), so those rows can
exist and land on `NEEDS REVIEW` — which is the correct behaviour until this work is quoted and done.
