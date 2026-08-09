import {
  developmentCollections,
  developmentProducts,
} from "@/data/development-catalog";
import type { CatalogRepository } from "@/lib/catalog/catalog-repository";

export const developmentCatalogRepository: CatalogRepository = {
  async listProducts() {
    return developmentProducts;
  },
  async getProductBySlug(slug) {
    return developmentProducts.find((product) => product.slug === slug) ?? null;
  },
  async listCollections() {
    return developmentCollections;
  },
  async getCollectionBySlug(slug) {
    return (
      developmentCollections.find((collection) => collection.slug === slug) ?? null
    );
  },
  async listProductsByIds(ids) {
    const idSet = new Set(ids);
    return developmentProducts.filter((product) => idSet.has(product.id));
  },
};
