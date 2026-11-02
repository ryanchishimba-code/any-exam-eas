import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MemoryCardTile } from "@/components/library/MemoryCardTile";
import { sampleMemoryCard } from "../../fixtures/memory-cards";

describe("MemoryCardTile", () => {
  it("renders card metadata and preview", () => {
    render(<MemoryCardTile card={sampleMemoryCard} onOpen={vi.fn()} />);

    expect(screen.getByText(sampleMemoryCard.title)).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent(sampleMemoryCard.title);
    expect(screen.getByTitle("Tables")).toBeInTheDocument();
    expect(screen.getByText(/Cardiology · Heart Failure/)).toBeInTheDocument();
    expect(screen.getByText(sampleMemoryCard.teaser)).toBeInTheDocument();
  });

  it("calls onOpen when clicked", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();

    render(<MemoryCardTile card={sampleMemoryCard} onOpen={onOpen} />);

    await user.click(screen.getByRole("button"));
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it("calls onOpen on Enter and Space keyboard activation", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();

    render(<MemoryCardTile card={sampleMemoryCard} onOpen={onOpen} />);

    const tile = screen.getByRole("button");
    tile.focus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");

    expect(onOpen).toHaveBeenCalledTimes(2);
  });
});
