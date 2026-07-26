"use client";

import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { useAdminStore } from "@/context/admin-store";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    useAdminStore.persist.rehydrate();
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
