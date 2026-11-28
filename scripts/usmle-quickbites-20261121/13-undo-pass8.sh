#!/bin/sh
# Restores Quick Bites to the snapshot taken before pass 8 (pass 6 content).
# Does not change release flags. Does not touch the database.
# Do not run scripts/06-rollback-DO-NOT-RUN.sql.
set -e
ROOT="$(CDPATH= cd -- "$(dirname "$0")/../.." && pwd)"
BAK="$ROOT/scripts/usmle-quickbites-20261121/backup-pre-pass8-20261121"
cp "$BAK/step-1-bites.json" "$ROOT/content/usmle-quickbites/step-1/bites.json"
cp "$BAK/step-2-bites.json" "$ROOT/content/usmle-quickbites/step-2/bites.json"
cp "$BAK/step-3-bites.json" "$ROOT/content/usmle-quickbites/step-3/bites.json"
cp "$BAK/AUDIT.md" "$ROOT/content/usmle-quickbites/AUDIT.md"
cp "$BAK/diagrams.json" "$ROOT/content/usmle-quickbites/diagrams.json"
cp "$BAK/usmle-bites.test.ts" "$ROOT/src/lib/quick-bites/usmle-bites.test.ts"
echo "Restored the pre-pass-8 Quick Bites files. Release flags were not changed."
