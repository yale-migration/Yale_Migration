# M9 — Gmail triage & AI spec (grounded in real client samples, 29 Jul 2026)

Sources: SAMPLE-S56 LETTER.pdf · SAMPLE-S56 REQUESTS.pdf · SAMPLE-STUDENT VISA EMAIL THREAD.pdf ·
SAMPLE-485 VISA EMAIL THREAD.pdf · SBS(482) thread. All in `assets/samples/` (local, git-ignored, PII).

## 🚨 FINDING 1 — "Section 56" NEVER appears in the Department's letters
Yale's SOPs call it "Section 56"; the Department does not. The real letter says:
- Title: `Request for more information for a <visa name> (subclass NNN) visa application`
- Body: `We need more information to help us assess your application.`
Only Act named is `Privacy Act 1988`. **A classifier keyed on "s56"/"section 56" would miss every real
request.** Detect on the phrase set below instead. (Keep `s56` as a *separate* signal for
internal/staff-written email about an S56.)

### S56 detection phrases (high confidence, quote-exact)
1. `We need more information to help us assess your application.` ← strongest; in letter AND checklist
2. `Request for more information for a` … `visa application` (title pattern; subclass = variable slot)
3. `You have 28 days starting on the day after we emailed this request to give us the information we have asked for.`
4. `When do you need to give us the information`
5. `What happens if you do not provide the information in time`
6. `If you do not send us the information we need within the time we have given you, we can decide the
   application with the information we have at that time without asking you again.`
7. `In reply quote` · `Delegate of the Minister` · `Application summary`
8. `The original of this letter including any attachments was sent to your authorised recipient:`
9. Attachment doc title: `REQUEST CHECKLIST AND DETAILS` · anchor `This request checklist is for <name>`
Weak/supporting: homeaffairs.gov.au + immi.homeaffairs.gov.au + online.immi.gov.au + naati.com.au URLs;
`Australian Government` / `Department of Home Affairs` letterhead.

### Identifier regexes (for extraction into MASTER)
| Field | Sample | Regex |
|---|---|---|
| Transaction reference number (TRN) | `EGP9XF6H64` | `\b[A-Z0-9]{10}\b` (labelled) |
| Application ID | `1540713558` (10) · `365718045` (9) | `\b\d{9,11}\b` **with label context** — ⚠️ corrected per D-68: the old `\b\d{10}\b` MISSED every 9-digit ID |
| Client ID | `49924648532` | `\b\d{11}\b` |
| File number | `BCC2025/7294045` | `\b[A-Z]{3}\d{4}/\d{7}\b` |
| Position number | `60168462` · `60093715` | `Position number:\s*\d{6,10}` — length varies per officer (D-68); always label-anchored |

### 🚨 FINDING 2 — Deadline is RELATIVE, never printed as a date
`due_date = letter_date + 1 day + days_allowed` (letter_date from the `Date: DD Month YYYY` line).
- PARSE the number before `days` — do not hardcode 28.
- ALWAYS store the verbatim deadline sentence + letter_date next to the computed date (human check).
- The attachment contains a SECOND, differently-anchored 28-day line (`within 28 days of you receiving
  this notice`) — the covering letter is authoritative; flag if the two disagree.
- Deadline is extendable (`We might let you have more time…`) → a passed date must NOT auto-close a file.
- Decoy dates nearby: DOB (`08 Sep 1994`) and the Form 80 instruction `State dates in the format
  DD/MM/YYYY.` — never extract these.

## Email categories (from real threads — with observed volumes)
| Category | Real examples | Notes |
|---|---|---|
| Client sending documents | 5 of 11 msgs in the student thread (**~45%**) | usually ZERO body text — classify on attachments |
| Acknowledgement of receipt | `Received ma'am.` / `Received ate.` | pure boilerplate → prime automation target |
| Document request / checklist issue | checklist + forms pack | template-driven |
| Invoice / fee quote | fee table embedded in the checklist email | money lives on email only, never chat |
| Department correspondence (S56 etc.) | the S56 package | URGENT flag path |
| Follow-up / dormancy nudge | `Hi ma'am! / Kumusta?` after 77 days | see Finding 4 |
| Scheduling | AFP appointment ping-pong | short, high-frequency |
| System noise | Mailsuite read receipts (`notification@mailsuite.com`) | **never reply, never draft** |

## 🚨 FINDING 3 — Language reality: Taglish / Tagalog / Ilocano code-switching
Real message: `Adda insend ko a a link para jy enrollment, kindly fill it out and click "save and submit
later" then lagay mo yung email ko…` (Ilocano + Tagalog + English in one sentence).
- `ate` (Tagalog: older sister) is an honorific — `Received ate.` is CORRECT, not a typo. Model must not
  "fix" it.
- Classifier prompt must state that mixed-language messages are normal and must not be normalised.

