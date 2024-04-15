import { NextjsIcon, NuxtIcon } from "@/components/icons";
import { cn } from "@/utils/cn";
import { cva } from "class-variance-authority";
import { LibraryIcon } from "lucide-react";
import { Link } from "next-view-transitions";
import type { LinkProps } from "next/link";

const cardIconVariants = cva(
  "mb-2 size-9 rounded-lg border bg-gradient-to-b from-primary/20 p-1 shadow-sm shadow-primary/50",
);

function Item(
  props: LinkProps & { children: React.ReactNode },
): React.ReactElement {
  return (
    <Link
      {...props}
      className="rounded-2xl border border-transparent p-6 shadow-primary/30 transition-all hover:shadow-primary/50 no-underline"
      style={{
        backgroundImage:
          "linear-gradient(to right bottom, hsl(var(--background)) 40%, hsl(var(--accent)), hsl(var(--background)) 80%)," +
          "linear-gradient(to right bottom, black, rgb(200,200,200), black)",
        backgroundOrigin: "border-box",
        boxShadow: "inset 0px 6px 14px 4px var(--tw-shadow-color)",
        backgroundClip: "padding-box, border-box",
      }}
    >
      {props.children}
    </Link>
  );
}

export const Items = () => (
  <div className="mt-16 grid grid-cols-1 gap-4 text-left md:grid-cols-2 lg:grid-cols-3">
    <Item href="/docs/ui">
      <div className={cn(cardIconVariants())}>
        <LibraryIcon className="size-full" />
      </div>
      <h2 className="mb-2 text-lg font-semibold">Env Core</h2>
      <p className="text-sm text-muted-foreground">
        Get started with a framework agnostic core.
      </p>
    </Item>
    <Item href="/docs/headless">
      <div className={cn(cardIconVariants())}>
        <NextjsIcon className="size-full" />
      </div>
      <h2 className="mb-2 text-lg font-semibold">Env Next.js</h2>
      <p className="text-sm text-muted-foreground">
        Using Next.js? Get started with a preconfigured library.
      </p>
    </Item>
    <Item href="/docs/headless">
      <div className={cn(cardIconVariants())}>
        <NuxtIcon className="size-full" />
      </div>
      <h2 className="mb-2 text-lg font-semibold">Env Nuxt</h2>
      <p className="text-sm text-muted-foreground">
        Using Nuxt? Get started with a preconfigured library.
      </p>
    </Item>
  </div>
);
