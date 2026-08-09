"use client";

import Link from "next/link";
import { CartLineItemView, CartPrice } from "@/components/cart/cart-line-item";
import { useCart } from "@/components/cart/cart-context";

export function CartPageContent() {
  const { clearCart, items, subtotalMinor } = useCart();
  if (items.length === 0) return <section className="cart-page cart-page--empty"><p className="cart-page__eyebrow">Your selection</p><h1>Your cart is empty.</h1><Link href="/shop">Continue shopping</Link></section>;
  return <section className="cart-page"><header className="cart-page__header"><div><p className="cart-page__eyebrow">Your selection</p><h1>Cart</h1></div><button onClick={clearCart} type="button">Clear cart</button></header><div className="cart-page__layout"><div className="cart-page__items">{items.map((item) => <CartLineItemView item={item} key={item.id} />)}<Link className="cart-page__continue" href="/shop">Continue shopping</Link></div><aside className="cart-summary"><h2>Order summary</h2><div><span>Subtotal</span><strong><CartPrice amountMinor={subtotalMinor} /></strong></div><div><span>Shipping</span><span>Calculated at checkout</span></div><div className="cart-summary__total"><span>Total before shipping</span><strong><CartPrice amountMinor={subtotalMinor} /></strong></div><Link href="/checkout">Proceed to checkout</Link></aside></div></section>;
}
