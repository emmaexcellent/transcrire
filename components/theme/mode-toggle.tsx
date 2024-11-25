"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

const ModeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="fixed bottom-10 left-5"
    >
      {/* Sun Icon for Light Mode */}
      <Sun className="h-[1.2rem] w-[1.2rem] transition-all dark:opacity-0 dark:rotate-90 dark:scale-0" />
      {/* Moon Icon for Dark Mode */}
      <Moon className="absolute h-[1.2rem] w-[1.2rem] transition-all opacity-0 rotate-90 scale-0 dark:opacity-100 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default ModeToggle
