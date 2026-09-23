import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PhoneFold } from "@/components/study/PhoneFold";

describe("PhoneFold", () => {
  it("starts collapsed on the phone disclosure and can be expanded", async () => {
    const user = userEvent.setup();
    render(
      <PhoneFold summary="Session details">
        <p>Unanswered</p>
        <p>Mode</p>
      </PhoneFold>
    );

    const toggle = screen.getByRole("button", { name: "Session details" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("checkbox")).toBeNull();

    const panel = document.getElementById(toggle.getAttribute("aria-controls") ?? "");
    expect(panel).not.toBeNull();
    expect(panel).toHaveAttribute("data-phone-fold", "closed");
    expect(panel?.className).toContain("hidden");
    expect(panel?.className).toContain("sm:block");
    expect(panel?.className).not.toContain("peer-checked:block");

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(panel).toHaveAttribute("data-phone-fold", "open");
    expect(panel?.className).toContain("block");
    expect(panel?.className).not.toMatch(/(?:^|\s)hidden(?:\s|$)/);
  });
});
