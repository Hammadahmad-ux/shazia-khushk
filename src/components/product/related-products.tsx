import Image from "next/image";
import Link from "next/link";
import type { PdpProduct } from "@/data/pdp-catalog";

export function RelatedProducts({ products }: { products: readonly PdpProduct[] }) {
  if (products.length === 0) return null;
  return <section className="pdp-related" aria-labelledby="related-products-title"><h2 id="related-products-title">You may also like</h2><div className="pdp-related__grid">{products.map((product) => <Link className="pdp-related__card group" href={product.href} key={product.id}><div className="pdp-related__media"><Image alt={product.alt} className="object-cover transition-transform duration-300 group-hover:scale-[1.02]" fill sizes="(min-width: 1024px) 23vw, 52vw" src={product.image} /></div><p>{product.title}</p><span>{product.descriptor}</span></Link>)}</div></section>;
}
