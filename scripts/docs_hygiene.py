#!/usr/bin/env python3
"""
docs_hygiene.py — catches the defect classes that hide in "just updating a document".

⛔ WHY THIS EXISTS (D-384/D-385). Two documents were brought up to date on 23 Aug 2026 and
BOTH contained a defect that would have reached a client:

  · CALL-RUNBOOK's section ⓪ promised the row-28 spelling at "④-4b" — and section ④ had no
    4b. The ask that decides a real client's FOLDER NAME was a pointer to nothing. A reader
    follows the promise, not the link, so the document read complete.
  · The same runbook still said "68% built" and "~25 of 40 hours" weeks after both changed,
    and still listed two pre-import blockers that were already closed.

Both were found by accident. Nothing would have caught the third. This is that something.

🔑 THE MODEL IS D-353's: close a bug class at every layer rather than fixing the instance.
   The ids are checked against their REGISTERS, the numbers against ONE source (POSITION.json),
   and the file paths against the DISK — never against a copy, because a copy drifts.

Run:  python3 scripts/docs_hygiene.py            # FAIL blocks, WARN reports
      python3 scripts/docs_hygiene.py --self-test  # proves the gate actually fails

⛔ NEVER pipe this into `tail`/`head`/`grep` inside an `&&` chain — a pipeline's exit status
   is the LAST command's, so the gate silently passes (D-334, walked into twice).
"""
import json, os, re, sys, datetime, tempfile, shutil, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TODAY = datetime.date(2026, 8, 23)

# Documents that must describe the world AS IT IS NOW.
LIVE_DOCS = [
    'CLAUDE.md', 'WHERE-WE-STAND.md', 'CALL-RUNBOOK-robinder-friday.md',
    'CLIENT-ASKS.md', 'INPUTS-REGISTER.md', 'HONEST-ASSESSMENT.md', 'LESSONS.md',
    'MVP-STATUS-simple.md', 'CUTOVER-PLAN.md', 'DASHBOARD-TRACKER.md',
    'DASHBOARD-DEMO-WALKTHROUGH.md', 'CHANGE-REQUESTS.md', 'PHASE-2-3-BACKLOG.md',
    'ACCESS.md', 'docs/M8-FOLLOWUP-TEMPLATES.md',
]
# Append-only or point-in-time. An old number here is HISTORY, not drift.
ARCHIVES = ('DECISIONS.md', 'DECISIONS-INDEX.md', 'CLIENT-LOG.md', 'STATUS.md')
ARCHIVE_PREFIXES = ('SENT-', 'DRAFT-', 'VOICE-', 'BRIEF-', 'CALL-BRIEF', 'QUOTE-')

REGISTERS = {
    # 🔴 Only 96 of 384 decisions carry a "##" heading; the older ones are bare
    # "D-255 | title" lines. Matching only "## D-" reported 111 phantom failures on the
    # first run. This is gen_decisions_index.sh's own pattern — one definition, not a copy.
    'D': ('DECISIONS.md',      re.compile(r'^(?:#{2,3}\s*)?D-0*(\d+)\s*\|', re.M)),
    'A': ('CLIENT-ASKS.md',    re.compile(r'\bA-0*(\d+)')),
    'I': ('INPUTS-REGISTER.md',re.compile(r'\bI-0*(\d+)')),
    'CR':('CHANGE-REQUESTS.md',re.compile(r'\bCR-0*(\d+)')),
}
REF_RE   = re.compile(r'\b(D|A|I|CR)-(\d{1,3})\b')
PATH_RE  = re.compile(r'`([A-Za-z0-9_][A-Za-z0-9_/.\-]*\.(?:md|gs|py|js|sh|json))`')
# 🔴 THE SUFFIX IS NOT OPTIONAL DECORATION. The real defect was written "④-4b", and the
# first version of this regex ended in \b after \d{1,2} — between "4" and "b" there is NO
# word boundary, so the pattern never matched the one string this gate exists to catch.
# Found by the self-test, not by review. A gate that has never failed is not a gate.
SECT_RE  = re.compile(r'([⓪①②③④⑤⑥⑦⑧⑨])-(\d{1,2}[a-z]?)(?![0-9a-z])')
# Money language that must not appear in text a CLIENT will read (yale-client-message gate).
MONEY_RE = re.compile(r'(\bno cost\b|\bfree (?:consultation|first|of charge)\b|\$\s?\d)', re.I)
CLIENT_FACING = ['docs/M8-FOLLOWUP-TEMPLATES.md', 'docs/M6-AUTOREPLY-SPEC.md']

fails, warns = [], []
def fail(f, msg): fails.append(f'{f}: {msg}')
def warn(f, msg): warns.append(f'{f}: {msg}')

def is_archive(rel):
    base = os.path.basename(rel)
    return base in ARCHIVES or base.startswith(ARCHIVE_PREFIXES)

def load(rel):
    p = os.path.join(ROOT, rel)
    return open(p, encoding='utf-8').read() if os.path.exists(p) else None

