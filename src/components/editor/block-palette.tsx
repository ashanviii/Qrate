"use client";

import {
  User, Type, Image as ImageIcon, Link2, Share2, Briefcase,
  Film, Sparkles as GifIcon, FileText, ListChecks, Music, PawPrint, Stamp,
} from "lucide-react";
import type { BlockType } from "@/lib/types";
import { BLOCK_LIBRARY } from "@/lib/blocks";
import { useEditorStore } from "@/lib/store/editor-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SOCIAL_ICONS } from "@/components/blocks/social-icons";

const ICONS: Record<BlockType, React.ComponentType<{ className?: string }>> = {
  profile: User,
  text: Type,
  image: ImageIcon,
  link: Link2,
  social: Share2,
  project: Briefcase,
  video: Film,
  gif: GifIcon,
  resume: FileText,
  skills: ListChecks,
  spotify: Music,
  youtube: SOCIAL_ICONS.youtube,
  pet: PawPrint,
  stamp: Stamp,
};

export function BlockPalette() {
  const addBlock = useEditorStore((s) => s.addBlock);

  return (
    <ScrollArea className="h-full">
      <div className="grid grid-cols-2 gap-2 p-3">
        {BLOCK_LIBRARY.map((item) => {
          const Icon = ICONS[item.type];
          return (
            <button
              key={item.type}
              onClick={() => addBlock(item.type)}
              className="group flex flex-col items-start gap-2 rounded-xl border border-transparent bg-muted/50 p-3 text-left transition-colors hover:border-border hover:bg-muted"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background shadow-sm">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-medium">{item.label}</div>
                <div className="mt-0.5 text-[10px] leading-tight text-muted-foreground">{item.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
}
