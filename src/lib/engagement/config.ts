export const ENGAGEMENT_SURFACES = [
  "questions",
  "exam",
  "quick-bites",
  "study-guide",
  "drug-cards",
  "anatomy",
  "other",
] as const;

export type EngagementSurface = (typeof ENGAGEMENT_SURFACES)[number];

export const CENTRAL_TIMEZONE = "America/Chicago";

/** Max seconds credited per accepted heartbeat. */
export const HEARTBEAT_MAX_CREDIT_SECONDS = 35;

/** Heartbeats closer than this are ignored (too fast). */
export const HEARTBEAT_MIN_INTERVAL_MS = 25_000;

/** Client sends every 30s when active. */
export const HEARTBEAT_CLIENT_INTERVAL_MS = 30_000;

/** User must have been active within this window. */
export const HEARTBEAT_ACTIVE_WINDOW_MS = 60_000;

/** Cap per question attempt when cross-checking time from QuestionAttempt. */
export const QUESTION_ATTEMPT_MAX_DURATION_MS = 5 * 60 * 1000;

export const FAST_ANSWER_MS = 5000;

export const ANSWER_BURST_PER_MINUTE = 30;
