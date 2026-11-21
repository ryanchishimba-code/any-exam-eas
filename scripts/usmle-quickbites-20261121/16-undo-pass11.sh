#!/bin/sh
# pass11: restores Step 1, Step 2 and Step 3 Quick Bites to the snapshot taken before pass11
# (Step 2 review fixes, DKA potassium alignment, Step 3 guideline re-sourcing).
# Does not change release flags. Does not touch the database.
# Do not run scripts/06-rollback-DO-NOT-RUN.sql.
set -e
ROOT="$(CDPATH= cd -- "$(dirname "$0")/../.." && pwd)"
BAK="$ROOT/scripts/usmle-quickbites-20261121/backup-pre-pass11-20261121"
for s in 1 2 3; do cp "$BAK/step-$s-bites.json" "$ROOT/content/usmle-quickbites/step-$s/bites.json"; done
cp "$BAK/AUDIT.md" "$ROOT/content/usmle-quickbites/AUDIT.md"
cp "$BAK/diagrams.json" "$ROOT/content/usmle-quickbites/diagrams.json"
cp "$BAK/usmle-bites.test.ts" "$ROOT/src/lib/quick-bites/usmle-bites.test.ts"
cp "$BAK/usmle-diagrams.tsx" "$ROOT/src/components/quick-bites/usmle-diagrams.tsx"
echo "Restored the pre-pass11 Quick Bites files. Release flags were not changed."
