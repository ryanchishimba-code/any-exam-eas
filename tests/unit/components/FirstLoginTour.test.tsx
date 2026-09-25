import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSession } from "next-auth/react";

const welcome = vi.hoisted(() => ({ active: false, resolved: true }));
const push = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useRouter: () => ({ push, replace: vi.fn() }),
}));

vi.mock("@/components/auth/TrialWelcomeHost", () => ({
  useTrialWelcome: () => welcome,
}));

vi.mock("@/lib/client/use-user-access", () => ({
  useUserAccess: () => ({
    status: "trialing",
    loading: false,
    hasStudyAccess: true,
    hasPremiumAccess: true,
    hasAppAccess: true,
    hasFreeTierAccess: false,
    role: "user",
  }),
}));

import { FirstLoginTour } from "@/components/onboarding/FirstLoginTour";
import { TOUR_LOCAL_KEY, TOUR_REPLAY_KEY } from "@/lib/onboarding/tour-record";

function anchors({ studyGuide = true }: { studyGuide?: boolean } = {}) {
  return (
    <div>
      <section data-tour="today">Today</section>
      <a data-tour="bank" href="/question-bank">
        Question Bank
      </a>
      <a data-tour="review-incorrect" href="/question-bank?style=review_incorrect">
        Review incorrect
      </a>
      <section data-tour="readiness">Readiness</section>
      <a data-tour="today-start" href="/question-bank?style=bank">
        Start
      </a>
      {studyGuide ? (
        <a data-tour="study-guide" href="/nclex/study-guide">
          Study Guide
        </a>
      ) : null}
    </div>
  );
}

