"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type {
  Block,
  ProfileBlockData,
  TextBlockData,
  ImageBlockData,
  LinkBlockData,
  SocialBlockData,
  ProjectBlockData,
  VideoBlockData,
  GifBlockData,
  ResumeBlockData,
  SkillsBlockData,
  SpotifyBlockData,
  YoutubeBlockData,
  PetBlockData,
  StampBlockData,
  SocialPlatform,
  PetSpecies,
} from "@/lib/types";
import { useEditorStore } from "@/lib/store/editor-store";
import { useEditorUser } from "@/components/editor/user-context";
import { FileField } from "@/components/editor/inspector/file-field";
import { uploadImage, uploadResume, uploadVideo } from "@/lib/upload";
import { SOCIAL_LABELS } from "@/components/blocks/social-icons";
import { TagInput } from "@/components/editor/inspector/tag-input";

function useUpdate(id: string) {
  const updateBlockData = useEditorStore((s) => s.updateBlockData);
  return (patch: object) => updateBlockData(id, patch);
}

export function ProfileForm({ block }: { block: Block & { data: ProfileBlockData } }) {
  const update = useUpdate(block.id);
  const user = useEditorUser();
  return (
    <div className="grid gap-4">
      <FileField label="Avatar" value={block.data.avatarUrl} onChange={(url) => update({ avatarUrl: url })} user={user} upload={uploadImage} accept="image/*" />
      <Field label="Name">
        <Input value={block.data.name} onChange={(e) => update({ name: e.target.value })} />
      </Field>
      <Field label="Tagline">
        <Input value={block.data.tagline} onChange={(e) => update({ tagline: e.target.value })} maxLength={80} />
      </Field>
      <Field label="Location">
        <Input value={block.data.location} onChange={(e) => update({ location: e.target.value })} placeholder="Optional" />
      </Field>
    </div>
  );
}

