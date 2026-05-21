#!/usr/bin/env bash
# Sourced by postinstall and vercel-build. Prisma requires DATABASE_URL to be set
# even for `prisma generate`. Use a placeholder at build time if missing.

PLACEHOLDER_URL="postgresql://build:build@127.0.0.1:5432/build?schema=public"

if [[ -z "${DATABASE_URL:-}" ]]; then
  export DATABASE_URL="$PLACEHOLDER_URL"
  export PRISMA_DATABASE_URL_PLACEHOLDER=1
  echo "Warning: DATABASE_URL is not set. Using a build-time placeholder."
  echo "Add your Neon/Vercel Postgres URL in Vercel → Settings → Environment Variables."
fi
