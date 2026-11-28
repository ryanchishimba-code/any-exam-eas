import { beforeEach, describe, expect, it } from "vitest";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";
import nextConfig from "../../../next.config";
import { usmleVideoRouteDecision } from "@/lib/quick-bites/usmle-video-flags";

function authorize(path: string, role: string | null, search = "") {
  const nextUrl = new URL(`https://www.anyexameasy.com${path}${search}`);
  return authConfig.callbacks.authorized({
    auth: role ? ({ user: { id: "user-1", role } } as never) : null,
    request: {
      nextUrl: {
        pathname: nextUrl.pathname,
        search: nextUrl.search,
        clone() {
          return new URL(nextUrl.toString());
        },
      },
    } as never,
  });
}

describe("USMLE video URL while the flag is off", () => {
  beforeEach(() => {
    delete process.env.USMLE_VIDEO_QUICK_BITES_PUBLIC;
    delete process.env.NEXT_PUBLIC_USMLE_VIDEO_QUICK_BITES_PUBLIC;
  });

  it("is not a static redirect, so staff preview can reach the page", async () => {
    const rules = await nextConfig.redirects?.();
    expect(rules?.some((rule) => rule.source === "/usmle/quick-bites")).toBe(false);
  });

  it("sends students to Rapid Review Cards with an HTTP 308 and keeps the query", () => {
    expect(usmleVideoRouteDecision(false, false)).toBe("cards");
    const result = authorize("/usmle/quick-bites", null, "?step=3");
    expect(result).toBeInstanceOf(NextResponse);
    if (!(result instanceof NextResponse)) return;
    expect(result.status).toBe(308);
    expect(result.headers.get("location")).toBe(
      "https://www.anyexameasy.com/usmle/rapid-review?step=3"
    );
  });

  it("lets staff open the video page", () => {
    expect(usmleVideoRouteDecision(false, true)).toBe("videos");
    expect(authorize("/usmle/quick-bites", "admin")).toBe(true);
    expect(authorize("/usmle/quick-bites", "support_staff")).toBe(true);
  });

  it("serves videos to signed-in students once the flag is on", () => {
    process.env.USMLE_VIDEO_QUICK_BITES_PUBLIC = "1";
    expect(usmleVideoRouteDecision(true, false)).toBe("videos");
    expect(authorize("/usmle/quick-bites", "user")).toBe(true);
  });
});
