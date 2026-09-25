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
});
