# Any Exam Easy — k6 Load Tests

Professional load test suite for [anyexameasy.com](https://www.anyexameasy.com) using [Grafana k6](https://k6.io/). Simulates up to **4000 concurrent virtual users** with realistic pacing, custom metrics, error-rate thresholds, and HTML report generation.

## Scenarios

| Scenario | Weight | What it exercises |
|----------|--------|-------------------|
| Homepage | 20% | `/`, `/pricing`, `/login`, `/study` |
| Browse exams | 20% | `/api/catalog/subjects`, exam category pages |
| Auth flow | 15% | Credentials login + magic-link request |
| Practice questions | 25% | `GET /api/questions` (premium, authenticated) |
| AI explanation | 15% | `POST /api/study/attempt` (insight/remediation) |
| Registration | 5%* | `POST /api/register` (*disabled by default) |

Optional heavy AI: set `ENABLE_AI_HEAVY=true` to sample `POST /api/engine/test` (rate-limited; use sparingly).

## Load profile

Default stages:

1. **Ramp up** — 0 → 4000 VUs over **5 minutes**
2. **Hold** — 4000 VUs for **2 minutes**
3. **Ramp down** — 4000 → 0 over **1 minute**

## Install k6

**macOS (Homebrew)**

```bash
brew install k6
```

**Linux (Debian/Ubuntu)**

```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg \
  --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | \
  sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update && sudo apt-get install k6
```

**Windows**

```powershell
choco install k6
```

Verify: `k6 version`

## Quick smoke test (recommended first)

Run against production with a tiny profile before a full 4000-VU run:

```bash
k6 run \
  -e BASE_URL=https://www.anyexameasy.com \
  -e MAX_VUS=10 \
  -e RAMP_DURATION=30s \
  -e HOLD_DURATION=30s \
  -e RAMP_DOWN=15s \
  -e LOAD_TEST_EMAIL=test-premium@anyexameasy.test \
  -e LOAD_TEST_PASSWORD='TestLogin1!' \
  loadtests/k6/main.js
```

## Full 4000-user production run

> **Warning:** 4000 VUs will generate significant traffic, hit Vercel/serverless limits, and trigger API rate limits. Only run with explicit approval. Prefer staging or a scaled-down `MAX_VUS` for routine checks.

```bash
k6 run \
  -e BASE_URL=https://www.anyexameasy.com \
  -e MAX_VUS=4000 \
  -e RAMP_DURATION=5m \
  -e HOLD_DURATION=2m \
  -e RAMP_DOWN=1m \
  -e LOAD_TEST_EMAIL=test-premium@anyexameasy.test \
  -e LOAD_TEST_PASSWORD='TestLogin1!' \
  loadtests/k6/main.js
```

## Local / staging

```bash
k6 run \
  -e BASE_URL=http://127.0.0.1:3000 \
  -e MAX_VUS=50 \
  -e LOAD_TEST_EMAIL=test-premium@anyexameasy.test \
  -e LOAD_TEST_PASSWORD='TestLogin1!' \
  loadtests/k6/main.js
```

## npm scripts

From the repo root:

```bash
# Smoke (10 VUs)
npm run test:load:k6:smoke

# Full profile (4000 VUs) — use with care
npm run test:load:k6
```

## Environment variables

Copy `.env.example` and pass values with `-e KEY=value` or a shell export:

| Variable | Default | Description |
|----------|---------|-------------|
| `BASE_URL` | `https://www.anyexameasy.com` | Target origin |
| `MAX_VUS` | `4000` | Peak concurrent users |
| `RAMP_DURATION` | `5m` | Ramp-up duration |
| `HOLD_DURATION` | `2m` | Time at peak |
| `RAMP_DOWN` | `1m` | Ramp-down duration |
| `LOAD_TEST_EMAIL` | premium test user | Auth for protected APIs |
| `LOAD_TEST_PASSWORD` | `TestLogin1!` | Password for test user |
| `ENABLE_REGISTRATION` | `false` | Enable signup POSTs |
| `ENABLE_AI_HEAVY` | `false` | Hit `/api/engine/test` (OpenAI) |
| `THINK_TIME_MIN` / `MAX` | `1` / `4` | Random pause between steps (s) |
| `K6_REPORT_DIR` | `loadtests/k6/reports` | HTML/JSON output path |

## Reports

After each run, k6 writes:

- `loadtests/k6/reports/summary-<timestamp>.html` — interactive HTML report ([k6-reporter](https://github.com/benc-uk/k6-reporter))
- `loadtests/k6/reports/summary-<timestamp>.json` — raw summary JSON
- Colored text summary to stdout

Open the HTML file in a browser to review throughput, latency percentiles, checks, and custom metrics.

## Custom metrics & thresholds

**Trends (latency)**

- `page_homepage_duration`
- `page_browse_exams_duration`
- `page_catalog_api_duration`
- `page_questions_duration`
- `page_ai_explanation_duration`
- `page_auth_duration`

**Rates & counters**

- `errors` — failed checks (threshold: `< 10%`)
- `http_req_failed` — HTTP failures (threshold: `< 10%`)
- `login_failure_rate`
- `homepage_views_total`, `questions_loaded_total`, `ai_simulations_total`, etc.

## Project layout

```
loadtests/k6/
├── main.js           # Entry point, stages, thresholds, handleSummary
├── config.js         # Env vars, weights, exam fixtures
├── lib/
│   ├── auth.js       # NextAuth credentials + magic link
│   ├── metrics.js    # Custom Trend/Rate/Counter metrics
│   └── scenarios.js  # Per-journey HTTP flows
├── reports/          # Generated HTML/JSON (gitignored)
└── README.md
```

## Distributed runs (optional)

For true 4000+ VU scale beyond a single machine, use [k6 cloud](https://grafana.com/docs/k6/latest/testing-guides/running-large-tests/) or k6 operator on Kubernetes. A single modern machine can often sustain 4000 VUs for HTTP-heavy scripts, but monitor CPU and open connections.

## Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| Many `401` on `/api/questions` | Invalid test credentials or expired premium user |
| High `429` rates | API rate limits (`register`, `magic-link`, `engine-test`) — reduce VUs or disable heavy scenarios |
| Login failures | CSRF/cookie issue — confirm `BASE_URL` matches the site origin exactly |
| Timeouts on AI | Expected under load; keep `ENABLE_AI_HEAVY=false` unless testing AI capacity |
