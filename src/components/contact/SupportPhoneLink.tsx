import type { ReactNode } from "react";
import { LEGAL_ENTITY } from "@/lib/legal";

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
