#!/bin/bash
# Start local dev — no global Node/npm required (uses .tools/node).
set -e
cd "$(dirname "$0")"
NODE_BIN=".tools/node-v22.14.0-darwin-arm64/bin/node"
if [ ! -x "$NODE_BIN" ]; then
  echo "Bundled Node missing. Install Node 20+ from https://nodejs.org"
  echo "Or run: brew install node && npm install && npm run dev"
  exit 1
fi
exec "$NODE_BIN" scripts/local-dev.mjs
