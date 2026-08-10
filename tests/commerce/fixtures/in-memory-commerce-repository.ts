import type { CommerceRepository, CreateOrderRecord, CreatedOrderReference } from "../../../src/lib/commerce/commerce-repository";
import type { OrderConfirmationView, VariantLookupKey, VariantResolution, VariantSnapshot } from "../../../src/lib/commerce/types";

export interface SeedVariant extends VariantSnapshot {
  quantityAvailable: number;
}

/**
 * In-memory stand-in for the Supabase-backed repository, so
 * checkout-service.ts's business rules can be exercised with
 * `node --test` and no database.
 */
export class InMemoryCommerceRepository implements CommerceRepository {
  private readonly variants = new Map<string, SeedVariant>();
  private readonly ordersByIdempotencyKey = new Map<string, CreatedOrderReference>();
  private readonly createdOrders: CreateOrderRecord[] = [];
  private orderSequence = 1000;
  private failNextCreateOrderWith: Error | null = null;

  private static key(productSlug: string, variantLabel: string | null): string {
    return `${productSlug}::${variantLabel ?? ""}`;
  }

  seedVariant(variant: SeedVariant): void {
    this.variants.set(InMemoryCommerceRepository.key(variant.productSlug, variant.variantLabel), variant);
  }

  /** Simulate a race condition: repository.createOrder rejects on its next call only. */
  failNextCreateOrder(error: Error): void {
    this.failNextCreateOrderWith = error;
  }

  getCreatedOrders(): readonly CreateOrderRecord[] {
    return this.createdOrders;
  }

  getRemainingStock(productSlug: string, variantLabel: string | null): number | undefined {
    return this.variants.get(InMemoryCommerceRepository.key(productSlug, variantLabel))?.quantityAvailable;
  }

  async resolveVariants(keys: readonly VariantLookupKey[]): Promise<readonly VariantResolution[]> {
    return keys.map((key) => {
      const snapshot = this.variants.get(InMemoryCommerceRepository.key(key.productSlug, key.variantLabel));
      if (!snapshot) return { found: false, key };
      return { found: true, key, snapshot };
    });
  }

  async findOrderByIdempotencyKey(key: string): Promise<CreatedOrderReference | null> {
    return this.ordersByIdempotencyKey.get(key) ?? null;
  }

  async createOrder(record: CreateOrderRecord): Promise<CreatedOrderReference> {
    if (this.failNextCreateOrderWith) {
      const error = this.failNextCreateOrderWith;
      this.failNextCreateOrderWith = null;
      throw error;
    }

    for (const item of record.items) {
      const snapshot = [...this.variants.values()].find((variant) => variant.variantId === item.variantId);
      if (!snapshot || snapshot.quantityAvailable < item.quantity) {
        throw new Error(`insufficient_stock: ${item.sku}`);
      }
    }

    for (const item of record.items) {
      const snapshot = [...this.variants.values()].find((variant) => variant.variantId === item.variantId)!;
      snapshot.quantityAvailable -= item.quantity;
    }

    this.createdOrders.push(record);
    this.orderSequence += 1;

    const reference: CreatedOrderReference = {
      orderNumber: `SK-${String(this.orderSequence).padStart(6, "0")}`,
      confirmationToken: `test-token-${this.orderSequence}`,
    };

    if (record.idempotencyKey) {
      this.ordersByIdempotencyKey.set(record.idempotencyKey, reference);
    }

    return reference;
  }

  async getOrderConfirmation(): Promise<OrderConfirmationView | null> {
    throw new Error("not implemented in the in-memory fake");
  }
}
