"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useCart } from "@/components/cart/cart-context";
import type { PdpProduct } from "@/data/pdp-catalog";

export function ProductDetail({ product }: { product: PdpProduct }) {
  const [activeMedia, setActiveMedia] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const { addItem } = useCart();
  const selectedImage = product.gallery[activeMedia];
  const allOptionsSelected = product.options.every((group) => selectedOptions[group.name]);
  const canPurchase = product.purchasable && product.priceMinor !== null && allOptionsSelected;
  const categoryLabel = product.category === "beauty-hair-care" ? "Beauty & Hair Care" : product.category === "clothing" ? "Clothing" : "Fragrance";

  return (
    <article className="pdp">
      <nav aria-label="Breadcrumb" className="pdp__breadcrumbs">
        <Link href="/shop">Shop</Link><span aria-hidden="true">/</span>
        <Link href={`/collections/${product.category}`}>{categoryLabel}</Link><span aria-hidden="true">/</span>
        <span aria-current="page">{product.title}</span>
      </nav>
      <div className="pdp__layout">
        <section aria-label={`${product.title} media gallery`} className="pdp-gallery">
          {product.gallery.length > 1 && <div className="pdp-gallery__thumbnails">{product.gallery.map((media, index) => <button aria-label={`Show image ${index + 1}`} aria-pressed={activeMedia === index} className="pdp-gallery__thumbnail" key={media.src} onClick={() => { setActiveMedia(index); setZoomed(false); }} type="button"><Image alt="" fill sizes="5rem" src={media.src} /></button>)}</div>}
          <div className="pdp-gallery__desktop-main"><Image alt={selectedImage.alt} className={zoomed ? "pdp-gallery__image is-zoomed" : "pdp-gallery__image"} fill priority sizes="(min-width: 1024px) 55vw, 100vw" src={selectedImage.src} /><button aria-pressed={zoomed} className="pdp-gallery__zoom" onClick={() => setZoomed((value) => !value)} type="button">{zoomed ? "Reduce image" : "Enlarge image"}</button></div>
          <div className="pdp-gallery__mobile-track" aria-label="Swipe through product images">{product.gallery.map((media, index) => <div className="pdp-gallery__mobile-slide" key={media.src}><Image alt={media.alt} fill sizes="100vw" src={media.src} /><span className="pdp-gallery__count">{index + 1} / {product.gallery.length}</span></div>)}</div>
        </section>
        <section className="pdp-purchase" aria-labelledby="product-title">
          <p className="pdp-purchase__eyebrow">{categoryLabel}</p>
          <h1 id="product-title">{product.title}</h1><p className="pdp-purchase__descriptor">{product.descriptor}</p>
          {product.options.map((group) => <fieldset className="pdp-option-group" key={group.name}><legend>{group.name}</legend><div className="pdp-option-group__values">{group.values.map((value) => <button aria-pressed={selectedOptions[group.name] === value} className="pdp-option" key={value} onClick={() => setSelectedOptions((current) => ({ ...current, [group.name]: value }))} type="button">{value}</button>)}</div></fieldset>)}
          {product.purchasable && <div className="pdp-quantity"><span>Quantity</span><div><button aria-label="Decrease quantity" disabled={quantity === 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} type="button">−</button><output>{quantity}</output><button aria-label="Increase quantity" onClick={() => setQuantity((value) => value + 1)} type="button">+</button></div></div>}
          <button className="pdp-add-to-cart" disabled={!canPurchase} onClick={() => addItem({ productId: product.id, productSlug: product.slug, title: product.title, image: product.image, imageAlt: product.alt, variantLabel: Object.values(selectedOptions).join(" / ") || null, unitPriceMinor: product.priceMinor })} type="button">{product.purchasable ? "Add to cart" : "Unavailable"}</button>
          {!product.purchasable && <p className="pdp-purchase__notice">This catalogue entry is not yet available to purchase.</p>}
        </section>
      </div>
      {product.details.length > 0 && <section className="pdp-details" aria-label="Product information">{product.details.map((detail) => <details key={detail.title} open={product.details.length === 1}><summary>{detail.title}<span aria-hidden="true">+</span></summary><p>{detail.content}</p></details>)}</section>}
    </article>
  );
}
