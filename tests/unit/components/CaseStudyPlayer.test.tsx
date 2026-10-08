import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CaseStudyPlayer } from "@/components/ngn/CaseStudyPlayer";
import { MatrixMC } from "@/components/ngn/items/MatrixItems";
import type { NgnCase, NgnItem } from "@/lib/assessment/types";

const STEP_NAME = /Recognize cues|Analyze cues|Prioritize hypotheses|Generate solutions|Take action|Evaluate outcomes/;
const HISTORY = "Hypertension; open colectomy 2 days ago.";

function item(partial: Partial<NgnItem> & Pick<NgnItem, "id" | "caseStep" | "responseFormat" | "stem" | "payload">): NgnItem {
  return {
    version: 1,
    itemType: "case_item",
    caseId: "case-1",
    cjmmFunction: "prioritize_hypotheses",
    timepoint: "t0",
    scoringRule: "zero_one",
    maxPoints: 1,
    rationale: { short: "", expanded: { perOption: {}, cjmmCoaching: "", pointsLost: "", takeaway: "" } },
    clientNeeds: {},
    references: [],
    rnFlags: [],
    ...partial,
  };
}

const caseDoc: NgnCase = {
  id: "case-1",
  version: 1,
  title: "Night-time confusion",
  boardProfile: "nclex-rn",
  primaryClientNeed: "physiological",
  setting: "med-surg",
  patient: {
    displayName: "Client A",
    age: 70,
    sex: "female",
    weightKg: 68,
    allergies: "NKDA",
    history: HISTORY,
  },
  timepoints: [{ id: "t0", label: "0800" }],
  chart: {
    tabs: [{ id: "notes", label: "Nurses' Notes", entries: [{ time: "t0", text: "0700: Pain 7/10." }] }],
  },
  revealRule: "sequential",
  references: [],
  items: [
    item({
      id: "step-3",
      caseStep: 3,
      responseFormat: "matrix_mc",
      stem: "Which tasks come first?",
      payload: {
        rowHeader: "Task",
        columns: [
          { id: "now", label: "Do now" },
          { id: "later", label: "Do later" },
        ],
        rows: [{ id: "r1", text: "Give the medication", key: "now" }],
      },
    }),
    item({
      id: "step-4",
      caseStep: 4,
      responseFormat: "mc_single",
      stem: "What is the next check?",
      payload: {
        options: [
          { id: "a", text: "Recheck the pain" },
          { id: "b", text: "Leave the room" },
        ],
      },
    }),
  ],
};

describe("student case chrome", () => {
  it("uses Question n of n, hides step names and the case title, and keeps history on a chart tab", async () => {
    const user = userEvent.setup();
    render(<CaseStudyPlayer caseDoc={caseDoc} mode="exam" />);

    expect(screen.getByText(/Question 1 of 2/)).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Task" })).toBeInTheDocument();
    expect(screen.queryByRole("columnheader", { name: "Finding" })).not.toBeInTheDocument();
    expect(screen.queryByText(STEP_NAME)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /3 Prioritize hypotheses/ })).not.toBeInTheDocument();
    expect(screen.queryByText(caseDoc.title)).not.toBeInTheDocument();
    expect(screen.queryByText(HISTORY)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Client chart" }));
    await user.click(screen.getByRole("tab", { name: "History" }));
    expect(screen.getByText(HISTORY)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText(/Question 2 of 2/)).toBeInTheDocument();
    expect(screen.queryByText(STEP_NAME)).not.toBeInTheDocument();
  });

  it("keeps step numbers and names on the internal review tabs", () => {
    render(<CaseStudyPlayer caseDoc={caseDoc} mode="review" showStepNames />);
    expect(screen.getByRole("button", { name: "3 Prioritize hypotheses" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "4 Generate solutions" })).toBeInTheDocument();
  });

  it("falls back to Finding when a matrix does not name its row header", () => {
    render(
      <MatrixMC
        name="plain"
        columns={[
          { id: "a", label: "Yes" },
          { id: "b", label: "No" },
        ]}
        rows={[{ id: "r1", text: "Lactate 3.1" }]}
        value={{}}
        onChange={() => undefined}
      />
    );
    expect(screen.getByRole("columnheader", { name: "Finding" })).toBeInTheDocument();
  });
});
