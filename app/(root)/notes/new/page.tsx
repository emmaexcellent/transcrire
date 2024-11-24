import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/notes/Sidebar";
import Transcribe from "@/components/Transcribe";

export default async function NewNotePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen flex">
      <Sidebar />
      <section className="w-full h-full flex items-center justify-center mt-20 p-5">
        <Transcribe/>
      </section>
    </main>
  );
}
