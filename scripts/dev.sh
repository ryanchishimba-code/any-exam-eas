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

LOCAL_PG_URL="postgresql://postgres:postgres@localhost:5432/anyexameasy"
LOCAL_SQLITE_URL="file:./dev.db"

use_postgres() {
  node scripts/set-prisma-provider.mjs postgresql
  if grep -q 'file:./dev.db' .env 2>/dev/null; then
    if sed --version 2>/dev/null | grep -q GNU; then
      sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"${LOCAL_PG_URL}\"|" .env
    else
      sed -i '' "s|DATABASE_URL=.*|DATABASE_URL=\"${LOCAL_PG_URL}\"|" .env
    fi
  fi
  export DATABASE_URL="${LOCAL_PG_URL}"
  docker compose up -d db
  sleep 2
  npx prisma migrate deploy
}

use_sqlite() {
  echo "Using local SQLite (dev.db) — no Docker required."
  node scripts/set-prisma-provider.mjs sqlite
  if sed --version 2>/dev/null | grep -q GNU; then
    sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"${LOCAL_SQLITE_URL}\"|" .env
  else
    sed -i '' "s|DATABASE_URL=.*|DATABASE_URL=\"${LOCAL_SQLITE_URL}\"|" .env
  fi
  export DATABASE_URL="${LOCAL_SQLITE_URL}"
  npx prisma db push
}

if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
  echo "Starting local PostgreSQL (Docker)..."
  use_postgres
else
  use_sqlite
fi

npx prisma generate
rm -rf .next

echo ""
echo "Open http://localhost:3000"
echo ""

npm run dev
