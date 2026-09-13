import type { ReactNode } from "react";
import "@/styles/landing-theme.css";
import "@/styles/landing-flagship.css";

/** Marketing chrome for the public NCLEX hub (`/nclex`).
 *  The study guide reader lives in the `(app)` group so it gets the app shell.
 *  Flagship CSS must load here — this route is outside `(marketing)`. */
export default function NclexProductLayout({ children }: { children: ReactNode }) {
  return <div className="aee-marketing sg-nclex-root">{children}</div>;
}
