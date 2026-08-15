#!/usr/bin/env python3
"""Turn the client's own lodgement list into rows MASTER can accept.

    python3 scripts/build_pilot_import.py            # 10-row pilot
    python3 scripts/build_pilot_import.py --all      # all 42

Reads   ../client-data/YALE BRISBANE OFFICE WORK.xlsx  ->  LODGEMENT JULY TO PRESENT
Writes  ../client-data/pilot-import.csv

BOTH PATHS ARE OUTSIDE THE REPO ON PURPOSE.  These are real client names.
Nothing this script touches may be committed.  See CLIENT-DATA-INVENTORY.md.

CREDENTIAL RULE (D-306): this script reads five columns by name and no others.
It cannot reach a password column even if one is added to the tab tomorrow.

WHAT THIS SCRIPT CANNOT DO
--------------------------
Established by census, not by sample - all 66 tabs across all four workbooks
were opened on 15 Aug (scripts/audit_all_tabs.py, D-316):

  TEAM        exists in NO tab anywhere.  Not once.
  OFFICE      exists in NO tab.  Two tabs have a LOCATION column, but it holds
              Australian states (NSW/Brisbane/Melb) in one and ONSHORE/OFFSHORE
              in the other.  Neither is the Brisbane-vs-Townsville office.
  EMAIL       ~55 client emails exist across the books - but of the 41 distinct
              active clients, ZERO have one.  The emails belong to other people.
  CONSULTANT  713 names carry one somewhere, but only 4 of the 41 active ones.
              Of those 4: Gayatri and Inder are INDIAN team, star is FILIPINO.

That last line is why OFFICE and TEAM now default to BLANK.  An earlier version
of this script hard-coded FILIPINO for every row; the census shows the active
list spans BOTH teams, so that constant would have filed Indian-team clients
into the Filipino directory and reported success.

Blank is the safe default and it is not a dead end: M3's catch-all (E1, D-315)
stamps V=NEEDS ROUTING plus a note naming the two fields to fill, so the rows
land in the sheet waiting for a human instead of being silently misfiled.

Pass --office/--team ONLY once Robinder has answered A-25.
"""

import argparse
import csv
import os
import re
import sys
import warnings

warnings.filterwarnings("ignore")

try:
    import openpyxl
except ImportError:
    sys.exit("pip3 install openpyxl")

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.abspath(os.path.join(HERE, "..", "..", "client-data"))
SRC = os.path.join(DATA, "YALE BRISBANE OFFICE WORK.xlsx")
TAB = "LODGEMENT JULY TO PRESENT"
OUT = os.path.join(DATA, "pilot-import.csv")

# Blank unless --office/--team are passed. See the docstring: the active list
# spans both teams, so any single constant here is wrong for some of the rows.

# Only these source columns are ever read.
KEEP = ["NAME", "CURRENT VISA", "VISA EXPIRATION",
        "TYPE OF VISA APPLICATION", "STATUS"]

# Their vocabulary -> the MASTER dropdown.  Anything not here is NOT imported;
# it is listed at the end so a human decides, rather than being guessed at.
VISA_MAP = {
    "500": ("500", ""),
    "482": ("482", ""),
    "485": ("485", ""),
    "190": ("190", ""),
    "485 DEPENDENT": ("485", "Dependent"),
    "491 DEPENDENT": ("491", "Dependent"),
}
# Present in their live pipeline, deliberately NOT mapped:
#   Citizenship, ART  - not visa applications, no checklist exists
#   600               - Tourist; no checklist in the canonical set
#   186               - real subclass, in their fee master, but absent from
#                       MASTER's dropdown AND from M4's router (gap, see D-315)
#   PARTNER VISA      - ambiguous: 820/801 onshore vs 309/100 offshore
UNMAPPED_NOTE = {
    "CITIZENSHIP": "not a visa application",
    "ART": "tribunal review, not a visa application",
    "600": "Tourist - no checklist in the canonical set",
    "186": "GAP - real subclass, missing from MASTER dropdown and M4 router",
    "PARTNER VISA": "ambiguous - 820/801 onshore or 309/100 offshore?",
}

