import { nanoid } from "nanoid";
import type {
  Block,
  BlockDataMap,
  BlockType,
  GridSpan,
} from "@/lib/types";

export const BLOCK_LIBRARY: {
  type: BlockType;
  label: string;
  description: string;
  defaultGrid: GridSpan;
}[] = [
  { type: "profile", label: "Profile", description: "Your name, photo & tagline", defaultGrid: { x: 0, y: 0, w: 2, h: 2 } },
  { type: "text", label: "Text", description: "A note, bio, or heading", defaultGrid: { x: 0, y: 0, w: 2, h: 1 } },
  { type: "image", label: "Image", description: "Upload a photo or PNG", defaultGrid: { x: 0, y: 0, w: 1, h: 1 } },
  { type: "link", label: "Link", description: "Any URL with a label", defaultGrid: { x: 0, y: 0, w: 1, h: 1 } },
  { type: "social", label: "Social", description: "X, Instagram, GitHub…", defaultGrid: { x: 0, y: 0, w: 1, h: 1 } },
  { type: "project", label: "Project", description: "Showcase your work", defaultGrid: { x: 0, y: 0, w: 2, h: 2 } },
  { type: "video", label: "Video", description: "MP4 or embed link", defaultGrid: { x: 0, y: 0, w: 2, h: 2 } },
  { type: "gif", label: "GIF", description: "Animated GIF", defaultGrid: { x: 0, y: 0, w: 1, h: 1 } },
  { type: "resume", label: "Resume", description: "Downloadable PDF", defaultGrid: { x: 0, y: 0, w: 1, h: 1 } },
  { type: "skills", label: "Skills", description: "A tag list of skills", defaultGrid: { x: 0, y: 0, w: 2, h: 1 } },
  { type: "spotify", label: "Spotify", description: "Embed a track or playlist", defaultGrid: { x: 0, y: 0, w: 2, h: 1 } },
  { type: "youtube", label: "YouTube", description: "Embed a video", defaultGrid: { x: 0, y: 0, w: 2, h: 2 } },
  { type: "pet", label: "Pet", description: "A little animated companion", defaultGrid: { x: 0, y: 0, w: 1, h: 1 } },
  { type: "stamp", label: "Stamp", description: "A cute postage-stamp sticker", defaultGrid: { x: 0, y: 0, w: 1, h: 1 } },
];

export function defaultDataFor<T extends BlockType>(type: T): BlockDataMap[T] {
  const map: BlockDataMap = {
    profile: { name: "Your Name", tagline: "What you do, in a few words", avatarUrl: "", location: "" },
    text: { content: "Say something about yourself…", align: "left", size: "md" },
    image: { url: "", alt: "", fit: "cover", caption: "" },
    link: { url: "https://", label: "My link", description: "" },
    social: { platform: "x", url: "https://" },
    project: { title: "Project name", description: "A short description of what it is and why it matters.", url: "", imageUrl: "", tags: [] },
    video: { url: "", loop: true, muted: true },
    gif: { url: "", alt: "" },
    resume: { url: "", label: "Resume" },
    skills: { title: "Skills", items: ["Design", "Product", "Code"] },
    spotify: { url: "" },
    youtube: { url: "" },
    pet: { species: "cat", name: "Milo" },
    stamp: { imageUrl: "", caption: "BENTO" },
  };
  return map[type];
}

export function createBlock(type: BlockType, overrides?: Partial<GridSpan>): Block {
  const spec = BLOCK_LIBRARY.find((b) => b.type === type)!;
  const grid = { ...spec.defaultGrid, ...overrides };
  const base = {
    id: nanoid(10),
    grid,
    // Stamps read as playful little stickers, so give them a natural tilt.
    freeform: { x: 40, y: 40, w: grid.w * 140, h: grid.h * 140, rotate: type === "stamp" ? Math.round(Math.random() * 12 - 6) : 0 },
    hidden: false,
  };
  return { ...base, type, data: defaultDataFor(type) } as Block;
}

export const SIZE_PRESETS: { label: string; w: number; h: number }[] = [
  { label: "S", w: 1, h: 1 },
  { label: "Wide", w: 2, h: 1 },
  { label: "Tall", w: 1, h: 2 },
  { label: "Large", w: 2, h: 2 },
  { label: "Banner", w: 3, h: 1 },
  { label: "XL", w: 3, h: 2 },
];
