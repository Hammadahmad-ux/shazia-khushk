import Link from "next/link";

import { Price } from "@/components/commerce/price";
import type { Product } from "@/types/product";

interface ProductSummaryProps {
  product: Product;
}

export function ProductSummary({ product }: ProductSummaryProps) {
  const defaultVariant = product.variants.find((variant) => variant.isDefault);
  const isPurchasable = product.status === "active" && defaultVariant?.status === "active";

  return (
    <article className="grid gap-3 border-t border-border py-6 sm:grid-cols-[1fr_auto] sm:items-end">
      <div>
        <p className="text-xs font-semibold tracking-[var(--tracking-label)] text-muted uppercase">
          {product.productType}
        </p>
        <h2 className="mt-2 font-display text-2xl leading-heading">
          <Link className="no-underline hover:text-accent" href={`/products/${product.slug}`}>
            {product.title}
          </Link>
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">{product.shortDescription}</p>
      </div>
      <p className="text-sm font-medium">
        {isPurchasable && defaultVariant ? (
          <Price amountMinor={defaultVariant.priceMinor} currency={defaultVariant.currency} />
        ) : (
          "Draft development record"
        )}
      </p>
    </article>
  );
}
