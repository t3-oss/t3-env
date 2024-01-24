"use client";

import { useTheme } from "@juliusmarminge/next-themes";
import * as React from "react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Icons.sun className="rotate-0 scale-100 w-6 h-6 transition-all dark:-rotate-90 dark:scale-0" />
      <Icons.moon className="absolute rotate-90 w-6 h-6 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
