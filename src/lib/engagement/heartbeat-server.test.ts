import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  creditSecondsFromHeartbeat,
  processEngagementHeartbeat,
} from "./heartbeat-server";
import { HEARTBEAT_MAX_CREDIT_SECONDS, HEARTBEAT_MIN_INTERVAL_MS } from "./config";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    studyEngagementHeartbeatMeta: { findUnique: vi.fn(), upsert: vi.fn() },
    studyEngagementDaily: { upsert: vi.fn() },
    $transaction: vi.fn((ops: unknown[]) => Promise.all(ops as Promise<unknown>[])),
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

describe("creditSecondsFromHeartbeat", () => {
  it("caps requested seconds at the policy maximum", () => {
    expect(creditSecondsFromHeartbeat(60)).toBe(HEARTBEAT_MAX_CREDIT_SECONDS);
    expect(creditSecondsFromHeartbeat(20)).toBe(20);
  });
});

describe("processEngagementHeartbeat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ignores heartbeats that arrive too soon", async () => {
    prismaMock.studyEngagementHeartbeatMeta.findUnique.mockResolvedValue({
      userId: "u1",
      lastAcceptedAt: new Date(Date.now() - 5_000),
      ignoredTooFastCount: 0,
    });
    prismaMock.studyEngagementHeartbeatMeta.upsert.mockResolvedValue({});

    const result = await processEngagementHeartbeat("u1", "questions", 30);
    expect(result).toEqual({ accepted: false, reason: "too_fast" });
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
    expect(prismaMock.studyEngagementHeartbeatMeta.upsert).toHaveBeenCalled();
  });

  it("credits time when the interval has elapsed", async () => {
    prismaMock.studyEngagementHeartbeatMeta.findUnique.mockResolvedValue({
      userId: "u1",
      lastAcceptedAt: new Date(Date.now() - HEARTBEAT_MIN_INTERVAL_MS - 1),
      ignoredTooFastCount: 0,
    });
    prismaMock.studyEngagementDaily.upsert.mockResolvedValue({});
    prismaMock.studyEngagementHeartbeatMeta.upsert.mockResolvedValue({});

    const result = await processEngagementHeartbeat("u1", "questions", 30);
    expect(result.accepted).toBe(true);
    if (result.accepted) {
      expect(result.creditedSeconds).toBe(30);
    }
    expect(prismaMock.$transaction).toHaveBeenCalled();
  });
});
