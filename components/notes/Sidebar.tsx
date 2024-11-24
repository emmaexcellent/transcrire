"use client"
import React from "react";
import Link from "next/link";
import { Mic, Notebook } from "lucide-react";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const path = usePathname()
  return (
    <aside className="hidden lg:flex lg:w-72 lg:flex-col min-h-screen bg-card flex-shrink-0">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r px-6">
        {/* Navigation Section */}
        <nav className="flex flex-1 flex-col my-10">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <Link
                className={`text-foreground/60 group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 hover:bg-primary/30 ${
                  path === "/notes/new" && "bg-primary/30 text-foreground/80"
                }`}
                href="/notes/new"
              >
                <Mic className="text-foreground/50" />
                New Note
              </Link>
            </li>
            <li>
              <Link
                className={`text-foreground/60 group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 hover:bg-primary/30 ${
                  path === "/notes" && "bg-primary/30 text-foreground/80"
                }`}
                href="/notes"
              >
                <Notebook className="text-foreground/50" />
                Notes
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
