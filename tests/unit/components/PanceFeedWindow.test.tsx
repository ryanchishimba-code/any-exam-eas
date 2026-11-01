import { act, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PanceFeed } from "@/components/pance-feed/PanceFeed";

const DECK = 40;

function cards(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: `pance-${String(index + 1).padStart(3, "0")}`,
    system: "Cardiovascular",
    front: `Front ${index + 1}`,
    bottom: `Bottom ${index + 1}`,
    bullets: { clue: `clue ${index + 1}`, treat: `treat ${index + 1}`, trap: `trap ${index + 1}` },
    source: { guideline: "ACC", year: "2024" },
  }));
}

beforeEach(() => {
  window.matchMedia = vi.fn(() => ({
    matches: false,
    media: "",
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
  const deck = cards(DECK);
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (init?.method === "PUT") {
        return new Response(JSON.stringify({ mastered: [], reviewQueue: [], lastSeenCardId: null }), {
          status: 200,
        });
      }
      if (url.endsWith("/progress")) {
        return new Response(JSON.stringify({ mastered: [], reviewQueue: [], lastSeenCardId: null }), {
          status: 200,
        });
      }
      if (url.endsWith("/cards")) {
        return new Response(JSON.stringify({ total: deck.length, cards: deck }), { status: 200 });
      }
      const id = url.split("/").pop() ?? "";
      const card = deck.find((item) => item.id === id);
      return new Response(
        JSON.stringify({
          svg: card ? `<svg xmlns="http://www.w3.org/2000/svg"><text>${card.front}</text></svg>` : null,
        }),
        { status: 200 }
      );
    })
  );
});

describe("PanceFeed window", () => {
  it("mounts a small window and drops diagrams outside it", async () => {
    const { container } = render(<PanceFeed />);
    await waitFor(() => expect(screen.getByText("Front 1")).toBeInTheDocument());
    expect(screen.getByText("Front 2")).toBeInTheDocument();
    expect(screen.queryByText("Front 4")).not.toBeInTheDocument();
    expect(screen.queryByText("Bottom 8")).not.toBeInTheDocument();
    expect(screen.queryByText("clue 8")).not.toBeInTheDocument();
    expect(container.querySelectorAll(".pf-face").length).toBeLessThanOrEqual(8);
    expect(container.querySelectorAll(".pf-slide").length).toBe(DECK + 1);

    await waitFor(() => expect(container.querySelectorAll(".pf-dia svg").length).toBeGreaterThan(0));
    expect(container.querySelectorAll(".pf-dia svg").length).toBeLessThanOrEqual(4);

    const feed = container.querySelector<HTMLElement>(".pf-feed");
    expect(feed).toBeTruthy();
    const target = 20;
    await act(async () => {
      container.querySelectorAll<HTMLElement>(".pf-slide").forEach((node, index) => {
        Object.defineProperty(node, "offsetTop", { value: index * 800, configurable: true });
      });
      feed!.scrollTop = target * 800;
      feed!.dispatchEvent(new Event("scroll"));
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });

    await waitFor(() => {
      const questions = [...container.querySelectorAll(".pf-q")].map((node) => node.textContent);
      expect(questions).toContain("Front 21");
      expect(questions).not.toContain("Front 1");
    });
    expect(screen.queryByText("Front 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Bottom 1")).not.toBeInTheDocument();
    expect(container.querySelectorAll(".pf-face").length).toBeLessThanOrEqual(8);
    expect(container.querySelectorAll(".pf-dia svg").length).toBeLessThanOrEqual(4);
    expect(container.querySelectorAll(".pf-orb").length).toBeLessThanOrEqual(8);
  });

  it("shows the plan lock after the trial slice and does not save progress", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (init?.method === "PUT") {
        return new Response("no", { status: 500 });
      }
      if (url.endsWith("/progress")) {
        return new Response(JSON.stringify({ error: "locked" }), { status: 403 });
      }
      if (url.endsWith("/cards")) {
        return new Response(
          JSON.stringify({
            total: 200,
            accessible: 1,
            trialLimited: true,
            cards: cards(1),
          }),
          { status: 200 }
        );
      }
      return new Response(JSON.stringify({ svg: null }), { status: 200 });
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<PanceFeed />);
    expect(await screen.findByTestId("pance-feed-trial-lock")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Start a plan" })).toHaveAttribute(
      "href",
      expect.stringContaining("/checkout?plan=subscribe")
    );
    expect(screen.getByRole("link", { name: "Compare plans" })).toHaveAttribute(
      "href",
      "/pricing?paywall=1"
    );
    expect(screen.getByText(/first 1 of 200 cards/)).toBeInTheDocument();
    expect(screen.queryByText("Front 2")).not.toBeInTheDocument();
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(fetchMock.mock.calls.some((call) => call[1]?.method === "PUT")).toBe(false);
  });
});
