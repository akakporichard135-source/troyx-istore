import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "secondary" | "ghost" | "dark" | "outline";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition",
        variant === "primary" && "bg-brand-blue text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600",
        variant === "secondary" &&
          "border border-black/10 bg-white text-brand-ink hover:border-brand-blue hover:text-brand-blue dark:border-white/10 dark:bg-white/10 dark:text-white",
        variant === "outline" &&
          "border border-black/10 dark:border-white/10 bg-transparent text-brand-ink dark:text-white hover:bg-black/5 dark:hover:bg-white/10",
        variant === "ghost" && "bg-transparent text-brand-ink hover:bg-black/5 dark:text-white dark:hover:bg-white/10",
        variant === "dark" && "bg-brand-ink text-white hover:bg-black dark:bg-white dark:text-brand-ink",
        className
      )}
      {...props}
    />
  );
}

export function LinkButton({
  href,
  children,
  className,
  variant = "primary"
}: {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: ButtonProps["variant"];
}) {
  return (
    <Link
      href={href}
      className={cn(
        "focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition",
        variant === "primary" && "bg-brand-blue text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600",
        variant === "secondary" &&
          "border border-black/10 bg-white text-brand-ink hover:border-brand-blue hover:text-brand-blue dark:border-white/10 dark:bg-white/10 dark:text-white",
        variant === "ghost" && "bg-transparent text-brand-ink hover:bg-black/5 dark:text-white dark:hover:bg-white/10",
        variant === "dark" && "bg-brand-ink text-white hover:bg-black dark:bg-white dark:text-brand-ink",
        className
      )}
    >
      {children}
    </Link>
  );
}
