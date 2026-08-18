#!/usr/bin/env python3
"""
Build the MASTER import from the team's RETURNED client list.          (D-330)

    python3 scripts/build_master_import.py            # report only, writes nothing
    python3 scripts/build_master_import.py --write    # -> ../client-data/master-import.csv

Two sources, joined on client name:
  1. `2026-08-18_CLIENT-LIST-TO-UPDATE_returned.xlsx` — what the team filled in on
     18 Aug: team, consultant, email, office, surnames, skills authority.
  2. `YALE BRISBANE OFFICE WORK.xlsx` -> `LODGEMENT JULY TO PRESENT` — their live tab,
     which still owns STATUS, CURRENT VISA and VISA EXPIRATION.

The join was verified before this script was written: 39 of 40 returned names match a
row in the original exactly. Two originals are absent from the returned list — the
`SAMPLE` test row and one duplicate — which is what we expected them to drop.

⛔ Report-only by default. The CSV holds 40 real people. It is written to
`../client-data/`, outside the repo, and must never be committed.

============================ WHAT THIS SCRIPT REFUSES TO DO =========================
* It does not repair the `gmil.com` email. One character from `gmail.com`, and almost
  certainly a typo — but "almost certainly" is not a basis for sending a real client's
  checklist to an address we invented. Flagged, imported verbatim, human decides.
* It does not guess the 4 missing 485 skills authorities. The team left those blank.
  Without one, M4 route B stamps NEEDS REVIEW — which is the correct outcome, not a
  bug to paper over.
* It does not assign a consultant where the sheet says `NO LONGER CLIENT`. Those rows
  are HELD BACK entirely (see below).
"""
import argparse, collections, csv, datetime, os, re, sys, warnings
warnings.filterwarnings("ignore")

HERE = os.path.dirname(os.path.abspath(__file__))
CD   = os.path.join(HERE, "..", "..", "client-data")
RET  = os.path.join(CD, "2026-08-18_CLIENT-LIST-TO-UPDATE_returned.xlsx")
ORIG = os.path.join(CD, "YALE BRISBANE OFFICE WORK.xlsx")
OUT  = os.path.join(CD, "master-import.csv")

# 🔴 THE LIVE GOOGLE SHEET AND THE .xlsx EXPORT DISAGREE ON THIS TAB NAME (D-337).
# Live:   'LODGEMENT: JULY TO PRESENT'   (colon)
# Export: 'LODGEMENT JULY TO PRESENT'    (Excel forbids ':' and renamed it silently)
# Anything pointed at the LIVE sheet must use the colon form or it finds no tab —
# and finds it without erroring, which is worse. Accept either, everywhere.
LODGEMENT_TAB_NAMES = ['LODGEMENT: JULY TO PRESENT', 'LODGEMENT JULY TO PRESENT']
GOOGLE_SHEET_IDS = {
    'YALE BRISBANE OFFICE WORK': '1NbaxgzHIiUM1yas1B3lt21ycNKyufPxXTxZPP0wamLI',
    'REYWARD JAKE M GAMOL-2026': '1_YDeb7iwHQr0c3MGKp0jp8MMyqBzqlr7sz36u8Qn4pc',
    'STUDENTS':                  '1XlnqEi42ZJNu3_vwNN8WgKcCk4zlzWyCyRQ9We_V9_A',
}

MASTER_HEADERS = ['Client Code','Their Client ID','Full Name','Party 2 Name','Contact Number',
 'Email Address','Location','Visa Type','Visa Variant','Office','Team','Assigned Consultant',
 'Processing Stage','Visa Outcome','Grant Date','Visa Expiry','Refusal Reason','Last Contact',
 'Next Follow-up Due','Date Added','Source','Folder URL','Notes','Skills Authority','Checklist Filed']

TEAM   = {'F': 'FILIPINO', 'I': 'INDIAN'}
# The sheet is upper-case and uses their shorthand. The dropdown is setAllowInvalid(false),
# so anything not landing on a roster value is REJECTED by the cell.
STAFF  = {'ROBIN':'Robinder','INDER':'Inder','RJ':'RJ','STAR':'Star','REY':'Rey',
          'PRIYANKA':'Priyanka','FIZA':'Fiza','GAYATRI':'Gayatri','CRISTELLE':'Cristelle'}
# Q15, answered 18 Aug: "Pending means not yet drafted and lodged."
STAGE  = {'LODGED':('Lodged','Pending'), 'DRAFTED':('Ready for Lodgement','Pending'),
          'PENDING':('Documents Pending','Pending'), 'WITHDRAWN':('Closed','Withdrawn')}
