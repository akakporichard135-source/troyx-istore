import type { Metadata } from "next";
import { RepairBookingForm } from "@/components/forms/repair-booking-form";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = { title: "Repair Booking", description: "Book a TroyX iStore repair appointment." };

export default function RepairBookingPage() {
  return (
    <>
      <PageHeader eyebrow="Repair" title="Book a repair appointment." description="Choose a device, describe the issue, upload photos through Cloudinary later, select a date, and receive email confirmation." />
      <Section><RepairBookingForm /></Section>
    </>
  );
}
