import Link from "next/link";

export function HomeBrandStatement() {
  return (
    <section className="home-statement" aria-labelledby="brand-statement-title">
      <div className="home-statement__inner">
        <p className="home-statement__eyebrow">Our approach</p>
        <h2 id="brand-statement-title">Fewer pieces. Considered choices.</h2>
        <p>Every piece in the edit is chosen for how it&rsquo;s worn every day, not just how it photographs.</p>
        <Link className="home-editorial-link" href="/shop">
          Shop the edit <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </section>
  );
}
