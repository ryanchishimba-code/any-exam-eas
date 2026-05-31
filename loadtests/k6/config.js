/**
 * Shared configuration — override via environment variables.
 *
 * BASE_URL          Production/staging origin (default: https://www.anyexameasy.com)
 * MAX_VUS           Peak virtual users (default: 4000)
 * RAMP_DURATION     Ramp-up duration e.g. 5m (default: 5m)
 * HOLD_DURATION     Time at peak after ramp (default: 2m)
 * RAMP_DOWN         Ramp-down duration (default: 1m)
 * LOAD_TEST_EMAIL   Premium test user for authenticated flows
 * LOAD_TEST_PASSWORD
 * ENABLE_REGISTRATION  "true" to include signup POSTs (default: false)
 * ENABLE_AI_HEAVY      "true" to hit /api/engine/test (rate-limited; default: false)
 * THINK_TIME_MIN    Seconds (default: 1)
 * THINK_TIME_MAX    Seconds (default: 4)
 */

export const BASE_URL = (__ENV.BASE_URL || 'https://www.anyexameasy.com').replace(/\/$/, '');

export const MAX_VUS = Number(__ENV.MAX_VUS || 4000);
export const RAMP_DURATION = __ENV.RAMP_DURATION || '5m';
export const HOLD_DURATION = __ENV.HOLD_DURATION || '2m';
export const RAMP_DOWN = __ENV.RAMP_DOWN || '1m';

export const LOAD_TEST_EMAIL = __ENV.LOAD_TEST_EMAIL || 'test-premium@anyexameasy.test';
export const LOAD_TEST_PASSWORD = __ENV.LOAD_TEST_PASSWORD || 'TestLogin1!';

export const ENABLE_REGISTRATION = (__ENV.ENABLE_REGISTRATION || 'false') === 'true';
export const ENABLE_AI_HEAVY = (__ENV.ENABLE_AI_HEAVY || 'false') === 'true';

export const THINK_TIME_MIN = Number(__ENV.THINK_TIME_MIN || 1);
export const THINK_TIME_MAX = Number(__ENV.THINK_TIME_MAX || 4);

/** Weighted scenario mix (must sum to 1). */
export const SCENARIO_WEIGHTS = {
  homepage: 0.2,
  browseExams: 0.2,
  authFlow: 0.15,
  practiceQuestions: 0.25,
  aiExplanation: 0.15,
  registration: ENABLE_REGISTRATION ? 0.05 : 0,
};

/** Normalize weights when registration disabled. */
export function pickScenario() {
  const entries = Object.entries(SCENARIO_WEIGHTS).filter(([, w]) => w > 0);
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [name, weight] of entries) {
    r -= weight;
    if (r <= 0) return name;
  }
  return entries[entries.length - 1][0];
}

export const EXAM_FIELDS = [
  { field: 'nursing', subjectId: 'pharmacology-nursing', label: 'NCLEX' },
  { field: 'medicine', subjectId: 'pathology', label: 'USMLE' },
  { field: 'pharmacy', subjectId: 'pharmacology', label: 'NAPLEX' },
  { field: 'dentistry', subjectId: 'oral-pathology', label: 'INBDE' },
];

export const PUBLIC_PAGES = [
  '/',
  '/pricing',
  '/signup?plan=trial',
  '/login',
  '/study',
];

export const EXAM_CATEGORY_PAGES = [
  '/study?field=nursing',
  '/study?field=medicine',
  '/study?field=pharmacy',
  '/study?field=dentistry',
  '/#choose-exam',
];
