"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Sparkles, Undo2, Redo2, Sun, Moon, ExternalLink, Eye, EyeOff, LogOut, Loader2, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useEditorStore } from "@/lib/store/editor-store";
import { useEditorUser } from "@/components/editor/user-context";
import { signOut } from "@/lib/auth";

export function EditorTopbar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const user = useEditorUser();

  const portfolio = useEditorStore((s) => s.portfolio);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const canUndo = useEditorStore((s) => s.past.length > 0);
  const canRedo = useEditorStore((s) => s.future.length > 0);
  const previewMode = useEditorStore((s) => s.previewMode);
  const togglePreview = useEditorStore((s) => s.togglePreview);
  const setPublished = useEditorStore((s) => s.setPublished);
  const saving = useEditorStore((s) => s.saving);
  const dirty = useEditorStore((s) => s.dirty);

  if (!portfolio) return null;

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-3 sm:px-4">
      <div className="flex items-center gap-1.5">
        <Link href="/" className="mr-2 hidden items-center gap-1.5 text-sm font-semibold sm:flex">
          <Sparkles className="h-4 w-4" />
          Bento
        </Link>
        <IconButton label="Undo" onClick={undo} disabled={!canUndo}><Undo2 className="h-4 w-4" /></IconButton>
        <IconButton label="Redo" onClick={redo} disabled={!canRedo}><Redo2 className="h-4 w-4" /></IconButton>
        <span className="ml-2 hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
          {saving ? (
            <><Loader2 className="h-3 w-3 animate-spin" /> Saving…</>
          ) : dirty ? (
            "Unsaved changes"
          ) : (
            <><Check className="h-3 w-3" /> Saved</>
          )}
        </span>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <IconButton label={previewMode ? "Exit preview" : "Preview"} onClick={togglePreview}>
          {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </IconButton>
        <IconButton label={theme === "dark" ? "Light mode" : "Dark mode"} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </IconButton>

        <div className="mx-1 hidden items-center gap-2 rounded-full border px-3 py-1.5 sm:flex">
          <span className="text-xs font-medium">{portfolio.published ? "Published" : "Draft"}</span>
          <Switch
            checked={portfolio.published}
            onCheckedChange={(v) => {
              setPublished(v);
              toast.success(v ? "Your page is live!" : "Unpublished — the public link is now hidden");
            }}
          />
        </div>

        <Button asChild variant="outline" size="sm" className="gap-1.5">
          <a href={`/${portfolio.username}`} target="_blank" rel="noreferrer">
            View live <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {(user?.displayName || portfolio.displayName || "?").slice(0, 1).toUpperCase()}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="truncate">{user?.email || `@${portfolio.username}`}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function IconButton({ label, onClick, disabled, children }: {
  label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" onClick={onClick} disabled={disabled} className="h-8 w-8">
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
