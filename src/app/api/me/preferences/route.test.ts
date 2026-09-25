import { beforeEach, describe, expect, it, vi } from "vitest";

const requireSessionGuard = vi.fn();
const findUnique = vi.fn();
const count = vi.fn();
const upsert = vi.fn();

vi.mock("@/lib/session-guard", () => ({
  requireSessionGuard: (...args: unknown[]) => requireSessionGuard(...args),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    userPreference: {
      findUnique: (...args: unknown[]) => findUnique(...args),
      upsert: (...args: unknown[]) => upsert(...args),
    },
    questionAttempt: {
      count: (...args: unknown[]) => count(...args),
    },
  },
}));

import { GET, PATCH } from "./route";

beforeEach(() => {
  vi.clearAllMocks();
  requireSessionGuard.mockResolvedValue({ ok: true, userId: "user_1" });
  upsert.mockResolvedValue({});
});

describe("GET /api/me/preferences tour gate", () => {
  it("is eligible only when the tour is unseen and attempts are zero", async () => {
    findUnique.mockResolvedValue({ metadata: null });
    count.mockResolvedValue(0);
    const res = await GET(new Request("http://localhost/api/me/preferences"));
    const body = await res.json();
    expect(body.eligible).toBe(true);
    expect(body.seen).toBe(false);
    expect(body.attemptCount).toBe(0);
  });

  it("is not eligible for an existing learner with attempts", async () => {
    findUnique.mockResolvedValue({ metadata: null });
    count.mockResolvedValue(12);
    const res = await GET(new Request("http://localhost/api/me/preferences"));
    const body = await res.json();
    expect(body.eligible).toBe(false);
    expect(body.attemptCount).toBe(12);
  });

  it("fails closed when the preference column is missing", async () => {
    findUnique.mockRejectedValue({ code: "P2022", message: "column metadata does not exist" });
    count.mockRejectedValue({ code: "P2022" });
    const res = await GET(new Request("http://localhost/api/me/preferences"));
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.persisted).toBe(false);
    expect(body.eligible).toBe(false);
  });
});

describe("PATCH /api/me/preferences", () => {
  it("persists shown immediately and does not clear other metadata", async () => {
    findUnique.mockResolvedValue({
      metadata: JSON.stringify({ examTestDates: { naplex: "2026-11-02" } }),
    });
    const res = await PATCH(
      new Request("http://localhost/api/me/preferences", {
        method: "PATCH",
        body: JSON.stringify({
          tour: "firstLogin.v1",
          status: "shown",
          step: 0,
          device: "desktop",
        }),
      })
    );
    expect(res.status).toBe(200);
    const saved = JSON.parse(upsert.mock.calls[0][0].create.metadata as string) as {
      examTestDates: { naplex: string };
      tours: { "firstLogin.v1": { status: string } };
    };
    expect(saved.examTestDates.naplex).toBe("2026-11-02");
    expect(saved.tours["firstLogin.v1"].status).toBe("shown");
  });
});
