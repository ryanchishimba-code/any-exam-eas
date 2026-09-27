"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { MARKETING_DARK_HERO_PATHS } from "@/lib/marketing/board-paths";
import { hideMarketingChrome } from "@/lib/navigation/app-shell";

const Navigation = dynamic(
  () => import("@/components/Navigation").then((m) => m.Navigation),
  {
    ssr: true,
    loading: () => (
      <header
        className="sticky top-0 z-50 h-[var(--nav-height)] border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md"
        aria-hidden
      />
    ),
  }
);

const PublicFoldOffer = dynamic(
  () => import("@/components/marketing/PublicFoldOffer").then((m) => m.PublicFoldOffer),
  { ssr: true }
);

const FOLD_HIDDEN_PREFIXES = [
  "/pricing",
  "/exam",
  "/practice",
  "/progress",
  "/admin",
  "/internal",
  "/onboarding",
  "/study",
  "/learn",
  "/register",
  "/forgot-password",
  "/reset-password",
];

function showPublicFoldOffer(pathname: string): boolean {
  const path = (pathname || "/").split("?")[0] || "/";
  if (MARKETING_DARK_HERO_PATHS.has(path)) return false;
  return !FOLD_HIDDEN_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export function RootChrome({
  children,
  footer,
}: {
  children: ReactNode;
  footer: ReactNode;
}) {
  const pathname = usePathname();
  const minimal = hideMarketingChrome(pathname);

  if (minimal) {
    return <>{children}</>;
  }

  return (
    <>
      <Navigation />
      {showPublicFoldOffer(pathname) ? <PublicFoldOffer /> : null}
      <main id="main-content">{children}</main>
      {footer}
    </>
  );
}
