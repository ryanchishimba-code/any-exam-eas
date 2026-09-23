import { cacheDeleteAsync, cacheKey, invalidateLearningDashboardCache } from "@/lib/cache";
import { examSlugFromFieldId } from "@/lib/edtech/exams";

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
    keys.push(cacheKey(["student-dashboard-v3", userId, scope, "trend"]));
    keys.push(cacheKey(["student-dashboard-v3", userId, scope, "no-trend"]));
    keys.push(cacheKey(["student-dashboard", userId, scope]));
    keys.push(cacheKey(["weak-topics-v3", userId, scope]));
    keys.push(cacheKey(["weak-topics", userId, scope]));
    keys.push(cacheKey(["library-hub-stats", userId, scope]));
    keys.push(cacheKey(["exam-roadmap", userId, scope]));
    keys.push(cacheKey(["exam-roadmap-v2", userId, scope]));
    keys.push(cacheKey(["exam-roadmap-v4", userId, scope]));
    keys.push(cacheKey(["mastery-dashboard", userId, scope]));
    keys.push(cacheKey(["exam-scoped-stats", userId, scope]));
  }
  if (fieldId) {
    const slug = examSlugFromFieldId(fieldId);
    if (slug) {
      keys.push(cacheKey(["exam-scoped-stats", userId, slug, fieldId]));
      keys.push(cacheKey(["exam-roadmap", userId, slug]));
      keys.push(cacheKey(["exam-roadmap-v2", userId, slug]));
      keys.push(cacheKey(["exam-roadmap-v4", userId, slug]));
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
  await Promise.all(studentReadCacheKeys(userId, fieldId).map((key) => cacheDeleteAsync(key)));
}