export function TextForm({ block }: { block: Block & { data: TextBlockData } }) {
  const update = useUpdate(block.id);
  return (
    <div className="grid gap-4">
      <Field label="Content">
        <Textarea value={block.data.content} onChange={(e) => update({ content: e.target.value })} rows={4} />
      </Field>
      <Field label="Alignment">
        <Select value={block.data.align} onValueChange={(v) => update({ align: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Size">
        <Select value={block.data.size} onValueChange={(v) => update({ size: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">Small</SelectItem>
            <SelectItem value="md">Medium</SelectItem>
            <SelectItem value="lg">Large</SelectItem>
            <SelectItem value="xl">Extra large</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}

export function ImageForm({ block }: { block: Block & { data: ImageBlockData } }) {
  const update = useUpdate(block.id);
  const user = useEditorUser();
  return (
    <div className="grid gap-4">
      <FileField label="Image" value={block.data.url} onChange={(url) => update({ url })} user={user} upload={uploadImage} accept="image/*" />
      <Field label="Alt text">
        <Input value={block.data.alt} onChange={(e) => update({ alt: e.target.value })} placeholder="Describe the image" />
      </Field>
      <Field label="Caption">
        <Input value={block.data.caption} onChange={(e) => update({ caption: e.target.value })} placeholder="Optional" />
      </Field>
      <Field label="Fit">
        <Select value={block.data.fit} onValueChange={(v) => update({ fit: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="cover">Cover</SelectItem>
            <SelectItem value="contain">Contain</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}

export function LinkForm({ block }: { block: Block & { data: LinkBlockData } }) {
  const update = useUpdate(block.id);
  return (
    <div className="grid gap-4">
      <Field label="URL">
        <Input value={block.data.url} onChange={(e) => update({ url: e.target.value })} placeholder="https://" />
      </Field>
      <Field label="Label">
        <Input value={block.data.label} onChange={(e) => update({ label: e.target.value })} />
      </Field>
      <Field label="Description">
        <Input value={block.data.description} onChange={(e) => update({ description: e.target.value })} placeholder="Optional" />
      </Field>
    </div>
  );
}

const SOCIAL_PLATFORMS = Object.keys(SOCIAL_LABELS) as SocialPlatform[];

export function SocialForm({ block }: { block: Block & { data: SocialBlockData } }) {
  const update = useUpdate(block.id);
  return (
    <div className="grid gap-4">
      <Field label="Platform">
        <Select value={block.data.platform} onValueChange={(v) => update({ platform: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {SOCIAL_PLATFORMS.map((p) => (
              <SelectItem key={p} value={p}>{SOCIAL_LABELS[p]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label={block.data.platform === "email" ? "Email address" : "Profile URL"}>
        <Input value={block.data.url} onChange={(e) => update({ url: e.target.value })} placeholder={block.data.platform === "email" ? "mailto:you@example.com" : "https://"} />
      </Field>
    </div>
  );
}

export function ProjectForm({ block }: { block: Block & { data: ProjectBlockData } }) {
  const update = useUpdate(block.id);
  const user = useEditorUser();
  return (
    <div className="grid gap-4">
      <FileField label="Cover image" value={block.data.imageUrl} onChange={(url) => update({ imageUrl: url })} user={user} upload={uploadImage} accept="image/*" />
      <Field label="Title">
        <Input value={block.data.title} onChange={(e) => update({ title: e.target.value })} />
      </Field>
      <Field label="Description">
        <Textarea value={block.data.description} onChange={(e) => update({ description: e.target.value })} rows={3} />
      </Field>
      <Field label="URL">
        <Input value={block.data.url} onChange={(e) => update({ url: e.target.value })} placeholder="https://" />
      </Field>
      <Field label="Tags">
        <TagInput values={block.data.tags} onChange={(tags) => update({ tags })} />
      </Field>
    </div>
  );
}

export function VideoForm({ block }: { block: Block & { data: VideoBlockData } }) {
  const update = useUpdate(block.id);
  const user = useEditorUser();
  return (
    <div className="grid gap-4">
      <FileField label="Video file" value={block.data.url} onChange={(url) => update({ url })} user={user} upload={uploadVideo} accept="video/*" previewImage={false} />
      <ToggleField label="Loop" checked={block.data.loop} onChange={(v) => update({ loop: v })} />
      <ToggleField label="Autoplay muted" checked={block.data.muted} onChange={(v) => update({ muted: v })} />
    </div>
  );
}

export function GifForm({ block }: { block: Block & { data: GifBlockData } }) {
  const update = useUpdate(block.id);
  const user = useEditorUser();
  return (
    <div className="grid gap-4">
      <FileField label="GIF" value={block.data.url} onChange={(url) => update({ url })} user={user} upload={uploadImage} accept="image/gif" />
      <Field label="Alt text">
        <Input value={block.data.alt} onChange={(e) => update({ alt: e.target.value })} />
      </Field>
    </div>
  );
}

export function ResumeForm({ block }: { block: Block & { data: ResumeBlockData } }) {
  const update = useUpdate(block.id);
  const user = useEditorUser();
  return (
    <div className="grid gap-4">
      <FileField label="Resume (PDF)" value={block.data.url} onChange={(url) => update({ url })} user={user} upload={uploadResume} accept="application/pdf" previewImage={false} />
      <Field label="Label">
        <Input value={block.data.label} onChange={(e) => update({ label: e.target.value })} />
      </Field>
    </div>
  );
}

export function SkillsForm({ block }: { block: Block & { data: SkillsBlockData } }) {
  const update = useUpdate(block.id);
  return (
    <div className="grid gap-4">
      <Field label="Title">
        <Input value={block.data.title} onChange={(e) => update({ title: e.target.value })} />
      </Field>
      <Field label="Skills">
        <TagInput values={block.data.items} onChange={(items) => update({ items })} />
      </Field>
    </div>
  );
}

export function SpotifyForm({ block }: { block: Block & { data: SpotifyBlockData } }) {
  const update = useUpdate(block.id);
  return (
    <div className="grid gap-4">
      <Field label="Spotify link">
        <Input value={block.data.url} onChange={(e) => update({ url: e.target.value })} placeholder="https://open.spotify.com/track/…" />
      </Field>
      <p className="text-xs text-muted-foreground">Paste a track, album, playlist, or episode link — right click any item in Spotify and choose Share → Copy link.</p>
    </div>
  );
}

export function YoutubeForm({ block }: { block: Block & { data: YoutubeBlockData } }) {
  const update = useUpdate(block.id);
  return (
    <div className="grid gap-4">
      <Field label="YouTube link">
        <Input value={block.data.url} onChange={(e) => update({ url: e.target.value })} placeholder="https://youtube.com/watch?v=…" />
      </Field>
    </div>
  );
}

const PET_SPECIES: PetSpecies[] = ["cat", "dog", "robot", "blob", "bird", "bunny"];

export function PetForm({ block }: { block: Block & { data: PetBlockData } }) {
  const update = useUpdate(block.id);
  return (
    <div className="grid gap-4">
      <Field label="Species">
        <div className="grid grid-cols-3 gap-2">
          {PET_SPECIES.map((species) => (
            <button
              key={species}
              onClick={() => update({ species })}
              className={`rounded-xl border p-2 text-xs capitalize transition-colors ${
                block.data.species === species ? "border-foreground bg-muted" : "border-transparent bg-muted/40 hover:bg-muted"
              }`}
            >
              {species}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Name">
        <Input value={block.data.name} onChange={(e) => update({ name: e.target.value })} placeholder="Optional" />
      </Field>
    </div>
  );
}

export function StampForm({ block }: { block: Block & { data: StampBlockData } }) {
  const update = useUpdate(block.id);
  const user = useEditorUser();
  return (
    <div className="grid gap-4">
      <FileField label="Stamp image" value={block.data.imageUrl} onChange={(url) => update({ imageUrl: url })} user={user} upload={uploadImage} accept="image/*" />
      <Field label="Caption">
        <Input value={block.data.caption} onChange={(e) => update({ caption: e.target.value })} placeholder="e.g. BENTO, or a date" maxLength={16} />
      </Field>
      <p className="text-xs text-muted-foreground">A little decorative sticker — drop in a photo and it gets the dashed postage-stamp treatment automatically.</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function ToggleField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg border px-3 py-2">
      <Label className="text-xs">{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
