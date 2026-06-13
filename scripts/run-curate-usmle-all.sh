#!/usr/bin/env bash
# Full USMLE AI curation — runs until complete, resumable on interrupt.
set -euo pipefail
cd "$(dirname "$0")/.."

NODE="${CURSOR_NODE:-/Applications/Cursor.app/Contents/Resources/app/resources/helpers/node}"
if [ ! -x "$NODE" ]; then
  NODE="$(command -v node || true)"
fi
if [ -z "$NODE" ]; then
  echo "No node binary found" >&2
  exit 1
fi

mkdir -p artifacts
LOG="artifacts/usmle-curate-run.log"
PIDFILE="artifacts/usmle-curate.pid"

if [ -f "$PIDFILE" ]; then
  OLD_PID="$(cat "$PIDFILE")"
  if kill -0 "$OLD_PID" 2>/dev/null; then
    echo "Already running (PID $OLD_PID). Tail: $LOG"
    exit 0
  fi
fi

echo "Starting USMLE full rewrite with $NODE"
nohup "$NODE" node_modules/.bin/tsx scripts/curate-usmle-ai.ts \
  --all --max-score 10 --resume \
  >> "$LOG" 2>&1 &
echo $! > "$PIDFILE"
echo "PID $(cat "$PIDFILE") — log: $LOG"
