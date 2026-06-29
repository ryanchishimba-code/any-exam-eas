/** Shared width tokens for the app shell and full-width study surfaces. */
export const shellUi = {
  /** Matches top nav and main content column on desktop. */
  container: "mx-auto w-full max-w-[1680px]",
  /** Page content fills the main column beside the sidebar. */
  page: "w-full min-w-0",
} as const;

/**
 * Named content widths so marketing, app, and focused surfaces stay consistent
 * instead of each page inventing its own max-w-* value.
 */
export const contentWidth = {
  /** Wide marketing / reading column (resources, long-form). */
  wide: "max-w-5xl",
  /** Default content column for standard pages (pricing, results). */
  content: "max-w-3xl",
  /** Focused single-task column (legacy — prefer auth). */
  focus: "max-w-md",
  /** Sign up / log in — wider on desktop, full width on mobile. */
  auth: "max-w-xl lg:max-w-2xl",
} as const;
