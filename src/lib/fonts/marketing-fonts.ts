import localFont from "next/font/local";

/**
 * Self-hosted latin subsets of Inter and Plus Jakarta Sans.
 * next/font/google downloads these at build time and crashes when a Google
 * Fonts file URL has no extension. The files are the same woff2 faces.
 * Both families are licensed under the SIL Open Font License.
 */

/** Body copy — app-wide. Optional so a late download cannot shift the page. */
export const inter = localFont({
  src: "./files/inter-latin.woff2",
  weight: "400 600",
  display: "optional",
  adjustFontFallback: "Arial",
  preload: false,
  fallback: ["Arial", "Helvetica", "sans-serif"],
  declarations: [{ prop: "font-family", value: "Inter" }],
  variable: "--font-body",
});

/**
 * Marketing display — headings, nav wordmark, stat figures; preloaded on marketing routes.
 * Arial is the size-adjusted fallback so the swap does not reflow the hero.
 */
export const plusJakarta = localFont({
  src: "./files/plus-jakarta-sans-latin.woff2",
  weight: "600 800",
  display: "swap",
  adjustFontFallback: "Arial",
  preload: true,
  fallback: ["Arial", "Helvetica", "sans-serif"],
  declarations: [{ prop: "font-family", value: "Plus Jakarta Sans" }],
  variable: "--font-display",
});

export const marketingFontVariables = `${inter.variable} ${plusJakarta.variable}`;
