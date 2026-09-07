import type { ReactNode } from "react";

/** Minimal chrome for NCLEX product surfaces (hub + study guide). */
export default function NclexProductLayout({ children }: { children: ReactNode }) {
  return <div className="sg-nclex-root">{children}</div>;
}
