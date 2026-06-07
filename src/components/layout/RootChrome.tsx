"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { hideMarketingChrome } from "@/lib/navigation/app-shell";

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
