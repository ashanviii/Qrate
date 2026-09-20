import { create } from "zustand";
import { produce } from "immer";
import { arrayMove } from "@dnd-kit/sortable";
import type {
  Block,
  BlockType,
  EditorMode,
  FreeformSpan,
  GridSpan,
  Portfolio,
  Theme,
} from "@/lib/types";
import { createBlock } from "@/lib/blocks";
import { PRESETS } from "@/lib/presets";
import type { PresetId } from "@/lib/types";

const HISTORY_LIMIT = 50;

interface EditorState {
  portfolio: Portfolio | null;
  selectedBlockId: string | null;
  past: Portfolio[];
  future: Portfolio[];
  dirty: boolean;
  saving: boolean;
  previewMode: boolean;

  load: (portfolio: Portfolio) => void;
  markSaved: () => void;
  setSaving: (v: boolean) => void;
  togglePreview: () => void;

  selectBlock: (id: string | null) => void;
  addBlock: (type: BlockType) => void;
  duplicateBlock: (id: string) => void;
  removeBlock: (id: string) => void;
  toggleBlockHidden: (id: string) => void;
  updateBlockData: (id: string, data: object) => void;
  updateBlockGrid: (id: string, grid: Partial<GridSpan>) => void;
  updateBlockFreeform: (id: string, freeform: Partial<FreeformSpan>) => void;
  updateBlockBg: (id: string, bg: string | undefined) => void;
  reorderBlocks: (activeId: string, overId: string) => void;

