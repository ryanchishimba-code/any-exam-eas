import type { ReactNode } from "react";

/** Auth pages sit outside `(marketing)` — inherit the same teal tokens. */
export function AuthMarketingShell({ children }: { children: ReactNode }) {
  return <div className="aee-marketing">{children}</div>;
}
