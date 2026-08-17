#!/usr/bin/env python3
"""
PreToolUse guard on Bash.  (D-329)

WHY THIS EXISTS
CLAUDE.md declares `python3 scripts/repo_hygiene.py` mandatory before every commit,
in two separate places, in bold, with a 🔴. Nothing enforced it. It ran because the
model remembered — and D-317 exists precisely because a client's surname reached this
repo when somebody didn't.

Four audits on this project (D-323…D-326) found the same shape every time: a rule
written down, believed, and unenforced. Three of those were caught by a run log rather
than a review. So the rule stops being a sentence.

WHAT IT DOES
  git commit  ->  runs repo_hygiene.py. FAILS the commit if hygiene fails.
  git push    ->  allows, but states plainly that `origin` is a PERSONAL GitHub
                  account and this repo documents a client's data. Org policy is
                  company orgs only; the human confirms each time, informed.

Denies are recoverable — fix the finding, commit again. It costs seconds and it
removes an entire class of failure that has already happened once.
"""
import json
import os
import re
import subprocess
import sys

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
COMPANY_ORGS = ("BrandRadar-AI", "Roar-AI-Labs", "Apex-AI-Clients")


def out(payload):
    print(json.dumps(payload))
    sys.exit(0)


def deny(reason):
    out({"hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "deny",
        "permissionDecisionReason": reason,
    }})


def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        sys.exit(0)                       # never block on our own parse failure
    cmd = (data.get("tool_input") or {}).get("command") or ""

    # Strip quoted strings first: a commit MESSAGE mentioning "git push" must not
    # trip the push branch. Match on the command, not on prose inside it.
    bare = re.sub(r'"[^"]*"|\'[^\']*\'', '', cmd)

    if re.search(r"\bgit\s+push\b", bare):
        remote = subprocess.run(["git", "-C", REPO, "remote", "get-url", "origin"],
                                capture_output=True, text=True).stdout.strip()
        if remote and not any(o.lower() in remote.lower() for o in COMPANY_ORGS):
            out({"systemMessage":
                 "⚠️  PUSH TARGET IS NOT A COMPANY ORG.\n"
                 f"    origin = {remote}\n"
                 "    This repo documents a client's data. Org policy allows "
                 + ", ".join(COMPANY_ORGS) + ".\n"
                 "    Proceed only if Sharjeel has confirmed this push (D-317)."})
        sys.exit(0)

    if not re.search(r"\bgit\s+commit\b", bare):
        sys.exit(0)
    if "--dry-run" in bare:
        sys.exit(0)

    script = os.path.join(REPO, "scripts", "repo_hygiene.py")
    if not os.path.exists(script):
        deny("repo_hygiene.py is missing from scripts/. It is the gate that keeps "
             "client PII and secrets out of this repo (D-317). Restore it before "
             "committing — do not commit around a missing safety check.")

    r = subprocess.run([sys.executable, script], capture_output=True, text=True, cwd=REPO)
    if r.returncode != 0:
        tail = "\n".join((r.stdout + r.stderr).strip().splitlines()[-25:])
        deny("🔴 HYGIENE FAIL — commit blocked (D-329).\n\n" + tail +
             "\n\nFix the finding, then commit again. This gate exists because a "
             "client's surname once reached this repo (D-317).")

    out({"systemMessage": "✅ repo_hygiene.py passed — commit allowed."})


if __name__ == "__main__":
    main()
