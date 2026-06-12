import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { useSession } from "next-auth/react";
import { Hero } from "@/components/Hero";
import { MemoryCardTile } from "@/components/reference/MemoryCardTile";
import { sampleMemoryCard } from "../../fixtures/memory-cards";

vi.mock("@/lib/client/returning-user", () => ({
  firstName: (name?: string | null) => name?.split(" ")[0] ?? "there",
  loadReturningUserHint: vi.fn(() => null),
  touchReturningVisit: vi.fn(),
}));

vi.mock("@/components/auth/LoginModalTrigger", () => ({
  LoginModalTrigger: ({ children }: { children: React.ReactNode }) => (
    <button type="button">{children}</button>
  ),
}));

describe("component accessibility", () => {
  it("Hero has no axe violations for guest state", async () => {
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: "unauthenticated",
      update: vi.fn(),
    });

    const { container } = render(<Hero compareLayout />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("MemoryCardTile has no axe violations", async () => {
    const { container } = render(<MemoryCardTile card={sampleMemoryCard} onOpen={vi.fn()} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
