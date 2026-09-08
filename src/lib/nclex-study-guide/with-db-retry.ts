import { unstable_rethrow } from "next/navigation";

/**
 * Run a database-backed page load, retrying once on failure.
 *
 * Neon scales to zero, so the first connection after an idle period — or right
 * after a deploy, when every serverless instance is cold — can time out. The
 * study guide pages make five sequential round trips, and any one of them
 * failing replaces the whole book with an error screen. One retry turns that
 * cold start into a marginally slower render instead.
 *
 * `unstable_rethrow` runs before the retry so Next's control-flow throws
 * (`redirect`, `notFound`) pass straight through. Without it, the login and
 * paywall redirects would be treated as failures and retried — which would hand
 * the book to a signed-out visitor if the second attempt happened to succeed.
 */
export async function withDbRetry<T>(load: () => Promise<T>, retryDelayMs = 250): Promise<T> {
  try {
    return await load();
  } catch (e) {
    unstable_rethrow(e);
    console.warn("[nclex/study-guide] load failed, retrying once", e);
    await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
    return load();
  }
}
