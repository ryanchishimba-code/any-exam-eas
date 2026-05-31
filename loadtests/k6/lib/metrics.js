import { Trend, Rate, Counter } from 'k6/metrics';

/** Custom metrics for key user journeys. */
export const pageHomepage = new Trend('page_homepage_duration', true);
export const pageBrowseExams = new Trend('page_browse_exams_duration', true);
export const pageCatalogApi = new Trend('page_catalog_api_duration', true);
export const pageQuestions = new Trend('page_questions_duration', true);
export const pageAiExplanation = new Trend('page_ai_explanation_duration', true);
export const pageAuth = new Trend('page_auth_duration', true);
export const pageRegistration = new Trend('page_registration_duration', true);

export const errorRate = new Rate('errors');
export const loginFailureRate = new Rate('login_failure_rate');
export const authRequiredFailureRate = new Rate('auth_required_failure_rate');

export const homepageViews = new Counter('homepage_views_total');
export const catalogLoads = new Counter('catalog_loads_total');
export const questionsLoaded = new Counter('questions_loaded_total');
export const aiSimulations = new Counter('ai_simulations_total');
export const loginAttempts = new Counter('login_attempts_total');
export const registrations = new Counter('registrations_total');

export function recordError() {
  errorRate.add(1);
}

export function recordSuccess() {
  errorRate.add(0);
}
