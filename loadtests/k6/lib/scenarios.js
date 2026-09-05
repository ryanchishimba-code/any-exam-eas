import http from 'k6/http';
import { check, sleep } from 'k6';
import {
  BASE_URL,
  THINK_TIME_MIN,
  THINK_TIME_MAX,
  EXAM_FIELDS,
  PUBLIC_PAGES,
  EXAM_CATEGORY_PAGES,
  ENABLE_AI_HEAVY,
  ENABLE_REGISTRATION,
} from '../config.js';
import { loginWithCredentials } from './auth.js';
import { reqParams, JSON_HEADERS } from './http.js';
import {
  pageHomepage,
  pageBrowseExams,
  pageCatalogApi,
  pageQuestions,
  pageAiExplanation,
  pageRegistration,
  homepageViews,
  catalogLoads,
  questionsLoaded,
  aiSimulations,
  registrations,
  authRequiredFailureRate,
  recordSuccess,
  recordError,
} from './metrics.js';

export function thinkTime() {
  const span = THINK_TIME_MAX - THINK_TIME_MIN;
  sleep(THINK_TIME_MIN + Math.random() * (span > 0 ? span : 1));
}

export function scenarioHomepage() {
  const start = Date.now();
  const res = http.get(`${BASE_URL}/`, reqParams({ tags: { page: 'homepage', scenario: 'homepage' } }));
  pageHomepage.add(Date.now() - start);
  homepageViews.add(1);

  const ok = check(res, {
    'homepage status 200': (r) => r.status === 200,
    'homepage has title': (r) => r.body && r.body.includes('Any Exam Easy'),
  });
  ok ? recordSuccess() : recordError();

  thinkTime();

  const page = PUBLIC_PAGES[Math.floor(Math.random() * PUBLIC_PAGES.length)];
  if (page !== '/') {
    http.get(`${BASE_URL}${page}`, reqParams({ tags: { page: 'homepage', scenario: 'homepage_secondary' } }));
    thinkTime();
  }
}

export function scenarioBrowseExams() {
  const start = Date.now();

  const catalogStart = Date.now();
  const catalog = http.get(`${BASE_URL}/api/catalog/subjects`, reqParams({ tags: { page: 'catalog', scenario: 'browse_exams' } }));
  pageCatalogApi.add(Date.now() - catalogStart);
  catalogLoads.add(1);

  check(catalog, {
    'catalog status 200': (r) => r.status === 200,
    'catalog has subjects': (r) => {
      try {
        return Array.isArray(r.json('subjects'));
      } catch {
        return false;
      }
    },
  }) ? recordSuccess() : recordError();

  const page = EXAM_CATEGORY_PAGES[Math.floor(Math.random() * EXAM_CATEGORY_PAGES.length)];
  const pageRes = http.get(`${BASE_URL}${page}`, reqParams({ tags: { page: 'browse_exams', scenario: 'browse_exams' } }));
  pageBrowseExams.add(Date.now() - start);

  check(pageRes, { 'exam page loads': (r) => r.status === 200 || r.status === 307 }) ||
    recordError();

  thinkTime();
}

export function scenarioAuthFlow(jar) {
  if (jar) {
    const sessionRes = http.get(`${BASE_URL}/api/auth/session`, reqParams({ jar, tags: { page: 'auth', scenario: 'auth_session' } }));
    check(sessionRes, { 'session valid': (r) => r.status === 200 });
    thinkTime();
    return jar;
  }

  return loginWithCredentials();
}

export function scenarioPracticeQuestions(jar) {
  if (!jar) {
    jar = loginWithCredentials();
  }
  if (!jar) {
    authRequiredFailureRate.add(1);
    recordError();
    return;
  }
  authRequiredFailureRate.add(0);

  const exam = EXAM_FIELDS[Math.floor(Math.random() * EXAM_FIELDS.length)];
  const start = Date.now();

  const url =
    `${BASE_URL}/api/questions?field=${encodeURIComponent(exam.field)}` +
    `&subjectId=${encodeURIComponent(exam.subjectId)}&limit=25`;

  const res = http.get(url, reqParams({ jar, tags: { page: 'questions', scenario: 'practice_questions', exam: exam.label } }));

  pageQuestions.add(Date.now() - start);

  let questionCount = 0;
  const ok = check(res, {
    'questions status 200': (r) => r.status === 200,
    'questions payload': (r) => {
      if (r.status !== 200) return false;
      try {
        const qs = r.json('questions') || r.json('items') || [];
        questionCount = Array.isArray(qs) ? qs.length : 0;
        return questionCount > 0;
      } catch {
        return false;
      }
    },
  });

  if (ok) {
    questionsLoaded.add(questionCount || 1);
    recordSuccess();
  } else if (res.status === 401 || res.status === 403) {
    authRequiredFailureRate.add(1);
    recordError();
  } else {
    recordError();
  }

  thinkTime();
  return { jar, exam, res };
}

