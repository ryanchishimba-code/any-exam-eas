import Image from "next/image";
import { RefreshCw } from "lucide-react";
import { MERCH_COPY, MERCH_HERO, type MerchProduct } from "@/lib/merch/catalog";
import {
  colorLine,
  formatMerchPrice,
  isMerchCheckoutUrl,
  merchLineupSubtitle,
} from "@/lib/merch/merch";
import "./merch.css";

/**
 * Purchasable lineup. Callers provide only products that already have https
 * checkout URLs. A row that fails that check is dropped again here so a
 * broken or empty link can never render a button.
 */
export function MerchCollection({
  products,
  storeUrl,
}: {
  products: readonly MerchProduct[];
  storeUrl: string | null;
}) {
  const listed = products.filter((product) => isMerchCheckoutUrl(product.fourthwallUrl));
  if (listed.length === 0) return null;

  const storeHref = storeUrl && isMerchCheckoutUrl(storeUrl) ? storeUrl : null;

  return (
    <div className="merch">
      <section className="merch-hero" aria-labelledby="merch-heading">
        <div className="merch-wrap">
          <p className="merch-eyebrow">{MERCH_COPY.eyebrow}</p>
          <h1 id="merch-heading" className="apple-display">
            {MERCH_COPY.title}
          </h1>
          <p className="merch-sub">{MERCH_COPY.subtitle}</p>
          <a href="#lineup" className="aee-flagship-cta aee-flagship-cta--primary merch-hero-cta">
            {MERCH_COPY.shopCta}
          </a>
        </div>
        <div className="merch-wrap">
          <div className="merch-hero-frame">
            <Image
              src={MERCH_HERO.image}
              alt={MERCH_HERO.imageAlt}
              width={MERCH_HERO.imageWidth}
              height={MERCH_HERO.imageHeight}
              priority
              fetchPriority="high"
              quality={82}
              sizes="(max-width: 640px) calc(100vw - 2.75rem), (max-width: 1140px) calc(100vw - 5rem), 1040px"
              className="merch-hero-img"
            />
          </div>
        </div>
      </section>

      <section id="lineup" className="merch-lineup" aria-labelledby="lineup-heading">
        <div className="merch-wrap">
          <div className="merch-lineup-head">
            <h2 id="lineup-heading">{MERCH_COPY.lineupTitle}</h2>
            <p>{merchLineupSubtitle(listed.length)}</p>
          </div>
          <ul className="merch-grid">
            {listed.map((product) => {
              const titleId = `merch-${product.id}`;
              const buyId = `${titleId}-buy`;
              return (
                <li key={product.id}>
                  <article className="merch-card" aria-labelledby={titleId}>
                    <div className="merch-photo">
                      <Image
                        src={product.image}
                        alt={product.imageAlt}
                        fill
                        quality={82}
                        sizes="(max-width: 899px) 45vw, 260px"
                        loading="lazy"
                      />
                    </div>
                    <ul className="merch-swatches" aria-hidden="true">
                      {product.colors.map((color, index) => (
                        <li key={`${product.id}-${color.name}`}>
                          <span
                            className={index === 0 ? "merch-swatch is-shown" : "merch-swatch"}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          />
                        </li>
                      ))}
                    </ul>
                    <h3 id={titleId}>{product.name}</h3>
                    <p className="merch-colors">{colorLine(product)}</p>
                    <p className="merch-price">{formatMerchPrice(product.priceUsd)}</p>
                    <a
                      className="aee-flagship-cta aee-flagship-cta--primary merch-buy"
                      href={product.fourthwallUrl.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-labelledby={buyId}
                    >
                      <span aria-hidden="true">{MERCH_COPY.buyCta}</span>
                      <span id={buyId} className="sr-only">
                        {`Buy ${product.name} (opens in a new tab)`}
                      </span>
                    </a>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="merch-closing" aria-label="Replacement policy">
        <p className="merch-shipping">{MERCH_COPY.shipping}</p>
        <p className="merch-policy">
          <RefreshCw aria-hidden="true" strokeWidth={1.75} />
          {MERCH_COPY.policy}
        </p>
        {storeHref ? (
          <p className="merch-store">
            <a href={storeHref} target="_blank" rel="noopener noreferrer">
              {MERCH_COPY.storeCta}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        ) : null}
      </section>
    </div>
  );
}
