import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RemediationPanel } from "@/components/dashboard/RemediationPanel";
import type { OpenRemediationSummary } from "@/lib/learning/remediation-loop";

const summary: OpenRemediationSummary = {
  loops: [],
  unscopedCount: 5,
  totalOpen: 41,
  pendingReproof: 8,
  hiddenLoopCount: 0,
};

describe("RemediationPanel", () => {
  it("splits one open total and treats topic-less items as part of that total", () => {
    render(<RemediationPanel examName="NCLEX-RN" fieldId="nursing" summary={summary} />);

    expect(screen.getByRole("heading", { name: "41 open remediations" })).toBeInTheDocument();
    expect(screen.getByText("33 still missed · 8 pending re-proof.")).toBeInTheDocument();
    expect(screen.getByText(/5 open items have no topic id/)).toBeInTheDocument();
  });
});