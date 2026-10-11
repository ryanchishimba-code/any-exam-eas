import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { QotdPractice } from "@/components/marketing/QotdPractice";
import { getQotdForExam, toPublicQotd } from "@/lib/demo/qotd";

const PAST = new Date("2026-06-01T17:00:00.000Z");

describe("QotdPractice", () => {
  it("does not put the rationale in the HTML until the learner checks an answer", async () => {
    const item = getQotdForExam("naplex", "2024-01-03", PAST);
    expect(item?.id).toBe("naplex-03");
    if (!item) throw new Error("missing naplex item");

    const html = renderToStaticMarkup(
      <QotdPractice
        item={toPublicQotd(item)}
        dateIso="2024-01-03"
        absoluteShareUrl="https://example.com/daily/naplex/2024-01-03"
      />
    );
    expect(html).not.toContain(item.rationale);
    expect(html).not.toContain("Rationale:");
    expect(html).not.toContain("option--correct");
    expect(html).toContain(item.stem);

    const user = userEvent.setup();
    render(
      <QotdPractice
        item={toPublicQotd(item)}
        dateIso="2024-01-03"
        absoluteShareUrl="https://example.com/daily/naplex/2024-01-03"
      />
    );
    expect(screen.queryByText(item.rationale)).not.toBeInTheDocument();
    await user.click(screen.getByRole("option", { name: new RegExp(escapeRegExp(item.correct)) }));
    await user.click(screen.getByRole("button", { name: "Check answer" }));
    expect(await screen.findByText(item.rationale)).toBeInTheDocument();
    expect(screen.getByText("Correct")).toBeInTheDocument();
  });
});

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
