import Link from "next/link";
import { FINISH_LINE_TERMS_PATH } from "@/lib/marketing/finish-line-offer";
import { cn } from "@/lib/utils";

const linkClass =
  "font-semibold text-[var(--color-accent)] underline underline-offset-2";

type Props = {
  finishLineOfferEnabled: boolean;
  className?: string;
};

/** “Payments are non-refundable…” with optional Finish Line Refund terms link. */
export function PaymentsNonRefundablePhrase({ finishLineOfferEnabled, className }: Props) {
  if (!finishLineOfferEnabled) {
    return (
      <span className={className}>
        Payments are non-refundable except where required by law.
      </span>
    );
  }
  return (
    <span className={className}>
      Payments are non-refundable, except under the{" "}
      <Link href={FINISH_LINE_TERMS_PATH} prefetch={false} className={cn(linkClass)}>
        Finish Line Refund terms
      </Link>{" "}
      or where required by law.
    </span>
  );
}

export function PaidChargesNonRefundablePhrase({ finishLineOfferEnabled, className }: Props) {
  if (!finishLineOfferEnabled) {
    return (
      <span className={className}>
        Paid charges are non-refundable except where the law requires a refund.
      </span>
    );
  }
  return (
    <span className={className}>
      Paid charges are non-refundable, except under the{" "}
      <Link href={FINISH_LINE_TERMS_PATH} prefetch={false} className={cn(linkClass)}>
        Finish Line Refund terms
      </Link>{" "}
      or where required by law.
    </span>
  );
}
