const SPOTIFY_TYPES = ["track", "playlist", "album", "episode", "show", "artist"];

export function toSpotifyEmbedUrl(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (!u.hostname.includes("spotify.com")) return null;
    const parts = u.pathname.split("/").filter(Boolean);
    // Share links can look like /track/ID or, with a locale prefix,
    // /intl-en/track/ID — find the known type segment instead of assuming
    // it's always first.
    const typeIndex = parts.findIndex((p) => SPOTIFY_TYPES.includes(p));
    const type = typeIndex === -1 ? undefined : parts[typeIndex];
    const id = typeIndex === -1 ? undefined : parts[typeIndex + 1];
    if (!type || !id) return null;
    return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
  } catch {
    return null;
  }
}

export function toYoutubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    let id: string | null = null;
    if (u.hostname.includes("youtu.be")) {
      id = u.pathname.slice(1);
    } else if (u.hostname.includes("youtube.com")) {
      if (u.pathname === "/watch") id = u.searchParams.get("v");
      else if (u.pathname.startsWith("/embed/")) id = u.pathname.split("/")[2];
      else if (u.pathname.startsWith("/shorts/")) id = u.pathname.split("/")[2];
    }
    if (!id) return null;
    return `https://www.youtube.com/embed/${id}`;
  } catch {
    return null;
  }
}

export function getYoutubeThumbnail(url: string): string | null {
  const embed = toYoutubeEmbedUrl(url);
  if (!embed) return null;
  const id = embed.split("/embed/")[1];
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}
