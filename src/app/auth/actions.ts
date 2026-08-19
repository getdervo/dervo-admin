"use server";

import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export type SignInState = { error?: string };

export async function signIn(
  _prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await supabaseServer();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Supabase returns a deliberately generic message; keep it that way rather
    // than revealing whether the address exists.
    return { error: "Those details didn't work. Try again." };
  }

  // Outside the error branch: redirect() signals by throwing.
  redirect("/assessments");
}

export async function signOut() {
  const supabase = await supabaseServer();
  await supabase.auth.signOut();
  redirect("/login");
}
