"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <span className="h-10 w-10 rounded-full bg-black/5 dark:bg-white/10" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-brand-ink transition hover:text-brand-blue dark:border-white/10 dark:bg-white/10 dark:text-white"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
    </button>
  );
}
