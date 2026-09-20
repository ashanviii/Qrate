import {
  ArrowUpRight,
  FileText,
  Download,
  Play,
} from "lucide-react";
import type {
  ProfileBlockData,
  TextBlockData,
  ImageBlockData,
  LinkBlockData,
  ProjectBlockData,
  VideoBlockData,
  GifBlockData,
  ResumeBlockData,
  SkillsBlockData,
  SpotifyBlockData,
  YoutubeBlockData,
  PetBlockData,
  StampBlockData,
} from "@/lib/types";
import { PetSprite } from "@/components/blocks/pet-sprite";
import { StampFrame } from "@/components/blocks/stamp-frame";
import { toSpotifyEmbedUrl, toYoutubeEmbedUrl } from "@/lib/embed";
import { cn } from "@/lib/utils";

const TEXT_SIZE: Record<TextBlockData["size"], string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
  xl: "text-3xl",
};
const TEXT_ALIGN: Record<TextBlockData["align"], string> = {
  left: "text-left items-start",
  center: "text-center items-center",
  right: "text-right items-end",
};

export function ProfileBlockView({ data }: { data: ProfileBlockData }) {
  return (
    <div className="flex h-full w-full flex-col justify-between p-4">
      <div className="flex items-center justify-center overflow-hidden rounded-full shrink-0"
        style={{ width: 56, height: 56, background: "var(--bento-accent, #6366f1)", color: "white" }}
      >
        {data.avatarUrl ? (
          <img src={data.avatarUrl} alt={data.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-xl font-semibold" style={{ fontFamily: "var(--bento-font-heading)" }}>
            {(data.name || "?").slice(0, 1).toUpperCase()}
          </span>
        )}
      </div>
      <div className="mt-3 min-w-0">
        <div className="truncate text-lg font-semibold" style={{ fontFamily: "var(--bento-font-heading)" }}>
          {data.name || "Your name"}
        </div>
        <div className="mt-0.5 text-sm opacity-70">{data.tagline}</div>
        {data.location && (
          <div className="mt-1.5 flex items-center gap-1 text-xs">
            <span className="shrink-0" aria-hidden>📍</span>
            <span className="opacity-60">{data.location}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function TextBlockView({ data }: { data: TextBlockData }) {
  return (
    <div className={cn("flex h-full w-full flex-col justify-center gap-1 p-4", TEXT_ALIGN[data.align])}>
      <p className={cn("whitespace-pre-wrap opacity-90", TEXT_SIZE[data.size])}>
        {data.content || "Say something about yourself…"}
      </p>
    </div>
  );
}

export function ImageBlockView({ data }: { data: ImageBlockData }) {
  if (!data.url) {
    return <EmptyMedia label="Image" />;
  }
  return (
    <div className="relative h-full w-full overflow-hidden">
      <img
        src={data.url}
        alt={data.alt || ""}
        className={cn("h-full w-full", data.fit === "contain" ? "object-contain" : "object-cover")}
      />
      {data.caption && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-xs text-white">
          {data.caption}
        </div>
      )}
    </div>
  );
}

export function LinkBlockView({ data }: { data: LinkBlockData }) {
  return (
    <div className="flex h-full w-full flex-col justify-between p-4">
      <ArrowUpRight className="h-4 w-4 opacity-50" />
      <div className="min-w-0">
        <div className="truncate font-medium">{data.label || "My link"}</div>
        {data.description && <div className="truncate text-xs opacity-60">{data.description}</div>}
      </div>
    </div>
  );
}

export function ProjectBlockView({ data }: { data: ProjectBlockData }) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      {data.imageUrl ? (
        <div className="relative h-1/2 w-full shrink-0 overflow-hidden">
          <img src={data.imageUrl} alt="" className="h-full w-full object-cover" />
        </div>
      ) : (
        <div
          className="h-1/2 w-full shrink-0"
          style={{ background: "color-mix(in oklab, var(--bento-accent, #6366f1) 30%, transparent)" }}
        />
      )}
      <div className="flex min-h-0 flex-1 flex-col justify-between p-4">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <div className="truncate font-semibold" style={{ fontFamily: "var(--bento-font-heading)" }}>
              {data.title || "Project name"}
            </div>
            {data.url && <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-50" />}
          </div>
          <p className="mt-1 line-clamp-2 text-xs opacity-70">{data.description}</p>
        </div>
        {data.tags?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {data.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{ background: "color-mix(in oklab, var(--bento-accent, #6366f1) 15%, transparent)" }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function VideoBlockView({ data }: { data: VideoBlockData }) {
  if (!data.url) return <EmptyMedia label="Video" icon={Play} />;
  return (
    <video
      src={data.url}
      className="h-full w-full object-cover"
      autoPlay={data.muted}
      muted={data.muted}
      loop={data.loop}
      controls={!data.muted}
      playsInline
    />
  );
}

export function GifBlockView({ data }: { data: GifBlockData }) {
  if (!data.url) return <EmptyMedia label="GIF" />;
  return <img src={data.url} alt={data.alt || ""} className="h-full w-full object-cover" />;
}

export function ResumeBlockView({ data }: { data: ResumeBlockData }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
      <FileText className="h-7 w-7 opacity-60" />
      <span className="text-sm font-medium">{data.label || "Resume"}</span>
      {data.url && (
        <span className="flex items-center gap-1 text-xs opacity-60">
          <Download className="h-3 w-3" /> Download
        </span>
      )}
    </div>
  );
}

export function SkillsBlockView({ data }: { data: SkillsBlockData }) {
  return (
    <div className="flex h-full w-full flex-col gap-2.5 p-4">
      {data.title && <div className="text-xs font-semibold uppercase tracking-wide opacity-50">{data.title}</div>}
      <div className="flex flex-wrap content-start gap-2">
        {data.items.map((skill) => (
          <span
            key={skill}
            className="rounded-full px-3 py-1.5 text-sm font-medium"
            style={{ background: "color-mix(in oklab, var(--bento-accent, #6366f1) 15%, transparent)" }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SpotifyBlockView({ data }: { data: SpotifyBlockData }) {
  const embed = toSpotifyEmbedUrl(data.url);
  if (!embed) return <EmptyMedia label="Spotify link" />;
  return (
    <iframe
      src={embed}
      className="h-full w-full"
      style={{ border: 0 }}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      title="Spotify embed"
    />
  );
}

export function YoutubeBlockView({ data }: { data: YoutubeBlockData }) {
  const embed = toYoutubeEmbedUrl(data.url);
  if (!embed) return <EmptyMedia label="YouTube link" icon={Play} />;
  return (
    <iframe
      src={embed}
      className="h-full w-full"
      style={{ border: 0 }}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      loading="lazy"
      title="YouTube embed"
    />
  );
}

export function PetBlockView({ data }: { data: PetBlockData }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-3">
      <div className="h-16 w-16">
        <PetSprite species={data.species} className="h-full w-full" />
      </div>
      {data.name && <span className="text-xs font-medium opacity-60">{data.name}</span>}
    </div>
  );
}

export function StampBlockView({ data }: { data: StampBlockData }) {
  return <StampFrame data={data} />;
}

function EmptyMedia({ label, icon: Icon = FileText }: { label: string; icon?: typeof FileText }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-xs opacity-40">
      <Icon className="h-5 w-5" />
      {label}
    </div>
  );
}
