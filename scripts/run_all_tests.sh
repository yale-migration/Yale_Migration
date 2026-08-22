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
