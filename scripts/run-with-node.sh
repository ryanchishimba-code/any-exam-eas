#!/usr/bin/env bash
# Use project-local Node when system npm is missing.
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="$ROOT/.tools/node-v22.14.0-darwin-arm64/bin:$PATH"
cd "$ROOT" || exit 1
exec "$@"
