import type { CSSProperties } from "react";
import type { ShadowLevel, Theme } from "@/lib/types";
import { FONT_CSS_VAR } from "@/lib/fonts";

export const SHADOW_CSS: Record<ShadowLevel, string> = {
  none: "none",
  soft: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -8px rgba(0,0,0,0.10)",
  medium: "0 2px 6px rgba(0,0,0,0.08), 0 16px 32px -12px rgba(0,0,0,0.22)",
  hard: "6px 6px 0 0 rgba(0,0,0,0.9)",
};

export function themeBackgroundStyle(theme: Theme): CSSProperties {
  const bg = theme.background;
  const line = (opacity: number) => `color-mix(in oklab, ${theme.primary} ${opacity}%, transparent)`;
  switch (bg.type) {
    case "gradient":
      return { background: `linear-gradient(${bg.gradientAngle}deg, ${bg.gradientFrom}, ${bg.gradientTo})` };
    case "image":
      return bg.imageUrl
        ? { backgroundImage: `url(${bg.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
        : { background: bg.solid };
    case "dotted":
      return {
        backgroundColor: bg.solid,
        backgroundImage: `radial-gradient(${line(18)} 1.5px, transparent 1.5px)`,
        backgroundSize: "22px 22px",
      };
    case "grid":
      return {
        backgroundColor: bg.solid,
        backgroundImage: `linear-gradient(${line(10)} 1px, transparent 1px), linear-gradient(90deg, ${line(10)} 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
      };
    case "lines":
      return {
        backgroundColor: bg.solid,
        backgroundImage: `repeating-linear-gradient(135deg, ${line(8)} 0px, ${line(8)} 1px, transparent 1px, transparent 14px)`,
      };
    case "vignette":
      return {
        backgroundColor: bg.solid,
        backgroundImage: `radial-gradient(60% 50% at 50% 0%, color-mix(in oklab, ${theme.accent} 16%, transparent), transparent 70%)`,
      };
    case "noise":
    case "solid":
    default:
      return { background: bg.solid };
  }
}

export function themeRootStyle(theme: Theme): CSSProperties {
  const bg = theme.background;
  // Block cards default to a subtle tint relative to the page background,
  // not a fixed white — otherwise light text on a dark theme (Developer,
  // Glass) would render on a near-white card and disappear.
  const cardBg =
    theme.mode === "dark"
      ? "color-mix(in oklab, white 9%, transparent)"
      : "color-mix(in oklab, black 4%, white)";
  return {
    ...themeBackgroundStyle(theme),
    color: theme.primary,
    fontFamily: FONT_CSS_VAR[theme.fontBody],
    ["--bento-primary" as string]: theme.primary,
    ["--bento-accent" as string]: theme.accent,
    ["--bento-radius" as string]: `${theme.radius}px`,
    ["--bento-border" as string]: `${theme.borderWidth}px`,
    ["--bento-shadow" as string]: SHADOW_CSS[theme.shadow],
    ["--bento-spacing" as string]: `${theme.spacing}px`,
    ["--bento-font-heading" as string]: FONT_CSS_VAR[theme.fontHeading],
    ["--bento-font-body" as string]: FONT_CSS_VAR[theme.fontBody],
    ["--bento-card-bg" as string]: cardBg,
    ["--noise-opacity" as string]: bg.type === "noise" ? bg.noiseOpacity : 0,
  } as CSSProperties;
}
