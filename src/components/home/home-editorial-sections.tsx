import Image from "next/image";
import Link from "next/link";

const discoveryPaths = [
  {
    eyebrow: "The fragrance edit",
    title: "A scent for the moment.",
    href: "/collections/fragrance",
    label: "Explore fragrance",
    image: "/images/home/discovery-fragrance-v2.png",
    position: "object-center",
  },
  {
    eyebrow: "Everyday care",
    title: "Care, kept close.",
    href: "/collections/beauty-hair-care",
    label: "Explore hair care",
    image: "/images/home/discovery-care-v2.png",
    position: "object-center",
  },
] as const;

export function HomeEditorialSections() {
  return (
    <>
      <section className="home-house-note" aria-labelledby="house-note-title">
        <div className="home-house-note__copy">
          <p className="text-[0.6875rem] font-semibold tracking-[0.18em] text-accent uppercase">The Shazia Khushk edit</p>
          <h2 id="house-note-title" className="mt-4 font-display text-[clamp(2.75rem,5vw,5.25rem)] leading-[0.94] tracking-[-0.035em]">
            Made for the way you want to feel.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-7 text-muted">
            A considered selection of clothing, fragrance and everyday care, brought together in one place.
          </p>
          <Link className="home-editorial-link" href="/shop">
            Explore the shop <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        <div className="home-house-note__image">
          <Image
            alt="Shazia Khushk traditional clothing"
            className="object-cover object-center"
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            src="/images/home/house-editorial-v2.png"
          />
        </div>
      </section>

      <section className="home-discovery" aria-labelledby="discovery-title">
        <header className="home-discovery__header">
          <p className="text-[0.6875rem] font-semibold tracking-[0.18em] text-accent uppercase">Find your ritual</p>
          <h2 id="discovery-title" className="mt-3 font-display text-[clamp(2.1rem,3.6vw,3.75rem)] leading-none tracking-[-0.03em]">
            A little something, beautifully chosen.
          </h2>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          {discoveryPaths.map((path) => (
            <Link className="home-discovery__card group" href={path.href} key={path.href}>
              <Image
                alt=""
                className={`object-cover transition-transform duration-500 group-hover:scale-[1.025] ${path.position}`}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                src={path.image}
              />
              <div className="home-discovery__wash" />
              <div className="home-discovery__content">
                <p className="text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">{path.eyebrow}</p>
                <h3 className="mt-3 max-w-sm font-display text-[clamp(2rem,3vw,3.25rem)] leading-[0.98] tracking-[-0.03em]">{path.title}</h3>
                <span className="home-editorial-link home-editorial-link--light">
                  {path.label} <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-community-notes" aria-labelledby="community-notes-title">
        <div className="home-community-notes__intro">
          <p className="text-[0.6875rem] font-semibold tracking-[0.18em] text-accent uppercase">Our community</p>
          <h2 id="community-notes-title" className="mt-3 font-display text-[clamp(2rem,3.5vw,3.5rem)] leading-none tracking-[-0.03em]">
            Customer notes, coming soon.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
            This space will feature feedback from verified customers once orders begin.
          </p>
        </div>
        <div className="home-community-notes__marquee" aria-hidden="true">
          <div className="home-community-notes__track">
            {["Customer notes coming soon", "Share your experience after your order", "A place for real customer feedback", "Customer notes coming soon", "Share your experience after your order", "A place for real customer feedback"].map((note, index) => (
              <span className="home-community-notes__item" key={`${note}-${index}`}>
                {note}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
