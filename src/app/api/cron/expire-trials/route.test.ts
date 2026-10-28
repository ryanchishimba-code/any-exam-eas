import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  subscription: {
    updateMany: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("@/lib/neon-warmup", () => ({
  warmNeonCompute: vi.fn().mockResolvedValue({ ok: true, ms: 1 }),
}));

import { warmNeonCompute } from "@/lib/neon-warmup";
import { GET } from "./route";

const URL = "https://www.anyexameasy.com/api/cron/expire-trials";

describe("expire-trials cron", () => {
  const previousSecret = process.env.CRON_SECRET;

  beforeEach(() => {
    prismaMock.subscription.updateMany.mockReset();
    prismaMock.subscription.updateMany.mockResolvedValue({ count: 4 });
    vi.mocked(warmNeonCompute).mockClear();
    process.env.CRON_SECRET = "test-secret";
  });

  afterEach(() => {
    if (previousSecret === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = previousSecret;
  });

  it("returns 401 and does not write when the bearer secret is missing", async () => {
    const response = await GET(
      new Request(URL, { headers: { "x-vercel-cron": "1" } })
    );
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Unauthorized" });
    expect(prismaMock.subscription.updateMany).not.toHaveBeenCalled();
    expect(warmNeonCompute).not.toHaveBeenCalled();
  });

  it("expires matching rows when the bearer secret matches", async () => {
    const response = await GET(
      new Request(URL, { headers: { authorization: "Bearer test-secret" } })
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, expired: 4 });
    expect(warmNeonCompute).toHaveBeenCalledWith("cron.expire-trials");
    expect(prismaMock.subscription.updateMany).toHaveBeenCalledTimes(1);
    const call = prismaMock.subscription.updateMany.mock.calls[0]?.[0];
    expect(call.data).toEqual({ status: "trial_expired" });
    expect(call.where.status).toBe("trialing");
    expect(call.where.stripeSubscriptionId).toBeNull();
  });
});
