"use server";

import { randomUUID } from "node:crypto";

import { getAuthorizedAdmin } from "@/lib/admin/require-admin";
import { getServerSupabaseClient } from "@/lib/supabase/server-client";

export type UploadImageResult = { status: "success"; url: string } | { status: "error"; message: string };

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const MAX_BYTES = 5 * 1024 * 1024;
const STORAGE_BUCKET = "product-media";

/**
 * Server Action: receives a File from a client component's FormData,
 * uploads it to Supabase Storage under the service-role client (never
 * exposing storage credentials to the browser), and returns its public
 * URL for the product form to store in product_media.url.
 */
export async function uploadProductImage(formData: FormData): Promise<UploadImageResult> {
  const admin = await getAuthorizedAdmin();
  if (!admin) return { status: "error", message: "Not authorized." };

  const file = formData.get("file");
  if (!(file instanceof File)) return { status: "error", message: "No file provided." };
  if (!ALLOWED_TYPES.has(file.type)) return { status: "error", message: "Use a JPEG, PNG, WEBP, or AVIF image." };
  if (file.size > MAX_BYTES) return { status: "error", message: "Image must be 5MB or smaller." };

  const client = getServerSupabaseClient();
  const extension = file.name.split(".").pop() ?? "jpg";
  const path = `products/${randomUUID()}.${extension}`;

  const { error } = await client.storage.from(STORAGE_BUCKET).upload(path, file, { contentType: file.type });
  if (error) return { status: "error", message: `Upload failed: ${error.message}` };

  const { data } = client.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return { status: "success", url: data.publicUrl };
}
