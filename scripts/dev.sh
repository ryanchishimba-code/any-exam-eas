#!/bin/bash
# Start Any Exam Easy locally (uses portable Node in .tools if present)
set -e
cd "$(dirname "$0")/.."

if [ -d ".tools/node-v22.14.0-darwin-arm64/bin" ]; then
  export PATH="$(pwd)/.tools/node-v22.14.0-darwin-arm64/bin:$PATH"
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm not found. Install Node from https://nodejs.org or run setup first."
  exit 1
fi

if [ ! -d node_modules ]; then
  npm install
fi

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env — review before production."
fi

# Local Postgres via Docker (matches prisma postgresql provider)
LOCAL_DB_URL="postgresql://postgres:postgres@localhost:5432/anyexameasy"

if grep -q 'file:./dev.db' .env 2>/dev/null; then
  if command -v docker >/dev/null 2>&1; then
    echo "Updating .env DATABASE_URL for local PostgreSQL (was SQLite)."
    if sed --version 2>/dev/null | grep -q GNU; then
      sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"${LOCAL_DB_URL}\"|" .env
    else
      sed -i '' "s|DATABASE_URL=.*|DATABASE_URL=\"${LOCAL_DB_URL}\"|" .env
    fi
  else
    echo "ERROR: .env uses SQLite but this app needs PostgreSQL."
    echo "Install Docker and re-run ./scripts/dev.sh, or set DATABASE_URL to a Neon postgresql:// URL in .env"
    exit 1
  fi
fi

if command -v docker >/dev/null 2>&1; then
  echo "Starting local PostgreSQL (docker compose)..."
  docker compose up -d db
  sleep 2
  export DATABASE_URL="${DATABASE_URL:-$LOCAL_DB_URL}"
  npx prisma migrate deploy
else
  echo "Docker not found — using DATABASE_URL from .env (use Neon or local Postgres)."
  npx prisma migrate deploy || {
    echo "Could not migrate. Set DATABASE_URL in .env to a working postgresql:// URL."
    exit 1
  }
fi

echo ""
echo "Open http://localhost:3000"
echo ""

npm run dev
