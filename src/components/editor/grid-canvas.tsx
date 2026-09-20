"use client";

import { useRef, useState } from "react";
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
          {blocks.map((block) => (
            <SortableBlock
              key={block.id}
              block={block}
              theme={theme}
              selected={selectedBlockId === block.id}
              onSelect={() => selectBlock(block.id)}
            />
          ))}
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
  const [liveSpan, setLiveSpan] = useState<GridSpan | null>(null);

  const span = liveSpan ?? block.grid;

  function startResize(axis: "w" | "h" | "both") {
    return (e: React.PointerEvent) => {
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

      function next(dx: number, dy: number): GridSpan {
        const w = axis !== "h" ? clamp(origin.w + Math.round(dx / colPx), 1, theme.columns) : origin.w;
        const h = axis !== "w" ? clamp(origin.h + Math.round(dy / rowPx), 1, MAX_ROWS) : origin.h;
        return { ...origin, w, h };
      }
      function onMove(ev: PointerEvent) {
        setLiveSpan(next(ev.clientX - startX, ev.clientY - startY));
      }
      function onUp(ev: PointerEvent) {
        updateBlockGrid(block.id, next(ev.clientX - startX, ev.clientY - startY));
        setLiveSpan(null);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      }
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    };
  }

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        elRef.current = node;
      }}
      className="bento-grid-item group/block relative"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        ["--w" as string]: span.w,
        ["--h" as string]: span.h,
        opacity: isDragging ? 0.4 : block.hidden ? 0.35 : 1,
        zIndex: isDragging || liveSpan ? 50 : undefined,
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
      <ResizeHandle axis="w" onPointerDown={startResize("w")} />
      <ResizeHandle axis="h" onPointerDown={startResize("h")} />
      <ResizeHandle axis="both" onPointerDown={startResize("both")} />
    </div>
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
        "absolute z-20 h-4 w-4 touch-none rounded-full border-2 border-background opacity-0 transition-opacity group-hover/block:opacity-100",
        positionClass
      )}
      style={{ background: "var(--bento-accent, #6366f1)" }}
    />
  );
}
