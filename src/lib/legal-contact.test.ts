import { describe, expect, it } from "vitest";
import { LEGAL_ENTITY, organizationContactPoint } from "@/lib/legal";
import { buildHomeJsonLd } from "@/lib/seo";
import { buildAboutJsonLd } from "@/lib/seo/marketing-metadata";

describe("support phone", () => {
  it("keeps the phone and 24/7 hours in one constant", () => {
    expect(LEGAL_ENTITY.supportPhone.display).toBe("(214) 883-6375");
    expect(LEGAL_ENTITY.supportPhone.tel).toBe("tel:+12148836375");
    expect(LEGAL_ENTITY.supportPhone.schema).toBe("+1-214-883-6375");
    expect(LEGAL_ENTITY.supportPhone.helpLabel).toBe("Help 24/7");
    expect(LEGAL_ENTITY.supportPhone.supportLabel).toBe("24/7 support");
    expect(LEGAL_ENTITY.supportPhone.availableLabel).toBe("Available 24/7");
    expect(LEGAL_ENTITY.supportPhone.opens).toBe("00:00");
    expect(LEGAL_ENTITY.supportPhone.closes).toBe("23:59");
    expect([...LEGAL_ENTITY.supportPhone.dayOfWeek]).toEqual([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ]);
  });

  it("publishes a 24/7 customer-support contactPoint", () => {
    const point = organizationContactPoint();
    expect(point).toEqual({
      "@type": "ContactPoint",
      telephone: "+1-214-883-6375",
      contactType: "customer support",
      areaServed: "US",
      availableLanguage: "English",
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: LEGAL_ENTITY.supportPhone.dayOfWeek,
        opens: "00:00",
        closes: "23:59",
      },
    });

    for (const graph of [buildHomeJsonLd(), buildAboutJsonLd()]) {
      const json = JSON.stringify(graph);
      expect(json).toContain('"telephone":"+1-214-883-6375"');
      expect(json).toContain('"contactType":"customer support"');
      expect(json).toContain('"areaServed":"US"');
      expect(json).toContain('"availableLanguage":"English"');
      expect(json).toContain('"opens":"00:00"');
      expect(json).toContain('"closes":"23:59"');
      expect(json).toContain('"Monday"');
      expect(json).toContain('"Sunday"');
    }
  });
});
