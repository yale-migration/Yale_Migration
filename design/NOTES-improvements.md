# What changes from the 14 Aug prototype, and why

Design system kept **exactly**: `--paper #f4f6f4` · `--accent #0d5c63` · Georgia headings ·
system sans body · `--r 10px` · tabular figures · the `--good/--warn/--crit` status trio and the
validated `--s1/--s2/--s3` categorical slots. Dark mode kept. No new colours, no new fonts.

Three changes, each traceable to a finding in this repo — not to taste.

## 1 · 🔴 The client view opens on what the CLIENT owes, not on a tidy timeline

The prototype **hides "Needs you today" entirely for clients** (`display:none`) and shows a
completed-steps timeline instead. That inverts the one thing this practice actually needs.

**D-34 found the real business pain is dormancy** — real files sat **16 and 71 days** with no
contact, waiting on documents from the client. **M5a, M8 and route C all exist to chase clients for
paperwork.** A client portal that opens on "here is what you have already done" is decorative; one
that opens on **"here is what we are still waiting for, and by when"** is the same chase, delivered
by the client's own curiosity instead of a consultant's follow-up.

The completed timeline stays — underneath, as reassurance. It just stops being the headline.

## 2 · Section 56 deadlines get their own card in the staff views

The prototype predates M9. Section 56 is now captured, parsed and independently date-verified —
and it is the **highest-consequence thing in the practice**: miss it and the Department decides the
application on what it already has, without asking again.

"Going quiet" and "Visa expiring" are already on the board. A **legal** deadline outranks both and
was missing.

⚠️ It shows the **internal** date (legal − 2 days, D-58), with the legal date beside it — that is
how their own SOP ladder works, and a board showing only the legal date invites working to the wire.

## 3 · The client view answers "how long?" before they ring to ask

M7 exists because the phones ring. A large share of those calls are *"any news?"* — a question a
portal can answer for free, at 2am, without a consultant.

So the client view carries a plain **"What happens next"** line and when the file was last updated.
⛔ It deliberately gives **no predicted decision date**: a processing-time estimate presented on a
migration agent's own portal reads as a commitment, and nobody at Yale controls it.

## Deliberately NOT added

- **Document upload.** It would make the portal a *writer*, and the architecture is one-way by
  design (`P3-DASHBOARD-ARCHITECTURE.md`). Worth doing, worth quoting, not worth smuggling in.
- **A predicted grant date.** See above.
- **Anything the RMA would have to stand behind.** The portal reports status. It never advises.
