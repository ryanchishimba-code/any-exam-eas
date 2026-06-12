#!/bin/bash
# Start local dev — prefers bundled .tools Node, falls back to system node.
set -e
cd "$(dirname "$0")"
exec node scripts/local-dev.mjs
