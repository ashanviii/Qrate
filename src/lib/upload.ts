"use client";

import { nanoid } from "nanoid";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AuthUser } from "@/lib/auth";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const BUCKET = "portfolio-uploads";

async function uploadFile(file: File, user: AuthUser, accept: (type: string) => boolean, kindLabel: string): Promise<string> {
  if (file.size > MAX_BYTES) {
    throw new Error(`${kindLabel} is too large (max 8MB)`);
  }
  if (!accept(file.type)) {
    throw new Error(`Please choose a valid ${kindLabel.toLowerCase()}`);
  }

  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return fileToDataUrl(file);
  }

  const ext = file.name.split(".").pop() || "bin";
  const path = `${user.id}/${nanoid(10)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export function uploadImage(file: File, user: AuthUser): Promise<string> {
  return uploadFile(file, user, (t) => t.startsWith("image/"), "Image");
}

export function uploadResume(file: File, user: AuthUser): Promise<string> {
  return uploadFile(file, user, (t) => t === "application/pdf", "PDF");
}

export function uploadVideo(file: File, user: AuthUser): Promise<string> {
  return uploadFile(file, user, (t) => t.startsWith("video/"), "Video");
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}
