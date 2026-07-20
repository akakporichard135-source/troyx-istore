import { CheckCircle2 } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

export default function ConfirmationPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 text-center">
      <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
      <h1 className="mt-5 text-4xl font-semibold text-brand-ink dark:text-white">Order confirmed</h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-300">Your order confirmation page is ready for payment-provider redirects and order records.</p>
      <LinkButton href="/order-tracking" className="mt-8">Track order</LinkButton>
    </section>
  );
}
