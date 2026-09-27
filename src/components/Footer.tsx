import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SupportPhoneLink } from "@/components/contact/SupportPhoneLink";
import { SiteBottomBar } from "@/components/layout/SiteBottomBar";
import { NOT_FOR_PATIENT_CARE_LINE } from "@/lib/marketing/legal-copy";
import { LEGAL_ENTITY, TRADEMARK_NOTICE } from "@/lib/legal";
import { MARKETING_BOARD_LINKS, ROUTES } from "@/lib/routes";
import { formatPricingCheckoutTrialOffer, MARKETING_DISCLAIMER } from "@/lib/site";

const EXPLORE_LINKS = [
  { href: ROUTES.blog, label: "Blog" },
  { href: ROUTES.freeGuides, label: "Free Guides" },
  { href: ROUTES.pricing, label: "Pricing" },
  { href: ROUTES.faq, label: "FAQ" },
  { href: ROUTES.about, label: "About" },
  { href: ROUTES.howQuestionsAreReviewed, label: "How questions are reviewed" },
  { href: ROUTES.feedback, label: "Feedback" },
] as const;

const LEGAL_LINKS = [
  { href: "/legal/terms", label: "Terms of Service" },
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/refunds", label: "Refunds and cancellation" },
  { href: "/legal/disclaimer", label: "Disclaimer" },
] as const;

const ACCOUNT_LINKS = [
  { href: "/auth/login", label: "Log in" },
  { href: ROUTES.auth.signup, label: "Sign up" },
] as const;

function FooterColumn({
  title,
  label,
  links,
}: {
  title: string;
  label: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <nav aria-label={label}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink)]">
        {title}
      </p>
      <ul className="space-y-2" role="list">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link
              href={link.href}
              prefetch={false}
              className="text-sm text-[var(--color-ink-muted)] transition hover:text-[var(--color-accent)]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** One footer for the homepage and inner marketing pages. */
export function Footer() {
  return (
    <footer
      className="apple-footer border-t border-black/[0.08] py-10 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] dark:border-white/[0.08]"
      role="contentinfo"
    >
      <div className="mx-auto max-w-[980px] px-5 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="min-w-0 lg:col-span-1">
            <BrandLogo href={ROUTES.home} variant="footer" />
            <p className="mt-3 text-xs leading-relaxed text-[var(--color-ink-muted)]">
              {formatPricingCheckoutTrialOffer()}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-[var(--color-ink-muted)]">
              {MARKETING_DISCLAIMER}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-[var(--color-ink-muted)]">
              {NOT_FOR_PATIENT_CARE_LINE}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-[var(--color-ink-muted)]">
              {TRADEMARK_NOTICE}
            </p>
            <p className="mt-4 text-xs text-[var(--color-ink-muted)]">
              <a href={`mailto:${LEGAL_ENTITY.supportEmail}`}>{LEGAL_ENTITY.supportEmail}</a>
              <span aria-hidden> · </span>
              <SupportPhoneLink />
            </p>
            <p className="mt-4 text-xs text-[var(--color-ink-muted)]">
              © {new Date().getFullYear()} {LEGAL_ENTITY.productName}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--color-ink-muted)]">
              A product of {LEGAL_ENTITY.companyName}
            </p>
          </div>
          <FooterColumn title="Exams" label="Exam links" links={MARKETING_BOARD_LINKS} />
          <FooterColumn title="Explore" label="Explore links" links={EXPLORE_LINKS} />
          <FooterColumn title="Account" label="Account links" links={ACCOUNT_LINKS} />
          <FooterColumn title="Legal" label="Legal links" links={LEGAL_LINKS} />
        </div>
        <SiteBottomBar className="mt-8" />
      </div>
    </footer>
  );
}
