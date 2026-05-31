"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/study", label: "Overview" },
  { href: "/study/drugs300", label: "Top 500 Drugs" },
  { href: "/study/practice", label: "Question bank" },
  { href: "/study/practice?mode=adaptive", label: "Personalized" },
  { href: "/generate", label: "AI practice" },
  { href: "/engine/test", label: "Engine lab" },
  { href: "/study/analytics", label: "Analytics" },
];

export function StudySubnav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/study") return pathname === "/study";
    if (href === "/study/drugs300") return pathname.startsWith("/study/drugs300");
    if (href === "/study/practice") {
      return pathname.startsWith("/study/practice") && !pathname.includes("analytics");
    }
    if (href.startsWith("/generate")) return pathname.startsWith("/generate");
    if (href.startsWith("/engine")) return pathname.startsWith("/engine");
    if (href.includes("analytics")) return pathname === "/study/analytics";
    return pathname === href;
  }

  return (
    <nav className="apple-product-nav mt-10" aria-label="Study navigation">
      {links.map((l) => (
        <Link key={l.href} href={l.href} data-active={isActive(l.href) ? "true" : undefined}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
