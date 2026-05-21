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

npx prisma db push 2>/dev/null || true
npm run dev
