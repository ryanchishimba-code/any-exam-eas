import type { ReactNode } from "react";

/** Minimal chrome for the NCLEX hub. The study guide reader lives in the
 *  `(app)` group so it gets the app shell. */
export default function NclexProductLayout({ children }: { children: ReactNode }) {
  return <div className="sg-nclex-root">{children}</div>;
}