SKILLS = {'ACECQA','TRA','VETASSESS','Not required (Bachelor/Masters)','Engineers Australia'}
MAPPED = {'485','500','482','SBS','Nomination','407','820/801','189','190','491','494','802','101','417'}
DEAD   = re.compile(r'no longer (a )?client', re.I)
TODAY  = datetime.date.today()
norm   = lambda s: ' '.join(str(s or '').upper().split())


def sheets():
    import openpyxl
    for p in (RET, ORIG):
        if not os.path.exists(p):
            sys.exit("missing %s — client data lives OUTSIDE the repo" % os.path.basename(p))
    w = openpyxl.load_workbook(RET, data_only=True)["CLIENT LIST TO UPDATE"]
    ret = [[('' if w.cell(r, c).value is None else str(w.cell(r, c).value).strip())
            for c in range(1, 12)] for r in range(2, w.max_row + 1)]
    ret = [x for x in ret if x[0]]
    wb = openpyxl.load_workbook(ORIG, read_only=True, data_only=True)
    tab = next((t for t in LODGEMENT_TAB_NAMES if t in wb.sheetnames), None)
    if not tab:
        sys.exit("no lodgement tab found. Looked for: %s. Sheet has: %s"
                 % (LODGEMENT_TAB_NAMES, wb.sheetnames))
    rows = list(wb[tab].iter_rows(values_only=True))
    wb.close()
    hdr = [str(c).strip() if c else '' for c in rows[0]]
    idx = {h: i for i, h in enumerate(hdr)}
    orig = {}
    for r in rows[1:]:
        nm = r[idx['NAME']] if idx.get('NAME') is not None and idx['NAME'] < len(r) else None
        if nm and norm(nm) not in orig:
            orig[norm(nm)] = {h: (r[i] if i < len(r) else None) for h, i in idx.items()}
    return ret, orig


def split_visa(raw):
    """'485 Dependent' -> ('485','Dependent').  '600  (no checklist yet)' -> ('600','')."""
    s = re.sub(r'\(.*?\)', '', str(raw or '')).strip()
    variant = ''
    m = re.search(r'\b(dependent|subsequent entrant|sponsor|employer)\b', s, re.I)
    if m:
        variant = m.group(1).title()
        s = re.sub(r'\b' + m.group(1) + r'\b', '', s, flags=re.I).strip()
    return re.sub(r'\s+', ' ', s).strip(), variant


