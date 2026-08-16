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

# ===================================================================== M4b
print("\n=== M4b  checklist email draft  (v3) ===")
import os as _os
_v3 = _os.path.join(SCEN, "M4-checklist-file.v3-draft.blueprint.json")
if not _os.path.exists(_v3):
    print("  SKIP - v3 not present")
else:
    m4b = load("M4-checklist-file.v3-draft.blueprint.json")
    ops = []
    walk_ops(m4b, ops)
    bad = sorted(set(ops) - LEGAL_OPS)
    check("only the 4 working Make operators are used", not bad, f"illegal: {bad}" if bad else "")
    seen = []
    ids(m4b, seen)
    check("module ids are unique", len(seen) == len(set(seen)),
          f"dupes: {[i for i in set(seen) if seen.count(i) > 1]}")

    rA = m4b["flow"][1]["routes"][0]["flow"]
    d = rA[-1]
    check("draft is the LAST module of route A", d["id"] == 12
          and d["module"] == "google-email:ActionCreateDraft")
    check("draft runs AFTER the checklist is filed", rA[-2]["id"] == 5)
    check("draft uses the verified module version 1", d["version"] == 1)
    check("draft uses the Gmail connection 9452213",
          d["parameters"].get("__IMTCONN__") == 9452213)
    check("draft is guarded on the client email existing",
          d["filter"]["conditions"] == [[{"a": "{{1.`5`}}", "o": "exist"}]])
    check("draft has an onerror Ignore - filing must not break",
          any(e["module"] == "builtin:Ignore" for e in d["onerror"]))
    # The rule that matters most: only the RMA advises.
    mods = []
    def _m(n):
        if isinstance(n, dict):
            if "module" in n and isinstance(n["module"], str):
                mods.append(n["module"])
            for v in n.values():
                _m(v)
        elif isinstance(n, list):
            for v in n:
                _m(v)
    _m(m4b)
    check("NOTHING sends email - draft only, never ActionSendEmail",
          not any("SendEmail" in x for x in mods), f"found {[x for x in mods if 'Send' in x]}")
    check("draft folder is DRAFT", d["mapper"]["folder"] == "DRAFT")
    check("draft addresses the client, not a hardcoded address",
          d["mapper"]["to"] == ["{{1.`5`}}"])
    body = d["mapper"]["subject"] + d["mapper"]["html"]
    check("no unresolved mapping braces in the body",
          "{{}}" not in body and body.count("{{") == body.count("}}"))

# ===================================================================== M5b / M4 v4
print("\n=== M5b  chase email draft  (M4 v4, route C) ===")
_v4 = os.path.join(SCEN, "M4-checklist-file.v4-chase.blueprint.json")
if not os.path.exists(_v4):
    print("  SKIP - v4 not present")
