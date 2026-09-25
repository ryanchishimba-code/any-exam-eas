/**
 * F3 — USMLE step choice is an inline sheet, Step 1 first, then the dashboard.
 *
 *   npx vitest run --project component tests/unit/components/UsmleStepSheet.test.tsx
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UsmleStepSheet } from "@/components/edtech/UsmleStepSheet";
import { ExamSelectionScreen } from "@/components/edtech/ExamSelectionScreen";

const { mockPush, mockRefresh, mockSetExamSlug, mockPersistUsmle, mockPersistExam } = vi.hoisted(
  () => ({
    mockPush: vi.fn(),
    mockRefresh: vi.fn(),
    mockSetExamSlug: vi.fn(),
    mockPersistUsmle: vi.fn(async () => ({ ok: true, examSlug: "usmle" })),
    mockPersistExam: vi.fn(async () => ({ ok: true, examSlug: "naplex" })),
  })
);

vi.mock("next/navigation", () => ({
  usePathname: () => "/select-exam",
  useSearchParams: () => new URLSearchParams("switch=1"),
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    refresh: mockRefresh,
    prefetch: vi.fn(),
  }),
}));

vi.mock("@/lib/client/use-app-preferences", () => ({
  useAppPreferences: () => ({
    examSlug: "naplex",
    mpjeStateCode: null,
    loading: false,
    refresh: vi.fn(),
    setExamSlug: mockSetExamSlug,
  }),
}));

vi.mock("@/lib/edtech/actions", () => ({
  persistExamPreference: (...args: unknown[]) => mockPersistExam(...args),
  persistUsmleStepPreference: (...args: unknown[]) => mockPersistUsmle(...args),
  switchExamPreference: vi.fn(),
}));

vi.mock("@/lib/edtech/confetti", () => ({
  fireExamSelectionConfetti: vi.fn(async () => {}),
}));

function renderScreen() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <ExamSelectionScreen switchMode currentExam="naplex" />
    </QueryClientProvider>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("UsmleStepSheet", () => {
  it("preselects Step 1 and still offers the other steps", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<UsmleStepSheet onClose={vi.fn()} onConfirm={onConfirm} />);

    expect(screen.getByRole("radio", { name: /usmle step 1/i })).toHaveAttribute(
      "aria-checked",
      "true"
    );
    expect(screen.getByRole("radio", { name: /step 2 ck/i })).toHaveAttribute(
      "aria-checked",
      "false"
    );
    expect(screen.getByRole("radio", { name: /usmle step 3/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /continue with step 1/i }));
    expect(onConfirm).toHaveBeenCalledWith("usmle-step-1");
  });

  it("confirms a different step when the learner picks one", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<UsmleStepSheet onClose={vi.fn()} onConfirm={onConfirm} />);

    await user.click(screen.getByRole("radio", { name: /step 2 ck/i }));
    await user.click(screen.getByRole("button", { name: /continue with step 2 ck/i }));
    expect(onConfirm).toHaveBeenCalledWith("usmle-step-2");
  });
});

describe("ExamSelectionScreen USMLE switch", () => {
  it("opens the step sheet instead of /select-exam/usmle and lands on the dashboard", async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByRole("button", { name: /select usmle/i }));

    expect(mockPush).not.toHaveBeenCalledWith("/select-exam/usmle");
    expect(screen.getByRole("dialog", { name: /choose your step/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /usmle step 1/i })).toHaveAttribute(
      "aria-checked",
      "true"
    );

    await user.click(screen.getByRole("button", { name: /continue with step 1/i }));

    expect(mockSetExamSlug).toHaveBeenCalledWith("usmle");
    await waitFor(() => {
      expect(mockPersistUsmle).toHaveBeenCalledWith("usmle-step-1");
    });
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
    expect(mockRefresh).toHaveBeenCalled();
  });
});
