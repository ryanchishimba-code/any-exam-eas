"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import {
  VERCEL_FUNNEL_EVENTS,
  funnelPropsFromAttribution,
  trackVercelFunnel,
} from "@/lib/analytics/vercel-funnel";
import { mergeFirstTouch } from "@/lib/marketing/first-touch";
import { readClientFirstTouch } from "@/lib/marketing/first-touch-client";
import { AuthFocusLayout } from "@/components/auth/AuthFocusLayout";
import { SignupForm } from "@/components/SignupForm";
import { CONSENTED_TESTIMONIAL_SEEDS } from "@/lib/testimonials/consented-seed";
import { formatPricingCheckoutTrialOffer, formatSignupTrialScope } from "@/lib/site";
import type { BillingInterval } from "@/lib/billing-config";
import type { SignupPlan } from "@/lib/validators/auth";
import type { SubscriptionTier } from "@/lib/subscription-tiers";
import type { ExamSlug } from "@/types/edtech";

const SIGNUP_PROOF_NAMES = ["Nathan C.", "Priscilla J."] as const;

function SignupProof() {
  const quotes = SIGNUP_PROOF_NAMES.map((name) =>
    CONSENTED_TESTIMONIAL_SEEDS.find((row) => row.name === name)
  ).filter((row) => row != null);

  if (quotes.length === 0) return null;

  return (
    <section className="aee-auth-proof" aria-label="NCLEX students">
      {quotes.map((row) => (
        <figure key={row.id}>
          <blockquote>
            <p>{row.quote}</p>
          </blockquote>
          <figcaption>
            {row.name} · {row.exam}
          </figcaption>
        </figure>
      ))}
    </section>
  );
}

export function SignupScreen({
  initialPlan,
  initialPromo,
  initialPassCode = "",
  initialInterval,
  initialTier,
  initialExam,
  arrivedFromDaily = false,
  utmSource,
  utmMedium,
  utmCampaign,
}: {
  initialPlan: SignupPlan | "";
  initialPromo: string;
  initialPassCode?: string;
  initialInterval: BillingInterval;
  initialTier: SubscriptionTier;
  initialExam: ExamSlug | "";
  arrivedFromDaily?: boolean;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}) {
  const [plan, setPlan] = useState<SignupPlan>(initialPlan === "subscribe" ? "subscribe" : "trial");
  const trial = plan === "trial";
  const viewed = useRef(false);

  useEffect(() => {
    if (viewed.current) return;
    viewed.current = true;
    const touch = mergeFirstTouch(readClientFirstTouch(), {
      utmSource,
      utmMedium,
      utmCampaign,
    });
    trackVercelFunnel(VERCEL_FUNNEL_EVENTS.SIGNUP_VIEW, {
      plan: trial ? "trial" : "subscribe",
      ...funnelPropsFromAttribution(touch),
    });
  }, [trial, utmCampaign, utmMedium, utmSource]);

  useEffect(() => {
    if (!arrivedFromDaily) return;
    try {
      track("signup_from_daily", { board: initialExam || "unset" });
    } catch {
      /* non-blocking */
    }
  }, [arrivedFromDaily, initialExam]);

  return (
    <AuthFocusLayout
      title={trial ? "Start your free trial." : "Create your account."}
      offer={trial ? formatPricingCheckoutTrialOffer() : undefined}
      detail={
        trial
          ? formatSignupTrialScope()
          : "Create your account, then pay securely at checkout to unlock Pro."
      }
      after={<SignupProof />}
    >
      <SignupForm
        plan={plan}
        onPlanChange={setPlan}
        initialPromo={initialPromo}
        initialPassCode={initialPassCode}
        initialInterval={initialInterval}
        initialTier={initialTier}
        initialExam={initialExam}
        attribution={{ utmSource, utmMedium, utmCampaign }}
      />
    </AuthFocusLayout>
  );
}
