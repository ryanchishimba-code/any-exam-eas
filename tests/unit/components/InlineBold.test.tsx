import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CaseStudyPlayer } from "@/components/ngn/CaseStudyPlayer";
import { DropdownCloze } from "@/components/ngn/items/DropdownItems";
import type { NgnCase, NgnItem } from "@/lib/assessment/types";

const item: NgnItem = {
  id: "step-1",
  version: 1,
  itemType: "case_item",
  caseId: "case-1",
  caseStep: 1,
  cjmmFunction: "recognize_cues",
  timepoint: "t0",
  responseFormat: "mc_single",
  scoringRule: "zero_one",
  maxPoints: 1,
  stem: "Which action is the **PRIORITY**? <script>alert(1)</script>",
  payload: {
    options: [
      { id: "a", text: "The **BEST** response" },
      { id: "b", text: "Wait and reassess" },
    ],
  },
  rationale: {
    short: "",
    expanded: { perOption: {}, cjmmCoaching: "", pointsLost: "", takeaway: "" },
  },
  clientNeeds: {},
  references: [],
  rnFlags: [],
};

const caseDoc: NgnCase = {
  id: "case-1",
  version: 1,
  title: "Morning admission",
  boardProfile: "nclex-rn",
  primaryClientNeed: "physiological",
  setting: "med-surg",
  patient: { displayName: "Client A", age: 70, sex: "female", weightKg: 68, allergies: "NKDA" },
  timepoints: [{ id: "t0", label: "0800" }],
  chart: {
    tabs: [
      {
        id: "notes",
        label: "Notes",
        entries: [{ time: "t0", text: "Report **PRIORITY** pain and <b>do not</b> delay." }],
      },
    ],
  },
  revealRule: "sequential",
  references: [],
  items: [item],
};

describe("student NGN bold text", () => {
  it("bolds stems, options, and chart notes without parsing HTML", async () => {
    const user = userEvent.setup();
    const { container } = render(<CaseStudyPlayer caseDoc={caseDoc} mode="exam" />);

    expect(
      screen.getByRole("heading", { name: "Which action is the PRIORITY? <script>alert(1)</script>" })
    ).toBeInTheDocument();
    expect(screen.getByText("PRIORITY").tagName).toBe("STRONG");
    expect(screen.getByText("BEST").tagName).toBe("STRONG");
    expect(screen.getByRole("radio", { name: "The BEST response" })).toBeInTheDocument();
    expect(container.querySelector("script")).toBeNull();
    expect(container.textContent).toContain("<script>alert(1)</script>");

    if (!screen.queryByText(/Report/)) {
      await user.click(screen.getByRole("button", { name: "Client chart" }));
    }
    expect(screen.getByText(/Report/)).toHaveTextContent("Report PRIORITY pain and <b>do not</b> delay.");
    expect(screen.getAllByText("PRIORITY").every((node) => node.tagName === "STRONG")).toBe(true);
    expect(document.querySelector("b")).toBeNull();
    expect(document.querySelector("script")).toBeNull();
  });

  it("bolds cloze wording and strips markers inside a native option", () => {
    render(
      <DropdownCloze
        template="The **PRIORITY** finding is {{d1}}."
        dropdowns={[{ id: "d1", options: [{ id: "a", text: "**hypokalemia**" }] }]}
        format="dropdown_cloze"
        seed="seed"
        value={{}}
        onChange={() => undefined}
      />
    );
    expect(screen.getByText("PRIORITY").tagName).toBe("STRONG");
    expect(screen.getByRole("option", { name: "hypokalemia" }).textContent).toBe("hypokalemia");
    expect(screen.getByText("PRIORITY").closest("p")?.textContent).toContain("The PRIORITY finding is");
  });
});
