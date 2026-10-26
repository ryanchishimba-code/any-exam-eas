import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { factualYearlySavingsBadge, getBillingPlanTier } from "@/lib/billing-plans";
import { PAID_REFUND_PARAGRAPH } from "@/lib/marketing/legal-copy";
import { pricingFaqItems } from "@/lib/marketing/pricing-faq";
import { PRO_MONTHLY_PRICE_USD, PRO_YEARLY_PRICE_USD } from "@/lib/pricing-defaults";
import { buildPricingJsonLd } from "@/lib/seo/marketing-metadata";

describe("pricing offer math and schema", () => {
  it("keeps the annual total at 30 percent off twelve months of Pro", () => {
    const monthly = getBillingPlanTier("pro", "monthly");
    const yearly = getBillingPlanTier("pro", "yearly");
    const list = Math.round(PRO_MONTHLY_PRICE_USD * 12 * 100) / 100;
    expect(monthly.totalUsd).toBe(PRO_MONTHLY_PRICE_USD);
    expect(monthly.totalUsd).toBe(27.99);
    expect(PRO_YEARLY_PRICE_USD).toBe(235.12);
    expect(yearly.totalUsd).toBe(PRO_YEARLY_PRICE_USD);
    expect(yearly.totalUsd).toBe(Math.round(list * 0.7 * 100) / 100);
    expect(factualYearlySavingsBadge("pro")).toBe("Save 30%");
    expect(yearly.monthlyEquivalentUsd).toBe(19.59);
  });

  it("publishes monthly and annual offers plus the visible FAQ", () => {
    const data = buildPricingJsonLd();
    const graph = data["@graph"] as Array<Record<string, unknown>>;
    const product = graph.find((node) => node["@type"] === "Product");
    const faq = graph.find((node) => node["@type"] === "FAQPage");
    const offers = product?.offers as Array<Record<string, unknown>>;
    expect(offers.map((offer) => offer.price)).toEqual(["27.99", "235.12"]);
    expect(offers.map((offer) => offer.priceCurrency)).toEqual(["USD", "USD"]);
    expect(JSON.stringify(data)).not.toMatch(/883-6375|2148836375|telephone/);

    const questions = (faq?.mainEntity as Array<{ name: string; acceptedAnswer: { text: string } }>).map(
      (item) => item.name
    );
    expect(questions).toEqual(pricingFaqItems().map((item) => item.question));
    const refund = (faq?.mainEntity as Array<{ acceptedAnswer: { text: string } }>).find((item) =>
      item.acceptedAnswer.text.includes("non-refundable")
    );
    expect(refund?.acceptedAnswer.text).toBe(PAID_REFUND_PARAGRAPH);
  });

  it("server-renders the pricing H1 and plan card outside a client bailout", () => {
    const page = readFileSync(
      path.join(process.cwd(), "src/app/(marketing)/pricing/page.tsx"),
      "utf8"
    );
    const card = readFileSync(path.join(process.cwd(), "src/components/pricing/PricingTiers.tsx"), "utf8");
    expect(page).toContain("<h1>Six boards. One monthly price.</h1>");
    expect(page).not.toContain("PricingBoardHeadline");
    expect(page.indexOf("<h1>")).toBeLessThan(page.indexOf("<PricingTiers"));
    expect(card).not.toContain("use client");
    expect(card).not.toContain("useSession");
    expect(card).not.toContain("useSearchParams");
    expect(card).not.toContain("883-6375");
    expect(card).not.toContain("SupportPhoneLink");
  });
});
