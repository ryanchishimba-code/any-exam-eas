import Link from "next/link";
import { type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-[#0f766e] text-white shadow-[0_2px_12px_rgba(15,118,110,0.3)] hover:bg-[#115e59] hover:shadow-[0_4px_18px_rgba(15,118,110,0.35)] active:scale-[0.98]",
  secondary:
    "border border-black/[0.08] bg-white/90 text-[var(--color-ink)] shadow-[var(--shadow-apple-sm)] hover:bg-[var(--color-surface)] hover:border-black/[0.12] active:scale-[0.98]",
  ghost:
    "bg-transparent text-[var(--color-accent)] hover:opacity-80 active:scale-[0.98]",
};

export function Button({
  children,
  variant = "primary",
  href,
  className = "",
  type = "button",
  ...props
}: {
  children: ReactNode;
  variant?: Variant;
  href?: string;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    "inline-flex items-center justify-center rounded-full px-7 py-3 text-[0.9375rem] font-medium tracking-tight transition-all duration-300 ease-[var(--ease-apple)]";

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        prefetch={href.startsWith("/pricing") ? false : undefined}
        className={classes}
        onClick={props.onClick as ((e: MouseEvent<HTMLAnchorElement>) => void) | undefined}
      >
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
