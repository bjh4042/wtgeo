import { supabase } from "@/integrations/supabase/client";

const BUCKET = "app-images";

/**
 * Upload an image file to Supabase Storage and return its permanent public URL.
 * Replaces the previous base64/DataURL approach so images persist across users and browsers.
 */
export async function uploadImageToStorage(
  file: File,
  folder: string = "misc"
): Promise<string> {
  if (!file) throw new Error("파일이 없습니다.");

  const ext = (file.name.split(".").pop() || "png").toLowerCase();
  const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "_");
  const path = `${safeFolder}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });

  if (error) {
    console.error("[uploadImageToStorage] upload failed", error);
    throw error;
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
