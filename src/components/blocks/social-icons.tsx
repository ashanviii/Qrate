import { Globe, Mail } from "lucide-react";
import type { SocialPlatform } from "@/lib/types";

// lucide-react no longer ships brand/logo glyphs, so every platform mark
// here is a small inline SVG (Globe/Mail are the two genuinely generic ones).
function XMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function InstagramMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function GithubMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 1.75a10.25 10.25 0 0 0-3.24 19.98c.51.1.7-.22.7-.5v-1.86c-2.86.62-3.46-1.23-3.46-1.23-.47-1.2-1.14-1.51-1.14-1.51-.93-.64.07-.63.07-.63 1.03.07 1.57 1.06 1.57 1.06.91 1.57 2.4 1.11 2.98.85.09-.67.36-1.11.65-1.37-2.28-.26-4.68-1.14-4.68-5.08 0-1.12.4-2.04 1.05-2.76-.1-.26-.46-1.31.1-2.72 0 0 .86-.28 2.82 1.05a9.75 9.75 0 0 1 5.14 0c1.96-1.33 2.82-1.05 2.82-1.05.56 1.41.2 2.46.1 2.72.66.72 1.05 1.64 1.05 2.76 0 3.95-2.4 4.82-4.7 5.07.37.32.7.95.7 1.92v2.84c0 .28.19.61.71.5A10.25 10.25 0 0 0 12 1.75z" />
    </svg>
  );
}
function LinkedinMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11H3zM10 9.75h3.8v1.5h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76v6.44H18.5v-5.71c0-1.36-.02-3.11-1.9-3.11-1.9 0-2.2 1.48-2.2 3.01v5.81H10.4z" />
    </svg>
  );
}
function YoutubeMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 8.2s-.2-1.6-.83-2.3c-.8-.86-1.68-.87-2.1-.92C16.05 4.75 12 4.75 12 4.75h-.01s-4.05 0-7.07.23c-.42.05-1.3.06-2.1.92C2.2 6.6 2 8.2 2 8.2S1.8 10.06 1.8 11.93v1.62c0 1.87.2 3.73.2 3.73s.2 1.6.83 2.3c.8.87 1.85.84 2.32.94 1.68.16 7.1.22 7.1.22s4.05-.01 7.07-.23c.42-.06 1.3-.07 2.1-.93.63-.7.83-2.3.83-2.3s.2-1.86.2-3.73v-1.62c0-1.87-.2-3.73-.2-3.73zM9.9 15.1V8.9l6 3.1z" />
    </svg>
  );
}
function TikTokMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.6 5.82a4.28 4.28 0 0 1-2.63-3.29h-3.1v13.9a2.6 2.6 0 1 1-1.85-2.49V10.8a5.75 5.75 0 1 0 4.95 5.7V9.4a7.6 7.6 0 0 0 4.13 1.2V7.45a4.27 4.27 0 0 1-1.5-1.63z" />
    </svg>
  );
}
function DribbbleMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.6 4.7a8.3 8.3 0 0 1 1.87 5.16c-.27-.06-3-.61-5.71-.26-.06-.14-.11-.29-.17-.44-.17-.4-.35-.79-.54-1.17 3.03-1.24 4.4-3 4.55-3.29zM12 3.8c1.94 0 3.72.68 5.12 1.81-.13.19-1.37 1.87-4.29 3-1.34-2.47-2.83-4.5-3.06-4.8.71-.14 1.44-.21 2.23-.21zm-3.9.87c.22.29 1.68 2.32 3.04 4.72-3.84 1.02-7.22 1-7.6.99a8.44 8.44 0 0 1 4.56-5.71zM3.8 12v-.27c.36.01 4.32.06 8.41-1.16.24.45.46.91.67 1.37-.11.03-.22.07-.32.1-4.24 1.37-6.49 5.11-6.68 5.43A8.36 8.36 0 0 1 3.8 12zm8.2 8.2c-1.87 0-3.6-.63-4.98-1.68.15-.31 1.85-3.6 6.5-5.21l.06-.02c1.15 3.13 1.62 5.76 1.74 6.5a8.3 8.3 0 0 1-3.32.41zm4.97-1.15c-.08-.49-.51-2.95-1.58-6.03 2.53-.4 4.74.26 5.01.35a8.38 8.38 0 0 1-3.43 5.68z" />
    </svg>
  );
}
function BehanceMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4 6h5.3c2.6 0 4.2 1.1 4.2 3.2 0 1.4-.7 2.2-1.9 2.7 1.6.5 2.6 1.5 2.6 3.3 0 2.4-2 3.6-4.7 3.6H4zm5 4.9c1.2 0 1.9-.5 1.9-1.5s-.7-1.4-1.9-1.4H6.6v2.9zm.3 5c1.4 0 2.2-.5 2.2-1.7 0-1.1-.8-1.6-2.2-1.6H6.6v3.3zM15 8h5v1.3h-5zm2.5 2.6c2.5 0 4.2 1.6 4.2 4.4v.6h-6.8c.1 1.4 1 2.3 2.5 2.3 1 0 1.7-.4 2.1-1.1l1.7.9c-.8 1.3-2.1 2-3.9 2-2.7 0-4.6-1.9-4.6-4.5s1.8-4.6 4.8-4.6zm-2.1 3.6h4.3c-.1-1.2-.9-1.9-2.1-1.9-1.1 0-1.9.7-2.2 1.9z" />
    </svg>
  );
}
function ThreadsMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.6 10.9c-.1-3.5-1.8-5.5-4.7-5.5-1.7 0-3.1.8-4 2.2l1.6 1.1c.5-.8 1.2-1.4 2.3-1.4 1.4 0 2.3.9 2.5 2.6-.6-.1-1.2-.2-1.9-.2-2.6 0-4.7 1.2-4.7 3.5 0 2 1.7 3.3 3.9 3.3 1.7 0 2.9-.7 3.6-1.9.5.7.8 1.6.8 2.7h1.9c0-1.6-.5-2.9-1.3-3.9.5-.9.8-2 .8-3.5h-1.8zm-4.9 4.6c-1 0-1.9-.5-1.9-1.4 0-1 1.2-1.6 2.7-1.6.6 0 1.2.1 1.7.2-.2 1.7-1.1 2.8-2.5 2.8z" />
    </svg>
  );
}

export const SOCIAL_ICONS: Record<SocialPlatform, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  x: XMark,
  instagram: InstagramMark,
  github: GithubMark,
  linkedin: LinkedinMark,
  tiktok: TikTokMark,
  youtube: YoutubeMark,
  dribbble: DribbbleMark,
  behance: BehanceMark,
  website: Globe,
  email: Mail,
  threads: ThreadsMark,
};

export const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  x: "X",
  instagram: "Instagram",
  github: "GitHub",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  youtube: "YouTube",
  dribbble: "Dribbble",
  behance: "Behance",
  website: "Website",
  email: "Email",
  threads: "Threads",
};

export function SocialIcon({ platform, className }: { platform: SocialPlatform; className?: string }) {
  const Icon = SOCIAL_ICONS[platform] ?? Globe;
  return <Icon className={className} />;
}
