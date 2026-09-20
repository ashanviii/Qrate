// Core domain types for the Bento portfolio builder.
// Everything a portfolio needs to render lives in `Portfolio` below, which is
// stored as a single JSONB `data` column in Supabase (see supabase/migrations).

export type FontKey =
  | "inter"
  | "plusJakarta"
  | "spaceGrotesk"
  | "jetbrainsMono"
  | "fraunces"
  | "instrumentSerif"
  | "spaceMono"
  | "pressStart2p";

export type PresetId =
  | "minimal"
  | "developer"
  | "brutalist"
  | "y2k"
  | "editorial"
  | "glass"
  | "pixel";

export type BackgroundType = "solid" | "gradient" | "image" | "noise";

export interface BackgroundConfig {
  type: BackgroundType;
  solid: string;
  gradientFrom: string;
  gradientTo: string;
  gradientAngle: number;
  imageUrl: string;
  noiseColor: string;
  noiseOpacity: number;
}

export type ShadowLevel = "none" | "soft" | "medium" | "hard";

export interface Theme {
  preset: PresetId;
  mode: "light" | "dark" | "system";
  background: BackgroundConfig;
  fontHeading: FontKey;
  fontBody: FontKey;
  primary: string;
  accent: string;
  radius: number; // 0-32 px
  shadow: ShadowLevel;
  spacing: number; // gap between blocks, px
  borderWidth: number; // 0-4 px
  columns: number; // desktop grid columns, 3-6
}

export type GridSpan = { x: number; y: number; w: number; h: number };
export type FreeformSpan = {
  x: number;
  y: number;
  w: number;
  h: number;
  rotate: number;
};

export type BlockType =
  | "profile"
  | "text"
  | "image"
  | "link"
  | "social"
  | "project"
  | "video"
  | "gif"
  | "resume"
  | "skills"
  | "spotify"
  | "youtube"
  | "pet"
  | "stamp";

export interface BlockBase {
  id: string;
  type: BlockType;
  grid: GridSpan;
  freeform: FreeformSpan;
  bg?: string; // per-block background override (css color or "transparent")
  hidden?: boolean;
}

export interface ProfileBlockData {
  name: string;
  tagline: string;
  avatarUrl: string;
  location: string;
}
export interface TextBlockData {
  content: string;
  align: "left" | "center" | "right";
  size: "sm" | "md" | "lg" | "xl";
}
export interface ImageBlockData {
  url: string;
  alt: string;
  fit: "cover" | "contain";
  caption: string;
}
export interface LinkBlockData {
  url: string;
  label: string;
  description: string;
}
export type SocialPlatform =
  | "x"
  | "instagram"
  | "github"
  | "linkedin"
  | "tiktok"
  | "youtube"
  | "dribbble"
  | "behance"
  | "website"
  | "email"
  | "threads";
export interface SocialBlockData {
  platform: SocialPlatform;
  url: string;
}
export interface ProjectBlockData {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  tags: string[];
}
export interface VideoBlockData {
  url: string;
  loop: boolean;
  muted: boolean;
}
export interface GifBlockData {
  url: string;
  alt: string;
}
export interface ResumeBlockData {
  url: string;
  label: string;
}
export interface SkillsBlockData {
  title: string;
  items: string[];
}
export interface SpotifyBlockData {
  url: string;
}
export interface YoutubeBlockData {
  url: string;
}
export type PetSpecies = "cat" | "dog" | "robot" | "blob" | "bird" | "bunny";
export interface PetBlockData {
  species: PetSpecies;
  name: string;
}
export interface StampBlockData {
  imageUrl: string;
  caption: string;
}

export type BlockDataMap = {
  profile: ProfileBlockData;
  text: TextBlockData;
  image: ImageBlockData;
  link: LinkBlockData;
  social: SocialBlockData;
  project: ProjectBlockData;
  video: VideoBlockData;
  gif: GifBlockData;
  resume: ResumeBlockData;
  skills: SkillsBlockData;
  spotify: SpotifyBlockData;
  youtube: YoutubeBlockData;
  pet: PetBlockData;
  stamp: StampBlockData;
};

export type Block = {
  [K in BlockType]: BlockBase & { type: K; data: BlockDataMap[K] };
}[BlockType];

export type EditorMode = "grid" | "freeform";

export interface Portfolio {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  theme: Theme;
  blocks: Block[];
  mode: EditorMode;
  published: boolean;
  branding: boolean;
  updatedAt: string;
}

export interface ProfileRow {
  id: string;
  username: string;
  data: Portfolio;
  created_at: string;
  updated_at: string;
}
