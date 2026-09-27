import type { ReactNode } from "react";
import { LEGAL_ENTITY } from "@/lib/legal";

/** Short hours label from the same support constant as the phone number. */
export function SupportHoursNote({
  className,
  variant = "help",
}: {
  className?: string;
  variant?: "help" | "support";
}) {
  const phone = LEGAL_ENTITY.supportPhone;
  return <span className={className}>{variant === "support" ? phone.supportLabel : phone.helpLabel}</span>;
}

/** Tappable support number. Display and href both come from LEGAL_ENTITY. */
export function SupportPhoneLink({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <a href={LEGAL_ENTITY.supportPhone.tel} className={className}>
      {children}
      {LEGAL_ENTITY.supportPhone.display}
    </a>
  );
}
