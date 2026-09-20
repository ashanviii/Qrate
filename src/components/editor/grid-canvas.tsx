"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Block, GridSpan, Theme } from "@/lib/types";
import { useEditorStore } from "@/lib/store/editor-store";
import { BlockShell } from "@/components/canvas/block-shell";
import { BlockContent } from "@/components/blocks/block-content";
import { BlockToolbar } from "@/components/editor/block-toolbar";
import { cn } from "@/lib/utils";

const MAX_ROWS = 8;

export function GridCanvas({ blocks, theme }: { blocks: Block[]; theme: Theme }) {
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const selectBlock = useEditorStore((s) => s.selectBlock);
  const reorderBlocks = useEditorStore((s) => s.reorderBlocks);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderBlocks(String(active.id), String(over.id));
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={blocks.map((b) => b.id)} strategy={rectSortingStrategy}>
        <div className="bento-grid" style={{ gap: theme.spacing, ["--cols" as string]: theme.columns }}>
          <AnimatePresence initial={false}>
            {blocks.map((block) => (
              <SortableBlock
                key={block.id}
                block={block}
                theme={theme}
                selected={selectedBlockId === block.id}
                onSelect={() => selectBlock(block.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableBlock({
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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const updateBlockGrid = useEditorStore((s) => s.updateBlockGrid);
  const elRef = useRef<HTMLDivElement | null>(null);
  // Raw, unsnapped pixel size for a fluid ghost preview while dragging.
  const [dragPx, setDragPx] = useState<{ w: number; h: number } | null>(null);
  // Column/row-snapped span, computed alongside dragPx — committed on release.
  const [snapped, setSnapped] = useState<GridSpan | null>(null);

  function startResize(axis: "w" | "h" | "both", e: React.PointerEvent) {
    e.stopPropagation();
    e.preventDefault();
    const el = elRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const colPx = rect.width / block.grid.w;
    const rowPx = rect.height / block.grid.h;
    const startX = e.clientX;
    const startY = e.clientY;
    const origin = block.grid;

    function raw(dx: number, dy: number) {
      const w = axis !== "h" ? Math.max(40, rect.width + dx) : rect.width;
      const h = axis !== "w" ? Math.max(40, rect.height + dy) : rect.height;
      return { w, h };
    }
    function snap(dx: number, dy: number): GridSpan {
      const w = axis !== "h" ? clamp(origin.w + Math.round(dx / colPx), 1, theme.columns) : origin.w;
      const h = axis !== "w" ? clamp(origin.h + Math.round(dy / rowPx), 1, MAX_ROWS) : origin.h;
      return { ...origin, w, h };
    }
    function onMove(ev: PointerEvent) {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      setDragPx(raw(dx, dy));
      setSnapped(snap(dx, dy));
    }
    function onUp(ev: PointerEvent) {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      updateBlockGrid(block.id, snap(dx, dy));
      setDragPx(null);
      setSnapped(null);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  return (
    <motion.div
      ref={(node: HTMLDivElement | null) => {
        setNodeRef(node);
        elRef.current = node;
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isDragging ? 0.4 : block.hidden ? 0.35 : 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ duration: 0.18 }}
      className="bento-grid-item group/block relative"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        ["--w" as string]: block.grid.w,
        ["--h" as string]: block.grid.h,
        zIndex: isDragging || dragPx ? 50 : undefined,
      }}
    >
      <BlockShell
        block={block}
        theme={theme}
        onClick={onSelect}
        data-selected={selected}
        className={cn(
          "h-full w-full cursor-pointer",
          block.type !== "stamp" &&
            "ring-2 ring-transparent ring-offset-2 ring-offset-background transition-shadow",
          selected && (block.type === "stamp" ? "drop-shadow-[0_0_0_2px_var(--bento-accent,#6366f1)]" : "ring-[var(--bento-accent,#6366f1)]")
        )}
      >
        <BlockContent block={block} interactive={false} />
      </BlockShell>
      <BlockToolbar blockId={block.id} hidden={block.hidden} dragHandleProps={{ ...attributes, ...listeners }} />
      <ResizeHandle axis="w" onPointerDown={(e) => startResize("w", e)} />
      <ResizeHandle axis="h" onPointerDown={(e) => startResize("h", e)} />
      <ResizeHandle axis="both" onPointerDown={(e) => startResize("both", e)} />

      {dragPx && (
        <div
          className="pointer-events-none absolute top-0 left-0 z-30 flex items-end justify-end rounded-[calc(var(--bento-radius,12px)+2px)] border-2 border-dashed p-1.5"
          style={{
            width: dragPx.w,
            height: dragPx.h,
            borderColor: "var(--bento-accent, #6366f1)",
            background: "color-mix(in oklab, var(--bento-accent, #6366f1) 10%, transparent)",
          }}
        >
          {snapped && (
            <span
              className="rounded-md px-1.5 py-0.5 text-[10px] font-medium text-white shadow"
              style={{ background: "var(--bento-accent, #6366f1)" }}
            >
              {snapped.w} × {snapped.h}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
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
        "absolute z-40 h-4 w-4 touch-none rounded-full border-2 border-background opacity-0 transition-opacity group-hover/block:opacity-100",
        positionClass
      )}
      style={{ background: "var(--bento-accent, #6366f1)" }}
    />
  );
}
