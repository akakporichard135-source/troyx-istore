import { LinkButton } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase text-brand-blue">404</p>
      <h1 className="mt-3 text-4xl font-semibold text-brand-ink dark:text-white">This page is out of stock.</h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-300">The page you requested could not be found.</p>
      <LinkButton href="/" className="mt-8">Return home</LinkButton>
    </section>
  );
}
