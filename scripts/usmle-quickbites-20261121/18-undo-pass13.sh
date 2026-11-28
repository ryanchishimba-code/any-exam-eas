#!/bin/sh
# pass13: restores Step 1 and Step 3 Quick Bites, AUDIT.md, diagrams.json, usmle-bites.ts, the test and the quick-bites page
# to the snapshot taken before pass13, and removes the go-live allowlist and its test.
# Does not change release flags. Does not touch the database.
# Do not run scripts/06-rollback-DO-NOT-RUN.sql.
set -e
ROOT="$(CDPATH= cd -- "$(dirname "$0")/../.." && pwd)"
BAK="$ROOT/scripts/usmle-quickbites-20261121/backup-pre-pass13-20261121"
cp "$BAK/step-1-bites.json" "$ROOT/content/usmle-quickbites/step-1/bites.json"
cp "$BAK/step-3-bites.json" "$ROOT/content/usmle-quickbites/step-3/bites.json"
cp "$BAK/AUDIT.md" "$ROOT/content/usmle-quickbites/AUDIT.md"
cp "$BAK/diagrams.json" "$ROOT/content/usmle-quickbites/diagrams.json"
cp "$BAK/usmle-bites.test.ts.bak" "$ROOT/src/lib/quick-bites/usmle-bites.test.ts"
cp "$BAK/usmle-bites.ts.bak" "$ROOT/src/lib/quick-bites/usmle-bites.ts"
cp "$BAK/page.tsx.bak" "$ROOT/src/app/(app)/usmle/quick-bites/page.tsx"
rm -f "$ROOT/content/usmle-quickbites/golive-ids.json" "$ROOT/src/lib/quick-bites/usmle-golive.test.ts"
echo "Restored the pre-pass13 Quick Bites files. Release flags were not changed."
