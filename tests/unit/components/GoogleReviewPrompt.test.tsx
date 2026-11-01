import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSession } from "next-auth/react";
import { GoogleReviewPrompt } from "@/components/reviews/GoogleReviewPrompt";
import { GOOGLE_REVIEW_COPY, GOOGLE_REVIEW_STORAGE_KEY } from "@/lib/reviews/google-review";

const ctaClicked = vi.fn();

vi.mock("@/lib/analytics", () => ({
  analytics: {
    ctaClicked: (...args: unknown[]) => ctaClicked(...args),
  },
}));

const mockedUseSession = vi.mocked(useSession);
const REVIEW_URL = "https://search.google.com/local/writereview?placeid=test";

function signedIn() {
  mockedUseSession.mockReturnValue({
    data: {
      user: { name: "A Student", email: "student@example.com" },
      expires: "2099-01-01",
    },
    status: "authenticated",
    update: vi.fn(),
  });
}

describe("GoogleReviewPrompt", () => {
  beforeEach(() => {
    ctaClicked.mockClear();
    window.localStorage.clear();
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_REVIEW_URL", "");
    mockedUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
      update: vi.fn(),
    });
  });

  it("renders nothing when the review URL is unset, even for a signed-in student", async () => {
    signedIn();
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_REVIEW_URL", "   ");
    render(<GoogleReviewPrompt surface="full_exam_results" />);
    await waitFor(() => {
      expect(screen.queryByText(GOOGLE_REVIEW_COPY.cardTitle)).toBeNull();
    });
    expect(document.querySelector("[data-google-review]")).toBeNull();
  });

  it("renders nothing for signed-out visitors", async () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_REVIEW_URL", REVIEW_URL);
    render(<GoogleReviewPrompt surface="full_exam_results" />);
    await waitFor(() => {
      expect(mockedUseSession).toHaveBeenCalled();
    });
    expect(screen.queryByRole("complementary", { name: GOOGLE_REVIEW_COPY.cardTitle })).toBeNull();
  });

  it("shows the results card to a signed-in student and opens the review in a new tab", async () => {
    signedIn();
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_REVIEW_URL", REVIEW_URL);
    const user = userEvent.setup();
    render(<GoogleReviewPrompt surface="practice_exam_results" />);

    const card = await screen.findByRole("complementary", { name: GOOGLE_REVIEW_COPY.cardTitle });
    expect(card).toHaveTextContent(GOOGLE_REVIEW_COPY.cardBody);
    expect(card.className).toContain("w-full");

    const link = screen.getByRole("link", { name: GOOGLE_REVIEW_COPY.cardAction });
    expect(link).toHaveAttribute("href", REVIEW_URL);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link.className).toContain("w-full");
    expect(link.className).toContain("min-h-11");

    await user.click(link);
    expect(ctaClicked).toHaveBeenCalledWith("google_review", "practice_exam_results");
    expect(screen.queryByRole("complementary", { name: GOOGLE_REVIEW_COPY.cardTitle })).toBeNull();
    const until = Number(window.localStorage.getItem(GOOGLE_REVIEW_STORAGE_KEY));
    expect(until).toBeGreaterThan(Date.now());
  });

  it("stays hidden for 60 days after dismiss, including the account link", async () => {
    signedIn();
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_REVIEW_URL", REVIEW_URL);
    const user = userEvent.setup();
    const { unmount } = render(<GoogleReviewPrompt surface="full_exam_results" />);
    await user.click(await screen.findByRole("button", { name: GOOGLE_REVIEW_COPY.dismiss }));
    expect(screen.queryByRole("complementary")).toBeNull();
    unmount();

    render(<GoogleReviewPrompt surface="account" variant="link" />);
    await waitFor(() => {
      expect(screen.queryByRole("link", { name: GOOGLE_REVIEW_COPY.linkLabel })).toBeNull();
    });
  });

  it("shows again after the cooldown and tracks the dashboard click", async () => {
    signedIn();
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_REVIEW_URL", REVIEW_URL);
    window.localStorage.setItem(GOOGLE_REVIEW_STORAGE_KEY, String(Date.now() - 1_000));
    const user = userEvent.setup();
    render(<GoogleReviewPrompt surface="dashboard" variant="link" />);

    const link = await screen.findByRole("link", { name: GOOGLE_REVIEW_COPY.linkLabel });
    expect(screen.getByText(GOOGLE_REVIEW_COPY.linkHint)).toBeInTheDocument();
    await user.click(link);
    expect(ctaClicked).toHaveBeenCalledWith("google_review", "dashboard");
  });
});
