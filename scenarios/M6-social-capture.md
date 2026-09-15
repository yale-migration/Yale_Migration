# M6 transport — Facebook & Instagram comments into ENQUIRIES

> 🔴 **SUPERSEDED 15 Sep 2026 — see D-491.** The design below assumed Make could watch a Page's
> comments and receive DMs. Reading the schemas shows it cannot: `WatchComments` is **per-post**,
> and `facebook-messenger` v2 is **send-only with no trigger**. Receiving DMs needs a Meta App and
> App Review for `pages_messaging`. The page access question this document called an unknown **is
> now closed** — the page is `1695697263975147`, confirmed via the `Pages` RPC. Keep this file for
> the row mapping and the hard rules, which still stand; ignore the transport shape.

**Status: designed, not built.** Spec-first, the same way M3 and M4 were done — the blueprint is
mechanical once the two unknowns below are closed.

🔑 **The decision layer already exists and is finished.** `m6_enquiry_triage.gs`, **72 checks**:
visa detection, onshore/offshore, consultant routing, blocked-matter handling, and the abuse guard.
**This document is only about the pipe**, not the brain. Nothing here decides anything.

---

## Two unknowns, and neither is guessable

**1 · Can the connection actually see the Yale page?**
Meta has two layers — added to the Business Manager, and *assigned the assets*. Meta's own docs:
*"a person added with no assets assigned shows as added and grants nothing at all."* We are through
layer 1. **Layer 2 is unconfirmed.**
▶ **Check:** in Make, add *Facebook Pages → Watch Comments* and open the **Page** dropdown. Yale
Migration present = confirmed. Empty = Robinder must tick the Page under Settings → People → Assets.

**2 · The module version.** `WatchComments` is verified to exist on `facebook-pages`, but
`app-module_get` will not resolve the app for this org, so the blueprint's `version` field cannot be
read. ⛔ **Not guessing it.** Building the module once in the UI settles it, and the exported
blueprint then becomes the committed artefact — exactly how `M3-folder-create.blueprint.json` came
to exist.

---

## Shape

One trigger per source, because a Make scenario has exactly one trigger (D-474). So **two
scenarios**, sharing the same downstream logic:

| Scenario | Trigger | Source |
|---|---|---|
| `YM-M6a-facebook-comments` | `facebook-pages : WatchComments` | Yale Migration Page |
| `YM-M6b-instagram-comments` | `instagram-business : NewComment` | @yale_migration |

Both then: **Apps Script decision → append to ENQUIRIES.**

```
[Watch comments]  ->  [Apps Script: m6ToEnquiryRow_]  ->  [Sheets: addRow -> ENQUIRIES]
```

⚠️ **The decision does NOT belong in Make.** It is 72 tested checks in Apps Script. Re-implementing
any of it as Make filters would create a second copy that silently drifts — and Make's filters
cannot express it anyway (`text:contains` is accepted and then evaluates false in silence, D-255).

---

## The row

`m6ToEnquiryRow_(message, meta, today)` returns the 11 columns in order. The scenario supplies
`meta` only:

| meta field | value |
|---|---|
| `date` | comment created time |
| `name` | commenter's name |
| `phone` / `email` | **always blank** — a comment carries neither. ⛔ Never infer |
| `channel` | `Facebook comment` or `Instagram comment` — literal, never derived (D-330) |
| `office` / `team` | blank. Unknown from a comment; routing falls back correctly |

Everything else — subclass, location, assignee, status, notes — is the decision layer's and must not
be set by the scenario.

---

## ⛔ Hard rules

**1 · Nothing is ever posted back.** The credentials were requested without any create/reply/delete
permission (D-476), so this is enforced by the token, not by the blueprint. Do not add a reply
module later without re-reading D-481.

**2 · Abuse is written closed, not dropped.** `Status = 'Abuse — Blocked'`, no assignee, no
follow-up date (D-483). It stays visible so somebody can hide the comment and ban the account.

**3 · Deduplicate.** Comment watchers re-deliver on edit. Two rows for one comment is a consultant
contacting someone twice. Key on the comment id.

**4 · Business hours only.** Match M9: 15-minute interval, Mon–Fri 08:00–18:00. At ~40 polls/day per
scenario that is **~1,760 ops/month for both**, against the 5,000 the Core plan provides — leaving
room for M3, M4 and M9.

---

## Order of work, once the Page dropdown is confirmed

1. Build `YM-M6a` in the UI, three modules, **leave it inactive**
2. Run it once manually against real comments — the page currently carries live examples, including
   the abusive ones, which is an honest test set
3. Verify: a genuine comment lands assigned; an abusive one lands closed with no assignee
4. Export the blueprint to `scenarios/M6a-facebook-comments.blueprint.json` and commit
5. Clone for Instagram as `YM-M6b`
6. ⛔ Switch on **only** at go-live, with the other eleven

## What this does not cover

**Messenger and Instagram DMs.** `facebook-pages` watches comments, not conversations — a different
app and a different permission set. Most real enquiries arrive as DMs, not public comments, so this
is **half of M6's traffic at best**. Scope it separately before promising it.
