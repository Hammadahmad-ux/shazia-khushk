import type { Product, ProductCollection } from "@/types/product";

export interface CatalogRepository {
  listProducts(): Promise<readonly Product[]>;
  getProductBySlug(slug: string): Promise<Product | null>;
  listCollections(): Promise<readonly ProductCollection[]>;
  getCollectionBySlug(slug: string): Promise<ProductCollection | null>;
  listProductsByIds(ids: readonly string[]): Promise<readonly Product[]>;
}
