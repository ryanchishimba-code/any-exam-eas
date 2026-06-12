import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { AnatomyViewer } from "@/components/anatomy/AnatomyViewer";
import { defaultVisibleLayers, sampleStructures } from "../../fixtures/anatomy";

vi.mock("@/lib/anatomy", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/anatomy")>();
  return {
    ...actual,
    isBioDigitalAvailable: vi.fn(() => false),
  };
});

vi.mock("@/components/anatomy/R3FAnatomyScene", () => ({
  R3FAnatomyScene: ({
    selectedId,
    onSelect,
  }: {
    selectedId: string | null;
    onSelect: (id: string) => void;
  }) => (
    <div data-testid="r3f-scene" data-selected={selectedId ?? ""}>
      <button type="button" onClick={() => onSelect("heart")}>
        Select heart
      </button>
    </div>
  ),
}));

vi.mock("@/components/anatomy/BioDigitalViewer", () => ({
  BioDigitalViewer: () => <div data-testid="biodigital-viewer" />,
}));

describe("AnatomyViewer", () => {
  const onSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the R3F fallback viewer when BioDigital is unavailable", async () => {
    render(
      <AnatomyViewer
        structures={sampleStructures}
        visibleLayers={defaultVisibleLayers}
        selectedId={null}
        highlightedId={null}
        onSelect={onSelect}
      />
    );

    expect(await screen.findByTestId("r3f-scene")).toBeInTheDocument();
    expect(screen.queryByTestId("biodigital-viewer")).not.toBeInTheDocument();
  });

  it("forwards selection events from the active viewer", async () => {
    render(
      <AnatomyViewer
        structures={sampleStructures}
        visibleLayers={defaultVisibleLayers}
        selectedId="heart"
        highlightedId={null}
        onSelect={onSelect}
      />
    );

    const scene = await screen.findByTestId("r3f-scene");
    expect(scene).toHaveAttribute("data-selected", "heart");

    scene.querySelector("button")?.click();
    expect(onSelect).toHaveBeenCalledWith("heart");
  });
});
