export type CompleteExamPayload = {
  complete: true;
  endedEarly?: boolean;
  score?: number;
  answers: unknown[];
  weakAreas?: unknown[];
  analysis: Record<string, unknown>;
};

export type CompleteExamResponse = {
  ok?: boolean;
  alreadyCompleted?: boolean;
  score?: number;
  error?: string;
};

/** Idempotent PATCH complete with short retries on transient failures. */
export async function patchCompleteExamSession(
  sessionId: string,
  payload: CompleteExamPayload,
  opts?: { attempts?: number }
): Promise<CompleteExamResponse> {
  const attempts = opts?.attempts ?? 3;
  let lastError = "Could not submit exam";

  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(`/api/exam-sessions/${sessionId}/answer`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as CompleteExamResponse & {
        error?: string;
      };
      if (res.ok) return data;
      if (res.status === 404) {
        lastError = data.error ?? "Session not found";
        break;
      }
      lastError = data.error ?? lastError;
      if (res.status >= 400 && res.status < 500 && res.status !== 408 && res.status !== 429) {
        break;
      }
    } catch (e) {
      lastError = e instanceof Error ? e.message : lastError;
    }
    if (i < attempts - 1) {
      await new Promise((r) => setTimeout(r, 400 * (i + 1)));
    }
  }

  throw new Error(lastError);
}
