import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DrugCatalogIndex } from "@/components/study/DrugCatalogIndex";
import { TOP_500_DRUGS } from "./catalog";
import { GUEST_DRUG_PREVIEW_LIMIT } from "@/lib/guest-preview";
import { TRIAL_DAYS } from "@/lib/billing-config";
import {
  DRUGS_PAGE_DESCRIPTION,
  DRUGS_PAGE_TITLE,
  drugCatalogItemListJsonLd,
  publicDrugRows,
  publicDrugRowsByClass,
  publicDrugRowsByLetter,
} from "./public-index";

describe("public drug index", () => {
  it("keeps a mnemonic, brand, class, indications, and side effects on every card", () => {
    expect(TRIAL_DAYS).toBeGreaterThan(0);
    expect(GUEST_DRUG_PREVIEW_LIMIT).toBeGreaterThan(0);
    expect(GUEST_DRUG_PREVIEW_LIMIT).toBeLessThan(TOP_500_DRUGS.length);
    for (const drug of TOP_500_DRUGS) {
      expect(drug.generic.trim(), drug.id).not.toBe("");
      expect(drug.brand.trim(), drug.id).not.toBe("");
      expect(drug.therapeuticClass.trim(), drug.id).not.toBe("");
      expect(drug.indications.trim(), drug.id).not.toBe("");
      expect(drug.sideEffects.trim(), drug.id).not.toBe("");
      expect(drug.mnemonic.trim(), drug.id).not.toBe("");
    }
  });

  it("lists every catalog drug once in A–Z and once by class", () => {
    const rows = publicDrugRows();
    expect(new Set(rows.map((drug) => drug.id)).size).toBe(TOP_500_DRUGS.length);
    const letters = publicDrugRowsByLetter().flatMap((group) => group.drugs);
    const classes = publicDrugRowsByClass().flatMap((group) => group.drugs);
    expect(letters.map((drug) => drug.id).sort()).toEqual(rows.map((drug) => drug.id).sort());
    expect(classes.map((drug) => drug.id).sort()).toEqual(rows.map((drug) => drug.id).sort());
  });

  it("publishes an ItemList without ratings, counts we did not measure, or card backs", () => {
    const data = drugCatalogItemListJsonLd();
    const drugs = publicDrugRows();
    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("ItemList");
    expect(data.numberOfItems).toBe(drugs.length);
    expect(data.itemListOrder).toBe("https://schema.org/ItemListOrderAscending");
    const items = data.itemListElement as {
      "@type": string;
      position: number;
      name: string;
      description: string;
    }[];
    expect(items).toHaveLength(drugs.length);
    items.forEach((item, index) => {
      expect(item["@type"]).toBe("ListItem");
      expect(item.position).toBe(index + 1);
      expect(item.name).toBe(`${drugs[index]!.generic} (${drugs[index]!.brand})`);
      expect(item.description).toBe(drugs[index]!.therapeuticClass);
      expect(item).not.toHaveProperty("url");
      expect(item).not.toHaveProperty("aggregateRating");
    });
    const serialized = JSON.stringify(data);
    expect(serialized).not.toMatch(/aggregateRating|reviewCount|ratingValue|mnemonic|pearl/i);
    expect(serialized).not.toMatch(/\$|%/);
  });

  it("renders the names in the server HTML and leaves mnemonics out", () => {
    const html = renderToStaticMarkup(createElement(DrugCatalogIndex));
    expect(html).toContain("<h2");
    expect(html).toContain("Drug catalog, A to Z");
    expect(html).toContain("Classes in this deck");
    expect(html).toContain("application/ld+json");
    const sample = TOP_500_DRUGS[0]!;
    expect(html).toContain(sample.generic);
    expect(html).toContain(sample.brand);
    expect(html).not.toContain(sample.mnemonic);
    expect(html).not.toContain(sample.indications);
    expect(html).not.toContain(sample.sideEffects);
    expect(html).toContain("min-h-11");
    expect(DRUGS_PAGE_TITLE).toContain("AnyExamEasy");
    expect(DRUGS_PAGE_TITLE.split("AnyExamEasy")).toHaveLength(2);
    expect(DRUGS_PAGE_DESCRIPTION).toMatch(/Free preview/);
    expect(DRUGS_PAGE_DESCRIPTION).toMatch(/free trial/);
  });
});
