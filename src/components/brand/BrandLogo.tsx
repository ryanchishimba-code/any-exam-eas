import Image from "next/image";
import Link from "next/link";
import { BRAND_LOGO, BRAND_LOGO_NAV } from "@/lib/marketing/brand";
import { cn } from "@/lib/utils";

const VARIANTS = {
  nav: "h-10 w-auto",
  hero: "w-36 h-auto sm:w-44",
  footer: "w-32 h-auto",
} as const;

/** Keep next/image from requesting 750–1920px for a ~40px nav mark. */
const SIZES = {
  nav: "40px",
  hero: "(max-width: 640px) 144px, 176px",
  footer: "128px",
} as const;

type Props = {
  href?: string;
  variant?: keyof typeof VARIANTS;
  className?: string;
  linkClassName?: string;
  priority?: boolean;
};

/**
 * Horizontal wordmark for nav. The stacked PNG/WebP is a tall portrait with
 * padding; at `h-10` it collapses to an unreadable speck on light marketing pages.
 * Mark and word colors live in CSS so they stay AA on a light hero and a navy bar.
 */
function NavWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("aee-nav-wordmark inline-flex items-center gap-2", className)}>
      <svg viewBox="0 0 40 40" className="aee-nav-mark h-8 w-8 shrink-0" aria-hidden>
        <path className="aee-nav-mark__cap" d="M6 16.5 20 10l14 6.5-14 6.5L6 16.5Z" />
        <path
          className="aee-nav-mark__arch"
          d="M32.5 17.2v7.2c0 2.6-5.4 4.6-12.5 4.6S7.5 27 7.5 24.4v-7.2"
          fill="none"
        />
        <path
          className="aee-nav-mark__check"
          d="M14.5 22.2 18.2 26l7.3-8.4"
          fill="none"
        />
      </svg>
      <span className="aee-nav-wordmark__text hidden text-[0.9375rem] font-semibold tracking-tight md:inline">
        AnyExamEasy
      </span>
    </span>
  );
}

export function BrandLogo({
  href,
  variant = "nav",
  className,
  linkClassName,
  priority = false,
}: Props) {
  const mark =
    variant === "nav" ? (
      <NavWordmark className={className} />
    ) : (
      <Image
        src={(variant === "hero" ? BRAND_LOGO : BRAND_LOGO_NAV).src}
        alt={BRAND_LOGO.alt}
        width={(variant === "hero" ? BRAND_LOGO : BRAND_LOGO_NAV).width}
        height={(variant === "hero" ? BRAND_LOGO : BRAND_LOGO_NAV).height}
        className={cn(VARIANTS[variant], className)}
        sizes={SIZES[variant]}
        priority={priority}
      />
    );

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          "inline-flex shrink-0 items-center transition hover:opacity-85",
          linkClassName
        )}
        aria-label="AnyExamEasy"
      >
        {mark}
      </Link>
    );
  }

  return mark;
}
