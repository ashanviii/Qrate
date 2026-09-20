"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuthUser } from "@/lib/auth";

export function FileField({
  label,
  value,
  onChange,
  user,
  upload,
  accept,
  previewImage = true,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  user: AuthUser | null;
  upload: (file: File, user: AuthUser) => Promise<string>;
  accept: string;
  previewImage?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file || !user) return;
    setLoading(true);
    try {
      const url = await upload(file, user);
      onChange(url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {value && previewImage && (
        <div className="relative overflow-hidden rounded-lg border">
          <img src={value} alt="" className="h-24 w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-1.5 top-1.5 rounded-full bg-background/90 p-1 shadow"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste a URL, or upload"
          className="text-xs"
        />
        <Button type="button" variant="outline" size="icon" disabled={loading} onClick={() => inputRef.current?.click()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        </Button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
