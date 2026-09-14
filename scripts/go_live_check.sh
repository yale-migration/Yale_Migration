#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# GO-LIVE CHECK — run this, read the output, fix what it names.
#
# It CHANGES NOTHING. Every step is a read. Safe to run repeatedly.
#
# ⛔ It does not ask for or print any secret. Where a secret is needed you are
#    told where to fetch it and it is read from the environment, never echoed.
#
# Usage:
#   bash scripts/go_live_check.sh                 # checks that need no secret
#   SYNC_SECRET='...' bash scripts/go_live_check.sh   # plus the live sync probe
# ─────────────────────────────────────────────────────────────────────────────
set -u
SITE="https://yalemigration.netlify.app"
REPO="yale-migration/Yale_Migration"
ok(){ printf '  \033[32m✅\033[0m %s\n' "$1"; }
no(){ printf '  \033[31m❌\033[0m %s\n' "$1"; }
warn(){ printf '  \033[33m⚠️\033[0m  %s\n' "$1"; }
hdr(){ printf '\n\033[1m── %s\033[0m\n' "$1"; }

hdr "1 · Local repo"
DIRTY=$(git status --porcelain | wc -l | tr -d ' ')
UNPUSHED=$(git log origin/main..HEAD --oneline 2>/dev/null | wc -l | tr -d ' ')
[ "$DIRTY" = "0" ] && ok "working tree clean" || warn "$DIRTY uncommitted file(s)"
[ "$UNPUSHED" = "0" ] && ok "everything pushed" || no "$UNPUSHED commit(s) NOT pushed  ->  git push origin main"

hdr "2 · GitHub Actions secrets"
PERM=$(gh api "repos/$REPO" --jq '.permissions.admin' 2>/dev/null || echo "?")
if [ "$PERM" = "true" ]; then ok "you have admin on the repo"
else warn "signed in WITHOUT admin. Secrets need the 'project1-yale' account (it IS the org owner)"; fi
COUNT=$(gh api "repos/$REPO/actions/secrets" --jq '.total_count' 2>/dev/null || echo "?")
if [ "$COUNT" = "2" ]; then ok "both Actions secrets are set"
elif [ "$COUNT" = "0" ]; then
  no "NO Actions secrets set — the hourly sync cannot run"
  echo "      Settings -> Secrets and variables -> Actions -> New repository secret:"
  echo "        SYNC_URL     $SITE/api/sync"
  echo "        SYNC_SECRET  copy from Netlify env — never paste it in chat"
else warn "secrets reported: $COUNT (expected 2)"; fi
FAILS=$(gh run list --repo "$REPO" --workflow sync.yml --limit 5 --json conclusion 2>/dev/null \
        | grep -c '"failure"' || echo 0)
[ "$FAILS" = "0" ] && ok "recent sync runs are not failing" || warn "$FAILS of the last 5 sync runs failed"

hdr "3 · The live site"
for p in "/login" "/api/sync?tab=matters"; do
  CODE=$(python3 - "$SITE$p" <<'PY'
import sys,urllib.request,urllib.error
try: print(urllib.request.urlopen(sys.argv[1],timeout=25).status)
except urllib.error.HTTPError as e: print(e.code)
except Exception: print("ERR")
PY
)
  case "$p:$CODE" in
    "/login:200") ok "/login is up (200)";;
    "/api/sync?tab=matters:401") ok "/api/sync correctly refuses unauthenticated callers (401)";;
    *) warn "$p returned $CODE";;
  esac
done

hdr "4 · Does Netlify hold the Google credentials?  ← the big unknown"
# ⛔ Catch the placeholder being pasted literally. It returns 401 and reads as
#    "the secret is wrong" when in fact the test never ran. Happened once.
case "${SYNC_SECRET:-}" in
  "paste-it-here"|"<paste>"|"<SYNC_SECRET>"|"your-secret"|"...")
    no "SYNC_SECRET is still the PLACEHOLDER — this test did not run"
    echo "      Copy the real value: Netlify -> Site configuration -> Environment variables"
    SYNC_SECRET="" ;;
esac
if [ -z "${SYNC_SECRET:-}" ]; then
  warn "skipped — no SYNC_SECRET in the environment"
  echo "      Fetch it: Netlify -> Site configuration -> Environment variables"
  echo "      Then:     SYNC_SECRET='<paste>' bash scripts/go_live_check.sh"
else
  CODE=$(python3 - "$SITE/api/sync?tab=matters" "$SYNC_SECRET" <<'PY'
import sys,urllib.request,urllib.error
r=urllib.request.Request(sys.argv[1],headers={"Authorization":"Bearer "+sys.argv[2]})
try: print(urllib.request.urlopen(r,timeout=120).status)
except urllib.error.HTTPError as e: print(e.code)
except Exception: print("ERR")
PY
)
  case "$CODE" in
    200) ok "SYNC WORKS — real data can be loaded. Run all three tabs (step 6 below)";;
    503) no "503 not_configured — Netlify is MISSING the Google service-account credentials"
         echo "      Add in Netlify -> Environment variables:"
         echo "        GOOGLE_SERVICE_ACCOUNT_EMAIL   GOOGLE_PRIVATE_KEY   YALE_SHEET_ID";;
    401) no "401 — the secret does not match the one in Netlify";;
    *)   warn "unexpected: $CODE";;
  esac
fi

hdr "5 · Local test gates"
bash scripts/run_all_tests.sh >/tmp/glc.txt 2>&1
grep -q "ALL APPS SCRIPT TESTS PASSED" /tmp/glc.txt && ok "$(grep -o '[0-9]* checks' /tmp/glc.txt | tail -1) passing" || no "tests FAILED — see /tmp/glc.txt"
grep -q "DOCS HYGIENE PASS" /tmp/glc.txt && ok "docs gate green" || no "docs gate FAILED"

hdr "6 · What only a human can do"
cat <<'TODO'
  ⬜ Rotate the Supabase service-role key, then update it in Netlify
     Supabase -> Project Settings -> API -> service_role -> Reset
  ⬜ Share the MASTER DATABASE (Viewer) with:
     yale-dashboard-sync@yale-dashboard-sync.iam.gserviceaccount.com
  ⬜ Make -> Connections: rename 9452213 -> "Yale visa.lodgement@",
     10881931 -> "Yale info@", delete the unused duplicate 10881827
  ⬜ Make -> new scenario -> Facebook Pages -> Watch Comments -> is the Yale
     page in the Page dropdown?  (answers whether Meta assets are assigned)
  ⬜ Once step 4 says 200, load all three tabs:
       for t in matters s56 enquiries; do
         curl -s -H "Authorization: Bearer $SYNC_SECRET" \
           "https://yalemigration.netlify.app/api/sync?tab=$t"; echo; done
TODO
printf '\n'
