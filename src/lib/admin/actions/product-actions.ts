"use server";

import { revalidatePath } from "next/cache";

import { getAuthorizedAdmin } from "@/lib/admin/require-admin";
import { createProductRecord, deleteProductRecord, setProductActive, updateProductRecord } from "@/lib/admin/products/product-repository";
import type { ProductFormPayload } from "@/lib/admin/products/types";
import { validateProductPayload, type ProductValidationError } from "@/lib/admin/products/validate-product";

export type ProductActionResult =
  | { status: "success"; id: string }
  | { status: "error"; message: string; fieldErrors?: readonly ProductValidationError[] };

export async function createProduct(payload: ProductFormPayload): Promise<ProductActionResult> {
  const admin = await getAuthorizedAdmin();
  if (!admin) return { status: "error", message: "Not authorized." };

  const fieldErrors = validateProductPayload(payload);
  if (fieldErrors.length > 0) return { status: "error", message: "Fix the highlighted fields.", fieldErrors };

  try {
    const id = await createProductRecord(payload);
    revalidatePath("/admin/products");
    return { status: "success", id };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Failed to create product." };
  }
}

export async function updateProduct(id: string, payload: ProductFormPayload): Promise<ProductActionResult> {
  const admin = await getAuthorizedAdmin();
  if (!admin) return { status: "error", message: "Not authorized." };

  const fieldErrors = validateProductPayload(payload);
  if (fieldErrors.length > 0) return { status: "error", message: "Fix the highlighted fields.", fieldErrors };

  try {
    await updateProductRecord(id, payload);
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}/edit`);
    return { status: "success", id };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Failed to update product." };
  }
}

export async function toggleProductActive(id: string, active: boolean): Promise<ProductActionResult> {
  const admin = await getAuthorizedAdmin();
  if (!admin) return { status: "error", message: "Not authorized." };

  try {
    await setProductActive(id, active);
    revalidatePath("/admin/products");
    return { status: "success", id };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Failed to update product." };
  }
}

/** Same as toggleProductActive, but discards its result so it can be bound directly to a <form action>. */
export async function toggleProductActiveForm(id: string, active: boolean): Promise<void> {
  await toggleProductActive(id, active);
}

export async function deleteProduct(id: string): Promise<ProductActionResult> {
  const admin = await getAuthorizedAdmin();
  if (!admin) return { status: "error", message: "Not authorized." };

  try {
    await deleteProductRecord(id);
    revalidatePath("/admin/products");
    return { status: "success", id };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Failed to delete product." };
  }
}
