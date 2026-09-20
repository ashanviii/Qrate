"use client";

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
import type { Block, Theme } from "@/lib/types";
import { useEditorStore } from "@/lib/store/editor-store";
import { BlockShell } from "@/components/canvas/block-shell";
import { BlockContent } from "@/components/blocks/block-content";
import { BlockToolbar } from "@/components/editor/block-toolbar";
import { cn } from "@/lib/utils";

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

  return (
    <motion.div
      ref={setNodeRef}
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
        zIndex: isDragging ? 50 : undefined,
      }}
    >
      <BlockShell
        block={block}
        theme={theme}
        onClick={onSelect}
        data-selected={selected}
        className={cn(
          "h-full w-full cursor-pointer",
          block.type === "stamp" && selected && "drop-shadow-[0_0_0_2px_var(--bento-accent,#6366f1)]"
        )}
      >
        <BlockContent block={block} interactive={false} />
      </BlockShell>
      {/* A separate overlay, not the card's own box-shadow: BlockShell already
          sets an inline box-shadow for the theme's card shadow, which would
          silently win the cascade over (and hide) a ring-* class on that same
          element. */}
      {block.type !== "stamp" && (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 ring-2 ring-offset-2 ring-offset-background ring-[var(--bento-accent,#6366f1)] transition-opacity duration-200",
            selected ? "opacity-100" : "opacity-0"
          )}
          style={{ borderRadius: `var(--bento-radius, ${theme.radius}px)` }}
        />
      )}
      <BlockToolbar blockId={block.id} hidden={block.hidden} dragHandleProps={{ ...attributes, ...listeners }} />
    </motion.div>
  );
}
