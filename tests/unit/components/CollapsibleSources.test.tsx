import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { HeroNgnFrame } from "@/components/marketing/elevation/HeroNgnFrame";
import { PublicSampleSet } from "@/components/marketing/PublicSampleSet";
import { CollapsibleSources } from "@/components/study/questions/CollapsibleSources";

describe("CollapsibleSources", () => {
  it("starts collapsed, toggles with the keyboard, and resets on the next item", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <CollapsibleSources count={2} resetKey="q1">
        <ul>
          <li>ADA Standards of Care</li>
          <li>FDA labeling</li>
        </ul>
      </CollapsibleSources>
    );

    const toggle = screen.getByRole("button", { name: "Sources (2)" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("ADA Standards of Care")).not.toBeInTheDocument();

    toggle.focus();
    await user.keyboard("{Enter}");
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("ADA Standards of Care")).toBeInTheDocument();
    expect(screen.getByText("FDA labeling")).toBeInTheDocument();

    await user.keyboard(" ");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("FDA labeling")).not.toBeInTheDocument();

    rerender(
      <CollapsibleSources count={1} resetKey="q2">
        <p>Open RN</p>
      </CollapsibleSources>
    );
    expect(screen.getByRole("button", { name: "Sources (1)" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Open RN")).not.toBeInTheDocument();
  });
});

describe("sources under a question", () => {
  it("collapses public sample citations until the toggle", async () => {
    const user = userEvent.setup();
    render(
      <PublicSampleSet
        items={[
          {
            id: "sample-1",
            fieldId: "nursing",
            examLabel: "NCLEX",
            stem: "Which action is first?",
            options: ["Document the assessment", "Assess airway"],
            correct: "Assess airway",
            rationale: "Airway comes first.",
            sources: ["NCSBN NCLEX-RN Test Plan", "Open RN"],
          },
        ]}
      />
    );

    await user.click(screen.getByRole("button", { name: /Assess airway/ }));
    await user.click(screen.getByRole("button", { name: "Check answer" }));

    const sources = screen.getByRole("button", { name: "Sources (2)" });
    expect(sources).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("NCSBN NCLEX-RN Test Plan")).not.toBeInTheDocument();

    await user.click(sources);
    expect(screen.getByText("NCSBN NCLEX-RN Test Plan")).toBeInTheDocument();
    expect(screen.getByText("Open RN")).toBeInTheDocument();
  });

  it("collapses hero case citations until the toggle", async () => {
    const user = userEvent.setup();
    render(
      <HeroNgnFrame
        frame={{
          itemId: "C01-S1",
          stem: "Which finding is first?",
          exhibitTitle: null,
          exhibitText: null,
          columns: [{ label: "Actions", options: [{ text: "Assess airway", keyed: true }] }],
          rationale: "Airway comes first.",
          sources: [
            { title: "NCSBN 2026 NCLEX-RN Test Plan", locator: "pp. 7-8" },
            { title: "MedlinePlus", locator: null },
          ],
        }}
      />
    );

    const sources = screen.getByRole("button", { name: "Sources (2)" });
    expect(sources).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText(/NCSBN 2026 NCLEX-RN Test Plan/)).not.toBeInTheDocument();

    await user.click(sources);
    expect(screen.getByText(/Source: NCSBN 2026 NCLEX-RN Test Plan — pp\. 7-8/)).toBeInTheDocument();
    expect(screen.getByText("Source: MedlinePlus")).toBeInTheDocument();
  });
});
