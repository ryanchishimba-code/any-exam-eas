import { cacheDeleteAsync, cacheKey, invalidateLearningDashboardCache } from "@/lib/cache";
import { examSlugFromFieldId } from "@/lib/edtech/exams";
import { reviewFieldIdsForQuery } from "@/lib/learning/review-queue-launch";

/**
 * Drop dashboard / analytics caches for this user so the next page load
 * reads QuestionAttempt rows written by the session that just ended.
 * Explicit keys are deleted in Redis; prefix wipe covers this isolate's L1.
 */
export function studentReadCacheKeys(userId: string, fieldId?: string | null): string[] {
  const scopes = new Set<string>(["all"]);
  if (fieldId) scopes.add(fieldId);
  const keys: string[] = [];
  for (const scope of scopes) {
    keys.push(cacheKey(["student-dashboard-v5", userId, scope, "trend"]));
    keys.push(cacheKey(["student-dashboard-v5", userId, scope, "no-trend"]));
    keys.push(cacheKey(["student-dashboard-v4", userId, scope, "trend"]));
    keys.push(cacheKey(["student-dashboard-v4", userId, scope, "no-trend"]));
    keys.push(cacheKey(["student-dashboard-v3", userId, scope, "trend"]));
    keys.push(cacheKey(["student-dashboard-v3", userId, scope, "no-trend"]));
    keys.push(cacheKey(["student-dashboard", userId, scope]));
    keys.push(cacheKey(["weak-topics-v3", userId, scope]));
    keys.push(cacheKey(["weak-topics", userId, scope]));
    keys.push(cacheKey(["library-hub-stats", userId, scope]));
    keys.push(cacheKey(["exam-roadmap", userId, scope]));
    keys.push(cacheKey(["exam-roadmap-v2", userId, scope]));
    keys.push(cacheKey(["exam-roadmap-v4", userId, scope]));
    keys.push(cacheKey(["exam-roadmap-v5", userId, scope]));
    keys.push(cacheKey(["exam-roadmap-v6", userId, scope]));
    keys.push(cacheKey(["exam-roadmap-v8", userId, scope]));
    keys.push(cacheKey(["exam-roadmap-v7", userId, scope]));
    keys.push(cacheKey(["mastery-dashboard", userId, scope]));
    keys.push(cacheKey(["exam-scoped-stats-v2", userId, scope]));
    keys.push(cacheKey(["exam-scoped-stats", userId, scope]));
  }
  if (fieldId) {
    const slug = examSlugFromFieldId(fieldId);
    if (slug) {
      keys.push(cacheKey(["exam-scoped-stats-v2", userId, slug, fieldId]));
      keys.push(cacheKey(["exam-scoped-stats", userId, slug, fieldId]));
      keys.push(cacheKey(["exam-roadmap", userId, slug]));
      keys.push(cacheKey(["exam-roadmap-v2", userId, slug]));
      keys.push(cacheKey(["exam-roadmap-v4", userId, slug]));
      keys.push(cacheKey(["exam-roadmap-v5", userId, slug]));
      keys.push(cacheKey(["exam-roadmap-v6", userId, slug]));
      keys.push(cacheKey(["exam-roadmap-v8", userId, slug]));
      keys.push(cacheKey(["exam-roadmap-v7", userId, slug]));
      keys.push(cacheKey(["mastery-dashboard", userId, slug]));
    }
  }
  return keys;
}

export async function invalidateStudentReadCaches(
  userId: string,
  fieldId?: string | null
): Promise<void> {
  invalidateLearningDashboardCache(userId);
  const aliases = reviewFieldIdsForQuery(fieldId);
  const targets = aliases.length > 0 ? aliases : [fieldId ?? null];
  const keys = new Set<string>();
  for (const target of targets) {
    for (const key of studentReadCacheKeys(userId, target)) keys.add(key);
  }
  await Promise.all([...keys].map((key) => cacheDeleteAsync(key)));
}
