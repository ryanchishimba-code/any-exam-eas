#!/usr/bin/env bash
# Wait for Day 4 tough gate (NAPLEX overallScore >= 7.6), then start Day 5.
# NCLEX is already clear at B+/8.
set -euo pipefail
cd "$(dirname "$0")/.."
RUN="bash scripts/run-with-node.sh npx tsx"
LOG="artifacts/day4-to-day5-handoff.log"
mkdir -p artifacts

log() { echo "[$(date -u +%H:%M:%SZ)] $*" | tee -a "$LOG"; }

naplex_score() {
  python3 - <<'PY'
import json
d=json.load(open("tmp/naplex-nabp-tough-rating.json"))
print(d["bank"].get("overallScore") or 0)
PY
}

naplex_letter() {
  python3 - <<'PY'
import json
d=json.load(open("tmp/naplex-nabp-tough-rating.json"))
b=d["bank"]
print(f"{b.get('overallLetter')}/{b.get('overallScore')}")
PY
}

quarantine_latest_lows() {
  python3 - <<'PY'
import json, pathlib
p = pathlib.Path("scripts/retag-naplex-nabp-outline-domains.ts")
text = p.read_text()
d = json.load(open("tmp/naplex-nabp-tough-rating.json"))
ids = []
for i in d["itemScores"]:
  flags = i.get("criticalFlags") or []
  if i["score"] <= 5 or any(
    any(k in f for k in ("Incorrect", "Non-guideline", "Unsafe", "Missing units", "All options", "Physician"))
    for f in flags
  ):
    ids.append(i["id"])
if not ids:
  print("no new quarantine ids")
  raise SystemExit(0)
# inject any missing ids before closing bracket of QUARANTINE_IDS
marker = "] as const;"
block_start = text.find("const QUARANTINE_IDS")
block_end = text.find(marker, block_start)
block = text[block_start:block_end]
added = []
for i in ids:
  if i not in block:
    added.append(i)
if not added:
  print("quarantine list already current")
  raise SystemExit(0)
insert = "".join(f'  "{i}",\n' for i in added)
text = text[:block_end] + insert + text[block_end:]
p.write_text(text)
print("added", len(added), "quarantine ids")
PY
}

run_day4_push() {
  local wave="$1"
  local bias="$2"
  local gen="$3"
  log "DAY4 push wave=$wave bias=$bias gen=$gen"
  quarantine_latest_lows || true
  $RUN scripts/retag-naplex-nabp-outline-domains.ts >>"$LOG" 2>&1 || true
  $RUN scripts/elevate-naplex-a-quality.mts --wave "$wave" --bias "$bias" --generate-count "$gen" --enrich-limit 300 --skip-fix >>"$LOG" 2>&1
  $RUN scripts/enrich-board-expert-rationales.ts --field pharmacy --serve-only --missing-enriched --limit 300 >>"$LOG" 2>&1 || true
  $RUN scripts/rate-naplex-nabp-tough.mts --sample 40 >"artifacts/day4-handoff-tough-w${wave}.log" 2>&1
  cp "artifacts/day4-handoff-tough-w${wave}.log" "tmp/last-naplex-tough.log" || true
  log "wave $wave verdict: $(naplex_letter)"
}

start_day5() {
  log "=== DAY 4 CLEAR — starting Day 5 ==="
  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) NAPLEX=$(naplex_letter)" > artifacts/day4-complete.json
  {
    echo "=== DAY5 content $(date -u +%H:%M:%SZ) ==="
    echo "=== NCLEX expert enrich ==="
    $RUN scripts/enrich-nclex-expert-rationales.ts --missing-expert --serve-only --limit 400
    echo "NCLEX_ENRICH_EXIT:$?"
    echo "=== NAPLEX coverage enrich ==="
    $RUN scripts/enrich-board-expert-rationales.ts --field pharmacy --serve-only --missing-enriched --limit 400
    echo "NAPLEX_ENRICH_EXIT:$?"
    echo "=== Quarantine / outline retag ==="
    $RUN scripts/retag-naplex-nabp-outline-domains.ts || true
    echo "=== Sync NAPLEX serve-ready ==="
    $RUN scripts/sync-naplex-serve-ready.ts || true
    echo "=== Full tough-rate NCLEX ==="
    $RUN scripts/rate-nclex-ncsbn-tough.mts --sample 40 > artifacts/day5-nclex-tough.log 2>&1
    echo "NCLEX_TOUGH_EXIT:$?"
    echo "=== Full tough-rate NAPLEX ==="
    $RUN scripts/rate-naplex-nabp-tough.mts --sample 40 > artifacts/day5-naplex-tough.log 2>&1
    echo "NAPLEX_TOUGH_EXIT:$?"
    echo "DAY5_CONTENT_DONE"
  } 2>&1 | tee artifacts/day5-content.log
  log "Day 5 content pipeline finished — product polish still needed in agent"
}

log "Handoff watcher started. Waiting for Day4h tough re-rate (wave 19)…"

# Wait up to ~3h for wave19 pipeline to write TOUGH_EXIT
for i in $(seq 1 180); do
  if grep -q 'TOUGH_EXIT:' artifacts/day4h-naplex-push.log 2>/dev/null; then
    log "Day4h finished: $(naplex_letter)"
    break
  fi
  # also accept dedicated tough log
  if grep -q 'VERDICT:' artifacts/day4h-naplex-tough.log 2>/dev/null && grep -q 'TOUGH_EXIT:' artifacts/day4h-naplex-tough.log 2>/dev/null; then
    log "Day4h tough log finished: $(naplex_letter)"
    break
  fi
  sleep 60
done

SCORE="$(naplex_score)"
log "Current NAPLEX overallScore=$SCORE (need >= 7.6)"

wave=20
biases=(calcs domain3 safety calcs)
gens=(80 90 70 80)
attempt=0

while ! python3 -c "import sys; sys.exit(0 if float('$SCORE') >= 7.6 else 1)"; do
  if [ "$attempt" -ge 4 ]; then
    log "FAILED: still below 7.6 after 4 extra pushes ($(naplex_letter)). Not starting Day 5."
    exit 2
  fi
  bias="${biases[$attempt]}"
  gen="${gens[$attempt]}"
  run_day4_push "$wave" "$bias" "$gen"
  SCORE="$(naplex_score)"
  wave=$((wave + 1))
  attempt=$((attempt + 1))
done

log "Day 4 GATE CLEAR: NAPLEX $(naplex_letter)"
start_day5
log "Handoff complete."
