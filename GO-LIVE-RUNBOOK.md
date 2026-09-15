# Go-live runbook — 15 September 2026

**One page. Do it in order. Every step says how to know it worked.**

⛔ Steps 1–3 write to the client's live record. Everything after is reversible.

---

## STEP 1 · Clear the demo rows  ·  2 min  ·  YOURS

Open **MASTER DATABASE → MASTER**. Rows 2–15 hold 14 invented people
(`ANJALI SHARMA`, `MARIA SANTOS`, `JOSE REYES` …). **Select rows 2–15 → right-click → Delete rows.**

✅ **Safe, and verified:** `nextNumber_` takes `max(highest code in the sheet, a high-water mark
stored in DocumentProperties) + 1`. Deleting cannot cause a code to be reused — numbering continues
from 15 even on an empty sheet (D-490).

🔑 **Why bother:** invented people sitting beside real ones is exactly how demo data was once quoted
to the client as their own (D-463). On screen they are indistinguishable.

**Worked when:** MASTER has a header row and nothing else.

---

## STEP 2 · Paste the 38 real clients  ·  3 min  ·  YOURS

Open `SOP'S/client-data/master-import.csv`, select all rows **except the header**, copy, and paste
into **MASTER at cell A2**.

⚠️ **Paste into A2, not A1.** A1 is the header row.
⚠️ **Columns A–Y only.** Z–AE (`Docs Received`, `Docs Outstanding`, `Third Party`, `Third Party
Status`, `Upload Link`, `Chase Flag`) are filled by staff, not by us — leave them empty (C-3/C-4).

**Worked when:** 38 data rows, real names, and the **Client Code column is empty**. That last one is
correct — the 5-minute `assignMissingCodes` trigger fills it.

⛔ **If any cell is refused**, stop and tell me. The locked-column check passed on all ten dropdowns
before this runbook was written, so a refusal means something changed and it must not be typed over.

---

## STEP 3 · Wait 5 minutes, then confirm the codes  ·  YOURS

`assignMissingCodes` runs every 5 minutes. After it, every row should carry `YM-2026-000NN`,
**starting at 15** because of the high-water mark.

**Worked when:** 38 codes, all unique, none reused from the demo set.

---

## STEP 4 · Re-run the sync  ·  1 min  ·  YOURS

```bash
cd "/Users/muhammadsharjeel/Downloads/SOP'S/yale-build" && \
SYNC_SECRET='<from Netlify>' bash -c '
for t in matters s56 enquiries; do
  echo "── $t"; curl -s -H "Authorization: Bearer $SYNC_SECRET" \
    "https://yalemigration.netlify.app/api/sync?tab=$t"; echo
done'
```

**Worked when:** `matters` reports **`read: 38, written: 38`**.

⚠️ `s56` and `enquiries` will still ABORT — those tabs are genuinely empty. **That is correct
behaviour, not a failure.** The guard refuses to sync an empty set rather than wiping the
destination.

---

## STEP 5 · Look at the dashboard  ·  YOURS

`https://yalemigration.netlify.app` — sign in with the Yale Google account.

**Worked when:** real client names appear instead of `A. NGUYEN` and `B. SHARMA`.

🔑 **This is the moment the project stops being a demo.**

---

## STEP 6 · Switch the automation on  ·  MINE

Once steps 1–5 are confirmed, I activate, **in this order and one at a time**:

| order | scenario | why this order |
|---|---|---|
| 1 | `YM-M9-email-triage` | reads only; nothing can be damaged by a mistake |
| 2 | `YM-M9b-info-triage` | same, second mailbox |
| 3 | `YM-M3-folder-create` | starts WRITING — folders and sheet cells |
| 4 | `YM-M4-checklist-file` | drafts client email. Drafts only, never sends |

⛔ **Read-only before write, always.** If M9 misbehaves the worst case is a bad row in a tracker. If
M3 misbehaves it creates folders in a real client's storage.

⛔ **Watch the first run of each before starting the next.** A green manual run says nothing about
the scheduled one — the failure inbox is part of shipping.

---

## STEP 7 · M10 — the pilot  ·  MINE, needs 3 names from Robinder

Three real clients, end to end, watched. **This is the module that makes "zero clients processed"
untrue** — everything before it is capability, not proof.

---

## Not in this runbook, and why

| | |
|---|---|
| Facebook · Instagram · WhatsApp | Meta's approval gates (D-491). Not ours to schedule |
| Website form | one sharing click from Robinder |
| C-2 upload link · M11 handover | need the Microsoft 365 purchase |
| Rename the Make connections | **housekeeping before handover.** Scenarios are wired by id, so it blocks nothing |
| Rotate the Supabase key | do it this week; it gates nothing here |
