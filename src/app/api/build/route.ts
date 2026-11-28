import { NextResponse } from "next/server";
import { publicBuildSha } from "@/lib/build-sha";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Public commit of the deployment serving this host.
 * The production student smoke polls it. No secrets.
 */
export function GET() {
  const sha = publicBuildSha();
  const headers: Record<string, string> = {
    "Cache-Control": "no-store",
    "X-Robots-Tag": "noindex",
  };
  if (sha) headers["x-aee-build-sha"] = sha;
  return NextResponse.json({ sha }, { headers });
}
