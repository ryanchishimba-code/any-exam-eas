import { AuthFocusLayout } from "@/components/auth/AuthFocusLayout";
import { formatPricingCheckoutTrialOffer, formatSignupTrialScope } from "@/lib/site";

/**
 * Client transitions to /signup used to paint an empty suspense fallback, then
 * follow a server redirect. Show the trial signup frame immediately.
 */
export default function SignupLoading() {
  return (
    <AuthFocusLayout
      title="Start your free trial."
      offer={formatPricingCheckoutTrialOffer()}
      detail={formatSignupTrialScope()}
    >
      <p className="aee-auth-step-status" role="status">
        Loading your trial signup…
      </p>
    </AuthFocusLayout>
  );
}
