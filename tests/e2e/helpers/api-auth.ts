import type { APIRequestContext } from "@playwright/test";

const RETRYABLE_STATUSES = new Set([404, 502, 503]);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loginViaApi(
  request: APIRequestContext,
  baseURL: string,
  email: string,
  password: string
): Promise<void> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      await request.get(`${baseURL}/api/auth/session`).catch(() => {});

      const csrfRes = await request.get(`${baseURL}/api/auth/csrf`);
      if (!csrfRes.ok()) {
        throw new Error(`CSRF fetch failed: ${csrfRes.status()}`);
      }

      const { csrfToken } = (await csrfRes.json()) as { csrfToken?: string };
      if (!csrfToken) {
        throw new Error("CSRF token missing from /api/auth/csrf");
      }

      const loginRes = await request.post(`${baseURL}/api/auth/callback/credentials`, {
        form: {
          csrfToken,
          email,
          password,
          callbackUrl: `${baseURL}/dashboard`,
          json: "true",
        },
      });

      const status = loginRes.status();
      if (status >= 400) {
        const body = await loginRes.text();
        if (RETRYABLE_STATUSES.has(status) && attempt < 5) {
          await sleep(1500 * (attempt + 1));
          continue;
        }
        throw new Error(`Credentials login failed: ${status} ${body.slice(0, 200)}`);
      }

      const sessionRes = await request.get(`${baseURL}/api/auth/session`);
      if (!sessionRes.ok()) {
        throw new Error(`Session fetch failed: ${sessionRes.status()}`);
      }

      const session = (await sessionRes.json()) as { user?: { email?: string } };
      if (!session?.user?.email) {
        if (attempt < 5) {
          await sleep(1500 * (attempt + 1));
          continue;
        }
        throw new Error("Session missing after API login");
      }

      return;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < 5) {
        await sleep(1500 * (attempt + 1));
        continue;
      }
      throw lastError;
    }
  }

  throw lastError ?? new Error("API login failed");
}
