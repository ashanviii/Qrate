"use client";

import { useRef, useState } from "react";
import type { Block, Theme } from "@/lib/types";
import { useEditorStore } from "@/lib/store/editor-store";
import { BlockShell } from "@/components/canvas/block-shell";
import { BlockContent } from "@/components/blocks/block-content";
import { BlockToolbar } from "@/components/editor/block-toolbar";
import { freeformBounds, FREEFORM_BASE_WIDTH } from "@/lib/layout";
import { cn } from "@/lib/utils";

export function FreeformCanvas({ blocks, theme }: { blocks: Block[]; theme: Theme }) {
  const bounds = freeformBounds(blocks);
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const selectBlock = useEditorStore((s) => s.selectBlock);

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-dashed p-4" style={{ borderColor: "color-mix(in oklab, var(--bento-primary, #000) 15%, transparent)" }}>
      <div
        className="relative"
        style={{ width: Math.max(FREEFORM_BASE_WIDTH, bounds.width), height: bounds.height }}
        onClick={() => selectBlock(null)}
      >
        {blocks.map((block) => (
          <FreeformBlock
            key={block.id}
            block={block}
            theme={theme}
            selected={selectedBlockId === block.id}
            onSelect={() => selectBlock(block.id)}
          />
        ))}
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
  const elRef = useRef<HTMLDivElement>(null);
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

  function startResize(e: React.PointerEvent) {
    e.stopPropagation();
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const origin = { w: block.freeform.w, h: block.freeform.h };
    setLive({ ...block.freeform });

    function onMove(ev: PointerEvent) {
      const dw = ev.clientX - startX;
      const dh = ev.clientY - startY;
      setLive({ ...block.freeform, w: Math.max(80, origin.w + dw), h: Math.max(80, origin.h + dh) });
    }
    function onUp(ev: PointerEvent) {
      const dw = ev.clientX - startX;
      const dh = ev.clientY - startY;
      updateBlockFreeform(block.id, { w: Math.max(80, origin.w + dw), h: Math.max(80, origin.h + dh) });
      setLive(null);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  return (
    <div
      ref={elRef}
      className="group/block absolute"
      style={{
        left: current.x,
        top: current.y,
        width: current.w,
        height: current.h,
        transform: `rotate(${block.freeform.rotate}deg)`,
        opacity: block.hidden ? 0.35 : 1,
        zIndex: selected ? 30 : 1,
      }}
    >
      <BlockShell
        block={block}
        theme={theme}
        onPointerDown={startDrag}
        className={cn(
          "h-full w-full cursor-grab touch-none select-none ring-2 ring-transparent ring-offset-2 ring-offset-background active:cursor-grabbing",
          selected && "ring-[var(--bento-accent,#6366f1)]"
        )}
      >
        <BlockContent block={block} interactive={false} />
      </BlockShell>
      <BlockToolbar blockId={block.id} hidden={block.hidden} />
      <div
        onPointerDown={startResize}
        className="absolute -bottom-1.5 -right-1.5 z-20 h-4 w-4 cursor-nwse-resize touch-none rounded-full border-2 border-background opacity-0 transition-opacity group-hover/block:opacity-100"
        style={{ background: "var(--bento-accent, #6366f1)" }}
      />
    </div>
  );
}
