import { beforeEach, describe, expect, it, vi } from "vitest";

const requireAuthenticatedApi = vi.hoisted(() => vi.fn());
const listQuickBiteProgressForUser = vi.hoisted(() => vi.fn());
const canPlayQuickBites = vi.hoisted(() => vi.fn());

vi.mock("@/lib/api-access", () => ({ requireAuthenticatedApi }));
vi.mock("@/lib/quick-bites/progress-server", () => ({
  listQuickBiteProgressForUser,
  upsertQuickBiteProgress: vi.fn(),
}));
vi.mock("@/lib/quick-bites/access", () => ({ canPlayQuickBites }));

import { GET } from "./route";

describe("GET /api/quick-bites-fnp/progress", () => {
  beforeEach(() => {
    requireAuthenticatedApi.mockReset();
    listQuickBiteProgressForUser.mockReset();
    canPlayQuickBites.mockReset();
  });

  it("returns saved progress for paid members", async () => {
    requireAuthenticatedApi.mockResolvedValue({
      ok: true,
      userId: "user-1",
      access: { role: "subscriber" },
    });
    canPlayQuickBites.mockReturnValue(true);
    listQuickBiteProgressForUser.mockResolvedValue({
      "quick-bites-fnp-ep01-screening": {
        watchPct: 42,
        watchSeconds: 90,
        completedAt: null,
      },
    });

    const response = await GET(new Request("http://localhost/api/quick-bites-fnp/progress"));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.progress["quick-bites-fnp-ep01-screening"].watchPct).toBe(42);
    expect(listQuickBiteProgressForUser).toHaveBeenCalled();
  });
});
