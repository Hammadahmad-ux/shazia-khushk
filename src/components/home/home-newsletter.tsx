export function HomeNewsletter() {
  return (
    <section className="home-section home-newsletter" aria-labelledby="newsletter-title">
      <div className="grid overflow-hidden bg-accent text-white lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="p-7 sm:p-10 lg:px-14 lg:py-10">
          <h2 id="newsletter-title" className="font-display text-3xl leading-tight">
            Be the first to know.
          </h2>
          <p className="mt-2 text-sm text-white/75">New arrivals, collection stories and brand updates.</p>
        </div>

        <form className="flex flex-col justify-center p-7 pt-0 sm:p-10 sm:pt-0 lg:p-10 lg:pl-0 lg:pr-14" aria-label="Newsletter signup">
          <label className="sr-only" htmlFor="newsletter-email">Email address</label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              aria-describedby="newsletter-status"
              className="min-h-12 flex-1 border border-white/35 bg-white px-4 text-sm text-foreground disabled:cursor-not-allowed"
              disabled
              id="newsletter-email"
              name="email"
              placeholder="Enter your email"
              type="email"
            />
            <button
              className="min-h-12 border border-white px-8 text-xs font-semibold tracking-[0.1em] text-white uppercase disabled:cursor-not-allowed"
              disabled
              type="submit"
            >
              Subscribe
            </button>
          </div>
          <p id="newsletter-status" className="sr-only">
            Newsletter signup is not connected yet.
          </p>
        </form>
      </div>
    </section>
  );
}