def build_register_index():
    """{'D': {382, 383, ...}, ...} — parsed from the registers themselves, never copied."""
    idx = {}
    for kind, (fname, rx) in REGISTERS.items():
        txt = load(fname)
        if txt is None:
            fail(fname, 'REGISTER IS MISSING — every id of this kind is unverifiable')
            idx[kind] = None
        else:
            idx[kind] = {int(m) for m in rx.findall(txt)}
    return idx

# ---------------------------------------------------------------- CHECK 1: ids
def check_ids(rel, txt, idx):
    for kind, num in set(REF_RE.findall(txt)):
        known = idx.get(kind)
        if known is None or int(num) in known:
            continue
        fail(rel, f'{kind}-{num} is referenced but is in no register '
                  f'({REGISTERS[kind][0]}) — a pointer to nothing')

# -------------------------------------------------------------- CHECK 2: paths
_DISK = None
def disk_index():
    """Every file in the repo, by relative path AND by basename — because the docs
    cite `repo_hygiene.py`, not `scripts/repo_hygiene.py`, and both must resolve."""
    global _DISK
    if _DISK is None:
        rels, bases = set(), set()
        for dirpath, dirnames, filenames in os.walk(ROOT):
            dirnames[:] = [d for d in dirnames
                           if d not in ('.git', 'node_modules', '__pycache__', '.next')]
            for fn in filenames:
                full = os.path.join(dirpath, fn)
                rels.add(os.path.relpath(full, ROOT))
                bases.add(fn)
        _DISK = (rels, bases)
    return _DISK

def check_paths(rel, txt):
    rels, bases = disk_index()
    for path in set(PATH_RE.findall(txt)):
        if '*' in path or path.startswith(('http', 'e.g')):
            continue
        if path in rels or os.path.basename(path) in bases:
            continue
        fail(rel, f'`{path}` does not exist on disk')

# ----------------------------------------------------------- CHECK 3: sections
def check_sections(rel, txt):
    """④-4b bit us: a cross-reference to a numbered item that was never written.

    🔑 Only checked INSIDE the file that DEFINES the circled section. A "④-8" in
    WHERE-WE-STAND points at the runbook's section 4, not at its own — treating that as
    a same-file reference was the third false-positive class on the first run."""
    rows = set(re.findall(r'^\|\s*(\d{1,2}[a-z]?)\s*\|', txt, re.M))
    for circle, item in set(SECT_RE.findall(txt)):
        if not re.search(r'^#+\s*' + circle, txt, re.M):
            continue          # this file cites another file's section — not ours to verify
        if item in rows:
            continue
        # ⛔ Do NOT accept a "# ④b" heading as the target of "④-4b". They are different
        # things and conflating them is what let the original slip: the hyphen form means
        # "item N of section ④" everywhere else in the runbook (④-2, ④-8, ④-10), while
        # "④b" is a section in its own right. The real ④-4b pointed the reader at "the
        # strongest thing you will say all call" when it promised row 28's spelling — a
        # link that RESOLVES to the wrong place, which is worse than one that resolves
        # to nothing, because nothing looks broken.
        fail(rel, f'cross-reference to {circle}-{item}, but no row "| {item} |" exists '
                  f'in this file — THIS IS THE ④-4b BUG')

# ------------------------------------------------------------ CHECK 4: numbers
STALE_MARKERS = ('superseded', 'historical', 'was ', '~~', 'stale', 'no longer',
                 'invites', 'do not say', 'never volunteer', 'old ')
def check_numbers(rel, txt, pos):
    for i, line in enumerate(txt.splitlines(), 1):
        low = line.lower()
        if any(m in low for m in STALE_MARKERS):
            continue
        for m in re.finditer(r'(\d{1,3})%\s*(?:built|BUILT)', line):
            if int(m.group(1)) != pos['built_pct']:
                warn(rel, f'line {i}: says {m.group(1)}% built, '
                          f'POSITION.json says {pos["built_pct"]}%')
        for m in re.finditer(r'(\d{1,3}(?:\.\d)?)\s*of\s*(\d{2})\s*contracted', line):
            got, tot = float(m.group(1)), int(m.group(2))
            if tot == pos['contracted_hours'] and abs(got - pos['built_hours']) > 0.05:
                warn(rel, f'line {i}: says {got} of {tot} contracted, '
                          f'POSITION.json says {pos["built_hours"]}')

# -------------------------------------------------------------- CHECK 5: dates
DATE_RE = re.compile(
    r'\b(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(20\d\d)\b',
    re.I)   # CLAUDE.md stamps "23 AUG 2026" in caps; case-sensitivity called it 35 days stale
MONTHS = {m: i for i, m in enumerate(
    ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 1)}
def check_freshness(rel, txt):
    # 40 lines, not 12: CLAUDE.md's first line cites the PROPOSAL date (19 Jul) and its
    # real position stamp sits further down. Reading only the top said "35 days stale"
    # about the most current file in the repo.
    head = '\n'.join(txt.splitlines()[:40])
    dates = [datetime.date(int(y), MONTHS[mo.capitalize()], int(d))
             for d, mo, y in DATE_RE.findall(head)]
    if not dates:
        return
    newest = max(dates)
    age = (TODAY - newest).days
    if age > 7:
        warn(rel, f'header self-dates to {newest} — {age} days old. '
                  f'A live document addressed to a date that has passed reads as current')

