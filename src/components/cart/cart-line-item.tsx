"use client";

import Image from "next/image";

import { useCart, type CartLineItem } from "@/components/cart/cart-context";

function formatPrice(amountMinor: number) {
  return new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(amountMinor / 100).replace("PKR", "PKR ");
}

export function CartLineItemView({
  item,
  readOnly = false,
  showLineTotal = false,
}: {
  item: CartLineItem;
  readOnly?: boolean;
  /** Renders a right-aligned "Line total" cell. Used only on the /cart page. */
  showLineTotal?: boolean;
}) {
  const { removeItem, updateQuantity } = useCart();
  return (
    <article className="cart-line-item">
      <div className="cart-line-item__image">
        {item.image && <Image alt={item.imageAlt} fill sizes="(min-width: 768px) 12rem, 7rem" src={item.image} />}
      </div>
      <div className="cart-line-item__content">
        <div>
          <h2>{item.title}</h2>
          {item.variantLabel && <p>{item.variantLabel}</p>}
          <span>{formatPrice(item.unitPriceMinor)}</span>
        </div>
        {readOnly ? (
          <p className="cart-line-item__qty">Qty {item.quantity}</p>
        ) : (
          <div className="cart-line-item__actions">
            <div className="cart-quantity">
              <button aria-label={`Decrease ${item.title} quantity`} disabled={item.quantity === 1} onClick={() => updateQuantity(item.id, item.quantity - 1)} type="button">
                −
              </button>
              <output>{item.quantity}</output>
              <button aria-label={`Increase ${item.title} quantity`} onClick={() => updateQuantity(item.id, item.quantity + 1)} type="button">
                +
              </button>
            </div>
            <button className="cart-remove" onClick={() => removeItem(item.id)} type="button">
              Remove
            </button>
          </div>
        )}
      </div>
      {showLineTotal && (
        <div className="cart-line-item__total">
          <span>Line total</span>
          <strong>{formatPrice(item.unitPriceMinor * item.quantity)}</strong>
        </div>
      )}
    </article>
  );
}

export function CartPrice({ amountMinor }: { amountMinor: number }) {
  return <>{formatPrice(amountMinor)}</>;
}
