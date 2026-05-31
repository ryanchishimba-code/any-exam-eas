import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, LOAD_TEST_EMAIL, LOAD_TEST_PASSWORD } from '../config.js';
import { loginFailureRate, loginAttempts, pageAuth } from './metrics.js';
import { FORM_HEADERS, JSON_HEADERS, reqParams } from './http.js';

/**
 * NextAuth / Auth.js credentials sign-in.
 * Returns a cookie jar with session cookies, or null on failure.
 */
export function loginWithCredentials(email = LOAD_TEST_EMAIL, password = LOAD_TEST_PASSWORD) {
  const jar = http.cookieJar();
  const start = Date.now();

  const csrfRes = http.get(`${BASE_URL}/api/auth/csrf`, reqParams({ jar, tags: { page: 'auth', step: 'csrf' } }));

  if (csrfRes.status !== 200) {
    loginFailureRate.add(1);
    pageAuth.add(Date.now() - start);
    return null;
  }

  let csrfToken;
  try {
    csrfToken = csrfRes.json('csrfToken');
  } catch {
    loginFailureRate.add(1);
    pageAuth.add(Date.now() - start);
    return null;
  }

  const body = {
    csrfToken,
    email,
    password,
    callbackUrl: `${BASE_URL}/study`,
    json: 'true',
  };

  const loginRes = http.post(`${BASE_URL}/api/auth/callback/credentials`, body, reqParams({
    jar,
    headers: FORM_HEADERS,
    redirects: 0,
    tags: { page: 'auth', step: 'credentials' },
  }));

  loginAttempts.add(1);
  pageAuth.add(Date.now() - start);

  const ok = check(loginRes, {
    'login accepted (2xx/3xx)': (r) => r.status >= 200 && r.status < 400,
  });

  if (!ok) {
    loginFailureRate.add(1);
    return null;
  }

  loginFailureRate.add(0);
  return jar;
}

/** Magic-link request (login flow without completing email). */
export function requestMagicLink(email) {
  const start = Date.now();
  const res = http.post(
    `${BASE_URL}/api/auth/magic-link`,
    JSON.stringify({ email }),
    reqParams({ headers: JSON_HEADERS, tags: { page: 'auth', step: 'magic_link' } })
  );
  pageAuth.add(Date.now() - start);
  loginAttempts.add(1);
  const ok = check(res, { 'magic link API responds': (r) => r.status === 200 || r.status === 429 });
  loginFailureRate.add(ok ? 0 : 1);
  return res;
}
