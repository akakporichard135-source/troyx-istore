import type { Metadata } from "next";
import { RepairBookingForm } from "@/components/forms/repair-booking-form";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Repair Booking",
  description: "Book a TroyX iStore repair assessment for Apple devices and accessories."
};

export default function RepairBookingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Repair"
        title="Book a repair appointment."
        description="Tell us about the device, issue, and preferred date so the TroyX team can prepare the right diagnostic support."
      />
      <Section>
        <RepairBookingForm />
      </Section>
    </>
  );
}
