import Link from "next/link";
import type { BillingInterval } from "@/lib/billing-config";
import {
  factualYearlySavingsBadge,
  formatIntervalEquivalentLine,
  formatPlanUsd,
  getBillingPlanTier,
} from "@/lib/billing-plans";
import { PRICING_TRIAL_OFFER_LINE, TESTIMONIAL_RESULTS_NOTE } from "@/lib/marketing/legal-copy";
import { pricingFaqItems } from "@/lib/marketing/pricing-faq";
import { CONSENTED_TESTIMONIAL_SEEDS } from "@/lib/testimonials/consented-seed";
import { TRIAL_CTA_LABEL } from "@/lib/site";
import { ROUTES } from "@/lib/routes";
import { LEGAL_ENTITY } from "@/lib/legal";
import { PricingViewBeacon } from "@/components/pricing/PricingViewBeacon";
import { cn } from "@/lib/utils";

const INTERVALS: BillingInterval[] = ["monthly", "yearly", "semiannual", "quarterly"];
const PRIMARY: BillingInterval[] = ["monthly", "yearly"];
const MORE: BillingInterval[] = ["semiannual", "quarterly"];

const PROOF_ORDER = ["Mag B.", "Nathan C.", "Priscilla J.", "Frank C.", "Steven", "Nick B."] as const;

const CARD_REFUND =
  "Payments are non-refundable (except where required by law). Found a flawed question? Report it and we'll review it. This is not a refund.";

type PricingTiersProps = {
  className?: string;
};

function trialHref(interval: BillingInterval): string {
  const params = new URLSearchParams({ plan: "trial", tier: "pro", interval });
  return `/signup?${params.toString()}`;
}

function examShort(exam: string): string {
  if (exam.startsWith("NCLEX")) return "NCLEX";
  if (exam.startsWith("NAPLEX")) return "NAPLEX";
  if (exam.startsWith("PANCE")) return "PANCE";
  if (exam.includes("FNP")) return "FNP";
  return exam;
}

function unitLabel(interval: BillingInterval): string {
  if (interval === "monthly") return "per month";
  if (interval === "yearly") return "per year";
  if (interval === "semiannual") return "every 6 months";
  return "every 3 months";
}

/**
 * Server-rendered Pro offer. The billing radios are native controls, so the
 * price and trial link are in the document before the footer.
 */
export function PricingTiers({ className }: PricingTiersProps) {
  const plans = INTERVALS.map((interval) => getBillingPlanTier("pro", interval));
  const save = factualYearlySavingsBadge("pro");
  const featured = CONSENTED_TESTIMONIAL_SEEDS.find((row) => row.name === "Mag B.");
  const proof = PROOF_ORDER.map((name) => CONSENTED_TESTIMONIAL_SEEDS.find((row) => row.name === name)).filter(
    (row): row is (typeof CONSENTED_TESTIMONIAL_SEEDS)[number] => Boolean(row)
  );

  return (
    <div className={cn("aee-pricing-offer", className)} data-pricing-fold>
      <PricingViewBeacon />
      <div className="aee-pricing-card">
        <div className="aee-pricing-figures" aria-live="polite">
          {plans.map((plan) => (
            <p key={plan.interval} className="aee-pricing-figure" data-interval={plan.interval}>
              <span className="aee-pricing-dollars">{formatPlanUsd(plan.totalUsd)}</span>
              <span className="aee-pricing-unit">{unitLabel(plan.interval)}</span>
            </p>
          ))}
        </div>

        <fieldset className="aee-pricing-cycles">
          <legend>Billing cycle</legend>
          <div className="aee-pricing-primary">
            {PRIMARY.map((interval) => {
              const plan = plans.find((item) => item.interval === interval)!;
              return (
                <label key={interval} className="aee-pricing-cycle">
                  <input
                    id={`billing-${interval}`}
                    className="aee-pricing-radio"
                    type="radio"
                    name="billing-interval"
                    value={interval}
                    defaultChecked={interval === "monthly"}
                  />
                  <span className="aee-pricing-cycle__name">
                    {plan.label}
                    {interval === "yearly" && save ? <span className="aee-pricing-save">{save}</span> : null}
                  </span>
                  <span className="aee-pricing-cycle__price">{formatIntervalEquivalentLine("pro", interval)}</span>
                </label>
              );
            })}
          </div>
          <details className="aee-pricing-more">
            <summary>Other billing options</summary>
            <div className="aee-pricing-primary">
              {MORE.map((interval) => {
                const plan = plans.find((item) => item.interval === interval)!;
                return (
                  <label key={interval} className="aee-pricing-cycle">
                    <input
                      id={`billing-${interval}`}
                      className="aee-pricing-radio"
                      type="radio"
                      name="billing-interval"
                      value={interval}
                    />
                    <span className="aee-pricing-cycle__name">{plan.label}</span>
                    <span className="aee-pricing-cycle__price">{formatIntervalEquivalentLine("pro", interval)}</span>
                  </label>
                );
              })}
            </div>
          </details>
        </fieldset>

        {plans.map((plan) => (
          <a
            key={plan.interval}
            className="aee-pricing-cta"
            data-interval={plan.interval}
            href={trialHref(plan.interval)}
          >
            {TRIAL_CTA_LABEL}
          </a>
        ))}

        <p className="aee-pricing-trial text-sm">{PRICING_TRIAL_OFFER_LINE}</p>
        <p className="aee-pricing-cancel">Cancel anytime in Settings.</p>
        {featured ? (
          <blockquote className="aee-pricing-pull">
            <p>“{featured.quote}”</p>
            <footer>
              {featured.name} <span>({examShort(featured.exam)})</span>
            </footer>
          </blockquote>
        ) : null}
        <p className="aee-pricing-fine">{CARD_REFUND}</p>
        <p className="aee-pricing-login">
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </div>

      <ul className="aee-pricing-proof" aria-label="From students">
        {proof
          .filter((row) => row.name !== "Mag B.")
          .map((row) => (
            <li key={row.id}>
              <p>“{row.quote}”</p>
              <p>
                {row.name} <span>({examShort(row.exam)})</span>
              </p>
            </li>
          ))}
      </ul>
      <p className="aee-pricing-note">{TESTIMONIAL_RESULTS_NOTE}</p>

      <ol className="aee-pricing-path">
        <li>
          <strong>Roadmap.</strong> A personalized study plan mapped to the official blueprint for your exam.
        </li>
        <li>
          <strong>Deep Dive.</strong> Structured review modules you open from missed questions.
        </li>
        <li>
          <strong>Full Exam.</strong> Timed, full-length practice exams with board-day pacing.
        </li>
      </ol>

      <section className="aee-pricing-faq" aria-labelledby="pricing-faq-heading">
        <h2 id="pricing-faq-heading">Questions before you start</h2>
        {pricingFaqItems().map((item) => (
          <div key={item.question}>
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </div>
        ))}
      </section>

      <p className="aee-pricing-links">
        <Link href="/legal/refunds">Refunds and cancellation</Link>
        <span aria-hidden> · </span>
        <Link href="/legal/terms">Terms</Link>
        <span aria-hidden> · </span>
        <Link href={ROUTES.howQuestionsAreReviewed}>How questions are reviewed</Link>
        <span aria-hidden> · </span>
        <a href={`mailto:${LEGAL_ENTITY.supportEmail}`}>{LEGAL_ENTITY.supportEmail}</a>
      </p>
    </div>
  );
}
