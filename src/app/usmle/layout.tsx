import type { ReactNode } from "react";
import "@/styles/landing-theme.css";
import "@/styles/landing-flagship.css";
import "@/styles/board-landing.css";

export default function UsmleProductLayout({ children }: { children: ReactNode }) {
  return <div className="aee-marketing sg-usmle-root">{children}</div>;
}