# -------------------------------------------------------------- CHECK 6: money
def check_money(rel, txt):
    """⛔ ONLY the fenced blocks — they are the words a client actually receives.

    Prose around them explains WHY a line was removed and legitimately quotes it. The
    first version flagged that explanation, which trains the reader to ignore the check."""
    inside, lines = False, txt.splitlines()
    for i, line in enumerate(lines, 1):
        if line.lstrip().startswith('```'):
            inside = not inside
            continue
        if not inside:
            continue
        m = MONEY_RE.search(line)
        if m:
            warn(rel, f'line {i}: money language "{m.group(0).strip()}" in client-facing '
                      f'text — is it TRUE of Yale, and does it belong there?')

# ----------------------------------------------------------------------- main
def run():
    pos = json.load(open(os.path.join(ROOT, 'POSITION.json'), encoding='utf-8'))
    idx = build_register_index()
    checked = 0
    for rel in LIVE_DOCS:
        txt = load(rel)
        if txt is None:
            fail(rel, 'listed as a LIVE doc but does not exist')
            continue
        checked += 1
        check_ids(rel, txt, idx)
        check_paths(rel, txt)
        check_sections(rel, txt)
        check_numbers(rel, txt, pos)
        check_freshness(rel, txt)
        if rel in CLIENT_FACING:
            check_money(rel, txt)
    return checked, pos

def report(checked, pos):
    print(f'=== DOCS HYGIENE — {checked} live documents, position as at {pos["as_at"]} ===\n')
    for w in warns: print(f'  WARN  {w}')
    if warns: print()
    for f in fails: print(f'  FAIL  {f}')
    if fails:
        print(f'\n❌ DOCS HYGIENE FAILED — {len(fails)} broken reference(s), {len(warns)} warning(s)')
        return 1
    print(f'✅ DOCS HYGIENE PASS — no broken references. {len(warns)} warning(s) to read.')
    return 0

# ------------------------------------------------------- the gate's own gate
def self_test():
    """⛔ A gate that has never failed is not a gate (LESSONS pattern 1).
    Re-inject each real defect into a scratch copy and prove it is caught."""
    cases = [
        ('the ④-4b dangling section reference (D-384)',
         'CALL-RUNBOOK-robinder-friday.md',
         lambda t: t.replace('(④-10)', '(④-4b)', 1).replace('④-10', '④-97', 1)
                    if '④-10' in t else t + '\n\nSee ④-97.\n',
         'THIS IS THE ④-4b BUG'),
        ('a decision id that does not exist',
         'HONEST-ASSESSMENT.md',
         lambda t: t + '\n\nSee D-999 for detail.\n',
         'D-999 is referenced but is in no register'),
        ('a file path that does not exist',
         'HONEST-ASSESSMENT.md',
         lambda t: t + '\n\n▶ `NO-SUCH-FILE.md` explains it.\n',
         '`NO-SUCH-FILE.md` does not exist on disk'),
        ('the stale 68% that sat in the runbook for days',
         'HONEST-ASSESSMENT.md',
         lambda t: t + '\n\nThe project is 68% built today.\n',
         'says 68% built'),
    ]
    tmp = tempfile.mkdtemp(prefix='docs-hyg-')
    ok = True
    print('=== SELF-TEST — each real defect re-injected, gate must catch it ===\n')
    try:
        for label, target, mutate, expect in cases:
            work = os.path.join(tmp, 'repo')
            if os.path.exists(work): shutil.rmtree(work)
            shutil.copytree(ROOT, work, symlinks=True,
                            ignore=shutil.ignore_patterns('.git', 'node_modules',
                                                          '__pycache__', 'dashboard'))
            p = os.path.join(work, target)
            src = open(p, encoding='utf-8').read()
            open(p, 'w', encoding='utf-8').write(mutate(src))
            r = subprocess.run([sys.executable, os.path.join(work, 'scripts', 'docs_hygiene.py')],
                               capture_output=True, text=True)
            caught = expect in r.stdout
            print(f'  {"PASS" if caught else "FAIL"}  {label}')
            if not caught:
                ok = False
                print(f'        expected to see: {expect}')
        # And the control: the gate must NOT fire on the clean tree.
        r = subprocess.run([sys.executable, os.path.join(ROOT, 'scripts', 'docs_hygiene.py')],
                           capture_output=True, text=True)
        clean = (r.returncode == 0)
        print(f'  {"PASS" if clean else "FAIL"}  the real tree passes (no false positives)')
        if not clean: ok = False
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    print('\n' + ('✅ SELF-TEST PASSED — the gate fails on every defect it claims to catch'
                  if ok else '❌ SELF-TEST FAILED — this gate does not gate'))
    return 0 if ok else 1

if __name__ == '__main__':
    if '--self-test' in sys.argv:
        sys.exit(self_test())
    c, p = run()
    sys.exit(report(c, p))
