import type { Metadata } from "next";
import { CartPageContent } from "@/components/cart/cart-page-content";

export const metadata: Metadata = {
  title: "Cart",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return <CartPageContent />;
}
