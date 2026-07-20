"use client";

import { CalendarCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

export function RepairBookingForm() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">Name<Input name="name" required /></label>
        <label className="grid gap-2 text-sm font-semibold">Email<Input name="email" type="email" required /></label>
        <label className="grid gap-2 text-sm font-semibold">Device<Input name="device" placeholder="iPhone, MacBook, iPad..." required /></label>
        <label className="grid gap-2 text-sm font-semibold">Preferred date<Input name="preferredDate" type="date" required /></label>
      </div>
      <label className="grid gap-2 text-sm font-semibold">Describe issue<Textarea name="issue" placeholder="Tell us what happened, what you see, and when it started." required /></label>
      <label className="grid gap-2 text-sm font-semibold">Photo URL placeholder<Input name="photoUrl" placeholder="Cloudinary upload URL after signed upload" /></label>
      <Button type="submit"><CalendarCheck className="h-4 w-4" /> Book appointment</Button>
      {submitted && <p className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">Booking request saved. Email confirmation hooks are ready to connect.</p>}
    </form>
  );
}