else:
    m4v4 = load("M4-checklist-file.v4-chase.blueprint.json")

    ops = []
    walk_ops(m4v4, ops)
    bad = sorted(set(ops) - LEGAL_OPS)
    check("only the 4 working Make operators are used", not bad, f"illegal: {bad}" if bad else "")
    seen = []
    ids(m4v4, seen)
    check("module ids are unique", len(seen) == len(set(seen)),
          f"dupes: {sorted(i for i in set(seen) if seen.count(i) > 1)}")

    trg  = m4v4["flow"][0]
    rts  = m4v4["flow"][1]["routes"]
    check("router now has exactly 3 routes", len(rts) == 3, f"{len(rts)}")
    rA, rB, rC = (r["flow"] for r in rts)

    # ---- the trigger must be able to SEE column AE at all -------------------
    # This is the failure that would be invisible: index 30 simply comes back empty,
    # route C never matches, no error anywhere, and the chase silently never happens.
    check("trigger reads through AE, not just Z", trg["mapper"]["tableFirstRow"] == "A1:AE1",
          trg["mapper"]["tableFirstRow"])
    check("trigger has two OR-groups (checklist work, chase work)",
          len(trg["mapper"]["filter"]) == 2, f'{len(trg["mapper"]["filter"])}')

    g1, g2 = trg["mapper"]["filter"]
    check("G1 unchanged from v3 (A/V/V!=NEEDS ROUTING/Y notexist)",
          g1 == [{"a": "A", "o": "exist"},
                 {"a": "V", "o": "exist"},
                 {"a": "V", "b": "NEEDS ROUTING", "o": "text:notequal"},
                 {"a": "Y", "o": "notexist"}])
    check("G2 requires Y EXIST - the exact complement that makes the router partition",
          {"a": "Y", "o": "exist"} in g2)
    check("G2 requires an email address, so unreachable rows never enter (0 ops, stay flagged)",
          {"a": "F", "o": "exist"} in g2)
    check("G2 matches the flag by exact value",
          {"a": "AE", "b": "CHASE", "o": "text:equal"} in g2)

    # ---- routes A and B must have been closed against chase rows ------------
    GUARD = {"a": "{{1.`24`}}", "o": "notexist"}
    for label, first in (("A", rA[0]), ("B", rB[0])):
        grps = first["filter"]["conditions"]
        check(f"route {label}: EVERY OR-group carries the 'checklist not yet filed' guard "
              f"({len(grps)} groups)",
              all(GUARD in g for g in grps),
              f"unguarded: {[i for i, g in enumerate(grps) if GUARD not in g]}")

    # ---- EXHAUSTIVE: the three routes partition the whole trigger input space
    # Build every row the trigger can emit, then assert exactly one route fires.
    VISAS = ["485", "500", "482", "SBS", "Nomination", "407", "820/801", "189",
             "190", "491", "494", "802", "101", "417", "600", "ART", "", "190 "]
    FILED = ["", "485_TRA.docx", "NEEDS REVIEW", "COPY FAILED — review",
             "NO CHECKLIST MAPPED — review"]
    FLAGS = ["", "CHASE", "DRAFTED", "chase", "CHASE DRAFT FAILED — review"]

    both, neither, emitted = [], [], 0
    for v, skills, loc, filed, flag, email in itertools.product(
            VISAS, ["", "TRA"], ["", "ONSHORE"], FILED, FLAGS, ["", "a@b.com"]):
        # does the trigger emit this row?  (A and V always populated in these cases)
        sheet = {"A": "YM-1", "V": "http://x", "Y": filed, "AE": flag, "F": email}
        emit = (all(ev(c, sheet) for c in g1) or all(ev(c, sheet) for c in g2))
        if not emit:
            continue
        emitted += 1
        row = {"{{1.`7`}}": v, "{{1.`23`}}": skills, "{{1.`6`}}": loc,
               "{{1.`24`}}": filed, "{{1.`30`}}": flag, "{{1.`5`}}": email}
        hits = [n for n, f in (("A", rA[0]["filter"]), ("B", rB[0]["filter"]),
                               ("C", rC[0]["filter"])) if ev_filter(f, row)]
        if len(hits) > 1:
            both.append((row, hits))
        if not hits:
            neither.append(row)

    check(f"trigger emits {emitted} distinct row shapes across the enumeration", emitted > 0)
    check(f"no row matches MORE than one route ({emitted} emitted rows)", not both,
          f"{len(both)} overlap e.g. {both[0] if both else ''}")
    check(f"no row matches NO route ({emitted} emitted rows)", not neither,
          f"{len(neither)} orphaned e.g. {neither[0] if neither else ''}")

    # ---- the specific disasters, named -------------------------------------
    chase_supported = {"{{1.`7`}}": "485", "{{1.`23`}}": "TRA", "{{1.`6`}}": "",
                       "{{1.`24`}}": "485_TRA.docx", "{{1.`30`}}": "CHASE",
                       "{{1.`5`}}": "a@b.com"}
    check("a CHASE row with a supported visa does NOT re-enter route A "
          "(would refile the checklist and redraft the first email)",
          not ev_filter(rA[0]["filter"], chase_supported))
    check("...and does not fall into route B either (would stamp NEEDS REVIEW over a filed checklist)",
          not ev_filter(rB[0]["filter"], chase_supported))
    check("...it goes to route C", ev_filter(rC[0]["filter"], chase_supported))

    check("text:equal is case-sensitive, so a hand-typed 'chase' does NOT fire route C",
          not ev_filter(rC[0]["filter"], {"{{1.`30`}}": "chase", "{{1.`24`}}": "x"}))
    check("an already-DRAFTED row does not fire route C again",
          not ev_filter(rC[0]["filter"], {"{{1.`30`}}": "DRAFTED", "{{1.`24`}}": "x"}))

    # ---- route C's own shape ------------------------------------------------
    draft, stamp = rC[0], rC[-1]
    check("route C is exactly 2 modules: draft then stamp", len(rC) == 2)
    check("route C drafts, never sends", draft["module"] == "google-email:ActionCreateDraft"
          and draft["version"] == 1)
    check("route C uses the Gmail connection 9452213",
          draft["parameters"].get("__IMTCONN__") == 9452213)
    check("route C drafts into DRAFT", draft["mapper"]["folder"] == "DRAFT")
    check("route C addresses the client, not a hardcoded address",
          draft["mapper"]["to"] == ["{{1.`5`}}"])

    # THE LOOP GUARD. Both paths out of the draft must clear CHASE, or M4 redrafts
    # the same email three times a weekday, forever, at 2 operations a time.
    check("SUCCESS path clears the flag", stamp["module"] == "google-sheets:updateRow"
          and stamp["mapper"]["values"].get("Chase Flag") == "DRAFTED",
          str(stamp["mapper"]["values"]))
    err_updates = [e for e in draft.get("onerror", [])
                   if e["module"] == "google-sheets:updateRow"]
    check("FAILURE path also clears the flag (no infinite redraft)",
          len(err_updates) == 1
          and err_updates[0]["mapper"]["values"].get("Chase Flag") == "CHASE DRAFT FAILED — review",
          str([e["mapper"]["values"] for e in err_updates]))
    check("failure path ends in Ignore",
          any(e["module"] == "builtin:Ignore" for e in draft["onerror"]))
    check("stamp has an onerror Ignore", any(e["module"] == "builtin:Ignore"
                                             for e in stamp.get("onerror", [])))

    # ---- still nothing sends, anywhere in the whole scenario -----------------
    mods = []
    _m2 = lambda n: (
        [ (mods.append(n["module"]) if isinstance(n.get("module"), str) else None,
           [_m2(v) for v in n.values()]) if isinstance(n, dict)
          else [_m2(v) for v in n] if isinstance(n, list) else None ])
    _m2(m4v4)
    check("NOTHING sends email in v4 - draft only, never ActionSendEmail",
          not any("SendEmail" in x for x in mods),
          f"found {[x for x in mods if 'Send' in x]}")

    body = draft["mapper"]["subject"] + draft["mapper"]["html"]
    check("no unresolved mapping braces in the chase body",
          "{{}}" not in body and body.count("{{") == body.count("}}"))
    check("chase body gives no migration advice and sets no deadline",
          not any(w in body.lower() for w in
                  ("you must", "deadline", "will be refused", "visa will", "we advise",
                   "you should apply", "days to")),
          body[:80])
    check("chase body degrades gracefully when Docs Outstanding is empty",
          "emptystring" in draft["mapper"]["html"])

# ---------------------------------------------------- connections must not drift
print("\n=== connections ===")
for name, blob in [("M3", m3), ("M4", m4)] + ([("M4 v4", m4v4)] if os.path.exists(_v4) else []):
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
    check(f"{name} uses only the three known connections", conns <= {9501125, 9279810, 9452213},
          f"found {sorted(conns)}")

print(f"\n{checks - len(failures)}/{checks} checks passed")
if failures:
    print("FAILED:")
    for f in failures:
        print("  - " + f)
    sys.exit(1)
print("ALL BLUEPRINT CHECKS PASSED")