async function flushTour() {
  await act(async () => {
    vi.advanceTimersByTime(800);
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  welcome.active = false;
  welcome.resolved = true;
  window.localStorage.clear();
  window.sessionStorage.clear();
  vi.mocked(useSession).mockReturnValue({
    data: { user: { name: "Ada" } },
    status: "authenticated",
  } as never);
  vi.stubGlobal(
    "fetch",
    vi.fn(() => Promise.resolve(new Response("{}", { status: 200 })))
  );
  HTMLElement.prototype.getBoundingClientRect = () =>
    ({
      x: 20,
      y: 20,
      width: 160,
      height: 48,
      top: 20,
      left: 20,
      right: 180,
      bottom: 68,
      toJSON() {
        return {};
      },
    }) as DOMRect;
  HTMLElement.prototype.scrollIntoView = vi.fn();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("FirstLoginTour", () => {
  it("persists the moment it is shown and does not show again", async () => {
    const { unmount } = render(
      <>
        {anchors()}
        <FirstLoginTour boardName="NCLEX" seen={false} attemptCount={0} />
      </>
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await flushTour();
    expect(screen.getByRole("dialog", { name: /start here every day/i })).toBeInTheDocument();
    expect(window.localStorage.getItem(TOUR_LOCAL_KEY)).toContain("shown");
    expect(fetch).toHaveBeenCalledWith(
      "/api/me/preferences",
      expect.objectContaining({ method: "PATCH", keepalive: true })
    );
    const body = JSON.parse((vi.mocked(fetch).mock.calls[0]?.[1] as RequestInit).body as string);
    expect(body).toMatchObject({ tour: "firstLogin.v1", status: "shown" });

    unmount();
    render(
      <>
        {anchors()}
        <FirstLoginTour boardName="NCLEX" seen={true} attemptCount={0} />
      </>
    );
    await flushTour();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not show for an existing learner with attempts", async () => {
    render(
      <>
        {anchors()}
        <FirstLoginTour boardName="USMLE" seen={false} attemptCount={8} />
      </>
    );
    await flushTour();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("waits until the trial welcome is dismissed", async () => {
    welcome.active = true;
    const { rerender } = render(
      <>
        {anchors()}
        <FirstLoginTour boardName="NAPLEX" seen={false} attemptCount={0} />
      </>
    );
    await flushTour();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    welcome.active = false;
    rerender(
      <>
        {anchors()}
        <FirstLoginTour boardName="NAPLEX" seen={false} attemptCount={0} />
      </>
    );
    await flushTour();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toHaveTextContent("NAPLEX");
  });

  it("auto-skips the study guide step when that link is missing", async () => {
    render(
      <>
        {anchors({ studyGuide: false })}
        <FirstLoginTour boardName="PANCE" seen={false} attemptCount={0} />
      </>
    );
    await flushTour();
    expect(screen.getByRole("dialog")).toHaveTextContent("Start here every day");
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("dialog")).toHaveTextContent("Practice by topic, then fix misses");
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.queryByText(/study guide, built in/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start today's set" })).toBeInTheDocument();
  });

  it("replay from settings shows the tour without writing seen again", async () => {
    window.sessionStorage.setItem(TOUR_REPLAY_KEY, "1");
    render(
      <>
        {anchors()}
        <FirstLoginTour boardName="AANP FNP" seen={true} attemptCount={30} />
      </>
    );
    await flushTour();
    expect(screen.getByRole("dialog")).toHaveTextContent("AANP FNP");
    const preferenceWrites = vi.mocked(fetch).mock.calls.filter(([url]) => url === "/api/me/preferences");
    expect(preferenceWrites).toHaveLength(0);
  });

  it("replays on desktop when the dashboard targets are still below the fold", async () => {
    const previousMatchMedia = window.matchMedia;
    const previousInnerHeight = window.innerHeight;
    const previousInnerWidth = window.innerWidth;
    const scrolled: string[] = [];

    window.matchMedia = vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 720 });
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1280 });
    HTMLElement.prototype.getBoundingClientRect = function (this: HTMLElement) {
      const tour = this.getAttribute("data-tour");
      const below =
        tour === "today" ||
        tour === "review-incorrect" ||
        tour === "readiness" ||
        tour === "today-start";
      const top = below ? 1600 : 40;
      const height = tour === "today" ? 520 : 48;
      return {
        x: 40,
        y: top,
        width: 240,
        height,
        top,
        left: 40,
        right: 280,
        bottom: top + height,
        toJSON() {
          return {};
        },
      } as DOMRect;
    };
    HTMLElement.prototype.scrollIntoView = function (this: HTMLElement) {
      const tour = this.getAttribute("data-tour");
      if (tour) scrolled.push(tour);
    };

    try {
      window.sessionStorage.setItem(TOUR_REPLAY_KEY, "1");
      const early = render(
        <>
          {anchors()}
          <FirstLoginTour boardName="PANCE" seen={true} attemptCount={40} />
        </>
      );
      early.unmount();
      expect(window.sessionStorage.getItem(TOUR_REPLAY_KEY)).toBe("1");

      const view = render(
        <>
          {anchors()}
          <FirstLoginTour boardName="PANCE" seen={true} attemptCount={40} />
        </>
      );
      await flushTour();

      const dialog = screen.getByRole("dialog", { name: /start here every day/i });
      expect(dialog).toHaveTextContent("PANCE");
      expect(dialog).toHaveTextContent("Step 1 of 4");
      expect(scrolled).toContain("today");
      expect(window.sessionStorage.getItem(TOUR_REPLAY_KEY)).toBeNull();
      expect(window.localStorage.getItem(TOUR_LOCAL_KEY)).toBeNull();
      const preferenceWrites = vi.mocked(fetch).mock.calls.filter(
        ([url]) => url === "/api/me/preferences"
      );
      expect(preferenceWrites).toHaveLength(0);

      fireEvent.click(screen.getByRole("button", { name: "Next" }));
      expect(screen.getByRole("dialog")).toHaveTextContent("Practice by topic, then fix misses");
      fireEvent.click(screen.getByRole("button", { name: "Next" }));
      expect(screen.getByRole("dialog")).toHaveTextContent("Your study guide, built in");
      fireEvent.click(screen.getByRole("button", { name: "Next" }));
      expect(screen.getByRole("dialog")).toHaveTextContent("See when you're ready");
      expect(screen.getByRole("button", { name: "Start today's set" })).toBeInTheDocument();

      view.unmount();
      render(
        <>
          {anchors()}
          <FirstLoginTour boardName="PANCE" seen={true} attemptCount={40} />
        </>
      );
      await flushTour();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    } finally {
      window.matchMedia = previousMatchMedia;
      Object.defineProperty(window, "innerHeight", { configurable: true, value: previousInnerHeight });
      Object.defineProperty(window, "innerWidth", { configurable: true, value: previousInnerWidth });
    }
  });

  it("desktop replay skips a study guide link that is not shown", async () => {
    const previousMatchMedia = window.matchMedia;
    const previousInnerHeight = window.innerHeight;
    window.matchMedia = vi.fn(() => ({
      matches: false,
      media: "(max-width: 1023px)",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 720 });
    HTMLElement.prototype.getBoundingClientRect = function (this: HTMLElement) {
      const tour = this.getAttribute("data-tour");
      const below = tour === "today" || tour === "readiness" || tour === "review-incorrect";
      const top = below ? 1600 : 40;
      return {
        x: 40,
        y: top,
        width: 240,
        height: 48,
        top,
        left: 40,
        right: 280,
        bottom: top + 48,
        toJSON() {
          return {};
        },
      } as DOMRect;
    };

    try {
      window.sessionStorage.setItem(TOUR_REPLAY_KEY, "1");
      render(
        <>
          <section data-tour="today">Today</section>
          <span data-tour="bank">Question Bank</span>
          <span data-tour="review-incorrect">Review incorrect</span>
          <section data-tour="readiness">Readiness</section>
          <div style={{ display: "none" }}>
            <span data-tour="study-guide">Study Guide</span>
          </div>
          <FirstLoginTour boardName="USMLE" seen={true} attemptCount={12} />
        </>
      );
      await flushTour();
      expect(screen.getByRole("dialog")).toHaveTextContent("Step 1 of 3");
      expect(screen.getByRole("dialog")).toHaveTextContent("USMLE");
      fireEvent.click(screen.getByRole("button", { name: "Next" }));
      fireEvent.click(screen.getByRole("button", { name: "Next" }));
      expect(screen.queryByText(/study guide, built in/i)).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Start today's set" })).toBeInTheDocument();
      expect(window.localStorage.getItem(TOUR_LOCAL_KEY)).toBeNull();
    } finally {
      window.matchMedia = previousMatchMedia;
      Object.defineProperty(window, "innerHeight", { configurable: true, value: previousInnerHeight });
    }
  });

  it("scrolls each step target into view when the step changes", async () => {
    const calls: { tour: string | null; behavior?: ScrollBehavior; block?: ScrollLogicalPosition }[] =
      [];
    HTMLElement.prototype.scrollIntoView = function (
      this: HTMLElement,
      arg?: boolean | ScrollIntoViewOptions
    ) {
      const options = typeof arg === "object" ? arg : undefined;
      calls.push({
        tour: this.getAttribute("data-tour"),
        behavior: options?.behavior,
        block: options?.block,
      });
    };

    render(
      <>
        {anchors()}
        <FirstLoginTour boardName="NCLEX" seen={false} attemptCount={0} />
      </>
    );
    await flushTour();

    const today = calls.filter((call) => call.tour === "today");
    expect(today.length).toBeGreaterThan(0);
    expect(today[0]).toMatchObject({ behavior: "smooth", block: "start" });
    expect(document.querySelector("[data-tour='today']")).toHaveStyle({
      scrollMarginTop: "76px",
    });

    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    const bank = calls.filter((call) => call.tour === "bank");
    expect(bank.length).toBeGreaterThan(0);
    expect(bank[0]).toMatchObject({ behavior: "smooth", block: "start" });
  });

  it("does not replay over an open dialog", async () => {
    window.sessionStorage.setItem(TOUR_REPLAY_KEY, "1");
    render(
      <>
        <div role="dialog" aria-label="Subscribe to continue">
          Subscribe
        </div>
        {anchors()}
        <FirstLoginTour boardName="NAPLEX" seen={true} attemptCount={12} />
      </>
    );
    await flushTour();
    await act(async () => {
      vi.advanceTimersByTime(10_000);
    });
    expect(screen.queryByRole("dialog", { name: /start here every day/i })).not.toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: /subscribe to continue/i })).toBeInTheDocument();
    expect(window.sessionStorage.getItem(TOUR_REPLAY_KEY)).toBeNull();
    expect(window.localStorage.getItem(TOUR_LOCAL_KEY)).toBeNull();
  });
});
