import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/notes/Sidebar";
import NoteList from "@/components/notes/NoteList";

export default async function NotesPage() {
  const supabase = createClient();

  // Fetch authenticated user
  const {
    data: { user },
    error: authError,
  } = await (await supabase).auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Fetch notes for the authenticated user
  const { data: notes, error: notesError } = await (await supabase)
    .from("notes")
    .select("*")
    .eq("user_id", user.id);

  if (notesError) {
    console.error("Error fetching notes:", notesError);
    // Handle the error appropriately
  }

  return (
    <main className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Notes Section */}
      <NoteList notes={notes} />
    </main>
  );
}
