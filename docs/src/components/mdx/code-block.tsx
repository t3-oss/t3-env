"use client";

import { useRef, useState } from "react";
import { CheckCheck, Copy } from "lucide-react";
import { Icons } from "../icons";
import { cn } from "@/lib/cn";

export type CodeblockProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLPreElement>,
  HTMLPreElement
> & {
  /** set by `rehype-pretty-code` */
  "data-language"?: string;
  /** set by `rehype-pretty-code` */
  "data-theme"?: string;
};

export function Codeblock(props: CodeblockProps) {
  const { children, ...rest } = props;
  const language = props["data-language"] as string;
  const theme = props["data-theme"] as string;
  const Icon = {
    js: Icons.javascript,
    ts: Icons.typescript,
    vue: Icons.vue,
    bash: Icons.bash,
  }[language];

  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  return (
    <>
      {Icon && (
        <Icon
          data-language-icon
          data-theme={theme}
          className="absolute left-4 top-4 z-20 h-5 w-5 text-foreground"
        />
      )}
      <button
        aria-label="Copy to Clipboard"
        data-theme={theme}
        onClick={() => {
          if (typeof window === "undefined" || !ref.current) return;
          setCopied(true);
          void window.navigator.clipboard.writeText(ref.current.innerText);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="absolute right-2 top-[10px] z-20 h-8 w-8 cursor-pointer rounded text-muted-foreground hover:bg-muted"
      >
        <div className="relative p-1 w-full h-full">
          <Copy
            className={cn(
              "absolute h-6 w-6 p-0 transition-all",
              copied && "scale-0"
            )}
          />
          <CheckCheck
            className={cn(
              "absolute h-6 w-6 scale-0 p-0 transition-all",
              copied && "scale-100"
            )}
          />
        </div>
      </button>
      <pre
        ref={ref}
        className="relative my-4 overflow-x-auto rounded-lg border bg-muted p-4 font-mono text-sm font-semibold text-muted-foreground"
        {...rest}
      >
        {children}
      </pre>
    </>
  );
}
