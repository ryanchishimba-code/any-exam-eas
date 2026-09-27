import { describe, expect, it } from "vitest";
import { LEGAL_ENTITY, organizationContactPoint } from "@/lib/legal";
import { buildHomeJsonLd } from "@/lib/seo";
import { buildAboutJsonLd } from "@/lib/seo/marketing-metadata";

describe("support phone", () => {
  it("keeps one public number in display, tel, and schema forms", () => {
    expect(LEGAL_ENTITY.supportPhone).toEqual({
      display: "(214) 883-6375",
      tel: "tel:+12148836375",
      schema: "+1-214-883-6375",
    });
  });

  it("publishes a customer-support contactPoint without hours", () => {
    const point = organizationContactPoint();
    expect(point).toEqual({
      "@type": "ContactPoint",
      telephone: "+1-214-883-6375",
      contactType: "customer support",
      areaServed: "US",
      availableLanguage: "English",
    });
    expect(point).not.toHaveProperty("hoursAvailable");

    for (const graph of [buildHomeJsonLd(), buildAboutJsonLd()]) {
      const json = JSON.stringify(graph);
      expect(json).toContain('"telephone":"+1-214-883-6375"');
      expect(json).toContain('"contactType":"customer support"');
      expect(json).toContain('"areaServed":"US"');
      expect(json).toContain('"availableLanguage":"English"');
      expect(json).not.toContain("hoursAvailable");
    }
  });
});
