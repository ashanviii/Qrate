"use client";

import { motion } from "framer-motion";
import type { PetSpecies } from "@/lib/types";

const PALETTES: Record<PetSpecies, { body: string; accent: string; cheek: string }> = {
  cat: { body: "#f4a261", accent: "#e76f51", cheek: "#ffd6d6" },
  dog: { body: "#d4a373", accent: "#8d5a2b", cheek: "#ffd6d6" },
  robot: { body: "#94a3b8", accent: "#38bdf8", cheek: "#bae6fd" },
  blob: { body: "#a78bfa", accent: "#7c3aed", cheek: "#f3e8ff" },
  bird: { body: "#fbbf24", accent: "#ea580c", cheek: "#ffe4d6" },
  bunny: { body: "#f8f8f8", accent: "#f472b6", cheek: "#ffd6ea" },
};

export function PetSprite({ species, className }: { species: PetSpecies; className?: string }) {
  const c = PALETTES[species];
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden>
        {species === "cat" && (
          <g>
            <path d="M28 34 18 14l16 10z" fill={c.body} />
            <path d="M72 34 82 14 66 24z" fill={c.body} />
            <circle cx="50" cy="55" r="30" fill={c.body} />
            <circle cx="38" cy="50" r="4" fill="#222" className="animate-blink" />
            <circle cx="62" cy="50" r="4" fill="#222" className="animate-blink" />
            <circle cx="30" cy="62" r="6" fill={c.cheek} opacity="0.8" />
            <circle cx="70" cy="62" r="6" fill={c.cheek} opacity="0.8" />
            <path d="M45 62q5 5 10 0" stroke="#222" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        )}
        {species === "dog" && (
          <g>
            <ellipse cx="24" cy="46" rx="10" ry="16" fill={c.accent} />
            <ellipse cx="76" cy="46" rx="10" ry="16" fill={c.accent} />
            <circle cx="50" cy="56" r="30" fill={c.body} />
            <circle cx="40" cy="52" r="4" fill="#222" className="animate-blink" />
            <circle cx="60" cy="52" r="4" fill="#222" className="animate-blink" />
            <ellipse cx="50" cy="64" rx="6" ry="4" fill="#222" />
            <path d="M40 72q10 8 20 0" stroke="#222" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        )}
        {species === "robot" && (
          <g>
            <rect x="22" y="30" width="56" height="48" rx="12" fill={c.body} />
            <rect x="46" y="14" width="8" height="14" rx="3" fill={c.accent} />
            <circle cx="50" cy="14" r="5" fill={c.accent} />
            <rect x="34" y="46" width="12" height="12" rx="3" fill={c.accent} className="animate-blink" />
            <rect x="54" y="46" width="12" height="12" rx="3" fill={c.accent} className="animate-blink" />
            <rect x="38" y="66" width="24" height="5" rx="2.5" fill="#1f2937" />
          </g>
        )}
        {species === "blob" && (
          <g>
            <path
              d="M50 16c20 0 32 16 32 34S72 84 50 84 18 68 18 50 30 16 50 16Z"
              fill={c.body}
            />
            <circle cx="40" cy="48" r="4.5" fill="#222" className="animate-blink" />
            <circle cx="62" cy="48" r="4.5" fill="#222" className="animate-blink" />
            <path d="M42 60q8 7 16 0" stroke="#222" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <circle cx="30" cy="58" r="5" fill={c.cheek} opacity="0.7" />
            <circle cx="70" cy="58" r="5" fill={c.cheek} opacity="0.7" />
          </g>
        )}
        {species === "bird" && (
          <g>
            <circle cx="50" cy="52" r="26" fill={c.body} />
            <circle cx="50" cy="26" r="16" fill={c.body} />
            <path d="M50 26 62 32 50 36Z" fill={c.accent} />
            <circle cx="44" cy="24" r="3.5" fill="#222" className="animate-blink" />
            <path d="M30 70q20 14 40 0" stroke={c.accent} strokeWidth="4" fill="none" strokeLinecap="round" />
          </g>
        )}
        {species === "bunny" && (
          <g>
            <ellipse cx="38" cy="20" rx="7" ry="18" fill={c.body} stroke="#eee" />
            <ellipse cx="62" cy="20" rx="7" ry="18" fill={c.body} stroke="#eee" />
            <ellipse cx="38" cy="20" rx="3" ry="12" fill={c.accent} opacity="0.5" />
            <ellipse cx="62" cy="20" rx="3" ry="12" fill={c.accent} opacity="0.5" />
            <circle cx="50" cy="56" r="28" fill={c.body} stroke="#eee" />
            <circle cx="40" cy="52" r="4" fill="#222" className="animate-blink" />
            <circle cx="60" cy="52" r="4" fill="#222" className="animate-blink" />
            <circle cx="30" cy="62" r="5" fill={c.cheek} />
            <circle cx="70" cy="62" r="5" fill={c.cheek} />
            <ellipse cx="50" cy="64" rx="3" ry="2" fill={c.accent} />
          </g>
        )}
      </svg>
    </motion.div>
  );
}
