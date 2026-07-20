import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/forms/auth-form";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = { title: "Login", description: "Sign in to TroyX iStore." };

export default function LoginPage() {
  return (
    <>
      <PageHeader eyebrow="Account" title="Welcome back." description="Sign in to manage orders, addresses, wishlist, invoices, notifications, and saved settings." />
      <Section>
        <AuthForm mode="login" />
        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-300">
          New here? <Link className="font-semibold text-brand-blue" href="/register">Create an account</Link> or <Link className="font-semibold text-brand-blue" href="/forgot-password">reset your password</Link>.
        </p>
      </Section>
    </>
  );
}
