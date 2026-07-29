# M6 — Enquiry auto-reply spec (grounded in real WhatsApp screenshots, 29 Jul 2026)

Source: `SAMPLE-WhatsAPP inquiry Screenshot.pdf` (4 real conversations) — local only, git-ignored.

## 🚨 THE BUSINESS CASE, in the client's own data
| Conversation | Enquiry time | First staff reply | Gap |
|---|---|---|---|
| Tourist/309 refusal | 11:18 am | 3:43 pm | 4h 25m |
| "What are the new ART process changes?" | 4:28 pm | **none** | never answered |
| "What is the process for Subclass 417 Visa?" (Swedish number) | 4:15 pm | **none** (`1 unread`) | never answered |
| Warm referral (sister of existing client) | 11:35 am | 11:35 am | <1 min |

**2 of 3 cold ad enquiries were never answered at all.** Warm/named contacts get sub-minute replies; cold
paid-ad leads leak. All three cold enquiries came from Facebook/Instagram ads
(`This chat started from an ad on Facebook or Instagram`) — i.e. **leads they paid for, dropped.**
That single table is the demo argument for M6.

## 🚨 Staff currently ask NO qualifying questions
The complete set of questions staff asked across all four conversations:
- `kelan po ang best time to call you ma'am?` ("when is the best time to call you ma'am?")

Nothing else. No subclass, no visa status, no expiry, no location, no name, no email. So the qualifying
set below is **designed from scratch** and must be approved by the client before going live (👍 rule).

BUT enquirers volunteer routable detail unprompted — subclass (`417`, `309`), stage (`I already lodged
309`), adverse history (`She got refusal on tourist`), and who it's for (`for my wife`, `my sister`).
→ Extract from free text first; only ask what's still missing.

## Auto-reply flow (proposed — needs client 👍)
**Step 1 — instant acknowledgement (reuse their real wording, grammar fixed):**
> Hi! Thank you for reaching out to Yale Migration. One of our consultants will get in touch with you
> shortly. To help us prepare, could you please answer a few quick questions?

*(Their original: `Thank you for reaching out. One of our consultant will get in touch with you shortly.`
— keep `shortly`; do NOT invent an SLA the client has never promised.)*

**Step 2 — qualifying questions (max 4, one message):**
1. Your full name?
2. Which visa are you asking about? (e.g. Student 500, Graduate 485, Partner, Work 482, Tourist 600 —
   or describe your situation)
3. Are you currently **in Australia** or **overseas**?
4. If you hold a visa now — what type, and when does it expire?

**Step 3 — log to ENQUIRIES tab** (Date · Name · Phone · Channel · Visa Interest · Onshore/Offshore ·
Assigned To · Status · Follow-up Due) + auto-assign per the roster matrix (team × visa × office).

**Step 4 — follow-up cadence** (from their Inquiry SOP): 7-day nudge, then 30-day; stop on reply.

## 🚨 HARD-BLOCK topics — acknowledge only, route to RMA, never auto-answer
Trigger words: `refus*` · `ART` · `AAT` · `tribunal` · `cancel*` · `s501` · `appeal` · `review` ·
`overstay*` · `bridging` · visa expiry within 30 days.
Block reply:
> Thank you for reaching out. Your situation needs review by one of our Registered Migration Agents —
> they will contact you directly.

Justification: staff already refuse to answer these on chat (all three substantive questions went
unanswered, deliberately). The automation must **enforce** the existing behaviour, not invent it.
Only the RMA may give migration advice (D-06).

## Language rules
- Real staff register: warm, deferential, short turns, `ma'am`/`po` politeness, lowercase starts,
  **no emoji** from staff (emoji appear only in ad creative).
- Taglish is normal for the Filipino segment — BUT one enquirer had a **Swedish phone number**, so:
  **English by default**, light-`po` variant only when the conversation is already in Taglish/Tagalog.
- **Never quote fees on chat.** Zero pricing talk appears in any WhatsApp conversation — money lives on
  email only. Preserve that split.
- Never promise a specific timeframe beyond `shortly`.

## Channel notes
- All cold leads arrive via **FB/IG ad → click-to-WhatsApp**; the ad card is attached above the message
  (useful: the ad title hints at intent, e.g. `Student Visa Refused? Your ART Cas…`).
- Handoff today is manual and memory-based: staff paste `Philippines@yalemigration.com.au` by hand
  (capitalisation inconsistent) and arrange calls by asking for a time. No booking link, no CRM
  reference. → Phase 2 appointment booking has an obvious slot here.
- After-hours arrivals (4:15 pm, 4:28 pm) are exactly the ones that went unanswered → auto-reply must
  run 24/7 even though human follow-up is business hours.

## Open items
- Client 👍 on the qualifying questions + block-list wording before live.
- Confirm business hours for the human-handoff notification (default Brisbane 08:00–20:00).
- WhatsApp Business API verification status (Meta) still to confirm — FB/IG can go live first.
