"use client";

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

  return (
    <div
      ref={setNodeRef}
      className="bento-grid-item group/block relative"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        ["--w" as string]: block.grid.w,
        ["--h" as string]: block.grid.h,
        opacity: isDragging ? 0.4 : block.hidden ? 0.35 : 1,
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
          block.type !== "stamp" &&
            "ring-2 ring-transparent ring-offset-2 ring-offset-background transition-shadow",
          selected && (block.type === "stamp" ? "drop-shadow-[0_0_0_2px_var(--bento-accent,#6366f1)]" : "ring-[var(--bento-accent,#6366f1)]")
        )}
      >
        <BlockContent block={block} interactive={false} />
      </BlockShell>
      <BlockToolbar blockId={block.id} hidden={block.hidden} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  );
}
