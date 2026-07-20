import type { Metadata } from "next";
import { AuthForm } from "@/components/forms/auth-form";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = { title: "Register", description: "Create a TroyX iStore customer account." };

export default function RegisterPage() {
  return (
    <>
      <PageHeader eyebrow="Account" title="Create your TroyX account." description="Save addresses, track deliveries, build a wishlist, and download invoices." />
      <Section><AuthForm mode="register" /></Section>
    </>
  );
}
