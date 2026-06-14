import { createHash } from "crypto";

export function hashIp(req?: Request): string | undefined {
  if (!req) return undefined;
  return hashIpFromHeaders(req.headers);
}

export function hashIpFromHeaders(headers: Headers): string | undefined {
  const forwarded = headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? headers.get("x-real-ip");
  if (!ip) return undefined;
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

export function parseUserAgent(ua: string | null): {
  browser?: string;
  os?: string;
  deviceType?: string;
} {
  if (!ua) return {};
  const lower = ua.toLowerCase();
  let browser = "unknown";
  if (lower.includes("chrome") && !lower.includes("edg")) browser = "chrome";
  else if (lower.includes("firefox")) browser = "firefox";
  else if (lower.includes("safari") && !lower.includes("chrome")) browser = "safari";
  else if (lower.includes("edg")) browser = "edge";

  let os = "unknown";
  if (lower.includes("windows")) os = "windows";
  else if (lower.includes("mac os") || lower.includes("macintosh")) os = "macos";
  else if (lower.includes("android")) os = "android";
  else if (lower.includes("iphone") || lower.includes("ipad")) os = "ios";
  else if (lower.includes("linux")) os = "linux";

  let deviceType = "desktop";
  if (lower.includes("mobile") || lower.includes("iphone") || lower.includes("android"))
    deviceType = "mobile";
  else if (lower.includes("ipad") || lower.includes("tablet")) deviceType = "tablet";

  return { browser, os, deviceType };
}

export function getUserAgent(req?: Request): string | undefined {
  return req?.headers.get("user-agent") ?? undefined;
}
