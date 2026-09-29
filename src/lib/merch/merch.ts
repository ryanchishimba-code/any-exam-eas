import type { Metadata } from "next";
import {
  MERCH_COPY,
  MERCH_META_DESCRIPTION,
  MERCH_META_TITLE,
  MERCH_OG_IMAGE,
  MERCH_PATH,
  MERCH_PRODUCTS,
  MERCH_STORE_URL,
  type MerchProduct,
} from "@/lib/merch/catalog";
import { absoluteUrl } from "@/lib/seo";
import { enforceMetaDescription, enforceMetaTitle } from "@/lib/seo/meta-budget";
import { SITE_NAME } from "@/lib/site";

export type MerchEnv = {
  MERCH_ENABLED?: string;
  VERCEL_ENV?: string;
  NODE_ENV?: string;
};

const ENABLED = new Set(["1", "true", "yes", "on"]);

/** Public https URL with a host. Rejects blanks, http, and script URLs. */
export function isMerchCheckoutUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return false;
  }
  if (url.protocol !== "https:") return false;
  if (url.username || url.password) return false;
  if (!url.hostname || url.hostname === "localhost" || url.hostname.endsWith(".local")) {
    return false;
  }
  return true;
}

/**
 * Production defaults off. Vercel preview and local development default on
 * so the page can be reviewed once product URLs exist. An explicit
 * MERCH_ENABLED value always wins.
 */
export function merchEnabledFromEnv(env: MerchEnv = process.env): boolean {
  const raw = env.MERCH_ENABLED?.trim().toLowerCase() ?? "";
  if (ENABLED.has(raw)) return true;
  // Any explicit value other than on — including "false" — stays off.
  if (raw) return false;
  if (env.VERCEL_ENV === "preview") return true;
  if (env.NODE_ENV === "development") return true;
  return false;
}

export function isMerchEnabled(): boolean {
  return merchEnabledFromEnv(process.env);
}

const HEX = /^#[0-9a-fA-F]{6}$/;

function priceHasCents(usd: number): boolean {
  if (!Number.isFinite(usd) || usd <= 0) return false;
  const cents = Math.round(usd * 100);
  return Math.abs(usd * 100 - cents) < 1e-6;
}

/** Structural problems. An empty Fourthwall URL is allowed; it hides the product. */
export function merchProductIssues(product: MerchProduct): string[] {
  const issues: string[] = [];
  if (!product.id.trim()) issues.push("missing id");
  if (!product.name.trim()) issues.push("missing name");
  if (!priceHasCents(product.priceUsd)) issues.push("price must be a positive USD amount with cents");
  if (!product.image.startsWith("/merch/")) issues.push("image must live under /merch/");
  if (product.imageWidth < 1 || product.imageHeight < 1) issues.push("image dimensions");
  if (product.imageAlt.trim().length < 8) issues.push("image alt text");
  if (product.colors.length === 0) issues.push("at least one color");
  for (const color of product.colors) {
    if (!color.name.trim()) issues.push("color missing a name");
    if (!HEX.test(color.hex)) issues.push(`invalid hex ${color.hex}`);
  }
  if (product.fourthwallUrl.trim() && !isMerchCheckoutUrl(product.fourthwallUrl)) {
    issues.push("fourthwallUrl must be an https URL");
  }
  return issues;
}

/** Products that can be purchased. Invalid rows and rows without an https URL are omitted. */
export function visibleMerchProducts(
  products: readonly MerchProduct[] = MERCH_PRODUCTS,
): MerchProduct[] {
  return products.filter(
    (product) => merchProductIssues(product).length === 0 && isMerchCheckoutUrl(product.fourthwallUrl),
  );
}

export function isMerchPageAvailable(
  env: MerchEnv = process.env,
  products: readonly MerchProduct[] = MERCH_PRODUCTS,
): boolean {
  return merchEnabledFromEnv(env) && visibleMerchProducts(products).length > 0;
}

/** Shop home link, or null when the config has no https store URL. */
export function merchStoreHref(storeUrl: string = MERCH_STORE_URL): string | null {
  const trimmed = storeUrl.trim();
  return isMerchCheckoutUrl(trimmed) ? trimmed : null;
}

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatMerchPrice(usdAmount: number): string {
  return usd.format(usdAmount);
}

const COUNT_WORDS = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
] as const;

export function merchLineupSubtitle(count: number): string {
  const label = count >= 0 && count < COUNT_WORDS.length ? COUNT_WORDS[count] : String(count);
  const noun = count === 1 ? "piece" : "pieces";
  return `${label} ${noun}. Made for study days.`;
}

export function colorLine(product: MerchProduct): string {
  return product.colors.map((color) => color.name).join(" · ");
}

export function buildMerchMetadata(): Metadata {
  const title = enforceMetaTitle(MERCH_META_TITLE, "merch");
  const description = enforceMetaDescription(MERCH_META_DESCRIPTION, "merch");
  const image = absoluteUrl(MERCH_OG_IMAGE.path);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: MERCH_PATH },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: absoluteUrl(MERCH_PATH),
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: image,
          width: MERCH_OG_IMAGE.width,
          height: MERCH_OG_IMAGE.height,
          alt: MERCH_OG_IMAGE.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export function buildMerchJsonLd(products: readonly MerchProduct[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: MERCH_COPY.title,
    url: absoluteUrl(MERCH_PATH),
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        image: absoluteUrl(product.image),
        description: product.imageAlt,
        brand: { "@type": "Brand", name: "AnyExamEasy" },
        color: colorLine(product),
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: product.priceUsd.toFixed(2),
          url: product.fourthwallUrl.trim(),
        },
      },
    })),
  };
}
