import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: vi.fn() },
  },
}));

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GET } from "@/app/api/admin/marketing/export/route";

const authMock = vi.mocked(auth);
const findUser = vi.mocked(prisma.user.findUnique);

function authorize(role: string | null) {
  const nextUrl = new URL("https://www.anyexameasy.com/admin/marketing");
  return authConfig.callbacks.authorized({
    auth: role ? ({ user: { id: "user-1", role } } as never) : null,
    request: { nextUrl } as never,
  });
}

function locationOf(result: unknown): string | null {
  if (result instanceof NextResponse || result instanceof Response) {
    return result.headers.get("location");
  }
  return null;
}

describe("marketing admin auth", () => {
  beforeEach(() => {
    authMock.mockReset();
    findUser.mockReset();
  });

  it("sends a signed-out visitor away from the marketing page", () => {
    const result = authorize(null);
    expect(locationOf(result)).toContain("/admin/login");
  });

  it.each(["user", "support_staff", "moderator"])(
    "blocks a non-admin role %s from the marketing page",
    (role) => {
      const result = authorize(role);
      expect(result).not.toBe(true);
      expect(locationOf(result)).toContain("/study?error=admin_only");
    }
  );

  it("allows an admin into the marketing page", () => {
    expect(authorize("admin")).toBe(true);
    expect(authorize("super_admin")).toBe(true);
  });

  it("blocks a non-admin from the CSV export", async () => {
    authMock.mockResolvedValue({ user: { id: "user-1" } } as never);
    findUser.mockResolvedValue({
      role: "user",
      email: "student@example.com",
      name: null,
      accountStatus: "active",
    } as never);

    const response = await GET(new Request("https://www.anyexameasy.com/api/admin/marketing/export"));
    expect(response.status).toBe(403);
  });
});
