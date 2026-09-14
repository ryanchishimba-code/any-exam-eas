import { LEGAL_ENTITY } from "@/lib/legal";

/**
 * Public company / builder identity for About and marketing trust.
 * Credentials, degrees, licenses, and photos are listed only when a real
 * asset exists — never invented for the page.
 */
export const FOUNDER_PUBLIC = {
  name: "Ryan Chishimba",
  role: "Founder and product editor",
  initials: "RC",
  /** Set when a real headshot lands in /public. */
  photoSrc: null as string | null,
  location: "Texas",
} as const;

export const COMPANY_PUBLIC = {
  legalName: LEGAL_ENTITY.companyName,
  productName: LEGAL_ENTITY.productName,
  supportEmail: LEGAL_ENTITY.supportEmail,
} as const;
