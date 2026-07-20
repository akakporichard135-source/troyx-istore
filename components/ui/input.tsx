import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: ComponentPropsWithoutRef<"input">) {
  return (
    <input
      className={cn(
        "focus-ring h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-brand-ink shadow-sm outline-none transition placeholder:text-zinc-400 dark:border-white/10 dark:bg-white/10 dark:text-white",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: ComponentPropsWithoutRef<"textarea">) {
  return (
    <textarea
      className={cn(
        "focus-ring min-h-32 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-brand-ink shadow-sm outline-none transition placeholder:text-zinc-400 dark:border-white/10 dark:bg-white/10 dark:text-white",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: ComponentPropsWithoutRef<"select">) {
  return (
    <select
      className={cn(
        "focus-ring h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-brand-ink shadow-sm outline-none transition dark:border-white/10 dark:bg-zinc-900 dark:text-white",
        className
      )}
      {...props}
    />
  );
}
