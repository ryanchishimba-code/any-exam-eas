/** Client budget for POST /api/full-exam/start. The server stops gathering at 25s. */
export const FULL_EXAM_START_TIMEOUT_MS = 40_000;

export const FULL_EXAM_START_TIMEOUT_MESSAGE = "Taking too long, try again";

function isAbortError(error: unknown): boolean {
  return Boolean(error && typeof error === "object" && "name" in error && error.name === "AbortError");
}

/** POST /api/full-exam/start and abort if it is still pending after the timeout. */
export async function fetchFullExamStart(
  body: unknown,
  timeoutMs = FULL_EXAM_START_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch("/api/full-exam/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error) {
    if (isAbortError(error)) throw new Error(FULL_EXAM_START_TIMEOUT_MESSAGE);
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
