#!/bin/bash
# Start local dev — installs bundled Node if needed, then runs Next.js.
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -x ".tools/node-v22.14.0-darwin-arm64/bin/node" ] && [ ! -x ".tools/node-v22.14.0-darwin-x64/bin/node" ]; then
  echo "Bundled Node not found — installing into .tools/ …"
  bash scripts/install-bundled-node.sh
fi

for dir in .tools/node-v22.14.0-darwin-arm64 .tools/node-v22.14.0-darwin-x64; do
  if [ -x "$dir/bin/node" ]; then
    export PATH="$(pwd)/$dir/bin:$PATH"
    break
  fi
done

exec node scripts/local-dev.mjs
