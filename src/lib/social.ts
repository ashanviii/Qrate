import type { SocialPlatform } from "@/lib/types";

// Pull the @handle out of a profile URL, per platform. Handles trailing
// slashes, query strings, and the odd "@" some people paste in by hand.
export function extractSocialHandle(platform: SocialPlatform, url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const segments = u.pathname.split("/").filter(Boolean);
    if (segments.length === 0) return null;
    let handle = segments[0];
    if (platform === "youtube" && (handle === "c" || handle === "channel" || handle === "user") && segments[1]) {
      handle = segments[1];
    }
    handle = handle.replace(/^@/, "");
    return handle || null;
  } catch {
    // Not a full URL — maybe they just typed "@handle" or "handle" directly.
    const trimmed = url.trim().replace(/^@/, "");
    return trimmed || null;
  }
}

// Providers unavatar.io (a free, no-auth avatar lookup service) knows how to
// resolve a profile picture for. Platforms without a reliable public avatar
// source (email, generic website) are left out — those keep the plain icon.
const UNAVATAR_PROVIDER: Partial<Record<SocialPlatform, string>> = {
  x: "twitter",
  instagram: "instagram",
  github: "github",
  linkedin: "linkedin",
  tiktok: "tiktok",
  youtube: "youtube",
  dribbble: "dribbble",
  behance: "behance",
  threads: "instagram", // Threads profile photos mirror the linked Instagram account
};

export function getSocialAvatarUrl(platform: SocialPlatform, url: string): string | null {
  const provider = UNAVATAR_PROVIDER[platform];
  if (!provider) return null;
  const handle = extractSocialHandle(platform, url);
  if (!handle) return null;
  return `https://unavatar.io/${provider}/${encodeURIComponent(handle)}?fallback=false`;
}
