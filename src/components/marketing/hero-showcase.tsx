"use client";

import { motion } from "framer-motion";
import { PublicCanvas } from "@/components/canvas/public-canvas";
import { themeRootStyle } from "@/lib/theme-css";
import { DEMO_PORTFOLIO } from "@/lib/demo/seed";

export function HeroShowcase() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: -1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-lg overflow-hidden rounded-[2rem] border shadow-2xl"
      style={themeRootStyle(DEMO_PORTFOLIO.theme)}
    >
      <div className="p-5">
        <PublicCanvas portfolio={DEMO_PORTFOLIO} />
      </div>
    </motion.div>
  );
}
