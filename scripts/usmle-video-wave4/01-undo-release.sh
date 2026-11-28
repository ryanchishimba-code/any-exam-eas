#!/bin/sh
# Restores episodes 31–53 to held (hidden from students) using the pre-release snapshot.
# Does not change USMLE_VIDEO_QUICK_BITES_PUBLIC or NEXT_PUBLIC_USMLE_VIDEO_QUICK_BITES_PUBLIC.
# Does not touch the database. No question-bank or study-guide rows were written for this release.
set -e
ROOT="$(CDPATH= cd -- "$(dirname "$0")/../.." && pwd)"
BAK="$ROOT/scripts/usmle-video-wave4/backup-pre-release-20261128"
cp "$BAK/usmle-video-catalog.ts.bak" "$ROOT/src/lib/quick-bites/usmle-video-catalog.ts"
cp "$BAK/catalog-integrity.test.ts.bak" "$ROOT/src/lib/quick-bites/catalog-integrity.test.ts"
cp "$BAK/usmle-video-steps.test.ts.bak" "$ROOT/src/lib/quick-bites/usmle-video-steps.test.ts"
cp "$BAK/UsmleVideoStepSwitch.test.tsx.bak" "$ROOT/tests/unit/components/UsmleVideoStepSwitch.test.tsx"
cp "$BAK/SOURCES.md.bak" "$ROOT/content/usmle-video-wave4/SOURCES.md"
echo "Restored held on episodes 31-53. Release flags were not changed. No database rows were touched."
