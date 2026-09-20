"use client";

import { Copy, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useEditorStore } from "@/lib/store/editor-store";
import { cn } from "@/lib/utils";

export function BlockToolbar({
  blockId,
  hidden,
  dragHandleProps,
}: {
  blockId: string;
  hidden?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
}) {
  const duplicateBlock = useEditorStore((s) => s.duplicateBlock);
  const removeBlock = useEditorStore((s) => s.removeBlock);
  const toggleBlockHidden = useEditorStore((s) => s.toggleBlockHidden);

  return (
    <div className="absolute -top-3 right-2 z-20 flex items-center gap-0.5 rounded-lg border bg-popover p-0.5 opacity-0 shadow-md transition-opacity group-hover/block:opacity-100 group-focus-within/block:opacity-100 data-[selected=true]:opacity-100">
      {dragHandleProps && (
        <button
          type="button"
          className="cursor-grab rounded-md p-1.5 text-muted-foreground hover:bg-accent active:cursor-grabbing"
          {...dragHandleProps}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
      )}
      <ToolbarButton label={hidden ? "Show" : "Hide"} onClick={() => toggleBlockHidden(blockId)}>
        {hidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
      </ToolbarButton>
      <ToolbarButton label="Duplicate" onClick={() => duplicateBlock(blockId)}>
        <Copy className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton label="Delete" onClick={() => removeBlock(blockId)} destructive>
        <Trash2 className="h-3.5 w-3.5" />
      </ToolbarButton>
    </div>
  );
}

function ToolbarButton({
  children,
  label,
  onClick,
  destructive,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className={cn(
            "rounded-md p-1.5 hover:bg-accent",
            destructive ? "text-destructive hover:bg-destructive/10" : "text-muted-foreground"
          )}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
