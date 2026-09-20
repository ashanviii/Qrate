"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/lib/store/editor-store";
import { PublicCanvas } from "@/components/canvas/public-canvas";
import { PublicPageFooter } from "@/components/public/public-page-footer";
import { themeRootStyle } from "@/lib/theme-css";

export function PreviewOverlay() {
  const previewMode = useEditorStore((s) => s.previewMode);
  const togglePreview = useEditorStore((s) => s.togglePreview);
  const portfolio = useEditorStore((s) => s.portfolio);

  return (
    <AnimatePresence>
      {previewMode && portfolio && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
          style={themeRootStyle(portfolio.theme)}
        >
          <div className={portfolio.theme.background.type === "noise" ? "noise-bg min-h-screen" : "min-h-screen"} style={themeRootStyle(portfolio.theme)}>
            <div className="mx-auto w-full max-w-4xl px-5 py-10 sm:py-16">
              <PublicCanvas portfolio={portfolio} />
              <PublicPageFooter portfolio={portfolio} />
            </div>
          </div>
          <Button
            onClick={togglePreview}
            size="icon"
            className="fixed right-5 top-5 rounded-full shadow-lg"
            variant="secondary"
          >
            <X className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
