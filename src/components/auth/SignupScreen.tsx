"use client";

import { useState } from "react";
import { AuthFocusLayout } from "@/components/auth/AuthFocusLayout";
import { SignupForm } from "@/components/SignupForm";
import { formatPricingCheckoutTrialOffer, formatSignupTrialScope } from "@/lib/site";
import type { BillingInterval } from "@/lib/billing-config";
import type { SignupPlan } from "@/lib/validators/auth";
import type { SubscriptionTier } from "@/lib/subscription-tiers";
import type { ExamSlug } from "@/types/edtech";

export function SignupScreen({
  initialPlan,
  initialPromo,
  initialInterval,
  initialTier,
  initialExam,
}: {
  initialPlan: SignupPlan | "";
  initialPromo: string;
  initialInterval: BillingInterval;
  initialTier: SubscriptionTier;
  initialExam: ExamSlug | "";
}) {
  const [plan, setPlan] = useState<SignupPlan>(initialPlan === "subscribe" ? "subscribe" : "trial");
  const trial = plan === "trial";

  return (
    <AuthFocusLayout
      title={trial ? "Start your free trial." : "Create your account."}
      offer={trial ? formatPricingCheckoutTrialOffer() : undefined}
      detail={
        trial
          ? formatSignupTrialScope()
          : "Create your account, then pay securely at checkout to unlock Pro."
      }
    >
      <SignupForm
        plan={plan}
        onPlanChange={setPlan}
        initialPromo={initialPromo}
        initialInterval={initialInterval}
        initialTier={initialTier}
        initialExam={initialExam}
      />
    </AuthFocusLayout>
  );
}
