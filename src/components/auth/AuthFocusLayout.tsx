import type { ReactNode } from "react";
import "@/styles/auth-focus.css";
import "@/styles/landing-theme.css";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { AuthProductVisual } from "@/components/auth/AuthProductVisual";
import { AuthTrustStrip } from "@/components/auth/AuthTrustStrip";
import { ROUTES } from "@/lib/routes";

type AuthFocusLayoutProps = {
  title: string;
  /** Approved trial sentence. Rendered exactly. */
  offer?: string;
  detail?: string;
  children: ReactNode;
};

/**
 * Distraction-free auth frame: logo, one headline, form.
 * The product panel is desktop-only.
 */
export function AuthFocusLayout({ title, offer, detail, children }: AuthFocusLayoutProps) {
  return (
    <div className="aee-marketing aee-auth-focus">
      <main id="main-content" className="aee-auth-main">
        <div className="aee-auth-logo">
          <BrandLogo href={ROUTES.home} variant="nav" priority />
        </div>
        <div className="aee-auth-body">
          <h1 className="aee-auth-title">{title}</h1>
          {offer ? <p className="aee-auth-offer">{offer}</p> : null}
          {detail ? <p className="aee-auth-detail">{detail}</p> : null}
          <div className="aee-auth-form">{children}</div>
          <AuthTrustStrip />
        </div>
      </main>
      <AuthProductVisual />
    </div>
  );
}
