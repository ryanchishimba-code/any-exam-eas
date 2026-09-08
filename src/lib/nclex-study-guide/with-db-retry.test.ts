import { describe, expect, it, vi } from "vitest";
import { redirect } from "next/navigation";
import { withDbRetry } from "./with-db-retry";

describe("withDbRetry", () => {
  it("returns the value without retrying when the load succeeds", async () => {
    const load = vi.fn(async () => "ok");
    await expect(withDbRetry(load)).resolves.toBe("ok");
    expect(load).toHaveBeenCalledTimes(1);
  });

  it("retries once and succeeds on a transient connection failure", async () => {
    const load = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error("Can't reach database server"))
      .mockResolvedValueOnce("recovered");

    await expect(withDbRetry(load, 0)).resolves.toBe("recovered");
    expect(load).toHaveBeenCalledTimes(2);
  });

  it("gives up after the second failure so the caller can show a fallback", async () => {
    const load = vi.fn(async () => {
      throw new Error("still down");
    });
    await expect(withDbRetry(load, 0)).rejects.toThrow("still down");
    expect(load).toHaveBeenCalledTimes(2);
  });

  // The load closure holds the auth and paywall checks. If a redirect were
  // treated as a transient failure, a signed-out or non-premium visitor whose
  // second attempt succeeded would be served the book.
  it("propagates a redirect immediately instead of retrying it", async () => {
    const load = vi.fn(async () => {
      redirect("/auth/login");
    });

    await expect(withDbRetry(load, 0)).rejects.toThrow();
    expect(load).toHaveBeenCalledTimes(1);
  });

  it("preserves the redirect error so Next still performs the redirect", async () => {
    let captured: unknown;
    try {
      await withDbRetry(async () => redirect("/pricing"), 0);
    } catch (e) {
      captured = e;
    }
    // Next identifies its control-flow throws by digest, not by class.
    expect((captured as { digest?: string })?.digest).toContain("NEXT_REDIRECT");
  });
});
