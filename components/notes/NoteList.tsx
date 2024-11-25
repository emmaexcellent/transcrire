"use client"
import { formatDate } from '@/lib/utils';
import React from 'react'
import { NoteDetailDrawer } from './NoteDetail';
import Link from 'next/link';
import { Mic } from 'lucide-react';

const NoteList = ({ notes }: { notes: Note[] | null }) => {
  const [openDetail, setDetailOpen] = React.useState(false);
  const [selectedNote, setSelectedNote] = React.useState<Note | null>(null);

  return (
    <>
      <section className="flex-grow p-4">
        <div className="flex items-center justify-between gap-5">
          <h1 className="text-2xl font-bold mb-7">Your Notes</h1>
          <Link
            className="text-foreground/60 group lg:hidden gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 hover:bg-primary/30 -mt-2 flex"
            href="/notes/new"
          >
            <Mic className="text-foreground/50" />
            New Note
          </Link>
        </div>

        {notes && notes.length > 0 ? (
          <ul className="w-full grid grid-cols-2 lg:grid-cols-3 gap-5 items-center">
            {notes.map((note) => (
              <li
                key={note.id}
                className="border p-4 rounded-lg shadow-sm bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10  border-primary h-56 flex flex-col justify-between hover:scale-105 cursor-pointer"
                onClick={() => {
                  setDetailOpen(true);
                  setSelectedNote(note);
                }}
              >
                <h2 className="text-lg font-semibold line-clamp-1">
                  {note.title}
                </h2>
                <p className="text-foreground/70 line-clamp-4 text-sm">
                  {note.content}
                </p>
                <p className="text-foreground/40 text-xs">
                  {formatDate(note.created_at)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No notes found.</p>
        )}
      </section>
      <NoteDetailDrawer
        openDetail={openDetail}
        setDetailOpen={setDetailOpen}
        note={selectedNote}
      />
    </>
  );
};

export default NoteList