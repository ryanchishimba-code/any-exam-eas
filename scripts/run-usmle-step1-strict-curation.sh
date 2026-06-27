#!/usr/bin/env bash
# Long-running Step 1 strict AI curation (exam-ready ≥8, resumable).
set -euo pipefail
cd "$(dirname "$0")/.."

LOG="artifacts/usmle-curate-run-usmle-step-1-exam-ready.log"
PIDFILE="artifacts/usmle-curate-step1-strict.pid"
CKPT="artifacts/usmle-curate-checkpoint-usmle-step-1-exam-ready.json"

if [[ -f "$PIDFILE" ]] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
  echo "Already running (PID $(cat "$PIDFILE")). Tail: tail -f $LOG"
  exit 0
fi

echo "Starting Step 1 strict curation — log: $LOG"
nohup npx tsx scripts/curate-usmle-ai.ts \
  --field usmle-step-1 --all --exam-ready --min-accept 8 --resume \
  >>"$LOG" 2>&1 &
echo $! >"$PIDFILE"
echo "PID $(cat "$PIDFILE")"
if [[ -f "$CKPT" ]]; then
  python3 -c "import json; c=json.load(open('$CKPT')); print(f\"Resuming — {len(c['processed'])} processed, {c['counts'].get('updated',0)} updated\")"
fi
echo "Monitor: tail -f $LOG"
