import { LEGAL_ENTITY } from "@/lib/legal";

/**
 * Public company identity. Do not add a person's name or credential here.
 * A named clinical reviewer is opt-in via `getClinicalReviewLead()`.
 */
export const COMPANY_PUBLIC = {
  legalName: LEGAL_ENTITY.companyName,
  productName: LEGAL_ENTITY.productName,
  supportEmail: LEGAL_ENTITY.supportEmail,
} as const;

export type ClinicalReviewLead = {
  name: string;
  credential: string;
};

/**
 * Renders on About only when both values are configured.
 * Empty or partial config returns null — no placeholder copy.
 *
 * CLINICAL_REVIEW_LEAD_NAME
 * CLINICAL_REVIEW_LEAD_CREDENTIAL
 */
export function getClinicalReviewLead(): ClinicalReviewLead | null {
  const name = process.env.CLINICAL_REVIEW_LEAD_NAME?.trim() ?? "";
  const credential = process.env.CLINICAL_REVIEW_LEAD_CREDENTIAL?.trim() ?? "";
  if (!name || !credential) return null;
  return { name, credential };
}
