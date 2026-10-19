import type { ReactNode } from "react";
import "@/styles/landing-theme.css";
import "@/styles/landing-flagship.css";
import "@/styles/board-landing.css";

/** Marketing chrome for the public NAPLEX hub (`/naplex`).
 *  The study guide reader lives in the `(app)` group so it gets the app shell.
 *  Flagship CSS must load here — this route is outside `(marketing)`. */
export default function NaplexProductLayout({ children }: { children: ReactNode }) {
  return <div className="aee-marketing">{children}</div>;
}
