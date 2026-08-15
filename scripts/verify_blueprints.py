#!/usr/bin/env python3
"""Verify the M3 and M4 blueprints before they are imported into Make.

Run:  python3 scripts/verify_blueprints.py

Exists because M3 ran four times successfully and still had five production
blockers (DEFINITION-OF-DONE.md).  "It ran" is not evidence.  The checks that
matter here are the ones a successful run cannot make:

  * only the four Make filter operators that actually work are used (D-255 —
    text:contains is accepted and then evaluates false, silently)
  * every row the trigger can emit reaches exactly ONE route, proved by
    exhaustive evaluation rather than by reading the JSON.  A row that reaches
    no route is never written, so it re-matches the trigger forever and starves
    the scenario (E1/E2, D-315).
"""

import itertools
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SCEN = os.path.join(os.path.dirname(HERE), "scenarios")

LEGAL_OPS = {"exist", "notexist", "text:equal", "text:notequal"}

failures = []
checks = 0


def check(label, ok, detail=""):
    global checks
    checks += 1
    print(("  PASS  " if ok else "  FAIL  ") + label + (f"  — {detail}" if detail else ""))
    if not ok:
        failures.append(label)


# ---------------------------------------------------------------- filter eval
def ev(cond, row):
    """Evaluate one Make condition against a row dict keyed by field ref."""
    a = row.get(cond["a"], "")
    o = cond["o"]
    if o == "exist":
        return a != ""
    if o == "notexist":
        return a == ""
    if o == "text:equal":
        return a == cond["b"]          # Make's text:equal is case-SENSITIVE
    if o == "text:notequal":
        return a != cond["b"]
    raise AssertionError(f"unsupported operator {o}")


def ev_filter(filt, row):
    """conditions is OR-of-AND groups.  No filter at all means 'always run'."""
    if not filt:
        return True
    return any(all(ev(c, row) for c in group) for group in filt["conditions"])


def walk_ops(node, out):
    if isinstance(node, dict):
        if "o" in node and "a" in node and isinstance(node.get("o"), str):
            out.append(node["o"])
        for v in node.values():
            walk_ops(v, out)
    elif isinstance(node, list):
        for v in node:
            walk_ops(v, out)


def ids(node, out):
    if isinstance(node, dict):
        if "module" in node and "id" in node:
            out.append(node["id"])
        for v in node.values():
            ids(v, out)
    elif isinstance(node, list):
        for v in node:
            ids(v, out)


def load(name):
    with open(os.path.join(SCEN, name)) as fh:
        return json.load(fh)


# ===================================================================== M3
print("\n=== M3  YM-M3-folder-create  (v2 catch-all) ===")
m3 = load("M3-folder-create.v2-catchall.blueprint.json")

ops = []
walk_ops(m3, ops)
bad = sorted(set(ops) - LEGAL_OPS)
check("only the 4 working Make operators are used", not bad, f"illegal: {bad}" if bad else f"{sorted(set(ops))}")

seen = []
ids(m3, seen)
check("module ids are unique", len(seen) == len(set(seen)),
      f"dupes: {[i for i in set(seen) if seen.count(i) > 1]}")

router = m3["flow"][1]
check("flow is trigger -> router", m3["flow"][0]["id"] == 2
      and router["module"] == "builtin:BasicRouter")
check("router has exactly 2 routes", len(router.get("routes", [])) == 2)

routable = router["routes"][0]["flow"][0]["filter"]
catchall = router["routes"][1]["flow"][0]["filter"]

# the catch-all must WRITE column V, or the row never leaves the trigger
cvals = router["routes"][1]["flow"][0]["mapper"]["values"]
check("catch-all writes Folder URL (V)", "Folder URL" in cvals,
      f"writes {sorted(cvals)}")
check("catch-all sentinel is exactly 'NEEDS ROUTING'",
      cvals.get("Folder URL") == "NEEDS ROUTING", repr(cvals.get("Folder URL")))
check("catch-all has an onerror Ignore",
      any(e["module"] == "builtin:Ignore" for e in router["routes"][1]["flow"][0]["onerror"]))

# --- exhaustive: every trigger-emitted row hits exactly one route
DOMAIN = {
    "{{2.`0`}}":  ["", "YM-2026-00001"],                              # Client Code
    "{{2.`2`}}":  ["", "Test Client"],                                # Full Name
    "{{2.`9`}}":  ["", "BRISBANE", "Brisbane", "TOWNSVILLE", "bne"],  # Office
    "{{2.`10`}}": ["", "FILIPINO", "INDIAN", "Filipino", "MARKETING"],# Team
}
keys = list(DOMAIN)
both, neither = [], []
for combo in itertools.product(*(DOMAIN[k] for k in keys)):
    row = dict(zip(keys, combo))
    a, b = ev_filter(routable, row), ev_filter(catchall, row)
    if a and b:
        both.append(row)
    if not a and not b:
        neither.append(row)

total = 1
for k in keys:
    total *= len(DOMAIN[k])
check(f"no row matches BOTH routes ({total} combinations)", not both,
      f"{len(both)} overlap e.g. {both[0] if both else ''}")
check(f"no row matches NEITHER route ({total} combinations)", not neither,
      f"{len(neither)} orphaned e.g. {neither[0] if neither else ''}")

