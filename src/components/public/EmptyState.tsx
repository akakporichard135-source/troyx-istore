import React from "react";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  minimal?: boolean; // When true, renders an intentionally clean, empty Apple-style whitespace container
}

export default function EmptyState({
  title,
  description,
  actionText,
  actionHref,
  minimal = false,
}: EmptyStateProps) {
  if (minimal) {
    // Pure clean minimal area for initial live state
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-black text-white px-4">
        <div className="text-center max-w-lg mx-auto py-24 space-y-3">
          <div className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
            TroyX iStore • Accra
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            Home of Original Apple Products
          </h1>
          <p className="text-sm text-zinc-400 font-light">
            Bawaleshie, East Legon, Accra, Ghana
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[45vh] flex items-center justify-center px-4 py-20 text-center">
      <div className="max-w-md mx-auto space-y-4">
        <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
          <Package className="w-6 h-6" />
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          {title || "No items published yet"}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {description ||
            "Our curated collection of genuine Apple devices is currently being updated by the store administrator."}
        </p>
        {actionText && actionHref && (
          <div className="pt-2">
            <Link
              href={actionHref}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              <span>{actionText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
