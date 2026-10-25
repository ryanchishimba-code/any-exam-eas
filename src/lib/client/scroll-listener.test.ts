/** @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi } from "vitest";
import { addPassiveScrollListener, rafThrottle } from "@/lib/client/scroll-listener";

describe("scroll-listener", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("rafThrottle schedules a single animation frame", () => {
    const fn = vi.fn();
    const throttled = rafThrottle(fn);
    throttled();
    throttled();
    expect(fn).not.toHaveBeenCalled();
  });

  it("addPassiveScrollListener registers passive scroll", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    const remove = addPassiveScrollListener(window, () => {});
    expect(addSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
      expect.objectContaining({ passive: true })
    );
    remove();
  });
});
