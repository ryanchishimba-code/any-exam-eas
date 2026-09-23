import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  CollapsibleRationale,
  RationaleDisclosureText,
} from "@/components/study/questions/CollapsibleRationale";
import { ExplanationPanel } from "@/components/study/questions/QuestionRenderer";
import { sampleNclexQuestion } from "../../fixtures/questions";

const access = vi.hoisted(() => ({ role: null as string | null }));

vi.mock("@/lib/client/use-user-access", () => ({
  useUserAccess: () => ({
    loading: false,
    hasPremiumAccess: access.role !== "free",
    hasAppAccess: true,
    hasStudyAccess: true,
    hasFreeTierAccess: access.role === "free",
    status: null,
    role: access.role,
  }),
}));

const longExplanation =
  "Airway comes before any other action. Later steps include documentation, calling the provider, and analgesia only after breathing is stable and the client is safe from immediate harm.";

describe("CollapsibleRationale", () => {
  it("exposes a keyboard toggle and keeps expanded state on this item only", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <CollapsibleRationale resetKey="item-a" lead="Airway first.">
        <p>Why the other options fail.</p>
      </CollapsibleRationale>
    );

    const toggle = screen.getByRole("button", { name: "Show more" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle.className).toContain("rounded-full");
    expect(toggle.className).toContain("--study-accent");
    expect(toggle.className).not.toMatch(/indigo|violet|purple/);
    expect(screen.queryByText("Why the other options fail.")).not.toBeInTheDocument();

    const panel = document.getElementById(toggle.getAttribute("aria-controls") ?? "");
    expect(panel).not.toBeNull();

    toggle.focus();
    await user.keyboard("{Enter}");

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Show less" })).toBeInTheDocument();
    expect(screen.getByText("Why the other options fail.")).toBeInTheDocument();

    rerender(
      <CollapsibleRationale resetKey="item-b" lead="Next principle.">
        <p>This item starts collapsed.</p>
      </CollapsibleRationale>
    );

    expect(screen.getByRole("button", { name: "Show more" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("This item starts collapsed.")).not.toBeInTheDocument();
    expect(screen.getByText("Next principle.")).toBeInTheDocument();
  });

  it("leaves a short rationale open with no toggle", () => {
    render(<RationaleDisclosureText text="ABCs take priority in acute assessment." />);
    expect(screen.getByText("ABCs take priority in acute assessment.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Show more" })).not.toBeInTheDocument();
  });

  it("collapses a long plain rationale behind Show more", async () => {
    const user = userEvent.setup();
    render(<RationaleDisclosureText text={longExplanation} resetKey="q1" />);

    expect(screen.getByText("Airway comes before any other action.")).toBeInTheDocument();
    expect(screen.queryByText(/Later steps include documentation/)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Show more" }));
    expect(screen.getByText(/Later steps include documentation/)).toBeInTheDocument();
  });
});

describe("ExplanationPanel", () => {
  it("shows a short check-answer rationale in full", () => {
    access.role = null;
    render(<ExplanationPanel question={sampleNclexQuestion} field="nursing" />);

    expect(screen.getByText("ABCs take priority in acute assessment.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Show more" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "View explanation" })).not.toBeInTheDocument();
  });

  it("keeps the principle visible and hides why-wrong until Show more", async () => {
    access.role = null;
    const user = userEvent.setup();
    const question = {
      ...sampleNclexQuestion,
      explanation: longExplanation,
      explanationDetail: {
        summary: longExplanation,
        whyCorrect: longExplanation,
        keyTakeaways: ["Airway before paperwork."],
      },
      distractorRationale: {
        "Document the assessment":
          "Charting is not the first action while the airway is still unchecked.",
        "Call the physician": "Calling waits until the immediate threat to breathing is handled.",
      },
      references: ["Open RN — priority setting"],
    };

    const { rerender } = render(
      <ExplanationPanel question={question} field="nursing" incorrect />
    );

    expect(screen.getByText("Airway before paperwork.")).toBeInTheDocument();
    expect(screen.queryByText(/Charting is not the first action/)).not.toBeInTheDocument();
    expect(screen.queryByText("Open RN — priority setting")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Show more" }));

    expect(screen.getByText(/Charting is not the first action/)).toBeInTheDocument();
    expect(screen.getByText("Open RN — priority setting")).toBeInTheDocument();
    expect(screen.getByText(/Why each distractor fails/)).toBeInTheDocument();

    rerender(
      <ExplanationPanel
        question={{ ...question, id: "next-item" }}
        field="nursing"
        incorrect
      />
    );
    expect(screen.getByRole("button", { name: "Show more" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText(/Charting is not the first action/)).not.toBeInTheDocument();
  });

  it("does not offer Show more to a free account when the rationale is long", () => {
    access.role = "free";
    render(
      <ExplanationPanel
        question={{
          ...sampleNclexQuestion,
          explanation: longExplanation,
          references: ["Open RN — priority setting"],
        }}
        field="nursing"
      />
    );

    expect(screen.queryByRole("button", { name: "Show more" })).not.toBeInTheDocument();
    expect(screen.getByText(/Upgrade to Pro for rich, detailed explanations/)).toBeInTheDocument();
    expect(screen.queryByText("Open RN — priority setting")).not.toBeInTheDocument();
  });
});
