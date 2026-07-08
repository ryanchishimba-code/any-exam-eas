"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";
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

export function RootChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const minimal = hideMarketingChrome(pathname);

  if (minimal) {
    return <>{children}</>;
  }

  return (
    <>
      <Navigation />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
