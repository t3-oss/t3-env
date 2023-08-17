"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/cn";
import { Icons } from "@/components/icons";
import { useSelectedLayoutSegment } from "next/navigation";

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
}

export function MainNav(props: { items: NavItem[] }) {
  const segment = useSelectedLayoutSegment();

  const isActive = (href: string) => {
    if (!segment) return false;
    return href.startsWith(`/${segment}`);
  };

  return (
    <nav className="hidden md:flex md:items-center md:space-x-6">
      {props.items?.map(
        (item, index) =>
          item.href && (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-foreground/60 text-sm font-medium transition-colors hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background rounded-md",
                item.disabled && "cursor-not-allowed opacity-80",
                isActive(item.href) && "text-foreground"
              )}
            >
              {item.title}
            </Link>
          )
      )}
    </nav>
  );
}
