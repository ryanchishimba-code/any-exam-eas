import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { PaymentModeToggle } from "@/components/pricing/PaymentModeToggle";
import type { PaymentMode } from "@/lib/billing-payment-mode";

function Harness({ initial = "auto" as PaymentMode }) {
  const [mode, setMode] = useState<PaymentMode>(initial);
  return <PaymentModeToggle value={mode} onChange={setMode} interval="monthly" />;
}

describe("PaymentModeToggle", () => {
  it("exposes both choices as a single radiogroup", () => {
    render(<PaymentModeToggle value="auto" onChange={vi.fn()} interval="monthly" />);

    const group = screen.getByRole("radiogroup", { name: /payment method/i });
    expect(group).toBeInTheDocument();

    const autoPay = screen.getByRole("radio", { name: /auto-pay/i });
    const payOnce = screen.getByRole("radio", { name: /pay once/i });
    expect(autoPay).toHaveAttribute("aria-checked", "true");
    expect(payOnce).toHaveAttribute("aria-checked", "false");
  });

  it("keeps only the selected option in the tab order", () => {
    render(<PaymentModeToggle value="manual" onChange={vi.fn()} interval="monthly" />);

    expect(screen.getByRole("radio", { name: /pay once/i })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("radio", { name: /auto-pay/i })).toHaveAttribute("tabindex", "-1");
  });

  it("switches the description when the user picks pay once", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    expect(screen.getByText(/renews automatically/i)).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: /pay once/i }));

    expect(screen.getByText(/no automatic renewal/i)).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /pay once/i })).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });

  it("moves selection with arrow keys", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.tab();
    expect(screen.getByRole("radio", { name: /auto-pay/i })).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: /pay once/i })).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });

  it("shows the same price for both modes", () => {
    render(<PaymentModeToggle value="auto" onChange={vi.fn()} interval="monthly" />);

    expect(screen.getByRole("radio", { name: /auto-pay/i })).toHaveTextContent("$27.99");
    expect(screen.getByRole("radio", { name: /pay once/i })).toHaveTextContent("$27.99");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <PaymentModeToggle value="auto" onChange={vi.fn()} interval="yearly" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
