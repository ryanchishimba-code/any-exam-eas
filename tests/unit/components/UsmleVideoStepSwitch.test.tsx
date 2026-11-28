import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UsmleVideoQuickBites } from "@/components/quick-bites/UsmleVideoQuickBites";
import { USMLE_VIDEO_STEP_STORAGE_KEY } from "@/lib/quick-bites/usmle-video-catalog";

const replace = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, push: vi.fn(), prefetch: vi.fn() }),
}));

describe("USMLE video step switch", () => {
  beforeEach(() => {
    replace.mockReset();
    window.localStorage.clear();
    HTMLElement.prototype.scrollIntoView = () => {};
  });

  it("filters episodes, badges the step, and shows Coming soon", async () => {
    const user = userEvent.setup();
    render(
      <UsmleVideoQuickBites
        initialQuery={null}
        canPlay
        upgradeHref="/checkout"
        upgradeLabel="Upgrade to watch"
      />
    );

    expect(screen.getByRole("tab", { name: "Step 1" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Acid-Base, Potassium, and the Tubule")).toBeInTheDocument();
    expect(screen.queryByText("Minutes in the Head")).not.toBeInTheDocument();
    expect(screen.getAllByText("Step 1").length).toBeGreaterThan(1);

    await user.click(screen.getByRole("tab", { name: "Step 2 CK" }));
    expect(screen.getByText("Minutes in the Head")).toBeInTheDocument();
    expect(screen.getByText("The Clock in the Chest, and a Rhythm That Clots")).toBeInTheDocument();
    expect(screen.queryByText("Acid-Base, Potassium, and the Tubule")).not.toBeInTheDocument();
    expect(replace).toHaveBeenCalledWith("/usmle/quick-bites?step=2ck", { scroll: false });
    expect(window.localStorage.getItem(USMLE_VIDEO_STEP_STORAGE_KEY)).toBe("step-2-ck");

    await user.click(screen.getByRole("tab", { name: "Step 3" }));
    expect(screen.getByText("Do Not Wait Until Morning")).toBeInTheDocument();
    expect(screen.getByText("Screens You Order — and When You Stop")).toBeInTheDocument();
    expect(screen.queryByText("Coming soon")).not.toBeInTheDocument();
    expect(screen.getByText("The Abstract, and the Advertisement")).toBeInTheDocument();
    expect(screen.queryByText("A Fever Too Young to Send Home")).not.toBeInTheDocument();
    expect(screen.queryByText("Minutes in the Head")).not.toBeInTheDocument();
  });

  it("restores the last step when the url has no query", async () => {
    window.localStorage.setItem(USMLE_VIDEO_STEP_STORAGE_KEY, "step-2-ck");
    render(
      <UsmleVideoQuickBites
        initialQuery={null}
        canPlay
        upgradeHref="/checkout"
        upgradeLabel="Upgrade to watch"
      />
    );
    await waitFor(() => {
      expect(screen.getByRole("tab", { name: "Step 2 CK" })).toHaveAttribute("aria-selected", "true");
    });
    expect(screen.getByText("Minutes in the Head")).toBeInTheDocument();
  });

  it("shows wave 4 on the student list", async () => {
    const user = userEvent.setup();
    render(
      <UsmleVideoQuickBites
        initialQuery="2ck"
        canPlay
        upgradeHref="/checkout"
        upgradeLabel="Upgrade to watch"
      />
    );
    expect(screen.getByText("A Fever Too Young to Send Home")).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Step 1" }));
    expect(screen.queryByText("A Fever Too Young to Send Home")).not.toBeInTheDocument();
  });
});
