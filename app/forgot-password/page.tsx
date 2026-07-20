import type { Metadata } from "next";
import { AuthForm } from "@/components/forms/auth-form";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = { title: "Forgot Password", description: "Reset your TroyX iStore password." };

export default function ForgotPasswordPage() {
  return (
    <>
      <PageHeader eyebrow="Account" title="Reset your password." description="Supabase Auth can send secure reset links when credentials are configured." />
      <Section><AuthForm mode="forgot" /></Section>
    </>
  );
}
