import { Inter, Plus_Jakarta_Sans } from "next/font/google";

/** Body copy — app-wide. Optional so a late download cannot shift the page. */
export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "optional",
  adjustFontFallback: true,
  preload: false,
  variable: "--font-body",
});

/**
 * Marketing display — headings, nav wordmark, stat figures; preloaded on marketing routes.
 * `adjustFontFallback` emits a size-adjusted Arial fallback so the swap does not
 * reflow the hero. Optional would avoid the swap entirely and change the first paint.
 */
export const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "800"],
  display: "swap",
  adjustFontFallback: true,
  fallback: ["Arial", "Helvetica", "sans-serif"],
  preload: true,
  variable: "--font-display",
});

export const marketingFontVariables = `${inter.variable} ${plusJakarta.variable}`;
