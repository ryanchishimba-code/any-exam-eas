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
      <li>Encrypted sign-in. No payment method until you choose Pro.</li>
      <li>
        <a href={`mailto:${LEGAL_ENTITY.supportEmail}`}>{LEGAL_ENTITY.supportEmail}</a>
      </li>
      <li>
        <SupportPhoneLink />
      </li>
    </ul>
  );
}
