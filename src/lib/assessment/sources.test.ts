import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { resolveCitedSources, sourceRegistry } from "@/lib/assessment/sources";
import type { PilotDocument } from "@/lib/assessment/types";

const pilot = JSON.parse(readFileSync("content/ngn-pilot/pilot-items.json", "utf8")) as PilotDocument;

describe("source registry lookup", () => {
  it("resolves item and case citations to registry titles and urls", () => {
    const registry = sourceRegistry(pilot.sources);
    const item = pilot.cases[0]?.items[0];
    const caseDoc = pilot.cases[0];
    if (!item || !caseDoc) throw new Error("missing C01");

    const itemLinks = resolveCitedSources(item.references, registry);
    const caseLinks = resolveCitedSources(caseDoc.references, registry);

    expect(itemLinks.map((link) => link.title)).toContain("NCSBN 2026 NCLEX-RN Test Plan");
    expect(itemLinks.find((link) => link.src === "NCSBN_TP26")?.url).toBe(
      "https://www.nclex.com/files/2026_RN_Test%20Plan_English-F.pdf"
    );
    expect(caseLinks.find((link) => link.src === "MEDLINEPLUS_LABS")).toMatchObject({
      title: expect.stringContaining("MedlinePlus"),
      url: "https://medlineplus.gov/ency/article/003484.htm",
      locator: "reference ranges",
    });
  });

  it("keeps an unknown source id as plain text with no link", () => {
    const [link] = resolveCitedSources([{ src: "NOT_IN_REGISTRY", locator: "p. 1" }], {});
    expect(link).toEqual({
      src: "NOT_IN_REGISTRY",
      locator: "p. 1",
      title: "NOT_IN_REGISTRY",
      url: null,
    });
  });
});
