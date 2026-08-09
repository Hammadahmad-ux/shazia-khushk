"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface CartLineItem {
  id: string;
  productId: string;
  productSlug: string;
  title: string;
  image: string;
  imageAlt: string;
  variantLabel: string | null;
  unitPriceMinor: number;
  currency: "PKR";
  quantity: number;
}

export interface CartProductInput {
  productId: string;
  productSlug: string;
  title: string;
  image: string;
  imageAlt: string;
  variantLabel?: string | null;
  unitPriceMinor: number | null;
  currency?: "PKR";
}

interface CartContextValue {
  items: readonly CartLineItem[];
  itemCount: number;
  subtotalMinor: number;
  isOpen: boolean;
  addItem: (product: CartProductInput) => boolean;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const STORAGE_KEY = "shazia-khushk-cart-v1";
const CartContext = createContext<CartContextValue | null>(null);

function isCartLineItem(value: unknown): value is CartLineItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === "string" && typeof item.productId === "string" && typeof item.productSlug === "string" && typeof item.title === "string" && typeof item.image === "string" && typeof item.imageAlt === "string" && (typeof item.variantLabel === "string" || item.variantLabel === null) && typeof item.unitPriceMinor === "number" && Number.isFinite(item.unitPriceMinor) && item.unitPriceMinor >= 0 && item.currency === "PKR" && typeof item.quantity === "number" && Number.isInteger(item.quantity) && item.quantity > 0;
}

function loadCart(): CartLineItem[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isCartLineItem) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      setItems(loadCart());
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(hydrationTimer);
  }, []);
  useEffect(() => { if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [hydrated, items]);

  const addItem = useCallback((product: CartProductInput) => {
    if (product.unitPriceMinor === null || !Number.isFinite(product.unitPriceMinor) || product.unitPriceMinor < 0) return false;
    const unitPriceMinor = product.unitPriceMinor;
    const variantLabel = product.variantLabel ?? null;
    const id = `${product.productId}:${variantLabel ?? "default"}`;
    setItems((current) => {
      const existing = current.find((item) => item.id === id);
      if (existing) return current.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...current, { id, productId: product.productId, productSlug: product.productSlug, title: product.title, image: product.image, imageAlt: product.imageAlt, variantLabel, unitPriceMinor, currency: product.currency ?? "PKR", quantity: 1 }];
    });
    setIsOpen(true);
    return true;
  }, []);

  const value = useMemo<CartContextValue>(() => ({
    items,
    itemCount: items.reduce((count, item) => count + item.quantity, 0),
    subtotalMinor: items.reduce((total, item) => total + item.unitPriceMinor * item.quantity, 0),
    isOpen,
    addItem,
    updateQuantity: (lineId, quantity) => setItems((current) => quantity < 1 ? current.filter((item) => item.id !== lineId) : current.map((item) => item.id === lineId ? { ...item, quantity: Math.min(99, Math.floor(quantity)) } : item)),
    removeItem: (lineId) => setItems((current) => current.filter((item) => item.id !== lineId)),
    clearCart: () => setItems([]),
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
  }), [addItem, isOpen, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
