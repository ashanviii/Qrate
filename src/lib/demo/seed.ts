import type { Portfolio } from "@/lib/types";
import { PRESETS } from "@/lib/presets";

// Bundled example profile. Used as (a) the public /demo page in local-demo
// mode, and (b) the starting point for a brand-new account's editor.
export const DEMO_PORTFOLIO: Portfolio = {
  username: "demo",
  displayName: "Ashan Vi",
  bio: "Product designer & full-stack tinkerer. Building playful things on the internet.",
  avatarUrl: "",
  theme: PRESETS.glass.theme,
  mode: "grid",
  published: true,
  branding: true,
  updatedAt: new Date().toISOString(),
  blocks: [
    {
      id: "b-profile",
      type: "profile",
      grid: { x: 0, y: 0, w: 2, h: 2 },
      freeform: { x: 40, y: 40, w: 280, h: 280, rotate: 0 },
      data: { name: "Ashan Vi", tagline: "Design engineer, chronic side-project starter", avatarUrl: "", location: "Colombo, LK" },
    },
    {
      id: "b-text",
      type: "text",
      grid: { x: 2, y: 0, w: 2, h: 1 },
      freeform: { x: 340, y: 40, w: 280, h: 140, rotate: -2 },
      data: { content: "I design & build products end to end — currently exploring generative design tools.", align: "left", size: "md" },
    },
    {
      id: "b-pet",
      type: "pet",
      grid: { x: 2, y: 1, w: 1, h: 1 },
      freeform: { x: 340, y: 200, w: 140, h: 140, rotate: 4 },
      data: { species: "blob", name: "Miso" },
    },
    {
      id: "b-skills",
      type: "skills",
      grid: { x: 3, y: 1, w: 1, h: 1 },
      freeform: { x: 500, y: 200, w: 140, h: 140, rotate: 0 },
      data: { title: "Skills", items: ["Figma", "React", "TypeScript", "Framer Motion"] },
    },
    {
      id: "b-project",
      type: "project",
      grid: { x: 0, y: 2, w: 2, h: 2 },
      freeform: { x: 40, y: 340, w: 280, h: 280, rotate: 0 },
      data: {
        title: "Nimbus — weather, reimagined",
        description: "A generative weather app that paints a living scene of the sky above you.",
        url: "https://example.com",
        imageUrl: "",
        tags: ["Product", "iOS", "Design"],
      },
    },
    {
      id: "b-link1",
      type: "link",
      grid: { x: 2, y: 2, w: 1, h: 1 },
      freeform: { x: 340, y: 340, w: 140, h: 140, rotate: -3 },
      data: { url: "https://example.com/writing", label: "Writing", description: "Essays on craft" },
    },
    {
      id: "b-social1",
      type: "social",
      grid: { x: 3, y: 2, w: 1, h: 1 },
      freeform: { x: 500, y: 340, w: 140, h: 140, rotate: 3 },
      data: { platform: "github", url: "https://github.com" },
    },
    {
      id: "b-social2",
      type: "social",
      grid: { x: 2, y: 3, w: 1, h: 1 },
      freeform: { x: 340, y: 500, w: 140, h: 140, rotate: -1 },
      data: { platform: "x", url: "https://x.com" },
    },
    {
      id: "b-social3",
      type: "social",
      grid: { x: 3, y: 3, w: 1, h: 1 },
      freeform: { x: 500, y: 500, w: 140, h: 140, rotate: 2 },
      data: { platform: "instagram", url: "https://instagram.com" },
    },
  ],
};

export function blankPortfolio(username: string, displayName: string): Portfolio {
  return {
    username,
    displayName,
    bio: "",
    avatarUrl: "",
    theme: PRESETS.minimal.theme,
    mode: "grid",
    published: false,
    branding: true,
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        id: "b-profile",
        type: "profile",
        grid: { x: 0, y: 0, w: 2, h: 2 },
        freeform: { x: 40, y: 40, w: 280, h: 280, rotate: 0 },
        data: { name: displayName, tagline: "What you do, in a few words", avatarUrl: "", location: "" },
      },
      {
        id: "b-social",
        type: "social",
        grid: { x: 2, y: 0, w: 1, h: 1 },
        freeform: { x: 340, y: 40, w: 140, h: 140, rotate: 0 },
        data: { platform: "website", url: "https://" },
      },
    ],
  };
}
