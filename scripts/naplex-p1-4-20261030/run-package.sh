#!/usr/bin/env bash
# Apply one prepared NAPLEX package to production anyexameasy.
# Usage: run-package.sh p1|p2|p3|p4
# Requires PGHOST, PGUSER, PGPASSWORD, and PGDATABASE in the environment.
# Stops before apply when the dry run fails. Does not drop backup tables.
# Does not apply package 5, the shuffle patch, or held content edits.
set -euo pipefail

pkg="${1:?package p1|p2|p3|p4}"
case "$pkg" in
  p1|p2|p3|p4) ;;
  *)
    echo "unknown package: $pkg" >&2
    exit 2
    ;;
esac

root="$(cd "$(dirname "$0")" && pwd)"
expected_host="ep-small-resonance-apmf4kiq.c-7.us-east-1.aws.neon.tech"
if [[ "${PGHOST:-}" != "$expected_host" ]]; then
  echo "refusing PGHOST=${PGHOST:-empty}" >&2
  exit 2
fi
if [[ "${PGDATABASE:-}" != "anyexameasy" ]]; then
  echo "refusing PGDATABASE=${PGDATABASE:-empty}" >&2
  exit 2
fi
if [[ "$PGHOST" == *pooler* ]]; then
  echo "refusing pooler host" >&2
  exit 2
fi

export PGSSLMODE="${PGSSLMODE:-require}"
export PGAPPNAME="naplex-p1-4-20261030"
psql=(psql -X -v ON_ERROR_STOP=1)

echo "== ${pkg} backup =="
"${psql[@]}" -f "$root/${pkg}-backup.sql"
echo "== ${pkg} dry run =="
"${psql[@]}" -f "$root/${pkg}-dryrun.sql"
echo "== ${pkg} apply =="
"${psql[@]}" -f "$root/${pkg}-apply.sql"
echo "== ${pkg} verify =="
"${psql[@]}" -f "$root/${pkg}-verify.sql"
echo "== served NAPLEX =="
"${psql[@]}" -c "SET statement_timeout = '10min'" -f "$root/served-naplex.sql"
