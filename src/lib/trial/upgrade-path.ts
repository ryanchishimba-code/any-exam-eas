/** In-app upgrade screen — trial and post-trial free users. */
export function trialUpgradeScreenHref(returnPath = "/dashboard", reason?: string): string {
  const params = new URLSearchParams();
  if (returnPath) params.set("return", returnPath);
  if (reason) params.set("reason", reason);
  const query = params.toString();
  return query ? `/upgrade?${query}` : "/upgrade";
}
