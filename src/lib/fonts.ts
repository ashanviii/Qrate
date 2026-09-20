import {
  Inter,
  Plus_Jakarta_Sans,
  Space_Grotesk,
  JetBrains_Mono,
  Fraunces,
  Instrument_Serif,
  Space_Mono,
  Press_Start_2P,
} from "next/font/google";
import type { FontKey } from "@/lib/types";

export const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
export const plusJakarta = Plus_Jakarta_Sans({ variable: "--font-plus-jakarta", subsets: ["latin"], display: "swap" });
export const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], display: "swap" });
export const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"], display: "swap" });
export const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], display: "swap" });
export const instrumentSerif = Instrument_Serif({ variable: "--font-instrument-serif", subsets: ["latin"], weight: "400", display: "swap" });
export const spaceMono = Space_Mono({ variable: "--font-space-mono", subsets: ["latin"], weight: ["400", "700"], display: "swap" });
export const pressStart2p = Press_Start_2P({ variable: "--font-press-start-2p", subsets: ["latin"], weight: "400", display: "swap" });

export const FONT_VARIABLES = [
  inter.variable,
  plusJakarta.variable,
  spaceGrotesk.variable,
  jetbrainsMono.variable,
  fraunces.variable,
  instrumentSerif.variable,
  spaceMono.variable,
  pressStart2p.variable,
].join(" ");

export const FONT_CSS_VAR: Record<FontKey, string> = {
  inter: "var(--font-inter)",
  plusJakarta: "var(--font-plus-jakarta)",
  spaceGrotesk: "var(--font-space-grotesk)",
  jetbrainsMono: "var(--font-jetbrains-mono)",
  fraunces: "var(--font-fraunces)",
  instrumentSerif: "var(--font-instrument-serif)",
  spaceMono: "var(--font-space-mono)",
  pressStart2p: "var(--font-press-start-2p)",
};

export const FONT_LABELS: Record<FontKey, string> = {
  inter: "Inter",
  plusJakarta: "Plus Jakarta",
  spaceGrotesk: "Space Grotesk",
  jetbrainsMono: "JetBrains Mono",
  fraunces: "Fraunces",
  instrumentSerif: "Instrument Serif",
  spaceMono: "Space Mono",
  pressStart2p: "Press Start 2P",
};
