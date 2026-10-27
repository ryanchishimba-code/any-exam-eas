import { describe, expect, it } from "vitest";
import { LEGAL_ENTITY, organizationContactPoint } from "@/lib/legal";
import { LEGAL_SUPPORT_PHONE } from "@/lib/legal-phone";
import { buildHomeJsonLd } from "@/lib/seo";
import { buildAboutJsonLd } from "@/lib/seo/marketing-metadata";

describe("support contact", () => {
  it("keeps the phone number only for the legal-page link", () => {
    expect(LEGAL_SUPPORT_PHONE).toEqual({
      display: "(214) 883-6375",
      tel: "tel:+12148836375",
      schema: "+1-214-883-6375",
    });
    expect(LEGAL_ENTITY).not.toHaveProperty("supportPhone");
    expect(LEGAL_ENTITY.supportEmail).toBe("support@anyexameasy.com");
  });

  it("publishes email as the only Organization contactPoint", () => {
    const point = organizationContactPoint();
    expect(point).toEqual({
      "@type": "ContactPoint",
      email: "support@anyexameasy.com",
      contactType: "customer support",
      areaServed: "US",
      availableLanguage: "English",
    });
    expect(point).not.toHaveProperty("telephone");
    expect(point).not.toHaveProperty("hoursAvailable");

    for (const graph of [buildHomeJsonLd(), buildAboutJsonLd()]) {
      const json = JSON.stringify(graph);
      expect(json).not.toContain("883-6375");
      expect(json).not.toContain("2148836375");
      expect(json).not.toContain('"telephone"');
      expect(json).toContain('"email":"support@anyexameasy.com"');
      expect(json).toContain('"contactType":"customer support"');
      expect(json).toContain('"areaServed":"US"');
      expect(json).toContain('"availableLanguage":"English"');
      expect(json).not.toContain("hoursAvailable");
    }
  });
});
