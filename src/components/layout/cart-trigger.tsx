"use client";

import { useCart } from "@/components/cart/cart-context";
import { BagIcon } from "@/components/ui/icons";

interface CartTriggerProps {
  compact?: boolean;
  itemCount?: number;
}

export function CartTrigger({ compact = false, itemCount }: CartTriggerProps) {
  const { itemCount: contextItemCount, openCart } = useCart();
  const safeCount = Math.max(0, Math.floor(itemCount ?? contextItemCount));
  const visibleCount = safeCount > 99 ? "99+" : safeCount.toString();

  return (
    <button
      aria-label={`Cart, ${safeCount} ${safeCount === 1 ? "item" : "items"}`}
      className="flex min-h-11 min-w-11 items-center justify-center gap-2 text-sm font-medium text-foreground no-underline transition-colors duration-[var(--transition-fast)] hover:text-accent"
      onClick={openCart}
      type="button"
    >
      <span className="relative" aria-hidden="true">
        <BagIcon className="size-5" />
        {compact && safeCount > 0 && (
          <span className="absolute -top-2 -right-2 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[0.625rem] leading-none text-surface">
            {visibleCount}
          </span>
        )}
      </span>
      {!compact && <span>Cart ({visibleCount})</span>}
    </button>
  );
}
