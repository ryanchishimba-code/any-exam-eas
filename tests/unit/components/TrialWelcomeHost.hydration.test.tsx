import { renderToString } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  useSearchParams: () => new URLSearchParams("welcome=trial"),
}));

vi.mock("@/lib/client/post-login", () => ({
  fetchSubscriptionStatus: vi.fn(),
}));

import { TrialWelcomeHost } from "@/components/auth/TrialWelcomeHost";

describe("TrialWelcomeHost hydration", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it("does not read window or Date.now while rendering", () => {
    window.sessionStorage.setItem(
      "aee_trial_welcome",
      JSON.stringify({ daysRemaining: 1, shownAt: 1 })
    );
    const getItem = vi.spyOn(Storage.prototype, "getItem");
    const now = vi.spyOn(Date, "now");
    const html = renderToString(<TrialWelcomeHost />);
    expect(getItem).not.toHaveBeenCalled();
    expect(now).not.toHaveBeenCalled();
    expect(html).not.toContain("halfway");
    expect(html).not.toContain("of 14");
    getItem.mockRestore();
    now.mockRestore();
  });
});
