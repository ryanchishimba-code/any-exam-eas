/**
 * Any Exam Easy — k6 load test
 *
 * Simulates up to 4000 concurrent users with realistic pacing across:
 * homepage, auth, exam browsing, practice questions, and AI explanation flows.
 *
 * Run: see loadtests/k6/README.md
 */
import http from 'k6/http';
import { check } from 'k6';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.4/index.js';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

import {
  BASE_URL,
  MAX_VUS,
  RAMP_DURATION,
  HOLD_DURATION,
  RAMP_DOWN,
  pickScenario,
} from './config.js';
import {
  scenarioHomepage,
  scenarioBrowseExams,
  scenarioAuthFlow,
  scenarioPracticeQuestions,
  scenarioAiExplanation,
  scenarioRegistration,
} from './lib/scenarios.js';
import { reqParams } from './lib/http.js';

export const options = {
  scenarios: {
    ramp_to_peak: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: RAMP_DURATION, target: MAX_VUS },
        { duration: HOLD_DURATION, target: MAX_VUS },
        { duration: RAMP_DOWN, target: 0 },
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.10'],
    errors: ['rate<0.10'],
    login_failure_rate: ['rate<0.50'],
    page_homepage_duration: ['p(95)<5000'],
    page_catalog_api_duration: ['p(95)<4000'],
    page_questions_duration: ['p(95)<8000'],
    page_ai_explanation_duration: ['p(95)<12000'],
    page_auth_duration: ['p(95)<6000'],
  },
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
  tags: {
    testid: __ENV.K6_TEST_ID || `aee-${Date.now()}`,
    target: BASE_URL,
  },
};

/** Per-VU session jar (lazy init). */
let vuJar = null;

export function setup() {
  const health = http.get(`${BASE_URL}/api/health`, reqParams({ tags: { page: 'health' } }));
  const ready = check(health, {
    'health check OK': (r) => r.status === 200,
  });

  if (!ready) {
    console.warn(`WARNING: ${BASE_URL}/api/health returned ${health.status}`);
  }

  return {
    baseUrl: BASE_URL,
    maxVus: MAX_VUS,
    startedAt: new Date().toISOString(),
  };
}

export default function () {
  const name = pickScenario();

  switch (name) {
    case 'homepage':
      scenarioHomepage();
      break;
    case 'browseExams':
      scenarioBrowseExams();
      break;
    case 'authFlow':
      vuJar = scenarioAuthFlow(vuJar) || vuJar;
      break;
    case 'practiceQuestions': {
      const result = scenarioPracticeQuestions(vuJar);
      if (result && result.jar) vuJar = result.jar;
      break;
    }
    case 'aiExplanation': {
      const loaded = scenarioPracticeQuestions(vuJar);
      if (loaded && loaded.jar) vuJar = loaded.jar;
      scenarioAiExplanation(vuJar, loaded);
      break;
    }
    case 'registration':
      scenarioRegistration();
      break;
    default:
      scenarioHomepage();
  }
}

export function handleSummary(data) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const reportDir = __ENV.K6_REPORT_DIR || 'loadtests/k6/reports';

  return {
    [`${reportDir}/summary-${stamp}.html`]: htmlReport(data, {
      title: `Any Exam Easy Load Test — ${BASE_URL}`,
      description: `Peak ${MAX_VUS} VUs · ramp ${RAMP_DURATION} · hold ${HOLD_DURATION}`,
    }),
    [`${reportDir}/summary-${stamp}.json`]: JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
