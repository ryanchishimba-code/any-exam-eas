"use client";

import { FinishLineOfferMarkup } from "@/components/marketing/finish-line/FinishLineOfferMarkup";

type Props = {
  enabled: boolean;
};

export function FinishLineCheckoutNote({ enabled }: Props) {
  if (!enabled) return null;
  return <FinishLineOfferMarkup variant="checkout" />;
}
