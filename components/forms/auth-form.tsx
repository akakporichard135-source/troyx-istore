"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Mode = "login" | "register" | "forgot";

export function AuthForm({ mode }: { mode: Mode }) {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto grid max-w-md gap-4 rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
      {mode === "register" && (
        <label className="grid gap-2 text-sm font-semibold">
          Full name
          <Input name="name" required minLength={2} />
        </label>
      )}
      <label className="grid gap-2 text-sm font-semibold">
        Email
        <Input name="email" type="email" required />
      </label>
      {mode !== "forgot" && (
        <label className="grid gap-2 text-sm font-semibold">
          Password
          <Input name="password" type="password" required minLength={8} />
        </label>
      )}
      {submitted && <p className="rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">Authentication flow placeholder is ready for Supabase Auth.</p>}
      <Button type="submit">{mode === "login" ? "Sign in" : mode === "register" ? "Create account" : "Send reset link"}</Button>
    </form>
  );
}
