"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useCart } from "@/components/cart/cart-context";
import { Price } from "@/components/commerce/price";
import { CheckIcon } from "@/components/ui/icons";
import { categoryLabel } from "@/data/shop-catalog";
import type { PdpProduct, PdpVariant } from "@/data/pdp-catalog";
import { returns, shipping } from "@/lib/commerce/business-config";
import { formatMoney } from "@/utils/format-money";

function isPurchasableVariant(variant: PdpVariant): boolean {
  return variant.active && variant.priceMinor !== null && variant.quantityAvailable > 0;
}

function matchesSelection(variant: PdpVariant, selected: Record<string, string>, ignoreGroup?: string): boolean {
  return Object.entries(selected).every(([group, value]) => group === ignoreGroup || variant.options[group] === value);
}

export function ProductDetail({ product }: { product: PdpProduct }) {
  const [activeMedia, setActiveMedia] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const { addItem } = useCart();

  const selectedImage = product.gallery[activeMedia] ?? product.gallery[0] ?? null;
  const allOptionsSelected = product.options.every((group) => selectedOptions[group.name]);

  const matchedVariant =
    product.options.length === 0
      ? (product.variants.find(isPurchasableVariant) ?? product.variants[0] ?? null)
      : allOptionsSelected
        ? (product.variants.find((variant) => matchesSelection(variant, selectedOptions)) ?? null)
        : null;

  const variantIsPurchasable = matchedVariant !== null && isPurchasableVariant(matchedVariant);
  const canPurchase = product.purchasable && variantIsPurchasable;

  const displayPriceMinor = matchedVariant?.priceMinor ?? product.priceMinor;
  const displayCompareAtMinor = matchedVariant ? matchedVariant.compareAtPriceMinor : product.compareAtPriceMinor;
  const showFromPrefix = !matchedVariant && product.priceVaries;

  const ctaLabel = !product.purchasable
    ? "Unavailable"
    : !allOptionsSelected && product.options.length > 0
      ? "Select options"
      : !variantIsPurchasable
        ? "Out of stock"
        : "Add to cart";

  function handleSelectOption(groupName: string, value: string) {
    setSelectedOptions((current) => ({ ...current, [groupName]: value }));
  }

  function handleAddToCart() {
    if (!matchedVariant || matchedVariant.priceMinor === null) return;
    addItem(
      {
        productId: product.id,
        productSlug: product.slug,
        title: product.title,
        image: product.image,
        imageAlt: product.alt,
        variantLabel: matchedVariant.variantLabel,
        unitPriceMinor: matchedVariant.priceMinor,
      },
      quantity,
    );
  }

  return (
    <article className="pdp">
      <nav aria-label="Breadcrumb" className="pdp__breadcrumbs">
        <Link href="/shop">Shop</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/collections/${product.category}`}>{categoryLabel(product.category)}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{product.title}</span>
      </nav>

      <div className="pdp__layout">
        <section aria-label={`${product.title} media gallery`} className="pdp-gallery">
          {product.gallery.length > 1 && (
            <div className="pdp-gallery__thumbnails">
              {product.gallery.map((media, index) => (
                <button
                  aria-label={`Show image ${index + 1}`}
                  aria-pressed={activeMedia === index}
                  className="pdp-gallery__thumbnail"
                  key={media.src}
                  onClick={() => {
                    setActiveMedia(index);
                    setZoomed(false);
                  }}
                  type="button"
                >
                  <Image alt="" fill sizes="6rem" src={media.src} />
                </button>
              ))}
            </div>
          )}

          <div className="pdp-gallery__desktop-main">
            {selectedImage && (
              <>
                <Image
                  alt={selectedImage.alt}
                  className={zoomed ? "pdp-gallery__image is-zoomed" : "pdp-gallery__image"}
                  fill
                  priority
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  src={selectedImage.src}
                />
                <button aria-pressed={zoomed} className="pdp-gallery__zoom" onClick={() => setZoomed((value) => !value)} type="button">
                  {zoomed ? "Reduce image" : "Enlarge image"}
                </button>
              </>
            )}
          </div>

          <div aria-label="Swipe through product images" className="pdp-gallery__mobile-track">
            {product.gallery.length > 0 ? (
              product.gallery.map((media, index) => (
                <div className="pdp-gallery__mobile-slide" key={media.src}>
                  <Image alt={media.alt} fill sizes="100vw" src={media.src} />
                  {product.gallery.length > 1 && (
                    <span className="pdp-gallery__count">
                      {index + 1} / {product.gallery.length}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="pdp-gallery__mobile-slide" />
            )}
          </div>
        </section>

        <section aria-labelledby="product-title" className="pdp-purchase">
          <p className="pdp-purchase__eyebrow">{categoryLabel(product.category)}</p>
          <h1 id="product-title">{product.title}</h1>

          {displayPriceMinor !== null && (
            <p className="pdp-purchase__price">
              {showFromPrefix && <span className="pdp-purchase__price-prefix">From </span>}
              <span className="pdp-purchase__price-amount">
                <Price amountMinor={displayPriceMinor} />
              </span>
              {displayCompareAtMinor !== null && (
                <span className="pdp-purchase__compare-at">
                  <Price amountMinor={displayCompareAtMinor} />
                </span>
              )}
            </p>
          )}

          {product.descriptor && <p className="pdp-purchase__descriptor">{product.descriptor}</p>}

          {product.options.map((group) => (
            <fieldset className="pdp-option-group" key={group.name}>
              <legend>{group.name}</legend>
              <div className="pdp-option-group__values">
                {group.values.map((value) => {
                  const isSelected = selectedOptions[group.name] === value;
                  const isAvailable = product.variants.some(
                    (variant) => isPurchasableVariant(variant) && variant.options[group.name] === value && matchesSelection(variant, selectedOptions, group.name),
                  );

                  return (
                    <button
                      aria-pressed={isSelected}
                      className="pdp-option"
                      disabled={!isAvailable}
                      key={value}
                      onClick={() => handleSelectOption(group.name, value)}
                      type="button"
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}

          {product.purchasable && (
            <div className="pdp-quantity">
              <span>Quantity</span>
              <div>
                <button aria-label="Decrease quantity" disabled={quantity === 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} type="button">
                  &minus;
                </button>
                <output>{quantity}</output>
                <button aria-label="Increase quantity" onClick={() => setQuantity((value) => Math.min(99, value + 1))} type="button">
                  +
                </button>
              </div>
            </div>
          )}

          <button className="pdp-add-to-cart" disabled={!canPurchase} onClick={handleAddToCart} type="button">
            {ctaLabel}
            <span aria-hidden="true" className="pdp-add-to-cart__arrow">
              &rarr;
            </span>
          </button>

          {!product.purchasable && <p className="pdp-purchase__notice">This catalogue entry is not yet available to purchase.</p>}

          <ul className="pdp-trust" aria-label="Confirmed order information">
            <li>
              <CheckIcon className="pdp-trust__icon" />
              Cash on Delivery
            </li>
            <li>
              <CheckIcon className="pdp-trust__icon" />
              Flat shipping &mdash; {formatMoney(shipping.flatRateMinor)}
            </li>
            <li>
              <CheckIcon className="pdp-trust__icon" />
              Delivery via {shipping.couriers.join(" / ")}
            </li>
            <li>
              <CheckIcon className="pdp-trust__icon" />
              {returns.windowDays}-day return / exchange window
            </li>
          </ul>
        </section>
      </div>

      {product.details.length > 0 && (
        <section aria-label="Product information" className="pdp-details">
          {product.details.map((detail, index) => (
            <details key={detail.title} open={index === 0}>
              <summary>
                {detail.title}
                <span aria-hidden="true" className="pdp-details__indicator" />
              </summary>
              {typeof detail.content === "string" ? (
                <p>{detail.content}</p>
              ) : (
                <ul>
                  {detail.content.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              )}
            </details>
          ))}
        </section>
      )}
    </article>
  );
}
