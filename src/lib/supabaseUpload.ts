// src/lib/supabaseUpload.ts
import { supabase } from "./supabase";

/**
 * Upload a file to the Supabase Storage bucket (cms-media)
 * Returns the public URL of the uploaded file.
 */
export async function uploadMedia(
  file: File,
  folder = "uploads" // ✅ use a logical subfolder inside cms-media
): Promise<string> {
  // unique path with timestamp to avoid collisions
  const filePath = `${folder}/${Date.now()}_${file.name}`;

  // ✅ use the correct bucket name: cms-media
  const { data, error } = await supabase.storage
    .from("cms-media")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("❌ Supabase upload failed:", error.message);
    throw new Error(error.message);
  }

  // get the public URL
  const { data: publicUrlData } = supabase.storage
    .from("cms-media")
    .getPublicUrl(filePath);

  if (!publicUrlData?.publicUrl) {
    throw new Error("Failed to retrieve public URL.");
  }

  console.log("✅ Uploaded file:", publicUrlData.publicUrl);
  return publicUrlData.publicUrl;
}
