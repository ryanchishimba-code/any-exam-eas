import { cookies } from "next/headers";
import {
  FIRST_TOUCH_COOKIE,
  FUNNEL_EVENT_COOKIE,
  decodeFirstTouch,
  type FirstTouchAttribution,
} from "@/lib/marketing/first-touch";

export async function readFirstTouchFromAuthCookies(): Promise<FirstTouchAttribution> {
  try {
    const jar = await cookies();
    return decodeFirstTouch(jar.get(FIRST_TOUCH_COOKIE)?.value);
  } catch {
    return {};
  }
}

/** Short-lived cookie so the browser can send signup_success / trial_start after OAuth. */
export async function stampFunnelEventCookie(events: string[]): Promise<void> {
  const value = events.filter(Boolean).join(",");
  if (!value) return;
  try {
    const jar = await cookies();
    jar.set(FUNNEL_EVENT_COOKIE, value, {
      path: "/",
      maxAge: 10 * 60,
      sameSite: "lax",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
    });
  } catch (error) {
    console.warn(
      "[funnel] event cookie skipped:",
      error instanceof Error ? error.message : error
    );
  }
}
