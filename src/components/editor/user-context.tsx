"use client";

import { createContext, useContext } from "react";
import type { AuthUser } from "@/lib/auth";

const EditorUserContext = createContext<AuthUser | null>(null);

export function EditorUserProvider({ user, children }: { user: AuthUser | null; children: React.ReactNode }) {
  return <EditorUserContext.Provider value={user}>{children}</EditorUserContext.Provider>;
}

export function useEditorUser() {
  return useContext(EditorUserContext);
}
