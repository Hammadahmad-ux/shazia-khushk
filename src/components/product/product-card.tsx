import Image from "next/image";
import Link from "next/link";

import { Price } from "@/components/commerce/price";
import { categoryLabel, type ShopProduct } from "@/data/shop-catalog";

interface ProductCardProps {
  product: ShopProduct;
  sizes?: string;
  priority?: boolean;
}

const DEFAULT_SIZES = "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 50vw";

export function ProductCard({ product, sizes = DEFAULT_SIZES, priority = false }: ProductCardProps) {
  return (
    <Link className="product-card group" href={product.href}>
      <div className="product-card__media">
        {product.image && <Image alt={product.alt} className="product-card__image" fill priority={priority} sizes={sizes} src={product.image} />}
        {product.hoverImage && (
          <Image alt="" aria-hidden="true" className="product-card__image product-card__image--hover" fill sizes={sizes} src={product.hoverImage} />
        )}
      </div>
      <div className="product-card__details">
        <p className="product-card__category">{categoryLabel(product.category)}</p>
        <h3 className="product-card__title">{product.title}</h3>
        {product.priceMinor !== null && (
          <p className="product-card__price">
            {product.priceVaries && <span className="product-card__price-prefix">From </span>}
            <Price amountMinor={product.priceMinor} />
            {product.compareAtPriceMinor !== null && (
              <span className="product-card__compare-at">
                <Price amountMinor={product.compareAtPriceMinor} />
              </span>
            )}
          </p>
        )}
        <span className="product-card__cta">
          View product <span aria-hidden="true">&rarr;</span>
        </span>
      </div>
    </Link>
  );
}
