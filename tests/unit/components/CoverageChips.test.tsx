import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QuestionBankSetup } from "@/components/study/QuestionBankSetup";
import type { CoverageChip } from "@/lib/learning/coverage-heatmap";

const chip: CoverageChip = {
  kind: "untouched",
  domainId: "management-of-care",
  label: "Management of Care",
  subjectId: "management-of-care",
  blueprintWeightPct: 18,
  available: 1204,
  bankCoveragePct: 0,
};

describe("Question bank coverage chips", () => {
  it("selects the untouched domain and marks that topic", () => {
    const onSubjectChange = vi.fn();
    render(
      <QuestionBankSetup
        subjects={[
          { id: "management-of-care", label: "Management of Care" },
          { id: "pharmacology-nursing", label: "Pharmacological Therapies" },
        ]}
        subjectId="pharmacology-nursing"
        subjectCounts={{ "management-of-care": 1204, "pharmacology-nursing": 880 }}
        onSubjectChange={onSubjectChange}
        questionCount={25}
        onQuestionCountChange={vi.fn()}
        pace="untimed"
        onPaceChange={vi.fn()}
        bankStyle="standard"
        onBankStyleChange={vi.fn()}
        coverageChips={[chip]}
        coverageLabel="Client Needs"
        coverageLoaded
        weakSubjectIds={["pharmacology-nursing"]}
      />
    );

    expect(screen.getByText("Client Needs")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Untouched · Management of Care · 1,204/ }));
    expect(onSubjectChange).toHaveBeenCalledWith("management-of-care");
    expect(screen.queryByText("Weak")).toBeNull();
    expect(document.body.textContent).not.toMatch(/you will pass/i);
  });
});
