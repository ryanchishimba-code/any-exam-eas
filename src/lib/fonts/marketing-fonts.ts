import { Inter, Plus_Jakarta_Sans } from "next/font/google";

/** Body copy — app-wide; not preloaded (display font is LCP priority on marketing). */
export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  adjustFontFallback: true,
  preload: false,
  variable: "--font-body",
});

/** Marketing display — headings, nav wordmark, stat figures; preloaded on marketing routes. */
export const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "800"],
  display: "swap",
  adjustFontFallback: true,
  preload: true,
  variable: "--font-display",
});

export const marketingFontVariables = `${inter.variable} ${plusJakarta.variable}`;
