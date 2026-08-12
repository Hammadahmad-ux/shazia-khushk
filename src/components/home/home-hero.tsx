import Image from "next/image";
import Link from "next/link";

export function HomeHero() {
  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="home-hero__art" aria-hidden="true">
        <Image
          alt=""
          className="home-hero__image object-cover"
          fill
          priority
          sizes="(min-width: 90rem) 90rem, 100vw"
          src="/images/home/hero-editorial.png"
        />
      </div>

      <div className="home-hero__content">
        <div className="home-hero__copy">
          <p className="mb-4 flex items-center gap-3 text-[0.6875rem] font-semibold tracking-[0.18em] text-accent uppercase">
            <span aria-hidden="true" className="h-px w-7 bg-accent" />
            Shazia Khushk
          </p>
          <h1
            id="home-hero-title"
            className="max-w-[11ch] font-display text-[clamp(2.75rem,5.3vw,4.75rem)] leading-[0.98] font-normal tracking-[-0.025em] text-foreground"
          >
            Tradition, styled for today.
          </h1>
          <p className="mt-5 max-w-[27rem] text-[0.9375rem] leading-7 text-muted md:mt-6">
            A curated edit of clothing, fragrance and everyday care.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3 md:mt-8">
            <Link
              className="home-hero-primary group inline-flex min-h-12 items-center justify-center gap-4 bg-foreground px-7 py-3 text-xs font-semibold tracking-[0.12em] uppercase no-underline transition-colors duration-[var(--transition-base)] hover:bg-accent"
              href="/shop"
            >
              Shop now
              <span
                aria-hidden="true"
                className="transition-transform duration-[var(--transition-base)] group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </Link>
            <Link
              className="inline-flex min-h-12 items-center border-b border-foreground/30 text-[0.6875rem] font-semibold tracking-[0.1em] uppercase no-underline transition-colors duration-[var(--transition-fast)] hover:border-accent hover:text-accent"
              href="/collections/fragrance"
            >
              Explore fragrance
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
