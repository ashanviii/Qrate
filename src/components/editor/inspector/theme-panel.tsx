"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEditorStore } from "@/lib/store/editor-store";
import { PRESETS } from "@/lib/presets";
import { FONT_LABELS } from "@/lib/fonts";
import type { BackgroundType, FontKey, PresetId, ShadowLevel } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useEditorUser } from "@/components/editor/user-context";
import { FileField } from "@/components/editor/inspector/file-field";
import { uploadImage } from "@/lib/upload";

const SHADOW_OPTIONS: ShadowLevel[] = ["none", "soft", "medium", "hard"];
const BG_TYPES: BackgroundType[] = ["solid", "gradient", "image", "noise"];
const FONT_KEYS = Object.keys(FONT_LABELS) as FontKey[];

export function ThemePanel() {
  const portfolio = useEditorStore((s) => s.portfolio);
  const applyPreset = useEditorStore((s) => s.applyPreset);
  const setTheme = useEditorStore((s) => s.setTheme);
  const user = useEditorUser();

  if (!portfolio) return null;
  const theme = portfolio.theme;
  const bg = theme.background;

  return (
    <ScrollArea className="h-full">
      <Tabs defaultValue="presets" className="w-full">
        <TabsList className="sticky top-0 z-10 grid w-full grid-cols-3 rounded-none border-b bg-background">
          <TabsTrigger value="presets">Presets</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="page">Page</TabsTrigger>
        </TabsList>

        <TabsContent value="presets" className="grid gap-2 p-4">
          {(Object.entries(PRESETS) as [PresetId, (typeof PRESETS)[PresetId]][]).map(([id, preset]) => (
            <button
              key={id}
              onClick={() => applyPreset(id)}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-2.5 text-left transition-colors hover:bg-muted",
                theme.preset === id && "border-foreground bg-muted"
              )}
            >
              <span
                className="h-9 w-9 shrink-0 rounded-lg border"
                style={{
                  background: preset.theme.background.type === "gradient"
                    ? `linear-gradient(135deg, ${preset.theme.background.gradientFrom}, ${preset.theme.background.gradientTo})`
                    : preset.theme.background.solid,
                }}
              />
              <span>
                <span className="block text-sm font-medium">{preset.label}</span>
                <span className="block text-xs text-muted-foreground">{preset.blurb}</span>
              </span>
            </button>
          ))}
        </TabsContent>

        <TabsContent value="style" className="grid gap-5 p-4">
          <div className="grid gap-1.5">
            <Label className="text-xs text-muted-foreground">Background type</Label>
            <div className="grid grid-cols-4 gap-1.5">
              {BG_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setTheme({ background: { ...bg, type } })}
                  className={cn(
                    "rounded-lg border px-2 py-1.5 text-xs capitalize transition-colors",
                    bg.type === type ? "border-foreground bg-muted font-medium" : "border-transparent bg-muted/40 hover:bg-muted"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {bg.type === "solid" || bg.type === "noise" ? (
            <ColorField label="Background color" value={bg.solid} onChange={(v) => setTheme({ background: { ...bg, solid: v } })} />
          ) : null}

          {bg.type === "gradient" && (
            <div className="grid grid-cols-2 gap-3">
              <ColorField label="From" value={bg.gradientFrom} onChange={(v) => setTheme({ background: { ...bg, gradientFrom: v } })} />
              <ColorField label="To" value={bg.gradientTo} onChange={(v) => setTheme({ background: { ...bg, gradientTo: v } })} />
            </div>
          )}

          {bg.type === "image" && (
            <FileField
              label="Background image"
              value={bg.imageUrl}
              onChange={(url) => setTheme({ background: { ...bg, imageUrl: url } })}
              user={user}
              upload={uploadImage}
              accept="image/*"
            />
          )}

          {bg.type === "noise" && (
            <SliderField
              label="Noise intensity"
              value={bg.noiseOpacity}
              min={0}
              max={0.25}
              step={0.01}
              onChange={(v) => setTheme({ background: { ...bg, noiseOpacity: v } })}
            />
          )}

          <div className="grid grid-cols-2 gap-3">
            <ColorField label="Text color" value={theme.primary} onChange={(v) => setTheme({ primary: v })} />
            <ColorField label="Accent color" value={theme.accent} onChange={(v) => setTheme({ accent: v })} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label className="text-xs text-muted-foreground">Heading font</Label>
              <Select value={theme.fontHeading} onValueChange={(v) => setTheme({ fontHeading: v as FontKey })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FONT_KEYS.map((f) => <SelectItem key={f} value={f}>{FONT_LABELS[f]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs text-muted-foreground">Body font</Label>
              <Select value={theme.fontBody} onValueChange={(v) => setTheme({ fontBody: v as FontKey })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FONT_KEYS.map((f) => <SelectItem key={f} value={f}>{FONT_LABELS[f]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <SliderField label="Corner radius" value={theme.radius} min={0} max={32} onChange={(v) => setTheme({ radius: v })} />
          <SliderField label="Spacing" value={theme.spacing} min={4} max={28} onChange={(v) => setTheme({ spacing: v })} />
          <SliderField label="Border width" value={theme.borderWidth} min={0} max={4} onChange={(v) => setTheme({ borderWidth: v })} />
          <SliderField label="Columns" value={theme.columns} min={3} max={6} onChange={(v) => setTheme({ columns: v })} />

          <div className="grid gap-1.5">
            <Label className="text-xs text-muted-foreground">Shadow</Label>
            <div className="grid grid-cols-4 gap-1.5">
              {SHADOW_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setTheme({ shadow: s })}
                  className={cn(
                    "rounded-lg border px-2 py-1.5 text-xs capitalize transition-colors",
                    theme.shadow === s ? "border-foreground bg-muted font-medium" : "border-transparent bg-muted/40 hover:bg-muted"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="page" className="grid gap-4 p-4">
          <PageMetaFields />
        </TabsContent>
      </Tabs>
    </ScrollArea>
  );
}

function PageMetaFields() {
  const portfolio = useEditorStore((s) => s.portfolio)!;
  const setProfileMeta = useEditorStore((s) => s.setProfileMeta);
  const setMode = useEditorStore((s) => s.setMode);

  return (
    <>
      <div className="grid gap-1.5">
        <Label className="text-xs text-muted-foreground">Display name</Label>
        <input
          className="h-9 rounded-md border px-3 text-sm"
          value={portfolio.displayName}
          onChange={(e) => setProfileMeta({ displayName: e.target.value })}
        />
      </div>
      <div className="grid gap-1.5">
        <Label className="text-xs text-muted-foreground">Bio</Label>
        <textarea
          className="min-h-20 rounded-md border p-3 text-sm"
          value={portfolio.bio}
          onChange={(e) => setProfileMeta({ bio: e.target.value })}
        />
      </div>
      <div className="grid gap-1.5">
        <Label className="text-xs text-muted-foreground">Layout mode</Label>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => setMode("grid")}
            className={cn("rounded-lg border px-2 py-1.5 text-xs transition-colors", portfolio.mode === "grid" ? "border-foreground bg-muted font-medium" : "border-transparent bg-muted/40 hover:bg-muted")}
          >
            Bento grid
          </button>
          <button
            onClick={() => setMode("freeform")}
            className={cn("rounded-lg border px-2 py-1.5 text-xs transition-colors", portfolio.mode === "freeform" ? "border-foreground bg-muted font-medium" : "border-transparent bg-muted/40 hover:bg-muted")}
          >
            Freeform
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Freeform lets you place blocks anywhere on the canvas — drag them and resize from the corner handle.
        </p>
      </div>
    </>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2 rounded-md border px-2 py-1.5">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-6 w-6 cursor-pointer border-0 bg-transparent p-0" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-xs outline-none"
        />
      </div>
    </div>
  );
}

function SliderField({ label, value, min, max, step = 1, onChange }: {
  label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void;
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs text-muted-foreground">{label} ({value})</Label>
      <Slider min={min} max={max} step={step} value={[value]} onValueChange={([v]) => onChange(v)} />
    </div>
  );
}
