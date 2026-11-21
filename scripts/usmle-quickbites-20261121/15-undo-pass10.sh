#!/bin/sh
# pass10: restores Step 2 Quick Bites to the snapshot taken before the guideline re-sourcing.
# Does not change release flags. Does not touch the database.
# Do not run scripts/06-rollback-DO-NOT-RUN.sql.
set -e
ROOT="$(CDPATH= cd -- "$(dirname "$0")/../.." && pwd)"
BAK="$ROOT/scripts/usmle-quickbites-20261121/backup-pre-pass10-20261121"
cp "$BAK/step-2-bites.json" "$ROOT/content/usmle-quickbites/step-2/bites.json"
cp "$BAK/AUDIT.md" "$ROOT/content/usmle-quickbites/AUDIT.md"
cp "$BAK/diagrams.json" "$ROOT/content/usmle-quickbites/diagrams.json"
cp "$BAK/usmle-bites.test.ts" "$ROOT/src/lib/quick-bites/usmle-bites.test.ts"
echo "Restored the pre-pass10 Step 2 Quick Bites files. Release flags were not changed."