## 🚨 FINDING 4 — The real business pain is DORMANCY, not slow replies
Measured reply speed when engaged: 4 min · 5 min · 8 min · 28 min · 58 min (fast).
Measured file dormancy with NO chase: **16 days** (student thread) and **71 days** (485 thread) — broken
only by a two-word nudge. Only Mailsuite read-receipts were "watching".
→ The dormant-file detector + templated nudge is the single highest-value automation in M9/M5.

## Tone fingerprint (drafts must match exactly)
Openings: `Hi Ma'am,` / `Hi ma'am,` / `Hi ate,` / `Ma'am,` / `Hi ma'am!` + `Kumusta?`
Reused sentences: `Kindly submit them once available.` · `Kindly share the following,` · `Received ma'am.`
· `Please find attached files for your <subclass> visa application.` · `Note: Please send us a copy of
your payment!` · `Use your name as a reference` · `Feel free to call or message me with your inquiries
regarding your application.` · Filipino politeness: `po`, `Sige po ma'am.`
Closing (invariant, every outbound email):
```
Thank you.

Kind regards,
Reyward Jake Gamol
Consultant
[logo]
Yale Migration and Education Consultants
A Head Office: Level 12 - 241 Adelaide Street, Brisbane, QLD, Australia.
E philippines@yalemigration.com.au I W yalemigration.com.au I M 0450217063 I PH 07 3394 8330 I Like Us on Facebook
<Breach of Confidentiality disclaimer>  ·  P Think Green. Please print this email only if you really need to.
```
Note: separator glyph is the letter `I`, not `|`. Two disclaimer variants exist (colon / no colon).

## Subject-line patterns (observed)
- `STUDENT VISA APPLICATION_<CLIENT NAME>_VISA EXPIRY <MONTH YEAR>_<COURSE>` (underscore-delimited, CAPS)
- `485 VISA CHECKLIST` (whole 46-message lifecycle under one subject)
→ **Subject is unreliable for routing after msg 1** (and one sample even misspells the client's own
name). Classify on body + attachments; use `VISA EXPIRY <MONTH YEAR>` as a priority signal when present.

## Attachment naming (real)
Inbound patterns worth hard-coding: `CoECertificate-<SURNAME>-<First>-<QUAL>-<DD.MM.YYYY>.pdf` ·
`<Surname>_<First>_<Middle>_<CHCxxxxx>_<7-digit>.pdf` · `IMMI Grant Notification (n).pdf` · `PSA-…` ·
`<Client Name>_<Doc Type>.pdf`. Outbound templates carry download cruft `(1) (9) (38)` — strip trailing
`(n)` groups when matching template names. Standardise renames to `FirstName LastName_Doc Type.pdf`.

## MANDATORY safety rules
1. **Never auto-send.** Every AI output is a Gmail DRAFT for human review (D-06).
2. **Never generate migration advice.** Only the RMA advises. ⚠️ COMPLIANCE FLAG: outbound emails in
   both threads are signed `Consultant` with **NO MARN anywhere** (Robinder is MARN 1573959). Raise with
   client: who is the supervising RMA for AI-assisted drafts, and should the MARN appear?
3. **Hard-block topics** → acknowledgement only + route to RMA: refusal · ART/AAT · cancellation · s501
   · imminent visa expiry.
4. **Quote-stripping is mandatory** before classification (`[Quoted text hidden]` ×9 in one thread;
   real new content is often 2–5 words). Otherwise the model classifies the previous message.
5. **Suppress Mailsuite/system notifications** from the reply path entirely.
6. **Confidence threshold → "Needs Review"** label, never a silent guess.
7. **PII:** the S56 PDFs are visually redacted but the TEXT LAYER contains full client identifiers.
   Samples stay in `assets/samples/` (git-ignored). Never commit; never paste into prompts as literals.

## Model plan
- Classification: Haiku, temperature 0, tool-use JSON schema
  `{category, is_department_request, urgency, due_date, days_allowed, deadline_sentence, trn,
  application_id, client_name, subclass, suggested_assignee, confidence, needs_review}`
- Draft replies: Sonnet-class, grounded in the template snippets above, always as a draft.
- Few-shot examples drawn from the real threads (redacted before use).

## Still needed from client
1. **Yale's S56 client-request + follow-up email wording** — the file supplied under that name contains
   only WhatsApp screenshots (mislabelled/duplicate). Also need the reminder cadence (`if no response in
   X days`).
2. **2–3 raw `.eml` S56 emails** (headers intact) — no sample contains a sender address or subject line,
   the cheapest classifier features. All PDFs are image-only scans.
3. **S56 samples for other subclasses** (500/485/820-801/GSM) to confirm the title template and the
   28-day figure hold.
4. Confirm the supervising RMA / MARN question in safety rule 2.

---

## ✅ THE OUTPUT MAPPING — RESOLVED 19 Aug 2026, no UI visit needed

