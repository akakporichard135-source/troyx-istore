"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase text-brand-blue">500</p>
      <h1 className="mt-3 text-4xl font-semibold text-brand-ink dark:text-white">Something needs attention.</h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-300">Please try again. If the problem continues, contact TroyX support.</p>
      <Button type="button" className="mt-8" onClick={reset}>Try again</Button>
    </section>
  );
}
