import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { UsmleQuickBitesLibrary } from "@/components/quick-bites/UsmleQuickBitesLibrary";
import type { UsmleQuickBite } from "@/lib/quick-bites/usmle-bites";

function bite(partial: Partial<UsmleQuickBite> & Pick<UsmleQuickBite, "id" | "title" | "lead">): UsmleQuickBite {
  return {
    step: "step-1",
    number: 1,
    system: "cardiovascular",
    group: "Cardiovascular",
    read: "1 min",
    open: false,
    lines: ["First line.", "Second line.", "Third line."],
    miss: "The usual wrong move.",
    diagram: null,
    diagramAlt: null,
    source: {
      name: "Example source",
      year: "2026",
      url: "https://example.com/source",
      says: "The source supports the lead.",
    },
    ...partial,
  };
}

const bites = [
  bite({ id: "a", number: 1, title: "First bite", lead: "The first decision.", open: true }),
  bite({
    id: "b",
    number: 2,
    title: "Second bite",
    lead: "The second decision.",
    group: "Cardiovascular",
  }),
];

describe("USMLE Quick Bites library", () => {
  it("shows the preview banner and reads the selected bite", async () => {
    const user = userEvent.setup();
    render(
      <UsmleQuickBitesLibrary step="step-1" bites={bites} canReadAll preview />
    );
    expect(screen.getByRole("heading", { name: "Quick Bites: USMLE" })).toBeInTheDocument();
    expect(screen.getByText(/Admin preview/)).toBeInTheDocument();
    expect(screen.getByText("The first decision.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Read 2\. Second bite/ }));
    expect(screen.getByText("The second decision.")).toBeInTheDocument();
  });

  it("locks a non-sample bite when the library is not fully readable", () => {
    render(
      <UsmleQuickBitesLibrary step="step-1" bites={bites} canReadAll={false} preview={false} />
    );
    expect(screen.getByText("The first decision.")).toBeInTheDocument();
    expect(screen.getByText("Locked")).toBeInTheDocument();
  });
});
