import Image from "next/image";
import Link from "next/link";

const trustPoints = [
  ["Delivery support", "Help when you need it"],
  ["Checkout support", "A clear purchase journey"],
  ["Curated quality", "Chosen with care"],
  ["Customer support", "Here to help"],
] as const;

function StoryLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      className="mt-5 inline-flex min-h-11 items-center gap-3 border-b border-foreground/25 text-[0.6875rem] font-semibold tracking-[0.1em] uppercase no-underline transition-colors hover:border-accent hover:text-accent"
      href={href}
    >
      {children}
      <span aria-hidden="true">&rarr;</span>
    </Link>
  );
}

export function HomeStories() {
  return (
    <>
      <section className="home-section home-section-compact home-story-section" aria-label="Collection stories">
        <div className="grid gap-4 lg:grid-cols-2">
          <article className="home-story-card home-story-card--clothing">
            <div className="home-story-card__copy">
              <p className="text-[0.6875rem] font-semibold tracking-[0.18em] text-accent uppercase">The Shazia Khushk edit</p>
              <h2 className="mt-4 font-display text-[clamp(2rem,3.4vw,3.25rem)] leading-[1.02] tracking-[-0.02em]">
                Rooted in heritage. Designed for you.
              </h2>
              <StoryLink href="/collections/clothing">Explore clothing</StoryLink>
            </div>
            <div className="home-story-card__image">
              <Image
                alt="Traditional embroidered clothing"
                className="object-cover object-[72%_center]"
                fill
                sizes="(min-width: 1024px) 34vw, 100vw"
                src="/images/home/story-clothing-editorial.png"
              />
            </div>
          </article>

          <article className="home-story-card home-story-card--fragrance">
            <div className="home-story-card__copy">
              <p className="text-[0.6875rem] font-semibold tracking-[0.18em] text-accent uppercase">Curated scents</p>
              <h2 className="mt-4 font-display text-[clamp(2rem,3.4vw,3.25rem)] leading-[1.02] tracking-[-0.02em]">
                Scents that speak your story.
              </h2>
              <StoryLink href="/collections/fragrance">Explore fragrance</StoryLink>
            </div>
            <div className="home-story-card__image bg-[#e7e2db]">
              <Image
                alt="Zorvan fragrance bottle"
                className="object-cover object-[82%_center]"
                fill
                sizes="(min-width: 1024px) 34vw, 100vw"
                src="/images/home/story-fragrance-editorial.png"
              />
            </div>
          </article>
        </div>
      </section>

      <section className="home-section home-section-compact home-trust" aria-labelledby="store-note-title">
        <h2 id="store-note-title" className="sr-only">
          The Shazia Khushk experience
        </h2>
        <div className="home-trust__grid">
          {trustPoints.map(([title, detail], index) => (
            <div className="home-trust__item" key={title}>
              <span className="home-trust__number" aria-hidden="true">
                0{index + 1}
              </span>
              <div>
                <p className="text-xs font-semibold tracking-[0.08em] uppercase">{title}</p>
                <p className="mt-1 text-xs text-muted">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
