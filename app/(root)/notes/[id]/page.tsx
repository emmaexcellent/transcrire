import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/notes/Sidebar";
import { formatDate } from "@/lib/utils";

export default async function NotePage() {
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
      <section className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-7">Your Notes</h1>

        {notes && notes.length > 0 ? (
          <ul className="grid grid-cols-2 lg:grid-cols-3 gap-5 items-center">
            {notes.map((note) => (
              <li
                key={note.id}
                className="border p-4 rounded-lg shadow-sm bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10  border-primary h-64 flex flex-col justify-between"
              >
                <h2 className="text-xl font-semibold">{note.title}</h2>
                <p className="text-foreground/60 line-clamp-4">
                  {note.content}
                </p>
                <p className="text-foreground/40 text-sm">
                  {formatDate(note.created_at)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No notes found.</p>
        )}
      </section>
    </main>
  );
}
