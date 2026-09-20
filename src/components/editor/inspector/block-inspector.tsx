"use client";

import { X, Square, RectangleHorizontal, RectangleVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEditorStore } from "@/lib/store/editor-store";
import type { Block } from "@/lib/types";
import { SIZE_PRESET_GROUPS } from "@/lib/blocks";
import {
  ProfileForm, TextForm, ImageForm, LinkForm, SocialForm, ProjectForm,
  VideoForm, GifForm, ResumeForm, SkillsForm, SpotifyForm, YoutubeForm, PetForm, StampForm,
} from "@/components/editor/inspector/block-forms";
import { cn } from "@/lib/utils";

const MAX_ROWS = 8;

export function BlockInspector({ block }: { block: Block }) {
  const selectBlock = useEditorStore((s) => s.selectBlock);
  const mode = useEditorStore((s) => s.portfolio?.mode);
  const columns = useEditorStore((s) => s.portfolio?.theme.columns) ?? 4;
  const updateBlockGrid = useEditorStore((s) => s.updateBlockGrid);
  const updateBlockFreeform = useEditorStore((s) => s.updateBlockFreeform);
  const updateBlockBg = useEditorStore((s) => s.updateBlockBg);

  return (
    <ScrollArea className="h-full">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <span className="text-sm font-medium capitalize">{block.type} block</span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => selectBlock(null)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-5 p-4">
        {mode === "grid" && (
          <div className="grid gap-3">
            <Label className="text-xs text-muted-foreground">Shape</Label>
            {SIZE_PRESET_GROUPS.map((group) => (
              <div key={group.shape} className="grid gap-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                  <ShapeIcon shape={group.shape} className="h-3.5 w-3.5" />
                  {group.label}
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {group.sizes.map((size) => {
                    const active = block.grid.w === size.w && block.grid.h === size.h;
                    return (
                      <button
                        key={`${size.w}x${size.h}`}
                        onClick={() => updateBlockGrid(block.id, { w: size.w, h: size.h })}
                        className={cn(
                          "flex items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-xs transition-colors",
                          active ? "border-foreground bg-muted font-medium" : "border-transparent bg-muted/40 hover:bg-muted"
                        )}
                      >
                        <ShapeIcon
                          shape={group.shape}
                          className={cn("h-3.5 w-3.5 shrink-0", group.shape === "square" && size.w === 2 && "h-4 w-4")}
                        />
                        {size.w} × {size.h}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <div className="grid gap-1">
                <Label className="text-[11px] text-muted-foreground">Columns</Label>
                <Input
                  type="number"
                  min={1}
                  max={columns}
                  value={block.grid.w}
                  onChange={(e) => {
                    const w = clamp(Number(e.target.value) || 1, 1, columns);
                    updateBlockGrid(block.id, { w });
                  }}
                  className="h-8"
                />
              </div>
              <div className="grid gap-1">
                <Label className="text-[11px] text-muted-foreground">Rows</Label>
                <Input
                  type="number"
                  min={1}
                  max={MAX_ROWS}
                  value={block.grid.h}
                  onChange={(e) => {
                    const h = clamp(Number(e.target.value) || 1, 1, MAX_ROWS);
                    updateBlockGrid(block.id, { h });
                  }}
                  className="h-8"
                />
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Pick a shape to start, then fine-tune with the numbers above or by dragging the block&apos;s edges.
            </p>
          </div>
        )}

        {mode === "freeform" && (
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1">
                <Label className="text-[11px] text-muted-foreground">Width (px)</Label>
                <Input
                  type="number"
                  min={40}
                  value={Math.round(block.freeform.w)}
                  onChange={(e) => updateBlockFreeform(block.id, { w: Math.max(40, Number(e.target.value) || 40) })}
                  className="h-8"
                />
              </div>
              <div className="grid gap-1">
                <Label className="text-[11px] text-muted-foreground">Height (px)</Label>
                <Input
                  type="number"
                  min={40}
                  value={Math.round(block.freeform.h)}
                  onChange={(e) => updateBlockFreeform(block.id, { h: Math.max(40, Number(e.target.value) || 40) })}
                  className="h-8"
                />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs text-muted-foreground">Rotate ({block.freeform.rotate}°)</Label>
              <Slider
                min={-20}
                max={20}
                step={1}
                value={[block.freeform.rotate]}
                onValueChange={([v]) => updateBlockFreeform(block.id, { rotate: v })}
              />
            </div>
          </div>
        )}

        {block.type !== "stamp" && (
          <div className="grid gap-1.5">
            <Label className="text-xs text-muted-foreground">Background</Label>
            <div className="flex flex-wrap gap-1.5">
              {["transparent", "#ffffff", "#111111", "#f4f4f5", "#fee2e2", "#dbeafe", "#dcfce7", "#fef9c3"].map((c) => (
                <button
                  key={c}
                  onClick={() => updateBlockBg(block.id, c === "transparent" ? undefined : c)}
                  className="h-6 w-6 rounded-full border shadow-sm"
                  style={{ background: c === "transparent" ? "repeating-conic-gradient(#ccc 0 25%, transparent 0 50%) 0 0/10px 10px" : c }}
                />
              ))}
            </div>
          </div>
        )}

        <BlockForm block={block} />
      </div>
    </ScrollArea>
  );
}

function BlockForm({ block }: { block: Block }) {
  switch (block.type) {
    case "profile": return <ProfileForm block={block} />;
    case "text": return <TextForm block={block} />;
    case "image": return <ImageForm block={block} />;
    case "link": return <LinkForm block={block} />;
    case "social": return <SocialForm block={block} />;
    case "project": return <ProjectForm block={block} />;
    case "video": return <VideoForm block={block} />;
    case "gif": return <GifForm block={block} />;
    case "resume": return <ResumeForm block={block} />;
    case "skills": return <SkillsForm block={block} />;
    case "spotify": return <SpotifyForm block={block} />;
    case "youtube": return <YoutubeForm block={block} />;
    case "pet": return <PetForm block={block} />;
    case "stamp": return <StampForm block={block} />;
    default: return null;
  }
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function ShapeIcon({ shape, className }: { shape: "square" | "landscape" | "portrait"; className?: string }) {
  if (shape === "landscape") return <RectangleHorizontal className={className} />;
  if (shape === "portrait") return <RectangleVertical className={className} />;
  return <Square className={className} />;
}
