"use client";

import { useEditorStore } from "@/lib/store/editor-store";
import { themeRootStyle } from "@/lib/theme-css";
import { GridCanvas } from "@/components/editor/grid-canvas";
import { FreeformCanvas } from "@/components/editor/freeform-canvas";

export function EditorCanvas() {
  const portfolio = useEditorStore((s) => s.portfolio);
  if (!portfolio) return null;

  return (
    <div
      className={portfolio.theme.background.type === "noise" ? "noise-bg min-h-full rounded-3xl" : "min-h-full rounded-3xl"}
      style={{ ...themeRootStyle(portfolio.theme), padding: "2.5rem" }}
    >
      {portfolio.mode === "grid" ? (
        <GridCanvas blocks={portfolio.blocks} theme={portfolio.theme} />
      ) : (
        <FreeformCanvas blocks={portfolio.blocks} theme={portfolio.theme} />
      )}
    </div>
  );
}
