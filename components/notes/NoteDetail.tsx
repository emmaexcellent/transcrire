"use client"
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { formatDate } from "@/lib/utils";
import { Share2 } from "lucide-react";

export function NoteDetailDrawer({
  openDetail,
  setDetailOpen,
  note,
}: {
  openDetail: boolean;
  setDetailOpen: React.Dispatch<React.SetStateAction<boolean>>;
  note: Note | null
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  
  if (isDesktop) {
    return (
      <Dialog open={openDetail} onOpenChange={setDetailOpen}>
        <DialogTitle className="p-0 m-0" />
        <DialogDescription className="p-0 m-0" />
        <DialogContent className="w-[95%] sm:max-w-[750px] !p-1 max-h-[85vh] overflow-hidden">
          <NoteDetail note={note} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={openDetail} onOpenChange={setDetailOpen}>
      <DrawerContent className="focus-visible:outline-none">
        <NoteDetail note={note} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function NoteDetail({ note }: { note: Note | null }) {
  const [copy, setCopy] = React.useState("");

  const handleCopy = () => {
    navigator.clipboard
      .writeText(note?.content || "")
      .then(() => {
        setCopy("Copied!");
        setTimeout(() => setCopy(""), 2000); // Clear success message after 2 seconds
      })
      .catch(() => {
        setCopy("Failed to copy.");
        setTimeout(() => setCopy(""), 2000);
      });
  };
  return (
    <section className="flex-grow p-8">
      {note ? (
        <>
          <div className="w-full flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold mb-2">{note.title}</h1>
              <p className="text-foreground/40 text-xs">
                {formatDate(note.created_at)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button size="sm" onClick={handleCopy}>
                {copy ? "Copied!" : "Copy"}
              </Button>
              <Button size="icon" variant="outline">
                <Share2 />
              </Button>
            </div>
          </div>

          <div className="border rounded-lg shadow p-3 my-5 bg-primary/5 h-[400px] overflow-y-auto">
            <p
              dangerouslySetInnerHTML={{
                __html:
                  note && note.content
                    ? note.content.replaceAll("-", "<br><br>- ")
                    : "",
              }}
              className="text-sm font-mono leading-relaxed -mt-10 pb-3"
            />
          </div>
        </>
      ) : (
        <p className="text-gray-500">Note not found.</p>
      )}
    </section>
  );
}
