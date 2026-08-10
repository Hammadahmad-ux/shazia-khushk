"use client";

import Link from "next/link";
import { CartLineItemView, CartPrice } from "@/components/cart/cart-line-item";
import { useCart } from "@/components/cart/cart-context";
import { shipping } from "@/lib/commerce/business-config";

export function CartPageContent() {
  const { clearCart, items, subtotalMinor } = useCart();
  if (items.length === 0) {
    return (
      <section className="cart-page cart-page--empty">
        <p className="cart-page__eyebrow">Your order</p>
        <h1>Your bag</h1>
        <p className="cart-page__empty-message">Your bag is empty.</p>
        <p className="cart-page__empty-copy">Discover clothing, fragrance and everyday care.</p>
        <Link className="cart-page__cta" href="/shop">
          Shop the edit <span aria-hidden="true">&rarr;</span>
        </Link>
      </section>
    );
  }
  return (
    <section className="cart-page">
      <header className="cart-page__header">
        <div>
          <p className="cart-page__eyebrow">Your order</p>
          <h1>Your bag</h1>
          <p className="cart-page__intro">Review your selection before checkout.</p>
        </div>
        <button onClick={clearCart} type="button">
          Clear cart
        </button>
      </header>
      <div className="cart-page__layout">
        <div className="cart-page__items">
          {items.map((item) => (
            <CartLineItemView item={item} key={item.id} showLineTotal />
          ))}
        </div>
        <aside aria-labelledby="cart-summary-title" className="cart-summary">
          <h2 id="cart-summary-title">Order summary</h2>
          <div className="cart-summary__row">
            <span>Subtotal</span>
            <strong>
              <CartPrice amountMinor={subtotalMinor} />
            </strong>
          </div>
          <div className="cart-summary__row">
            <span>Shipping</span>
            <strong>
              <CartPrice amountMinor={shipping.flatRateMinor} />
            </strong>
          </div>
          <div className="cart-summary__row cart-summary__total">
            <span>Total</span>
            <strong>
              <CartPrice amountMinor={subtotalMinor + shipping.flatRateMinor} />
            </strong>
          </div>
          <Link className="cart-summary__checkout" href="/checkout">
            Proceed to checkout{" "}
            <span aria-hidden="true" className="cart-summary__checkout-arrow">
              &rarr;
            </span>
          </Link>
          <Link className="cart-summary__continue" href="/shop">
            Continue shopping
          </Link>
          <ul className="cart-summary__notes">
            <li>Cash on Delivery</li>
            <li>Flat shipping — Rs 199</li>
            <li>TCS / Leopards</li>
            <li>7-day return &amp; exchange</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}
