# Bento

A minimal, playful, fully-customizable Bento-grid portfolio builder — sign up, drag blocks
around a grid (or go freeform), pick a design preset, publish to `yourdomain.com/username`.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, Zustand,
dnd-kit, Framer Motion, and Supabase (Postgres + Auth + Storage).

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. **No setup required** — without Supabase credentials the app
runs in **local demo mode**: signup/login and your portfolio are stored in your browser's
`localStorage`, so the whole product (editor, publish, public page, remix) works end to end
with zero configuration. This is what makes it possible to try instantly.

Demo mode limitation: the public `/[username]` page is server-rendered, and the server can't
read another browser's localStorage. So published pages you create in demo mode are only
visible in the *same browser* that created them (the app detects this and renders them
client-side there). The bundled `/demo` profile always works, everywhere, as a fixed example.
Connect Supabase (see below) to get real multi-user accounts and publicly shareable URLs.

## Going to production: connect Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL editor, run [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql)
   — it creates the `profiles` table (RLS-protected, one JSONB `data` column holding the
   whole portfolio), a public storage bucket for uploads, and their access policies.
3. Copy `.env.example` to `.env.local` and fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
   (Project Settings → API in the Supabase dashboard.)
4. Restart the dev server. Every auth/persistence/upload code path automatically switches
   from local demo storage to real Supabase — no code changes needed.

Deploys straight to [Vercel](https://vercel.com) — set the same env vars there.

## Architecture

- **`src/lib/types.ts`** — the whole domain model. A `Portfolio` is one JSON blob: theme +
  an array of typed `Block`s, each with independent grid *and* freeform positions so
  switching layout modes never loses data.
- **`src/lib/store/editor-store.ts`** — Zustand + Immer store driving the editor, with a
  simple snapshot-based undo/redo stack.
- **`src/components/blocks/`** — one presentational view per block type (profile, text,
  image, link, social, project, video, gif, resume, skills, spotify, youtube, pet). These
  same components render identically in the editor canvas and on the public page.
- **`src/components/canvas/`** — `PublicCanvas` (read-only, used by the public page and the
  in-editor preview) and the shared `BlockShell` card chrome driven entirely by CSS custom
  properties set from the active `Theme`.
- **`src/components/editor/`** — the editor: block palette, dnd-kit-powered grid canvas,
  pointer-drag freeform canvas, per-block inspector forms, and the theme/preset panel.
- **`src/lib/presets.ts`** — the 7 design presets (Minimal, Developer, Brutalist, Y2K,
  Editorial, Glass, Pixel), each just a starting `Theme` — every value stays editable after.
- **`src/app/[username]/`** — the public profile page, `generateMetadata` for SEO/OG tags,
  and a code-generated Open Graph image via `next/og`.
- **`src/proxy.ts`** — Next 16's renamed middleware; refreshes the Supabase session and
  gates `/editor` behind auth (a no-op in demo mode, where auth is client-side).

## Notable product decisions

- **Grid mode** uses CSS Grid with `grid-auto-flow: dense`; block order (not explicit x/y)
  drives placement, and dnd-kit's sortable strategy reorders that array — this avoids an
  entire class of manual collision-detection bugs a hand-rolled grid would need.
- **Freeform mode** is a separate, independent set of coordinates per block (not derived
  from grid position), so toggling modes is always reversible and never destructive.
- **Themes are CSS custom properties**, not Tailwind classes, so a user's font/color/radius/
  shadow choices apply uniformly to every block type without per-component branching.
