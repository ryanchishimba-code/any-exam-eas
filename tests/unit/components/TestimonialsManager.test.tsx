/**
 * TestimonialsManager — admin GUI component tests.
 *
 * Project: component (jsdom). Run:
 *   npx vitest run --project component tests/unit/components/TestimonialsManager.test.tsx
 *
 * Covers the high-impact admin journeys with a routed fetch mock:
 *  1. loads + lists existing testimonials
 *  2. add form opens with a live public preview that reflects typed input
 *  3. successful create posts to the API and shows the new row + success notice
 *  4. approve moderates a pending testimonial to "approved" (public)
 *  5. delete removes the row and offers Undo (soft-delete + restore)
 *  6. server validation errors surface inside the form
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TestimonialsManager } from "@/components/admin/testimonials/TestimonialsManager";

type Row = Record<string, unknown> & { id: string; name: string; status: string };

function row(overrides: Partial<Row> & { id: string; name: string }): Row {
  return {
    exam: "NCLEX-RN",
    quote: "Passed on my first attempt thanks to the Roadmap.",
    longQuote: null,
    outcome: "Passed NCLEX",
    detail: null,
    initials: null,
    photoUrl: null,
    avatarGradient: null,
    rating: null,
    featured: false,
    status: "pending",
    sortOrder: 0,
    deletedAt: null,
    createdAt: "2026-06-01T00:00:00.000Z",
    updatedAt: "2026-06-01T00:00:00.000Z",
    ...overrides,
  };
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** Build a fetch mock that routes the testimonial API like the real server. */
function installFetchMock(
  initial: Row[],
  overrides: { createStatus?: number; createBody?: unknown } = {}
) {
  const byId = new Map<string, Row>(initial.map((r) => [r.id, r]));

  const mock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method ?? "GET";

    if (url.endsWith("/api/admin/testimonials") && method === "GET") {
      return jsonResponse({ items: [...byId.values()] });
    }
    if (url.endsWith("/api/admin/testimonials") && method === "POST") {
      if (overrides.createStatus && overrides.createStatus >= 400) {
        return jsonResponse(overrides.createBody ?? { error: "Invalid testimonial." }, overrides.createStatus);
      }
      const body = JSON.parse(String(init?.body));
      const created = row({ id: `new-${byId.size + 1}`, name: body.name, ...body });
      byId.set(created.id, created);
      return jsonResponse({ item: created }, 201);
    }

    const idMatch = url.match(/\/api\/admin\/testimonials\/([^/]+)$/);
    if (idMatch) {
      const id = idMatch[1];
      const existing = byId.get(id) ?? row({ id, name: "Unknown" });
      if (method === "PATCH") {
        const body = JSON.parse(String(init?.body));
        const updated = { ...existing, ...body, deletedAt: body.deleted ? "now" : null } as Row;
        byId.set(id, updated);
        return jsonResponse({ item: updated });
      }
      if (method === "DELETE") {
        return jsonResponse({ ok: true, id });
      }
    }
    return jsonResponse({ error: `unhandled ${method} ${url}` }, 500);
  });

  vi.stubGlobal("fetch", mock);
  return mock;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("TestimonialsManager", () => {
  it("loads and lists existing testimonials", async () => {
    installFetchMock([row({ id: "t1", name: "Prisca M." })]);
    render(<TestimonialsManager />);

    expect(await screen.findByText("Prisca M.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /testimonials/i })).toBeInTheDocument();
  });

  it("shows a live public preview while adding", async () => {
    const user = userEvent.setup();
    installFetchMock([]);
    render(<TestimonialsManager />);

    // Wait for initial load (empty state).
    await screen.findByText(/no testimonials yet/i);

    await user.click(screen.getByRole("button", { name: /add testimonial/i }));

    await user.type(screen.getByPlaceholderText("Prisca M."), "Jordan T.");
    await user.type(
      screen.getByPlaceholderText(/I passed on my first try/i),
      "This platform made the difference for me."
    );

    // Preview region echoes the typed name + quote. The preview wraps the quote
    // in curly quotes (“…”), which distinguishes it from the raw <textarea> value.
    expect(screen.getByText("Jordan T.")).toBeInTheDocument();
    expect(
      screen.getByText(/“This platform made the difference for me\.”/)
    ).toBeInTheDocument();
  });

  it("creates a testimonial and shows it in the list", async () => {
    const user = userEvent.setup();
    const mock = installFetchMock([]);
    render(<TestimonialsManager />);
    await screen.findByText(/no testimonials yet/i);

    await user.click(screen.getByRole("button", { name: /add testimonial/i }));
    await user.type(screen.getByPlaceholderText("Prisca M."), "Jordan T.");
    await user.type(screen.getByPlaceholderText("NCLEX-RN"), "USMLE Step 1");
    await user.type(
      screen.getByPlaceholderText(/I passed on my first try/i),
      "Detailed rationales without buying separate banks."
    );

    // The submit button (type=submit) shares the "Add testimonial" label.
    const submit = screen
      .getAllByRole("button", { name: /add testimonial/i })
      .find((b) => (b as HTMLButtonElement).type === "submit")!;
    await user.click(submit);

    // POST fired + success notice + row appears.
    await waitFor(() =>
      expect(mock).toHaveBeenCalledWith(
        "/api/admin/testimonials",
        expect.objectContaining({ method: "POST" })
      )
    );
    expect(await screen.findByText(/testimonial added/i)).toBeInTheDocument();
    expect(screen.getByText("Jordan T.")).toBeInTheDocument();
  });

  it("approves a pending testimonial (makes it public)", async () => {
    const user = userEvent.setup();
    const mock = installFetchMock([row({ id: "t1", name: "Prisca M.", status: "pending" })]);
    render(<TestimonialsManager />);

    await screen.findByText("Prisca M.");
    await user.click(screen.getByRole("button", { name: /approve/i }));

    await waitFor(() =>
      expect(mock).toHaveBeenCalledWith(
        "/api/admin/testimonials/t1",
        expect.objectContaining({ method: "PATCH" })
      )
    );
    // Once approved, the row's Approve action flips to "Unpublish".
    expect(await screen.findByRole("button", { name: /unpublish/i })).toBeInTheDocument();
  });

  it("deletes a testimonial and offers Undo", async () => {
    const user = userEvent.setup();
    const mock = installFetchMock([row({ id: "t1", name: "Prisca M." })]);
    render(<TestimonialsManager />);

    await screen.findByText("Prisca M.");
    await user.click(screen.getByRole("button", { name: /^delete$/i }));

    // Row removed (optimistic) + undo affordance shown.
    await waitFor(() =>
      expect(mock).toHaveBeenCalledWith(
        "/api/admin/testimonials/t1",
        expect.objectContaining({ method: "DELETE" })
      )
    );
    const undo = await screen.findByRole("button", { name: /undo/i });
    expect(undo).toBeInTheDocument();

    // Undo restores via PATCH { deleted: false }.
    await user.click(undo);
    await waitFor(() => expect(screen.getByText("Prisca M.")).toBeInTheDocument());
  });

  it("surfaces a server validation error in the form", async () => {
    const user = userEvent.setup();
    installFetchMock([], { createStatus: 400, createBody: { error: "Quote should be at least 10 characters." } });
    render(<TestimonialsManager />);
    await screen.findByText(/no testimonials yet/i);

    await user.click(screen.getByRole("button", { name: /add testimonial/i }));
    await user.type(screen.getByPlaceholderText("Prisca M."), "Jo");
    await user.type(screen.getByPlaceholderText("NCLEX-RN"), "NCLEX");
    await user.type(screen.getByPlaceholderText(/I passed on my first try/i), "Short");

    const submit = screen
      .getAllByRole("button", { name: /add testimonial/i })
      .find((b) => (b as HTMLButtonElement).type === "submit")!;
    await user.click(submit);

    expect(await screen.findByText(/at least 10 characters/i)).toBeInTheDocument();
  });
});
