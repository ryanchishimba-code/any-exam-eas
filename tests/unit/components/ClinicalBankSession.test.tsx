import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ClinicalBankSession } from "@/components/study/ClinicalBankSession";
import { studentFacingItem, studentFacingUnit, type ServeItem } from "@/lib/assessment/serve";
import type { PilotDocument } from "@/lib/assessment/types";

const pilot = JSON.parse(readFileSync("content/ngn-pilot/pilot-items.json", "utf8")) as PilotDocument;

function serveItem(item: PilotDocument["standalone"][number]): ServeItem {
  return {
    ...item,
    status: "published",
    batchId: pilot.batchId,
    caseVersion: item.caseId ? 1 : null,
  };
}

describe("student NGN session", () => {
  it("shows a standalone bow-tie without the rationale or answer key", () => {
    const bowtie = pilot.standalone.find((item) => item.id === "B01");
    expect(bowtie).toBeTruthy();
    if (!bowtie) return;
    const facing = studentFacingItem(serveItem(bowtie));
    render(
      <ClinicalBankSession
        session={{
          practiceFormat: "ngn",
          field: "nursing",
          fieldId: "nursing",
          subjectId: "__mixed__",
          sourcesById: {},
          caseReferences: {},
          units: [{ kind: "standalone", item: facing, subjectId: null }],
        }}
        onExit={() => undefined}
      />
    );
    expect(screen.getByText(/Complete the diagram/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Check answer" })).toBeInTheDocument();
    expect(screen.getByText("Item 1 of 1")).toBeInTheDocument();
    expect(screen.queryByText(/Naloxone may wear off/)).not.toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/coming soon|placeholder|shortfall/i);
    expect(JSON.stringify(facing.payload)).not.toContain('"keys"');
  });

  it("plays a published case as one unit, in step order, on a narrow screen", async () => {
    const user = userEvent.setup();
    const caseDoc = pilot.cases[0]!;
    const items = caseDoc.items.map((item) => serveItem(item));
    const unit = studentFacingUnit({
      kind: "case",
      subjectId: "management-of-care",
      items,
      caseDoc: {
        ...caseDoc,
        status: "published",
        batchId: pilot.batchId,
        items,
      },
    });
    expect(unit.kind === "case" && unit.items).toHaveLength(6);
    render(
      <ClinicalBankSession
        session={{
          practiceFormat: "case",
          field: "nursing",
          fieldId: "nursing",
          subjectId: "management-of-care",
          sourcesById: {},
          caseReferences: {},
          units: [unit],
        }}
        onExit={() => undefined}
      />
    );
    expect(screen.getByText("Case 1 of 1")).toBeInTheDocument();
    expect(screen.getByText("Case 1 of 1").parentElement).toHaveClass("max-lg:sticky");
    expect(screen.getByRole("button", { name: "Client chart" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Recognize cues/ })).toHaveAttribute("aria-current", "step");
    expect(screen.queryByRole("button", { name: "Submit case" })).not.toBeInTheDocument();
    for (let step = 0; step < 5; step += 1) {
      await user.click(screen.getByRole("button", { name: "Next" }));
    }
    expect(screen.getByRole("button", { name: /Evaluate outcomes/ })).toHaveAttribute("aria-current", "step");
    expect(screen.getByRole("button", { name: "Submit case" })).toBeInTheDocument();
    expect(screen.queryByText(caseDoc.items[0]!.rationale.short)).not.toBeInTheDocument();
  });
});
