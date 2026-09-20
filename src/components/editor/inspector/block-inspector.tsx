"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEditorStore } from "@/lib/store/editor-store";
import type { Block } from "@/lib/types";
import {
  ProfileForm, TextForm, ImageForm, LinkForm, SocialForm, ProjectForm,
  VideoForm, GifForm, ResumeForm, SkillsForm, SpotifyForm, YoutubeForm, PetForm, StampForm,
} from "@/components/editor/inspector/block-forms";

export function BlockInspector({ block }: { block: Block }) {
  const selectBlock = useEditorStore((s) => s.selectBlock);
  const mode = useEditorStore((s) => s.portfolio?.mode);
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
          <p className="text-xs text-muted-foreground">
            Drag the handles on the right, bottom, or bottom-right corner of the block to resize it.
          </p>
        )}

        {mode === "freeform" && (
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
