#!/bin/sh
set -e
# Optional: set RUN_MIGRATIONS=true on first deploy only (requires prisma CLI in image).
if [ "$RUN_MIGRATIONS" = "true" ] && [ -n "$DATABASE_URL" ]; then
  echo "RUN_MIGRATIONS is set — run prisma migrate deploy from CI or a one-off ECS task instead."
fi
exec "$@"
