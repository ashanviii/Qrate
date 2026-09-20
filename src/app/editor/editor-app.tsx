"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useEditorStore } from "@/lib/store/editor-store";
import { getCurrentUser, type AuthUser } from "@/lib/auth";
import { loadMyPortfolio, savePortfolio } from "@/lib/persistence";
import { EditorUserProvider } from "@/components/editor/user-context";
import { EditorTopbar } from "@/components/editor/editor-topbar";
import { BlockPalette } from "@/components/editor/block-palette";
import { EditorCanvas } from "@/components/editor/editor-canvas";
import { Inspector } from "@/components/editor/inspector/inspector";
import { PreviewOverlay } from "@/components/editor/preview-overlay";

export function EditorApp() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  const portfolio = useEditorStore((s) => s.portfolio);
  const load = useEditorStore((s) => s.load);
  const dirty = useEditorStore((s) => s.dirty);
  const setSaving = useEditorStore((s) => s.setSaving);
  const markSaved = useEditorStore((s) => s.markSaved);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const current = await getCurrentUser();
      if (!current) {
        router.replace("/login?next=/editor");
        return;
      }
      if (cancelled) return;
      setUser(current);
      const p = await loadMyPortfolio(current);
      if (cancelled) return;
      load(p);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autosave, debounced.
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!user || !portfolio || !dirty) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      setSaving(true);
      try {
        await savePortfolio(user, portfolio);
        markSaved();
      } finally {
        setSaving(false);
      }
    }, 700);
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolio, dirty, user]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;
      if (!meta || e.key.toLowerCase() !== "z") return;
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [undo, redo]);

  if (!ready || !portfolio) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <EditorUserProvider user={user}>
      <div className="flex h-screen flex-col overflow-hidden">
        <EditorTopbar />
        <div className="border-b bg-amber-50 px-4 py-2 text-center text-xs text-amber-900 md:hidden">
          The editor works best on a larger screen — your published page is fully responsive either way.
        </div>
        <div className="flex min-h-0 flex-1">
          <aside className="hidden w-56 shrink-0 border-r md:block">
            <BlockPalette />
          </aside>
          <main className="min-w-0 flex-1 overflow-y-auto bg-muted/30 p-4 sm:p-8">
            <EditorCanvas />
          </main>
          <aside className="hidden w-80 shrink-0 border-l lg:block">
            <Inspector />
          </aside>
        </div>
      </div>
      <PreviewOverlay />
    </EditorUserProvider>
  );
}
