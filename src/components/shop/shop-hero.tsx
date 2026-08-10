import Image from "next/image";

/**
 * Art-directed editorial hero for /shop only. Warm cream canvas, a large
 * edge-bleeding photograph with a soft cream dissolve on its left edge,
 * oversized serif headline that tucks over that dissolve, a single oxblood
 * accent (vertical rule + micro-label) on the far left, and one text CTA.
 */
export function ShopHero() {
  return (
    <section aria-labelledby="shop-hero-title" className="shop-hero">
      <div aria-hidden="true" className="shop-hero__edge">
        <span className="shop-hero__edge-rule" />
        <span className="shop-hero__edge-label">The Edit — No. 01</span>
      </div>

      <div className="shop-hero__copy">
        <p className="shop-hero__eyebrow">The Shazia Khushk Edit</p>
        <h1 className="shop-hero__title" id="shop-hero-title">
          A considered
          <br />
          collection for
          <br />
          modern rituals.
        </h1>
        <p className="shop-hero__description">A curated selection of clothing, fragrance and everyday care.</p>
        <a className="shop-hero__cta" href="#shop-products">
          Explore the edit
          <span aria-hidden="true" className="shop-hero__cta-arrow">
            &rarr;
          </span>
        </a>
      </div>

      <div className="shop-hero__media">
        <Image
          alt="Shazia Khushk clothing editorial"
          className="shop-hero__image"
          fill
          priority
          sizes="(min-width: 48rem) 67vw, 100vw"
          src="/images/home/hero-editorial.png"
          style={{ objectPosition: "center 35%" }}
        />
        <span aria-hidden="true" className="shop-hero__media-wash" />
      </div>
    </section>
  );
}
