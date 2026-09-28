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

    expect(screen.queryByText("Client Needs")).not.toBeInTheDocument();
    const topic = screen.getByRole("option", { name: /Management of Care/ });
    expect(topic).toHaveTextContent("Untouched");
    expect(topic).toHaveTextContent("1,204");
    fireEvent.click(topic);
    expect(onSubjectChange).toHaveBeenCalledWith("management-of-care");
    expect(screen.queryByText("Weak")).toBeNull();
    expect(document.body.textContent).not.toMatch(/you will pass/i);
  });

  it("keeps a broader blueprint area off the single topic it is named after", () => {
    const onSubjectChange = vi.fn();
    const onBlueprintAreaSelect = vi.fn();
    render(
      <QuestionBankSetup
        fieldId="aanp-fnp"
        subjects={[
          { id: "assess", label: "Assess" },
          { id: "pediatrics", label: "Pediatrics" },
        ]}
        subjectId="__mixed__"
        subjectCounts={{ assess: 10, pediatrics: 696, geriatrics: 596, "womens-health": 585 }}
        onSubjectChange={onSubjectChange}
        questionCount={25}
        onQuestionCountChange={vi.fn()}
        pace="untimed"
        onPaceChange={vi.fn()}
        bankStyle="standard"
        onBankStyleChange={vi.fn()}
        coverageChips={[
          {
            kind: "untouched",
            domainId: "assess",
            label: "Assess",
            subjectId: "assess",
            blueprintWeightPct: 32,
            available: 1887,
            bankCoveragePct: 0,
          },
        ]}
        coverageLabel="Blueprint topics"
        coverageLoaded
        blueprintAreaId="assess"
        onBlueprintAreaSelect={onBlueprintAreaSelect}
        onPracticeFormatChange={vi.fn()}
        formats={{ mcq: 6000, ngn: 100, case: 5 }}
        ngnLabel="NGN-style"
      />
    );

    expect(screen.queryByRole("button", { name: /1,887 in this area/ })).not.toBeInTheDocument();
    expect(onBlueprintAreaSelect).not.toHaveBeenCalled();
    expect(onSubjectChange).not.toHaveBeenCalled();
    expect(screen.queryByRole("radio", { name: /NGN-style/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/Blueprint chips count every active question/)).not.toBeInTheDocument();
  });
});
