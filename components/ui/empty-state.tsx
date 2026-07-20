import { PackageSearch } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  actionHref = "/shop",
  actionLabel = "Browse products"
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-[2rem] border border-dashed border-black/10 bg-brand-mist p-10 text-center dark:border-white/10 dark:bg-white/5">
      <PackageSearch className="mx-auto h-10 w-10 text-brand-blue" aria-hidden="true" />
      <h2 className="mt-4 text-2xl font-semibold text-brand-ink dark:text-white">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-300">{description}</p>
      <LinkButton href={actionHref} className="mt-6">
        {actionLabel}
      </LinkButton>
    </div>
  );
}