This was logged for days as *"30 seconds in the Make UI: read the tool-use output path off the
Anthropic module's field picker"* — an item only Sharjeel could do. It was resolved instead with
`app-module_get(anthropic-claude@1, createAMessage, format=json)`, which returns the module's full
output interface over the API. **0 operations.** The same mistake as D-310: an answer we already had
access to, filed as a question for someone else.

### The real shape

`content` is an **array**. Each element carries:

| field | type | |
|---|---|---|
| `type` | text | `text` · `thinking` · `tool_use` |
| `text` | text | present on text blocks |
| `thinking` · `signature` | text | present when extended thinking is on |
| `id` · `name` | text | the tool call |
| **`input`** | **collection** | 🔑 **the tool arguments — our classification JSON** |
| `tool_use_id` · `caller` · `content` · `citations` | | |

Top level also returns `stop_reason`, `usage`, `model`, `tools`.

### 🔴 Two traps, both silent

**1. `content[1]` is not reliably the tool call.** A text or thinking block can precede it. Index
into it blindly and `.input` is empty — the parser writes `UNPARSEABLE`, which is visible, but the
run still "succeeded". Filter by type instead of trusting position:

```
map(1.content; "input"; "type"; "tool_use")
```

**2. ⛔ `input` is a COLLECTION, not text.** Write a collection into a sheet cell and it renders
`[object Object]`. `s56_parse_classifications.gs` already treats that exact string as garbage —
`s56pExtractJson_()` returns null on it and the row becomes `UNPARSEABLE`. So the obvious mapping
produces a permanently unparseable column and looks like a model problem, not a mapping problem.
It must be serialised:

```
{{ toJSON(first(map(1.content; "input"; "type"; "tool_use"))) }}
```

→ writes to `S56 TRACKER` column S `Raw Classification`. The parser takes it from there.

⚠️ **Confirm with one live run before trusting it (1 operation).** The path and types above come
from the module schema and are verified; `toJSON`/`map`/`first` behaving as expected in this exact
nesting is the part a single execution proves. Check the cell holds `{"category":...}` and not
`[object Object]`.

---

## 🏗 BLUEPRINT BUILD — 19 Aug 2026

`scenarios/M9-email-triage.blueprint.json`. Three modules: the existing Gmail trigger →
Anthropic classify → Sheets log. Validated module-by-module against Make's own validator.

### 🔴 Four corrections found by validating instead of assuming

**1. The scenario already existed.** `YM-M9-email-triage` = **6781676**, created 1 Aug, inactive,
trigger already configured and **already proven against a real message on 3 Aug**. It was found only
by listing connections and noticing `scenarioUsages`. A whole blueprint had been written from scratch
before that. **Check what exists before building it.**

**2. ⛔ The trigger is `google-email:triggerWatchNewEmails` v4 — NOT `TriggerNewEmail` v1.**
`app-modules_list` returns only the latter; the former is not exposed by the API at all. They are
different modules with **different output field names**:

| this scenario uses | the API's module |
|---|---|
| `fullTextBody` | `text` |
| `fromEmail` | `from.address` |
| `internalDate` | `date` |
| `id` | `messageId` |
| **no link field — build the URL from `id`** | `messageLink` |

Mapping against the wrong one yields empty cells, not errors. The live blueprint is the source of
truth here, not the module catalogue.

**3. Make's wrapper ≠ the Anthropic API shape.** Proven by `validate_module_configuration`:
`messages[]` needs `inputType: "single"` beside `content`; a tool needs `type: "custom"` and its
`input_schema` takes only `properties` + `required`; and `tool_choice` requires
`disable_parallel_tool_use`. The raw-API shape fails validation on all three.

**4. The Gmail-side filter replaces a Make filter entirely.** `includeWords` ("Has the words") is
executed **by Gmail**, accepts full search syntax including `from:`, and costs no operations —
which matters because Make's own `text:contains` is accepted and then evaluates FALSE silently
(D-255). `limit` also raised 1 → 10 so a burst of Department mail is not missed.

### ⬜ The one thing still open

`google-sheets:addRow` cannot be finished yet:

```
Unable to parse range: 'S56 TRACKER'!A1:ZZ1
Value 'S56 TRACKER' not found in options
```

**The tab does not exist** — `setupS56Tracker()` has never been run. With `useColumnHeaders`, Make
resolves the column names from the live header row, so the mapper's final shape cannot be determined
until the tab is there. Two further errors (`insertUnformatted` mandatory, `values` not a recognised
key) are blocked behind the same resolution.

▶ **ACTION (Sharjeel): run `setupS56Tracker()` then `verifyS56Tracker()`.** Then I finish the mapper,
validate it, and the blueprint is complete.

⚠️ Even complete, M9 cannot be **activated**: the Free plan caps ACTIVE scenarios at 2 and M3 + M4
hold both slots. That is a plan decision (I-21), not build work.
