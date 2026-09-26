import { readFileSync } from "node:fs";
import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CaseStudyPlayer } from "@/components/ngn/CaseStudyPlayer";
import { BowTie, emptyBowTie, type BowTieValue } from "@/components/ngn/items/BowTie";
import { SelectN } from "@/components/ngn/items/ChoiceItems";
import type { NgnCase, NgnOption, PilotDocument } from "@/lib/assessment/types";

const pilot = JSON.parse(readFileSync("content/ngn-pilot/pilot-items.json", "utf8")) as PilotDocument;
const caseDoc = pilot.cases[0] as NgnCase;
const bowtie = pilot.standalone.find((item) => item.id === "B01");

async function openChart(user: ReturnType<typeof userEvent.setup>) {
  const button = screen.queryByRole("button", { name: "Client chart" });
  if (button) await user.click(button);
}

describe("NGN case player", () => {
  it("hides later chart timepoints until the student reaches them", async () => {
    const user = userEvent.setup();
    render(<CaseStudyPlayer caseDoc={caseDoc} mode="review" attemptSeed="test" />);
    await openChart(user);
    expect(screen.queryByText(/2,500 mL lactated Ringer/)).not.toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Orders" }));
    expect(screen.getByText(/Enoxaparin 40 mg/)).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Laboratory Results" }));
    expect(screen.queryByRole("columnheader", { name: "T2 0945" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Evaluate outcomes/ }));
    await openChart(user);
    await user.click(screen.getByRole("tab", { name: "Nurses' Notes" }));
    expect(screen.getByText(/2,500 mL lactated Ringer/)).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Laboratory Results" }));
    expect(screen.getByRole("columnheader", { name: "T2 0945" })).toBeInTheDocument();
  });

  it("does not allow going back in exam mode", async () => {
    const user = userEvent.setup();
    render(<CaseStudyPlayer caseDoc={caseDoc} mode="exam" attemptSeed="exam" />);
    const later = screen.getByRole("button", { name: /Analyze cues/ });
    expect(later).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("button", { name: /Recognize cues/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Analyze cues/ })).toHaveAttribute("aria-current", "step");
  });

  it("selects highlight tokens and reveals the rationale", async () => {
    const user = userEvent.setup();
    render(<CaseStudyPlayer caseDoc={caseDoc} mode="review" attemptSeed="rationale" />);
    const token = screen.getByRole("button", { name: "38.6 °C" });
    await user.click(token);
    expect(token).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByRole("button", { name: "Show rationale" }));
    expect(screen.getByText(/Fever, tachycardia/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Show more" }));
    expect(screen.getByText(/Points: earned/)).toBeInTheDocument();
    expect(screen.getByText(/Takeaway/)).toBeInTheDocument();
  });

  it("stops select-N at N", async () => {
    const user = userEvent.setup();
    const options: NgnOption[] = [
      { id: "a", text: "Decline to witness" },
      { id: "b", text: "Notify the surgeon" },
      { id: "c", text: "Ask the husband to sign" },
      { id: "d", text: "Explain the risks yourself" },
    ];
    function Harness() {
      const [selected, setSelected] = useState<string[]>([]);
      return <SelectN options={options} n={2} seed="select-n" selected={selected} onChange={setSelected} />;
    }
    render(<Harness />);
    const boxes = screen.getAllByRole("checkbox");
    await user.click(boxes[0] as HTMLInputElement);
    await user.click(boxes[1] as HTMLInputElement);
    expect(boxes[2]).toBeDisabled();
    expect(boxes[3]).toBeDisabled();
    expect(screen.getByText(/2 of 2 selected/)).toBeInTheDocument();
  });

  it("places a bow-tie token from the keyboard path", async () => {
    const user = userEvent.setup();
    if (!bowtie) throw new Error("missing B01");
    const block = (key: "condition" | "actions" | "monitor") =>
      (bowtie.payload[key] as { options: NgnOption[] }).options;
    function Harness() {
      const [value, setValue] = useState<BowTieValue>(emptyBowTie());
      return (
        <BowTie
          condition={block("condition")}
          actions={block("actions")}
          monitor={block("monitor")}
          seed="bow"
          value={value}
          onChange={setValue}
        />
      );
    }
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Stop the PCA infusion" }));
    const slot = screen.getByTestId("bowtie-slot-actions-0");
    await user.click(slot.querySelector("button") as HTMLButtonElement);
    expect(slot).toHaveTextContent("Stop the PCA infusion");
  });
});
