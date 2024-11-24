"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function login(data: { email: string; password: string }) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { success: false, message: error.message }
  } else {
    return { success: true, message: "Login Successful!" };
  }

}

export async function signup(data: { email: string; password: string }) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return { success: false, message: error.message };
  } else {
    return { success: true, message: "Account Created!" };
  }
}
