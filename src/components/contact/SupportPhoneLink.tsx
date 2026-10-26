import type { ReactNode } from "react";
import { LEGAL_SUPPORT_PHONE } from "@/lib/legal-phone";

/** Tappable support number. Used on Terms, Privacy, and Refunds only. */
export function SupportPhoneLink({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <a href={LEGAL_SUPPORT_PHONE.tel} className={className}>
      {children}
      {LEGAL_SUPPORT_PHONE.display}
    </a>
  );
}
