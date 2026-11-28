import { describe, expect, it } from "vitest";
import { LEGAL_ENTITY, organizationContactPoint } from "@/lib/legal";
import { LEGAL_SUPPORT_PHONE } from "@/lib/legal-phone";
import { buildHomeJsonLd } from "@/lib/seo";
import { ORGANIZATION_ID } from "@/lib/seo/brand-entity";
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

    const home = JSON.stringify(buildHomeJsonLd());
    expect(home).not.toContain("883-6375");
    expect(home).not.toContain("2148836375");
    expect(home).not.toContain('"telephone"');
    expect(home).toContain('"@type":"EducationalOrganization"');
    expect(home).toContain('"email":"support@anyexameasy.com"');
    expect(home).toContain('"contactType":"customer support"');
    expect(home).toContain('"areaServed":"US"');
    expect(home).toContain('"availableLanguage":"English"');
    expect(home).not.toContain("hoursAvailable");

    const about = JSON.stringify(buildAboutJsonLd());
    expect(about).not.toContain("883-6375");
    expect(about).not.toContain("2148836375");
    expect(about).not.toContain('"telephone"');
    expect(about).not.toContain("hoursAvailable");
    expect(about).not.toContain('"@type":"Organization"');
    expect(about).toContain(`"@id":"${ORGANIZATION_ID}"`);
  });
});
