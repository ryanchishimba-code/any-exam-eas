import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { RationalePanel } from "@/components/ngn/RationalePanel";
import { SourcesDisclosure } from "@/components/ngn/SourcesDisclosure";
import { sourceRegistry } from "@/lib/assessment/sources";
import type { PilotDocument } from "@/lib/assessment/types";

const pilot = JSON.parse(readFileSync("content/ngn-pilot/pilot-items.json", "utf8")) as PilotDocument;
const caseDoc = pilot.cases[0];
const item = caseDoc?.items[0];
const registry = sourceRegistry(pilot.sources);

describe("NGN sources disclosure", () => {
  it("keeps item and case sources collapsed, then opens registry links in a new tab", async () => {
    if (!caseDoc || !item) throw new Error("missing C01");
    const user = userEvent.setup();
    render(
      <SourcesDisclosure
        itemReferences={item.references}
        caseReferences={caseDoc.references}
        sourcesById={registry}
      />
    );

    const details = screen.getByText("Sources").closest("details");
    expect(details).not.toBeNull();
    expect(details).not.toHaveAttribute("open");

    await user.click(screen.getByText("Sources"));

    const itemLink = screen.getByRole("link", { name: /NCSBN 2026 NCLEX-RN Test Plan/ });
    expect(itemLink).toHaveAttribute("href", "https://www.nclex.com/files/2026_RN_Test%20Plan_English-F.pdf");
    expect(itemLink).toHaveAttribute("target", "_blank");
    expect(itemLink).toHaveAttribute("rel", "noopener noreferrer");

    const caseLink = screen.getByRole("link", { name: /MedlinePlus Medical Encyclopedia/ });
    expect(caseLink).toHaveAttribute("href", "https://medlineplus.gov/ency/article/003484.htm");
    expect(caseLink).toHaveAttribute("target", "_blank");
    expect(screen.getByText("reference ranges")).toBeInTheDocument();
    expect(screen.getByText("This item")).toBeInTheDocument();
    expect(screen.getByText("This case")).toBeInTheDocument();
  });

  it("shows the same sources on the rationale panel without opening Show more", async () => {
    if (!caseDoc || !item) throw new Error("missing C01");
    const user = userEvent.setup();
    render(
      <RationalePanel
        item={item}
        response={[]}
        sourcesById={registry}
        caseReferences={caseDoc.references}
      />
    );

    expect(screen.getByText("Sources").closest("details")).not.toHaveAttribute("open");
    expect(screen.queryByText("Takeaway")).not.toBeInTheDocument();

    await user.click(screen.getByText("Sources"));
    const newsLinks = screen.getAllByRole("link", { name: /Royal College of Physicians NEWS2/ });
    expect(newsLinks.length).toBeGreaterThan(0);
    expect(newsLinks[0]).toHaveAttribute("target", "_blank");
    expect(newsLinks[0]).toHaveAttribute(
      "href",
      "https://www.rcp.ac.uk/media/alxev00t/news2-chart-1_the-news-scoring-system_0_0.pdf"
    );
  });
});
