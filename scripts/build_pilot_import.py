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
Office (J), Team (K), Email (F) and Assigned Consultant (L) DO NOT EXIST in any
file the client has sent us.  Checked 15 Aug across all four workbooks:
  LODGEMENT JULY TO PRESENT  42 rows  no email, no office, no team, no consultant
  SUMMARY OF CLIENTS         47 rows  names only; 11 have a visa type
  REYWARD monthly tabs       ~44/tab  email present on 3 of 44 in AUGUST
So OFFICE and TEAM are written from the constants below.  M3 routes on those two
fields, so if the constants are wrong every folder lands in the wrong team's
directory.  DO NOT RUN THIS UNTIL ROBINDER HAS CONFIRMED THEM (ask A-25).
Email is left blank, which means M4b and M5b cannot be tested on these rows.
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

# ---- UNCONFIRMED. This is the assumption A-25 exists to close. --------------
OFFICE = "BRISBANE"
TEAM = "FILIPINO"

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
    args = ap.parse_args()

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

    out, skipped = [], []
    for r in rows[1:]:
        name = norm(r[idx["NAME"]])
        if not name:
            continue
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
        row["Office"] = OFFICE
        row["Team"] = TEAM
        row["Processing Stage"] = STATUS_MAP.get(
            norm(r[idx["STATUS"]]).upper(), "")
        row["Visa Expiry"] = norm(r[idx["VISA EXPIRATION"]])[:10]
        row["Source"] = "Import " + TAB
        row["Notes"] = ("IMPORTED 15 Aug from " + TAB +
                        ". Office and Team are ASSUMED - confirm (A-25). "
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
    print("Email (F) is blank, so M4b/M5b cannot be tested on these rows.")
    print("Office=%s Team=%s are ASSUMED. If wrong, every folder lands in the"
          % (OFFICE, TEAM))
    print("wrong team's directory. Confirm A-25 before importing.")
    # ---- predict what M3 and M4 will actually do with these rows ------------
    # "Never show a client a report that has not been run against data" applies
    # to imports too.  Say what the pilot will produce BEFORE it produces it,
    # so an unexpected result is visible as unexpected.
    print()
    print("PREDICTED OUTCOME - check the sheet against this after the run")
    print("  M3: %d/%d rows route to a folder (Office=%s, Team=%s, name present)"
          % (len(out), len(out), OFFICE, TEAM))
    print("      Client Code is blank in this CSV. master_codes.gs must assign")
    print("      YM-2026-##### BEFORE M3 runs - M3 requires column A. If it is")
    print("      still blank, the new catch-all stamps V=NEEDS ROUTING and the")
    print("      row waits for a human. That is the fix working, not a failure.")
    files, review, depends = [], [], []
    for row in out:
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
    print("  Ops: about %d (1 trigger + %d M3 + %d M4 route A + %d M4 route B)"
          % (1 + len(out) * 2 + len(files) * 4 + len(depends) * 2 + len(review),
             len(out) * 2, len(files) * 4, len(review)))

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
