"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { CartLineItemView, CartPrice } from "@/components/cart/cart-line-item";
import { useCart } from "@/components/cart/cart-context";
import { CloseIcon } from "@/components/ui/icons";
import { shipping } from "@/lib/commerce/business-config";
import { formatMoney } from "@/utils/format-money";

export function CartDrawer() {
  const { closeCart, isOpen, itemCount, items, subtotalMinor } = useCart();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
      if (event.key === "Tab" && drawerRef.current) {
        const focusable = Array.from(drawerRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
        if (focusable.length > 0) {
          const first = focusable[0];
          const last = focusable.at(-1)!;
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeCart, isOpen]);

  const itemLabel = itemCount === 1 ? "item" : "items";

  return (
    <div aria-hidden={!isOpen} className={isOpen ? "cart-drawer is-open" : "cart-drawer"}>
      <button aria-label="Close cart" className="cart-drawer__backdrop" onClick={closeCart} tabIndex={isOpen ? 0 : -1} type="button" />
      <aside aria-label="Cart" aria-modal="true" className="cart-drawer__panel" ref={drawerRef} role="dialog">
        <header>
          <div className="cart-drawer__heading">
            <h2>Your bag</h2>
            <span className="cart-drawer__count">
              {itemCount} {itemLabel}
            </span>
          </div>
          <button aria-label="Close cart" ref={closeButtonRef} onClick={closeCart} type="button">
            <CloseIcon className="size-5" />
          </button>
        </header>
        {items.length === 0 ? (
          <div className="cart-empty">
            <p className="cart-empty__title">Your bag is empty.</p>
            <p className="cart-empty__description">Discover clothing, fragrance and everyday care.</p>
            <Link className="cart-empty__cta" href="/shop" onClick={closeCart}>
              Shop the edit <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-drawer__items">
              {items.map((item) => (
                <CartLineItemView item={item} key={item.id} />
              ))}
            </div>
            <footer>
              <div className="cart-drawer__summary">
                <div className="cart-drawer__row">
                  <span>Subtotal</span>
                  <strong>
                    <CartPrice amountMinor={subtotalMinor} />
                  </strong>
                </div>
                <div className="cart-drawer__row">
                  <span>Flat shipping</span>
                  <span>{formatMoney(shipping.flatRateMinor)}</span>
                </div>
              </div>
              <p className="cart-drawer__note">Flat rate on every order &mdash; confirmed at checkout.</p>
              <Link className="cart-drawer__checkout" href="/checkout" onClick={closeCart}>
                Checkout{" "}
                <span aria-hidden="true" className="cart-drawer__checkout-arrow">
                  &rarr;
                </span>
              </Link>
              <Link className="cart-drawer__view-cart" href="/cart" onClick={closeCart}>
                View cart
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
