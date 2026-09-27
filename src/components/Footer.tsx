import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SupportPhoneLink } from "@/components/contact/SupportPhoneLink";
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
      className="apple-footer overflow-x-clip border-t border-black/[0.08] py-10 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] dark:border-white/[0.08]"
      role="contentinfo"
    >
      <div className="mx-auto max-w-[980px] px-5 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[minmax(13.75rem,1.2fr)_repeat(4,minmax(0,1fr))]">
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <BrandLogo href={ROUTES.home} variant="nav" showName />
            <p className="mt-3 max-w-full text-sm leading-relaxed text-[var(--color-ink-muted)]">
              {formatPricingCheckoutTrialOffer()}
            </p>
            <p className="mt-2 flex max-w-full flex-col items-start gap-0.5 text-sm leading-snug text-[var(--color-ink)]">
              <a
                href={`mailto:${LEGAL_ENTITY.supportEmail}`}
                className="inline-flex min-h-6 items-center whitespace-nowrap transition hover:text-[var(--color-accent)]"
              >
                {LEGAL_ENTITY.supportEmail}
              </a>
              <SupportPhoneLink className="inline-flex min-h-6 items-center whitespace-nowrap transition hover:text-[var(--color-accent)]" />
            </p>
          </div>
          <FooterColumn title="Exams" label="Exam links" links={MARKETING_BOARD_LINKS} />
          <FooterColumn title="Explore" label="Explore links" links={EXPLORE_LINKS} />
          <FooterColumn title="Account" label="Account links" links={ACCOUNT_LINKS} />
          <FooterColumn title="Legal" label="Legal links" links={LEGAL_LINKS} />
        </div>
        <div className="mt-8 space-y-2 border-t border-black/[0.06] pt-6 text-xs leading-relaxed text-[var(--color-ink-muted)] dark:border-white/[0.08]">
          <p>{MARKETING_DISCLAIMER}</p>
          <p>{NOT_FOR_PATIENT_CARE_LINE}</p>
          <p>{TRADEMARK_NOTICE}</p>
          <p>
            © {new Date().getFullYear()} AnyExamEasy · A product of {LEGAL_ENTITY.companyName}
          </p>
        </div>
      </div>
    </footer>
  );
}
