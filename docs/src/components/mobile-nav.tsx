"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "./ui/button";
import { Icons } from "./icons";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";

import { ThemeToggle } from "./theme-toggle";
import { NavItem } from "./main-nav";
import { siteConfig } from "@/app/site-config";
import { NestedNavItem } from "./sidebar";
import { PopoverClose } from "@radix-ui/react-popover";

export function MobileDropdown(props: {
  items: { main: NavItem[]; docs: NestedNavItem[] };
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 space-x-2 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Icons.logo className="h-6 w-6" />
          <span className="font-bold text-lg">{siteConfig.name}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-40 mt-2 h-[calc(100vh-4rem)] w-screen animate-none rounded-none border-none transition-transform">
        <ScrollArea className="py-8">
          <div>
            {props.items.main.map((item) => (
              <PopoverClose asChild key={item.href}>
                <Link
                  href={item.href ?? ""}
                  className="flex py-1 text-base font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.title}
                </Link>
              </PopoverClose>
            ))}
          </div>
          <div>
            {props.items.docs.map((item, index) => (
              <div key={index} className="flex flex-col space-y-3 pt-6">
                <h4 className="font-bold">{item.title}</h4>
                {item?.items?.length &&
                  item.items.map((item) => (
                    <PopoverClose asChild key={item.href}>
                      {item.href ? (
                        <Link
                          href={item.href}
                          className="flex py-1 text-base font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                          {item.title}
                        </Link>
                      ) : (
                        item.title
                      )}
                    </PopoverClose>
                  ))}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="border-t pt-4">
          <ThemeToggle />
        </div>
      </PopoverContent>
    </Popover>
  );
}
