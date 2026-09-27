import { SupportPhoneLink } from "@/components/contact/SupportPhoneLink";
import { CLINICAL_REVIEWERS } from "@/lib/marketing/company";
import { LEGAL_ENTITY } from "@/lib/legal";

const nursing = CLINICAL_REVIEWERS.find((reviewer) => reviewer.id === "nursing");
const pharmacy = CLINICAL_REVIEWERS.find((reviewer) => reviewer.id === "pharmacy");

/**
 * Calm proof under auth forms. Names come from the public reviewer list.
 * No pass claims, rankings, or unpublished stats.
 */
export function AuthTrustStrip() {
  const reviewers =
    nursing && pharmacy
      ? `${nursing.displayName} and ${pharmacy.displayName}`
      : CLINICAL_REVIEWERS.map((reviewer) => reviewer.displayName).join(" and ");

  return (
    <ul className="aee-auth-trust">
      <li>Content review led by {reviewers}</li>
      <li>Cancel anytime</li>
      <li>
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path
            fill="currentColor"
            d="M8 1.25a3.25 3.25 0 0 0-3.25 3.25V6H4.5A1.5 1.5 0 0 0 3 7.5v5A1.5 1.5 0 0 0 4.5 14h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 6h-.25V4.5A3.25 3.25 0 0 0 8 1.25Zm-2 3.25a2 2 0 1 1 4 0V6H6V4.5ZM8 9a1 1 0 0 1 .5 1.866V12h-1v-1.134A1 1 0 0 1 8 9Z"
          />
        </svg>
        <span>Encrypted sign-in. No payment method until you choose Pro.</span>
      </li>
      <li>
        <a href={`mailto:${LEGAL_ENTITY.supportEmail}`}>{LEGAL_ENTITY.supportEmail}</a>
      </li>
      <li>
        <SupportPhoneLink />
      </li>
    </ul>
  );
}
