/**
 * AnyExamEasy merch catalog — the only file to edit for products, prices,
 * colors, photos, and Fourthwall links. The page layout reads this; it does
 * not hardcode a product.
 *
 * Checkout is on Fourthwall, not on this site. Leave `fourthwallUrl` as ""
 * until that product's real https page exists. An empty or non-https URL
 * hides the product. Do not add a placeholder label. If none are linkable,
 * /merch returns 404.
 *
 * Polo and the sherpa blanket are stand-ins. Swap `image`, `imageAlt`,
 * `colors`, and `priceUsd` here when premium blanks replace them.
 *
 * Visibility flag (MERCH_ENABLED). A new deployment picks it up:
 * - unset: off in production; on for local `next dev` and Vercel preview
 * - 1 or true: on
 * - 0 or false: off everywhere, including preview
 * Production stays dark until you set MERCH_ENABLED=1 on Vercel and paste
 * each product URL below. See .env.example.
 */

export const MERCH_PATH = "/merch";

export const MERCH_COPY = {
  eyebrow: "New · Launch collection",
  title: "AnyExamEasy Merch",
  subtitle: "Embroidered essentials in earthy tones.",
  shopCta: "Shop the collection",
  lineupTitle: "The lineup.",
  buyCta: "Buy",
  shipping: "Prices in USD. Shipping is paid at checkout.",
  /** The only policy line allowed on this page. */
  policy: "Free replacement for any defect.",
  storeCta: "Visit the store",
} as const;

export const MERCH_META_TITLE = "AnyExamEasy Merch. Embroidered Essentials in Earth Tones";

export const MERCH_META_DESCRIPTION =
  "A small launch collection of embroidered tees, hoodies, caps, beanies, and stickers in earthy tones. Prices are in USD. Shipping is paid at checkout.";

export const MERCH_HERO = {
  image: "/merch/hero.webp",
  imageAlt: "AnyExamEasy crewneck, hoodie, tee, beanie, caps, and sticker sheet",
  imageWidth: 2280,
  imageHeight: 1300,
} as const;

export const MERCH_OG_IMAGE = {
  path: "/merch/og.jpg",
  width: 1200,
  height: 630,
  alt: "AnyExamEasy merch: crewneck, hoodie, tee, beanie, caps, and stickers",
} as const;

/**
 * Fourthwall shop home. Leave "" to hide the "Visit the store" link.
 * Example: "https://anyexameasy.fourthwall.com"
 */
export const MERCH_STORE_URL = "";

export type MerchColor = {
  /** Color name shown under the product. The first color is the one in the photo. */
  name: string;
  hex: `#${string}`;
};

export type MerchProduct = {
  id: string;
  name: string;
  /** USD. Displayed with two decimals. */
  priceUsd: number;
  image: `/merch/${string}`;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  colors: readonly MerchColor[];
  /**
   * Fourthwall product page (https). Leave "" until the URL exists.
   * Example: "https://anyexameasy.fourthwall.com/products/tee"
   */
  fourthwallUrl: string;
};

export const MERCH_PRODUCTS = [
  {
    id: "tee",
    name: "Tee",
    priceUsd: 24.99,
    image: "/merch/tee.webp",
    imageAlt: "Moss tee with a small embroidered chest mark",
    imageWidth: 1200,
    imageHeight: 1200,
    colors: [
      { name: "Moss", hex: "#63664b" },
      { name: "Espresso", hex: "#4a3a2e" },
    ],
    fourthwallUrl: "",
  },
  {
    id: "premium-hoodie",
    name: "Premium Hoodie",
    priceUsd: 56.99,
    image: "/merch/hoodie-premium.webp",
    imageAlt: "Chocolate brown premium hoodie with a kangaroo pocket and a small embroidered chest mark",
    imageWidth: 1200,
    imageHeight: 1200,
    colors: [
      { name: "Chocolate Brown", hex: "#5f422d" },
      { name: "Moss", hex: "#737a5e" },
    ],
    fourthwallUrl: "",
  },
  {
    id: "classic-hoodie",
    name: "Classic Hoodie",
    priceUsd: 42.99,
    image: "/merch/hoodie-classic.webp",
    imageAlt: "Latte classic hoodie with a small embroidered chest mark",
    imageWidth: 1200,
    imageHeight: 1200,
    colors: [
      { name: "Latte", hex: "#b59a78" },
      { name: "Military Green", hex: "#5d6142" },
      { name: "Forest", hex: "#2e3f33" },
      { name: "Bone", hex: "#e6dfd0" },
    ],
    fourthwallUrl: "",
  },
  {
    id: "crewneck",
    name: "Crewneck",
    priceUsd: 37.99,
    image: "/merch/crew.webp",
    imageAlt: "Forest green crewneck with a small embroidered chest mark",
    imageWidth: 1200,
    imageHeight: 1200,
    colors: [{ name: "Forest Green", hex: "#2e3f33" }],
    fourthwallUrl: "",
  },
  {
    id: "polo",
    name: "Polo",
    priceUsd: 25.99,
    image: "/merch/polo.webp",
    imageAlt: "Black polo shirt",
    imageWidth: 1200,
    imageHeight: 1200,
    colors: [{ name: "Black", hex: "#161616" }],
    fourthwallUrl: "",
  },
  {
    id: "dad-cap",
    name: "Dad Cap",
    priceUsd: 21.99,
    image: "/merch/cap-dad.webp",
    imageAlt: "Spruce dad cap with an embroidered front mark",
    imageWidth: 1200,
    imageHeight: 1200,
    colors: [{ name: "Spruce", hex: "#254136" }],
    fourthwallUrl: "",
  },
  {
    id: "corduroy-cap",
    name: "Corduroy Cap",
    priceUsd: 23.99,
    image: "/merch/cap-cord.webp",
    imageAlt: "Brown corduroy cap with a small front patch",
    imageWidth: 1200,
    imageHeight: 1200,
    colors: [
      { name: "Brown", hex: "#6c594c" },
      { name: "Olive", hex: "#6b6a45" },
    ],
    fourthwallUrl: "",
  },
  {
    id: "cuffed-beanie",
    name: "Cuffed Beanie",
    priceUsd: 19.99,
    image: "/merch/beanie.webp",
    imageAlt: "Olive cuffed beanie with a small embroidered cuff mark",
    imageWidth: 1200,
    imageHeight: 1200,
    colors: [
      { name: "Olive", hex: "#4f5234" },
      { name: "Brown", hex: "#5a4332" },
      { name: "Spruce", hex: "#254136" },
    ],
    fourthwallUrl: "",
  },
  {
    id: "sticker-sheet",
    name: "Sticker Sheet",
    priceUsd: 7.99,
    image: "/merch/stickers.webp",
    imageAlt: "Sticker sheet with Future RN, PharmD, PA, NP, and PT badges",
    imageWidth: 1200,
    imageHeight: 1200,
    colors: [
      { name: "RN", hex: "#0f766e" },
      { name: "PharmD", hex: "#5f6b45" },
      { name: "PA", hex: "#5c402c" },
      { name: "NP", hex: "#2f4a3a" },
      { name: "PT", hex: "#a66e4a" },
    ],
    fourthwallUrl: "",
  },
  {
    id: "sherpa-blanket",
    name: "Sherpa Blanket",
    priceUsd: 64.99,
    image: "/merch/blanket.webp",
    imageAlt: "Fireside brown sherpa blanket, folded",
    imageWidth: 1200,
    imageHeight: 1200,
    colors: [{ name: "Fireside Brown", hex: "#7e5840" }],
    fourthwallUrl: "",
  },
] as const satisfies readonly MerchProduct[];