# the specific rows that motivated the fix
for label, row in [
    ("Townsville client (Cristelle)",
     {"{{2.`0`}}": "YM-2026-00001", "{{2.`2`}}": "A", "{{2.`9`}}": "TOWNSVILLE", "{{2.`10`}}": "INDIAN"}),
    ("blank Office and Team",
     {"{{2.`0`}}": "YM-2026-00002", "{{2.`2`}}": "B", "{{2.`9`}}": "", "{{2.`10`}}": ""}),
    ("lower-case 'Brisbane'",
     {"{{2.`0`}}": "YM-2026-00003", "{{2.`2`}}": "C", "{{2.`9`}}": "Brisbane", "{{2.`10`}}": "FILIPINO"}),
]:
    check(f"caught by catch-all: {label}", ev_filter(catchall, row) and not ev_filter(routable, row))

check("happy path still routes to route A",
      ev_filter(routable, {"{{2.`0`}}": "YM-2026-00004", "{{2.`2`}}": "D",
                           "{{2.`9`}}": "BRISBANE", "{{2.`10`}}": "FILIPINO"}))

# ===================================================================== M4
print("\n=== M4  YM-M4-checklist-file  (v2 guard) ===")
m4 = load("M4-checklist-file.v2-guard.blueprint.json")

ops = []
walk_ops(m4, ops)
bad = sorted(set(ops) - LEGAL_OPS)
check("only the 4 working Make operators are used", not bad, f"illegal: {bad}" if bad else f"{sorted(set(ops))}")

seen = []
ids(m4, seen)
check("module ids are unique", len(seen) == len(set(seen)),
      f"dupes: {[i for i in set(seen) if seen.count(i) > 1]}")

trig = m4["flow"][0]["mapper"]["filter"][0]
check("trigger skips rows M3 flagged NEEDS ROUTING",
      any(c["a"] == "V" and c.get("b") == "NEEDS ROUTING" and c["o"] == "text:notequal" for c in trig))
check("trigger still requires A exist / V exist / Y notexist",
      all(any(c["a"] == k and c["o"] == o for c in trig)
          for k, o in [("A", "exist"), ("V", "exist"), ("Y", "notexist")]))

routeA = m4["flow"][1]["routes"][0]["flow"]
routeB = m4["flow"][1]["routes"][1]["flow"]
guard = routeA[0]

check("guard is the FIRST module of route A", guard["id"] == 11
      and guard["module"] == "google-sheets:updateRow")
check("guard writes Checklist Filed (Y) before the lookup",
      "Checklist Filed" in guard["mapper"]["values"])
check("guard does NOT touch Notes (module 5 cannot clean it up)",
      "Notes" not in guard["mapper"]["values"], f"writes {sorted(guard['mapper']['values'])}")
check("guard carries the routing filter", "filter" in guard)
check("lookup no longer carries a filter", "filter" not in routeA[1])
check("lookup is still the CHECKLIST MAP read",
      routeA[1]["id"] == 3 and routeA[1]["mapper"]["sheetId"] == "CHECKLIST MAP")
check("final module still overwrites Y with the real filename",
      routeA[-1]["id"] == 5 and routeA[-1]["mapper"]["values"]["Checklist Filed"] == "{{3.`3`}}")
check("guard has an onerror Ignore",
      any(e["module"] == "builtin:Ignore" for e in guard["onerror"]))

# --- exhaustive: route A and route B partition the visa space
VISAS = ["485", "500", "482", "SBS", "Nomination", "407", "820/801", "189",
         "190", "491", "494", "802", "101", "417", "600", "ART", "", "190 "]
both, neither = [], []
for v, skills, loc in itertools.product(VISAS, ["", "TRA"], ["", "ONSHORE"]):
    row = {"{{1.`7`}}": v, "{{1.`23`}}": skills, "{{1.`6`}}": loc}
    a, b = ev_filter(guard["filter"], row), ev_filter(routeB[0]["filter"], row)
    if a and b:
        both.append(row)
    if not a and not b:
        neither.append(row)
n = len(VISAS) * 4
check(f"no visa matches BOTH routes ({n} combinations)", not both,
      f"{len(both)} overlap e.g. {both[0] if both else ''}")
check(f"no visa matches NEITHER route ({n} combinations)", not neither,
      f"{len(neither)} orphaned e.g. {neither[0] if neither else ''}")

check("visa 190 reaches route A (so the guard stamps it even with no MAP row)",
      ev_filter(guard["filter"], {"{{1.`7`}}": "190", "{{1.`23`}}": "", "{{1.`6`}}": ""}))
check("visa 600 (Tourist) falls to NEEDS REVIEW, not into a loop",
      ev_filter(routeB[0]["filter"], {"{{1.`7`}}": "600", "{{1.`23`}}": "", "{{1.`6`}}": ""}))

# ---------------------------------------------------- connections must not drift
print("\n=== connections ===")
for name, blob in [("M3", m3), ("M4", m4)]:
    conns = set()

    def grab(node):
        # metadata.restore.parameters.__IMTCONN__ is a display blob, not an id —
        # only the module-level integer is the real connection.
        if isinstance(node, dict):
            p = node.get("parameters")
            if isinstance(p, dict) and isinstance(p.get("__IMTCONN__"), int):
                conns.add(p["__IMTCONN__"])
            for k, v in node.items():
                if k != "metadata":
                    grab(v)
        elif isinstance(node, list):
            for v in node:
                grab(v)

    grab(blob)
    check(f"{name} uses only the two known connections", conns <= {9501125, 9279810},
          f"found {sorted(conns)}")

print(f"\n{checks - len(failures)}/{checks} checks passed")
if failures:
    print("FAILED:")
    for f in failures:
        print("  - " + f)
    sys.exit(1)
print("ALL BLUEPRINT CHECKS PASSED")
