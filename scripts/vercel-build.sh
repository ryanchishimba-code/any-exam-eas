#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=ensure-database-url.sh
source "$DIR/ensure-database-url.sh"

npx prisma generate

if [[ "${PRISMA_DATABASE_URL_PLACEHOLDER:-}" != "1" ]] && [[ "${DATABASE_URL:-}" =~ ^postgres(ql)?:// ]]; then
  echo "Applying database migrations..."
  npx prisma migrate deploy
else
  echo "Skipping prisma migrate deploy until a real DATABASE_URL is configured on Vercel."
fi

npx next build
