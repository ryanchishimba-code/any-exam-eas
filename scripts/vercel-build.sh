#!/usr/bin/env bash
set -euo pipefail

npx prisma generate

if [[ "${DATABASE_URL:-}" =~ ^postgres(ql)?:// ]]; then
  echo "Applying database migrations..."
  npx prisma migrate deploy
else
  echo "Skipping prisma migrate deploy: set DATABASE_URL to a postgresql:// or postgres:// URL in Vercel."
fi

npx next build
