import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AdaptiveReasoningChip } from "@/components/study/AdaptiveReasoningChip";

describe("AdaptiveReasoningChip", () => {
  it("shows the full open queue beside a capped Review incorrect sitting", () => {
    render(
      <AdaptiveReasoningChip
        reasoning="Open remediation — a single correct does not clear this item."
        sessionRationale="This sitting is 25 of 41 open items."
        questionIndex={0}
        total={25}
        openTotal={41}
      />
    );

    const button = screen.getByRole("button", { name: /Why this question/i });
    expect(button).toHaveTextContent("(1/25)");
    expect(button).toHaveTextContent("41 open");
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("leaves the sitting position alone when it already matches the open queue", () => {
    render(
      <AdaptiveReasoningChip
        reasoning="Queued for today’s focus."
        questionIndex={0}
        total={25}
        openTotal={25}
      />
    );

    const button = screen.getByRole("button", { name: /Why this question/i });
    expect(button).toHaveTextContent("(1/25)");
    expect(button).not.toHaveTextContent("open");
  });
});
