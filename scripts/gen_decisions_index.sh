#!/bin/bash
# Regenerates DECISIONS-INDEX.md from DECISIONS.md headers.
# Run after appending decisions:  bash scripts/gen_decisions_index.sh
cd "$(dirname "$0")/.."
{
  echo "# DECISIONS INDEX — one line per decision"
  echo
  echo "\`DECISIONS.md\` is $(du -h DECISIONS.md | cut -f1) / $(wc -l < DECISIONS.md) lines. **Do not read it whole — it will eat the session.**"
  echo "Find the D-number here, then \`grep -A 25 \"^D-NNN\" DECISIONS.md\` (or \`^## D-NNN\`) for that entry only."
  echo
  echo "Regenerate: \`bash scripts/gen_decisions_index.sh\`  ·  Generated $(date '+%Y-%m-%d %H:%M')"
  echo
  echo "| # | Decision |"
  echo "|---|---|"
  grep -hE '^(## )?D-[0-9]+ \|' DECISIONS.md \
    | sed -E 's/^## //' \
    | sed -E 's/^(D-[0-9]+) \| ([^|]*).*/\1\t\2/' \
    | awk -F'\t' '{gsub(/\|/,"\\|",$2); printf "| **%s** | %s |\n", $1, $2}'
} > DECISIONS-INDEX.md
echo "DECISIONS-INDEX.md: $(grep -c '^| \*\*D-' DECISIONS-INDEX.md) entries"
