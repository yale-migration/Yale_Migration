#!/bin/bash
# Every Apps Script test in one command. Run before any commit that touches scripts/.
#
# ⛔ NOT piped into tail/head/grep anywhere in this file. A pipeline's exit status is the
# LAST command's, so piping turns a gate into a suggestion — D-334, and it has been walked
# into twice, most recently on the very check meant to prove a gate works.
cd "$(dirname "$0")/.."
fail=0; total=0
for f in scripts/test_*.js; do
  out=$(node "$f" 2>&1); rc=$?
  line=$(printf '%s\n' "$out" | grep -oE '[0-9]+/[0-9]+ checks passed' | tail -1)
  n=$(printf '%s' "$line" | cut -d/ -f1); total=$(( total + ${n:-0} ))
  if [ $rc -ne 0 ]; then
    printf '  ❌ %-32s %s\n' "$(basename "$f")" "${line:-crashed}"; printf '%s\n' "$out" | tail -5
    fail=1
  else
    printf '  ✅ %-32s %s\n' "$(basename "$f")" "$line"
  fi
done
echo "  ───────────────────────────────────────────────"
if [ $fail -ne 0 ]; then echo "  ❌ SOME SUITES FAILED"; exit 1; fi
echo "  ✅ ALL APPS SCRIPT TESTS PASSED — $total checks"

# ---- the DOCUMENTS, not just the code (D-385) -------------------------------
# Two documents were updated on 23 Aug and both shipped a defect toward a client.
# The code had eight suites; the prose had nothing. ⛔ No pipes — see the note above.
echo
docs_out=$(python3 scripts/docs_hygiene.py 2>&1); docs_rc=$?
printf '%s\n' "$docs_out"
selft_out=$(python3 scripts/docs_hygiene.py --self-test 2>&1); selft_rc=$?
if [ $selft_rc -ne 0 ]; then
  printf '%s\n' "$selft_out"
  echo "  ❌ THE DOCS GATE DOES NOT GATE — fix it before trusting its PASS"; exit 1
fi
echo "  ✅ docs gate self-test passed — it fails on every defect it claims to catch"
if [ $docs_rc -ne 0 ]; then echo "  ❌ DOCS HYGIENE FAILED"; exit 1; fi
