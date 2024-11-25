import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/notes/Sidebar";
import Transcribe from "@/components/Transcribe";
import Link from "next/link";
import { Notebook } from "lucide-react";

export default async function NewNotePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen flex">
      <Sidebar />
      <section className="flex-grow p-4">
        <div className="flex items-center justify-between gap-5">
          <h1 className="text-xl font-semibold mb-7">Transcribe New Notes</h1>
        </div>
        <Transcribe />
        <div className="w-full flex lg:hidden justify-center gap-3">
          <Link
            className="text-foreground/60 group gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 bg-primary/30 hover:bg-primary/50 inline-flex items-center gap-2 mt-10"
            href="/notes"
          >
            <Notebook className="text-foreground/50" />
            See All Notes
          </Link>
        </div>
      </section>
    </main>
  );
}
