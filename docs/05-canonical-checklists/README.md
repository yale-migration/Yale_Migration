# CANONICAL CLIENT CHECKLIST LIBRARY — the ONLY set M4 may select from
**Built 6 Aug 2026 (D-242/D-243), 190 added 11 Aug (D-280).** 23 client checklists + 5 reference documents.

## Why this folder exists
The same document lived in up to **four** places under different names — 67 files on disk, only 47 unique.
That is what caused the G8 failure (a document declared missing while sitting in an unsearched folder), and
it is what would make a filename-based selector send the wrong checklist. **One folder, one name per
variant, one hash per file.**

## Rules
1. **M4 selects from THIS folder only.** Never scan the wider tree.
2. **Naming is the contract:** `<subclass>_<variant>[_<authority-or-location>].<ext>`
3. **Every file's SHA-256 is in `MANIFEST.json`.** If a hash changes, the document changed — re-verify
   before it goes to a client.
4. **Never edit a file here.** Replace it, update the manifest, record the decision.
5. `REF_*` files are NOT client checklists — reference only, never auto-sent.

## Selector matrix
| Visa Type (col H) | Extra input | Canonical file |
|---|---|---|
| 485 | Skills Authority × dependent | `485_{INDIVIDUAL\|DEPENDENT}_{ACECQA\|TRA\|VETASSESS\|MASTERS-BACHELORS}` |
| 500 | Location × dependent | `500_{INDIVIDUAL\|DEPENDENT}_{ONSHORE\|OFFSHORE}` · `500_ADDING-DEPENDENT` |
| 820/801 · 300 | — | `820-801_PARTNER.docx` |
| 482 · SBS · Nomination | — | `482_SKILLS-IN-DEMAND.docx` |
| 407 | — | `407_TRAINING.docx` |
| 189 | — | `189_SKILLED-INDEPENDENT.docx` |
| 491 | — | `491_SKILLED-REGIONAL.docx` |
| 494 | — | `494_EMPLOYER-REGIONAL.docx` |
| 802 · 101 | — | `802_CHILD.docx` · `101-802_CHILD-VISAS.docx` |
| 417 | — | `417_WORKING-HOLIDAY.pdf` |
| 190 | — | ✅ `190_SKILLED-NOMINATED.docx` — supplied 11 Aug, content verified (D-280) |
| 186 · 191 · 600 · Skills Assessment · EOI · ART · Bridging · Other | — | No checklist exists → Needs Review |

## Dependent detection
`Party 2 Name` (col D) filled ⇒ `DEPENDENT` variant, else `INDIVIDUAL` (D-228).
Asymmetric risk: an extra document list is an annoyance; a missing one costs the client documents.

## ⛔ QUARANTINED — never use
`1c7a663480` — the old `485 … INDIVIDUAL-VETASSESS.pdf` whose page-1 heading wrongly reads
"WITH DEPENDENT". Superseded by `485_INDIVIDUAL_VETASSESS.docx` (`e6c9fc5230`, supplied 6 Aug).
**It still sits in three source folders** and any filename-based selector would pick it.
