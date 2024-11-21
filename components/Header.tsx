"use client"
import React, { useState } from 'react'
import Link from "next/link"
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { EllipsisVertical } from 'lucide-react';



const navLinks = [
  {
    title: "Features",
    href: "#features",
  },
  {
    title: "How It Works",
    href: "#how-it-works",
  },
  {
    title: "Pricing",
    href: "#pricing",
  },
  {
    title: "Tools",
    href: "#tools",
  },
  {
    title: "Blogs",
    href: "#blogs",
  },
];

const Header = () => {
  const [ sheetOpen, setSheetOpen ] = useState(false);

  return (
    <header className="w-full p-5 bg-card sticky top-0 z-50 shadow">
      <nav className="w-full max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/">
          <span className="font-semibold text-primary text-2xl">
            Transcrire
          </span>
        </Link>
        <ul className="lg:flex items-center gap-5 hidden">
          {navLinks.map((nav, index) => (
            <li
              key={index}
              className="text-sm font-medium text-foreground/70 hover:text-primary"
            >
              <Link href={nav.href}>{nav.title}</Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-5 lg:gap-10">
          <Button className="">Sign Up</Button>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger className="lg:hidden">
              <EllipsisVertical />
            </SheetTrigger>
            <SheetContent className="lg:hidden">
              <SheetHeader>
                <SheetTitle />
                <SheetDescription />
              </SheetHeader>
              <ul className="flex flex-col items-center gap-5 mt-10">
                {navLinks.map((nav, index) => (
                  <li
                    key={index}
                    className="text-sm font-medium text-foreground/70 hover:text-primary"
                  >
                    <Link href={nav.href}>{nav.title}</Link>
                  </li>
                ))}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

export default Header