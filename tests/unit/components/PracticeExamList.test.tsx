import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, afterEach } from "vitest";
import { PracticeExamList } from "@/components/study/question-bank/PracticeExamList";

const forms = [
  {
    examNumber: 1,
    title: "NAPLEX Practice Exam 1",
    questionCount: 85,
    lengthNote: "85-question practice exam",
    status: "completed",
    score: 82,
    sessionId: null,
    highlighted: false,
  },
  {
    examNumber: 2,
    title: "NAPLEX Practice Exam 2",
    questionCount: 85,
    lengthNote: "85-question practice exam",
    status: "in_progress",
    score: null,
    sessionId: "sess-2",
    highlighted: false,
  },
  {
    examNumber: 3,
    title: "NAPLEX Practice Exam 3",
    questionCount: 85,
    lengthNote: "85-question practice exam",
    status: "not_started",
    score: null,
    sessionId: null,
    highlighted: true,
  },
  {
    examNumber: 4,
    title: "NAPLEX Practice Exam 4",
    questionCount: 85,
    lengthNote: "85-question practice exam",
    status: "not_started",
    score: null,
    sessionId: null,
    highlighted: false,
  },
];

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("PracticeExamList", () => {
  it("hides the section when the board has no active forms", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: true, json: async () => ({ forms: [] }) }))
    );
    const view = render(<PracticeExamList fieldId="pharmacy" />);
    await vi.waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
    expect(screen.queryByRole("region", { name: "Practice exams" })).toBeNull();
    view.unmount();
  });

  it("shows the next forms, a short length label, and the rest behind Show all", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: true, json: async () => ({ forms }) }))
    );
    render(<PracticeExamList fieldId="pharmacy" />);
    expect(await screen.findByRole("heading", { name: "Practice exams" })).toBeTruthy();
    expect(screen.getByText("Next")).toBeTruthy();
    expect(screen.getByText("NAPLEX Practice Exam 3")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Resume" })).toBeTruthy();
    expect(screen.getAllByText(/85-question practice exam/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Completed · 82%/)).toBeNull();
    expect(screen.queryByText(/shortfall|coming soon|placeholder/i)).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Show all 4" }));
    expect(screen.getByText("NAPLEX Practice Exam 1")).toBeTruthy();
    expect(screen.getByText(/Completed · 82%/)).toBeTruthy();
  });
});
