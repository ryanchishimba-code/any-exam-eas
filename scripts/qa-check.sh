#!/bin/bash
# FIXED: One-command local QA — typecheck, unit tests, prisma generate (no global npm required).
set -e
cd "$(dirname "$0")/.."
export PATH="$(pwd)/.tools/node-v22.14.0-darwin-arm64/bin:$PATH"

echo "=== TypeScript ==="
npx tsc --noEmit

echo "=== Unit tests ==="
npm run test:unit

echo "=== Prisma generate ==="
npx prisma generate

echo "✓ QA checks passed"
