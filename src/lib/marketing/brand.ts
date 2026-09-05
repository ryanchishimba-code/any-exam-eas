/** Brand assets for marketing and app chrome. */
export const BRAND_LOGO = {
  src: "/images/brand/anyexameasy-logo.png",
  alt: "AnyExamEasy — NCLEX, USMLE, NAPLEX, PANCE, AANP FNP & NPTE-PT board exam prep",
  width: 687,
  height: 1024,
} as const;

/** Compact mark for nav/footer — avoids oversized `/_next/image` preloads. */
export const BRAND_LOGO_NAV = {
  src: "/images/brand/anyexameasy-logo-nav.webp",
  alt: BRAND_LOGO.alt,
  width: 107,
  height: 160,
} as const;

export const BRAND_ICON = {
  src: "/icons/icon-192.png",
  alt: "AnyExamEasy",
  width: 192,
  height: 192,
} as const;
