import Image from "next/image";
import Link from "next/link";
import { BRAND_LOGO } from "@/lib/marketing/brand";
import { cn } from "@/lib/utils";

const VARIANTS = {
  nav: "h-10 w-auto",
  hero: "w-36 h-auto sm:w-44",
  footer: "w-32 h-auto",
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
  priority,
}: Props) {
  const image = (
    <Image
      src={BRAND_LOGO.src}
      alt={BRAND_LOGO.alt}
      width={BRAND_LOGO.width}
      height={BRAND_LOGO.height}
      className={cn(VARIANTS[variant], className)}
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
