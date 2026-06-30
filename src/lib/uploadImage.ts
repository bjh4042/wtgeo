import { supabase } from "@/integrations/supabase/client";
import { adminApi } from "@/lib/adminApi";

/**
 * Upload an image file via the admin-action edge function (service-role) and
 * return its permanent public URL. Public clients no longer have direct write
 * access to the storage bucket; admin authentication is required.
 */
export async function uploadImageToStorage(
  file: File,
  folder: string = "misc",
): Promise<string> {
  if (!file) throw new Error("파일이 없습니다.");
  return adminApi.uploadImage(folder, file);
}

// Kept for compatibility in case any caller imports the supabase client through here.
export { supabase };
