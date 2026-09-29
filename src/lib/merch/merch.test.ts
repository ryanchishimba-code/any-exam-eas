import { existsSync, readFileSync } from "node:fs";
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { authConfig } from "@/auth.config";
import { loggedOutTrialCheckoutHref } from "@/lib/billing/card-free-checkout";
import { MERCH_COPY, MERCH_OG_IMAGE, MERCH_PATH, MERCH_PRODUCTS, MERCH_STORE_URL } from "@/lib/merch/catalog";
import { isPremiumPage } from "@/lib/premium-routes";
import {
  buildMerchMetadata,
  formatMerchPrice,
  isMerchCheckoutUrl,
  isMerchPageAvailable,
  merchEnabledFromEnv,
  merchLineupSubtitle,
  merchProductIssues,
  merchStoreHref,
  visibleMerchProducts,
  type MerchEnv,
} from "@/lib/merch/merch";
import type { MerchProduct } from "@/lib/merch/catalog";
import { validateMetaDescription, validateMetaTitle } from "@/lib/seo/meta-budget";

const production: MerchEnv = { NODE_ENV: "production" };
const preview: MerchEnv = { NODE_ENV: "production", VERCEL_ENV: "preview" };
const development: MerchEnv = { NODE_ENV: "development" };

const tee: MerchProduct = {
  id: "tee",
  name: "Tee",
  priceUsd: 24.99,
  image: "/merch/tee.webp",
  imageAlt: "Moss tee with a small embroidered chest mark",
  imageWidth: 1200,
  imageHeight: 1200,
  colors: [{ name: "Moss", hex: "#63664b" }],
  fourthwallUrl: "https://anyexameasy.fourthwall.com/products/tee",
};

function withUrl(url: string): MerchProduct {
  return { ...tee, fourthwallUrl: url };
}

describe("merch catalog", () => {
  it("lists the launch pieces in order with prices and colors", () => {
    expect(MERCH_PRODUCTS.map((product) => product.name)).toEqual([
      "Tee",
      "Premium Hoodie",
      "Classic Hoodie",
      "Crewneck",
      "Everything Is Hard Hoodie",
      "Everything Is Hard Crewneck",
      "Polo",
      "Dad Cap",
      "Corduroy Cap",
      "Cuffed Beanie",
      "Sticker Sheet",
      "Sherpa Blanket",
    ]);
    expect(MERCH_PRODUCTS.map((product) => product.priceUsd)).toEqual([
      24.99, 56.99, 42.99, 37.99, 63.99, 41.99, 29.99, 21.99, 23.99, 19.99, 9.99, 64.99,
    ]);
    expect(MERCH_PRODUCTS.map((product) => product.colors.map((color) => color.name))).toEqual([
      ["Moss", "Espresso"],
      ["Chocolate Brown", "Moss"],
      ["Latte", "Bone"],
      ["Forest Green"],
      ["Chocolate Brown"],
      ["Forest Green"],
      ["Black"],
      ["Spruce"],
      ["Brown", "Olive"],
      ["Olive", "Brown", "Spruce"],
      ["RN", "PharmD", "PA", "NP", "PT"],
      ["Fireside Brown"],
    ]);
  });

  it("keeps every row valid and points photos at files in public/merch", () => {
    const ids = new Set<string>();
    for (const product of MERCH_PRODUCTS) {
      expect(merchProductIssues(product), product.id).toEqual([]);
      expect(ids.has(product.id), product.id).toBe(false);
      ids.add(product.id);
      expect(existsSync(`public${product.image}`), product.image).toBe(true);
    }
    expect(existsSync(`public${MERCH_OG_IMAGE.path}`)).toBe(true);
    expect(existsSync("public/merch/hero.webp")).toBe(true);
    expect(MERCH_COPY.policy).toBe("Free replacement for any defect.");
    expect(MERCH_STORE_URL).toBe("");
  });
});

describe("merch checkout links", () => {
  it("hides a product until its Fourthwall URL is a public https link", () => {
    expect(visibleMerchProducts([withUrl("")])).toEqual([]);
    expect(visibleMerchProducts([withUrl("   ")])).toEqual([]);
    expect(visibleMerchProducts([withUrl("http://anyexameasy.fourthwall.com/products/tee")])).toEqual([]);
    expect(visibleMerchProducts([withUrl("javascript:alert(1)")])).toEqual([]);
    expect(visibleMerchProducts([withUrl("https://localhost/products/tee")])).toEqual([]);
    expect(visibleMerchProducts([withUrl("not a url")])).toEqual([]);
    expect(visibleMerchProducts([tee])).toEqual([tee]);
    expect(isMerchCheckoutUrl("https://user:pass@anyexameasy.fourthwall.com/p")).toBe(false);
  });

  it("keeps catalog order and drops only the rows that cannot be purchased", () => {
    const hidden = withUrl("");
    const visible = visibleMerchProducts([hidden, tee, { ...tee, id: "cap", name: "Dad Cap" }]);
    expect(visible.map((product) => product.id)).toEqual(["tee", "cap"]);
  });

  it("hides the whole page when every URL is blank, even if the flag is on", () => {
    expect(isMerchPageAvailable({ ...production, MERCH_ENABLED: "1" }, MERCH_PRODUCTS)).toBe(false);
    expect(isMerchPageAvailable({ ...production, MERCH_ENABLED: "1" }, [withUrl("")])).toBe(false);
    expect(isMerchPageAvailable({ ...production, MERCH_ENABLED: "1" }, [tee])).toBe(true);
  });

  it("returns a store link only for an https shop URL", () => {
    expect(merchStoreHref("")).toBeNull();
    expect(merchStoreHref("http://anyexameasy.fourthwall.com")).toBeNull();
    expect(merchStoreHref("https://anyexameasy.fourthwall.com")).toBe(
      "https://anyexameasy.fourthwall.com",
    );
  });
});