  setTheme: (theme: Partial<Theme>) => void;
  applyPreset: (preset: PresetId) => void;
  setMode: (mode: EditorMode) => void;
  setProfileMeta: (meta: Partial<Pick<Portfolio, "displayName" | "bio" | "avatarUrl">>) => void;
  setPublished: (v: boolean) => void;
  setBranding: (v: boolean) => void;

  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

function withHistory(state: EditorState, next: Portfolio): Partial<EditorState> {
  if (!state.portfolio) return { portfolio: next };
  const past = [...state.past, state.portfolio].slice(-HISTORY_LIMIT);
  return { portfolio: next, past, future: [], dirty: true };
}

export const useEditorStore = create<EditorState>((set, get) => ({
  portfolio: null,
  selectedBlockId: null,
  past: [],
  future: [],
  dirty: false,
  saving: false,
  previewMode: false,

  load: (portfolio) => set({ portfolio, past: [], future: [], dirty: false, selectedBlockId: null }),
  markSaved: () => set({ dirty: false }),
  setSaving: (v) => set({ saving: v }),
  togglePreview: () => set((s) => ({ previewMode: !s.previewMode, selectedBlockId: null })),

  selectBlock: (id) => set({ selectedBlockId: id }),

  addBlock: (type) => {
    const state = get();
    if (!state.portfolio) return;
    const block = createBlock(type);
    // Place freeform block with slight offset so new blocks don't stack exactly
    block.freeform.x += (state.portfolio.blocks.length % 6) * 24;
    block.freeform.y += Math.floor(state.portfolio.blocks.length / 6) * 24;
    const next = produce(state.portfolio, (draft) => {
      draft.blocks.push(block as Block);
    });
    set({ ...withHistory(state, next), selectedBlockId: block.id });
  },

  duplicateBlock: (id) => {
    const state = get();
    if (!state.portfolio) return;
    const next = produce(state.portfolio, (draft) => {
      const idx = draft.blocks.findIndex((b) => b.id === id);
      if (idx === -1) return;
      const clone = JSON.parse(JSON.stringify(draft.blocks[idx])) as Block;
      clone.id = `${clone.id}-copy-${Math.random().toString(36).slice(2, 7)}`;
      clone.grid.y += clone.grid.h;
      clone.freeform.x += 24;
      clone.freeform.y += 24;
      draft.blocks.splice(idx + 1, 0, clone);
    });
    set(withHistory(state, next));
  },

  removeBlock: (id) => {
    const state = get();
    if (!state.portfolio) return;
    const next = produce(state.portfolio, (draft) => {
      draft.blocks = draft.blocks.filter((b) => b.id !== id);
    });
    set({ ...withHistory(state, next), selectedBlockId: null });
  },

  toggleBlockHidden: (id) => {
    const state = get();
    if (!state.portfolio) return;
    const next = produce(state.portfolio, (draft) => {
      const block = draft.blocks.find((b) => b.id === id);
      if (block) block.hidden = !block.hidden;
    });
    set(withHistory(state, next));
  },

  updateBlockData: (id, data) => {
    const state = get();
    if (!state.portfolio) return;
    const next = produce(state.portfolio, (draft) => {
      const block = draft.blocks.find((b) => b.id === id);
      if (block) Object.assign(block.data as object, data);
    });
    set(withHistory(state, next));
  },

  updateBlockGrid: (id, grid) => {
    const state = get();
    if (!state.portfolio) return;
    const next = produce(state.portfolio, (draft) => {
      const block = draft.blocks.find((b) => b.id === id);
      if (block) Object.assign(block.grid, grid);
    });
    set(withHistory(state, next));
  },

  updateBlockFreeform: (id, freeform) => {
    const state = get();
    if (!state.portfolio) return;
    const next = produce(state.portfolio, (draft) => {
      const block = draft.blocks.find((b) => b.id === id);
      if (block) Object.assign(block.freeform, freeform);
    });
    set(withHistory(state, next));
  },

  updateBlockBg: (id, bg) => {
    const state = get();
    if (!state.portfolio) return;
    const next = produce(state.portfolio, (draft) => {
      const block = draft.blocks.find((b) => b.id === id);
      if (block) block.bg = bg;
    });
    set(withHistory(state, next));
  },

  reorderBlocks: (activeId, overId) => {
    const state = get();
    if (!state.portfolio || activeId === overId) return;
    const oldIndex = state.portfolio.blocks.findIndex((b) => b.id === activeId);
    const newIndex = state.portfolio.blocks.findIndex((b) => b.id === overId);
    if (oldIndex === -1 || newIndex === -1) return;
    const next = produce(state.portfolio, (draft) => {
      draft.blocks = arrayMove(draft.blocks, oldIndex, newIndex) as typeof draft.blocks;
    });
    set(withHistory(state, next));
  },

  setTheme: (theme) => {
    const state = get();
    if (!state.portfolio) return;
    const next = produce(state.portfolio, (draft) => {
      Object.assign(draft.theme, theme);
    });
    set(withHistory(state, next));
  },

  applyPreset: (preset) => {
    const state = get();
    if (!state.portfolio) return;
    const next = produce(state.portfolio, (draft) => {
      draft.theme = { ...PRESETS[preset].theme };
    });
    set(withHistory(state, next));
  },

  setMode: (mode) => {
    const state = get();
    if (!state.portfolio) return;
    const next = produce(state.portfolio, (draft) => {
      draft.mode = mode;
    });
    set(withHistory(state, next));
  },

  setProfileMeta: (meta) => {
    const state = get();
    if (!state.portfolio) return;
    const next = produce(state.portfolio, (draft) => {
      Object.assign(draft, meta);
    });
    set(withHistory(state, next));
  },

  setPublished: (v) => {
    const state = get();
    if (!state.portfolio) return;
    const next = produce(state.portfolio, (draft) => {
      draft.published = v;
    });
    set(withHistory(state, next));
  },

  setBranding: (v) => {
    const state = get();
    if (!state.portfolio) return;
    const next = produce(state.portfolio, (draft) => {
      draft.branding = v;
    });
    set(withHistory(state, next));
  },

  undo: () => {
    const state = get();
    if (!state.portfolio || state.past.length === 0) return;
    const previous = state.past[state.past.length - 1];
    const past = state.past.slice(0, -1);
    const future = [state.portfolio, ...state.future].slice(0, HISTORY_LIMIT);
    set({ portfolio: previous, past, future, dirty: true });
  },

  redo: () => {
    const state = get();
    if (!state.portfolio || state.future.length === 0) return;
    const [next, ...rest] = state.future;
    const past = [...state.past, state.portfolio].slice(-HISTORY_LIMIT);
    set({ portfolio: next, past, future: rest, dirty: true });
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
}));
