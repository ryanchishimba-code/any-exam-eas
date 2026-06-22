/** Browser session id shared by page-view beacons and conversion events. */
export const ANALYTICS_SESSION_KEY = "aee_analytics_sid";

export function getOrCreateAnalyticsSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let sid = sessionStorage.getItem(ANALYTICS_SESSION_KEY);
    if (!sid) {
      sid = crypto.randomUUID();
      sessionStorage.setItem(ANALYTICS_SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return "";
  }
}
