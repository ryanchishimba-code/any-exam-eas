import type { ReactNode } from "react";
import "@/styles/landing-theme.css";
import "@/styles/landing-flagship.css";
import "@/styles/board-landing.css";

export default function PanceProductLayout({ children }: { children: ReactNode }) {
  return <div className="aee-marketing sg-pance-root">{children}</div>;
}
