"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { CartLineItemView, CartPrice } from "@/components/cart/cart-line-item";
import { useCart } from "@/components/cart/cart-context";
import { CloseIcon } from "@/components/ui/icons";

export function CartDrawer() {
  const { closeCart, isOpen, itemCount, items, subtotalMinor } = useCart();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") closeCart(); if (event.key === "Tab" && drawerRef.current) { const focusable = Array.from(drawerRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')); if (focusable.length > 0) { const first = focusable[0]; const last = focusable.at(-1)!; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } } } };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = originalOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [closeCart, isOpen]);

  return <div aria-hidden={!isOpen} className={isOpen ? "cart-drawer is-open" : "cart-drawer"}><button aria-label="Close cart" className="cart-drawer__backdrop" onClick={closeCart} tabIndex={isOpen ? 0 : -1} type="button"/><aside aria-label="Cart" aria-modal="true" className="cart-drawer__panel" ref={drawerRef} role="dialog"><header><h2>Cart <span>({itemCount})</span></h2><button aria-label="Close cart" ref={closeButtonRef} onClick={closeCart} type="button"><CloseIcon className="size-5" /></button></header>{items.length === 0 ? <div className="cart-empty"><p>Your cart is currently empty.</p><Link href="/shop" onClick={closeCart}>Continue shopping</Link></div> : <><div className="cart-drawer__items">{items.map((item) => <CartLineItemView item={item} key={item.id} />)}</div><footer><div><span>Subtotal</span><strong><CartPrice amountMinor={subtotalMinor} /></strong></div><p>Shipping is calculated at checkout.</p><Link className="cart-drawer__checkout" href="/checkout" onClick={closeCart}>Checkout</Link><Link className="cart-drawer__view-cart" href="/cart" onClick={closeCart}>View cart</Link></footer></>}</aside></div>;
}
