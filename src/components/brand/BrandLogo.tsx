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

export function BrandLogo({
  href,
  variant = "nav",
  className,
  linkClassName,
  priority = false,
}: Props) {
  const asset = variant === "hero" ? BRAND_LOGO : BRAND_LOGO_NAV;
  const image = (
    <Image
      src={asset.src}
      alt={asset.alt}
      width={asset.width}
      height={asset.height}
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
      >
        {image}
      </Link>
    );
  }

  return image;
}