describe("MERCH_ENABLED", () => {
  it("defaults off in production and on for preview and local development", () => {
    expect(merchEnabledFromEnv(production)).toBe(false);
    expect(merchEnabledFromEnv({})).toBe(false);
    expect(merchEnabledFromEnv(preview)).toBe(true);
    expect(merchEnabledFromEnv(development)).toBe(true);
  });

  it("lets an explicit flag override preview and production", () => {
    expect(merchEnabledFromEnv({ ...production, MERCH_ENABLED: "1" })).toBe(true);
    expect(merchEnabledFromEnv({ ...production, MERCH_ENABLED: "true" })).toBe(true);
    expect(merchEnabledFromEnv({ ...preview, MERCH_ENABLED: "0" })).toBe(false);
    expect(merchEnabledFromEnv({ ...preview, MERCH_ENABLED: "false" })).toBe(false);
    expect(merchEnabledFromEnv({ ...development, MERCH_ENABLED: "no" })).toBe(false);
    expect(merchEnabledFromEnv({ ...production, MERCH_ENABLED: "maybe" })).toBe(false);
  });

  it("stays off in production when the flag is on but nothing is for sale", () => {
    expect(isMerchPageAvailable({ ...production, MERCH_ENABLED: "true" })).toBe(false);
    expect(isMerchPageAvailable({ ...preview })).toBe(false);
  });
});

describe("merch presentation", () => {
  it("formats USD prices and the lineup count", () => {
    expect(formatMerchPrice(24.99)).toBe("$24.99");
    expect(formatMerchPrice(7.9)).toBe("$7.90");
    expect(merchLineupSubtitle(10)).toBe("Ten pieces. Made for study days.");
    expect(merchLineupSubtitle(1)).toBe("One piece. Made for study days.");
  });

  it("ships a title, description, and canonical path inside the meta budget", () => {
    const metadata = buildMerchMetadata();
    const title = metadata.title;
    expect(title).toEqual({ absolute: expect.any(String) });
    if (!title || typeof title === "string" || !("absolute" in title) || !title.absolute) {
      throw new Error("merch title must be absolute");
    }
    expect(validateMetaTitle(title.absolute)).toBeNull();
    expect(validateMetaDescription(String(metadata.description))).toBeNull();
    expect(metadata.alternates).toEqual({ canonical: MERCH_PATH });
    expect(metadata.robots).toMatchObject({ index: true, follow: true });
  });
});

describe("signed-out merch access", () => {
  it("leaves /merch off the auth middleware and the premium gate", () => {
    const middleware = readFileSync("src/middleware.ts", "utf8");
    expect(middleware).not.toMatch(/["']\/merch/);
    expect(isPremiumPage("/merch")).toBe(false);
    expect(isPremiumPage("/merch/tee")).toBe(false);
    expect(loggedOutTrialCheckoutHref("/merch", "", false)).toBeNull();
  });

  it("allows a signed-out visit without a login redirect", () => {
    const request = new NextRequest("https://www.anyexameasy.com/merch");
    const decision = authConfig.callbacks.authorized?.({
      auth: null,
      request,
    });
    expect(decision).toBe(true);
  });

  it("sends Buy straight to an external url with no account check in the page", () => {
    const page = readFileSync("src/app/(marketing)/merch/page.tsx", "utf8");
    const collection = readFileSync("src/components/merch/MerchCollection.tsx", "utf8");
    expect(page).not.toMatch(/useSession|getServerSession|signIn\(|from ["']@\/auth["']/);
    expect(collection).not.toMatch(/useSession|signIn\(|\/auth\/login|\/signup/);
    expect(collection).toContain('target="_blank"');
    expect(collection).toContain('rel="noopener noreferrer"');
    const buy = visibleMerchProducts([tee]);
    expect(buy).toHaveLength(1);
    expect(buy[0]?.fourthwallUrl.startsWith("https://")).toBe(true);
    expect(buy[0]?.fourthwallUrl.startsWith("/")).toBe(false);
  });
});

describe("merch is not linked from the rest of the site", () => {
  const files = [
    "src/lib/merch/catalog.ts",
    "src/lib/merch/merch.ts",
    "src/components/merch/MerchCollection.tsx",
    "src/components/merch/merch.css",
    "src/app/(marketing)/merch/page.tsx",
    "src/app/(marketing)/merch/not-found.tsx",
  ];

  it("does not add /merch to the nav, footer, or route table", () => {
    expect(readFileSync("src/components/Navigation.tsx", "utf8")).not.toContain("/merch");
    expect(readFileSync("src/components/Footer.tsx", "utf8")).not.toContain("/merch");
    expect(readFileSync("src/lib/routes.ts", "utf8")).not.toContain("/merch");
    const page = readFileSync("src/app/(marketing)/merch/page.tsx", "utf8");
    expect(page).toContain("notFound()");
    expect(page).toContain("isMerchPageAvailable");
  });

  it("keeps banned claims and placeholder copy out of the page", () => {
    const source = files.map((file) => readFileSync(file, "utf8")).join("\n");
    expect(source).not.toMatch(/coming soon/i);
    expect(source).not.toMatch(/\bbest\b/i);
    expect(source).not.toMatch(/satisfaction guaranteed/i);
    expect(source).not.toMatch(/24\/7/);
    expect(source).not.toMatch(/\bguarantee\b/i);
    expect(source).not.toMatch(/\bpass(?:ed|ing)?(?: the)?(?: exam| rate)\b/i);
    expect(source).not.toMatch(/support hours/i);
    expect(source).not.toMatch(/\(\d{3}\) \d{3}-\d{4}/);
  });
});
