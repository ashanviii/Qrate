import type { Block } from "@/lib/types";
import {
  ProfileBlockView,
  TextBlockView,
  ImageBlockView,
  LinkBlockView,
  SocialBlockView,
  ProjectBlockView,
  VideoBlockView,
  GifBlockView,
  ResumeBlockView,
  SkillsBlockView,
  SpotifyBlockView,
  YoutubeBlockView,
  PetBlockView,
  StampBlockView,
} from "@/components/blocks/views";

// Renders a block's inner content. `interactive` controls whether link-like
// blocks become real anchors (public page) or stay inert (editor canvas,
// where a click selects the block instead of navigating away).
export function BlockContent({ block, interactive }: { block: Block; interactive: boolean }) {
  switch (block.type) {
    case "profile":
      return <ProfileBlockView data={block.data} />;
    case "text":
      return <TextBlockView data={block.data} />;
    case "image":
      return <ImageBlockView data={block.data} />;
    case "link":
      return wrapLink(<LinkBlockView data={block.data} />, block.data.url, interactive);
    case "social":
      return wrapLink(<SocialBlockView data={block.data} />, block.data.url, interactive);
    case "project":
      return wrapLink(<ProjectBlockView data={block.data} />, block.data.url, interactive);
    case "video":
      return <VideoBlockView data={block.data} />;
    case "gif":
      return <GifBlockView data={block.data} />;
    case "resume":
      return wrapLink(<ResumeBlockView data={block.data} />, block.data.url, interactive, true);
    case "skills":
      return <SkillsBlockView data={block.data} />;
    case "spotify":
      return <SpotifyBlockView data={block.data} />;
    case "youtube":
      return <YoutubeBlockView data={block.data} />;
    case "pet":
      return <PetBlockView data={block.data} />;
    case "stamp":
      return <StampBlockView data={block.data} />;
    default:
      return null;
  }
}

function wrapLink(node: React.ReactNode, url: string | undefined, interactive: boolean, download = false) {
  if (!interactive || !url) return node;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      download={download || undefined}
      className="block h-full w-full transition-transform duration-200 hover:scale-[1.015] active:scale-[0.985]"
    >
      {node}
    </a>
  );
}