def as_date(v):
    if isinstance(v, datetime.datetime): return v.date().isoformat()
    if isinstance(v, datetime.date):     return v.isoformat()
    s = str(v or '').strip()
    m = re.match(r'^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$', s)
    if m:
        d, mo, y = (int(x) for x in m.groups())
        try: return datetime.date(y, mo, d).isoformat()
        except ValueError: return ''
    return ''


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--write", action="store_true")
    a = ap.parse_args()

    ret, orig = sheets()
    out, held, flags = [], [], collections.Counter()
    notes_extra = collections.defaultdict(list)
    unmatched, seen_email = [], {}

    for row in ret:
        name, visa_raw, team_c, cons, email, party2, skills, last, phone, office, surname = row

        # 1. HELD BACK — the sheet says they are gone. Never create a folder for these.
        if DEAD.search(cons) or DEAD.search(name):
            held.append((name, 'marked "no longer client" in the consultant column'))
            flags['held: no longer a client'] += 1
            continue

        full = name if len(name.split()) > 1 else (name + ' ' + surname).strip()
        if len(full.split()) < 2:
            held.append((name, 'still a single name — no surname supplied'))
            flags['held: no surname'] += 1
            continue

        o = orig.get(norm(name), {})
        if not o:
            unmatched.append(name)
            flags['no matching row in LODGEMENT tab'] += 1

        note = ['Imported from the team\'s returned list on %s (YM-DQ-e573)' % TODAY]

        # 2. Team
        t = TEAM.get(team_c.upper(), '')
        if not t and team_c: note.append('team code %r not F/I' % team_c); flags['team unrecognised'] += 1
        if not team_c:       flags['team BLANK'] += 1

        # 3. Consultant. Two names in one cell -> take the first, record both.
        c_raw = cons.upper().strip()
        if '/' in c_raw:
            first = c_raw.split('/')[0].strip()
            consultant = STAFF.get(first, 'Unassigned')
            note.append('sheet said "%s" — shared file, assigned to the first named' % cons)
            flags['two consultants in one cell'] += 1
        else:
            consultant = STAFF.get(c_raw, '' if not c_raw else 'Unassigned')
            if c_raw and c_raw not in STAFF:
                note.append('consultant column said "%s"' % cons); flags['consultant off-roster'] += 1
        if not c_raw: consultant = 'Unassigned'; flags['consultant BLANK'] += 1

        # 4. Email — validate, never repair
        em = email.strip()
        if em:
            dom = em.split('@')[-1].lower()
            if re.match(r'^gm[ai]{0,2}l\.com$', dom) and dom != 'gmail.com':
                note.append('EMAIL DOMAIN LOOKS WRONG (%s) — confirm before sending' % dom)
                flags['🔴 email domain typo'] += 1
            k = em.lower()
            if k in seen_email:
                note.append('this email is also on another row — confirm which client owns it')
                flags['🔴 duplicate email'] += 1
            seen_email[k] = True
        else:
            flags['email BLANK — no checklist or chase email possible'] += 1

        # 5. Visa
        vt, variant = split_visa(visa_raw)
        if vt and vt not in MAPPED:
            flags['visa has no checklist -> NEEDS REVIEW'] += 1
        if not vt: flags['visa BLANK'] += 1

        # 6. Skills authority — 485 only, and only the five the MAP resolves
        sk = skills.strip()
        if sk.lower() in ('n/a', 'na', ''): sk = ''
        elif sk not in SKILLS:
            if '<--' in sk or 'needed' in sk.lower():
                sk = ''
                if vt == '485':
                    note.append('485 with no skills authority — M4 will stamp NEEDS REVIEW')
                    flags['🔴 485 missing skills authority'] += 1
            else:
                note.append('skills authority %r is not one of the five in CHECKLIST MAP' % sk)
                flags['skills authority not a MAP value'] += 1
                sk = ''

        rec = dict.fromkeys(MASTER_HEADERS, '')
        rec['Full Name']           = full
        rec['Email Address']       = em
        rec['Visa Type']           = vt
        rec['Visa Variant']        = variant
        rec['Office']              = office.upper() if office else 'BRISBANE'
        rec['Team']                = t
        rec['Assigned Consultant'] = consultant
        rec['Skills Authority']    = sk
        rec['Party 2 Name']        = party2
        rec['Contact Number']      = phone
        rec['Last Contact']        = as_date(last)
        rec['Visa Expiry']         = as_date(o.get('VISA EXPIRATION'))
        st = str(o.get('STATUS') or '').strip().upper()
        stage, outcome = STAGE.get(st, ('', ''))
        rec['Processing Stage'], rec['Visa Outcome'] = stage, outcome
        if st and st not in STAGE:
            note.append('their STATUS was %r' % st); flags['status word unmapped'] += 1
        if variant: note.append('dependent/secondary applicant — checklist differs')
        rec['Notes'] = ' | '.join(note)
        out.append(rec)

    # ---------------------------------------------------------------- report
    print("=== SOURCE ===")
    print("  rows in the returned list ....... %d" % len(ret))
    print("  HELD BACK ....................... %d" % len(held))
    for n, why in held: print("      · %-28s %s" % (n[:26], why))
    print("  READY TO IMPORT ................. %d" % len(out))
    if unmatched:
        print("  ⚠️  no LODGEMENT row (no status/expiry): %d" % len(unmatched))

    print("\n=== FIELD COVERAGE (of %d importable rows) ===" % len(out))
    for f in ('Team','Assigned Consultant','Email Address','Visa Type','Processing Stage',
              'Visa Expiry','Skills Authority','Contact Number','Last Contact','Party 2 Name'):
        n = sum(1 for r in out if r[f])
        bar = '█' * int(20 * n / max(len(out), 1))
        print("  %-22s %2d/%d %-21s %s" % (f, n, len(out), bar,
              '' if n == len(out) else '← %d missing' % (len(out) - n)))

    print("\n=== WHAT M3 AND M4 WILL DO WITH THIS ===")
    fileable = [r for r in out if r['Visa Type'] in MAPPED and
                (r['Visa Type'] != '485' or r['Skills Authority'])]
    print("  M3 creates a folder for ......... %d  (all of them)" % len(out))
    print("  M4 files a checklist for ........ %d" % len(fileable))
    print("  M4 stamps NEEDS REVIEW for ...... %d" % (len(out) - len(fileable)))
    print("  M4b can draft a checklist email . %d  (needs an email address)"
          % sum(1 for r in fileable if r['Email Address']))
    print("  est. first-run operations ....... ~%d of the 519 left this month"
          % (1 + len(out) * 5 + len(out) * 4))

    print("\n=== FLAGS ===")
    for k, v in flags.most_common(): print("  %-52s %d" % (k, v))

    if a.write:
        with open(OUT, 'w', newline='', encoding='utf-8') as fh:
            w = csv.DictWriter(fh, fieldnames=MASTER_HEADERS); w.writeheader(); w.writerows(out)
        print("\nWROTE %s  (%d rows)" % (os.path.normpath(OUT), len(out)))
        print("⛔ 40 real people. Outside the repo. Never commit it.")
    else:
        print("\n(report only — pass --write to produce the CSV)")


if __name__ == "__main__":
    main()
