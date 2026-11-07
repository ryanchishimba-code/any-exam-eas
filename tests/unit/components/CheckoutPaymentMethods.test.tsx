import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EmbeddedStripeCheckout } from "@/components/EmbeddedStripeCheckout";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("plan=subscribe&interval=monthly&tier=pro"),
  useRouter: () => ({ replace: vi.fn() }),
}));

describe("checkout payment methods", () => {
  it("shows the accepted-method list once", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes("/api/stripe/config")) {
          return {
            ok: true,
            json: async () => ({
              configured: true,
              allIntervalsConfigured: true,
              oneTimePaymentsAvailable: false,
              missing: [],
            }),
          };
        }
        return { ok: true, json: async () => ({}) };
      })
    );

    render(<EmbeddedStripeCheckout />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /upgrade now/i })).toBeInTheDocument();
    });

    expect(screen.getAllByRole("list", { name: /accepted payment methods/i })).toHaveLength(1);
    expect(screen.getAllByText(/card, apple pay, or google pay/i)).toHaveLength(1);
  });
});
