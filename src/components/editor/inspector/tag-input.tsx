"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

export function TagInput({ values, onChange, placeholder = "Add and press Enter" }: {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  function commit() {
    const v = draft.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setDraft("");
  }

  return (
    <div className="rounded-lg border p-2">
      <div className="mb-1.5 flex flex-wrap gap-1.5">
        {values.map((tag) => (
          <span key={tag} className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs">
            {tag}
            <button type="button" onClick={() => onChange(values.filter((t) => t !== tag))}>
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commit();
          } else if (e.key === "Backspace" && !draft && values.length > 0) {
            onChange(values.slice(0, -1));
          }
        }}
        onBlur={commit}
        placeholder={placeholder}
        className="h-7 border-none px-1 text-xs shadow-none focus-visible:ring-0"
      />
    </div>
  );
}