export function scenarioAiExplanation(jar, prior) {
  if (!jar) {
    jar = loginWithCredentials();
  }
  if (!jar) {
    authRequiredFailureRate.add(1);
    recordError();
    return;
  }

  let questionPayload = buildMockQuestion(EXAM_FIELDS[0]);

  if (prior && prior.res && prior.res.status === 200) {
    try {
      const qs = prior.res.json('questions') || [];
      if (qs.length > 0) {
        const q = qs[0];
        questionPayload = mapBankQuestionToAttempt(q, prior.exam);
      }
    } catch {
      /* use mock */
    }
  } else {
    const loaded = scenarioPracticeQuestions(jar);
    if (loaded && loaded.res && loaded.res.status === 200) {
      try {
        const qs = loaded.res.json('questions') || [];
        if (qs.length > 0) {
          questionPayload = mapBankQuestionToAttempt(qs[0], loaded.exam);
        }
      } catch {
        /* use mock */
      }
    }
  }

  const start = Date.now();

  const attemptRes = http.post(
    `${BASE_URL}/api/study/attempt`,
    JSON.stringify({
      question: questionPayload,
      correct: Math.random() > 0.35,
      confidence: 3 + Math.floor(Math.random() * 3),
      durationMs: 8000 + Math.floor(Math.random() * 25000),
      selectedAnswer: questionPayload.options?.[0] ?? 'A',
      sessionId: `k6-${__VU}-${Date.now()}`,
    }),
    reqParams({
      jar,
      headers: JSON_HEADERS,
      tags: { page: 'ai_explanation', scenario: 'study_attempt' },
    })
  );

  pageAiExplanation.add(Date.now() - start);
  aiSimulations.add(1);

  check(attemptRes, {
    'attempt processed': (r) => r.status === 200,
    'insight returned': (r) => {
      try {
        return r.json('ok') === true;
      } catch {
        return false;
      }
    },
  }) ? recordSuccess() : recordError();

  if (ENABLE_AI_HEAVY && Math.random() < 0.05) {
    simulateHeavyAiGeneration(jar);
  }

  thinkTime();
}

function simulateHeavyAiGeneration(jar) {
  const exam = EXAM_FIELDS[Math.floor(Math.random() * EXAM_FIELDS.length)];
  const start = Date.now();
  const res = http.post(
    `${BASE_URL}/api/engine/test`,
    JSON.stringify({
      field: exam.field,
      subjectId: exam.subjectId,
      topic: 'load test sample',
      difficulty: 'medium',
      questionCount: 1,
    }),
    reqParams({
      jar,
      headers: JSON_HEADERS,
      timeout: '180s',
      tags: { page: 'ai_explanation', scenario: 'engine_test_heavy' },
    })
  );
  pageAiExplanation.add(Date.now() - start);
  check(res, {
    'engine test responds': (r) => r.status === 200 || r.status === 429,
  });
}

export function scenarioRegistration() {
  if (!ENABLE_REGISTRATION) return;

  const start = Date.now();
  const email = `k6-${__VU}-${__ITER}-${Date.now()}@loadtest.anyexameasy.test`;

  const res = http.post(
    `${BASE_URL}/api/register`,
    JSON.stringify({
      firstName: "K6",
      lastName: `User${__VU}`,
      email,
      password: 'TestLogin1!Aa',
      dateOfBirth: '1990-01-15',
      acceptedTerms: true,
      plan: 'trial',
    }),
    reqParams({ headers: JSON_HEADERS, tags: { page: 'registration', scenario: 'registration' } })
  );

  pageRegistration.add(Date.now() - start);
  registrations.add(1);

  check(res, {
    'registration accepted or rate-limited': (r) =>
      r.status === 200 || r.status === 400 || r.status === 429,
  }) ? recordSuccess() : recordError();

  thinkTime();
}

function buildMockQuestion(exam) {
  return {
    id: `k6-mock-${__VU}`,
    sourceIndex: 1,
    type: 'multiple_choice',
    stem: 'A patient with heart failure reports sudden weight gain. What is the priority assessment?',
    options: ['Dry cough', 'Bilateral crackles and edema', 'Normal BP', 'Clear lungs'],
    correctAnswers: ['Bilateral crackles and edema'],
    explanation: 'Fluid overload manifests as crackles and pitting edema in heart failure.',
    field: exam.field,
    subjectId: exam.subjectId,
    tags: ['cardiac', 'load-test'],
    difficulty: 'medium',
    highYield: true,
  };
}

function mapBankQuestionToAttempt(q, exam) {
  const sourceIndex = typeof q.id === 'number' ? q.id : Number(q.id) || 1;
  const correct =
    q.correctAnswer ?? (Array.isArray(q.correctAnswers) ? q.correctAnswers[0] : '') ?? '';
  return {
    id: String(q.id ?? `q-${__VU}`),
    sourceIndex,
    type: q.type ?? 'multiple_choice',
    stem: q.question ?? q.stem ?? 'Sample question',
    options: q.options ?? [],
    correctAnswers: correct ? [correct] : [''],
    explanation: q.explanation ?? 'Explanation unavailable.',
    field: exam.field,
    subjectId: exam.subjectId,
    tags: q.tags ?? [],
    difficulty: 'medium',
    highYield: true,
  };
}
