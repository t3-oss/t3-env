"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import { NavItem } from "./main-nav";

export interface NestedNavItem extends NavItem {
  items: NestedNavItem[];
}

export function DocsSidebarNav(props: { items: NestedNavItem[] }) {
  const pathname = usePathname();

  return props.items.length ? (
    <div className="w-full px-2">
      {props.items.map((item, index) => (
        <div key={index} className={cn("pb-6")}>
          <h4 className="mb-1 rounded-md px-3 py-1 text-sm font-semibold">
            {item.title}
          </h4>
          {item?.items?.length && (
            <DocsSidebarNavItems items={item.items} pathname={pathname} />
          )}
        </div>
      ))}
    </div>
  ) : null;
}

export function DocsSidebarNavItems(props: {
  items: NestedNavItem[];
  pathname: string | null;
}) {
  return props.items?.length ? (
    <div className="grid grid-flow-row auto-rows-max text-sm">
      {props.items.map((item, index) =>
        item.href ? (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "group flex w-full items-center rounded-md border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ringfocus-visible:outline-none focus-visible:ring-ring ring-offset-background h-9 px-3",
              item.disabled && "cursor-not-allowed opacity-60",
              {
                "font-medium bg-accent border-border text-accent-foreground":
                  props.pathname === item.href,
              }
            )}
            target={item.external ? "_blank" : ""}
            rel={item.external ? "noreferrer" : ""}
          >
            {item.title}
            {item.label && (
              <span className="ml-2 rounded-md bg-teal-100 px-1.5 py-0.5 text-xs no-underline group-hover:no-underline dark:bg-teal-600">
                {item.label}
              </span>
            )}
          </Link>
        ) : (
          <span
            key={index}
            className="flex w-full cursor-not-allowed items-center rounded-md p-2 text-muted-foreground hover:underline"
          >
            {item.title}
          </span>
        )
      )}
    </div>
  ) : null;
}
