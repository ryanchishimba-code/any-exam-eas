import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TodaySetEndCard } from "@/components/dashboard/TodaySetEndCard";

describe("TodaySetEndCard", () => {
  it("shows accuracy, the weakest topic, and tomorrow without clutter", () => {
    render(
      <TodaySetEndCard
        correct={18}
        total={25}
        accuracy={72}
        tomorrowCount={25}
        weakest={{ label: "Cardiovascular", href: "/dashboard/topics?exam=nclex&topic=cardiac&mode=deep" }}
      />
    );

    expect(screen.getByRole("heading", { name: "Today's set is done" })).toBeInTheDocument();
    expect(screen.getByText("72%")).toBeInTheDocument();
    expect(screen.getByText(/18 of 25 correct/)).toBeInTheDocument();
    const topic = screen.getByRole("link", { name: "Cardiovascular" });
    expect(topic).toHaveAttribute("href", "/dashboard/topics?exam=nclex&topic=cardiac&mode=deep");
    expect(screen.getByText(/Tomorrow:/)).toHaveTextContent("Tomorrow: 25");
    expect(screen.queryByText(/confetti/i)).toBeNull();
    expect(screen.queryByText(/% off/i)).toBeNull();
    expect(document.body.textContent).not.toContain("5-day free trial");
  });

  it("names a miss even when that topic has no study link", () => {
    render(
      <TodaySetEndCard
        correct={20}
        total={25}
        accuracy={80}
        tomorrowCount={25}
        weakest={{ label: "Pharmacology", href: null }}
      />
    );
    expect(screen.getByText("Pharmacology")).toBeInTheDocument();
    expect(screen.queryByText("No misses in this set.")).toBeNull();
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("does not invent a weak topic when the set was clean", () => {
    render(
      <TodaySetEndCard
        correct={25}
        total={25}
        accuracy={100}
        tomorrowCount={25}
        weakest={null}
      />
    );
    expect(screen.getByText("No misses in this set.")).toBeInTheDocument();
    expect(screen.queryByRole("link")).toBeNull();
  });
});
