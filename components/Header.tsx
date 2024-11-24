"use client"
import React, { useEffect, useState } from 'react'
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
import { EllipsisVertical, LogOut } from 'lucide-react';
import Logo from './Logo';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';


const navLinks = [
  {
    title: "Features",
    href: "/#features",
  },
  {
    title: "How It Works",
    href: "/#how-it-works",
  },
  {
    title: "Tools",
    href: "#tools",
  },
];

const Header = () => {  
  const [ sheetOpen, setSheetOpen ] = useState(false);
  const { isLoggedIn } = useAuth();
  const router = useRouter()
  
  const logOut = async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
    router.push("/login")
  }

  return (
    <header className="w-full p-5 bg-card sticky top-0 z-50 shadow">
      <nav className="w-full max-w-6xl mx-auto flex items-center justify-between">
        <Logo />
        <ul className="lg:flex items-center gap-8 hidden">
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
          {isLoggedIn ? (
            // Show logout icon if logged in
            <Button
              variant="ghost"
              onClick={logOut}
              className="text-foreground/70 hover:text-primary"
              aria-label="Log out"
            >
              <LogOut size={24} />
              <span className="hidden md:block">Logout</span>
            </Button>
          ) : (
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          )}
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