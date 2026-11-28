import { describe, expect, it } from "vitest";
import { EXAM_CATALOG, EXAM_SLUGS } from "@/lib/edtech/exams";
import { qotdExamMetaDescription, qotdExamTitle } from "@/lib/demo/qotd-titles";
import { ORGANIZATION_ID } from "@/lib/seo/brand-entity";
import { CANONICAL_ORIGIN } from "@/lib/seo/crawl-policy";
import { qotdPath } from "@/lib/demo/qotd";
import { publicWebPageJsonLd } from "@/lib/seo/public-schema";

function graphNodes(data: Record<string, unknown>): Record<string, unknown>[] {
  const graph = data["@graph"];
  if (!Array.isArray(graph)) return [];
  return graph.filter((node): node is Record<string, unknown> => !!node && typeof node === "object");
}

describe("publicWebPageJsonLd for daily board pages", () => {
  it("emits a parseable WebPage and BreadcrumbList that reference the org @id", () => {
    expect(ORGANIZATION_ID).toBe("https://www.anyexameasy.com/#organization");

    for (const slug of EXAM_SLUGS) {
      const name = EXAM_CATALOG[slug].shortName;
      const path = qotdPath(slug);
      const data = publicWebPageJsonLd({
        name: qotdExamTitle(name),
        description: qotdExamMetaDescription(slug),
        path,
        crumbs: [
          { name: "Daily", path: "/daily" },
          { name, path },
        ],
      });

      expect(data["@context"]).toBe("https://schema.org");
      const json = JSON.stringify(data);
      expect(() => JSON.parse(json)).not.toThrow();
      expect(json).not.toMatch(/"@type":"(Quiz|Question|QAPage)"/);
      expect(json).not.toMatch(/datePublished|dateModified|dateCreated|uploadDate/);

      const nodes = graphNodes(data);
      const page = nodes.find((node) => node["@type"] === "WebPage");
      const crumbs = nodes.find((node) => node["@type"] === "BreadcrumbList");
      expect(page, slug).toBeDefined();
      expect(crumbs, slug).toBeDefined();

      expect(page?.url).toBe(`${CANONICAL_ORIGIN}${path}`);
      expect(page?.name).toBe(qotdExamTitle(name));
      expect(page?.description).toBe(qotdExamMetaDescription(slug));
      expect(page?.publisher).toEqual({ "@id": ORGANIZATION_ID });
      expect(page?.isPartOf).toEqual({ "@id": `${CANONICAL_ORIGIN}/#website` });
      expect(page?.inLanguage).toBe("en-US");
      expect(page?.isAccessibleForFree).toBe(true);

      const items = crumbs?.itemListElement;
      expect(Array.isArray(items), slug).toBe(true);
      const list = items as Record<string, unknown>[];
      expect(list.map((item) => item.name)).toEqual(["Home", "Daily", name]);
      expect(list.map((item) => item.item)).toEqual([
        `${CANONICAL_ORIGIN}/`,
        `${CANONICAL_ORIGIN}/daily`,
        `${CANONICAL_ORIGIN}${path}`,
      ]);
      expect(list.every((item) => typeof item.name === "string" && item.name.length > 0)).toBe(true);
    }
  });
});
