#!/bin/sh
# Restores the Quick Bites library to the snapshot taken before the finish-sourcing pass.
# Does not change release flags. Does not touch the database.
# Do not run scripts/06-rollback-DO-NOT-RUN.sql.
set -e
ROOT="$(CDPATH= cd -- "$(dirname "$0")/../.." && pwd)"
BAK="$ROOT/scripts/usmle-quickbites-20261121/backup-pre-finish-20261121"
cp "$BAK/step-1-bites.json" "$ROOT/content/usmle-quickbites/step-1/bites.json"
cp "$BAK/step-2-bites.json" "$ROOT/content/usmle-quickbites/step-2/bites.json"
cp "$BAK/step-3-bites.json" "$ROOT/content/usmle-quickbites/step-3/bites.json"
cp "$BAK/AUDIT.md" "$ROOT/content/usmle-quickbites/AUDIT.md"
cp "$BAK/diagrams.json" "$ROOT/content/usmle-quickbites/diagrams.json"
echo "Restored the pre-finish Quick Bites files. Release flags were not changed."
