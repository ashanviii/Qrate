"use client";

import { useEditorStore } from "@/lib/store/editor-store";
import { BlockInspector } from "@/components/editor/inspector/block-inspector";
import { ThemePanel } from "@/components/editor/inspector/theme-panel";

export function Inspector() {
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const portfolio = useEditorStore((s) => s.portfolio);
  const selected = portfolio?.blocks.find((b) => b.id === selectedBlockId);

  if (selected) return <BlockInspector block={selected} />;
  return <ThemePanel />;
}
