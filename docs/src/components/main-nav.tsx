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
  const segment = useSelectedLayoutSegment() ?? "/";

  return (
    <div className="flex gap-6 md:gap-10">
      {props.items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {props.items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "text-foreground/60 text-sm font-medium transition-colors hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background rounded-sm",
                    item.disabled && "cursor-not-allowed opacity-80",
                    item.href.startsWith(`/${segment}`) && "text-foreground"
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}
    </div>
  );
}
