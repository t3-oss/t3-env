"use client";

import { useRef, useState, type DetailedHTMLProps } from "react";
import { CheckCheck, Copy } from "lucide-react";
import { Icons } from "../icons";
import { cn } from "@/lib/cn";

export function Codeblock(
  props: DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>
) {
  const { children, ...rest } = props;
  const language = props["data-language" as keyof typeof props] as string;
  const Icon = {
    js: Icons.javascript,
    ts: Icons.typescript,
    bash: Icons.bash,
  }[language];

  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  return (
    <>
      {Icon && (
        <Icon
          data-language-icon
          className="absolute left-4 top-4 z-20 hidden h-5 w-5 text-foreground"
        />
      )}
      <div
        onClick={() => {
          if (typeof window === "undefined" || !ref.current) return;
          setCopied(true);
          void window.navigator.clipboard.writeText(ref.current.innerText);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="absolute right-2 top-[10px] z-20 h-8 w-8 cursor-pointer rounded p-1 text-muted-foreground hover:bg-muted"
      >
        <Copy
          className={cn(
            "absolute h-6 w-6 p-0 transition-all",
            copied && "scale-0"
          )}
        />
        <CheckCheck
          className={cn(
            "absolute h-6 w-6 scale-0 p-1 transition-all",
            copied && "scale-100"
          )}
        />
      </div>
      <pre
        ref={ref}
        className="relative my-4 overflow-x-scroll rounded-lg border bg-muted p-4 font-mono text-sm font-semibold text-muted-foreground"
        {...rest}
      >
        {children}
      </pre>
    </>
  );
}
