"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Block, Theme } from "@/lib/types";
import { useEditorStore } from "@/lib/store/editor-store";
import { BlockShell } from "@/components/canvas/block-shell";
import { BlockContent } from "@/components/blocks/block-content";
import { BlockToolbar } from "@/components/editor/block-toolbar";
import { freeformBounds, FREEFORM_BASE_WIDTH } from "@/lib/layout";
import { cn } from "@/lib/utils";

const MIN_SIZE = 60;
const SETTLE_TRANSITION = "left 0.2s cubic-bezier(0.22,1,0.36,1), top 0.2s cubic-bezier(0.22,1,0.36,1), width 0.2s cubic-bezier(0.22,1,0.36,1), height 0.2s cubic-bezier(0.22,1,0.36,1)";

export function FreeformCanvas({ blocks, theme }: { blocks: Block[]; theme: Theme }) {
  const bounds = freeformBounds(blocks);
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const selectBlock = useEditorStore((s) => s.selectBlock);

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-dashed p-4" style={{ borderColor: "color-mix(in oklab, var(--bento-primary, #000) 15%, transparent)" }}>
      <div
        className="relative"
        style={{ width: Math.max(FREEFORM_BASE_WIDTH, bounds.width), height: bounds.height, transition: "height 0.2s ease-out" }}
        onClick={() => selectBlock(null)}
      >
        <AnimatePresence>
          {blocks.map((block) => (
            <FreeformBlock
              key={block.id}
              block={block}
              theme={theme}
              selected={selectedBlockId === block.id}
              onSelect={() => selectBlock(block.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function FreeformBlock({
  block,
  theme,
  selected,
  onSelect,
}: {
  block: Block;
  theme: Theme;
  selected: boolean;
  onSelect: () => void;
}) {
  const updateBlockFreeform = useEditorStore((s) => s.updateBlockFreeform);
  const [live, setLive] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  const current = live ?? block.freeform;

  function startDrag(e: React.PointerEvent) {
    e.stopPropagation();
    onSelect();
    const startX = e.clientX;
    const startY = e.clientY;
    const origin = { x: block.freeform.x, y: block.freeform.y };
    setLive({ ...block.freeform });

    function onMove(ev: PointerEvent) {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      setLive({ ...block.freeform, x: Math.max(0, origin.x + dx), y: Math.max(0, origin.y + dy) });
    }
    function onUp(ev: PointerEvent) {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      updateBlockFreeform(block.id, { x: Math.max(0, origin.x + dx), y: Math.max(0, origin.y + dy) });
      setLive(null);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  function startResize(axis: "w" | "h" | "both") {
    return (e: React.PointerEvent) => {
      e.stopPropagation();
      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      const origin = { w: block.freeform.w, h: block.freeform.h };
      setLive({ ...block.freeform });

      function next(dw: number, dh: number) {
        return {
          ...block.freeform,
          w: axis !== "h" ? Math.max(MIN_SIZE, origin.w + dw) : block.freeform.w,
          h: axis !== "w" ? Math.max(MIN_SIZE, origin.h + dh) : block.freeform.h,
        };
      }
      function onMove(ev: PointerEvent) {
        setLive(next(ev.clientX - startX, ev.clientY - startY));
      }
      function onUp(ev: PointerEvent) {
        updateBlockFreeform(block.id, next(ev.clientX - startX, ev.clientY - startY));
        setLive(null);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      }
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    };
  }

  return (
    <motion.div
      className="group/block absolute"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: block.hidden ? 0.35 : 1, scale: 1, rotate: block.freeform.rotate }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
      transition={{ duration: 0.18 }}
      style={{
        left: current.x,
        top: current.y,
        width: current.w,
        height: current.h,
        zIndex: selected ? 30 : 1,
        transition: live ? undefined : SETTLE_TRANSITION,
      }}
    >
      <BlockShell
        block={block}
        theme={theme}
        onPointerDown={startDrag}
        className={cn(
          "h-full w-full cursor-grab touch-none select-none active:cursor-grabbing",
          block.type !== "stamp" && "ring-2 ring-transparent ring-offset-2 ring-offset-background",
          selected && (block.type === "stamp" ? "drop-shadow-[0_0_0_2px_var(--bento-accent,#6366f1)]" : "ring-[var(--bento-accent,#6366f1)]")
        )}
      >
        <BlockContent block={block} interactive={false} />
      </BlockShell>
      <BlockToolbar blockId={block.id} hidden={block.hidden} />
      <ResizeHandle axis="w" onPointerDown={startResize("w")} />
      <ResizeHandle axis="h" onPointerDown={startResize("h")} />
      <ResizeHandle axis="both" onPointerDown={startResize("both")} />
    </motion.div>
  );
}

function ResizeHandle({ axis, onPointerDown }: { axis: "w" | "h" | "both"; onPointerDown: (e: React.PointerEvent) => void }) {
  const positionClass =
    axis === "w"
      ? "-right-1.5 top-1/2 -translate-y-1/2 cursor-ew-resize"
      : axis === "h"
      ? "-bottom-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize"
      : "-bottom-1.5 -right-1.5 cursor-nwse-resize";
  return (
    <div
      onPointerDown={onPointerDown}
      className={cn(
        "absolute z-20 h-4 w-4 touch-none rounded-full border-2 border-background opacity-0 transition-opacity group-hover/block:opacity-100",
        positionClass
      )}
      style={{ background: "var(--bento-accent, #6366f1)" }}
    />
  );
}
