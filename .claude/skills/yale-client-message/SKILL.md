---
name: yale-client-message
description: Gate before ANY message, document, question or file goes to Yale Migration (Robinder or the team). Use when drafting a client email, WhatsApp, PDF or question list, or when asked to send, ask, or chase anything.
---

# Nothing reaches this client until every line below is true

Robinder came via Hardiek Patel, his brother-in-law, whose automation we also built.
**Mistakes travel beyond this engagement.** That is the reason for the friction here.

## 1 · 🔴 Can our own files answer it? (G9)
Open the file that would answer the question — do not reason about whether one exists.

Every ask we have had to walk back had the same shape: *we asked, then found we already
held it, or the question itself was wrong.*
- The staff roster sat in `access/` for **three weeks** before we asked for it (D-310).
- **A-09's premise was wrong** — the "$2,028 agency fee" was a DHA charge plus card
  surcharge, answerable from a workbook we already had (D-315).
- **A-17 sent them to a 47-row tab that is 36 rows of nothing but names**, because we
  recommended it without opening it.

Check `DECISIONS-INDEX.md`, `CLIENT-LOG.md`, `ACCESS.md`, and the `access/` and
`New-docs/` folders they actually sent.

⛔ **Retracting an ask costs more credibility than asking late.**

## 2 · Verify every claim against a primary source THIS SESSION (G1)
No capability, UI path, limit or figure reaches them on memory.
🔑 **Compute every number; never type one.** "five 485s", "28 checklists" and
"~403 clients" were all wrong, all typed, all in text meant for the client.

## 3 · Name the exact file, tab and path (G5)
"Your sheet" is not an instruction. `LODGEMENT JULY TO PRESENT`, column `TEAM` is.

## 4 · One ask, not five
Ask twenty and he answers two (`VOICE-MESSAGE-robinder.md`). Four is the cap for
Robinder. Check `CLIENT-ASKS.md` first — **nothing is asked twice** (G2).

## 5 · Money
⛔ No cost, price, quote, fee or payment language unless the ask *is* the money.
This is the first project with this client and the second one is worth more than being
early on the first. Fee lookups go to the team, not the owner.

## 6 · Never in writing
⛔ **A-18 — the ~1,200 plaintext credentials.** Verbal only, one-to-one with Robinder.
In writing, addressed to a Registered Migration Agent, it is discoverable, it names the
exact tabs, and it reads as an accusation. Same content on a call reads as help.
Follow up in writing with **the solution only**, never the inventory.

## 7 · Scope
New requests are **not** scope. Log in `CHANGE-REQUESTS.md` + `PHASE-2-3-BACKLOG.md`,
reply *"Phase 2/3 list mein daal diya"*, keep building. We have already absorbed ~16h
free (`HOURS-LEDGER.md`). Never absorb. Quote before working.

## 7b · 🔴 WHEN A CLIENT RETURNS OUR OWN DOCUMENT — diff it, do not read it

⛔ **Do not scan for `Answer:` lines.** People type where the sentence ends, not where the form
expects. On 18 Aug two answers were written INSIDE our own paragraphs — including **a direct yes to
a scope offer worth five visa lines** — and two separate passes slid past both (D-336).

```bash
# isolate exactly what THEY added
python3 - <<'EOF'
# extract every paragraph, normalise, and print only those absent from our source template
EOF
```
Also: **never print their text truncated.** A 150-character cut hid *"because too much column is a
lot to handle"* — the clause that changed the right answer.

## 7c · 🔴 CHECK A GENERATED DOCUMENT AGAINST ITSELF

Verifying every claim against the code is not enough — it misses the document disagreeing with
**itself** (D-346, all three found after a clean fact-check):

- ⛔ **No page numbers in prose.** "(page 2)" became wrong the moment a layout fix repaginated it.
  Say "at the end of this document".
- **Count the thing you claimed to count.** "Nine views" sat above a ten-row table.
- **Quantity words against the list.** "A couple of things" introduced seven.
- Read the rendered PDF, not just the markdown — pagination is where these appear.

## 8 · 🔴 RECONCILE BOTH WAYS before sending
List every open item from `CLIENT-ASKS.md` **and** `INPUTS-REGISTER.md`, then tick each one off
against the draft:
- **every open item → is it in the message, or deliberately excluded for a stated reason?**
- **every question in the message → is it still genuinely open?**

⛔ Deliberately excluded is fine; **silently dropped is not.** On 18 Aug a draft that read complete
was missing six items, including a *yes* to something the client had proposed themselves (D-335).
Incompleteness is invisible from inside a draft — it only appears when the list is built separately.

## 9 · Record it
Append to `CLIENT-LOG.md` the same day, and update the row in `CLIENT-ASKS.md`.
