import Link from "next/link";
import { Frown } from "lucide-react";

export function NotFoundNotice() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
      <Frown className="h-8 w-8 opacity-40" />
      <h1 className="text-xl font-semibold">This page doesn&apos;t exist yet</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        No published Bento page at this URL — or its owner hasn&apos;t published it yet.
      </p>
      <Link href="/" className="mt-2 text-sm font-medium underline underline-offset-4">
        Go back home
      </Link>
    </div>
  );
}
