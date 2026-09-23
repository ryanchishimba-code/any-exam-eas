import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { isCronAuthorized } from "./cron-auth";

function request(headers?: Record<string, string>): Request {
  return new Request("https://example.com/api/cron/revalidate-inventory", { headers });
}

describe("isCronAuthorized", () => {
  const env = { CRON_SECRET: "test-secret", VERCEL: "1" };

  it("accepts the production bearer secret", () => {
    expect(
      isCronAuthorized(request({ authorization: "Bearer test-secret" }), env)
    ).toBe(true);
  });

  it("accepts a bearer together with the Vercel cron header", () => {
    expect(
      isCronAuthorized(
        request({
          authorization: "Bearer test-secret",
          "x-vercel-cron": "1",
        }),
        env
      )
    ).toBe(true);
  });

  it("trims CRON_SECRET the same way operators send it", () => {
    expect(
      isCronAuthorized(request({ authorization: "Bearer test-secret" }), {
        CRON_SECRET: "  test-secret  ",
        VERCEL: "1",
      })
    ).toBe(true);
  });

  it("rejects a spoofed x-vercel-cron header without the bearer", () => {
    expect(isCronAuthorized(request({ "x-vercel-cron": "1" }), env)).toBe(false);
    expect(
      isCronAuthorized(
        request({ authorization: "Bearer wrong", "x-vercel-cron": "1" }),
        env
      )
    ).toBe(false);
  });

  it("rejects missing, blank, and mismatched credentials", () => {
    expect(isCronAuthorized(request(), env)).toBe(false);
    expect(isCronAuthorized(request({ authorization: "Bearer wrong" }), env)).toBe(false);
    expect(isCronAuthorized(request({ authorization: "bearer test-secret" }), env)).toBe(false);
    expect(
      isCronAuthorized(request({ authorization: "Bearer test-secret" }), { VERCEL: "1" })
    ).toBe(false);
    expect(
      isCronAuthorized(request({ authorization: "Bearer " }), { CRON_SECRET: "   " })
    ).toBe(false);
  });
});

describe("cron route authorization", () => {
  it("does not trust x-vercel-cron inside /api/cron handlers", () => {
    const root = path.join(process.cwd(), "src/app/api/cron");
    const routes = readdirSync(root)
      .map((name) => path.join(root, name, "route.ts"))
      .filter((file) => {
        try {
          return statSync(file).isFile();
        } catch {
          return false;
        }
      });

    expect(routes.length).toBeGreaterThan(0);
    for (const file of routes) {
      const source = readFileSync(file, "utf8");
      expect(source, file).not.toMatch(/x-vercel-cron/);
      expect(source, file).toMatch(/isCronAuthorized\(/);
    }
  });
});
