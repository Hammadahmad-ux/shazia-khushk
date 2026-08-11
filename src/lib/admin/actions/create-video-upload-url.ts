"use server";

import { randomUUID } from "node:crypto";

import { getAuthorizedAdmin } from "@/lib/admin/require-admin";
import { getServerSupabaseClient } from "@/lib/supabase/server-client";

export type CreateVideoUploadUrlResult =
  | { status: "success"; path: string; token: string; publicUrl: string }
  | { status: "error"; message: string };

const ALLOWED_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);
const MAX_BYTES = 50 * 1024 * 1024;
const STORAGE_BUCKET = "product-media";

/**
 * Server Action: authorizes a video upload and hands back a short-lived
 * signed Supabase Storage upload URL. The product form then PUTs the
 * file straight to Storage from the browser (upload-product-image.ts's
 * proxy-through-the-server approach works for 5MB photos, but Vercel's
 * serverless function body limit is far too small for video).
 */
export async function createVideoUploadUrl(fileName: string, fileType: string, fileSize: number): Promise<CreateVideoUploadUrlResult> {
  const admin = await getAuthorizedAdmin();
  if (!admin) return { status: "error", message: "Not authorized." };

  if (!ALLOWED_TYPES.has(fileType)) return { status: "error", message: "Use an MP4, WebM, or MOV video." };
  if (fileSize > MAX_BYTES) return { status: "error", message: "Video must be 50MB or smaller." };

  const client = getServerSupabaseClient();
  const extension = fileName.split(".").pop() ?? "mp4";
  const path = `products/videos/${randomUUID()}.${extension}`;

  const { data, error } = await client.storage.from(STORAGE_BUCKET).createSignedUploadUrl(path);
  if (error) return { status: "error", message: `Could not prepare upload: ${error.message}` };

  const { data: publicUrlData } = client.storage.from(STORAGE_BUCKET).getPublicUrl(data.path);
  return { status: "success", path: data.path, token: data.token, publicUrl: publicUrlData.publicUrl };
}
