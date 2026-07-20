import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  eyebrow,
  title,
  description,
  children,
  className
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("py-16 sm:py-20", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(title || eyebrow || description) && (
          <div className="mb-9 max-w-3xl">
            {eyebrow && <p className="mb-3 text-sm font-semibold uppercase text-brand-blue">{eyebrow}</p>}
            {title && <h2 className="text-3xl font-semibold tracking-normal text-brand-ink dark:text-white sm:text-5xl">{title}</h2>}
            {description && <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-300">{description}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
