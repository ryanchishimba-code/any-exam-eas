import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WhyTrustIt } from "@/components/marketing/WhyTrustIt";
import { NGN_DEMO_QUESTIONS } from "@/lib/demo/ngn-samples";
import {
  ACTIVE_QUESTION_DEFINITION,
  type BoardInventoryPresentation,
} from "@/lib/inventory/active-questions";
import { TRUST_READINESS_LINE } from "@/lib/marketing/why-trust-it";

const LIVE: BoardInventoryPresentation = {
  formatLine: "5,598 MCQ · 492 NGN · 153 cases",
  definition: ACTIVE_QUESTION_DEFINITION,
  categories: [],
  categoryLabel: "Client Needs",
  scopeNote: null,
  countSource: "active-inventory",
  activeCount: 6243,
};

describe("WhyTrustIt", () => {
  it("shows the live format split, the stored citation, and the readiness line", () => {
    render(<WhyTrustIt examKey="nclex" inventory={LIVE} testimonials={[]} />);
    expect(screen.getByRole("heading", { name: "Why trust it" })).toBeInTheDocument();
    expect(screen.getByText("NCLEX 5,598 MCQ · 492 NGN · 153 cases")).toBeInTheDocument();
    expect(screen.getByText(NGN_DEMO_QUESTIONS[0]!.explanation)).toBeInTheDocument();
    expect(screen.getByText(NGN_DEMO_QUESTIONS[0]!.references![0]!)).toBeInTheDocument();
    expect(screen.getByText(TRUST_READINESS_LINE)).toBeInTheDocument();
    expect(screen.getByText("Study guide")).toBeInTheDocument();
    expect(screen.getByText("Readiness Proof")).toBeInTheDocument();
    expect(screen.queryByRole("list", { name: /testimonials/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/pass rate|students say|expert/i)).not.toBeInTheDocument();
  });

  it("omits a citation quote when the board sample has none", () => {
    render(<WhyTrustIt examKey="naplex" inventory={null} />);
    expect(screen.getByText(/do not store a citation/i)).toBeInTheDocument();
    expect(screen.queryByText(/Open RN/)).not.toBeInTheDocument();
  });

  it("shows a testimonial only when a real entry is passed in", () => {
    render(
      <WhyTrustIt
        examKey="nclex"
        inventory={LIVE}
        testimonials={[
          {
            quote: "The cases felt like the floor.",
            name: "Jordan Lee",
            exam: "NCLEX",
            initials: "JL",
            outcome: "",
            avatarGradient: "linear-gradient(#111,#222)",
          },
        ]}
      />
    );
    expect(screen.getByText(/The cases felt like the floor/)).toBeInTheDocument();
    expect(screen.getByText(/Jordan Lee · NCLEX/)).toBeInTheDocument();
  });
});
