import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MerchCollection } from "@/components/merch/MerchCollection";
import type { MerchProduct } from "@/lib/merch/catalog";

vi.mock("next/image", () => ({
  default: ({
    alt,
    src,
    priority,
  }: {
    alt: string;
    src: string;
    priority?: boolean;
  }) => (
    // Test double for next/image. The page itself uses the Image component.
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} data-priority={priority ? "true" : "false"} />
  ),
}));

const tee: MerchProduct = {
  id: "tee",
  name: "Tee",
  priceUsd: 24.99,
  image: "/merch/tee.webp",
  imageAlt: "Moss tee with a small embroidered chest mark",
  imageWidth: 1200,
  imageHeight: 1200,
  colors: [
    { name: "Moss", hex: "#63664b" },
    { name: "Espresso", hex: "#4a3a2e" },
  ],
  fourthwallUrl: "https://anyexameasy.fourthwall.com/products/tee",
};

const hoodie: MerchProduct = {
  ...tee,
  id: "premium-hoodie",
  name: "Premium Hoodie",
  priceUsd: 56.99,
  image: "/merch/hoodie-premium.webp",
  imageAlt: "Chocolate brown premium hoodie",
  colors: [
    { name: "Chocolate Brown", hex: "#5f422d" },
    { name: "Moss", hex: "#737a5e" },
  ],
  fourthwallUrl: "",
};

describe("MerchCollection", () => {
  it("renders one outbound buy link per product that has a URL", () => {
    render(<MerchCollection products={[tee, hoodie]} storeUrl={null} />);

    expect(screen.getByRole("heading", { level: 1, name: "AnyExamEasy Merch" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "The lineup." })).toBeInTheDocument();
    expect(screen.getByText("One piece. Made for study days.")).toBeInTheDocument();
    expect(screen.queryByRole("article", { name: "Premium Hoodie" })).not.toBeInTheDocument();

    const card = screen.getByRole("article", { name: "Tee" });
    expect(within(card).getByText("Moss · Espresso")).toBeInTheDocument();
    expect(within(card).getByText("$24.99")).toBeInTheDocument();
    expect(within(card).getByRole("img", { name: tee.imageAlt })).toBeInTheDocument();

    const buy = within(card).getByRole("link", { name: /buy tee/i });
    expect(buy).toHaveAttribute("href", tee.fourthwallUrl);
    expect(buy).toHaveAttribute("target", "_blank");
    expect(buy.getAttribute("rel")).toContain("noopener");
    expect(screen.getByText("Free replacement for any defect.")).toBeInTheDocument();
    expect(screen.getByText("Prices in USD. Shipping is paid at checkout.")).toBeInTheDocument();
    expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /visit the store/i })).not.toBeInTheDocument();
  });

  it("shows a single store link only when the config has a shop URL", () => {
    render(
      <MerchCollection products={[tee]} storeUrl="https://anyexameasy.fourthwall.com" />,
    );
    const store = screen.getByRole("link", { name: /visit the store/i });
    expect(store).toHaveAttribute("href", "https://anyexameasy.fourthwall.com");
    expect(store).toHaveAttribute("target", "_blank");
    expect(store.getAttribute("rel")).toContain("noopener");
  });

  it("renders nothing when no product can be purchased", () => {
    const { container } = render(<MerchCollection products={[hoodie]} storeUrl={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("prioritizes the hero image and lazy-loads the lineup", () => {
    render(<MerchCollection products={[tee]} storeUrl={null} />);
    const hero = screen.getByRole("img", { name: /crewneck, hoodie, tee/i });
    expect(hero).toHaveAttribute("data-priority", "true");
    const product = screen.getByRole("img", { name: tee.imageAlt });
    expect(product).toHaveAttribute("data-priority", "false");
  });
});
