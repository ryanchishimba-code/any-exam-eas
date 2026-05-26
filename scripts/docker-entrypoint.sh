#!/bin/sh
set -e
if [ "$RUN_MIGRATIONS" = "true" ] && [ -n "$DATABASE_URL" ]; then
  case "$DATABASE_URL" in
    postgres:*|postgresql:*)
      echo "Applying database migrations (RUN_MIGRATIONS=true)…"
      if [ -x ./node_modules/.bin/prisma ]; then
        ./node_modules/.bin/prisma migrate deploy
      else
        echo "Prisma CLI not found in image — run: npx prisma migrate deploy from CI"
      fi
      ;;
  esac
fi
exec "$@"
