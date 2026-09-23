import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
}));

import { revalidatePath, revalidateTag } from "next/cache";
import { GET, POST } from "./route";

const URL = "https://www.anyexameasy.com/api/cron/revalidate-inventory";

describe("revalidate-inventory cron auth", () => {
  const previousSecret = process.env.CRON_SECRET;
  const previousVercel = process.env.VERCEL;

  beforeEach(() => {
    vi.mocked(revalidateTag).mockReset();
    vi.mocked(revalidatePath).mockReset();
    process.env.CRON_SECRET = "test-secret";
    process.env.VERCEL = "1";
  });

  afterEach(() => {
    if (previousSecret === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = previousSecret;
    if (previousVercel === undefined) delete process.env.VERCEL;
    else process.env.VERCEL = previousVercel;
  });

  it("rejects a public request that only sends x-vercel-cron", async () => {
    for (const handler of [GET, POST]) {
      const response = await handler(
        new Request(URL, {
          method: handler === POST ? "POST" : "GET",
          headers: { "x-vercel-cron": "1" },
        })
      );
      expect(response.status).toBe(401);
    }
    expect(revalidateTag).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("revalidates for Vercel cron when the bearer secret is present", async () => {
    const response = await POST(
      new Request(URL, {
        method: "POST",
        headers: {
          authorization: "Bearer test-secret",
          "x-vercel-cron": "1",
        },
      })
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({
      ok: true,
      revalidated: true,
      tag: "question-bank-counts",
    });
    expect(revalidateTag).toHaveBeenCalledWith("question-bank-counts");
    expect(revalidatePath).toHaveBeenCalledWith("/nclex");
  });
});
