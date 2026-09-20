import type { Block } from "@/lib/types";

export const FREEFORM_BASE_WIDTH = 640;
export const FREEFORM_PADDING = 40;

export function freeformBounds(blocks: Block[]) {
  const visible = blocks.filter((b) => !b.hidden);
  if (visible.length === 0) return { width: FREEFORM_BASE_WIDTH, height: 480 };
  const maxX = Math.max(...visible.map((b) => b.freeform.x + b.freeform.w));
  const maxY = Math.max(...visible.map((b) => b.freeform.y + b.freeform.h));
  return {
    width: Math.max(FREEFORM_BASE_WIDTH, maxX + FREEFORM_PADDING),
    height: Math.max(360, maxY + FREEFORM_PADDING),
  };
}
