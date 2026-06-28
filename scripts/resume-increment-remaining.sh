#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
export OPENAI_GENERATION_ONLY=1
RUN="bash scripts/run-with-node.sh npx tsx scripts/generate-increment-all-exams.ts"
LOG=artifacts/increment-all-exams-resume.log

run_field() {
  echo "" | tee -a "$LOG"
  echo "======== RESUME: $1 ========" | tee -a "$LOG"
  $RUN "$@" 2>&1 | tee -a "$LOG" || true
}

# Skip nursing if already running elsewhere — caller can pass --skip-nclex
SKIP_NCLEX=false
for arg in "$@"; do
  [[ "$arg" == "--skip-nclex" ]] && SKIP_NCLEX=true
done

if ! $SKIP_NCLEX; then
  run_field --field nursing --increment 67 --max-rounds 6
fi

run_field --field npte-pt --increment 50 --max-rounds 4
run_field --field usmle-step-2 --increment 50 --max-rounds 4
run_field --field usmle-step-3 --increment 50 --max-rounds 4

echo "Resume complete — see artifacts/increment-all-exams-report.json per field run" | tee -a "$LOG"