STATUS_MAP = {
    "LODGED": "Lodged",
    "PENDING": "Awaiting Decision",
    "DRAFTED": "Preparing",
    "WITHDRAWN": "Withdrawn",
}

MASTER_HEADERS = [
    "Client Code", "Their Client ID", "Full Name", "Party 2 Name",
    "Contact Number", "Email Address", "Location", "Visa Type", "Visa Variant",
    "Office", "Team", "Assigned Consultant", "Processing Stage", "Visa Outcome",
    "Grant Date", "Visa Expiry", "Refusal Reason", "Last Contact",
    "Next Follow-up Due", "Date Added", "Source", "Folder URL", "Notes",
]


def norm(v):
    """'500.0' and 500.0 both mean '500'."""
    if v is None:
        return ""
    s = str(v).strip()
    if re.fullmatch(r"\d+\.0", s):
        s = s[:-2]
    return re.sub(r"\s+", " ", s)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--all", action="store_true", help="all rows, not just 10")
    ap.add_argument("--office", default="",
                    help="e.g. BRISBANE. Only after A-25 is answered.")
    ap.add_argument("--team", default="", choices=["", "FILIPINO", "INDIAN"],
                    help="Only after A-25 is answered. Blank = let M3 flag it.")
    args = ap.parse_args()
    office, team = args.office.strip().upper(), args.team.strip().upper()

    if not os.path.exists(SRC):
        sys.exit("not found: " + SRC)

    wb = openpyxl.load_workbook(SRC, read_only=True, data_only=True)
    ws = wb[TAB]
    rows = list(ws.iter_rows(values_only=True))
    header = [norm(c) for c in rows[0]]

    idx = {}
    for name in KEEP:
        if name not in header:
            sys.exit("source column missing: " + name)
        idx[name] = header.index(name)

    out, skipped, dupes, seen = [], [], [], set()
    for r in rows[1:]:
        name = norm(r[idx["NAME"]])
        if not name:
            continue
        # Their list repeats at least one person (RODEL CLUTARIO x2). Importing
        # a duplicate creates two client codes and two OneDrive folders for one
        # human, and the dashboard then double-counts them.
        key = " ".join(sorted(re.sub(r"[^A-Z ]", "", name.upper()).split()))
        if key in seen:
            dupes.append(name)
            continue
        seen.add(key)
        raw = norm(r[idx["TYPE OF VISA APPLICATION"]]).upper()
        if raw not in VISA_MAP:
            skipped.append((name, raw or "(blank)",
                            UNMAPPED_NOTE.get(raw, "no mapping")))
            continue
        visa, variant = VISA_MAP[raw]

        current = norm(r[idx["CURRENT VISA"]])

        row = dict.fromkeys(MASTER_HEADERS, "")
        row["Full Name"] = name
        row["Visa Type"] = visa
        row["Visa Variant"] = variant
        # M4 keys the 500 checklist on Location (ONSHORE / OFFSHORE) and there
        # is no Location column in the source.  Their own CURRENT VISA column
        # carries the literal word OFFSHORE for offshore applicants; everyone
        # else holds an Australian visa, so they are onshore.  Derived, not
        # invented - but still confirm with A-25.
        if visa == "500":
            row["Location"] = "OFFSHORE" if current.upper() == "OFFSHORE" else "ONSHORE"
        row["Office"] = office
        row["Team"] = team
        row["Processing Stage"] = STATUS_MAP.get(
            norm(r[idx["STATUS"]]).upper(), "")
        row["Visa Expiry"] = norm(r[idx["VISA EXPIRATION"]])[:10]
        row["Source"] = "Import " + TAB
        row["Notes"] = ("IMPORTED 15 Aug from " + TAB + ". " +
                        ("Office/Team BLANK - M3 will flag this row for routing (A-25). "
                         if not (office and team) else
                         "Office/Team set from A-25 answer. ") +
                        "Current visa: " + (current or "?"))
        out.append(row)

    limit = len(out) if args.all else 10
    out = out[:limit]

    with open(OUT, "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=MASTER_HEADERS)
        w.writeheader()
        w.writerows(out)

    print("wrote %d rows -> %s" % (len(out), OUT))
    print()
    print("Client Code (A) is LEFT BLANK on purpose - master_codes.gs assigns")
    print("YM-2026-##### on write. Do not invent codes.")
    print("Email (F) is blank. Census (D-316): ZERO of the 41 active clients")
    print("have an email anywhere in any of the four workbooks, so M4b/M5b")
    print("cannot be tested on these rows at all.")
    if office and team:
        print("Office=%s Team=%s - set explicitly. Make sure A-25 said so."
              % (office, team))
    else:
        print("Office/Team LEFT BLANK on purpose. The active list spans BOTH")
        print("teams (Gayatri+Inder=INDIAN, star=FILIPINO), so any single")
        print("guess is wrong for some rows. M3's catch-all will flag them.")
    if dupes:
        print()
        print("SKIPPED %d duplicate name(s): %s" % (len(dupes), ", ".join(dupes)))
    # ---- predict what M3 and M4 will actually do with these rows ------------
    # "Never show a client a report that has not been run against data" applies
    # to imports too.  Say what the pilot will produce BEFORE it produces it,
    # so an unexpected result is visible as unexpected.
    print()
    print("PREDICTED OUTCOME - check the sheet against this after the run")
    if office and team:
        print("  M3: %d/%d rows route to a folder (Office=%s, Team=%s)"
              % (len(out), len(out), office, team))
    else:
        print("  M3: 0/%d route. ALL %d hit the catch-all and get"
              % (len(out), len(out)))
        print("      V=NEEDS ROUTING + a note naming Office and Team.")
        print("      THAT IS THE INTENDED RESULT with Office/Team blank - it")
        print("      proves E1 works and turns the sheet into the form Robinder")
        print("      fills in. Delete NEEDS ROUTING from V to release each row.")
        print("      M4 never sees them (its trigger excludes NEEDS ROUTING).")
    print("      Client Code is blank in this CSV. master_codes.gs must assign")
    print("      YM-2026-##### BEFORE M3 runs - M3 requires column A. If it is")
    print("      still blank, the new catch-all stamps V=NEEDS ROUTING and the")
    print("      row waits for a human. That is the fix working, not a failure.")
    files, review, depends = [], [], []
    for row in ([] if not (office and team) else out):
        v = row["Visa Type"]
        if v == "485" and not row["Visa Variant"]:
            review.append(v + " (no Skills Authority - column X is blank)")
        elif v == "485":
            review.append(v + " " + row["Visa Variant"] + " (no Skills Authority)")
        elif v == "500":
            files.append(v + " " + row["Location"])
        elif v == "190":
            depends.append(v + " (only if CHECKLIST MAP has a 190 row)")
        else:
            files.append(v)
    print("  M4: %d file a checklist   %d land NEEDS REVIEW   %d depend on the MAP"
          % (len(files), len(review), len(depends)))
    for label, group in (("files", files), ("NEEDS REVIEW", review),
                         ("depends on MAP", depends)):
        for item in sorted(set(group)):
            print("        %-16s %s  x%d" % (label, item, group.count(item)))
    if office and team:
        print("  Ops: about %d (1 trigger + %d M3 + %d M4 route A + %d route B)"
              % (1 + len(out) * 2 + len(files) * 4 + len(depends) * 2 + len(review),
                 len(out) * 2, len(files) * 4, len(review)))
    else:
        print("  Ops: about %d (1 trigger + %d catch-all writes). M4 stays idle."
              % (1 + len(out), len(out)))

    if skipped:
        print()
        print("NOT IMPORTED - %d rows M4 has no checklist for:" % len(skipped))
        for n, raw, why in skipped:
            print("   %-28s %-14s %s" % (n[:28], raw, why))
        print()
        print("These are not errors. With the E2 guard in place they would land")
        print("as NEEDS REVIEW rather than looping, but there is no point")
        print("importing rows no checklist exists for.")


if __name__ == "__main__":
    main()
