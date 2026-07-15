import { describe, expect, it } from "vitest";
import {
  enqueueAnalyticsWrite,
  flushAnalyticsWriteQueue,
  getAnalyticsWriteQueueDepth,
} from "./write-queue";

describe("analytics write queue", () => {
  it("runs tasks serially", async () => {
    const order: number[] = [];
    enqueueAnalyticsWrite(async () => {
      await new Promise((r) => setTimeout(r, 20));
      order.push(1);
    });
    enqueueAnalyticsWrite(async () => {
      order.push(2);
    });
    await flushAnalyticsWriteQueue();
    expect(order).toEqual([1, 2]);
    expect(getAnalyticsWriteQueueDepth()).toBe(0);
  });
});
