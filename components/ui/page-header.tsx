import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("bg-brand-mist py-16 dark:bg-white/5", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {eyebrow && <p className="mb-3 text-sm font-semibold uppercase text-brand-blue">{eyebrow}</p>}
        <h1 className="max-w-4xl text-4xl font-semibold tracking-normal text-brand-ink dark:text-white sm:text-6xl">{title}</h1>
        {description && <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">{description}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
